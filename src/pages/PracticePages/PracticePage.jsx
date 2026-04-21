import { useMemo, useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import Header from "../../components/layout/Header";
import Sidebar from "../../components/layout/Sidebar";
import NotesPanel from "../../components/NotesPanel";
import { topics } from "../../data/topics";
import { tasks as taskBank } from "../../data/tasks";
import { savePractice, savePracticeSession, getActiveGaps } from "../../services/db";
import { awardPoints } from "../../core/scoringEngine";
import { generatePracticeSession } from "../../data/questionTemplates";
import "./practice.css";
import "../../styles/diag-shell.css";
import "../../styles/layout.css";

const pickBank = (topicId) => {
  const t = taskBank?.[topicId];
  return t?.practice?.length ? t.practice : (t?.homework?.length ? t.homework : []);
};

const formatTime = (secs) => {
  const m = Math.floor(secs / 60);
  const s = secs % 60;
  return m > 0 ? `${m}m ${s.toString().padStart(2, "0")}s` : `${s}s`;
};

const scoreColor = (pct) =>
  pct >= 70 ? "#27ae60" : pct >= 40 ? "#d35400" : "#c0392b";

/* ── Gap Mode Banner ── */
const GapModeBanner = ({ gaps, practiceMode, onSwitch }) => {
  if (!gaps?.length) return null;
  const isGapMode = practiceMode === "gap";
  return (
    <div className="pr-gap-banner">
      <div className="pr-gap-banner__left">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
          <circle cx="12" cy="12" r="10" />
          <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
        </svg>
        {isGapMode
          ? <span><strong>{gaps.length} gap{gaps.length !== 1 ? "s" : ""}</strong> detected — practicing targeted tasks</span>
          : <span>You have <strong>{gaps.length} active gap{gaps.length !== 1 ? "s" : ""}</strong> — switch to gap practice?</span>
        }
      </div>
      <button className="pr-gap-banner__btn" onClick={onSwitch}>
        {isGapMode ? "Switch to free practice" : "Switch to gap practice"}
      </button>
    </div>
  );
};

/* ── Gap Context Pill ── */
const GapContextPill = ({ gaps, taskGapTag }) => {
  if (!gaps?.length || !taskGapTag) return null;
  const gap = gaps.find((g) => (g.gapId || g.id) === taskGapTag);
  if (!gap) return null;
  return (
    <div className="pr-gap-pill">
      <span className="pr-gap-pill__label">Gap focus</span>
      <span className="pr-gap-pill__title">{gap.title}</span>
    </div>
  );
};

/* ── Targeted Mode Header ── */
const TargetedHeader = ({ gapTitle, topicTitle, onClear }) => (
  <div className="pr-targeted-header">
    <div className="pr-targeted-header__left">
      <span className="pr-targeted-header__label">Targeted training</span>
      <span className="pr-targeted-header__gap">{gapTitle}</span>
      {topicTitle && <span className="pr-targeted-header__topic">· {topicTitle}</span>}
    </div>
    <button className="pr-targeted-header__clear" onClick={onClear}>
      Switch to free practice
    </button>
  </div>
);

const PracticePage = () => {
  const { user }   = useAuth();
  const location   = useLocation();

  // Read incoming targeted state from Results page
  const incomingGapId    = location.state?.gapId    ?? null;
  const incomingGapTitle = location.state?.gapTitle ?? null;
  const incomingTopicId  = location.state?.topicId  ?? null;

  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [topicId,      setTopicId]      = useState(null);
  const [idx,          setIdx]          = useState(0);
  const [answers,      setAnswers]      = useState({});
  const [done,         setDone]         = useState(false);
  const [saving,       setSaving]       = useState(false);
  const [saved,        setSaved]        = useState(false);
  const [started,      setStarted]      = useState(false);

  const [activeGaps,   setActiveGaps]   = useState([]);
  const [practiceMode, setPracticeMode] = useState("free");

  // Targeted mode state — set from incoming route state
  const [targetedGapId,    setTargetedGapId]    = useState(incomingGapId);
  const [targetedGapTitle, setTargetedGapTitle] = useState(incomingGapTitle);
  const isTargeted = !!targetedGapId;

  const [sessionId, setSessionId] = useState(() => `pr_${Date.now()}`);

  const [elapsed, setElapsed] = useState(0);
  const timerRef              = useRef(null);

  const availableTopics = useMemo(
    () => topics.filter((t) => pickBank(t.id).length > 0),
    []
  );

  const [bank, setBank] = useState([]);
  const current = bank[idx];

  const startTimer = () => {
    clearInterval(timerRef.current);
    setElapsed(0);
    timerRef.current = setInterval(() => setElapsed((e) => e + 1), 1000);
  };
  const stopTimer = () => clearInterval(timerRef.current);
  useEffect(() => () => clearInterval(timerRef.current), []);

  // If incoming gapId — immediately set topic and start in targeted mode
  useEffect(() => {
    if (!incomingGapId || !incomingTopicId) return;

    setTopicId(incomingTopicId);
    setTargetedGapId(incomingGapId);
    setTargetedGapTitle(incomingGapTitle);
    setPracticeMode("gap");

    // Generate targeted bank immediately
    const generated = generatePracticeSession(incomingTopicId, 24, incomingGapId);
    setBank(generated);
    setStarted(false); // still show start modal so user can see what they're doing
  }, []); // eslint-disable-line — runs once on mount

  // Fetch active gaps when topicId changes (for non-targeted flow)
  useEffect(() => {
    if (!user?.uid || !topicId || isTargeted) { return; }
    let cancelled = false;
    getActiveGaps(user.uid, topicId).then((gaps) => {
      if (cancelled) return;
      const safeGaps = Array.isArray(gaps) ? gaps : [];
      setActiveGaps(safeGaps);
      if (safeGaps.length > 0 && !started) setPracticeMode("gap");
    });
    return () => { cancelled = true; };
  }, [topicId, user?.uid]); // eslint-disable-line

  const selectTopic = (id) => {
    stopTimer();
    setTopicId(id);
    setBank([]);
    setIdx(0);
    setAnswers({});
    setDone(false);
    setSaved(false);
    setStarted(false);
    setElapsed(0);
    setActiveGaps([]);
    setPracticeMode("free");
    setTargetedGapId(null);
    setTargetedGapTitle(null);
    setSessionId(`pr_${Date.now()}`);
  };

  // Clear targeted mode — drop back to free practice
  const clearTargeted = () => {
    setTargetedGapId(null);
    setTargetedGapTitle(null);
    setPracticeMode("free");
    setBank([]);
    setIdx(0);
    setAnswers({});
    setDone(false);
    setSaved(false);
    setStarted(false);
    setElapsed(0);
  };

  const handleStart = () => {
    // If already generated (targeted mode), just start timer
    if (isTargeted && bank.length > 0) {
      setStarted(true);
      setTimeout(startTimer, 50);
      return;
    }

  const tag = isTargeted
    ? targetedGapId
    : practiceMode === "gap" && activeGaps.length > 0
      ? (activeGaps[0]?.gapId || activeGaps[0]?.id)
      : null;

    const generated = generatePracticeSession(topicId, 24, tag);

    setBank(generated);
    setStarted(true);
    setTimeout(startTimer, 50);
  };

  const handleSwitchMode = () => {
    if (started) return;
    setPracticeMode((m) => m === "gap" ? "free" : "gap");
    setIdx(0);
    setAnswers({});
  };

const selectAnswer = (task, label) => {
  setAnswers((prev) => {
    const updated = { ...prev, [task.id]: label };

    savePracticeSession({
      uid: user?.uid,
      topicId,
      sessionId,
      answers: updated,
      idx,
    });

    return updated;
  });
};

  const goNext = () => {
    if (idx + 1 >= bank.length) {
      stopTimer();
      setDone(true);
    } else {
      setIdx((v) => v + 1);
    }
  };
  const goPrev = () => setIdx((v) => Math.max(0, v - 1));

  const finish = async () => {
    if (!user?.uid || !topicId || !bank.length || saving || saved) return;

    const correct = bank.filter((t) => answers[t.id] === t.correct).length;
    const wrong   = bank.length - correct;
    const total   = bank.length;
    const percent = total ? Math.round((correct / total) * 100) : 0;

    setSaving(true);
    try {
      await savePractice(user.uid, {
        topicId,
        topicTitle: topics.find((t) => t.id === topicId)?.title ?? topicId,
        correct, wrong, total, percent, answers,
        timeSecs: elapsed,
        practiceMode,
        targetedGapId: isTargeted ? targetedGapId : null,
      });
      await awardPoints(user.uid, "practice_complete", { percent });
      setSaved(true);
    } finally {
      setSaving(false);
    }
  };

  const retry = () => {
    stopTimer();
    setIdx(0);
    setAnswers({});
    setDone(false);
    setSaved(false);
    setStarted(false);
    setElapsed(0);
    setSessionId(`pr_${Date.now()}`);
    // Regenerate bank for targeted mode
    if (isTargeted && topicId) {
      const generated = generatePracticeSession(topicId, 24, targetedGapId);
      setBank(generated);
    }
  };

  useEffect(() => {
    const onKey = (e) => {
      if (["INPUT", "TEXTAREA", "SELECT"].includes(e.target.tagName)) return;

      if (!started && topicId && !done) {
        if (e.key === "Enter") { e.preventDefault(); handleStart(); }
        return;
      }

      if (started && !done && current) {
        if (e.key === "ArrowRight" || e.key === "Enter") {
          e.preventDefault();
          goNext();
        }
        if (e.key === "ArrowLeft") {
          e.preventDefault();
          if (idx > 0) goPrev();
        }
        const opts = current.options || [];
        const match = opts.find(
          (o) => o.label?.toUpperCase() === e.key.toUpperCase()
        );
        if (match) {
          e.preventDefault();
          selectAnswer(current, match.label);
        }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [started, done, current, idx, bank.length, topicId]);

  const activeTopic   = topics.find((t) => t.id === topicId);
  const answeredCount = Object.keys(answers).length;
  const progress      = bank.length ? Math.round((answeredCount / bank.length) * 100) : 0;
  const correctCount  = bank.filter((t) => answers[t.id] === t.correct).length;
  const wrongCount    = bank.length - correctCount;
  const percent       = bank.length ? Math.round((correctCount / bank.length) * 100) : 0;
  const hasGaps       = activeGaps.length > 0;
  const showNotes     = started && !done;

  return (
    <div className="page-shell">
      <Header sidebarOpen={sidebarOpen} onToggleSidebar={() => setSidebarOpen((v) => !v)} />
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <main className="page-main">
        <div className="pr-wrap">

          {/* Hero */}
          <div className="pr-hero">
            <div className="pr-hero__content">
              <div className="pr-hero__left">
                <div className="pr-tag">
                  <span className="pr-dot" />
                  {isTargeted ? "Targeted Training" : practiceMode === "gap" && hasGaps ? "Gap Practice" : "Practice Mode"}
                </div>
                <h1 className="pr-title">Solve &amp; Reinforce</h1>
                <p className="pr-sub">
                  Work through the questions at your own pace. Results and
                  breakdown are shown after you finish.
                </p>
                <div className="pr-stats">
                  <div className="pr-stat">
                    <strong>{availableTopics.length}</strong>
                    <span>Topics</span>
                  </div>
                  <div className="pr-stat__div" />
                  <div className="pr-stat">
                    <strong>
                      {availableTopics.reduce((s, t) => s + pickBank(t.id).length, 0)}
                    </strong>
                    <span>Tasks</span>
                  </div>
                  <div className="pr-stat__div" />
                  <div className="pr-stat">
                    <strong>+XP</strong>
                    <span>On finish</span>
                  </div>
                </div>
              </div>

              <div className="pr-hero__card">
                <p className="pr-hero__cardcap">Current session</p>
                <div className="pr-hero__pills">
                  <div className="pr-hero__pill">
                    <span>Topic</span>
                    <strong>{activeTopic?.title ?? "—"}</strong>
                  </div>
                  <div className="pr-hero__pill">
                    <span>Answered</span>
                    <strong>{topicId ? `${answeredCount}/${bank.length}` : "—"}</strong>
                  </div>
                  <div className="pr-hero__pill">
                    <span>Time</span>
                    <strong>{topicId && !done ? formatTime(elapsed) : "—"}</strong>
                  </div>
                  {topicId && (
                    <div className="pr-hero__pill">
                      <span>Mode</span>
                      <strong>{isTargeted ? "Targeted" : practiceMode === "gap" && hasGaps ? "Gap" : "Free"}</strong>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className={`diag-shell${showNotes ? " diag-shell--with-notes" : ""}`}>
            <div className="diag-shell__main">
              <div className={`pr-layout${isTargeted ? " pr-layout--no-sidebar" : ""}`}>

                {/* Sidebar — hidden in targeted mode since topic is pre-set */}
                {!isTargeted && (
                  <aside className="pr-side">
                    <div className="pr-side__head">
                      <div>
                        <p className="pr-side__eyebrow">Topics</p>
                        <p className="pr-side__hint">Pick what to practice</p>
                      </div>
                      <span className="pr-side__badge">{availableTopics.length}</span>
                    </div>
                    <div className="pr-side__list">
                      {availableTopics.map((t) => (
                        <button
                          key={t.id}
                          className={`pr-topic${topicId === t.id ? " is-active" : ""}`}
                          onClick={() => selectTopic(t.id)}
                        >
                          <div className="pr-topic__icon">
                            {t.icon ? <t.icon size={16} /> : "?"}
                          </div>
                          <div className="pr-topic__txt">
                            <p className="pr-topic__title">{t.title}</p>
                            <p className="pr-topic__sub">Practice available</p>
                          </div>
                        </button>
                      ))}
                    </div>
                    <div className="pr-side__footer">
                      <Link to="/home" className="pr-side__link">← Back to Home</Link>
                    </div>
                  </aside>
                )}

                {/* Board */}
                <div className="pr-board">

                  {/* Targeted mode header */}
                  {isTargeted && !done && (
                    <TargetedHeader
                      gapTitle={targetedGapTitle}
                      topicTitle={activeTopic?.title}
                      onClear={clearTargeted}
                    />
                  )}

                  <div className="pr-board__top">
                    <div className="pr-crumbs">
                      <span className="pr-crumbs__topic">
                        {activeTopic?.title ?? "No topic selected"}
                      </span>
                      {topicId && !done && (
                        <>
                          <span className="pr-crumbs__sep">/</span>
                          <span className="pr-crumbs__sec">Task {idx + 1}</span>
                        </>
                      )}
                    </div>
                    {topicId && !done && (
                      <div className="pr-timer">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none"
                          stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                          <circle cx="12" cy="12" r="10"/>
                          <polyline points="12 6 12 12 16 14"/>
                        </svg>
                        {formatTime(elapsed)}
                      </div>
                    )}
                    {topicId && !done && (
                      <div className="pr-tracker">
                        {bank.map((t, i) => (
                          <div
                            key={i}
                            className={`pr-dotstep${
                              i === idx ? " active"
                              : answers[t.id] != null ? " answered"
                              : ""
                            }`}
                          />
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Empty state — only shown in free mode */}
                  {!topicId && !isTargeted && (
                    <div className="pr-empty">
                      <div className="pr-empty__icon">✦</div>
                      <p className="pr-empty__title">Select a topic to begin</p>
                      <p className="pr-empty__sub">
                        Choose any topic from the sidebar.
                      </p>
                    </div>
                  )}

                  {topicId && started && bank.length === 0 && (
                    <div className="pr-empty">
                      <p className="pr-empty__title">No tasks found</p>
                      <p className="pr-empty__sub">This topic has no practice tasks yet.</p>
                    </div>
                  )}

                  {/* Gap mode banner — only in free mode */}
                  {!isTargeted && topicId && !done && !started && hasGaps && (
                    <GapModeBanner
                      gaps={activeGaps}
                      practiceMode={practiceMode}
                      onSwitch={handleSwitchMode}
                    />
                  )}

                  {/* Start modal */}
                  {topicId && !done && !started && (
                    <div className="pr-start-modal">
                      <div className="pr-start-modal__icon">
                        <svg width="28" height="28" viewBox="0 0 24 24" fill="none"
                          stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                          <circle cx="12" cy="12" r="10"/>
                          <polyline points="12 6 12 12 16 14"/>
                        </svg>
                      </div>
                      <h2 className="pr-start-modal__title">
                        {isTargeted ? targetedGapTitle : activeTopic?.title}
                      </h2>
                      <p className="pr-start-modal__sub">
                        {bank.length} questions · timer starts on begin
                        {isTargeted && " · targeted training"}
                        {!isTargeted && practiceMode === "gap" && hasGaps && " · gap-targeted"}
                      </p>
                      <div className="pr-start-modal__meta">
                        <div className="pr-start-modal__pill">
                          <span>Questions</span>
                          <strong>{bank.length || 24}</strong>
                        </div>
                        <div className="pr-start-modal__pill">
                          <span>Mode</span>
                          <strong>{isTargeted ? "Targeted" : practiceMode === "gap" ? "Gap" : "Free"}</strong>
                        </div>
                        <div className="pr-start-modal__pill">
                          <span>Results</span>
                          <strong>After finish</strong>
                        </div>
                      </div>
                      <button className="pr-navbtn pr-navbtn--primary pr-start-modal__btn" onClick={handleStart}>
                        Begin session →
                      </button>
                    </div>
                  )}

                  {/* Active question */}
                  {topicId && !done && current && started && (
                    <div className="pr-board__inner">
                      <div className="pr-progress">
                        <div className="pr-progress__track">
                          <div className="pr-progress__fill" style={{ width: `${progress}%` }} />
                        </div>
                        <span className="pr-progress__label">
                          {answeredCount}/{bank.length} answered
                        </span>
                      </div>

                      {practiceMode === "gap" && !isTargeted && (
                        <GapContextPill gaps={activeGaps} taskGapTag={current.gapTag} />
                      )}

                      <div className="pr-card pr-card--question">
                        <div className="pr-smallcap">Question {idx + 1} of {bank.length}</div>
                        <p className="pr-question">{current.text}</p>
                      </div>

                      <div className="diag-options">
                        {(current.options || []).map((opt) => {
                          const selected = answers[current.id] === opt.label;
                          return (
                            <button
                              key={opt.value}
                              className={`diag-option${selected ? " diag-option--selected" : ""}`}
                              onClick={() => selectAnswer(current, opt.label)}
                            >
                              <span className="diag-option__letter">{opt.label}</span>
                              <span className="diag-option__text">{opt.value}</span>
                            </button>
                          );
                        })}
                      </div>

                      <div className="pr-nav">
                        <button className="pr-navbtn" onClick={goPrev} disabled={idx === 0}>
                          ← Prev
                        </button>
                        <div className="pr-navmid">
                          <span className="pr-navpill">
                            <strong>{idx + 1}</strong>
                            <span>/ {bank.length}</span>
                          </span>
                        </div>
                        <button className="pr-navbtn pr-navbtn--primary" onClick={goNext}>
                          {idx + 1 >= bank.length ? "Finish →" : "Next →"}
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Results */}
                  {topicId && done && (
                    <div className="pr-board__inner">
                      <div className="pr-complete">
                        <div className="pr-complete__head">
                          <div className={`pr-complete__ring ${
                            percent >= 70 ? "pr-complete__ring--good"
                            : percent >= 40 ? "pr-complete__ring--mid"
                            : "pr-complete__ring--low"
                          }`}>
                            <span className="pr-complete__ring-pct">{percent}%</span>
                            <span className="pr-complete__ring-label">score</span>
                          </div>
                          <div>
                            <h2 className="pr-complete__title">
                              {percent >= 70 ? "Strong result!"
                                : percent >= 40 ? "Partial understanding"
                                : "Keep practising"}
                            </h2>
                            <p className="pr-complete__sub">
                              {isTargeted ? targetedGapTitle : activeTopic?.title} · {formatTime(elapsed)}
                              {isTargeted && " · targeted training"}
                              {!isTargeted && practiceMode === "gap" && hasGaps && " · gap practice"}
                              {saved && <span className="pr-complete__saved"> · Saved ✓</span>}
                            </p>
                          </div>
                        </div>

                        <div className="pr-complete__stats">
                          <div className="pr-complete__stat">
                            <strong>{bank.length}</strong><span>Total</span>
                          </div>
                          <div className="pr-complete__stat">
                            <strong style={{ color: "#27ae60" }}>{correctCount}</strong><span>Correct</span>
                          </div>
                          <div className="pr-complete__stat">
                            <strong style={{ color: "#e74c3c" }}>{wrongCount}</strong><span>Wrong</span>
                          </div>
                          <div className="pr-complete__stat">
                            <strong style={{ color: "var(--teal)" }}>{formatTime(elapsed)}</strong><span>Time</span>
                          </div>
                        </div>

                        <div className="pr-complete__breakdown">
                          <p className="pr-complete__breakdown-cap">Answer breakdown</p>
                          <div className="pr-complete__breakdown-list">
                            {bank.map((task, i) => {
                              const chosen     = answers[task.id];
                              const isCorrect  = chosen === task.correct;
                              const skipped    = chosen == null;
                              const correctOpt = task.options?.find(o => o.label === task.correct);
                              const chosenOpt  = task.options?.find(o => o.label === chosen);
                              return (
                                <div
                                  key={task.id}
                                  className={`pr-brow${isCorrect ? " pr-brow--ok" : " pr-brow--err"}`}
                                >
                                  <span className="pr-brow__num">{i + 1}</span>
                                  <span className="pr-brow__icon">{isCorrect ? "✓" : "✕"}</span>
                                  <div className="pr-brow__body">
                                    <span className="pr-brow__q">{task.text}</span>
                                    {!isCorrect && (
                                      <div className="pr-brow__detail">
                                        {skipped
                                          ? <span className="pr-brow__yours">Not answered</span>
                                          : <span className="pr-brow__yours">You: {chosenOpt?.value ?? chosen}</span>
                                        }
                                        <span className="pr-brow__correct">
                                          Correct: {correctOpt?.value ?? task.correct}
                                        </span>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>

                        <div className="pr-complete__actions">
                          {!saved ? (
                            <button
                              className="pr-navbtn pr-navbtn--primary"
                              onClick={finish}
                              disabled={saving}
                            >
                              {saving ? "Saving…" : "Save to Progress"}
                            </button>
                          ) : (
                            <Link to="/progress" className="pr-navbtn pr-navbtn--primary">
                              View Progress →
                            </Link>
                          )}
                          <button className="pr-navbtn" onClick={retry}>Retry</button>
                          {isTargeted ? (
                            <button className="pr-navbtn" onClick={clearTargeted}>
                              Free practice
                            </button>
                          ) : (
                            <button
                              className="pr-navbtn"
                              onClick={() => {
                                stopTimer();
                                setTopicId(null);
                                setBank([]);
                                setIdx(0);
                                setAnswers({});
                                setDone(false);
                                setSaved(false);
                                setStarted(false);
                                setElapsed(0);
                                setActiveGaps([]);
                                setPracticeMode("free");
                                setTargetedGapId(null);
                                setTargetedGapTitle(null);
                                setSessionId(`pr_${Date.now()}`);
                              }}
                            >
                              Change topic
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                </div>
              </div>
            </div>

            {showNotes && <NotesPanel sessionId={sessionId} />}
          </div>
        </div>
      </main>
    </div>
  );
};

export default PracticePage;