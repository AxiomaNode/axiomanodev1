// src/components/sections/NotesSection.jsx
import { useState, useEffect, useRef, useMemo } from "react";
import { saveTopicNote } from "../../services/db";
import "./notes-section.css";
import { Link } from "react-router-dom";

/* ── Strip HTML tags → plain text (for preview) ── */
const stripHtml = (html) => {
  if (!html) return "";
  const div = document.createElement("div");
  div.innerHTML = html;
  return (div.textContent || div.innerText || "").replace(/\s+/g, " ").trim();
};

/* ── Normalize HTML so unchanged notes are detected reliably ── */
const normalizeHtml = (html) => {
  return (html || "")
    .replace(/\u200B/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();
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
  const [openId,  setOpenId]  = useState(() => notes[0]?.topicId ?? null);
  const [editing, setEditing] = useState(false);
  const [saving,  setSaving]  = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const editorRef = useRef(null);

  const openNote = notes.find((n) => n.topicId === openId) ?? null;

  const initialNormalized = useMemo(
    () => normalizeHtml(openNote?.content || ""),
    [openNote]
  );

  useEffect(() => {
    setEditing(false);
    setIsDirty(false);
  }, [openId]);

  useEffect(() => {
    if (!editing) return;
    if (editorRef.current && openNote) {
      editorRef.current.innerHTML = openNote.content || "";
      editorRef.current.focus();
      setIsDirty(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editing, openNote?.topicId]);

  const handleEditorInput = () => {
    if (!editorRef.current) return;
    const currentNormalized = normalizeHtml(editorRef.current.innerHTML);
    setIsDirty(currentNormalized !== initialNormalized);
  };

  const handleSave = async () => {
    if (!editorRef.current || !openNote || !uid || saving) return;

    const newContent = editorRef.current.innerHTML;
    const newNormalized = normalizeHtml(newContent);

    if (newNormalized === initialNormalized) {
      setEditing(false);
      setIsDirty(false);
      return;
    }

    setSaving(true);
    try {
      await saveTopicNote(uid, openNote.topicId, {
        topicTitle: openNote.topicTitle,
        content: newContent,
      });
      onNoteUpdated?.(openNote.topicId, newContent);
      setEditing(false);
      setIsDirty(false);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    if (editorRef.current && openNote) {
      editorRef.current.innerHTML = openNote.content || "";
    }
    setIsDirty(false);
    setEditing(false);
  };

  const handleEditorKeyDown = (e) => {
    e.stopPropagation();
    if (e.key === "Escape") handleCancel();
  };

  if (notes.length === 0) {
    return (
      <div className="profile-empty-state">
        <div className="profile-empty-state__head">
          <div className="profile-empty-state__head-icon profile-empty-state__head-icon--teal">
            <NoteIcon />
          </div>
          <div>
            <h3 className="profile-empty-state__title">No notes yet</h3>
            <p className="profile-empty-state__sub">
              Notes are written in the Theory page while you study.
              They're saved per topic and collected here so you can review them alongside your results.
            </p>
          </div>
        </div>

        <div className="profile-empty-state__note-how">
          <div className="profile-empty-state__note-step">
            <span className="profile-empty-state__note-step-num">1</span>
            <div>
              <strong>Go to Theory</strong>
              <p>Open any topic section in the Theory page.</p>
            </div>
          </div>
          <div className="profile-empty-state__note-arrow">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <polyline points="9 18 15 12 9 6"/>
            </svg>
          </div>
          <div className="profile-empty-state__note-step">
            <span className="profile-empty-state__note-step-num">2</span>
            <div>
              <strong>Open the notes panel</strong>
              <p>The notes panel lives alongside each theory section.</p>
            </div>
          </div>
          <div className="profile-empty-state__note-arrow">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <polyline points="9 18 15 12 9 6"/>
            </svg>
          </div>
          <div className="profile-empty-state__note-step">
            <span className="profile-empty-state__note-step-num">3</span>
            <div>
              <strong>Write anything</strong>
              <p>Notes auto-save and appear here organised by topic.</p>
            </div>
          </div>
        </div>

        <div className="profile-empty-state__actions">
          <Link to="/theory" className="profile-empty-state__btn profile-empty-state__btn--primary">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/>
              <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
            </svg>
            Go to Theory
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="ns-inner">
      <div className="ns-layout">
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

        <div className="ns-detail">
          {!openNote ? (
            <div className="ns-detail__placeholder">
              Select a topic to view its notes.
            </div>
          ) : (
            <>
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
                        disabled={saving || !isDirty}
                      >
                        {saving ? "Saving…" : "Save"}
                      </button>
                      {!isDirty && !saving && (
                        <span className="ns-unchanged-hint">No changes</span>
                      )}
                    </>
                  )}
                </div>
              </div>

              {!editing ? (
                <div
                  className="ns-content"
                  dangerouslySetInnerHTML={{ __html: openNote.content || "" }}
                />
              ) : (
                <div
                  ref={editorRef}
                  className="ns-editor"
                  contentEditable
                  suppressContentEditableWarning
                  onInput={handleEditorInput}
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