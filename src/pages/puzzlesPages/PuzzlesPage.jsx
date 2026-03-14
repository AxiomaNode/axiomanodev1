// src/pages/puzzlesPages/PuzzlesPage.jsx
import { useState, useEffect, useRef, useCallback } from "react";
import { Link } from "react-router-dom";
import { doc, updateDoc, increment, getDoc } from "firebase/firestore";
import { db }      from "../../firebase/firebaseConfig";
import { useAuth } from "../../context/AuthContext";
import Header  from "../../components/layout/Header";
import Sidebar from "../../components/layout/Sidebar";
import NotesPanel from "../../components/NotesPanel";
import { generateQuadraticTasks } from "../../core/generators/quadraticGenerator";
import "./puzzles.css";
import "../../styles/layout.css";

// ── Constants ────────────────────────────────────────────────
const TASKS_PER_SESSION = 10;
const TIMER_SECS        = 40;
const BASE_XP           = 5;

const getXP = (streak, timeLeft) => {
  let xp = BASE_XP + streak;
  const ratio = timeLeft / TIMER_SECS;
  if (ratio > 0.6) xp += 3;
  else if (ratio > 0.3) xp += 1;
  return xp;
};

const PERF = [
  { min: 10, grade: "S", title: "Perfect",        sub: "Flawless. Every answer right."    },
  { min:  8, grade: "A", title: "Excellent",       sub: "Sharp reasoning throughout."      },
  { min:  6, grade: "B", title: "Good",            sub: "Solid understanding overall."     },
  { min:  4, grade: "C", title: "Getting there",   sub: "Review weak areas and retry."     },
  { min:  0, grade: "D", title: "Keep practicing", sub: "Every expert started here."       },
];
const getPerf = (n) => PERF.find(p => n >= p.min);

// ── No SVG background component — handled in CSS

// ── Results screen ────────────────────────────────────────────
const ResultsScreen = ({ correct, total, sessionXP, bestStreak, results, onRestart }) => {
  const perf = getPerf(correct);
  return (
    <div className="pz-results">
      <div className="pz-results__card">
        <div className="pz-results__topbar" />
        <div className="pz-results__grade">{perf.grade}</div>
        <h2 className="pz-results__title">{perf.title}</h2>
        <p  className="pz-results__sub">{perf.sub}</p>
        <div className="pz-results__xp">
          <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor">
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
          </svg>
          +{sessionXP} XP earned
        </div>
        <div className="pz-results__grid">
          {[
            { val: `${correct}/${total}`,                      label: "Correct"     },
            { val: `${Math.round((correct / total) * 100)}%`, label: "Accuracy"    },
            { val: bestStreak,                                  label: "Best streak" },
          ].map(s => (
            <div key={s.label} className="pz-results__stat">
              <strong>{s.val}</strong><span>{s.label}</span>
            </div>
          ))}
        </div>
        <div className="pz-results__dots">
          {results.map((r, i) => (
            <div key={i} className={`pz-rdot pz-rdot--${r ? "ok" : "no"}`} title={`Q${i+1}`}>
              {r ? "✓" : "✗"}
            </div>
          ))}
        </div>
        <div className="pz-results__btns">
          <button className="pz-rbtn pz-rbtn--primary" onClick={onRestart}>Play again</button>
          <Link to="/home" className="pz-rbtn pz-rbtn--ghost">← Home</Link>
        </div>
      </div>
    </div>
  );
};

// ── Topics registry — add more here as they're built ────────
const TOPICS = [
  {
    id:          "quadratic",
    label:       "Quadratic Equations",
    sub:         "Roots · Discriminant · Vieta",
    available:   true,
    generator:   generateQuadraticTasks,
  },
  { id: "linear",      label: "Linear Equations",   sub: "Coming soon", available: false },
  { id: "inequalities",label: "Inequalities",        sub: "Coming soon", available: false },
];


