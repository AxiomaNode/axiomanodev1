import { useMemo, useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import Header from "../../components/layout/Header";
import Sidebar from "../../components/layout/Sidebar";
import NotesPanel from "../../components/NotesPanel";
import { topics } from "../../data/topics";
import { tasks as taskBank } from "../../data/tasks";
import { savePractice, getActiveGaps } from "../../services/db"; // CHANGED: added getActiveGaps
import { awardPoints } from "../../core/scoringEngine";
import { generatePracticeSession } from "../../data/questionTemplates";
import "./practice.css";
import "../../styles/diag-shell.css";
import "../../styles/layout.css";

const pickBank = (topicId) => {
  const t = taskBank?.[topicId];
  return t?.practice?.length ? t.practice : (t?.homework?.length ? t.homework : []);
};

// CHANGED: filter bank by gap practice tags
const pickGapBank = (topicId, gaps) => {
  const all = pickBank(topicId);
  if (!gaps?.length) return all;
  const tags = new Set(gaps.map((g) => g.recommendation?.practiceTag).filter(Boolean));
  if (!tags.size) return all;
  const filtered = all.filter((t) => t.gapTag && tags.has(t.gapTag));
  return filtered.length > 0 ? filtered : all; // fallback to full bank if no tagged tasks
};

const formatTime = (secs) => {
  const m = Math.floor(secs / 60);
  const s = secs % 60;
  return m > 0 ? `${m}m ${s.toString().padStart(2, "0")}s` : `${s}s`;
};

const scoreColor = (pct) =>
  pct >= 70 ? "#27ae60" : pct >= 40 ? "#d35400" : "#c0392b";

/* ════════════════════════════════════════
   NEW: Gap mode toggle banner
════════════════════════════════════════ */
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

/* ════════════════════════════════════════
   NEW: Active gap context pill (above question)
════════════════════════════════════════ */
const GapContextPill = ({ gaps, taskGapTag }) => {
  if (!gaps?.length || !taskGapTag) return null;
  const gap = gaps.find((g) => g.recommendation?.practiceTag === taskGapTag);
  if (!gap) return null;
  return (
    <div className="pr-gap-pill">
      <span className="pr-gap-pill__label">Gap focus</span>
      <span className="pr-gap-pill__title">{gap.title}</span>
    </div>
  );
};

const PracticePage = () => {
  const { user } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  /* ── Session ───────────────────────────────────── */
  const [topicId, setTopicId]   = useState(null);
  const [idx, setIdx]           = useState(0);
  const [answers, setAnswers]   = useState({});
  const [done, setDone]         = useState(false);
  const [saving, setSaving]     = useState(false);
  const [saved, setSaved]       = useState(false);
  const [started, setStarted]   = useState(false);

  // CHANGED: gap state
  const [activeGaps,   setActiveGaps]   = useState([]);
  const [practiceMode, setPracticeMode] = useState("free"); // "free" | "gap"

  /* ── Notes session key — new key per practice session ── */
  const [sessionId, setSessionId] = useState(() => `pr_${Date.now()}`);

  /* ── Timer ─────────────────────────────────────── */
  const [elapsed, setElapsed]   = useState(0);
  const timerRef                = useRef(null);

  /* ── Data ──────────────────────────────────────── */
  const availableTopics = useMemo(
    () => topics.filter((t) => pickBank(t.id).length > 0),
    []
  );

  // CHANGED: bank depends on practiceMode and activeGaps
  const [bank, setBank] = useState([]);

  const current = bank[idx];

  /* ── Timer control ─────────────────────────────── */
  const startTimer = () => {
    clearInterval(timerRef.current);
    setElapsed(0);
    timerRef.current = setInterval(() => setElapsed((e) => e + 1), 1000);
  };
  const stopTimer = () => clearInterval(timerRef.current);

  useEffect(() => () => clearInterval(timerRef.current), []);

  // CHANGED: fetch active gaps when topicId or user changes
  useEffect(() => {
    if (!user?.uid || !topicId) { setActiveGaps([]); setPracticeMode("free"); return; }
    let cancelled = false;
    getActiveGaps(user.uid, topicId).then((gaps) => {
      if (cancelled) return;
      setActiveGaps(gaps);
      // auto-switch to gap mode if gaps exist and session hasn't started
      if (gaps.length > 0 && !started) setPracticeMode("gap");
    });
    return () => { cancelled = true; };
  }, [topicId, user?.uid]); // eslint-disable-line

  /* ── Topic selection ───────────────────────────── */
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
    setSessionId(`pr_${Date.now()}`);
  };

  const handleStart = () => {
    const tag = practiceMode === "gap" && activeGaps.length > 0
      ? activeGaps[0]?.recommendation?.practiceTag
      : null;
    const generated = generatePracticeSession(topicId, 15, tag);
    setBank(generated);
    setStarted(true);
    setTimeout(startTimer, 50);
  };

  // CHANGED: toggle between gap and free mode
  const handleSwitchMode = () => {
    if (started) return; // don't switch mid-session
    setPracticeMode((m) => m === "gap" ? "free" : "gap");
    setIdx(0);
    setAnswers({});
  };

  /* ── Answer (no feedback — just record) ────────── */
  const selectAnswer = (task, label) => {
    setAnswers((prev) => ({ ...prev, [task.id]: label }));
  };

  /* ── Navigation ────────────────────────────────── */
  const goNext = () => {
    if (idx + 1 >= bank.length) {
      stopTimer();
      setDone(true);
    } else {
      setIdx((v) => v + 1);
    }
  };
  const goPrev = () => setIdx((v) => Math.max(0, v - 1));

  /* ── Save ──────────────────────────────────────── */
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
        practiceMode, // CHANGED: record which mode was used
      });
      await awardPoints(user.uid, "practice_complete", { percent });
      setSaved(true);
    } finally {
      setSaving(false);
    }
  };

  /* ── Retry ─────────────────────────────────────── */
  const retry = () => {
    stopTimer();
    setIdx(0);
    setAnswers({});
    setDone(false);
    setSaved(false);
    setStarted(false);
    setElapsed(0);
    setSessionId(`pr_${Date.now()}`);
  };

  /* ── Keyboard navigation ───────────────────────── */
  useEffect(() => {
    const onKey = (e) => {
      if (["INPUT", "TEXTAREA", "SELECT"].includes(e.target.tagName)) return;

      if (!started && topicId && bank.length > 0 && !done) {
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

  /* ── Derived ───────────────────────────────────── */
  const activeTopic   = topics.find((t) => t.id === topicId);
  const answeredCount = Object.keys(answers).length;
  const progress      = bank.length ? Math.round((answeredCount / bank.length) * 100) : 0;
  const correctCount  = bank.filter((t) => answers[t.id] === t.correct).length;
  const wrongCount    = bank.length - correctCount;
  const percent       = bank.length ? Math.round((correctCount / bank.length) * 100) : 0;
  const hasGaps       = activeGaps.length > 0;

  const showNotes = started && !done;

  return (
    <div className="page-shell">
      <Header sidebarOpen={sidebarOpen} onToggleSidebar={() => setSidebarOpen((v) => !v)} />
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <main className="page-main">
        <div className="pr-wrap">

          {/* ══ HERO ════════════════════════════════════ */}
          <div className="pr-hero">
            <div className="pr-hero__content">
              <div className="pr-hero__left">
                <div className="pr-tag">
                  <span className="pr-dot" />
                  {/* CHANGED: tag reflects mode */}
                  {practiceMode === "gap" && hasGaps ? "Gap Practice" : "Practice Mode"}
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
                  {/* CHANGED: show mode pill when topic selected */}
                  {topicId && (
                    <div className="pr-hero__pill">
                      <span>Mode</span>
                      <strong>{practiceMode === "gap" && hasGaps ? "Gap" : "Free"}</strong>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className={`diag-shell${showNotes ? " diag-shell--with-notes" : ""}`}>
            <div className="diag-shell__main">
              <div className="pr-layout">

                {/* ── Sidebar ────────────────────────── */}
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

                {/* ── Board ────────────────────────── */}
                <div className="pr-board">

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

                  {/* Empty state */}
                  {!topicId && (
                    <div className="pr-empty">
                      <div className="pr-empty__icon">✦</div>
                      <p className="pr-empty__title">Select a topic to begin</p>
                      <p className="pr-empty__sub">
                        Choose any topic from the sidebar. Answer all questions,
                        then submit to see your results.
                      </p>
                    </div>
                  )}

                  {topicId && started && bank.length === 0 && (
                    <div className="pr-empty">
                      <p className="pr-empty__title">No tasks found</p>
                      <p className="pr-empty__sub">This topic has no practice tasks yet.</p>
                    </div>
                  )}

                  {/* CHANGED: gap mode banner above start modal */}
                  {topicId && !done && !started && hasGaps && (
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
                      <h2 className="pr-start-modal__title">{activeTopic?.title}</h2>
                      <p className="pr-start-modal__sub">
                        {bank.length} questions · timer starts on begin
                        {/* CHANGED: show gap context in subtitle */}
                        {practiceMode === "gap" && hasGaps && " · gap-targeted"}
                      </p>
                      <div className="pr-start-modal__meta">
                        <div className="pr-start-modal__pill">
                          <span>Questions</span>
                          <strong>{bank.length}</strong>
                        </div>
                        <div className="pr-start-modal__pill">
                          <span>Type</span>
                          <strong>Multiple choice</strong>
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

                      {/* CHANGED: show gap context pill above question if in gap mode */}
                      {practiceMode === "gap" && (
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

                  {/* Results screen */}
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
                              {activeTopic?.title} · {formatTime(elapsed)}
                              {/* CHANGED: show mode in results */}
                              {practiceMode === "gap" && hasGaps && " · gap practice"}
                              {saved && <span className="pr-complete__saved"> · Saved ✓</span>}
                            </p>
                          </div>
                        </div>

                        <div className="pr-complete__stats">
                          <div className="pr-complete__stat">
                            <strong>{bank.length}</strong>
                            <span>Total</span>
                          </div>
                          <div className="pr-complete__stat">
                            <strong style={{ color: "#27ae60" }}>{correctCount}</strong>
                            <span>Correct</span>
                          </div>
                          <div className="pr-complete__stat">
                            <strong style={{ color: "#e74c3c" }}>{wrongCount}</strong>
                            <span>Wrong</span>
                          </div>
                          <div className="pr-complete__stat">
                            <strong style={{ color: "var(--teal)" }}>{formatTime(elapsed)}</strong>
                            <span>Time</span>
                          </div>
                        </div>

                        <div className="pr-complete__breakdown">
                          <p className="pr-complete__breakdown-cap">Answer breakdown</p>
                          <div className="pr-complete__breakdown-list">
                            {bank.map((task, i) => {
                              const chosen    = answers[task.id];
                              const isCorrect = chosen === task.correct;
                              const skipped   = chosen == null;
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
                          <button
                            className="pr-navbtn"
                            onClick={() => { stopTimer(); setTopicId(null); }}
                          >
                            Change topic
                          </button>
                        </div>

                      </div>
                    </div>
                  )}

                </div>{/* /pr-board */}
              </div>{/* /pr-layout */}
            </div>{/* /diag-shell__main */}

            {showNotes && <NotesPanel sessionId={sessionId} />}

          </div>{/* /diag-shell */}

        </div>{/* /pr-wrap */}
      </main>
    </div>
  );
};

export default PracticePage;