// src/components/sections/NotesSection.jsx
// Displays all saved topic notes for the current user.
// Props:
//   notes         {Array}    from getAllTopicNotes() — filtered to non-empty content
//   uid           {string}   current user uid, passed down for saves
//   onNoteUpdated {Function} (topicId: string, content: string) → void
//                            Called after a successful save so ProfilePage can
//                            update its local notes state.
import { useState, useEffect, useRef } from "react";
import { saveTopicNote } from "../../services/db";
import "./notes-section.css";

/* ── Strip HTML tags → plain text (for preview) ── */
const stripHtml = (html) => {
  if (!html) return "";
  const div = document.createElement("div");
  div.innerHTML = html;
  return (div.textContent || div.innerText || "").replace(/\s+/g, " ").trim();
};

/* ── Icons ─────────────────────────────── */
const EditIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4z"/>
  </svg>
);

const NoteIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
    <polyline points="14 2 14 8 20 8"/>
    <line x1="16" y1="13" x2="8" y2="13"/>
    <line x1="16" y1="17" x2="8" y2="17"/>
  </svg>
);

/* ── NotesSection ──────────────────────── */
const NotesSection = ({ notes = [], uid, onNoteUpdated }) => {
  const [openId,   setOpenId]   = useState(() => notes[0]?.topicId ?? null);
  const [editing,  setEditing]  = useState(false);
  const [saving,   setSaving]   = useState(false);
  const editorRef = useRef(null);

  // When the open note changes, exit edit mode
  useEffect(() => {
    setEditing(false);
  }, [openId]);

  // Seed the editor with the current note's content when entering edit mode
  useEffect(() => {
    if (!editing) return;
    const note = notes.find((n) => n.topicId === openId);
    if (editorRef.current && note) {
      editorRef.current.innerHTML = note.content || "";
      editorRef.current.focus();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editing]);

  const openNote = notes.find((n) => n.topicId === openId) ?? null;

  const handleSave = async () => {
    if (!editorRef.current || !openNote || !uid) return;
    setSaving(true);
    const newContent = editorRef.current.innerHTML;
    try {
      await saveTopicNote(uid, openNote.topicId, {
        topicTitle: openNote.topicTitle,
        content: newContent,
      });
      onNoteUpdated?.(openNote.topicId, newContent);
      setEditing(false);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    // Reset editor content to current saved note
    if (editorRef.current && openNote) {
      editorRef.current.innerHTML = openNote.content || "";
    }
    setEditing(false);
  };

  // Prevent arrow keys in edit mode from bubbling to page-level listeners
  const handleEditorKeyDown = (e) => {
    e.stopPropagation();
    // Allow Escape to cancel
    if (e.key === "Escape") handleCancel();
  };

  /* ── Empty state ── */
  if (notes.length === 0) {
    return (
      <div className="ns-empty">
        <div className="ns-empty__icon">
          <NoteIcon />
        </div>
        <p className="ns-empty__title">No notes yet</p>
        <p className="ns-empty__sub">
          Write notes while studying theory — they will appear here, organised by topic.
        </p>
      </div>
    );
  }

  return (
    <div className="ns-inner">
      <div className="ns-layout">

        {/* ── Topic list ── */}
        <aside className="ns-list">
          <p className="ns-list__label">Topics</p>
          {notes.map((note) => {
            const preview = stripHtml(note.content).slice(0, 72);
            const isActive = openId === note.topicId;
            return (
              <button
                key={note.topicId}
                className={`ns-topic-btn${isActive ? " ns-topic-btn--active" : ""}`}
                onClick={() => setOpenId(note.topicId)}
              >
                <span className="ns-topic-btn__icon"><NoteIcon /></span>
                <div className="ns-topic-btn__body">
                  <span className="ns-topic-btn__title">{note.topicTitle}</span>
                  <span className="ns-topic-btn__preview">
                    {preview || <em>Empty note</em>}
                  </span>
                </div>
              </button>
            );
          })}
        </aside>

        {/* ── Note detail ── */}
        <div className="ns-detail">
          {!openNote ? (
            <div className="ns-detail__placeholder">
              Select a topic to view its notes.
            </div>
          ) : (
            <>
              {/* Header */}
              <div className="ns-detail__header">
                <div className="ns-detail__header-left">
                  <span className="ns-detail__header-icon"><NoteIcon /></span>
                  <h3 className="ns-detail__title">{openNote.topicTitle}</h3>
                </div>

                <div className="ns-detail__actions">
                  {!editing ? (
                    <button
                      className="ns-edit-btn"
                      onClick={() => setEditing(true)}
                    >
                      <EditIcon />
                      Edit
                    </button>
                  ) : (
                    <>
                      <button
                        className="ns-cancel-btn"
                        onClick={handleCancel}
                        disabled={saving}
                      >
                        Cancel
                      </button>
                      <button
                        className="ns-save-btn"
                        onClick={handleSave}
                        disabled={saving}
                      >
                        {saving ? "Saving…" : "Save"}
                      </button>
                    </>
                  )}
                </div>
              </div>

              {/* Content */}
              {!editing ? (
                /* Read mode: render note HTML */
                <div
                  className="ns-content"
                  dangerouslySetInnerHTML={{ __html: openNote.content || "" }}
                />
              ) : (
                /* Edit mode: contentEditable, no toolbar (same content, just editable) */
                <div
                  ref={editorRef}
                  className="ns-editor"
                  contentEditable
                  suppressContentEditableWarning
                  onKeyDown={handleEditorKeyDown}
                  spellCheck={false}
                />
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default NotesSection;