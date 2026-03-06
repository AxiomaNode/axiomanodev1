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
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
    <polyline points="14 2 14 8 20 8"/>
    <line x1="16" y1="13" x2="8" y2="13"/>
    <line x1="16" y1="17" x2="8" y2="17"/>
    <polyline points="10 9 9 9 8 9"/>
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
const DEFAULT_FONT_IDX = 2; // 15px
const MIN_WIDTH        = 280;
const MAX_WIDTH_RATIO  = 0.5;

/* ── Math symbols ───────────────────────────────────────────────────────── */

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

/* ── Highlight colors ───────────────────────────────────────────────────── */

const HIGHLIGHT_COLORS = [
  { id: "aqua",   color: "#0e7490", label: "Aqua"   },
  { id: "red",    color: "#9f1239", label: "Red"     },
  { id: "green",  color: "#166534", label: "Green"   },
  { id: "yellow", color: "#854d0e", label: "Yellow"  },
  { id: "purple", color: "#581c87", label: "Purple"  },
];

/* ── Heading tag set ────────────────────────────────────────────────────── */

const HEADING_TAGS = new Set(["H1", "H2", "H3"]);

/* ── Storage key helpers ────────────────────────────────────────────────── */

const getStorageKey  = (sessionId) => `axioma_notes_${sessionId || "temp"}`;
const getCollapseKey = (sessionId) => `axioma_notes_col_${sessionId || "temp"}`;
const getFontKey     = (sessionId) => `axioma_notes_font_${sessionId || "temp"}`;

/* ── localStorage safe helpers ─────────────────────────────────────────── */

const lsGet    = (key)        => { try { return localStorage.getItem(key); } catch { return null;  } };
const lsSet    = (key, value) => { try { localStorage.setItem(key, value); } catch { /* silent */  } };
const lsRemove = (key)        => { try { localStorage.removeItem(key);     } catch { /* silent */  } };

/* ── DOM helpers ────────────────────────────────────────────────────────── */

/**
 * Walk up the DOM from `node` until we reach `root` or a block-level element.
 * Returns the block ancestor, or null if we reach the root itself.
 */
const getBlockAncestor = (node, root) => {
  const BLOCK = new Set(["DIV","P","H1","H2","H3","H4","H5","H6","LI","BLOCKQUOTE","PRE"]);
  let cur = node;
  while (cur && cur !== root) {
    if (cur.nodeType === 1 && BLOCK.has(cur.tagName)) return cur;
    cur = cur.parentNode;
  }
  return null;
};

/**
 * Returns the node inside `root` that is a direct child of `root` and
 * contains `node`. Used to find the top-level block when getBlockAncestor
 * returns the root itself.
 */
const getTopLevelChild = (node, root) => {
  let cur = node;
  while (cur && cur.parentNode !== root) {
    cur = cur.parentNode;
  }
  return cur !== root ? cur : null;
};

/* ── NotesPanel ─────────────────────────────────────────────────────────── */

