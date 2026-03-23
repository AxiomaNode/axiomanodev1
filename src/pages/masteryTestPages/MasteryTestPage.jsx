import { useState, useEffect, useRef, useCallback } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import Header from "../../components/layout/Header";
import Sidebar from "../../components/layout/Sidebar";
import NotesPanel from "../../components/NotesPanel";
import { topics } from "../../data/topics";
import { generatePracticeSession } from "../../data/questionTemplates";
import {
  getMasteryTest,
  assignMasteryTest,
  saveMasteryAnswer,
  completeMasteryTest,
} from "../../services/db";
import { awardPoints } from "../../core/scoringEngine";
import "./mastery.css";
import "../../styles/layout.css";

const formatTime = (secs) => {
  const m = Math.floor(secs / 60);
  const s = secs % 60;
  return m > 0 ? `${m}m ${s.toString().padStart(2, "0")}s` : `${s}s`;
};

const PERF = [
  { min: 100, grade: "S", title: "Perfect",        sub: "Flawless. Every answer right.",   color: "#9b59b6" },
  { min: 87,  grade: "A", title: "Excellent",       sub: "Sharp reasoning throughout.",     color: "#2a8fa0" },
  { min: 73,  grade: "B", title: "Good",            sub: "Solid understanding overall.",    color: "#27ae60" },
  { min: 60,  grade: "C", title: "Getting there",   sub: "Review weak areas and retry.",    color: "#d35400" },
  { min: 0,   grade: "D", title: "Keep practising", sub: "Every expert started here.",      color: "#c0392b" },
];
const getPerf = (pct) => PERF.find(p => pct >= p.min);
const getMasteryTitle = (pct) => {
  if (pct >= 95) return "Expert";
  if (pct >= 80) return "Advanced";
  if (pct >= 60) return "Learner";
  return null;
};

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
    <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

const GridBg = () => <div className="ms-grid" aria-hidden="true" />;

