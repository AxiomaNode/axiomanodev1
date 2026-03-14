import { useState, useEffect, useRef, useCallback } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import Header from "../../components/layout/Header";
import Sidebar from "../../components/layout/Sidebar";
import { tasks as taskBank } from "../../data/tasks";
import { topics } from "../../data/topics";
import {
  getMasteryTest,
  assignMasteryTest,
  saveMasteryAnswer,
  completeMasteryTest,
} from "../../services/db";
import { awardPoints } from "../../core/scoringEngine";
import "./mastery.css";    // additions only
import "../../styles/layout.css";

/* ── Helpers ── */
const formatTime = (secs) => {
  const m = Math.floor(secs / 60);
  const s = secs % 60;
  return m > 0 ? `${m}m ${s.toString().padStart(2, "0")}s` : `${s}s`;
};

const getMasteryTitle = (pct) => {
  if (pct >= 95) return "Expert";
  if (pct >= 80) return "Advanced";
  if (pct >= 60) return "Learner";
  return null; // no title below 60
};

const pickMasteryBank = (topicId) => {
  const t = taskBank?.[topicId];
  // prefer mastery-specific tasks, fall back to homework
  return t?.mastery?.length ? t.mastery : (t?.homework?.length ? t.homework : []);
};

/* ── Icons ── */
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
   SCORE THRESHOLD LOGIC
   80%+  → mastery unlocked
   60-79 → soft nudge to diagnostics
   <60   → strong diagnostic recommendation
