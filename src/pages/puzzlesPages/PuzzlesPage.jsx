// src/pages/puzzlesPages/PuzzlesPage.jsx
import { useState, useEffect, useRef, useCallback } from "react";
import { Link } from "react-router-dom";
import { doc, updateDoc, increment, getDoc } from "firebase/firestore";
import { db }      from "../../firebase/firebaseConfig";
import { useAuth } from "../../context/AuthContext";
import Header  from "../../components/layout/Header";
import Sidebar from "../../components/layout/Sidebar";
import { generatePracticeSession } from "../../data/questionTemplates";
import { topics } from "../../data/topics";
import { markPuzzleSolved } from "../../services/dailyTodos";
import "./puzzles.css";
import "../../styles/layout.css";
import NotesPanel from "../../components/NotesPanel";

/* ── Constants ─────────────────────────────────────────────── */
const REFILL_THRESHOLD  = 5;   // generate more when this many questions left
const REFILL_BATCH      = 20;  // how many to generate per refill
const TIMER_SECS        = 40;
const BASE_XP           = 5;

const getXP = (streak, timeLeft) => {
  let xp = BASE_XP + Math.min(streak, 5);
  const ratio = timeLeft / TIMER_SECS;
  if (ratio > 0.6) xp += 3;
  else if (ratio > 0.3) xp += 1;
  return xp;
};

const PERF = [
  { min: 0.9,  grade: "S", title: "Flawless",       sub: "Near-perfect accuracy.",              color: "#9b59b6" },
  { min: 0.75, grade: "A", title: "Excellent",       sub: "Sharp reasoning throughout.",         color: "#2a8fa0" },
  { min: 0.6,  grade: "B", title: "Good",            sub: "Solid overall.",                      color: "#27ae60" },
  { min: 0.4,  grade: "C", title: "Getting there",   sub: "Review weak areas and retry.",        color: "#d35400" },
  { min: 0,    grade: "D", title: "Keep practicing", sub: "Every expert started here.",          color: "#c0392b" },
];
const getPerf = (correct, total) =>
  total === 0 ? PERF[PERF.length - 1]
  : PERF.find(p => (correct / total) >= p.min) ?? PERF[PERF.length - 1];

/* ── Timer Ring ────────────────────────────────────────────── */
const TimerRing = ({ timeLeft, total }) => {
  const SIZE   = 96;
  const STROKE = 5;
  const R      = (SIZE - STROKE * 2) / 2;
  const CIRC   = 2 * Math.PI * R;
  const offset = CIRC * (1 - timeLeft / total);
  const color  = timeLeft > 20 ? "#2a8fa0" : timeLeft > 10 ? "#c9a227" : "#e74c3c";

  return (
    <div className={`pz-ring${timeLeft <= 10 ? " pz-ring--urgent" : ""}`}>
      <svg width={SIZE} height={SIZE} viewBox={`0 0 ${SIZE} ${SIZE}`}>
        <circle cx={SIZE/2} cy={SIZE/2} r={R} fill="none" stroke="var(--border)" strokeWidth={STROKE}/>
        <circle cx={SIZE/2} cy={SIZE/2} r={R} fill="none" stroke={color}
          strokeWidth={STROKE} strokeDasharray={CIRC} strokeDashoffset={offset}
          strokeLinecap="round" transform={`rotate(-90 ${SIZE/2} ${SIZE/2})`}
          style={{ transition: "stroke-dashoffset 1s linear, stroke 0.5s ease" }}
        />
      </svg>
      <span className="pz-ring__num" style={{ color }}>{timeLeft}</span>
    </div>
  );
};

