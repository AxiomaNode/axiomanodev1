import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Header from "../components/layout/Header";
import Sidebar from "../components/layout/Sidebar";
import "../styles/home.css";
import "../styles/layout.css";

/* ── Radar Chart ── */
const RadarChart = () => {
  const blocks = [
    { abbr: "A", score: 0.80 },
    { abbr: "B", score: 0.27 },
    { abbr: "C", score: 0.21 },
    { abbr: "D", score: 0.75 },
    { abbr: "E", score: 0.34 },
  ];
  const cx = 130, cy = 130, r = 90;
  const n = blocks.length;
  const angleOf = (i) => (i / n) * 2 * Math.PI - Math.PI / 2;
  const toXY = (i, radius) => ({
    x: cx + radius * Math.cos(angleOf(i)),
    y: cy + radius * Math.sin(angleOf(i)),
  });
  const rings = [0.25, 0.5, 0.75, 1.0];
  const dataPoints = blocks.map((b, i) => toXY(i, r * b.score));
  const dataPath = dataPoints.map((p, i) => `${i === 0 ? "M" : "L"}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(" ") + " Z";

  return (
    <svg viewBox="0 0 260 260" className="home-radar">
      {rings.map((ring) => {
        const pts = Array.from({ length: n }, (_, i) => toXY(i, r * ring));
        const path = pts.map((p, i) => `${i === 0 ? "M" : "L"}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(" ") + " Z";
        return <path key={ring} d={path} fill="none" stroke="rgba(42,143,160,0.15)" strokeWidth="1" />;
      })}
      {blocks.map((_, i) => {
        const outer = toXY(i, r);
        return <line key={i} x1={cx} y1={cy} x2={outer.x.toFixed(1)} y2={outer.y.toFixed(1)} stroke="rgba(42,143,160,0.2)" strokeWidth="1" />;
      })}
      <path d={dataPath} fill="rgba(42,143,160,0.15)" stroke="none" />
      <path d={dataPath} fill="none" stroke="#2a8fa0" strokeWidth="2" strokeLinejoin="round" />
      {dataPoints.map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r="4" fill="#2a8fa0" stroke="#fff" strokeWidth="2" />
      ))}
      {blocks.map((b, i) => {
        const labelPt = toXY(i, r + 22);
        return (
          <text key={i} x={labelPt.x.toFixed(1)} y={labelPt.y.toFixed(1)} textAnchor="middle" dominantBaseline="middle"
            fontSize="9.5" fill="#4b5563" fontFamily="-apple-system, sans-serif" fontWeight="600">
            {b.abbr}
          </text>
        );
      })}
    </svg>
  );
};

/* ── Network BG ── */
const NetworkBg = () => (
  <svg className="home-hero__network" viewBox="0 0 900 500" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    {[[80,60],[220,30],[400,80],[580,40],[750,90],[860,50],[140,180],[320,150],[500,200],[680,160],[820,200],[60,300],[200,280],[380,320],[540,290],[720,310],[880,280],[120,420],[300,400],[480,440],[650,410],[800,450]].map(([x,y],i) => (
      <circle key={i} cx={x} cy={y} r={i%3===0?4:3} fill="rgba(42,143,160,0.25)" />
    ))}
    {[[80,60,220,30],[220,30,400,80],[400,80,580,40],[580,40,750,90],[750,90,860,50],[80,60,140,180],[220,30,320,150],[400,80,500,200],[580,40,680,160],[750,90,820,200],[140,180,320,150],[320,150,500,200],[500,200,680,160],[680,160,820,200],[140,180,60,300],[320,150,200,280],[500,200,380,320],[680,160,540,290],[820,200,720,310],[60,300,200,280],[200,280,380,320],[380,320,540,290],[540,290,720,310],[720,310,880,280],[60,300,120,420],[200,280,300,400],[380,320,480,440],[540,290,650,410],[720,310,800,450],[120,420,300,400],[300,400,480,440],[480,440,650,410],[650,410,800,450]].map(([x1,y1,x2,y2],i) => (
      <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="rgba(42,143,160,0.12)" strokeWidth="1" />
    ))}
    <text x="50"  y="240" fill="rgba(42,143,160,0.12)" fontSize="52" fontFamily="Georgia, serif">∑</text>
    <text x="700" y="380" fill="rgba(42,143,160,0.1)"  fontSize="40" fontFamily="Georgia, serif">∫</text>
    <text x="430" y="460" fill="rgba(42,143,160,0.1)"  fontSize="36" fontFamily="Georgia, serif">Δ</text>
    <text x="810" y="140" fill="rgba(42,143,160,0.1)"  fontSize="30" fontFamily="Georgia, serif">π</text>
    <text x="260" y="470" fill="rgba(42,143,160,0.1)"  fontSize="28" fontFamily="Georgia, serif">f(x)</text>
    <text x="610" y="490" fill="rgba(42,143,160,0.1)"  fontSize="26" fontFamily="Georgia, serif">√n</text>
  </svg>
);

