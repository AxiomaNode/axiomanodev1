import { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import {
  collection,
  addDoc,
  getCountFromServer,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";
import Header from "../components/layout/Header";
import Sidebar from "../components/layout/Sidebar";
import "../styles/about.css";

const ChevronRight = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
    <polyline points="9 18 15 12 9 6" />
  </svg>
);

function useCountUp(target, duration = 1100, start = false) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (!start || target === 0) return;
    let t0 = null;
    const tick = (ts) => {
      if (!t0) t0 = ts;
      const p = Math.min((ts - t0) / duration, 1);
      setValue(Math.round((1 - Math.pow(1 - p, 3)) * target));
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [target, start, duration]);
  return value;
}

function useInView(threshold = 0.2) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    if (!ref.current) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setInView(true); },
      { threshold }
    );
    obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return [ref, inView];
}

const BLOCKS = [
  { id: "A", label: "Block A", name: "Conceptual Understanding",   score: 120, total: 150, pct: 80, color: "var(--teal)",  note: "Students can recall definitions correctly. Surface knowledge is largely intact." },
  { id: "B", label: "Block B", name: "Formal Procedures",          score: 40,  total: 150, pct: 27, color: "#f39c12",      note: "Sharp drop when applying methods step-by-step. Skipped steps are the most common error." },
  { id: "C", label: "Block C", name: "Strategic Choice",           score: 21,  total: 100, pct: 21, color: "#e74c3c",      note: "68% of students jump to a formula before understanding what is asked.", highlight: true },
  { id: "D", label: "Block D", name: "Visual & Geometric Reasoning",score: 75, total: 100, pct: 75, color: "#27ae60",      note: "Students reason better when spatial or graphical context makes logic explicit." },
  { id: "E", label: "Block E", name: "Non-Standard Problems",      score: 34,  total: 100, pct: 34, color: "#9b59b6",      note: "Without a familiar algorithm, most students struggle to construct a strategy." },
];

function BlockBar({ block, animate }) {
  const val = useCountUp(block.score, 950, animate);
  return (
    <div className={`ab-block-row${block.highlight ? " ab-block-row--highlight" : ""}`}>
      <div className="ab-block-row__head">
        <div className="ab-block-row__left">
          <span className="ab-block-row__id" style={{ color: block.color }}>{block.label}</span>
          <span className="ab-block-row__name">{block.name}</span>
        </div>
        <div className="ab-block-row__right">
          <span className="ab-block-row__score" style={{ color: block.color }}>{animate ? val : block.score}</span>
          <span className="ab-block-row__denom">/{block.total}</span>
          <span className="ab-block-row__pct" style={{ color: block.color }}>{block.pct}%</span>
        </div>
      </div>
      <div className="ab-block-row__track">
        <div className="ab-block-row__fill" style={{ width: animate ? `${block.pct}%` : "0%", background: block.color, transitionDelay: "0.1s" }} />
        <div className="ab-block-row__bench" />
      </div>
      <p className={`ab-block-row__note${block.highlight ? " ab-block-row__note--key" : ""}`}>
        {block.highlight && (
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
          </svg>
        )}
        {block.note}
      </p>
    </div>
  );
}

function AboutPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [supportCount, setSupportCount] = useState(null);
  const [loadingSupport, setLoadingSupport] = useState(false);
  const [supported, setSupported] = useState(false);

  const [heroRef,   heroInView]   = useInView(0.1);
  const [statsRef,  statsInView]  = useInView(0.2);
  const [blocksRef, blocksInView] = useInView(0.1);

  useEffect(() => {
    getCountFromServer(collection(db, "axioma_support"))
      .then((s) => setSupportCount(s.data().count))
      .catch(() => setSupportCount(null));
  }, []);

  const handleSupport = async () => {
    if (loadingSupport || supported) return;
    setLoadingSupport(true);
    try {
      await addDoc(collection(db, "axioma_support"), { createdAt: serverTimestamp() });
      setSupportCount((p) => (p !== null ? p + 1 : 1));
      setSupported(true);
    } catch (e) { console.error(e); }
    finally { setLoadingSupport(false); }
  };

  return (
    <div className="page-shell">
      <Header sidebarOpen={sidebarOpen} onToggleSidebar={() => setSidebarOpen((v) => !v)} />
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <main className="page-main">
        <div className="ab-page">

          {/* Breadcrumb */}
          <nav className="ab-breadcrumb">
            <Link to="/home" className="ab-breadcrumb__item">Home</Link>
            <ChevronRight />
            <span className="ab-breadcrumb__item ab-breadcrumb__item--active">About</span>
          </nav>

          {/* ─── HERO ─── */}
          <section className={`ab-hero${heroInView ? " ab-hero--visible" : ""}`} ref={heroRef}>
            <div className="ab-hero__left">
              <div className="ab-hero__eyebrow">
                <span className="ab-hero__dot" />
                REASONING DIAGNOSTIC PLATFORM · TASHKENT 2025
              </div>
              <h1 className="ab-hero__title">
                Most students don't<br />
                struggle with maths —<br />
                <span className="ab-hero__accent">they struggle with thinking.</span>
              </h1>
              <p className="ab-hero__lead">
                Most errors happen before the calculation — when a student misreads the problem,
                picks the wrong method, or skips a step they don't know is missing.
                Axioma finds exactly where that happens.
              </p>
              <div className="ab-hero__actions">
                <Link to="/diagnostics" className="ab-btn ab-btn--primary ab-btn--lg">
                  Run Diagnostic <ChevronRight />
                </Link>
                <a href="#research" className="ab-btn ab-btn--ghost">See the Research</a>
              </div>
            </div>

            <div className="ab-hero__right">
              <div className="ab-reasoning-preview">
                <div className="ab-reasoning-preview__header">
                  <span className="ab-reasoning-preview__label">Reasoning profile</span>
                  <span className="ab-reasoning-preview__tag">SAMPLE OUTPUT</span>
                </div>
                {BLOCKS.map((b, i) => (
                  <div key={b.id} className="ab-mini-row">
                    <span className="ab-mini-row__id" style={{ color: b.color }}>{b.id}</span>
                    <div className="ab-mini-row__track">
                      <div
                        className="ab-mini-row__fill"
                        style={{
                          width: heroInView ? `${b.pct}%` : "0%",
                          background: b.color,
                          transitionDelay: `${i * 0.07}s`,
                        }}
                      />
                    </div>
                    <span className="ab-mini-row__pct" style={{ color: b.color }}>{b.pct}%</span>
                  </div>
                ))}
                <div className="ab-reasoning-preview__gap">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10"/>
                    <line x1="12" y1="8" x2="12" y2="12"/>
                    <line x1="12" y1="16" x2="12.01" y2="16"/>
                  </svg>
                  Block C: strategic reasoning needs attention
                </div>
              </div>
            </div>
          </section>

          {/* ─── STATS ─── */}
          <div className="ab-stats" ref={statsRef}>
            {[
              { val: "50",  label: "Students surveyed",  note: "Secondary school · 2025" },
              { val: "5",   label: "Thinking blocks",    note: "A → E complexity" },
              { val: "21%", label: "Weakest result",     note: "Block C — method choice" },
              { val: "80%", label: "Strongest result",   note: "Block A — definitions" },
            ].map((s, i) => (
              <div key={i} className={`ab-stat${statsInView ? " ab-stat--visible" : ""}`} style={{ transitionDelay: `${i * 0.08}s` }}>
                <strong className="ab-stat__val">{s.val}</strong>
                <span className="ab-stat__label">{s.label}</span>
                <span className="ab-stat__note">{s.note}</span>
              </div>
            ))}
          </div>

          {/* ─── PROBLEM ─── */}
          <section className="ab-section" id="research">
            <div className="ab-section__tag"><span className="ab-tag-num">01</span> Problem Statement</div>
            <div className="ab-two-col">
              <div>
                <h2 className="ab-section__title">
                  Assessment rewards memorisation.<br />
                  Axioma reveals understanding.
                </h2>
                <p className="ab-body">
                  School mathematics grading focuses almost exclusively on final answers.
                  Two students can receive the same mark while making completely different
                  mistakes — and neither gets feedback on what actually went wrong.
                </p>
                <p className="ab-body">
                  Over time, this pushes students toward formula memorisation instead of
                  genuine reasoning. When the curriculum accelerates, those hidden gaps
                  widen — suddenly.
                </p>
              </div>
              <div className="ab-aside">
                <blockquote className="ab-quote">
                  <p>"Two students with the same grade can have completely different problems — and neither of them knows it."</p>
                  <footer>— Axioma research team</footer>
                </blockquote>
                <div className="ab-list-card">
                  <p className="ab-list-card__title">What grades don't capture</p>
                  <ul className="ab-checklist">
                    {[
                      "Misreading what the problem asks",
                      "Choosing the wrong solution method",
                      "Silently skipping reasoning steps",
                      "Applying formulas without understanding",
                    ].map((item, i) => (
                      <li key={i} className="ab-checklist__item ab-checklist__item--x">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                          <line x1="18" y1="6" x2="6" y2="18"/>
                          <line x1="6" y1="6" x2="18" y2="18"/>
                        </svg>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* ─── HYPOTHESIS ─── */}
          <section className="ab-section">
            <div className="ab-section__tag"><span className="ab-tag-num">02</span> Research Hypothesis</div>
            <div className="ab-hypothesis">
              <div className="ab-hypothesis__statement">
                <p className="ab-hypothesis__text">
                  Most mathematical errors are not caused by computational difficulties.
                  They originate from <em>breaks between stages of thinking</em> — misunderstanding
                  the problem, choosing an inappropriate method, or failing to connect different representations.
                </p>
              </div>
              <div className="ab-stages">
                {[
                  { num: "01", label: "Understand the problem", break: false },
                  { num: "02", label: "Choose a method",        break: true  },
                  { num: "03", label: "Execute the procedure",  break: false },
                  { num: "04", label: "Interpret the result",   break: false },
                ].map((s, i, arr) => (
                  <div key={i} className="ab-stage-wrap">
                    <div className={`ab-stage-node${s.break ? " ab-stage-node--break" : ""}`}>
                      <span className="ab-stage-node__num">{s.num}</span>
                      <span className="ab-stage-node__label">{s.label}</span>
                      {s.break && <span className="ab-stage-node__badge">← gap detected here</span>}
                    </div>
                    {i < arr.length - 1 && (
                      <div className={`ab-stage-arrow${s.break ? " ab-stage-arrow--broken" : ""}`}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <line x1="12" y1="5" x2="12" y2="19"/>
                          <polyline points="19 12 12 19 5 12"/>
                        </svg>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* ─── SURVEY RESULTS ─── */}
          <section className="ab-section" ref={blocksRef}>
            <div className="ab-section__tag"><span className="ab-tag-num">03</span> Survey Results · 50 Students · 2025</div>
            <div className="ab-survey-intro">
              <h2 className="ab-section__title" style={{ margin: 0 }}>Where reasoning breaks down</h2>
              <div className="ab-survey-legend">
                <span className="ab-legend-item"><span className="ab-legend-line" /> 50% benchmark</span>
                <span className="ab-legend-item ab-legend-item--warn"><span className="ab-legend-dot" /> Critical gap</span>
              </div>
            </div>
            <div className="ab-blocks-panel">
              {BLOCKS.map((b) => <BlockBar key={b.id} block={b} animate={blocksInView} />)}
            </div>
            <p className="ab-footnote">
              Group averages across 50 secondary school students. Block A scored out of 150 pts; Blocks B–E out of 100 pts each.
              <Link to="/diagnostics" className="ab-footnote__link">Start your own diagnostic →</Link>
            </p>
          </section>

          {/* ─── WHAT AXIOMA DOES ─── */}
          <section className="ab-section">
            <div className="ab-section__tag"><span className="ab-tag-num">04</span> What Axioma Does</div>
            <div className="ab-two-col">
              <div>
                <h2 className="ab-section__title">Not a grade — a reasoning map.</h2>
                <p className="ab-body">
                  After a short diagnostic, Axioma shows exactly which thinking blocks
                  need work — not a percentage, but a specific description of where and
                  how reasoning broke down.
                </p>
                <p className="ab-body">
                  Students get targeted practice and theory linked to their exact gaps.
                  Parents see a clear picture of where to focus — no guessing.
                </p>
              </div>
              <div className="ab-aside">
                <div className="ab-list-card">
                  <p className="ab-list-card__title">For students</p>
                  <ul className="ab-checklist">
                    {["Short diagnostic — ~12 min", "See exactly which block failed", "Targeted practice, not random drills", "Theory explained from first principles"].map((item, i) => (
                      <li key={i} className="ab-checklist__item ab-checklist__item--check">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                        {item}
                      </li>
                    ))}
                  </ul>
                  <div className="ab-list-card__divider" />
                  <p className="ab-list-card__title">For parents</p>
                  <ul className="ab-checklist">
                    {["Clear, jargon-free reasoning report", "Know exactly where to focus", "Track progress over time"].map((item, i) => (
                      <li key={i} className="ab-checklist__item ab-checklist__item--check">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* ─── TEAM ─── */}
          <section className="ab-section">
            <div className="ab-section__tag"><span className="ab-tag-num">05</span> Built by</div>
            <div className="ab-team-card">
              <div className="ab-team-card__left">
                <div className="ab-team-avatar">Ax</div>
                <div>
                  <h3 className="ab-team-name">Axioma Team</h3>
                  <span className="ab-team-loc">Tashkent · 2025</span>
                </div>
              </div>
              <p className="ab-team-bio">
                A small team of researchers and developers from Tashkent. We built Axioma
                after a structured study of 50 students that confirmed what teachers already
                knew: the problem isn't arithmetic — it's the invisible gaps in how students
                think through a problem. Axioma is the diagnostic tool that should have
                existed years ago.
              </p>
            </div>
          </section>

          {/* ─── CTA ─── */}
          <section className="ab-cta">
            <div className="ab-cta__inner">
              <div className="ab-cta__glow" />
              <div className="ab-cta__grid" />
              <div className="ab-cta__body">
                <p className="ab-cta__eyebrow">Free to use · Built to teach thinking</p>
                <h2 className="ab-cta__title">Find the gap<br />before the exam does.</h2>
                <p className="ab-cta__desc">
                  A 12-minute diagnostic. A personal reasoning map.
                  Targeted practice for exactly what needs work.
                </p>
                <div className="ab-cta__actions">
                  <Link to="/diagnostics" className="ab-btn ab-btn--primary ab-btn--lg">
                    Start Diagnostic <ChevronRight />
                  </Link>
                  <button
                    onClick={handleSupport}
                    disabled={loadingSupport || supported}
                    className={`ab-btn ab-btn--support${supported ? " ab-btn--supported" : ""}`}
                  >
                    {loadingSupport ? (
                      <><span className="ab-spinner" /> Saving...</>
                    ) : supported ? (
                      <><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg> Mission Supported</>
                    ) : "Support This Mission"}
                  </button>
                </div>
                {supportCount !== null && (
                  <p className="ab-cta__tally">
                    {supportCount > 0
                      ? <><strong>{supportCount}</strong> {supportCount === 1 ? "person has" : "people have"} supported this mission</>
                      : "Be the first to support this mission"}
                  </p>
                )}
              </div>
            </div>
          </section>

        </div>
      </main>
    </div>
  );
}

export default AboutPage;