const ThresholdCard = ({ pct }) => {
  if (pct >= 80) return (
    <div className="ms-threshold ms-threshold--pass">
      <div className="ms-threshold__icon">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
          <polyline points="20 6 9 17 4 12" />
        </svg>
      </div>
      <div>
        <p className="ms-threshold__title">Mastery card unlocked</p>
        <p className="ms-threshold__sub">This topic has been added to your profile.</p>
      </div>
    </div>
  );
  if (pct >= 60) return (
    <div className="ms-threshold ms-threshold--close">
      <div className="ms-threshold__icon">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
          <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
        </svg>
      </div>
      <div>
        <p className="ms-threshold__title">Almost there</p>
        <p className="ms-threshold__sub">You're close — run a diagnostic to find what's holding you back.</p>
      </div>
    </div>
  );
  return (
    <div className="ms-threshold ms-threshold--fail">
      <div className="ms-threshold__icon">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
          <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
          <line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
        </svg>
      </div>
      <div>
        <p className="ms-threshold__title">Reasoning gaps likely present</p>
        <p className="ms-threshold__sub">Run a diagnostic to find exactly where your reasoning breaks.</p>
      </div>
    </div>
  );
};

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
  const [lockedIdx,   setLockedIdx]   = useState(new Set());

  const [elapsed, setElapsed] = useState(0);
  const timerRef = useRef(null);
  const startTimer = () => {
    clearInterval(timerRef.current);
    timerRef.current = setInterval(() => setElapsed(e => e + 1), 1000);
  };
  const stopTimer = () => clearInterval(timerRef.current);
  useEffect(() => () => clearInterval(timerRef.current), []);

  const savingRef  = useRef(false);
  const autoAdvRef = useRef(null);

  useEffect(() => {
    if (!user?.uid) return;
    const load = async () => {
      let doc = await getMasteryTest(user.uid, topicId);
      if (!doc) {
        const masteryTasks = generatePracticeSession(topicId, 15);
        if (!masteryTasks?.length) { setPageState("empty"); return; }
        doc = await assignMasteryTest(user.uid, topicId, {
          topicTitle: topicMeta?.title || topicId,
          tasks: masteryTasks,
        });
      }
      if (!doc) { setPageState("empty"); return; }
      setHwDoc(doc);
      if (doc.tasks) {
        const answered = new Set(
          doc.tasks.map((t, i) => t.userAnswer != null ? i : null).filter(i => i !== null)
        );
        setLockedIdx(answered);
      }
      if (doc.status === "in_progress") setElapsed(doc.timeSecs || 0);
      setPageState(doc.status === "completed" ? "results" : "intro");
    };
    load();
  }, [user?.uid, topicId]); // eslint-disable-line

  const tasks         = hwDoc?.tasks || [];
  const totalTasks    = tasks.length;
  const answeredCount = tasks.filter(t => t.userAnswer != null).length;
  const allAnswered   = answeredCount === totalTasks && totalTasks > 0;
  const currentTask   = tasks[currentIdx] || null;
  const isLastTask    = currentIdx + 1 >= totalTasks;
  const isLocked      = lockedIdx.has(currentIdx);

  const handleSelectAnswer = async (taskId, label) => {
    if (!user?.uid || isLocked) return;
    setLockedIdx(prev => new Set([...prev, currentIdx]));
    setHwDoc(prev => {
      if (!prev) return prev;
      return { ...prev, tasks: prev.tasks.map(t => t.id === taskId ? { ...t, userAnswer: label } : t) };
    });
    if (!savingRef.current) {
      savingRef.current = true;
      try {
        const updated = await saveMasteryAnswer(user.uid, topicId, taskId, label);
        if (updated && !updated._error) setHwDoc(updated);
      } finally { savingRef.current = false; }
    }
    if (!isLastTask) {
      clearTimeout(autoAdvRef.current);
      autoAdvRef.current = setTimeout(() => setCurrentIdx(i => i + 1), 800);
    }
  };
  useEffect(() => () => clearTimeout(autoAdvRef.current), []);

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

  const handleRetry = async () => {
    if (!user?.uid) return;
    setPageState("loading");
    const masteryTasks = generatePracticeSession(topicId, 15);
    const doc = await assignMasteryTest(user.uid, topicId, {
      topicTitle: topicMeta?.title || topicId,
      tasks: masteryTasks,
      forceNew: true,
    });
    if (!doc) { setPageState("empty"); return; }
    setHwDoc(doc);
    setLockedIdx(new Set());
    setElapsed(0);
    setCurrentIdx(0);
    setPageState("intro");
  };

  useEffect(() => {
    if (pageState !== "solving") return;
    const handler = (e) => {
      if (["INPUT", "TEXTAREA", "SELECT"].includes(e.target.tagName)) return;
      if (e.target.contentEditable === "true") return;
      if (e.key === "ArrowLeft")  { e.preventDefault(); handlePrev(); }
      if (e.key === "ArrowRight" || e.key === "Enter") {
        e.preventDefault();
        if (!isLastTask) handleNext();
        else if (allAnswered) handleFinish();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [pageState, handleNext, handlePrev, isLastTask, allAnswered]); // eslint-disable-line

  const scoreData = (() => {
    if (!hwDoc || pageState !== "results") return null;
    const correct = tasks.filter(t => t.userAnswer === t.correct).length;
    const total   = tasks.length;
    const pct     = total ? Math.round((correct / total) * 100) : 0;
    const xp      = Math.round(pct * 3.2);
    return { correct, total, pct, xp };
  })();

  return (
    <div className="page-shell">
      <Header sidebarOpen={sidebarOpen} onToggleSidebar={() => setSidebarOpen(v => !v)} />
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <main className="page-main ms-page">

        {pageState === "loading" && (
          <div className="ms-loading">
            <span className="ms-loading__dot" />
            <span className="ms-loading__dot" />
            <span className="ms-loading__dot" />
          </div>
        )}

        {pageState === "empty" && (
          <div className="ms-empty">
            <p className="ms-eyebrow">Mastery Test</p>
            <h2 className="ms-empty__title">No tasks available yet</h2>
            <p className="ms-empty__sub">Tasks for this topic haven't been added yet.</p>
            <Link to="/theory" className="ms-btn ms-btn--ghost"><ChevronLeft /> Back to Theory</Link>
          </div>
        )}

        {/* ── INTRO ── */}
        {pageState === "intro" && (
          <div className="ms-intro">
            <GridBg />
            <section className="ms-hero">
              <div className="ms-hero__inner">
                <div className="ms-hero__left">
                  <nav className="ms-breadcrumb">
                    <Link to="/home" className="ms-breadcrumb__item">Home</Link>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="9 18 15 12 9 6"/></svg>
                    <Link to="/theory" className="ms-breadcrumb__item">Theory</Link>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="9 18 15 12 9 6"/></svg>
                    <span className="ms-breadcrumb__cur">Mastery Test</span>
                  </nav>
                  <div className="ms-hero__tag">
                    <span className="ms-hero__dot" />
                    Final Assessment
                  </div>
                  <h1 className="ms-hero__title">{topicMeta?.title || topicId}</h1>
                  <p className="ms-hero__sub">
                    Prove you've closed the gaps. This test is harder than practice —
                    it covers all reasoning areas at once. Score 80% or above to
                    unlock your mastery card on the profile.
                  </p>
                  <div className="ms-hero__stats">
                    <div className="ms-hero__stat">
                      <strong>{totalTasks}</strong>
                      <span>Questions</span>
                    </div>
                    <div className="ms-hero__sdiv" />
                    <div className="ms-hero__stat">
                      <strong>80%</strong>
                      <span>To unlock</span>
                    </div>
                    <div className="ms-hero__sdiv" />
                    <div className="ms-hero__stat">
                      <strong>~20 min</strong>
                      <span>Estimated</span>
                    </div>
                  </div>
                </div>

                <div className="ms-hero__right">
                  <div className="ms-action-card">
                    <div className="ms-action-card__head">
                      <p className="ms-action-card__cap">How it works</p>
                    </div>
                    <div className="ms-action-card__rules">
                      {[
                        "Answers lock after selection — no going back",
                        "No hints, no notes panel",
                        "Progress saves — you can resume anytime",
                        "80%+ unlocks your mastery card on profile",
                      ].map((r, i) => (
                        <div key={i} className="ms-action-rule">
                          <span className="ms-action-rule__dot" />
                          <span>{r}</span>
                        </div>
                      ))}
                    </div>
                    {answeredCount > 0 && (
                      <div className="ms-action-card__resume">
                        <div className="ms-action-card__resume-bar">
                          <div
                            className="ms-action-card__resume-fill"
                            style={{ width: `${Math.round((answeredCount / totalTasks) * 100)}%` }}
                          />
                        </div>
                        <span>{answeredCount}/{totalTasks} saved</span>
                      </div>
                    )}
                    <button className="ms-action-card__btn" onClick={handleStartSolving}>
                      {answeredCount > 0 ? "Continue Test" : "Begin Mastery Test"}
                      <ChevronRight />
                    </button>
                    <p className="ms-action-card__note">
                      {answeredCount > 0
                        ? `${totalTasks - answeredCount} questions remaining`
                        : "Progress is saved automatically"}
                    </p>
                  </div>
                </div>
              </div>
            </section>

            <section className="ms-intro__body">
              <div className="ms-intro__body-inner">
                <div className="ms-info-block">
                  <p className="ms-info-block__cap">What this tests</p>
                  <p className="ms-info-block__text">
                    Unlike practice, this test draws from all five reasoning gap categories at once —
                    discriminant interpretation, double-root recognition, division traps, factoring
                    patterns, and Vieta's formulas. All areas must hold up.
                  </p>
                </div>
                <div className="ms-info-block">
                  <p className="ms-info-block__cap">What you get</p>
                  <p className="ms-info-block__text">
                    Pass with 80%+ and a mastery card is added to your profile permanently.
                    The card shows your title — Learner, Advanced, or Expert — and the date
                    you earned it.
                  </p>
                </div>
                <div className="ms-info-block">
                  <p className="ms-info-block__cap">If you don't pass</p>
                  <p className="ms-info-block__text">
                    Your result shows which questions you got wrong. Run a diagnostic to
                    find the exact gap, work through theory and practice, then retry.
                  </p>
                </div>
              </div>
            </section>
          </div>
        )}

        {/* ── SOLVING ── */}
        {pageState === "solving" && (
          <div className="ms-solve">
            <GridBg />
            <div className="ms-solve__bar">
              <div className="ms-solve__bar-left">
                <Link to="/theory" className="ms-solve__back">
                  <ChevronLeft /> Theory
                </Link>
                <span className="ms-solve__sep">/</span>
                <span className="ms-solve__topic">{topicMeta?.title || topicId}</span>
              </div>
              <div className="ms-solve__bar-center">
                <div className="ms-solve__segs">
                  {tasks.map((t, i) => (
                    <button
                      key={i}
                      className={[
                        "ms-seg",
                        i === currentIdx     ? "ms-seg--active"   : "",
                        t.userAnswer != null ? "ms-seg--answered" : "",
                      ].filter(Boolean).join(" ")}
                      onClick={() => setCurrentIdx(i)}
                      title={`Q${i + 1}`}
                    />
                  ))}
                </div>
                <span className="ms-solve__progress">{answeredCount}/{totalTasks} answered</span>
              </div>
              <div className="ms-solve__bar-right">
                <span className="ms-solve__timer">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                    <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
                  </svg>
                  {formatTime(elapsed)}
                </span>
                <span className="ms-solve__counter">{currentIdx + 1} / {totalTasks}</span>
              </div>
            </div>

            <div className="diag-shell diag-shell--with-notes ms-solve__shell">
              <div className="diag-shell__main ms-solve__main">
                {currentTask && (
                  <div className="ms-question-card">
                    <div className="ms-question-card__meta">
                      <span className="ms-question-card__num">
                        {String(currentIdx + 1).padStart(2, "0")}
                        <em>/{String(totalTasks).padStart(2, "0")}</em>
                      </span>
                      {currentTask.category && (
                        <span className="ms-question-card__cat">{currentTask.category}</span>
                      )}
                      {isLocked && (
                        <span className="ms-locked-pill">
                          <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                            <rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                          </svg>
                          locked
                        </span>
                      )}
                    </div>

                    <h2 className="ms-question-card__text">{currentTask.text}</h2>

                    <div className="ms-options">
                      {(currentTask.options || []).map(opt => {
                        const isSelected = currentTask.userAnswer === opt.label;
                        const isDimmed   = isLocked && !isSelected;
                        return (
                          <button
                            key={opt.label}
                            className={[
                              "ms-option",
                              isSelected ? "ms-option--selected" : "",
                              isDimmed   ? "ms-option--dim"      : "",
                            ].filter(Boolean).join(" ")}
                            onClick={() => handleSelectAnswer(currentTask.id, opt.label)}
                            disabled={isLocked}
                          >
                            <span className="ms-option__lbl">{opt.label}</span>
                            <span className="ms-option__val">{opt.value}</span>
                            {isSelected && <span className="ms-option__check"><CheckIcon /></span>}
                          </button>
                        );
                      })}
                    </div>

                    <div className="ms-question-card__nav">
                      <button
                        className="ms-navbtn ms-navbtn--ghost"
                        onClick={handlePrev}
                        disabled={currentIdx === 0}
                      >
                        <ChevronLeft /> Prev
                      </button>
                      <div className="ms-navbtn__hint">
                        <kbd>←</kbd><kbd>→</kbd> navigate
                      </div>
                      {isLastTask ? (
                        <button
                          className={`ms-navbtn${allAnswered ? " ms-navbtn--primary" : " ms-navbtn--ghost ms-navbtn--disabled"}`}
                          onClick={handleFinish}
                          disabled={!allAnswered || completing}
                        >
                          {completing ? "Submitting…" : "Submit"} <ChevronRight />
                        </button>
                      ) : (
                        <button className="ms-navbtn ms-navbtn--primary" onClick={handleNext}>
                          Next <ChevronRight />
                        </button>
                      )}
                    </div>

                    {isLastTask && !allAnswered && (
                      <p className="ms-question-card__remaining">
                        {totalTasks - answeredCount} question{totalTasks - answeredCount !== 1 ? "s" : ""} unanswered
                      </p>
                    )}
                  </div>
                )}
              </div>
              <NotesPanel sessionId={`mastery_${topicId}`} />
            </div>
          </div>
        )}

        {/* ── RESULTS ── */}
        {pageState === "results" && scoreData && (() => {
          const perf  = getPerf(scoreData.pct);
          const title = getMasteryTitle(scoreData.pct);
          return (
            <div className="ms-results">
              <GridBg />
              <section className="ms-results-hero">
                <div className="ms-results-hero__inner">
                  <div className="ms-results-hero__left">
                    <nav className="ms-breadcrumb">
                      <Link to="/home" className="ms-breadcrumb__item">Home</Link>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="9 18 15 12 9 6"/></svg>
                      <span className="ms-breadcrumb__cur">Mastery Test Results</span>
                    </nav>
                    <div className="ms-results-hero__grade-row">
                      <span className="ms-results-grade" style={{ color: perf.color }}>{perf.grade}</span>
                      <div>
                        <h1 className="ms-results-title">{perf.title}</h1>
                        <p className="ms-results-sub">{perf.sub}</p>
                      </div>
                    </div>
                    <div className="ms-results-stats">
                      <div className="ms-results-stat">
                        <strong style={{ color: perf.color }}>{scoreData.pct}%</strong>
                        <span>Score</span>
                      </div>
                      <div className="ms-results-stat__div" />
                      <div className="ms-results-stat">
                        <strong>{scoreData.correct}/{scoreData.total}</strong>
                        <span>Correct</span>
                      </div>
                      <div className="ms-results-stat__div" />
                      <div className="ms-results-stat">
                        <strong style={{ color: "var(--teal)" }}>+{scoreData.xp}</strong>
                        <span>XP earned</span>
                      </div>
                      {title && (
                        <>
                          <div className="ms-results-stat__div" />
                          <div className="ms-results-stat">
                            <strong style={{ color: title === "Expert" ? "#9b59b6" : title === "Advanced" ? "#d35400" : "var(--teal)" }}>
                              {title}
                            </strong>
                            <span>Title</span>
                          </div>
                        </>
                      )}
                      {hwDoc?.timeSecs > 0 && (
                        <>
                          <div className="ms-results-stat__div" />
                          <div className="ms-results-stat">
                            <strong>{formatTime(hwDoc.timeSecs)}</strong>
                            <span>Time</span>
                          </div>
                        </>
                      )}
                    </div>
                    <div className="ms-results-actions">
                      {scoreData.pct >= 80 ? (
                        <>
                          <Link to="/profile" className="ms-btn ms-btn--primary">View Profile Card <ChevronRight /></Link>
                          <button className="ms-btn ms-btn--ghost" onClick={handleRetry}>Retry Test</button>
                        </>
                      ) : scoreData.pct >= 60 ? (
                        <>
                          <button className="ms-btn ms-btn--primary" onClick={handleRetry}>Retry Test <ChevronRight /></button>
                          <Link to="/diagnostics" className="ms-btn ms-btn--ghost">Run Diagnostic</Link>
                        </>
                      ) : (
                        <>
                          <Link to="/diagnostics" className="ms-btn ms-btn--primary">Run Diagnostic <ChevronRight /></Link>
                          <Link to="/theory" className="ms-btn ms-btn--ghost">Review Theory</Link>
                          <button className="ms-btn ms-btn--ghost" onClick={handleRetry}>Retry Test</button>
                        </>
                      )}
                    </div>
                  </div>
                  <div className="ms-results-hero__right">
                    <ThresholdCard pct={scoreData.pct} />
                    <div className="ms-score-ring-wrap">
                      <svg className="ms-score-ring" viewBox="0 0 120 120">
                        <circle cx="60" cy="60" r="48" fill="none" stroke="var(--border)" strokeWidth="8" />
                        <circle
                          cx="60" cy="60" r="48" fill="none"
                          stroke={perf.color} strokeWidth="8"
                          strokeDasharray={`${(scoreData.pct / 100) * 301.6} 301.6`}
                          strokeLinecap="round" transform="rotate(-90 60 60)"
                          style={{ transition: "stroke-dasharray 1s ease" }}
                        />
                      </svg>
                      <div className="ms-score-ring-center">
                        <strong style={{ color: perf.color }}>{scoreData.pct}%</strong>
                        <span>{topicMeta?.title}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              <section className="ms-breakdown">
                <div className="ms-breakdown__inner">
                  <div className="ms-breakdown__header">
                    <p className="ms-breakdown__eyebrow">Answer Breakdown</p>
                    <span className="ms-breakdown__count">
                      {tasks.filter(t => t.userAnswer === t.correct).length} correct ·{" "}
                      {tasks.filter(t => t.userAnswer !== t.correct).length} wrong
                    </span>
                  </div>
                  <div className="ms-breakdown__list">
                    {tasks.map((t, i) => {
                      const isCorrect  = t.userAnswer === t.correct;
                      const userOpt    = t.options?.find(o => o.label === t.userAnswer);
                      const correctOpt = t.options?.find(o => o.label === t.correct);
                      return (
                        <div key={t.id} className={`ms-row ${isCorrect ? "ms-row--ok" : "ms-row--wrong"}`}>
                          <div className="ms-row__head">
                            <span className="ms-row__icon">{isCorrect ? <CheckIcon /> : <XIcon />}</span>
                            <span className="ms-row__num">Q{String(i + 1).padStart(2, "0")}</span>
                            {t.category && <span className="ms-row__cat">{t.category}</span>}
                          </div>
                          <p className="ms-row__q">{t.text}</p>
                          <div className="ms-row__answers">
                            <span className={`ms-pill ${isCorrect ? "ms-pill--ok" : "ms-pill--wrong"}`}>
                              <span className="ms-pill__label">Your answer</span>
                              <span className="ms-pill__val">
                                {userOpt ? `${userOpt.label} — ${userOpt.value}` : "Not answered"}
                              </span>
                            </span>
                            {!isCorrect && correctOpt && (
                              <span className="ms-pill ms-pill--ok">
                                <span className="ms-pill__label">Correct</span>
                                <span className="ms-pill__val">{correctOpt.label} — {correctOpt.value}</span>
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </section>
            </div>
          );
        })()}

      </main>
    </div>
  );
};

export default MasteryTestPage;