/* ── Survey Data ── */
const SURVEY_DATA = [
  {
    block: "A", label: "Conceptual Understanding", score: 120, max: 150,
    color: "#2a8fa0", pct: 80,
    finding: "Most students can identify definitions correctly — surface knowledge is intact.",
  },
  {
    block: "B", label: "Formal Procedures", score: 40, max: 150,
    color: "#c0392b", pct: 27,
    finding: "Sharp drop when applying methods step-by-step. Skipped steps are the most common error.",
  },
  {
    block: "C", label: "Strategic Choice", score: 21, max: 100,
    color: "#d35400", pct: 21,
    finding: "Weakest result. 68% of students jump to a formula before understanding what is asked.",
    highlight: true,
  },
  {
    block: "D", label: "Visual & Geometric Reasoning", score: 75, max: 100,
    color: "#27ae60", pct: 75,
    finding: "Students reason better when spatial or graphical context makes the logic explicit.",
  },
  {
    block: "E", label: "Non-Standard Problems", score: 34, max: 100,
    color: "#7a52c0", pct: 34,
    finding: "Without a recognisable algorithm, most students cannot construct a strategy from scratch.",
  },
];

/* ── Horizontal bar ── */
const SurveyBar = ({ data, maxWidth }) => {
  const widthPct = (data.pct / 100) * 100;
  return (
    <div className={`survey-row ${data.highlight ? "survey-row--highlight" : ""}`}>
      <div className="survey-row__meta">
        <span className="survey-row__block" style={{ color: data.color }}>Block {data.block}</span>
        <span className="survey-row__label">{data.label}</span>
        <span className="survey-row__fraction">{data.score}<span>/{data.max}</span></span>
        <span className="survey-row__pct" style={{ color: data.color }}>{data.pct}%</span>
      </div>
      <div className="survey-row__track">
        <div
          className="survey-row__fill"
          style={{ width: `${widthPct}%`, background: data.color }}
        />
        {/* Benchmark line at 50% */}
        <div className="survey-row__benchmark" />
      </div>
      <p className="survey-row__finding">{data.highlight && <span className="survey-row__finding-flag">Key finding — </span>}{data.finding}</p>
    </div>
  );
};

