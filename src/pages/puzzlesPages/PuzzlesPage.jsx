// src/pages/puzzlesPages/PuzzlesPage.jsx
import { useState, useEffect, useRef, useCallback } from "react";
import { Link } from "react-router-dom";
import { doc, updateDoc, increment } from "firebase/firestore";
import { db }      from "../../firebase/firebaseConfig";
import { useAuth } from "../../context/AuthContext";
import Header  from "../../components/layout/Header";
import Sidebar from "../../components/layout/Sidebar";
import { generateQuadraticTasks } from "../../core/generators/quadraticGenerator";
import "./puzzles.css";
import "../../styles/layout.css";

// ── Constants ─────────────────────────────────────────────────
const TASKS_PER_SESSION = 10;
const BASE_XP           = 5;
const getXP = (streak) => streak >= 5 ? 10 : streak >= 3 ? 7 : BASE_XP;

// Tile accent colors — one per slot
const TILE_COLORS = [
  { bg: "#1e7a8a", glow: "rgba(42,143,160,0.45)",  name: "teal"   },
  { bg: "#a07d10", glow: "rgba(201,162,39,0.45)",   name: "gold"   },
  { bg: "#5e3fa0", glow: "rgba(122,82,192,0.45)",   name: "purple" },
  { bg: "#1a8a4a", glow: "rgba(39,174,96,0.45)",    name: "green"  },
];

const PARTICLE_COLORS = ["#2a8fa0","#c9a227","#27ae60","#9b59b6","#e0f4f7","#fff"];
const buildParticles = () =>
  Array.from({ length: 40 }, (_, i) => {
    const angle = (i / 40) * 2 * Math.PI + (Math.random() - 0.5) * 0.6;
    const dist  = 90 + Math.random() * 180;
    return {
      id: i,
      tx: Math.round(Math.cos(angle) * dist),
      ty: Math.round(Math.sin(angle) * dist),
      color: PARTICLE_COLORS[i % PARTICLE_COLORS.length],
      size:  Math.round(5 + Math.random() * 11),
      delay: parseFloat((Math.random() * 0.14).toFixed(3)),
      round: i % 3 !== 0,
    };
  });

const PERF = [
  { min:10, medal:"🥇", title:"Perfect!",        sub:"Flawless. Every answer right." },
  { min: 8, medal:"🥈", title:"Excellent!",       sub:"Really sharp reasoning." },
  { min: 6, medal:"🥉", title:"Good job!",        sub:"Solid understanding overall." },
  { min: 4, medal:"📖", title:"Getting there.",   sub:"Review the weak areas and retry." },
  { min: 0, medal:"💡", title:"Keep practicing!", sub:"Every expert started here." },
];
const getPerf = (n) => PERF.find(p => n >= p.min);

const CAT_COLORS = {
  "Vieta's Formulas": "#9b59b6",
  "Discriminant":     "#2a8fa0",
  "Factoring":        "#d35400",
  "Vertex Form":      "#27ae60",
  "Common Mistakes":  "#c0392b",
  "Roots":            "#c9a227",
};