/* ── Lobby Screen ──────────────────────────────────────────── */
const LobbyScreen = ({ selectedTopic, onTopicSelect, onStart, bestStreak, bestScore, bestTotal }) => {
  const hasStats        = bestStreak > 0 || bestScore > 0;
  const accuracy        = bestTotal > 0 ? Math.round((bestScore / bestTotal) * 100) : null;
  const availableTopics = topics.filter(t => t.available !== false);
  const lockedTopics    = topics.filter(t => t.available === false);

  return (
    <div className="pz-lobby">

      <div className="pz-lobby__hero">
        <div className="pz-lobby__hero-left">
          <div className="pz-lobby__eyebrow">
            <span className="pz-lobby__eyebrow-dot" />
            Puzzle Mode
          </div>
          <h1 className="pz-lobby__title">Puzzles</h1>
          <p className="pz-lobby__subtitle">
            Infinite timed questions. Build streaks, earn speed bonuses.
            Quit whenever — results shown on exit.
          </p>

          {hasStats && (
            <div className="pz-lobby__stats">
              {bestStreak > 0 && (
                <div className="pz-lobby__stat">
                  <strong>{bestStreak}</strong>
                  <span>Best streak</span>
                </div>
              )}
              {bestScore > 0 && (
                <div className="pz-lobby__stat">
                  <strong>{bestScore}</strong>
                  <span>Best correct</span>
                </div>
              )}
              {accuracy !== null && (
                <div className="pz-lobby__stat">
                  <strong>{accuracy}<em>%</em></strong>
                  <span>Best accuracy</span>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="pz-lobby__xp-card">
          <p className="pz-lobby__xp-card-label">XP per correct answer</p>
          <div className="pz-lobby__xp-rows">
            <div className="pz-lobby__xp-row">
              <span className="pz-lobby__xp-pill pz-lobby__xp-pill--base">+5</span>
              <span>Base</span>
            </div>
            <div className="pz-lobby__xp-row">
              <span className="pz-lobby__xp-pill pz-lobby__xp-pill--streak">+5</span>
              <span>Streak (max, stacks per answer)</span>
            </div>
            <div className="pz-lobby__xp-row">
              <span className="pz-lobby__xp-pill pz-lobby__xp-pill--speed">+3</span>
              <span>Speed (&gt;60% time left)</span>
            </div>
          </div>
          <div className="pz-lobby__xp-max">Max <strong>13 XP</strong> per question</div>
        </div>
      </div>

      <div className="pz-lobby__divider" />

      <div className="pz-lobby__section">
        <div className="pz-lobby__section-header">
          <h2 className="pz-lobby__section-title">Select topic</h2>
          <p className="pz-lobby__section-sub">Questions are drawn from the selected topic's gap pool.</p>
        </div>

        <div className="pz-lobby__topics">
          {availableTopics.map(topic => {
            const isActive = topic.id === selectedTopic.id;
            return (
              <button key={topic.id}
                className={`pz-topic-card${isActive ? " pz-topic-card--active" : ""}`}
                onClick={() => onTopicSelect(topic)}>
                <div className="pz-topic-card__icon">
                  {topic.icon && <topic.icon size={20} strokeWidth={1.7} />}
                </div>
                <div className="pz-topic-card__body">
                  <span className="pz-topic-card__name">{topic.title}</span>
                  <span className="pz-topic-card__desc">{topic.description}</span>
                </div>
                {isActive && (
                  <div className="pz-topic-card__check">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none"
                      stroke="currentColor" strokeWidth="3" strokeLinecap="round">
                      <polyline points="20 6 9 17 4 12"/>
                    </svg>
                  </div>
                )}
              </button>
            );
          })}
          {lockedTopics.map(topic => (
            <div key={topic.id} className="pz-topic-card pz-topic-card--locked">
              <div className="pz-topic-card__icon">
                {topic.icon && <topic.icon size={20} strokeWidth={1.7} />}
              </div>
              <div className="pz-topic-card__body">
                <span className="pz-topic-card__name">{topic.title}</span>
                <span className="pz-topic-card__desc">Coming soon</span>
              </div>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <rect x="3" y="11" width="18" height="11" rx="2"/>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
              </svg>
            </div>
          ))}
        </div>
      </div>

      <div className="pz-lobby__divider" />

      <div className="pz-lobby__bottom">
        <div className="pz-lobby__rules">
          <p className="pz-lobby__rules-label">Streak rules</p>
          <div className="pz-lobby__rules-list">
            <div className="pz-lobby__rule pz-lobby__rule--good"><span />Correct answer — streak grows</div>
            <div className="pz-lobby__rule pz-lobby__rule--bad"><span />Wrong answer — streak resets</div>
            <div className="pz-lobby__rule pz-lobby__rule--bad"><span />Timeout (40 s) — counts as wrong</div>
          </div>
        </div>

        <div className="pz-lobby__start-block">
          <div className="pz-lobby__start-info">
            <p className="pz-lobby__start-topic">{selectedTopic.title}</p>
            <p className="pz-lobby__start-meta">Infinite · 40 s each · quit anytime for results</p>
          </div>
          <button className="pz-lobby__start" onClick={onStart}>
            Begin session
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <polyline points="9 18 15 12 9 6"/>
            </svg>
          </button>
        </div>
      </div>

    </div>
  );
};

/* ── Results Screen ────────────────────────────────────────── */
const ResultsScreen = ({ correct, total, sessionXP, bestStreak, results, onRestart, onLobby }) => {
  const perf = getPerf(correct, total);
  // Show last 20 results max in the dots
  const displayResults = results.slice(-20);

  return (
    <div className="pz-results">
      <div className="pz-results__card" style={{ "--perf-color": perf.color }}>
        <div className="pz-results__topbar" style={{ background: perf.color }} />
        <div className="pz-results__grade" style={{ color: perf.color }}>{perf.grade}</div>
        <h2 className="pz-results__title">{perf.title}</h2>
        <p className="pz-results__sub">{perf.sub}</p>
        <div className="pz-results__xp">
          <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor">
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
          </svg>
          +{sessionXP} XP earned
        </div>
        <div className="pz-results__grid">
          {[
            { val: total,                                  label: "Answered"    },
            { val: `${correct}/${total}`,                  label: "Correct"     },
            { val: total > 0 ? `${Math.round((correct/total)*100)}%` : "—", label: "Accuracy" },
            { val: bestStreak,                             label: "Best streak" },
          ].map(s => (
            <div key={s.label} className="pz-results__stat">
              <strong>{s.val}</strong><span>{s.label}</span>
            </div>
          ))}
        </div>
        {displayResults.length > 0 && (
          <div className="pz-results__dots">
            {results.length > 20 && (
              <span className="pz-results__dots-note">Last 20</span>
            )}
            {displayResults.map((r, i) => (
              <div key={i} className={`pz-rdot pz-rdot--${r ? "ok" : "no"}`}>
                {r ? "✓" : "✗"}
              </div>
            ))}
          </div>
        )}
        <div className="pz-results__btns">
          <button className="pz-rbtn pz-rbtn--primary" onClick={onRestart}>Play again</button>
          <button className="pz-rbtn pz-rbtn--ghost" onClick={onLobby}>← Change topic</button>
        </div>
      </div>
    </div>
  );
};

/* ── Main Page ─────────────────────────────────────────────── */
const PuzzlesPage = () => {
  const { user } = useAuth();
  const [sidebarOpen,   setSidebarOpen]   = useState(false);
  const [selectedTopic, setSelectedTopic] = useState(topics[0]);
  const [screen,        setScreen]        = useState("lobby");
  const [bestStreak,    setBestStreak]    = useState(0);
  const [bestScore,     setBestScore]     = useState(0);
  const [bestTotal,     setBestTotal]     = useState(0);

  // Game state
  const [tasks,       setTasks]       = useState([]);
  const [idx,         setIdx]         = useState(0);
  const [selected,    setSelected]    = useState(null);
  const [revealed,    setRevealed]    = useState(false);
  const [results,     setResults]     = useState([]);  // full history
  const [streak,      setStreak]      = useState(0);
  const [sessionBest, setSessionBest] = useState(0);
  const [sessionXP,   setSessionXP]   = useState(0);
  const [correct,     setCorrect]     = useState(0);
  const [total,       setTotal]       = useState(0);
  const [timeLeft,    setTimeLeft]    = useState(TIMER_SECS);
  const [streakAnim,  setStreakAnim]  = useState(false);
  const [xpPop,       setXpPop]      = useState(null);

  const timerRef = useRef(null);
  const xpKey    = useRef(0);

  const task = tasks[idx] || null;

  useEffect(() => {
    if (!user) return;
    getDoc(doc(db, "users", user.uid)).then(snap => {
      const d = snap.data() || {};
      setBestStreak(d.bestStreak || 0);
      setBestScore(d.bestScore   || 0);
      setBestTotal(d.bestTotal   || 0);
    });
  }, [user]);

  const saveXP = useCallback(async (amount) => {
    if (!user) return;
    try { await updateDoc(doc(db, "users", user.uid), { ratingPoints: increment(amount) }); }
    catch (e) { console.error("XP:", e); }
  }, [user]);

  const saveBests = useCallback(async (streak, score, totalAnswered) => {
    if (!user) return;
    try {
      const ref  = doc(db, "users", user.uid);
      const snap = await getDoc(ref);
      const d    = snap.data() || {};
      const updates = {};
      if (streak > (d.bestStreak || 0)) { updates.bestStreak = streak; setBestStreak(streak); }
      if (score  > (d.bestScore  || 0)) { updates.bestScore  = score;  setBestScore(score);   }
      if (totalAnswered > (d.bestTotal || 0)) { updates.bestTotal = totalAnswered; setBestTotal(totalAnswered); }
      if (Object.keys(updates).length) await updateDoc(ref, updates);
    } catch (e) { console.error("bests:", e); }
  }, [user]);

  // Auto-refill pool when running low
  useEffect(() => {
    if (screen !== "game" || !tasks.length) return;
    const remaining = tasks.length - idx;
    if (remaining <= REFILL_THRESHOLD) {
      const more = generatePracticeSession(selectedTopic.id, REFILL_BATCH);
      setTasks(prev => [...prev, ...more]);
    }
  }, [idx, tasks.length, screen, selectedTopic]);

  useEffect(() => { if (screen === "game") setTimeLeft(TIMER_SECS); }, [idx, screen]);

  useEffect(() => {
    if (screen !== "game" || revealed) { clearTimeout(timerRef.current); return; }
    if (timeLeft <= 0) {
      setRevealed(true); setSelected(null);
      setResults(r => [...r, false]);
      setTotal(t => t + 1);
      setStreak(0);
      return;
    }
    timerRef.current = setTimeout(() => setTimeLeft(t => t - 1), 1000);
    return () => clearTimeout(timerRef.current);
  }, [timeLeft, revealed, screen]);

  const startGame = useCallback(() => {
    const initial = generatePracticeSession(selectedTopic.id, REFILL_BATCH);
    setTasks(initial);
    setIdx(0); setSelected(null); setRevealed(false);
    setResults([]); setStreak(0); setSessionBest(0);
    setSessionXP(0); setCorrect(0); setTotal(0);
    setTimeLeft(TIMER_SECS);
    setScreen("game");
  }, [selectedTopic]);

  // Quit → show results
  const handleQuit = useCallback(() => {
    clearTimeout(timerRef.current);
    saveBests(sessionBest, correct, total);
    setScreen("results");
  }, [sessionBest, correct, total, saveBests]);

  const handleSelect = useCallback(async (label) => {
    if (revealed || !task) return;
    clearTimeout(timerRef.current);
    setSelected(label); setRevealed(true);
    const isOk = label === task.correct;
    setResults(r => [...r, isOk]);
    setTotal(t => t + 1);
    if (isOk) {
      const ns = streak + 1;
      const xp = getXP(ns, timeLeft);
      setStreak(ns);
      setSessionBest(b => Math.max(b, ns));
      setCorrect(c => c + 1);
      setSessionXP(s => s + xp);
      setStreakAnim(true);
      setTimeout(() => setStreakAnim(false), 400);
      xpKey.current++;
      setXpPop({ amount: xp, key: xpKey.current });
      setTimeout(() => setXpPop(null), 1600);
      await saveXP(xp);
      if (user?.uid) {
        try { await markPuzzleSolved(user.uid); } catch (e) { console.error("puzzle count:", e); }
      }
    } else {
      setStreak(0);
    }
  }, [revealed, task, streak, timeLeft, saveXP, user]);

  const handleNext = useCallback(() => {
    setIdx(i => i + 1);
    setSelected(null);
    setRevealed(false);
  }, []);

  useEffect(() => {
    const onKey = (e) => {
      if (screen !== "game") return;
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
  }, [revealed, screen, handleNext, handleSelect]);

  const cardTint = !revealed && timeLeft <= 15
    ? `rgba(231,76,60,${((15 - timeLeft) / 15) * 0.06})`
    : "transparent";

  const feedbackState = !task ? "timeout"
    : selected === task.correct ? "ok"
    : selected === null ? "timeout" : "no";

  // Rolling last-10 results for the mini strip
  const recentResults = results.slice(-10);

  return (
    <div className="page-shell">
      <Header sidebarOpen={sidebarOpen} onToggleSidebar={() => setSidebarOpen(v => !v)} />
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <main className="page-main pz-main">

        {screen === "lobby" && (
          <LobbyScreen
            selectedTopic={selectedTopic}
            onTopicSelect={setSelectedTopic}
            onStart={startGame}
            bestStreak={bestStreak}
            bestScore={bestScore}
            bestTotal={bestTotal}
          />
        )}

        {screen === "game" && task && (
          <div className="pz-shell">
            <div className="pz-game">

              <div className="pz-game__top">
                <div className="pz-game__top-left">
                  <div className={`pz-streak${streakAnim ? " pz-streak--pop" : ""}`}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" className="pz-streak__flame">
                      <path d="M12 2c0 0-5 4.5-5 9.5a5 5 0 0 0 10 0C17 6.5 12 2 12 2zm0 14a3 3 0 0 1-3-3c0-2.5 3-6 3-6s3 3.5 3 6a3 3 0 0 1-3 3z"/>
                    </svg>
                    <strong>{streak}</strong>
                    <span>streak</span>
                  </div>
                  <div className="pz-game__xp">
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor">
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                    </svg>
                    +{sessionXP} XP
                  </div>
                  <div className="pz-game__counter-inf">
                    <span className="pz-game__counter-num">{correct}</span>
                    <span className="pz-game__counter-sep">/</span>
                    <span className="pz-game__counter-num">{total}</span>
                    <span className="pz-game__counter-label">correct</span>
                  </div>
                </div>
                <div className="pz-game__top-right">
                  <button className="pz-game__quit-btn" onClick={handleQuit}>
                    Stop &amp; see results
                  </button>
                </div>
              </div>

              {/* Rolling last-10 strip instead of fixed dots */}
              <div className="pz-game__strip">
                {recentResults.length > 0 ? (
                  recentResults.map((r, i) => (
                    <div key={i} className={`pz-gdot pz-gdot--${r ? "ok" : "no"}`} />
                  ))
                ) : (
                  <div className="pz-game__strip-empty">answer to start tracking</div>
                )}
              </div>

              <div className="pz-qcard" key={`q-${idx}`}
                style={{ background: `color-mix(in srgb, var(--card-bg) 100%, ${cardTint})` }}>
                <div className="pz-qcard__head">
                  {task.category && <span className="pz-qcat">{task.category}</span>}
                  {!revealed && <TimerRing timeLeft={timeLeft} total={TIMER_SECS} />}
                  {revealed && (
                    <div className={`pz-qcard__verdict pz-qcard__verdict--${feedbackState}`}>
                      {feedbackState === "ok" ? "✓" : feedbackState === "timeout" ? "—" : "✗"}
                    </div>
                  )}
                </div>

                <p className="pz-qcard__text">{task.text}</p>

                {revealed && (
                  <div className={`pz-feedback pz-feedback--${feedbackState}`}>
                    <span className="pz-feedback__msg">
                      {feedbackState === "ok"
                        ? streak >= 5 ? `🔥 ${streak} in a row!`
                          : streak >= 3 ? `${streak}-streak`
                          : "Correct"
                        : feedbackState === "timeout"
                        ? `Time's up — answer: ${task.correct}`
                        : `Wrong — correct: ${task.correct}`}
                    </span>
                    <button className="pz-feedback__next" onClick={handleNext}>
                      Next →
                    </button>
                  </div>
                )}

                {!revealed && (
                  <div className="pz-qcard__hint">
                    <kbd>A</kbd><kbd>B</kbd><kbd>C</kbd><kbd>D</kbd>
                    <span>or click</span>
                  </div>
                )}

                {xpPop && (
                  <div className="pz-xppop" key={xpPop.key} aria-hidden="true">
                    +{xpPop.amount}<span>XP</span>
                  </div>
                )}
              </div>

              <div className="pz-tiles">
                {task.options.map((opt) => {
                  let state = "idle";
                  if (revealed) {
                    if (opt.label === task.correct)  state = "correct";
                    else if (opt.label === selected) state = "wrong";
                    else                             state = "dim";
                  }
                  return (
                    <button key={opt.label}
                      className={`pz-tile pz-tile--${state}`}
                      onClick={() => handleSelect(opt.label)}
                      disabled={revealed}>
                      <span className="pz-tile__lbl">{opt.label}</span>
                      <span className="pz-tile__val">{opt.value}</span>
                      {revealed && opt.label === task.correct && (
                        <span className="pz-tile__mark pz-tile__mark--ok">
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round">
                            <polyline points="20 6 9 17 4 12"/>
                          </svg>
                        </span>
                      )}
                      {revealed && opt.label === selected && opt.label !== task.correct && (
                        <span className="pz-tile__mark pz-tile__mark--no">
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round">
                            <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                          </svg>
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>

            </div>
            <NotesPanel sessionId={`pz_${selectedTopic.id}`} />
          </div>
        )}

        {screen === "results" && (
          <ResultsScreen
            correct={correct}
            total={total}
            sessionXP={sessionXP}
            bestStreak={sessionBest}
            results={results}
            onRestart={startGame}
            onLobby={() => setScreen("lobby")}
          />
        )}

      </main>
    </div>
  );
};

export default PuzzlesPage;