import { useState, useEffect, useRef, useCallback } from "react";
import "./notes-panel.css";

// ── Icons ────────────────────────────────────────────────────────────────────
const PanelLeftIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="18" height="18" rx="2"/>
    <line x1="9" y1="3" x2="9" y2="21"/>
  </svg>
);
const TrashIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3 6 5 6 21 6"/>
    <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
    <path d="M10 11v6M14 11v6"/>
    <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
  </svg>
);
const CollapseLeftIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
    <polyline points="15 18 9 12 15 6"/>
  </svg>
);
const ExpandRightIcon = () => (
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

// ── Clear Confirm Modal ───────────────────────────────────────────────────────
const ClearConfirmModal = ({ onConfirm, onCancel }) => {
  useEffect(() => {
    const handler = (e) => {
      if (e.key === "Escape") onCancel();
      if (e.key === "Enter") onConfirm();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onConfirm, onCancel]);

  return (
    <div className="notes-confirm-overlay" onClick={onCancel}>
      <div className="notes-confirm" onClick={(e) => e.stopPropagation()}>
        <p className="notes-confirm__title">Clear all notes?</p>
        <p className="notes-confirm__sub">This cannot be undone.</p>
        <div className="notes-confirm__actions">
          <button className="notes-confirm__btn notes-confirm__btn--cancel" onClick={onCancel}>Cancel</button>
          <button className="notes-confirm__btn notes-confirm__btn--confirm" onClick={onConfirm}>Clear</button>
        </div>
      </div>
    </div>
  );
};

// ── NotesPanel ────────────────────────────────────────────────────────────────
const FONT_STEPS = [13, 14, 15, 16, 17, 18, 20];
const DEFAULT_FONT_IDX = 2; // 15px
const MIN_WIDTH = 280;
const MAX_WIDTH_RATIO = 0.5;

const NotesPanel = ({ sessionId = "default" }) => {
  const storageKey = `diagnostic_notes_${sessionId}`;
  const collapseKey = `diagnostic_notes_collapsed_${sessionId}`;
  const fontKey     = `diagnostic_notes_fontidx_${sessionId}`;

  const [value, setValue]         = useState(() => localStorage.getItem(storageKey) ?? "");
  const [collapsed, setCollapsed] = useState(() => localStorage.getItem(collapseKey) === "true");
  const [fontIdx, setFontIdx]     = useState(() => {
    const saved = parseInt(localStorage.getItem(fontKey), 10);
    return isNaN(saved) ? DEFAULT_FONT_IDX : Math.max(0, Math.min(FONT_STEPS.length - 1, saved));
  });
  const [showClear, setShowClear]   = useState(false);
  const [panelWidth, setPanelWidth] = useState(300);
  const [dragging, setDragging]     = useState(false);

  const saveTimer  = useRef(null);
  const panelRef   = useRef(null);
  const dragStartX = useRef(0);
  const dragStartW = useRef(0);

  // Auto-save with debounce
  const handleChange = (e) => {
    const v = e.target.value;
    setValue(v);
    clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => {
      localStorage.setItem(storageKey, v);
    }, 800);
  };

  // Persist collapse & font
  useEffect(() => { localStorage.setItem(collapseKey, collapsed); }, [collapsed]);
  useEffect(() => { localStorage.setItem(fontKey, fontIdx); }, [fontIdx]);

  // Resize drag
  const onDragStart = useCallback((e) => {
    e.preventDefault();
    dragStartX.current = e.clientX;
    dragStartW.current = panelWidth;
    setDragging(true);
  }, [panelWidth]);

  useEffect(() => {
    if (!dragging) return;
    const onMove = (e) => {
      const delta = dragStartX.current - e.clientX; // left panel: drag right → shrink
      const maxW  = Math.floor(window.innerWidth * MAX_WIDTH_RATIO);
      const next  = Math.min(maxW, Math.max(MIN_WIDTH, dragStartW.current + delta));
      setPanelWidth(next);
    };
    const onUp = () => setDragging(false);
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };
  }, [dragging]);

  const handleClearConfirm = () => {
    setValue("");
    localStorage.removeItem(storageKey);
    setShowClear(false);
  };

  const fontSize = FONT_STEPS[fontIdx];

  if (collapsed) {
    return (
      <div className="notes-collapsed">
        <button
          className="notes-collapsed__btn"
          onClick={() => setCollapsed(false)}
          title="Open notes"
        >
          <NoteIcon />
          <span className="notes-collapsed__label">Notes</span>
          <ExpandRightIcon />
        </button>
      </div>
    );
  }

  return (
    <>
      {showClear && (
        <ClearConfirmModal
          onConfirm={handleClearConfirm}
          onCancel={() => setShowClear(false)}
        />
      )}

      <aside
        ref={panelRef}
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
            <div className="notes-font-ctrl">
              <button
                className="notes-font-ctrl__btn"
                onClick={() => setFontIdx(i => Math.max(0, i - 1))}
                disabled={fontIdx === 0}
                title="Decrease font size"
              >
                A<span className="notes-font-ctrl__minus">-</span>
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
              title="Clear notes"
              disabled={!value}
            >
              <TrashIcon />
            </button>

            <button
              className="notes-icon-btn"
              onClick={() => setCollapsed(true)}
              title="Collapse"
            >
              <CollapseLeftIcon />
            </button>
          </div>
        </div>

        {/* ── Textarea ── */}
        <div className="notes-panel__body">
          <textarea
            className="notes-textarea"
            value={value}
            onChange={handleChange}
            placeholder="Your scratch work..."
            spellCheck={false}
            autoCorrect="off"
            autoCapitalize="off"
            style={{ fontSize }}
          />
        </div>

        {/* ── Resize handle (right edge) ── */}
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