════════════════════════════════════════════ */
const ResultsCTA = ({ pct, topicId }) => {
  if (pct >= 80) {
    return (
      <div className="ms-result-cta ms-result-cta--success">
        <div className="ms-result-cta__icon">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>
        <div>
          <p className="ms-result-cta__title">Mastery card unlocked</p>
          <p className="ms-result-cta__sub">This topic has been added to your profile.</p>
        </div>
      </div>
    );
  }

  if (pct >= 60) {
    return (
      <div className="ms-result-cta ms-result-cta--nudge">
        <div className="ms-result-cta__icon">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
        </div>
        <div>
          <p className="ms-result-cta__title">Almost there</p>
          <p className="ms-result-cta__sub">
            You're close — running a diagnostic may reveal what's holding you back.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="ms-result-cta ms-result-cta--warn">
      <div className="ms-result-cta__icon">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
          <line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
        </svg>
      </div>
      <div>
        <p className="ms-result-cta__title">Reasoning gaps likely present</p>
        <p className="ms-result-cta__sub">
          Your result suggests gaps that need attention. We recommend running a diagnostic to find exactly where.
        </p>
      </div>
    </div>
  );
};

/* ════════════════════════════════════════════
   PAGE
════════════════════════════════════════════ */
const MasteryTestPage = () => {
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

  /* ── Timer ── */
  const [elapsed,  setElapsed]  = useState(0);
  const timerRef               = useRef(null);
  const startTimer = () => {
    clearInterval(timerRef.current);
    timerRef.current = setInterval(() => setElapsed(e => e + 1), 1000);
  };
  const stopTimer = () => clearInterval(timerRef.current);
  useEffect(() => () => clearInterval(timerRef.current), []);

  const savingRef = useRef(false);

  /* ── Load / create ── */
  useEffect(() => {
    if (!user?.uid) return;
    const load = async () => {
      const masteryTasks = pickMasteryBank(topicId);
      if (!masteryTasks?.length) { setPageState("empty"); return; }

      let doc = await getMasteryTest(user.uid, topicId);
      if (!doc) {
        doc = await assignMasteryTest(user.uid, topicId, {
          topicTitle: topicMeta?.title || topicId,
          tasks: masteryTasks,
        });
      }
      if (!doc) { setPageState("empty"); return; }

      setHwDoc(doc);
      // Restore elapsed time for in-progress test
      if (doc.status === "in_progress") setElapsed(doc.timeSecs || 0);
      setPageState(doc.status === "completed" ? "results" : "intro");
    };
    load();
  }, [user?.uid, topicId]); // eslint-disable-line

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
      const updated = await saveMasteryAnswer(user.uid, topicId, taskId, label);
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
    stopTimer();
    try {
      const result = await completeMasteryTest(user.uid, topicId, elapsed);
      if (result && !result._error) {
        setHwDoc(result);
        setPageState("results");
        const pct = result.score?.percent ?? 0;
        await awardPoints(user.uid, "mastery_complete", { percent: pct });
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    } finally { setCompleting(false); }
  };

  const handleStartSolving = () => {
    const firstUnanswered = tasks.findIndex(t => t.userAnswer == null);
    setCurrentIdx(firstUnanswered >= 0 ? firstUnanswered : 0);
    startTimer();
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

  /* ── Score ── */
  const scoreData = (() => {
    if (!hwDoc || pageState !== "results") return null;
    const correct = tasks.filter(t => t.userAnswer === t.correct).length;
    const total   = tasks.length;
    const pct     = total ? Math.round((correct / total) * 100) : 0;
    return { correct, total, pct };
  })();

  const scoreColor = (pct) =>
    pct >= 80 ? "var(--teal)" : pct >= 60 ? "#d35400" : "#c0392b";

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
            <p className="hw-eyebrow">Mastery Test</p>
            <h2 className="hw-empty__title">No tasks available</h2>
            <p className="hw-empty__sub">Mastery test tasks for this topic haven't been added yet.</p>
            <Link to="/theory" className="hw-btn hw-btn--ghost">
              <ChevronLeft /> Back to Theory
            </Link>
          </div>
        )}

        {/* ── Intro ── */}
        {pageState === "intro" && (
          <div className="hw-intro-wrap">
            <div className="hw-intro">

              <nav className="hw-trail">
                <Link to="/theory" className="hw-trail__link">Theory</Link>
                <span className="hw-trail__sep">→</span>
                <span className="hw-trail__cur">Mastery Test</span>
              </nav>

              <div className="hw-intro__hero">
                <p className="hw-eyebrow">Mastery Test</p>
                <h1 className="hw-intro__title">{topicMeta?.title || topicId}</h1>
                <p className="hw-intro__desc">
                  A hard set of problems to confirm you've truly mastered this topic.
                  Score 80% or higher to unlock a mastery card on your profile.
                  Progress is saved — you can continue where you left off.
                </p>
              </div>

              <div className="hw-intro__stats">
                <div className="hw-intro__stat">
                  <strong>{totalTasks}</strong>
                  <span>Tasks</span>
                </div>
                <div className="hw-intro__stat-div" />
                <div className="hw-intro__stat">
                  <strong>20–30</strong>
                  <span>Minutes</span>
                </div>
                <div className="hw-intro__stat-div" />
                <div className="hw-intro__stat">
                  <strong>80%</strong>
                  <span>To master</span>
                </div>
              </div>

              {answeredCount > 0 && (
                <div className="hw-intro__resume">
                  <span className="hw-intro__resume-pip" />
                  {answeredCount} of {totalTasks} answers saved — continue where you left off.
                </div>
              )}

              <ul className="hw-intro__rules">
                <li>Navigate freely between questions</li>
                <li>Submit only after all questions are answered</li>
                <li>Score 80%+ to unlock a mastery card on your profile</li>
                <li>Below 80% — a diagnostic will help you find what's missing</li>
              </ul>

              <button className="hw-btn hw-btn--primary" onClick={handleStartSolving}>
                {answeredCount > 0 ? "Continue Test" : "Begin Test"}
                <ChevronRight />
              </button>

            </div>
          </div>
        )}

        {/* ── Solving ── */}
        {pageState === "solving" && (
          <div className="hw-solve-outer">

            <div className="hw-doc-header">
              <div className="hw-doc-header__left">
                <Link to="/theory" className="hw-doc-header__back">
                  <ChevronLeft /><span>Theory</span>
                </Link>
                <span className="hw-doc-header__sep">/</span>
                <span className="hw-doc-header__topic">{topicMeta?.title || topicId}</span>
              </div>
              <div className="hw-doc-header__right">
                {/* Timer */}
                <span className="ms-timer">
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                    <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
                  </svg>
                  {formatTime(elapsed)}
                </span>
                <span className="hw-doc-header__count">
                  {answeredCount}<em>/{totalTasks}</em>
                </span>
                <span className="hw-doc-header__count-label">answered</span>
              </div>
            </div>

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

            <div className="hw-workspace">
              {currentTask && (
                <>
                  <div className="hw-question">
                    <div className="hw-question__counter">
                      <span className="hw-question__num">{String(currentIdx + 1).padStart(2, "0")}</span>
                      <span className="hw-question__total">/ {String(totalTasks).padStart(2, "0")}</span>
                    </div>
                    <h2 className="hw-question__text">{currentTask.text}</h2>
                  </div>

                  <div className="hw-options">
                    {(currentTask.options || []).map(opt => {
                      const isSelected = currentTask.userAnswer === opt.label;
                      return (
                        <button
                          key={opt.label}
                          className={`hw-option${isSelected ? " hw-option--selected" : ""}`}
                          onClick={() => handleSelectAnswer(currentTask.id, opt.label)}
                        >
                          <span className="hw-option__badge">{opt.label}</span>
                          <span className="hw-option__text">{opt.value}</span>
                          <span className="hw-option__indicator">
                            {isSelected && <CheckIcon />}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </>
              )}

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
                    title={!allAnswered ? `${totalTasks - answeredCount} unanswered` : undefined}
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

              {isLastTask && !allAnswered && (
                <p className="hw-nav__remaining">
                  {totalTasks - answeredCount} question{totalTasks - answeredCount !== 1 ? "s" : ""} still unanswered
                </p>
              )}
            </div>
          </div>
        )}

        {/* ── Results ── */}
        {pageState === "results" && scoreData && (
          <div className="hw-results-wrap">
            <div className="hw-results">

              <div className="hw-results__header">
                <p className="hw-eyebrow">
                  {getMasteryTitle(scoreData.pct)
                    ? `${getMasteryTitle(scoreData.pct)} · ${topicMeta?.title || topicId}`
                    : topicMeta?.title || topicId}
                </p>

                <div className="hw-results__score-row">
                  <span className="hw-results__pct" style={{ color: scoreColor(scoreData.pct) }}>
                    {scoreData.pct}%
                  </span>
                  <div className="hw-results__score-meta">
                    <span className="hw-results__tally">
                      {scoreData.correct} correct out of {scoreData.total}
                    </span>
                    <span className="hw-results__verdict">
                      {scoreData.pct >= 80
                        ? "Mastery confirmed — this topic is yours."
                        : scoreData.pct >= 60
                        ? "Close, but not quite there yet."
                        : "Significant gaps remain — revisit theory and diagnostics."}
                    </span>
                    {hwDoc?.timeSecs > 0 && (
                      <span className="ms-result-time">{formatTime(hwDoc.timeSecs)}</span>
                    )}
                  </div>
                </div>

                {/* Threshold-aware CTA block */}
                <ResultsCTA pct={scoreData.pct} topicId={topicId} />
              </div>

              {/* Answer breakdown */}
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
                      <div className="hw-result-row__head">
                        <span className="hw-result-row__icon">
                          {isCorrect ? <CheckIcon /> : <XIcon />}
                        </span>
                        <span className="hw-result-row__num">Q{String(i + 1).padStart(2, "0")}</span>
                      </div>
                      <p className="hw-result-row__q">{t.text}</p>
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
                      {t.explanation && (
                        <p className="hw-result-row__explanation">{t.explanation}</p>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Actions — depend on score */}
              <div className="hw-results__actions">
                {scoreData.pct >= 80 ? (
                  <>
                    <Link to="/profile" className="hw-btn hw-btn--primary">
                      View Profile Card <ChevronRight />
                    </Link>
                    <Link to="/diagnostics" className="hw-btn hw-btn--ghost">
                      Run Diagnostic
                    </Link>
                  </>
                ) : scoreData.pct >= 60 ? (
                  <>
                    <button className="hw-btn hw-btn--primary" onClick={() => setPageState("intro")}>
                      Retry Test <ChevronRight />
                    </button>
                    <Link to="/diagnostics" className="hw-btn hw-btn--ghost">
                      Run Diagnostic
                    </Link>
                  </>
                ) : (
                  <>
                    <Link to="/diagnostics" className="hw-btn hw-btn--primary">
                      Run Diagnostic <ChevronRight />
                    </Link>
                    <Link to="/theory" className="hw-btn hw-btn--ghost">
                      Review Theory
                    </Link>
                  </>
                )}
              </div>

            </div>
          </div>
        )}

      </main>
    </div>
  );
};

export default MasteryTestPage;