const NotesPanel = ({ sessionId = "" }) => {
  const storageKey  = getStorageKey(sessionId);
  const collapseKey = getCollapseKey(sessionId);
  const fontKey     = getFontKey(sessionId);

  const [htmlValue, setHtmlValue]   = useState(() => lsGet(storageKey) ?? "");
  const [collapsed, setCollapsed]   = useState(() => lsGet(collapseKey) === "true");
  const [fontIdx, setFontIdx]       = useState(() => {
    const saved = parseInt(lsGet(fontKey), 10);
    return isNaN(saved) ? DEFAULT_FONT_IDX : Math.max(0, Math.min(FONT_STEPS.length - 1, saved));
  });
  const [showClear, setShowClear]       = useState(false);
  const [panelWidth, setPanelWidth]     = useState(300);
  const [dragging, setDragging]         = useState(false);
  const [activeHeading, setActiveHeading] = useState(null); // null | "h1" | "h2" | "h3"

  const saveTimer     = useRef(null);
  const dragStartX    = useRef(0);
  const dragStartW    = useRef(0);
  const editorRef     = useRef(null);
  const lastSavedHtml = useRef(htmlValue);
  const savedRange    = useRef(null);

  /* ── Seed editor DOM on expand ── */
  useEffect(() => {
    const el = editorRef.current;
    if (!el) return;
    if (el.innerHTML !== lastSavedHtml.current) {
      el.innerHTML = lastSavedHtml.current;
    }
  }, [collapsed]);

  /* ── Sync innerHTML → state + localStorage ── */
  const handleInput = useCallback(() => {
    const el = editorRef.current;
    if (!el) return;
    const html = el.innerHTML;
    setHtmlValue(html);
    lastSavedHtml.current = html;
    clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => lsSet(storageKey, html), 800);
  }, [storageKey]);

  /* ── Persist collapse + font ── */
  useEffect(() => { lsSet(collapseKey, collapsed); }, [collapsed, collapseKey]);
  useEffect(() => { lsSet(fontKey, fontIdx); },      [fontIdx,    fontKey]);

  /* ── Resize drag — desktop only ── */
  const isDesktop = () => window.innerWidth >= 1024;

  const onDragStart = useCallback((e) => {
    if (!isDesktop()) return;
    e.preventDefault();
    dragStartX.current = e.clientX;
    dragStartW.current = panelWidth;
    setDragging(true);
  }, [panelWidth]);

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

  /* ── Mobile: keep editor visible when soft keyboard opens ── */
  useEffect(() => {
    if (collapsed) return;
    const el = editorRef.current;
    const vv = window.visualViewport;
    if (!el || !vv) return;
    const onVVResize = () => {
      if (window.innerWidth >= 768) return;
      if (document.activeElement !== el) return;
      const rect     = el.getBoundingClientRect();
      const overflow = rect.bottom - vv.height;
      if (overflow > 0) el.scrollTop += overflow + 12;
    };
    vv.addEventListener("resize", onVVResize);
    return () => vv.removeEventListener("resize", onVVResize);
  }, [collapsed]);

  /* ── Clear ── */
  const handleClearConfirm = () => {
    const el = editorRef.current;
    if (el) el.innerHTML = "";
    setHtmlValue("");
    lastSavedHtml.current = "";
    lsRemove(storageKey);
    setShowClear(false);
  };

  /* ── Selection helpers ── */
  const saveSelection = () => {
    const sel = window.getSelection();
    if (sel && sel.rangeCount > 0) {
      savedRange.current = sel.getRangeAt(0).cloneRange();
    }
  };

  const restoreSelection = () => {
    const sel = window.getSelection();
    if (sel && savedRange.current) {
      sel.removeAllRanges();
      sel.addRange(savedRange.current);
    }
  };

  /* ── Highlight — wrap selected text in a span with background-color ───────
     Uses Range API only. Never touches execCommand for color.
     Always collapses caret to AFTER the inserted span so no style bleeds
     into subsequent typing — this is guaranteed in both the normal path
     (surroundContents) and the cross-boundary fallback path.
  ── */
  const applyHighlight = (color) => {
    const range = savedRange.current;
    if (!range || range.collapsed) return; // nothing selected → no-op

    const el = editorRef.current;
    if (!el || !el.contains(range.commonAncestorContainer)) return;

    const sel = window.getSelection();
    sel.removeAllRanges();
    sel.addRange(range);

    const span = document.createElement("span");
    span.style.backgroundColor = color;
    span.style.borderRadius    = "2px";
    span.style.padding         = "0 2px";
    span.style.color           = "rgba(255,255,255,0.92)";

    try {
      range.surroundContents(span);
    } catch {
      const fragment = range.extractContents();
      span.appendChild(fragment);
      range.insertNode(span);
    }

    // Insert a plain unstyled text node immediately after the span.
    // This breaks the style inheritance chain — without it Chrome re-uses
    // the span's computed background-color for any text typed right after.
    const reset = document.createTextNode("\u200B"); // zero-width space
    span.parentNode.insertBefore(reset, span.nextSibling);

    // Place caret inside the reset node (after the zero-width char).
    const after = document.createRange();
    after.setStart(reset, 1);
    after.collapse(true);
    sel.removeAllRanges();
    sel.addRange(after);
    savedRange.current = after.cloneRange();

    handleInput();
  };

  /* ── Heading — toggle mode ──────────────────────────────────────────────
     Clicking H1/H2/H3 activates a heading mode stored in `activeHeading`.
     Clicking the same button again deactivates it (back to normal text).
     Clicking a different heading switches to that one.
     The mode is applied when Enter creates a new line, and when the user
     activates a heading while the current block is empty (wraps it immediately).
     Existing lines with content are never touched.
  ── */
  const applyHeading = (tag) => {
    const el = editorRef.current;

    // Toggle off if already active
    const next = activeHeading === tag ? null : tag;
    setActiveHeading(next);

    if (!el) return;
    el.focus({ preventScroll: true });
    restoreSelection();

    // If caret is on an empty block, convert it to the new heading type now
    // so the user sees the size change immediately before typing.
    const sel = window.getSelection();
    if (!sel || sel.rangeCount === 0) return;

    const anchorNode = sel.getRangeAt(0).startContainer;
    let block = getBlockAncestor(anchorNode, el) || getTopLevelChild(anchorNode, el);

    // Editor is completely empty — no block elements exist yet.
    // Create the first block directly inside the editor.
    if (!block || block === el) {
      const targetTag = next ? next.toUpperCase() : "DIV";
      const firstBlock = document.createElement(targetTag);
      firstBlock.appendChild(document.createElement("br"));
      // Clear any bare text nodes that might be in the editor root
      el.innerHTML = "";
      el.appendChild(firstBlock);
      const newRange = document.createRange();
      newRange.setStart(firstBlock, 0);
      newRange.collapse(true);
      sel.removeAllRanges();
      sel.addRange(newRange);
      savedRange.current = newRange.cloneRange();
      handleInput();
      return;
    }

    // Only convert if the block is empty (no visible text content)
    const isEmpty = block.textContent.trim() === "";
    if (!isEmpty) return; // block has content — leave it, mode applies to next new line

    const targetTag = next ? next.toUpperCase() : "DIV";
    const replacement = document.createElement(targetTag);
    // Keep a <br> so the block has height and is focusable
    replacement.appendChild(document.createElement("br"));
    block.parentNode.replaceChild(replacement, block);

    // Place caret inside the new block
    const newRange = document.createRange();
    newRange.setStart(replacement, 0);
    newRange.collapse(true);
    sel.removeAllRanges();
    sel.addRange(newRange);
    savedRange.current = newRange.cloneRange();

    handleInput();
  };

  /* ── Editor keydown — Enter handling + propagation isolation ───────────
     stopPropagation on every keydown so DiagnosticsPage / PracticePage
     global listeners never see keys typed inside the notes editor.

     Enter behaviour:
     - If activeHeading is set: create a new block of that heading type.
     - If caret is inside a heading but activeHeading was just turned off,
       the next Enter creates a plain div (mode already cleared).
     - Otherwise: let the browser handle it naturally (creates a new div/br).
  ── */
  const handleEditorKeyDown = (e) => {
    e.stopPropagation(); // always — keeps all keys inside the editor

    if (e.key !== "Enter") return;

    e.preventDefault(); // we handle Enter ourselves in all cases below

    const editorEl = editorRef.current;
    const sel      = window.getSelection();
    if (!sel || sel.rangeCount === 0) return;

    const range      = sel.getRangeAt(0);
    const anchorNode = range.startContainer;
    const block      = getBlockAncestor(anchorNode, editorEl) || getTopLevelChild(anchorNode, editorEl);

    // Determine what tag the new line should be
    // If activeHeading is set, new line inherits that heading.
    // If we're inside a heading but activeHeading is null, new line is plain div.
    const newTag = activeHeading ? activeHeading.toUpperCase() : "DIV";

    const newBlock = document.createElement(newTag);
    newBlock.appendChild(document.createElement("br"));

    if (block && block !== editorEl) {
      block.parentNode.insertBefore(newBlock, block.nextSibling);
    } else {
      editorEl.appendChild(newBlock);
    }

    const newRange = document.createRange();
    newRange.setStart(newBlock, 0);
    newRange.collapse(true);
    sel.removeAllRanges();
    sel.addRange(newRange);
    savedRange.current = newRange.cloneRange();

    handleInput();
  };

  /* ── Insert math symbol at current caret position ── */
  const insertSymbol = (sym) => {
    const el = editorRef.current;
    if (!el) return;
    el.focus({ preventScroll: true });
    restoreSelection();

    const sel = window.getSelection();
    if (!sel || sel.rangeCount === 0) {
      el.innerHTML += sym;
      handleInput();
      return;
    }

    const range    = sel.getRangeAt(0);
    range.deleteContents();
    const textNode = document.createTextNode(sym);
    range.insertNode(textNode);

    range.setStartAfter(textNode);
    range.setEndAfter(textNode);
    sel.removeAllRanges();
    sel.addRange(range);
    savedRange.current = range.cloneRange();

    handleInput();
  };

  const fontSize = FONT_STEPS[fontIdx];

  /* ── Collapsed state ── */
  if (collapsed) {
    return (
      <div className="notes-collapsed">
        <button className="notes-collapsed__btn" onClick={() => setCollapsed(false)} title="Open notes">
          <NoteIcon />
          <span className="notes-collapsed__label">Notes</span>
          <ExpandIcon />
        </button>
      </div>
    );
  }

  /* ── Expanded state ── */
  return (
    <>
      {showClear && (
        <ClearConfirmModal
          onConfirm={handleClearConfirm}
          onCancel={() => setShowClear(false)}
        />
      )}

      <div className="notes-backdrop" onClick={() => setCollapsed(true)} />

      <aside
        className={`notes-panel${dragging ? " notes-panel--dragging" : ""}`}
        style={{ width: panelWidth }}
      >
        {/* ── Header ── */}
        <div className="notes-panel__header">
          <div className="notes-panel__header-left">
            <span className="notes-panel__header-icon"><NoteIcon /></span>
            <span className="notes-panel__title">Notes</span>
          </div>
          <div className="notes-panel__header-actions">
            <div className="notes-font-ctrl" title="Font size">
              <button
                className="notes-font-ctrl__btn"
                onClick={() => setFontIdx(i => Math.max(0, i - 1))}
                disabled={fontIdx === 0}
                title="Decrease font size"
              >
                A<span className="notes-font-ctrl__minus">−</span>
              </button>
              <span className="notes-font-ctrl__val">{fontSize}</span>
              <button
                className="notes-font-ctrl__btn"
                onClick={() => setFontIdx(i => Math.min(FONT_STEPS.length - 1, i + 1))}
                disabled={fontIdx === FONT_STEPS.length - 1}
                title="Increase font size"
              >
                A<span className="notes-font-ctrl__plus">+</span>
              </button>
            </div>
            <button
              className="notes-icon-btn"
              onClick={() => setShowClear(true)}
              disabled={!htmlValue}
              title="Clear notes"
            >
              <TrashIcon />
            </button>
            <button
              className="notes-icon-btn"
              onClick={() => setCollapsed(true)}
              title="Close notes"
            >
              <CollapseIcon />
            </button>
          </div>
        </div>

        {/* ── Formatting toolbar ── */}
        <div className="notes-fmt-bar">
          <div className="notes-fmt-bar__group">
            {["h1", "h2", "h3"].map((tag) => (
              <button
                key={tag}
                className={`notes-fmt-bar__btn${activeHeading === tag ? " notes-fmt-bar__btn--active" : ""}`}
                onMouseDown={(e) => {
                  e.preventDefault(); // keep editor focus + selection alive
                  saveSelection();
                }}
                onClick={() => applyHeading(tag)}
                title={`Heading ${tag.slice(1)}`}
              >
                {tag.toUpperCase()}
              </button>
            ))}
          </div>

          <div className="notes-fmt-bar__divider" />

          <div className="notes-fmt-bar__group">
            {HIGHLIGHT_COLORS.map(({ id, color, label }) => (
              <button
                key={id}
                className="notes-fmt-bar__swatch"
                style={{ "--swatch-color": color }}
                onMouseDown={(e) => {
                  e.preventDefault(); // keep selection alive
                  saveSelection();
                }}
                onClick={() => applyHighlight(color)}
                title={`Highlight: ${label}`}
                aria-label={`Highlight ${label}`}
              />
            ))}
          </div>
        </div>

        {/* ── Math symbols toolbar ── */}
        <div className="notes-symbols">
          {MATH_SYMBOLS.map(({ sym, label }) => (
            <button
              key={sym}
              className="notes-symbols__btn"
              onMouseDown={(e) => {
                e.preventDefault(); // keep caret alive
                saveSelection();
              }}
              onClick={() => insertSymbol(sym)}
              title={label}
              tabIndex={-1}
            >
              {sym}
            </button>
          ))}
        </div>

        {/* ── Rich editor ── */}
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
            data-placeholder="Write your solution steps here…"
            style={{ fontSize }}
            spellCheck={false}
          />
        </div>

        {/* ── Resize handle ── */}
        <div
          className="notes-resize-handle"
          onMouseDown={onDragStart}
          title="Drag to resize"
        />
      </aside>
    </>
  );
};

export default NotesPanel;