/* ══════════════════════════════════════════
   PAGE
══════════════════════════════════════════ */
const HomePage = () => {
  const { user } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const firstName = user?.displayName?.split(" ")[0] ?? "there";

  return (
    <div className="page-shell">
      <Header sidebarOpen={sidebarOpen} onToggleSidebar={() => setSidebarOpen(v => !v)} />
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <main className="page-main">

        {/* ── HERO ── */}
        <section className="home-hero">
          <NetworkBg />
          <div className="home-hero__content">
            <div className="home-hero__left">
              <div className="home-hero__tag">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
                </svg>
                Reasoning Diagnostic Platform
              </div>
              <h1 className="home-hero__headline">
                Welcome back,<br />
                <span className="home-hero__name">{firstName}</span>
              </h1>
              <p className="home-hero__sub">
                Most math errors aren't about bad calculation — they're gaps between
                stages of thinking. Axioma maps exactly where your logic breaks,
                so you fix the reasoning, not just the answer.
              </p>
              <div className="home-hero__actions">
                <Link to="/diagnostics" className="home-hero__btn home-hero__btn--primary">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
                  </svg>
                  Run Diagnostic
                </Link>
                <Link to="/progress" className="home-hero__btn home-hero__btn--ghost">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
                  </svg>
                  My Progress
                </Link>
              </div>
              <div className="home-hero__stats">
                <div className="home-hero__stat"><strong>5</strong><span>Thinking Blocks</span></div>
                <div className="home-hero__stat-divider" />
                <div className="home-hero__stat"><strong>50</strong><span>Students Surveyed</span></div>
                <div className="home-hero__stat-divider" />
                <div className="home-hero__stat"><strong>21%</strong><span>Block C Avg. Score</span></div>
              </div>
            </div>
            <div className="home-hero__right">
              <div className="home-hero__chart-card">
                <p className="home-hero__chart-label">Reasoning Map</p>
                <RadarChart />
                <div className="home-hero__chart-blocks">
                  {["A","B","C","D","E"].map((b, i) => (
                    <span key={b} className="home-hero__chart-block">
                      <span className="home-hero__chart-block-dot" style={{ background: ["#2a8fa0","#c0392b","#d35400","#27ae60","#7a52c0"][i] }} />
                      {b}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── SURVEY RESULTS ── */}
        <section className="home-survey-section">

          {/* Header */}
          <div className="home-survey-section__head">
            <div className="home-survey-section__head-left">
              <p className="home-survey-section__eyebrow">Survey · 50 students · 2026</p>
              <h1 className="home-survey-section__title">Where reasoning breaks down</h1>
              <p className="home-survey-section__sub">
                Students were assessed across five thinking blocks. The gap between Block A and Block C
                confirms the core hypothesis: errors come from <em>breaks between stages of reasoning</em>,
                not from arithmetic.
              </p>
            </div>
            <div className="home-survey-section__head-right">
              <div className="home-survey-section__stat-box">
                <span className="home-survey-section__stat-num" style={{ color: "#d35400" }}>21%</span>
                <span className="home-survey-section__stat-label">Block C — lowest score<br />across all 50 students</span>
              </div>
              <div className="home-survey-section__stat-box">
                <span className="home-survey-section__stat-num" style={{ color: "#2a8fa0" }}>80%</span>
                <span className="home-survey-section__stat-label">Block A — surface knowledge<br />is largely intact</span>
              </div>
            </div>
          </div>

          {/* Legend */}
          <div className="home-survey-section__legend">
            <span className="home-survey-section__legend-item">
              <span className="home-survey-section__legend-line" />
              50% benchmark
            </span>
            <span className="home-survey-section__legend-item">
              <span className="home-survey-section__legend-dot" style={{ background: "#d35400" }} />
              Highlighted = critical gap
            </span>
          </div>

          {/* Bars */}
          <div className="home-survey-section__bars">
            {SURVEY_DATA.map(d => <SurveyBar key={d.block} data={d} />)}
          </div>

          {/* Footer note */}
          <div className="home-survey-section__note">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
            <p>
              Scores are group averages across 50 secondary school students.
              Block A was scored out of 150 pts; Blocks C–E out of 100 pts each.
              Run a diagnostic to generate your personal reasoning map.
            </p>
            <Link to="/diagnostics" className="home-survey-section__cta">
              Start Diagnostic
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
              </svg>
            </Link>
          </div>
        </section>

        {/* ── FOOTER ── */}
        <footer className="home-footer">
          <div className="home-footer__left">
            <div className="home-footer__brand">
              <div className="header__logo-circle header__logo-circle--sm">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 2L2 7l10 5 10-5-10-5z"/>
                  <path d="M2 17l10 5 10-5"/>
                  <path d="M2 12l10 5 10-5"/>
                </svg>
              </div>
              <span>Axiomano</span>
            </div>
            <p>Mapping mathematical reasoning since 2025.</p>
          </div>
          <div className="home-footer__links">
            <Link to='/about'>Studies</Link>
            <Link to="/support">Contact us axiomandnode@gmail.com</Link>
            <a href="#">Privacy Policy</a>
          </div>
        </footer>

      </main>
    </div>
  );
};

export default HomePage;