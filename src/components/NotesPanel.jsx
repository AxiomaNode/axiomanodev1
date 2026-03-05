import { useState, useEffect, useRef, useCallback } from "react";
import { getTheoryNote, saveTheoryNote } from "../services/db";
import "./notes-panel.css";

/* ─────────────────────────────────────────────────────────────────────────
   NotesPanel
   ─────────────────────────────────────────────────────────────────────────
   Props:
     sessionId  {string}  Namespace for localStorage keys.        (required)
     uid        {string}  Firebase auth uid.                      (optional)
     topicId    {string}  Firestore topic id.                     (optional)

   Modes:
     • sessionId only  →  pure localStorage (Diagnostics, Practice).
     • sessionId + uid + topicId  →  localStorage + Firestore (Theory).
       Notes are loaded from Firestore on mount, autosaved after 1.5 s idle,
       and a small cloud status indicator appears in the header.
───────────────────────────────────────────────────────────────────────── */

/* ── Icons ── */
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
const CloudIcon = () => (
  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z"/>
  </svg>
);

/* ── Clear confirm modal ── */
const ClearConfirmModal = ({ onConfirm, onCancel }) => {
  useEffect(() => {
    const h = (e) => {
      if (e.key === "Escape") onCancel();
      if (e.key === "Enter")  onConfirm();
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

/* ── Constants ── */
const FONT_STEPS       = [13, 14, 15, 16, 17, 18, 20];
const DEFAULT_FONT_IDX = 2;   // 15 px
const MIN_WIDTH        = 280;
const MAX_WIDTH_RATIO  = 0.5;
const LS_DEBOUNCE_MS   = 800;
const FS_DEBOUNCE_MS   = 1500;

/* ── Math symbols ── */
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

/* ════════════════════════════════════════════════════════════════════════ */

const NotesPanel = ({ sessionId = "default", uid = null, topicId = null }) => {
  const firestoreMode = Boolean(uid && topicId);

  /* ── localStorage keys ── */
  const storageKey  = `axioma_notes_${sessionId}`;
  const collapseKey = `axioma_notes_col_${sessionId}`;
  const fontKey     = `axioma_notes_font_${sessionId}`;

  /* ── State ── */
  const [value, setValue]         = useState(() => localStorage.getItem(storageKey) ?? "");
  const [collapsed, setCollapsed] = useState(() => localStorage.getItem(collapseKey) === "true");
  const [fontIdx, setFontIdx]     = useState(() => {
    const saved = parseInt(localStorage.getItem(fontKey), 10);
    return isNaN(saved) ? DEFAULT_FONT_IDX : Math.max(0, Math.min(FONT_STEPS.length - 1, saved));
  });
  const [showClear, setShowClear]   = useState(false);
  const [panelWidth, setPanelWidth] = useState(300);
  const [dragging, setDragging]     = useState(false);

  /* ── Firestore status: idle | loading | saving | saved | error ── */
  const [fsStatus, setFsStatus] = useState("idle");

  /* ── Refs ── */
  const lsTimer     = useRef(null);
  const fsTimer     = useRef(null);
  const dragStartX  = useRef(0);
  const dragStartW  = useRef(0);
  const textareaRef = useRef(null);
  const mountedRef  = useRef(true);
  const lastFsSaved = useRef("");

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
      clearTimeout(lsTimer.current);
      clearTimeout(fsTimer.current);
    };
  }, []);

  /* ── Load from Firestore when topicId changes ── */
  useEffect(() => {
    if (!firestoreMode) return;
    let cancelled = false;

    setFsStatus("loading");

    // Show cached localStorage content instantly while Firestore loads
    const cached = localStorage.getItem(storageKey) ?? "";
    setValue(cached);

    getTheoryNote(uid, topicId)
      .then((data) => {
        if (cancelled) return;
        const content = data?.content ?? "";
        setValue(content);
        lastFsSaved.current = content;
        localStorage.setItem(storageKey, content); // keep LS in sync
        setFsStatus("idle");
      })
      .catch(() => {
        // Silent fallback — localStorage content stays visible
        if (!cancelled) setFsStatus("idle");
      });

    return () => { cancelled = true; };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [uid, topicId]);

  /* ── Core Firestore write ── */
  const persistToFirestore = useCallback(async (text) => {
    if (!firestoreMode) return;
    if (text === lastFsSaved.current) return;
    if (!mountedRef.current) return;

    setFsStatus("saving");
    try {
      await saveTheoryNote(uid, topicId, text);
      if (!mountedRef.current) return;
      lastFsSaved.current = text;
      setFsStatus("saved");
      setTimeout(() => { if (mountedRef.current) setFsStatus("idle"); }, 2000);
    } catch {
      if (mountedRef.current) setFsStatus("error");
    }
  }, [uid, topicId, firestoreMode]);

  /* ── Textarea change ── */
  const handleChange = (e) => {
    const v = e.target.value;
    setValue(v);

    clearTimeout(lsTimer.current);
    lsTimer.current = setTimeout(() => localStorage.setItem(storageKey, v), LS_DEBOUNCE_MS);

    if (firestoreMode) {
      setFsStatus("idle");
      clearTimeout(fsTimer.current);
      fsTimer.current = setTimeout(() => persistToFirestore(v), FS_DEBOUNCE_MS);
    }
  };

  /* ── Persist collapse + font to localStorage ── */
  useEffect(() => { localStorage.setItem(collapseKey, collapsed); }, [collapsed, collapseKey]);
  useEffect(() => { localStorage.setItem(fontKey, fontIdx); },     [fontIdx, fontKey]);

  /* ── Resize drag — left edge, drag left = panel grows ── */
  const onDragStart = useCallback((e) => {
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

  /* ── Mobile: keep textarea above soft keyboard ── */
  useEffect(() => {
    if (collapsed) return;
    const el = textareaRef.current;
    if (!el) return;
    const onFocus = () => {
      setTimeout(() => { el.scrollIntoView({ behavior: "smooth", block: "end" }); }, 320);
    };
    el.addEventListener("focus", onFocus);
    return () => el.removeEventListener("focus", onFocus);
  }, [collapsed]);

  /* ── Clear ── */
  const handleClearConfirm = () => {
    setValue("");
    localStorage.removeItem(storageKey);
    setShowClear(false);
    if (firestoreMode) {
      clearTimeout(fsTimer.current);
      persistToFirestore("");
    }
  };

  /* ── Insert math symbol at cursor, no scroll jump ── */
  const insertSymbol = (sym) => {
    const el = textareaRef.current;
    if (!el) return;
    const start       = el.selectionStart;
    const end         = el.selectionEnd;
    const savedScroll = el.scrollTop;
    const next        = value.slice(0, start) + sym + value.slice(end);
    setValue(next);

    clearTimeout(lsTimer.current);
    lsTimer.current = setTimeout(() => localStorage.setItem(storageKey, next), LS_DEBOUNCE_MS);

    if (firestoreMode) {
      clearTimeout(fsTimer.current);
      fsTimer.current = setTimeout(() => persistToFirestore(next), FS_DEBOUNCE_MS);
    }

    requestAnimationFrame(() => {
      el.focus({ preventScroll: true });
      el.setSelectionRange(start + sym.length, start + sym.length);
      el.scrollTop = savedScroll;
    });
  };

  /* ── Derived ── */
  const fontSize = FONT_STEPS[fontIdx];
  const fsLabel  = { loading: "Loading…", saving: "Saving…", saved: "Saved ✓", error: "Save failed", idle: "" }[fsStatus];

  /* ════════════════════════════════════════
     COLLAPSED STATE
  ════════════════════════════════════════ */
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

  /* ════════════════════════════════════════
     EXPANDED STATE
  ════════════════════════════════════════ */
  return (
    <>
      {showClear && (
        <ClearConfirmModal
          onConfirm={handleClearConfirm}
          onCancel={() => setShowClear(false)}
        />
      )}

      {/* Backdrop — mobile/tablet only via CSS */}
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

            {/* Cloud save indicator — Firestore mode only */}
            {firestoreMode && (
              <span className={`notes-fs-status notes-fs-status--${fsStatus}`}>
                {fsStatus === "saving"
                  ? <span className="notes-fs-status__spin" />
                  : <CloudIcon />
                }
                {fsLabel && <span className="notes-fs-status__label">{fsLabel}</span>}
              </span>
            )}
          </div>

          <div className="notes-panel__header-actions">
            {/* Font size control */}
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

            {/* Clear */}
            <button
              className="notes-icon-btn"
              onClick={() => setShowClear(true)}
              disabled={!value}
              title="Clear notes"
            >
              <TrashIcon />
            </button>

            {/* Collapse */}
            <button
              className="notes-icon-btn"
              onClick={() => setCollapsed(true)}
              title="Close notes"
            >
              <CollapseIcon />
            </button>
          </div>
        </div>

        {/* ── Math symbol toolbar ── */}
        <div className="notes-symbols">
          {MATH_SYMBOLS.map(({ sym, label }) => (
            <button
              key={sym}
              className="notes-symbols__btn"
              onClick={() => insertSymbol(sym)}
              title={label}
              tabIndex={-1}
            >
              {sym}
            </button>
          ))}
        </div>

        {/* ── Textarea ── */}
        <div className="notes-panel__body">
          <textarea
            ref={textareaRef}
            className="notes-textarea"
            value={value}
            onChange={handleChange}
            placeholder={
              fsStatus === "loading"
                ? "Loading your notes…"
                : firestoreMode
                  ? "Write notes for this topic — saved to your profile…"
                  : "Write your solution steps here…"
            }
            disabled={fsStatus === "loading"}
            spellCheck={false}
            autoCorrect="off"
            autoCapitalize="off"
            style={{ fontSize }}
          />
        </div>

        {/* ── Resize handle — left edge, desktop only ── */}
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