// ── Network background ────────────────────────────────────────
const NetworkBg = () => (
  <svg className="pz-network" viewBox="0 0 900 500" aria-hidden="true">
    {[[80,60],[220,30],[400,80],[580,40],[750,90],[860,50],[140,180],[320,150],
      [500,200],[680,160],[820,200],[60,300],[200,280],[380,320],[540,290],
      [720,310],[880,280],[120,420],[300,400],[480,440],[650,410],[800,450]].map(([x,y],i)=>(
      <circle key={i} cx={x} cy={y} r={i%3===0?4:3} fill="rgba(42,143,160,0.18)"/>
    ))}
    {[[80,60,220,30],[220,30,400,80],[400,80,580,40],[580,40,750,90],[140,180,320,150],
      [320,150,500,200],[500,200,680,160],[680,160,820,200],[60,300,200,280],
      [200,280,380,320],[380,320,540,290],[540,290,720,310],[120,420,300,400],
      [300,400,480,440],[480,440,650,410],[650,410,800,450],[80,60,140,180],
      [400,80,500,200],[750,90,820,200],[60,300,120,420]].map(([x1,y1,x2,y2],i)=>(
      <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="rgba(42,143,160,0.09)" strokeWidth="1"/>
    ))}
    <text x="50"  y="280" fill="rgba(42,143,160,0.06)" fontSize="60" fontFamily="Georgia,serif">∑</text>
    <text x="700" y="420" fill="rgba(42,143,160,0.05)" fontSize="48" fontFamily="Georgia,serif">∫</text>
    <text x="430" y="460" fill="rgba(42,143,160,0.05)" fontSize="40" fontFamily="Georgia,serif">Δ</text>
    <text x="820" y="130" fill="rgba(42,143,160,0.05)" fontSize="34" fontFamily="Georgia,serif">π</text>
  </svg>
);

