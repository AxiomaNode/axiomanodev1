import { useState, useEffect, useRef, useCallback } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import Header from "../../components/layout/Header";
import Sidebar from "../../components/layout/Sidebar";
import NotesPanel from "../../components/NotesPanel";
import { tasks as taskBank } from "../../data/tasks";
import { topics } from "../../data/topics";
import {
  getHomeworkDoc,
  assignHomework,
  saveHomeworkAnswer,
  completeHomework,
  getTopicNote,
  saveTopicNote,
} from "../../services/db";
import "./homework.css";
import "../../styles/layout.css";

/* ════════════════════════════════════════════
   ICONS
════════════════════════════════════════════ */
const ChevronRight = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
    <polyline points="9 18 15 12 9 6" />
  </svg>
);
const ChevronLeft = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
    <polyline points="15 18 9 12 15 6" />
  </svg>
);
const CheckIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);
const XIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

/* ════════════════════════════════════════════
   PAGE
════════════════════════════════════════════ */
const HomeworkPage = () => {
  const { user }  = useAuth();
  const location  = useLocation();
  const navigate  = useNavigate();

  const topicId   = location.state?.topicId || "quadratic";
  const topicMeta = topics.find(t => t.id === topicId);

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [pageState,   setPageState]   = useState("loading");
  const [hwDoc,       setHwDoc]       = useState(null);
  const [currentIdx,  setCurrentIdx]  = useState(0);
  const [completing,  setCompleting]  = useState(false);

  const [noteContent,   setNoteContent]   = useState(null);
  const [noteLoadedFor, setNoteLoadedFor] = useState(null);

  const savingRef = useRef(false);

  /* ── Load / create ── */
  useEffect(() => {
    if (!user?.uid) return;
    const load = async () => {
      const homeworkTasks = taskBank[topicId]?.homework;
      if (!homeworkTasks?.length) { setPageState("empty"); return; }
      let doc = await getHomeworkDoc(user.uid, topicId);
      if (!doc) {
        doc = await assignHomework(user.uid, topicId, {
          topicTitle: topicMeta?.title || topicId,
          tasks: homeworkTasks,
        });
      }
      if (!doc) { setPageState("empty"); return; }
      setHwDoc(doc);
      setPageState(doc.status === "completed" ? "results" : "intro");
    };
    load();
  }, [user?.uid, topicId]); // eslint-disable-line

  /* ── Notes ── */
  useEffect(() => {
    if (!user?.uid) { setNoteContent(""); setNoteLoadedFor(topicId); return; }
    let cancelled = false;
    getTopicNote(user.uid, topicId).then(note => {
      if (cancelled) return;
      setNoteContent(note?.content ?? "");
      setNoteLoadedFor(topicId);
    });
    return () => { cancelled = true; };
  }, [user?.uid, topicId]);

  const handleNoteSave = useCallback(async (html) => {
    if (!user?.uid) return;
    await saveTopicNote(user.uid, topicId, { topicTitle: topicMeta?.title || topicId, content: html });
  }, [user?.uid, topicId, topicMeta?.title]);

  /* ── Derived ── */
  const tasks         = hwDoc?.tasks || [];
  const totalTasks    = tasks.length;
  const answeredCount = tasks.filter(t => t.userAnswer != null).length;
  const allAnswered   = answeredCount === totalTasks && totalTasks > 0;
  const currentTask   = tasks[currentIdx] || null;
  const isLastTask    = currentIdx + 1 >= totalTasks;

  /* ── Answer ── */
  const handleSelectAnswer = async (taskId, label) => {
    if (!user?.uid) return;
    setHwDoc(prev => {
      if (!prev) return prev;
      return { ...prev, tasks: prev.tasks.map(t => t.id === taskId ? { ...t, userAnswer: label } : t) };
    });
    if (savingRef.current) return;
    savingRef.current = true;
    try {
      const updated = await saveHomeworkAnswer(user.uid, topicId, taskId, label);
      if (updated && !updated._error) setHwDoc(updated);
    } finally { savingRef.current = false; }
  };

  /* ── Navigation ── */
  const handleNext = useCallback(() => {
    if (currentIdx + 1 < totalTasks) setCurrentIdx(i => i + 1);
  }, [currentIdx, totalTasks]);

  const handlePrev = useCallback(() => {
    if (currentIdx > 0) setCurrentIdx(i => i - 1);
  }, [currentIdx]);

  const handleFinish = async () => {
    if (!allAnswered || completing) return;
    setCompleting(true);
    try {
      const result = await completeHomework(user.uid, topicId);
      if (result && !result._error) {
        setHwDoc(result);
        setPageState("results");
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    } finally { setCompleting(false); }
  };

  const handleStartSolving = () => {
    const firstUnanswered = tasks.findIndex(t => t.userAnswer == null);
    setCurrentIdx(firstUnanswered >= 0 ? firstUnanswered : 0);
    setPageState("solving");
  };

  /* ── Keyboard ── */
  useEffect(() => {
    if (pageState !== "solving") return;
    const handler = (e) => {
      if (["INPUT", "TEXTAREA", "SELECT"].includes(e.target.tagName)) return;
      if (e.target.contentEditable === "true") return;
      if (e.key === "ArrowLeft") { e.preventDefault(); handlePrev(); }
      if (e.key === "ArrowRight" || e.key === "Enter") {
        e.preventDefault();
        if (!isLastTask) handleNext();
        else if (allAnswered) handleFinish();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [pageState, handleNext, handlePrev, isLastTask, allAnswered]); // eslint-disable-line

  const notesReady = noteLoadedFor === topicId;

  /* ── Score ── */
  const scoreData = (() => {
    if (!hwDoc || pageState !== "results") return null;
    const correct = tasks.filter(t => t.userAnswer === t.correct).length;
    const total   = tasks.length;
    const pct     = total ? Math.round((correct / total) * 100) : 0;
    return { correct, total, pct };
  })();

  const scoreColor = (pct) =>
    pct >= 70 ? "var(--teal)" : pct >= 40 ? "#d35400" : "#c0392b";

  /* ════════════════════════════════════════
     RENDER
  ════════════════════════════════════════ */
  return (
    <div className="page-shell">
      <Header sidebarOpen={sidebarOpen} onToggleSidebar={() => setSidebarOpen(v => !v)} />
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <main className="page-main">

        {/* ── Loading ── */}
        {pageState === "loading" && (
          <div className="hw-loading">
            <span className="hw-loading__dot" />
            <span className="hw-loading__dot" />
            <span className="hw-loading__dot" />
          </div>
        )}

        {/* ── Empty ── */}
        {pageState === "empty" && (
          <div className="hw-empty">
            <p className="hw-eyebrow">Homework</p>
            <h2 className="hw-empty__title">No tasks available</h2>
            <p className="hw-empty__sub">Homework for this topic hasn't been added yet.</p>
            <Link to="/theory" className="hw-btn hw-btn--ghost">
              <ChevronLeft /> Back to Theory
            </Link>
          </div>
        )}

        {/* ── Intro ── */}
        {pageState === "intro" && (
          <div className="hw-intro-wrap">
            <div className="hw-intro">

              {/* Breadcrumb trail */}
              <nav className="hw-trail">
                <Link to="/theory" className="hw-trail__link">Theory</Link>
                <span className="hw-trail__sep">→</span>
                <span className="hw-trail__cur">Homework</span>
              </nav>

              {/* Hero text — matches home-hero__headline rhythm */}
              <div className="hw-intro__hero">
                <p className="hw-eyebrow">Assessment</p>
                <h1 className="hw-intro__title">{topicMeta?.title || topicId}</h1>
                <p className="hw-intro__desc">
                  A focused set of problems to confirm your understanding of this topic.
                  Work carefully — progress is saved automatically after each answer.
                </p>
              </div>

              {/* Stats — identical rhythm to home-hero__stats */}
              <div className="hw-intro__stats">
                <div className="hw-intro__stat">
                  <strong>{totalTasks}</strong>
                  <span>Tasks</span>
                </div>
                <div className="hw-intro__stat-div" />
                <div className="hw-intro__stat">
                  <strong>{answeredCount > 0 ? answeredCount : "—"}</strong>
                  <span>Answered</span>
                </div>
                <div className="hw-intro__stat-div" />
                <div className="hw-intro__stat">
                  <strong>Auto</strong>
                  <span>Saves progress</span>
                </div>
              </div>

              {/* Resume notice */}
              {answeredCount > 0 && (
                <div className="hw-intro__resume">
                  <span className="hw-intro__resume-pip" />
                  {answeredCount} of {totalTasks} answers already saved — continue where you left off.
                </div>
              )}

              {/* Rules */}
              <ul className="hw-intro__rules">
                <li>Navigate freely between questions</li>
                <li>Submit only after all questions are answered</li>
                <li>Explanations are revealed after submission</li>
              </ul>

              <button className="hw-btn hw-btn--primary" onClick={handleStartSolving}>
                {answeredCount > 0 ? "Continue Homework" : "Begin Homework"}
                <ChevronRight />
              </button>

            </div>
          </div>
        )}

        {/* ── Solving ── */}
        {pageState === "solving" && (
          <div className={`diag-shell${notesReady ? " diag-shell--with-notes" : ""}`}>
            <div className="diag-shell__main">
              <div className="hw-solve-outer">

                {/* Document-level header — always visible above the card */}
                <div className="hw-doc-header">
                  <div className="hw-doc-header__left">
                    <Link to="/theory" className="hw-doc-header__back">
                      <ChevronLeft /><span>Theory</span>
                    </Link>
                    <span className="hw-doc-header__sep">/</span>
                    <span className="hw-doc-header__topic">{topicMeta?.title || topicId}</span>
                  </div>
                  <div className="hw-doc-header__right">
                    <span className="hw-doc-header__count">
                      {answeredCount}<em>/{totalTasks}</em>
                    </span>
                    <span className="hw-doc-header__count-label">answered</span>
                  </div>
                </div>

                {/* Segment progress bar */}
                <div className="hw-seg-row">
                  {tasks.map((t, i) => (
                    <button
                      key={i}
                      className={[
                        "hw-seg",
                        i === currentIdx     ? "hw-seg--current"  : "",
                        t.userAnswer != null ? "hw-seg--answered" : "",
                      ].filter(Boolean).join(" ")}
                      onClick={() => setCurrentIdx(i)}
                      title={`Q${i + 1}${t.userAnswer != null ? " ✓" : ""}`}
                    />
                  ))}
                </div>

                {/* ── Workspace frame — the "exam sheet" ── */}
                <div className="hw-workspace">

                  {currentTask && (
                    <>
                      {/* Question */}
                      <div className="hw-question">
                        {/* Large display counter — editorial anchor */}
                        <div className="hw-question__counter">
                          <span className="hw-question__num">{String(currentIdx + 1).padStart(2, "0")}</span>
                          <span className="hw-question__total">/ {String(totalTasks).padStart(2, "0")}</span>
                        </div>
                        {/* Question text in Georgia — academic weight */}
                        <h2 className="hw-question__text">{currentTask.text}</h2>
                      </div>

                      {/* Answer options */}
                      <div className="hw-options">
                        {(currentTask.options || []).map(opt => {
                          const isSelected = currentTask.userAnswer === opt.label;
                          return (
                            <button
                              key={opt.label}
                              className={`hw-option${isSelected ? " hw-option--selected" : ""}`}
                              onClick={() => handleSelectAnswer(currentTask.id, opt.label)}
                            >
                              {/* Letter badge */}
                              <span className="hw-option__badge">{opt.label}</span>
                              {/* Answer text */}
                              <span className="hw-option__text">{opt.value}</span>
                              {/* Selected indicator — right-side check */}
                              <span className="hw-option__indicator">
                                {isSelected && <CheckIcon />}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </>
                  )}

                  {/* Navigation strip */}
                  <div className="hw-nav">
                    <button
                      className="hw-nav__btn hw-nav__btn--ghost"
                      onClick={handlePrev}
                      disabled={currentIdx === 0}
                    >
                      <ChevronLeft /> Prev
                    </button>

                    <div className="hw-nav__center">
                      <span className="hw-nav__fraction">
                        {currentIdx + 1}&thinsp;/&thinsp;{totalTasks}
                      </span>
                      <span className="hw-nav__hint-keys">← → navigate</span>
                    </div>

                    {isLastTask ? (
                      <button
                        className={`hw-nav__btn hw-nav__btn--submit${allAnswered ? " hw-nav__btn--ready" : ""}`}
                        onClick={handleFinish}
                        disabled={!allAnswered || completing}
                        title={!allAnswered
                          ? `${totalTasks - answeredCount} unanswered`
                          : undefined}
                      >
                        {completing ? "Submitting…" : "Submit"}
                        <ChevronRight />
                      </button>
                    ) : (
                      <button className="hw-nav__btn hw-nav__btn--primary" onClick={handleNext}>
                        Next <ChevronRight />
                      </button>
                    )}
                  </div>

                  {/* Remaining hint */}
                  {isLastTask && !allAnswered && (
                    <p className="hw-nav__remaining">
                      {totalTasks - answeredCount} question{totalTasks - answeredCount !== 1 ? "s" : ""} still unanswered
                    </p>
                  )}

                </div>{/* /hw-workspace */}
              </div>
            </div>

            {/* Notes panel */}
            {notesReady && (
              <NotesPanel
                key={topicId}
                sessionId={`hw_${topicId}`}
                initialContent={noteContent}
                onSave={handleNoteSave}
              />
            )}
          </div>
        )}

        {/* ── Results ── */}
        {pageState === "results" && scoreData && (
          <div className="hw-results-wrap">
            <div className="hw-results">

              {/* Score header */}
              <div className="hw-results__header">
                <p className="hw-eyebrow">Completed · {topicMeta?.title || topicId}</p>
                <div className="hw-results__score-row">
                  <span className="hw-results__pct" style={{ color: scoreColor(scoreData.pct) }}>
                    {scoreData.pct}%
                  </span>
                  <div className="hw-results__score-meta">
                    <span className="hw-results__tally">
                      {scoreData.correct} correct out of {scoreData.total}
                    </span>
                    <span className="hw-results__verdict">
                      {scoreData.pct >= 70
                        ? "Strong result — your understanding is solid."
                        : scoreData.pct >= 40
                        ? "Partial understanding — review the explanations below."
                        : "Needs work — revisit the theory before retrying."}
                    </span>
                  </div>
                </div>
              </div>

              {/* Breakdown */}
              <div className="hw-breakdown">
                <p className="hw-breakdown__heading">Answer Breakdown</p>
                {tasks.map((t, i) => {
                  const isCorrect  = t.userAnswer === t.correct;
                  const userOpt    = t.options?.find(o => o.label === t.userAnswer);
                  const correctOpt = t.options?.find(o => o.label === t.correct);
                  return (
                    <div
                      key={t.id}
                      className={`hw-result-row${isCorrect ? " hw-result-row--ok" : " hw-result-row--wrong"}`}
                    >
                      {/* Status + number */}
                      <div className="hw-result-row__head">
                        <span className="hw-result-row__icon">
                          {isCorrect ? <CheckIcon /> : <XIcon />}
                        </span>
                        <span className="hw-result-row__num">Q{String(i + 1).padStart(2, "0")}</span>
                      </div>

                      {/* Question text */}
                      <p className="hw-result-row__q">{t.text}</p>

                      {/* Answer pills */}
                      <div className="hw-result-row__answers">
                        <span className={`hw-pill${isCorrect ? " hw-pill--ok" : " hw-pill--wrong"}`}>
                          <span className="hw-pill__label">Your answer</span>
                          <span className="hw-pill__val">
                            {userOpt ? `${userOpt.label} — ${userOpt.value}` : "Not answered"}
                          </span>
                        </span>
                        {!isCorrect && correctOpt && (
                          <span className="hw-pill hw-pill--ok">
                            <span className="hw-pill__label">Correct</span>
                            <span className="hw-pill__val">{correctOpt.label} — {correctOpt.value}</span>
                          </span>
                        )}
                      </div>

                      {/* Explanation — only in results */}
                      {t.explanation && (
                        <p className="hw-result-row__explanation">{t.explanation}</p>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* CTA */}
              <div className="hw-results__actions">
                <Link to="/practice" className="hw-btn hw-btn--primary">
                  Go to Practice <ChevronRight />
                </Link>
                <Link to="/diagnostics" className="hw-btn hw-btn--ghost">
                  Run Diagnostic
                </Link>
              </div>

            </div>
          </div>
        )}

      </main>
    </div>
  );
};

export default HomeworkPage;