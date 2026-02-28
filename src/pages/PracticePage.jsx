import { useMemo, useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Header from "../components/layout/Header";
import Sidebar from "../components/layout/Sidebar";
import { topics } from "../data/topics";
import { tasks as taskBank } from "../data/tasks";
import { savePractice } from "../services/db";
import { awardPoints } from "../core/scoringEngine";
import "../styles/practice.css";
import "../styles/layout.css";

const pickBank = (topicId) => {
  const t = taskBank?.[topicId];
  return t?.practice?.length ? t.practice : (t?.homework?.length ? t.homework : []);
};

const FEEDBACK_DELAY = 1200;

const formatTime = (secs) => {
  const m = Math.floor(secs / 60);
  const s = secs % 60;
  return m > 0 ? `${m}m ${s.toString().padStart(2, "0")}s` : `${s}s`;
};

const PracticePage = () => {
  const { user } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  /* ── Session state ─────────────────────────────────── */
  const [topicId, setTopicId]     = useState(null);
  const [idx, setIdx]             = useState(0);
  const [answers, setAnswers]     = useState({}); // taskId → chosen label
  const [done, setDone]           = useState(false);
  const [saving, setSaving]       = useState(false);
  const [saved, setSaved]         = useState(false);

  /* ── Feedback ──────────────────────────────────────── */
  // null | { correct: bool, points: number, chosenLabel: string }
  const [feedback, setFeedback]   = useState(null);

  /* ── Streak ────────────────────────────────────────── */
  const [streak, setStreak]           = useState(0);
  const [bestStreak, setBestStreak]   = useState(0);

  /* ── Points ────────────────────────────────────────── */
  const [sessionPoints, setSessionPoints] = useState(0);

  /* ── Timer ─────────────────────────────────────────── */
  const [elapsed, setElapsed]     = useState(0);   // seconds
  const timerRef                  = useRef(null);
  const feedbackTimer             = useRef(null);
  const awarded                   = useRef({});

  /* ── Data ──────────────────────────────────────────── */
  const availableTopics = useMemo(
    () => topics.filter((t) => pickBank(t.id).length > 0),
    []
  );
  const bank    = useMemo(() => (topicId ? pickBank(topicId) : []), [topicId]);
  const current = bank[idx];

  /* ── Timer control ─────────────────────────────────── */
  const startTimer = () => {
    clearInterval(timerRef.current);
    timerRef.current = setInterval(() => setElapsed((e) => e + 1), 1000);
  };
  const stopTimer = () => clearInterval(timerRef.current);

  useEffect(() => {
    return () => {
      clearInterval(timerRef.current);
      clearTimeout(feedbackTimer.current);
    };
  }, []);

  /* ── Select answer ─────────────────────────────────── */
  const selectAnswer = async (task, chosenLabel) => {
    if (feedback !== null || answers[task.id] != null) return;

    const isCorrect = chosenLabel === task.correct;

    setAnswers((prev) => ({ ...prev, [task.id]: chosenLabel }));

    const newStreak = isCorrect ? streak + 1 : 0;
    setStreak(newStreak);
    if (isCorrect) setBestStreak((b) => Math.max(b, newStreak));

    let pts = 0;
    if (!awarded.current[task.id] && user?.uid) {
      awarded.current[task.id] = true;
      pts = await awardPoints(user.uid, "question_answered", {
        correct: isCorrect,
        streak: newStreak,
      }) ?? (isCorrect ? 10 : 0);
      if (pts > 0) setSessionPoints((p) => p + pts);
    }

    setFeedback({ correct: isCorrect, points: pts, chosenLabel });

    feedbackTimer.current = setTimeout(() => {
      setFeedback(null);
      if (idx + 1 >= bank.length) {
        stopTimer();
        setDone(true);
      } else {
        setIdx((v) => v + 1);
      }
    }, FEEDBACK_DELAY);
  };

  /* ── Topic selection ───────────────────────────────── */
  const selectTopic = (id) => {
    clearTimeout(feedbackTimer.current);
    stopTimer();
    setTopicId(id);
    setIdx(0);
    setAnswers({});
    setDone(false);
    setFeedback(null);
    setStreak(0);
    setBestStreak(0);
    setSessionPoints(0);
    setElapsed(0);
    setSaved(false);
    awarded.current = {};
    // Start timer after a tick so state is settled
    setTimeout(startTimer, 50);
  };

  /* ── Finish / save ─────────────────────────────────── */
  const finish = async () => {
    if (!user?.uid || !topicId || !bank.length || saving || saved) return;
    const correct = bank.filter((t) => answers[t.id] === t.correct).length;
    const wrong   = bank.filter((t) => answers[t.id] != null && answers[t.id] !== t.correct).length;
    const total   = bank.length;
    const percent = total ? Math.round((correct / total) * 100) : 0;

    setSaving(true);
    try {
      await savePractice(user.uid, {
        topicId,
        topicTitle: topics.find((t) => t.id === topicId)?.title ?? topicId,
        correct,
        wrong,
        total,
        percent,
        answers,
        timeSecs: elapsed,
        bestStreak,
        pointsEarned: sessionPoints,
      });
      await awardPoints(user.uid, "practice_complete", { percent });
      setSaved(true);
    } finally {
      setSaving(false);
    }
  };

  /* ── Retry ─────────────────────────────────────────── */
  const retry = () => {
    clearTimeout(feedbackTimer.current);
    stopTimer();
    setIdx(0);
    setAnswers({});
    setDone(false);
    setFeedback(null);
    setStreak(0);
    setBestStreak(0);
    setSessionPoints(0);
    setElapsed(0);
    setSaved(false);
    awarded.current = {};
    setTimeout(startTimer, 50);
  };

  /* ── Derived ───────────────────────────────────────── */
  const activeTopic   = topics.find((t) => t.id === topicId);
  const progress      = bank.length
    ? Math.round((Object.keys(answers).length / bank.length) * 100)
    : 0;
  const correctCount  = bank.filter((t) => answers[t.id] === t.correct).length;
  const wrongCount    = bank.filter((t) => answers[t.id] != null && answers[t.id] !== t.correct).length;
  const percent       = bank.length ? Math.round((correctCount / bank.length) * 100) : 0;

  return (
    <div className="page-shell">
      <Header sidebarOpen={sidebarOpen} onToggleSidebar={() => setSidebarOpen((v) => !v)} />
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <main className="page-main">
        <div className="pr-wrap">

          {/* ══ HERO ══════════════════════════════════════ */}
          <div className="pr-hero">
            <div className="pr-hero__content">
              <div className="pr-hero__left">
                <div className="pr-tag">
                  <span className="pr-dot" />
                  Practice Mode
                </div>
                <h1 className="pr-title">Solve &amp; Reinforce</h1>
                <p className="pr-sub">
                  Answer each question — instant feedback, live timer, and a
                  full score breakdown at the end.
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
                    <strong>+10</strong>
                    <span>Per correct</span>
                  </div>
                </div>
              </div>

              {/* Session card */}
              <div className="pr-hero__card">
                <p className="pr-hero__cardcap">Current session</p>
                <div className="pr-hero__pills">
                  <div className="pr-hero__pill">
                    <span>Topic</span>
                    <strong>{activeTopic?.title ?? "—"}</strong>
                  </div>
                  <div className="pr-hero__pill">
                    <span>Points</span>
                    <strong>{sessionPoints > 0 ? `+${sessionPoints}` : "—"}</strong>
                  </div>
                  <div className="pr-hero__pill">
                    <span>Time</span>
                    <strong>{topicId && !done ? formatTime(elapsed) : "—"}</strong>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ══ TWO-COLUMN ════════════════════════════════ */}
          <div className="pr-layout">

            {/* ── Sidebar ──────────────────────────────── */}
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
                      <p className="pr-topic__sub">{pickBank(t.id).length} tasks</p>
                    </div>
                  </button>
                ))}
              </div>

              <div className="pr-side__footer">
                <Link to="/home" className="pr-side__link">← Back to Home</Link>
              </div>
            </aside>

            {/* ── Board ────────────────────────────────── */}
            <div className="pr-board">

              {/* Top bar */}
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

                {/* Live timer */}
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

                {/* Streak badge */}
                {streak >= 2 && (
                  <div className="pr-streak">
                    <span className="pr-streak__fire">🔥</span>
                    <span className="pr-streak__count">{streak}</span>
                  </div>
                )}

                {/* Step dots */}
                {topicId && !done && (
                  <div className="pr-tracker">
                    {bank.map((t, i) => (
                      <div
                        key={i}
                        className={`pr-dotstep${
                          answers[t.id] === t.correct ? " correct"
                          : answers[t.id] != null    ? " wrong"
                          : i === idx                ? " active"
                          : ""
                        }`}
                      />
                    ))}
                  </div>
                )}
              </div>

              {/* Empty state */}
              {!topicId && (
                <div className="pr-empty">
                  <div className="pr-empty__icon">✦</div>
                  <p className="pr-empty__title">Select a topic to begin</p>
                  <p className="pr-empty__sub">
                    Choose any topic from the sidebar. The timer starts immediately.
                  </p>
                </div>
              )}

              {topicId && bank.length === 0 && (
                <div className="pr-empty">
                  <p className="pr-empty__title">No tasks found</p>
                  <p className="pr-empty__sub">This topic has no practice tasks yet.</p>
                </div>
              )}

              {/* Active task */}
              {topicId && !done && current && (
                <div className="pr-board__inner">

                  {/* Progress bar */}
                  <div className="pr-progress">
                    <div className="pr-progress__track">
                      <div className="pr-progress__fill" style={{ width: `${progress}%` }} />
                    </div>
                    <span className="pr-progress__label">{progress}%</span>
                  </div>

                  {/* Question card */}
                  <div className={`pr-card pr-card--question${
                    feedback ? (feedback.correct ? " pr-card--correct" : " pr-card--wrong") : ""
                  }`}>

                    {/* Feedback overlay */}
                    {feedback && (
                      <div className={`pr-feedback ${feedback.correct ? "pr-feedback--correct" : "pr-feedback--wrong"}`}>
                        {feedback.correct ? (
                          <>
                            <span className="pr-feedback__icon">✓</span>
                            <span className="pr-feedback__main">Correct!</span>
                            {feedback.points > 0 && (
                              <span className="pr-feedback__pts">+{feedback.points} pts</span>
                            )}
                            {streak >= 2 && (
                              <span className="pr-feedback__streak">🔥 {streak} streak</span>
                            )}
                          </>
                        ) : (
                          <>
                            <span className="pr-feedback__icon">✕</span>
                            <span className="pr-feedback__main">Wrong</span>
                            <span className="pr-feedback__hint">
                              Answer: {current.options?.find(o => o.label === current.correct)?.value ?? current.correct}
                            </span>
                          </>
                        )}
                      </div>
                    )}

                    <div className="pr-smallcap">Question {idx + 1} of {bank.length}</div>
                    <p className="pr-question">{current.text}</p>
                  </div>

                  {/* Options */}
                  <div className="diag-options">
                    {(current.options || []).map((opt) => {
                      const chosen    = answers[current.id] === opt.label;
                      const revealed  = feedback !== null;
                      const isCorrect = opt.label === current.correct;

                      let cls = "diag-option";
                      if (revealed && isCorrect)   cls += " diag-option--correct";
                      else if (revealed && chosen)  cls += " diag-option--wrong";
                      else if (!revealed && chosen) cls += " diag-option--selected";

                      return (
                        <button
                          key={opt.value}
                          className={cls}
                          onClick={() => selectAnswer(current, opt.label)}
                          disabled={revealed}
                        >
                          <span className="diag-option__letter">{opt.label}</span>
                          <span className="diag-option__text">{opt.value}</span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Nav pill — hidden during feedback */}
                  <div className={`pr-nav${feedback ? " pr-nav--hidden" : ""}`}>
                    <div className="pr-navmid">
                      <span className="pr-navpill">
                        <strong>{idx + 1}</strong>
                        <span>/ {bank.length}</span>
                      </span>
                    </div>
                  </div>

                </div>
              )}

              {/* ── Session complete ────────────────────── */}
              {topicId && done && (
                <div className="pr-board__inner">
                  <div className="pr-complete">

                    {/* Result ring + headline */}
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
                          {percent >= 70 ? "Strong result!" : percent >= 40 ? "Partial understanding" : "Keep practising"}
                        </h2>
                        <p className="pr-complete__sub">
                          {activeTopic?.title} · {formatTime(elapsed)}
                          {saved && <span className="pr-complete__saved"> · Saved ✓</span>}
                        </p>
                      </div>
                    </div>

                    {/* Stats grid */}
                    <div className="pr-complete__stats">
                      <div className="pr-complete__stat">
                        <strong>{correctCount}</strong>
                        <span>Correct</span>
                      </div>
                      <div className="pr-complete__stat">
                        <strong className="pr-complete__stat--wrong">{wrongCount}</strong>
                        <span>Wrong</span>
                      </div>
                      <div className="pr-complete__stat">
                        <strong>{bank.length - correctCount - wrongCount}</strong>
                        <span>Skipped</span>
                      </div>
                      <div className="pr-complete__stat">
                        <strong className="pr-complete__stat--pts">+{sessionPoints}</strong>
                        <span>Points</span>
                      </div>
                      <div className="pr-complete__stat">
                        <strong>🔥 {bestStreak}</strong>
                        <span>Best streak</span>
                      </div>
                      <div className="pr-complete__stat">
                        <strong className="pr-complete__stat--time">{formatTime(elapsed)}</strong>
                        <span>Time</span>
                      </div>
                    </div>

                    {/* Per-question breakdown */}
                    <div className="pr-complete__breakdown">
                      <p className="pr-complete__breakdown-cap">Answer breakdown</p>
                      <div className="pr-complete__breakdown-list">
                        {bank.map((task, i) => {
                          const chosen    = answers[task.id];
                          const isCorrect = chosen === task.correct;
                          const skipped   = chosen == null;
                          return (
                            <div
                              key={task.id}
                              className={`pr-brow ${
                                skipped ? "pr-brow--skip"
                                : isCorrect ? "pr-brow--ok"
                                : "pr-brow--err"
                              }`}
                            >
                              <span className="pr-brow__num">{i + 1}</span>
                              <span className="pr-brow__icon">
                                {skipped ? "–" : isCorrect ? "✓" : "✕"}
                              </span>
                              <span className="pr-brow__q">{task.text}</span>
                              {!skipped && !isCorrect && (
                                <span className="pr-brow__correct">
                                  → {task.options?.find(o => o.label === task.correct)?.value ?? task.correct}
                                </span>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Actions */}
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
                      <button className="pr-navbtn" onClick={() => {
                        stopTimer();
                        setTopicId(null);
                      }}>
                        Change topic
                      </button>
                    </div>

                  </div>
                </div>
              )}

            </div>
          </div>

        </div>
      </main>
    </div>
  );
};

export default PracticePage;