// ═══════════════════════════════════════════
// PAGE
// ═══════════════════════════════════════════
const PuzzlesPage = () => {
  const { user } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [tasks,    setTasks]    = useState(() => generateQuadraticTasks(TASKS_PER_SESSION));
  const [idx,      setIdx]      = useState(0);
  const [selected, setSelected] = useState(null);
  const [revealed, setRevealed] = useState(false);
  const [results,  setResults]  = useState([]);
  const [done,     setDone]     = useState(false);

  const [streak,     setStreak]     = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [sessionXP,  setSessionXP]  = useState(0);
  const [correct,    setCorrect]    = useState(0);

  const [celebrating, setCelebrating] = useState(false);
  const [xpPop,       setXpPop]       = useState(null);
  const xpKey = useRef(0);
  const parts = useRef([]);

  const task = tasks[idx];

  const saveXP = useCallback(async (amount) => {
    if (!user) return;
    try { await updateDoc(doc(db, "users", user.uid), { ratingPoints: increment(amount) }); }
    catch (e) { console.error("XP:", e); }
  }, [user]);

  const handleSelect = useCallback(async (label) => {
    if (revealed) return;
    setSelected(label);
    setRevealed(true);

    const isOk = label === task.correct;
    setResults(r => [...r, isOk]);

    if (isOk) {
      const ns = streak + 1;
      const xp = getXP(ns);
      setStreak(ns);
      setBestStreak(b => Math.max(b, ns));
      setCorrect(c => c + 1);
      setSessionXP(s => s + xp);
      parts.current = buildParticles();
      xpKey.current++;
      setCelebrating(true);
      setXpPop({ amount: xp, bonus: xp - BASE_XP, key: xpKey.current });
      setTimeout(() => { setCelebrating(false); setXpPop(null); }, 1700);
      await saveXP(xp);
    } else {
      setStreak(0);
    }
  }, [revealed, task, streak, saveXP]);

  const handleNext = useCallback(() => {
    if (idx + 1 >= TASKS_PER_SESSION) { setDone(true); }
    else {
      setIdx(i => i + 1);
      setSelected(null);
      setRevealed(false);
    }
  }, [idx]);

  const handleRestart = () => {
    setTasks(generateQuadraticTasks(TASKS_PER_SESSION));
    setIdx(0); setSelected(null); setRevealed(false);
    setResults([]); setDone(false);
    setStreak(0); setBestStreak(0); setSessionXP(0); setCorrect(0);
  };

  useEffect(() => {
    const onKey = (e) => {
      if (done) return;
      if (revealed) {
        if (e.key === "Enter" || e.key === " ") { e.preventDefault(); handleNext(); }
        return;
      }
      const map = { a:"A", b:"B", c:"C", d:"D" };
      const lbl = map[e.key.toLowerCase()];
      if (lbl) handleSelect(lbl);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [revealed, done, handleNext, handleSelect]);

  const catColor = task ? (CAT_COLORS[task.category] || "#64748b") : "#64748b";

  return (
    <div className="page-shell">
      <Header sidebarOpen={sidebarOpen} onToggleSidebar={() => setSidebarOpen(v => !v)} />
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {celebrating && <div className="pz-flash" aria-hidden="true" />}

      <main className="page-main pz-main">
        <NetworkBg />

        {done ? (
          /* ══ RESULTS ════════════════════════════════════════════ */
          <div className="pz-results">
            <div className="pz-results__card">
              <div className="pz-results__topbar" />
              <span className="pz-results__medal">{getPerf(correct).medal}</span>
              <h2 className="pz-results__title">{getPerf(correct).title}</h2>
              <p className="pz-results__sub">{getPerf(correct).sub}</p>

              <div className="pz-results__xp">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                </svg>
                +{sessionXP} XP earned this session
              </div>

              <div className="pz-results__grid">
                {[
                  { val:`${correct}/${TASKS_PER_SESSION}`, key:"Correct" },
                  { val:`${Math.round((correct/TASKS_PER_SESSION)*100)}%`, key:"Accuracy" },
                  { val:bestStreak, key:"Best streak" },
                ].map(s => (
                  <div key={s.key} className="pz-results__stat">
                    <strong>{s.val}</strong><span>{s.key}</span>
                  </div>
                ))}
              </div>

              <div className="pz-results__dots">
                {results.map((r, i) => (
                  <div key={i} className={`pz-rdot pz-rdot--${r?"ok":"no"}`}
                    title={`Q${i+1}: ${r?"Correct":"Wrong"}`}>{r?"✓":"✗"}</div>
                ))}
              </div>

              <div className="pz-results__btns">
                <button className="pz-rbtn pz-rbtn--primary" onClick={handleRestart}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                    <polyline points="1 4 1 10 7 10"/>
                    <path d="M3.51 15a9 9 0 1 0 .49-4.34"/>
                  </svg>
                  Play again
                </button>
                <Link to="/home" className="pz-rbtn pz-rbtn--ghost">← Home</Link>
              </div>
            </div>
          </div>
        ) : (
          /* ══ GAME SCREEN ════════════════════════════════════════ */
          <div className="pz-game" key={idx}>

            {/* ── Top bar ───────────────────────────────────────── */}
            <div className="pz-topbar">
              <nav className="pz-breadcrumb">
                <Link to="/home" className="pz-breadcrumb__item">Home</Link>
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <polyline points="9 18 15 12 9 6"/>
                </svg>
                <span className="pz-breadcrumb__item pz-breadcrumb__item--cur">Puzzles</span>
              </nav>

              {/* progress dots */}
              <div className="pz-topdots">
                {Array.from({ length: TASKS_PER_SESSION }, (_, i) => {
                  let s = "idle";
                  if (i < results.length) s = results[i] ? "ok" : "no";
                  else if (i === idx)     s = "active";
                  return <div key={i} className={`pz-topdot pz-topdot--${s}`} />;
                })}
              </div>

              {/* stats chips */}
              <div className="pz-topbar__chips">
                <div className={`pz-chip pz-chip--streak${streak>=5?" pz-chip--blaze":streak>=3?" pz-chip--hot":""}`}>
                  <span>{streak >= 3 ? "🔥" : "⚡"}</span>
                  <strong>{streak}</strong>
                </div>
                <div className="pz-chip pz-chip--xp">
                  <svg width="9" height="9" viewBox="0 0 24 24" fill="currentColor">
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                  </svg>
                  <strong>+{sessionXP}</strong>
                </div>
                <div className="pz-chip pz-chip--score">
                  <strong className="pz-chip__ok">{correct}</strong>
                  <span>/{idx}</span>
                </div>
              </div>
            </div>

            {/* ── QUESTION SECTION ──────────────────────────────── */}
            <div className={`pz-qsection${celebrating?" pz-qsection--glow":""}`}>
              <div className="pz-qsection__meta">
                <span className="pz-qsection__num">{idx+1} <em>/ {TASKS_PER_SESSION}</em></span>
                {task.category && (
                  <span className="pz-qsection__cat" style={{
                    color: catColor,
                    borderColor: catColor + "45",
                    background:  catColor + "14",
                  }}>{task.category}</span>
                )}
                <span className="pz-qsection__hint">
                  <kbd>A</kbd><kbd>B</kbd><kbd>C</kbd><kbd>D</kbd>
                  <span>or click</span>
                </span>
              </div>

              <p className="pz-qsection__text">{task.text}</p>

              {/* inline feedback */}
              {revealed && (
                <div className={`pz-feedback pz-feedback--${selected===task.correct?"ok":"no"}`}>
                  <span className="pz-feedback__icon">
                    {selected === task.correct ? "✓" : "✗"}
                  </span>
                  <span className="pz-feedback__msg">
                    {selected === task.correct
                      ? streak >= 5 ? `🔥 ${streak} in a row!`
                      : streak >= 3 ? `⚡ ${streak}-streak!`
                      : "Correct!"
                      : `Wrong — correct answer is ${task.correct}`}
                  </span>
                  {selected === task.correct && xpPop?.bonus > 0 && (
                    <span className="pz-feedback__bonus">+{xpPop.bonus} streak bonus</span>
                  )}
                  <button className="pz-feedback__next" onClick={handleNext}>
                    {idx + 1 < TASKS_PER_SESSION ? "Next →" : "See results →"}
                  </button>
                </div>
              )}

              {/* XP pop + particles stay inside question panel */}
              {xpPop && (
                <div className="pz-xppop" key={xpPop.key} aria-hidden="true">
                  +{xpPop.amount}<span>XP</span>
                </div>
              )}
              {celebrating && (
                <div className="pz-particles" aria-hidden="true">
                  {parts.current.map(p => (
                    <div key={p.id} className="pz-particle" style={{
                      "--tx":    `${p.tx}px`,
                      "--ty":    `${p.ty}px`,
                      "--color": p.color,
                      "--size":  `${p.size}px`,
                      "--delay": `${p.delay}s`,
                      borderRadius: p.round ? "50%" : "3px",
                    }}/>
                  ))}
                </div>
              )}
            </div>

            {/* ── OPTIONS SECTION  2×2 ──────────────────────────── */}
            <div className="pz-osection">
              {task.options.map((opt, oi) => {
                const tc = TILE_COLORS[oi];
                let state = "idle";
                if (revealed) {
                  if (opt.label === task.correct)   state = "correct";
                  else if (opt.label === selected)  state = "wrong";
                  else                              state = "dim";
                }
                return (
                  <button
                    key={opt.label}
                    className={`pz-tile pz-tile--${state}`}
                    style={{ "--tc": tc.bg, "--tglow": tc.glow }}
                    onClick={() => handleSelect(opt.label)}
                    disabled={revealed}
                    aria-label={`Option ${opt.label}: ${opt.value}`}
                  >
                    <span className="pz-tile__lbl">{opt.label}</span>
                    <span className="pz-tile__val">{opt.value}</span>
                    {revealed && opt.label === task.correct && (
                      <span className="pz-tile__mark pz-tile__mark--ok">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
                          stroke="currentColor" strokeWidth="3" strokeLinecap="round">
                          <polyline points="20 6 9 17 4 12"/>
                        </svg>
                      </span>
                    )}
                    {revealed && opt.label === selected && opt.label !== task.correct && (
                      <span className="pz-tile__mark pz-tile__mark--no">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
                          stroke="currentColor" strokeWidth="3" strokeLinecap="round">
                          <line x1="18" y1="6" x2="6" y2="18"/>
                          <line x1="6" y1="6" x2="18" y2="18"/>
                        </svg>
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

          </div>
        )}
      </main>
    </div>
  );
};

export default PuzzlesPage;