import { useState, useEffect, useRef, useCallback } from "react";
import "./notes-panel.css";

/* ── Icons ─────────────────────────────────────────────────────────────── */

const TrashIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3 6 5 6 21 6"/>
    <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
    <path d="M10 11v6M14 11v6"/>
    <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
  </svg>
);

const CollapseIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
    <polyline points="15 18 9 12 15 6"/>
  </svg>
);

const ExpandIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
    <polyline points="9 18 15 12 9 6"/>
  </svg>
);

const NoteIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
    <polyline points="14 2 14 8 20 8"/>
    <line x1="16" y1="13" x2="8" y2="13"/>
    <line x1="16" y1="17" x2="8" y2="17"/>
  </svg>
);

const CheckIcon = () => (
  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
);

const SaveIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/>
    <polyline points="17 21 17 13 7 13 7 21"/>
    <polyline points="7 3 7 8 15 8"/>
  </svg>
);

/* ── Clear Confirm Modal ────────────────────────────────────────────────── */

const ClearConfirmModal = ({ onConfirm, onCancel }) => {
  useEffect(() => {
    const h = (e) => {
      if (e.key === "Escape" || e.key === "Enter") {
        e.stopImmediatePropagation();
        if (e.key === "Escape") onCancel();
        if (e.key === "Enter")  onConfirm();
      }
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [onConfirm, onCancel]);

  return (
    <div className="notes-confirm-overlay" onClick={onCancel}>
      <div className="notes-confirm" onClick={(e) => e.stopPropagation()}>
        <p className="notes-confirm__title">Clear all notes?</p>
        <p className="notes-confirm__sub">This cannot be undone.</p>
        <div className="notes-confirm__actions">
          <button className="notes-confirm__btn notes-confirm__btn--cancel"  onClick={onCancel}>Cancel</button>
          <button className="notes-confirm__btn notes-confirm__btn--confirm" onClick={onConfirm}>Clear</button>
        </div>
      </div>
    </div>
  );
};

/* ── Constants ─────────────────────────────────────────────────────────── */

const FONT_STEPS       = [13, 14, 15, 16, 17, 18, 20];
const DEFAULT_FONT_IDX = 2;
const MIN_WIDTH        = 280;
const MAX_WIDTH_RATIO  = 0.5;

const MATH_SYMBOLS = [
  { sym: "√",  label: "Square root"      },
  { sym: "²",  label: "Squared"          },
  { sym: "³",  label: "Cubed"            },
  { sym: "π",  label: "Pi"               },
  { sym: "∞",  label: "Infinity"         },
  { sym: "≤",  label: "Less or equal"    },
  { sym: "≥",  label: "Greater or equal" },
  { sym: "≠",  label: "Not equal"        },
  { sym: "×",  label: "Multiply"         },
  { sym: "÷",  label: "Divide"           },
  { sym: "∑",  label: "Sum (Sigma)"      },
  { sym: "Δ",  label: "Delta"            },
];

const HIGHLIGHT_COLORS = [
  { id: "aqua",   color: "#0e7490", label: "Aqua"   },
  { id: "red",    color: "#9f1239", label: "Red"     },
  { id: "green",  color: "#166534", label: "Green"   },
  { id: "yellow", color: "#854d0e", label: "Yellow"  },
  { id: "purple", color: "#581c87", label: "Purple"  },
];

/* ── Storage helpers ────────────────────────────────────────────────────── */

const getStorageKey  = (id) => `axioma_notes_${id || "temp"}`;
const getCollapseKey = (id) => `axioma_notes_col_${id || "temp"}`;
const getFontKey     = (id) => `axioma_notes_font_${id || "temp"}`;

const lsGet    = (k)    => { try { return localStorage.getItem(k);  } catch { return null; } };
const lsSet    = (k, v) => { try { localStorage.setItem(k, v);      } catch { /* */ } };
const lsRemove = (k)    => { try { localStorage.removeItem(k);      } catch { /* */ } };

/* ── DOM helpers ────────────────────────────────────────────────────────── */

const getBlockAncestor = (node, root) => {
  const BLOCK = new Set(["DIV","P","H1","H2","H3","H4","H5","H6","LI","BLOCKQUOTE","PRE"]);
  let cur = node;
  while (cur && cur !== root) {
    if (cur.nodeType === 1 && BLOCK.has(cur.tagName)) return cur;
    cur = cur.parentNode;
  }
  return null;
};

const getTopLevelChild = (node, root) => {
  let cur = node;
  while (cur && cur.parentNode !== root) cur = cur.parentNode;
  return cur !== root ? cur : null;
};

/* ══════════════════════════════════════════════════════════════════════════
   NotesPanel
   Props:
     sessionId      {string}    localStorage namespace key (default "")
     initialContent {string}    HTML loaded from Firestore before mount
     onSave         {Function}  Called with (html) only when user clicks Save button
     mode           {string}    "floating" (default) | "embedded"
══════════════════════════════════════════════════════════════════════════ */

const NotesPanel = ({
  sessionId      = "",
  initialContent = undefined,
  onSave         = null,
  mode           = "floating",
}) => {
  const isEmbedded = mode === "embedded";

  const storageKey  = getStorageKey(sessionId);
  const collapseKey = getCollapseKey(sessionId);
  const fontKey     = getFontKey(sessionId);

  const resolveInitial = () => {
    if (initialContent !== undefined) return initialContent;
    return lsGet(storageKey) ?? "";
  };

  const [htmlValue,   setHtmlValue]   = useState(resolveInitial);
  const [collapsed,   setCollapsed]   = useState(() =>
    isEmbedded ? false : lsGet(collapseKey) === "true"
  );
  const [fontIdx, setFontIdx] = useState(() => {
    const saved = parseInt(lsGet(fontKey), 10);
    return isNaN(saved) ? DEFAULT_FONT_IDX : Math.max(0, Math.min(FONT_STEPS.length - 1, saved));
  });
  const [showClear,     setShowClear]     = useState(false);
  const [panelWidth,    setPanelWidth]    = useState(300);
  const [dragging,      setDragging]      = useState(false);
  const [activeHeading, setActiveHeading] = useState(null);
  // "idle" | "saving" | "saved"
  const [saveStatus,    setSaveStatus]    = useState("idle");
  // true when content differs from last profile save
  const [isDirty,       setIsDirty]       = useState(false);

  const lsTimer         = useRef(null);
  const saveStatusTimer = useRef(null);
  const dragStartX      = useRef(0);
  const dragStartW      = useRef(0);
  const editorRef       = useRef(null);
  const lastHtml        = useRef(htmlValue);
  const savedRange      = useRef(null);

  /* ── Seed editor on expand ── */
  useEffect(() => {
    const el = editorRef.current;
    if (!el) return;
    if (el.innerHTML !== lastHtml.current) el.innerHTML = lastHtml.current;
  }, [collapsed]);

  /* ── Input handler: writes to localStorage only ── */
  const handleInput = useCallback(() => {
    const el = editorRef.current;
    if (!el) return;
    const html = el.innerHTML;
    setHtmlValue(html);
    lastHtml.current = html;
    setIsDirty(true);
    clearTimeout(lsTimer.current);
    lsTimer.current = setTimeout(() => lsSet(storageKey, html), 600);
  }, [storageKey]);

  /* ── Manual save to Firestore ── */
  const handleSaveToProfile = useCallback(async () => {
    if (!onSave) return;
    setSaveStatus("saving");
    try {
      await onSave(lastHtml.current);
      setIsDirty(false);
      setSaveStatus("saved");
      clearTimeout(saveStatusTimer.current);
      saveStatusTimer.current = setTimeout(() => setSaveStatus("idle"), 3000);
    } catch {
      setSaveStatus("idle");
    }
  }, [onSave]);

  /* ── Persist collapse + font ── */
  useEffect(() => {
    if (!isEmbedded) lsSet(collapseKey, collapsed);
  }, [collapsed, collapseKey, isEmbedded]);
  useEffect(() => { lsSet(fontKey, fontIdx); }, [fontIdx, fontKey]);

  /* ── Drag resize — floating only ── */
  const onDragStart = useCallback((e) => {
    if (isEmbedded || window.innerWidth < 1024) return;
    e.preventDefault();
    dragStartX.current = e.clientX;
    dragStartW.current = panelWidth;
    setDragging(true);
  }, [isEmbedded, panelWidth]);

  useEffect(() => {
    if (!dragging) return;
    const onMove = (e) => {
      const delta = dragStartX.current - e.clientX;
      const maxW  = Math.floor(window.innerWidth * MAX_WIDTH_RATIO);
      setPanelWidth(Math.min(maxW, Math.max(MIN_WIDTH, dragStartW.current + delta)));
    };
    const onUp = () => setDragging(false);
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup",   onUp);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup",   onUp);
    };
  }, [dragging]);

  /* ── Clear ── */
  const handleClearConfirm = () => {
    const el = editorRef.current;
    if (el) el.innerHTML = "";
    setHtmlValue("");
    lastHtml.current = "";
    lsRemove(storageKey);
    setIsDirty(true);
    setShowClear(false);
  };

  /* ── Selection helpers ── */
  const saveSelection = () => {
    const sel = window.getSelection();
    if (sel?.rangeCount > 0) savedRange.current = sel.getRangeAt(0).cloneRange();
  };
  const restoreSelection = () => {
    const sel = window.getSelection();
    if (sel && savedRange.current) { sel.removeAllRanges(); sel.addRange(savedRange.current); }
  };

  /* ── Highlight ── */
  const applyHighlight = (color) => {
    const range = savedRange.current;
    if (!range || range.collapsed) return;
    const el = editorRef.current;
    if (!el || !el.contains(range.commonAncestorContainer)) return;
    const sel = window.getSelection();
    sel.removeAllRanges(); sel.addRange(range);
    const span = document.createElement("span");
    span.style.cssText = `background:${color};border-radius:2px;padding:0 2px;color:rgba(255,255,255,0.92)`;
    try { range.surroundContents(span); }
    catch {
      const frag = range.extractContents();
      span.appendChild(frag); range.insertNode(span);
    }
    const reset = document.createTextNode("\u200B");
    span.parentNode.insertBefore(reset, span.nextSibling);
    const after = document.createRange();
    after.setStart(reset, 1); after.collapse(true);
    sel.removeAllRanges(); sel.addRange(after);
    savedRange.current = after.cloneRange();
    handleInput();
  };

  /* ── Heading ── */
  const applyHeading = (tag) => {
    const el   = editorRef.current;
    const next = activeHeading === tag ? null : tag;
    setActiveHeading(next);
    if (!el) return;
    el.focus({ preventScroll: true });
    restoreSelection();
    const sel = window.getSelection();
    if (!sel || sel.rangeCount === 0) return;
    const anchor = sel.getRangeAt(0).startContainer;
    let block = getBlockAncestor(anchor, el) || getTopLevelChild(anchor, el);
    if (!block || block === el) {
      const nb = document.createElement(next ? next.toUpperCase() : "DIV");
      nb.appendChild(document.createElement("br"));
      el.innerHTML = ""; el.appendChild(nb);
      const r = document.createRange(); r.setStart(nb, 0); r.collapse(true);
      sel.removeAllRanges(); sel.addRange(r); savedRange.current = r.cloneRange();
      handleInput(); return;
    }
    if (block.textContent.trim() !== "") return;
    const rep = document.createElement(next ? next.toUpperCase() : "DIV");
    rep.appendChild(document.createElement("br"));
    block.parentNode.replaceChild(rep, block);
    const r = document.createRange(); r.setStart(rep, 0); r.collapse(true);
    sel.removeAllRanges(); sel.addRange(r); savedRange.current = r.cloneRange();
    handleInput();
  };

  /* ── Editor keydown ── */
  const handleEditorKeyDown = (e) => {
    e.stopPropagation();
    if (e.key !== "Enter") return;
    e.preventDefault();
    const edEl = editorRef.current;
    const sel  = window.getSelection();
    if (!sel || sel.rangeCount === 0) return;
    const anchor = sel.getRangeAt(0).startContainer;
    const block  = getBlockAncestor(anchor, edEl) || getTopLevelChild(anchor, edEl);
    const nb     = document.createElement(activeHeading ? activeHeading.toUpperCase() : "DIV");
    nb.appendChild(document.createElement("br"));
    if (block && block !== edEl) block.parentNode.insertBefore(nb, block.nextSibling);
    else edEl.appendChild(nb);
    const r = document.createRange(); r.setStart(nb, 0); r.collapse(true);
    sel.removeAllRanges(); sel.addRange(r); savedRange.current = r.cloneRange();
    handleInput();
  };

  /* ── Insert symbol ── */
  const insertSymbol = (sym) => {
    const el = editorRef.current;
    if (!el) return;
    el.focus({ preventScroll: true });
    restoreSelection();
    const sel = window.getSelection();
    if (!sel || sel.rangeCount === 0) { el.innerHTML += sym; handleInput(); return; }
    const range = sel.getRangeAt(0);
    range.deleteContents();
    const tn = document.createTextNode(sym);
    range.insertNode(tn); range.setStartAfter(tn); range.setEndAfter(tn);
    sel.removeAllRanges(); sel.addRange(range);
    savedRange.current = range.cloneRange();
    handleInput();
  };

  const fontSize = FONT_STEPS[fontIdx];

  /* ─────────────────────────────────────────────────────────────────────────
     FLOATING COLLAPSED PILL
  ───────────────────────────────────────────────────────────────────────── */
  if (!isEmbedded && collapsed) {
    return (
      <div className="notes-collapsed">
        <button className="notes-collapsed__btn" onClick={() => setCollapsed(false)} title="Open notes">
          <NoteIcon />
          <span className="notes-collapsed__label">Notes</span>
          {isDirty && <span className="notes-collapsed__dot" />}
          <ExpandIcon />
        </button>
      </div>
    );
  }

  /* ─────────────────────────────────────────────────────────────────────────
     PANEL
  ───────────────────────────────────────────────────────────────────────── */

  const panelClass = [
    "notes-panel",
    isEmbedded ? "notes-panel--embedded" : "notes-panel--floating",
    dragging   ? "notes-panel--dragging" : "",
  ].filter(Boolean).join(" ");

  return (
    <>
      {showClear && (
        <ClearConfirmModal
          onConfirm={handleClearConfirm}
          onCancel={() => setShowClear(false)}
        />
      )}

      {!isEmbedded && (
        <div className="notes-backdrop" onClick={() => setCollapsed(true)} />
      )}

      <aside className={panelClass} style={isEmbedded ? {} : { width: panelWidth }}>

        {/* ── Header ── */}
        <div className="notes-panel__header">
          <div className="notes-panel__header-left">
            <span className="notes-panel__header-icon"><NoteIcon /></span>
            <span className="notes-panel__eyebrow">Study Notes</span>
          </div>
          <div className="notes-panel__header-actions">
            <div className="notes-font-ctrl">
              <button
                className="notes-font-ctrl__btn"
                onClick={() => setFontIdx(i => Math.max(0, i - 1))}
                disabled={fontIdx === 0}
                title="Decrease font size"
              >A−</button>
              <span className="notes-font-ctrl__val">{fontSize}</span>
              <button
                className="notes-font-ctrl__btn"
                onClick={() => setFontIdx(i => Math.min(FONT_STEPS.length - 1, i + 1))}
                disabled={fontIdx === FONT_STEPS.length - 1}
                title="Increase font size"
              >A+</button>
            </div>
            <button
              className="notes-icon-btn"
              onClick={() => setShowClear(true)}
              disabled={!htmlValue}
              title="Clear notes"
            ><TrashIcon /></button>
            {!isEmbedded && (
              <button className="notes-icon-btn" onClick={() => setCollapsed(true)} title="Close">
                <CollapseIcon />
              </button>
            )}
          </div>
        </div>

        {/* ── Formatting toolbar ── */}
        <div className="notes-fmt-bar">
          <div className="notes-fmt-bar__group">
            {["h1","h2","h3"].map((tag) => (
              <button
                key={tag}
                className={`notes-fmt-bar__btn${activeHeading === tag ? " notes-fmt-bar__btn--active" : ""}`}
                onMouseDown={(e) => { e.preventDefault(); saveSelection(); }}
                onClick={() => applyHeading(tag)}
                title={`Heading ${tag.slice(1)}`}
              >{tag.toUpperCase()}</button>
            ))}
          </div>
          <div className="notes-fmt-bar__divider" />
          <div className="notes-fmt-bar__group">
            {HIGHLIGHT_COLORS.map(({ id, color, label }) => (
              <button
                key={id}
                className="notes-fmt-bar__swatch"
                style={{ "--swatch-color": color }}
                onMouseDown={(e) => { e.preventDefault(); saveSelection(); }}
                onClick={() => applyHighlight(color)}
                title={`Highlight: ${label}`}
                aria-label={`Highlight ${label}`}
              />
            ))}
          </div>
        </div>

        {/* ── Math symbols ── */}
        <div className="notes-symbols">
          {MATH_SYMBOLS.map(({ sym, label }) => (
            <button
              key={sym}
              className="notes-symbols__btn"
              onMouseDown={(e) => { e.preventDefault(); saveSelection(); }}
              onClick={() => insertSymbol(sym)}
              title={label}
              tabIndex={-1}
            >{sym}</button>
          ))}
        </div>

        {/* ── Editor ── */}
        <div className="notes-panel__body">
          <div
            ref={editorRef}
            className="notes-editor"
            contentEditable
            suppressContentEditableWarning
            onInput={handleInput}
            onKeyDown={handleEditorKeyDown}
            onBlur={saveSelection}
            onKeyUp={saveSelection}
            onMouseUp={saveSelection}
            data-placeholder="Write your notes here…"
            style={{ fontSize }}
            spellCheck={false}
          />
        </div>

        {/* ── Save footer (only when onSave provided) ── */}
        {onSave && (
          <div className="notes-panel__footer">
            <button
              className={[
                "notes-save-btn",
                saveStatus === "saved"  ? "notes-save-btn--saved"  : "",
                saveStatus === "saving" ? "notes-save-btn--saving" : "",
              ].filter(Boolean).join(" ")}
              onClick={handleSaveToProfile}
              disabled={saveStatus === "saving" || !isDirty}
            >
              {saveStatus === "saving" ? (
                <><span className="notes-save-btn__spinner" />Saving…</>
              ) : saveStatus === "saved" ? (
                <><CheckIcon />Saved to profile</>
              ) : (
                <><SaveIcon />Save to profile</>
              )}
            </button>
            {isDirty && saveStatus === "idle" && (
              <span className="notes-unsaved-hint">Unsaved changes</span>
            )}
          </div>
        )}

        {/* Resize handle — floating only */}
        {!isEmbedded && (
          <div className="notes-resize-handle" onMouseDown={onDragStart} title="Drag to resize" />
        )}
      </aside>
    </>
  );
};

export default NotesPanel;