const PuzzlesPage = () => {
  const { user } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState(TOPICS[0]);

  const [tasks,    setTasks]    = useState(() => selectedTopic.generator(TASKS_PER_SESSION));
  const [idx,      setIdx]      = useState(0);
  const [selected, setSelected] = useState(null);
  const [revealed, setRevealed] = useState(false);
  const [results,  setResults]  = useState([]);
  const [done,     setDone]     = useState(false);

  const [streak,     setStreak]     = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [sessionXP,  setSessionXP]  = useState(0);
  const [correct,    setCorrect]    = useState(0);

  const [timeLeft, setTimeLeft] = useState(TIMER_SECS);
  const timerRef  = useRef(null);
  const [xpPop,  setXpPop]  = useState(null);
  const xpKey = useRef(0);

  const task = tasks[idx];

  const saveXP = useCallback(async (amount) => {
    if (!user) return;
    try { await updateDoc(doc(db, "users", user.uid), { ratingPoints: increment(amount) }); }
    catch (e) { console.error("XP:", e); }
  }, [user]);

  const saveBestStreak = useCallback(async (newStreak) => {
    if (!user || newStreak === 0) return;
    try {
      const ref  = doc(db, "users", user.uid);
      const snap = await getDoc(ref);
      const stored = snap.data()?.bestStreak || 0;
      if (newStreak > stored) await updateDoc(ref, { bestStreak: newStreak });
    } catch (e) { console.error("streak:", e); }
  }, [user]);

  useEffect(() => { if (done) saveBestStreak(bestStreak); }, [done]); // eslint-disable-line
  useEffect(() => { setTimeLeft(TIMER_SECS); }, [idx]);

  useEffect(() => {
    if (revealed || done) { clearTimeout(timerRef.current); return; }
    if (timeLeft <= 0) {
      setRevealed(true); setSelected(null);
      setResults(r => [...r, false]); setStreak(0); return;
    }
    timerRef.current = setTimeout(() => setTimeLeft(t => t - 1), 1000);
    return () => clearTimeout(timerRef.current);
  }, [timeLeft, revealed, done]);

  const handleSelect = useCallback(async (label) => {
    if (revealed) return;
    clearTimeout(timerRef.current);
    setSelected(label); setRevealed(true);
    const isOk = label === task.correct;
    setResults(r => [...r, isOk]);
    if (isOk) {
      const ns = streak + 1;
      const xp = getXP(ns, timeLeft);
      setStreak(ns); setBestStreak(b => Math.max(b, ns));
      setCorrect(c => c + 1); setSessionXP(s => s + xp);
      xpKey.current++;
      setXpPop({ amount: xp, key: xpKey.current });
      setTimeout(() => setXpPop(null), 1600);
      await saveXP(xp);
    } else { setStreak(0); }
  }, [revealed, task, streak, timeLeft, saveXP]);

  const handleNext = useCallback(() => {
    if (idx + 1 >= TASKS_PER_SESSION) { setDone(true); }
    else { setIdx(i => i + 1); setSelected(null); setRevealed(false); }
  }, [idx]);

  const handleRestart = () => {
    setTasks(selectedTopic.generator(TASKS_PER_SESSION));
    setIdx(0); setSelected(null); setRevealed(false);
    setResults([]); setDone(false);
    setStreak(0); setBestStreak(0); setSessionXP(0);
    setCorrect(0); setTimeLeft(TIMER_SECS);
  };

  const handleTopicSelect = (topic) => {
    if (!topic.available || topic.id === selectedTopic.id) return;
    setSelectedTopic(topic);
    setTasks(topic.generator(TASKS_PER_SESSION));
    setIdx(0); setSelected(null); setRevealed(false);
    setResults([]); setDone(false);
    setStreak(0); setBestStreak(0); setSessionXP(0);
    setCorrect(0); setTimeLeft(TIMER_SECS);
  };

  useEffect(() => {
    const onKey = (e) => {
      if (done) return;
      if (revealed) {
        if (e.key === "Enter" || e.key === " ") { e.preventDefault(); handleNext(); }
        return;
      }
      const map = { a: "A", b: "B", c: "C", d: "D" };
      const lbl = map[e.key.toLowerCase()];
      if (lbl) handleSelect(lbl);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [revealed, done, handleNext, handleSelect]);

  const timerPct   = (timeLeft / TIMER_SECS) * 100;
  const timerColor = timeLeft > 20 ? "var(--teal)" : timeLeft > 10 ? "#c9a227" : "#e74c3c";
  const feedbackState = selected === task?.correct ? "ok" : selected === null ? "timeout" : "no";

  return (
    <div className="page-shell">
      <Header sidebarOpen={sidebarOpen} onToggleSidebar={() => setSidebarOpen(v => !v)} />
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <main className="page-main pz-main">
        
        {done ? (
          <ResultsScreen
            correct={correct} total={TASKS_PER_SESSION}
            sessionXP={sessionXP} bestStreak={bestStreak}
            results={results} onRestart={handleRestart}
          />
        ) : (
          <div className="pz-outer">

            {/* ── Topic sidebar ── */}
            <aside className="pz-topics">
              <p className="pz-topics__label">Topics</p>
              {TOPICS.map(topic => (
                <button
                  key={topic.id}
                  className={[
                    "pz-topic-btn",
                    topic.id === selectedTopic.id ? "pz-topic-btn--active" : "",
                    !topic.available             ? "pz-topic-btn--locked" : "",
                  ].filter(Boolean).join(" ")}
                  onClick={() => handleTopicSelect(topic)}
                  disabled={!topic.available}
                >
                  <div className="pz-topic-btn__body">
                    <span className="pz-topic-btn__name">{topic.label}</span>
                    <span className="pz-topic-btn__sub">{topic.sub}</span>
                  </div>
                  {!topic.available && (
                    <svg className="pz-topic-btn__lock" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                      <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                      <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                    </svg>
                  )}
                  {topic.available && topic.id === selectedTopic.id && (
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                      <polyline points="9 18 15 12 9 6"/>
                    </svg>
                  )}
                </button>
              ))}
            </aside>

            <div className="pz-wrap">

            {/* ── Page header ── */}
            <div className="pz-header">
              <div className="pz-header__left">
                <nav className="pz-breadcrumb">
                  <Link to="/home" className="pz-bc__item">Home</Link>
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                    <polyline points="9 18 15 12 9 6"/>
                  </svg>
                  <span className="pz-bc__item pz-bc__item--cur">Puzzles</span>
                </nav>
                <h1 className="pz-header__title">Puzzles</h1>
                <p className="pz-header__sub">{selectedTopic.label}</p>
              </div>

              <div className="pz-session-stats">
                <div className="pz-ss-item">
                  <svg className="pz-ss-flame" width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2c0 0-5 4.5-5 9.5a5 5 0 0 0 10 0C17 6.5 12 2 12 2zm0 14a3 3 0 0 1-3-3c0-2.5 3-6 3-6s3 3.5 3 6a3 3 0 0 1-3 3z"/>
                  </svg>
                  <strong>{streak}</strong>
                  <span>streak</span>
                </div>
                <div className="pz-ss-div" />
                <div className="pz-ss-item">
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor">
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                  </svg>
                  <strong className="pz-ss-item--xp">+{sessionXP}</strong>
                  <span>XP</span>
                </div>
                <div className="pz-ss-div" />
                <div className="pz-ss-item">
                  <strong className="pz-ss-item--ok">{correct}</strong>
                  <span>/ {results.length}</span>
                </div>
              </div>
            </div>

            {/* ── Progress row ── */}
            <div className="pz-progress">
              <div className="pz-pdots">
                {Array.from({ length: TASKS_PER_SESSION }, (_, i) => {
                  let s = "idle";
                  if (i < results.length) s = results[i] ? "ok" : "no";
                  else if (i === idx)     s = "active";
                  return <div key={i} className={`pz-pdot pz-pdot--${s}`} />;
                })}
              </div>
              <span className="pz-progress__num">
                {idx + 1} <em>/ {TASKS_PER_SESSION}</em>
              </span>
            </div>

            {/* ── Question card ── */}
            <div className="pz-qcard" key={`q-${idx}`}>
              <div className="pz-qcard__meta">
                {task.category && <span className="pz-qcat">{task.category}</span>}
                <span className="pz-hint">
                  <kbd>A</kbd><kbd>B</kbd><kbd>C</kbd><kbd>D</kbd>
                  <span>or click</span>
                </span>
              </div>

              <p className="pz-qcard__text">{task.text}</p>

              {!revealed && (
                <div className="pz-timer">
                  <div className="pz-timer__track">
                    <div className="pz-timer__fill" style={{ width: `${timerPct}%`, background: timerColor }} />
                  </div>
                  <span className="pz-timer__num" style={{ color: timerColor }}>{timeLeft}s</span>
                </div>
              )}

              {revealed && (
                <div className={`pz-feedback pz-feedback--${feedbackState}`}>
                  <span className="pz-feedback__icon">
                    {feedbackState === "ok" ? "✓" : feedbackState === "timeout" ? "—" : "✗"}
                  </span>
                  <span className="pz-feedback__msg">
                    {feedbackState === "ok"
                      ? streak >= 5 ? `🔥 ${streak} in a row`
                        : streak >= 3 ? `${streak}-streak`
                        : "Correct"
                      : feedbackState === "timeout"
                      ? `Time's up — answer: ${task.correct}`
                      : `Wrong — answer: ${task.correct}`}
                  </span>
                  <button className="pz-feedback__next" onClick={handleNext}>
                    {idx + 1 < TASKS_PER_SESSION ? "Next →" : "Results →"}
                  </button>
                </div>
              )}

              {xpPop && (
                <div className="pz-xppop" key={xpPop.key} aria-hidden="true">
                  +{xpPop.amount}<span>XP</span>
                </div>
              )}
            </div>

            {/* ── Answer tiles 2×2 ── */}
            <div className="pz-tiles">
              {task.options.map((opt) => {
                let state = "idle";
                if (revealed) {
                  if (opt.label === task.correct)  state = "correct";
                  else if (opt.label === selected) state = "wrong";
                  else                             state = "dim";
                }
                return (
                  <button
                    key={opt.label}
                    className={`pz-tile pz-tile--${state}`}
                    onClick={() => handleSelect(opt.label)}
                    disabled={revealed}
                  >
                    <span className="pz-tile__lbl">{opt.label}</span>
                    <span className="pz-tile__val">{opt.value}</span>
                    {revealed && opt.label === task.correct && (
                      <span className="pz-tile__mark pz-tile__mark--ok">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round">
                          <polyline points="20 6 9 17 4 12"/>
                        </svg>
                      </span>
                    )}
                    {revealed && opt.label === selected && opt.label !== task.correct && (
                      <span className="pz-tile__mark pz-tile__mark--no">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round">
                          <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                        </svg>
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

          </div>

            {/* Notes — embedded right column */}
            <div className="pz-notes-col">
              <NotesPanel sessionId="puzzles" mode="embedded" />
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default PuzzlesPage;