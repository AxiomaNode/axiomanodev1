// src/components/sections/ProgressSections.jsx
import { useState, useRef, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { topics } from "../../data/topics";
import DailyTodoPanel from "../DailyTodoPanel";

const ChevronRight = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="2.5" strokeLinecap="round">
    <polyline points="9 18 15 12 9 6"/>
  </svg>
);

const formatDate = (iso) => {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
};

const formatTime = (iso) => {
  if (!iso) return "—";
  return new Date(iso).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });
};

const scoreColor = (pct) => (pct >= 70 ? "#27ae60" : pct >= 40 ? "#d35400" : "#c0392b");

const toLocalDate = (iso) => {
  const d = new Date(iso);
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`;
};

const getThisWeekDates = () => {
  const now = new Date();
  const day = now.getDay();
  const monday = new Date(now);
  monday.setDate(now.getDate() - ((day + 6) % 7));
  monday.setHours(0,0,0,0);
  return monday;
};

const getThisMonthStart = () => {
  const d = new Date();
  return new Date(d.getFullYear(), d.getMonth(), 1);
};

const computeGapsClosedThisMonth = (diagnostics) => {
  const monthStart = getThisMonthStart();
  const sorted = [...diagnostics].sort((a,b) => new Date(a.date) - new Date(b.date));
  const thisMonth = sorted.filter(d => new Date(d.date) >= monthStart);
  if (thisMonth.length < 2) return 0;
  const seenThisMonth = new Set();
  thisMonth.forEach(s => {
    (s.gaps || []).forEach(g => {
      const key = g.coreGapId || g.id;
      if (key) seenThisMonth.add(key);
    });
  });
  const latest = thisMonth[thisMonth.length - 1];
  const latestGapKeys = new Set((latest.gaps || []).map(g => g.coreGapId || g.id));
  let closed = 0;
  seenThisMonth.forEach(key => { if (!latestGapKeys.has(key)) closed++; });
  return closed;
};

const computeInsights = (diagnostics, practice) => {
  const insights = [];
  const weekStart = getThisWeekDates();
  const monthStart = getThisMonthStart();

  const diagThisWeek = diagnostics.filter(d => new Date(d.date) >= weekStart).length;
  if (diagThisWeek >= 3) {
    insights.push({ type: "fire", text: `${diagThisWeek} diagnostics this week — strong consistency.`, positive: true });
  } else if (diagThisWeek === 1) {
    insights.push({ type: "clock", text: "1 diagnostic this week. Come back tomorrow to keep the signal clean.", positive: null });
  }

  const pracThisWeek = practice.filter(p => new Date(p.date) >= weekStart).length;
  if (pracThisWeek >= 3) {
    insights.push({ type: "check", text: `${pracThisWeek} practice sessions this week.`, positive: true });
  }

  const sorted = [...diagnostics].sort((a,b) => new Date(b.date) - new Date(a.date));
  if (sorted.length >= 6) {
    const avg = (arr) => arr.reduce((s,d) => s + (d.score.correct/d.score.total)*100, 0) / arr.length;
    const delta = Math.round(avg(sorted.slice(0,3)) - avg(sorted.slice(3,6)));
    if (delta >= 5)       insights.push({ type: "up",   text: `Accuracy up ${delta}% over your last 3 diagnostics.`,              positive: true  });
    else if (delta <= -5) insights.push({ type: "down", text: `Accuracy down ${Math.abs(delta)}% over your last 3 diagnostics. Review gaps.`, positive: false });
  }

  const activeDays = new Set([
    ...diagnostics.filter(d => new Date(d.date) >= monthStart).map(d => toLocalDate(d.date)),
    ...practice.filter(p => new Date(p.date) >= monthStart).map(p => toLocalDate(p.date)),
  ]).size;
  if (activeDays >= 10)     insights.push({ type: "calendar", text: `Active ${activeDays} days this month.`,                             positive: true });
  else if (activeDays >= 5) insights.push({ type: "calendar", text: `Active ${activeDays} days this month — keep building the habit.`,   positive: null });

  const gapsClosed = computeGapsClosedThisMonth(diagnostics);
  if (gapsClosed > 0) insights.push({ type: "trophy", text: `${gapsClosed} reasoning gap${gapsClosed !== 1 ? "s" : ""} closed this month.`, positive: true });

  return insights.slice(0, 4);
};

const INSIGHT_ICONS = {
  fire:     <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2c0 0-5 4.5-5 9.5a5 5 0 0 0 10 0C17 6.5 12 2 12 2z"/></svg>,
  check:    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>,
  up:       <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="18 15 12 9 6 15"/></svg>,
  down:     <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="6 9 12 15 18 9"/></svg>,
  clock:    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>,
  calendar: <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>,
  trophy:   <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M6 9H4a2 2 0 0 1-2-2V5h4"/><path d="M18 9h2a2 2 0 0 0 2-2V5h-4"/><path d="M12 17v4"/><path d="M8 21h8"/><path d="M6 9a6 6 0 0 0 12 0V3H6z"/></svg>,
};

const DisciplineInsights = ({ diagnostics, practice }) => {
  const insights = useMemo(() => computeInsights(diagnostics, practice), [diagnostics, practice]);
  if (!insights.length) return null;
  return (
    <div className="progress-insights">
      <div className="progress-insights__header">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
        </svg>
        <span>Activity insights</span>
      </div>
      <div className="progress-insights__list">
        {insights.map((ins, i) => (
          <div key={i} className={`progress-insight progress-insight--${ins.positive === true ? "good" : ins.positive === false ? "warn" : "neutral"}`}>
            <span className="progress-insight__icon">{INSIGHT_ICONS[ins.type]}</span>
            <span className="progress-insight__text">{ins.text}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

const MiniRing = ({ pct, color, size = 48 }) => {
  const r = 20, circ = 2 * Math.PI * r;
  const dash = (pct / 100) * circ;
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" style={{ flexShrink: 0 }}>
      <circle cx="24" cy="24" r={r} fill="none" stroke="var(--border)" strokeWidth="5"/>
      <circle cx="24" cy="24" r={r} fill="none" stroke={color} strokeWidth="5"
        strokeDasharray={`${dash} ${circ}`} strokeLinecap="round" transform="rotate(-90 24 24)"/>
      <text x="24" y="24" textAnchor="middle" dominantBaseline="middle"
        fontSize="8.5" fontWeight="700" fill={color} fontFamily="-apple-system, sans-serif">
        {pct}%
      </text>
    </svg>
  );
};

// ── Chart ─────────────────────────────────────────────────────────────────────

const DIAG_COL = "#2a8fa0";
const PRAC_COL = "#d35400";

const ProgressChart = ({ diagnostics, practice }) => {
  const wrapRef = useRef(null);
  const [tooltip, setTooltip] = useState(null);
  const [drawn, setDrawn] = useState(false);

  // Fire animation only when chart enters viewport
  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setDrawn(true); obs.disconnect(); } },
      { threshold: 0.15 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const W = 860, H = 220;
  const PAD = { top: 24, right: 24, bottom: 16, left: 44 };
  const IW  = W - PAD.left - PAD.right;
  const IH  = H - PAD.top  - PAD.bottom;

  const diagPts = [...diagnostics]
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .map(d => ({ date: d.date, pct: Math.round((d.score.correct / d.score.total) * 100), label: d.topicTitle }));

  const pracPts = [...practice]
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .map(p => {
      const c = Number(p.correct) || 0, w = Number(p.wrong) || 0, t = c + w;
      return { date: p.date, pct: t > 0 ? Math.round((c / t) * 100) : 0, label: topics.find(t2 => t2.id === p.topicId)?.title || p.topicId };
    });

  if (diagPts.length + pracPts.length < 1) return null;

  const xPos = (pts, i) => pts.length === 1 ? PAD.left + IW / 2 : PAD.left + (i / (pts.length - 1)) * IW;
  const yPos = (pct) => PAD.top + IH - (pct / 100) * IH;
  const poly = (pts) => pts.map((p, i) => `${xPos(pts, i).toFixed(1)},${yPos(p.pct).toFixed(1)}`).join(" ");

  const gridY = [0, 25, 50, 75, 100];
  const hasD  = diagPts.length > 0;
  const hasP  = pracPts.length > 0;
  const TW = 180, TH = 54;

  const clampTip = (cx, cy) => {
    const tx = Math.min(Math.max(cx - TW / 2, PAD.left), PAD.left + IW - TW);
    const aboveY = cy - TH - 12;
    return { tx, ty: aboveY < PAD.top ? cy + 14 : aboveY };
  };

  // Clip-path animates rect width left→right — GPU composited, no stroke recalc
  const clipRectStyle = (delay = 0) => ({
    width:      drawn ? IW : 0,
    transition: drawn ? `width 1.3s cubic-bezier(0.4,0,0.2,1) ${delay}ms` : "none",
  });

  const areaStyle = (delay = 0) => ({
    opacity:    drawn ? 1 : 0,
    transition: drawn ? `opacity 0.5s ease ${delay}ms` : "none",
  });

  // Dots: opacity only — SVG transform scale is CPU-rendered
  const dotStyle = (delay = 0) => ({
    opacity:    drawn ? 1 : 0,
    transition: drawn ? `opacity 0.3s ease ${delay}ms` : "none",
  });

  return (
    <div className="progress-chart-wrap" ref={wrapRef}>
      <div className="progress-chart-legend">
        {hasD && <span className="progress-chart-legend__item"><span className="progress-chart-legend__dot" style={{ background: DIAG_COL }}/>Diagnostics</span>}
        {hasP && <span className="progress-chart-legend__item"><span className="progress-chart-legend__dot" style={{ background: PRAC_COL }}/>Practice</span>}
      </div>
      <div className="progress-chart-svg-wrap">
        <svg viewBox={`0 0 ${W} ${H}`} className="progress-chart-svg" onMouseLeave={() => setTooltip(null)}>
          <defs>
            {/* Area gradients */}
            {hasD && diagPts.length > 1 && (
              <linearGradient id="psDiagGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%"   stopColor={DIAG_COL} stopOpacity="0.18"/>
                <stop offset="100%" stopColor={DIAG_COL} stopOpacity="0"/>
              </linearGradient>
            )}
            {hasP && pracPts.length > 1 && (
              <linearGradient id="psPracGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%"   stopColor={PRAC_COL} stopOpacity="0.14"/>
                <stop offset="100%" stopColor={PRAC_COL} stopOpacity="0"/>
              </linearGradient>
            )}
            {/* Clip paths — rect width animates left→right */}
            {hasD && diagPts.length > 1 && (
              <clipPath id="diagLineClip">
                <rect x={PAD.left} y={0} height={H} style={clipRectStyle(0)} />
              </clipPath>
            )}
            {hasP && pracPts.length > 1 && (
              <clipPath id="pracLineClip">
                <rect x={PAD.left} y={0} height={H} style={clipRectStyle(150)} />
              </clipPath>
            )}
          </defs>

          {/* Grid lines */}
          {gridY.map(y => (
            <g key={y}>
              <line x1={PAD.left} y1={yPos(y)} x2={PAD.left + IW} y2={yPos(y)}
                stroke="var(--border)" strokeWidth="1" strokeDasharray={y === 0 ? "none" : "4 4"}/>
              <text x={PAD.left - 8} y={yPos(y)} textAnchor="end" dominantBaseline="middle"
                fontSize="10" fill="var(--text-light)" fontFamily="-apple-system, sans-serif">
                {y}%
              </text>
            </g>
          ))}

          {/* Area fills — fade in */}
          {hasD && diagPts.length > 1 && (
            <polygon style={areaStyle(0)}
              points={[
                ...diagPts.map((p, i) => `${xPos(diagPts, i).toFixed(1)},${yPos(p.pct).toFixed(1)}`),
                `${xPos(diagPts, diagPts.length - 1).toFixed(1)},${yPos(0).toFixed(1)}`,
                `${xPos(diagPts, 0).toFixed(1)},${yPos(0).toFixed(1)}`,
              ].join(" ")}
              fill="url(#psDiagGrad)"
            />
          )}
          {hasP && pracPts.length > 1 && (
            <polygon style={areaStyle(150)}
              points={[
                ...pracPts.map((p, i) => `${xPos(pracPts, i).toFixed(1)},${yPos(p.pct).toFixed(1)}`),
                `${xPos(pracPts, pracPts.length - 1).toFixed(1)},${yPos(0).toFixed(1)}`,
                `${xPos(pracPts, 0).toFixed(1)},${yPos(0).toFixed(1)}`,
              ].join(" ")}
              fill="url(#psPracGrad)"
            />
          )}

          {/* Lines — revealed left→right by clip-path */}
          {hasD && diagPts.length > 1 && (
            <polyline clipPath="url(#diagLineClip)" points={poly(diagPts)}
              fill="none" stroke={DIAG_COL} strokeWidth="2.5"
              strokeLinejoin="round" strokeLinecap="round"/>
          )}
          {hasP && pracPts.length > 1 && (
            <polyline clipPath="url(#pracLineClip)" points={poly(pracPts)}
              fill="none" stroke={PRAC_COL} strokeWidth="2.5"
              strokeLinejoin="round" strokeLinecap="round"/>
          )}

          {/* Dots — fade in after line reveal, no scale transform */}
          {hasD && diagPts.map((pt, i) => {
            const cx = xPos(diagPts, i), cy = yPos(pt.pct);
            return (
              <g key={`d-${i}`}>
                <circle cx={cx} cy={cy} r="5" style={dotStyle(700 + i * 40)}
                  fill={DIAG_COL} stroke="var(--card-bg)" strokeWidth="2.5"/>
                <circle cx={cx} cy={cy} r="14" fill="transparent" style={{ cursor: "crosshair" }}
                  onMouseEnter={() => setTooltip({ x: cx, y: cy, label: pt.label, pct: pt.pct, date: pt.date, type: "Diagnostic", col: scoreColor(pt.pct) })}/>
              </g>
            );
          })}
          {hasP && pracPts.map((pt, i) => {
            const cx = xPos(pracPts, i), cy = yPos(pt.pct);
            return (
              <g key={`p-${i}`}>
                <circle cx={cx} cy={cy} r="5" style={dotStyle(850 + i * 40)}
                  fill={PRAC_COL} stroke="var(--card-bg)" strokeWidth="2.5"/>
                <circle cx={cx} cy={cy} r="14" fill="transparent" style={{ cursor: "crosshair" }}
                  onMouseEnter={() => setTooltip({ x: cx, y: cy, label: pt.label, pct: pt.pct, date: pt.date, type: "Practice", col: scoreColor(pt.pct) })}/>
              </g>
            );
          })}

          {/* Tooltip */}
          {tooltip && (() => {
            const { tx, ty } = clampTip(tooltip.x, tooltip.y);
            return (
              <g>
                <rect x={tx} y={ty} width={TW} height={TH} rx="7"
                  fill="var(--card-bg)" stroke={tooltip.col} strokeWidth="1"
                  style={{ filter: "drop-shadow(0 4px 12px rgba(0,0,0,0.4))" }}/>
                <rect x={tx} y={ty} width={TW} height={2} rx="1" fill={tooltip.col} opacity="0.6"/>
                <text x={tx + TW / 2} y={ty + 18} textAnchor="middle" fontSize="9.5"
                  fill="var(--text-light)" fontFamily="-apple-system, sans-serif">
                  {tooltip.type} · {formatDate(tooltip.date)}
                </text>
                <text x={tx + TW / 2} y={ty + 37} textAnchor="middle" fontSize="13"
                  fontWeight="700" fill={tooltip.col} fontFamily="-apple-system, sans-serif">
                  {tooltip.pct}% — {tooltip.label}
                </text>
              </g>
            );
          })()}
        </svg>
      </div>
    </div>
  );
};

// ── ProgressSection ───────────────────────────────────────────────────────────

const ProgressSection = ({ diagnostics = [], practice = [], onDiagnosticClick }) => {
  const [activeTab, setActiveTab] = useState("overview");

  const totalDiag = diagnostics.length;
  const totalPrac = practice.length;
  const globalAvg = diagnostics.length
    ? Math.round(diagnostics.reduce((s, d) => s + (d.score.correct / d.score.total) * 100, 0) / diagnostics.length)
    : null;

  const gapsClosedThisMonth = useMemo(() => computeGapsClosedThisMonth(diagnostics), [diagnostics]);
  const isEmpty   = totalDiag === 0 && totalPrac === 0;
  const showChart = diagnostics.length + practice.length >= 2;

  const topicStats = topics
    .map((topic) => {
      const ds = diagnostics.filter(d => d.topicId === topic.id);
      const ps = practice.filter(p => p.topicId === topic.id);
      const diagAvg = ds.length ? Math.round(ds.reduce((s, d) => s + (d.score.correct / d.score.total) * 100, 0) / ds.length) : null;
      const pracAvg = ps.length ? Math.round(ps.reduce((s, p) => {
        const c = Number(p.correct) || 0, w = Number(p.wrong) || 0, t = c + w;
        return s + (t > 0 ? (c / t) * 100 : 0);
      }, 0) / ps.length) : null;
      const totalSessions = ds.length + ps.length;
      return { ...topic, diagAvg, pracAvg, totalSessions, diagSessions: ds.length, pracSessions: ps.length };
    })
    .filter(t => t.totalSessions > 0);

  if (isEmpty) {
    return (
      <div className="progress-empty progress-empty--onboarding">
        <div className="progress-empty__head">
          <div className="progress-empty__head-icon">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
              <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
          </div>
          <div>
            <h3 className="progress-empty__title">Start tracking your reasoning</h3>
            <p className="progress-empty__sub">Run a diagnostic to map where your thinking breaks down. Everything you do here gets tracked and shown on this page.</p>
          </div>
        </div>
        <div className="progress-empty__steps">
          <div className="progress-empty__step">
            <div className="progress-empty__step-num">01</div>
            <div className="progress-empty__step-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
              </svg>
            </div>
            <h4 className="progress-empty__step-title">Run a diagnostic</h4>
            <p className="progress-empty__step-desc">20 questions across 5 gap types. Takes about 15 minutes. No grades — just a map of where reasoning breaks.</p>
          </div>
          <div className="progress-empty__step-arrow">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="9 18 15 12 9 6"/></svg>
          </div>
          <div className="progress-empty__step">
            <div className="progress-empty__step-num">02</div>
            <div className="progress-empty__step-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
              </svg>
            </div>
            <h4 className="progress-empty__step-title">Review your gaps</h4>
            <p className="progress-empty__step-desc">See exactly which reasoning patterns broke and why. Not just what you got wrong — where your thinking went off.</p>
          </div>
          <div className="progress-empty__step-arrow">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="9 18 15 12 9 6"/></svg>
          </div>
          <div className="progress-empty__step">
            <div className="progress-empty__step-num">03</div>
            <div className="progress-empty__step-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                <polyline points="9 11 12 14 22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>
              </svg>
            </div>
            <h4 className="progress-empty__step-title">Train and recheck</h4>
            <p className="progress-empty__step-desc">Practice on exactly the gap found. Run the diagnostic again the next day to see if it closed.</p>
          </div>
        </div>
        <div className="progress-empty__actions">
          <Link to="/diagnostics" className="progress-btn progress-btn--primary progress-btn--lg">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
            Start your first diagnostic
          </Link>
          <Link to="/theory" className="progress-btn progress-btn--ghost">Read theory first</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="progress-section-inner">

      {showChart && (
        <div className="progress-chart-section">
          <div className="progress-chart-section__header">
            <div>
              <div className="progress-chart-section__eyebrow">
                <span className="progress-chart-section__eyebrow-dot"/>
                Score History
              </div>
              <h3 className="progress-chart-section__title">Performance Over Time</h3>
              <p className="progress-chart-section__sub">Diagnostic and practice scores over time. Hover a point for details.</p>
            </div>
            <span className="progress-chart-section__tag">
              <span className="progress-chart-section__tag-dot"/>
              Live data
            </span>
          </div>
          <ProgressChart diagnostics={diagnostics} practice={practice}/>
        </div>
      )}

      <div className="progress-stats-row">
        {[
          { label: "Diagnostics", num: totalDiag, sub: "sessions completed",
            icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>,
            color: "var(--teal)" },
          { label: "Practice", num: totalPrac, sub: "sessions",
            icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4z"/></svg>,
            color: "#d35400" },
          { label: "Avg Score", num: globalAvg !== null ? `${globalAvg}%` : "—", sub: "across diagnostics",
            icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>,
            color: globalAvg ? scoreColor(globalAvg) : "var(--teal)" },
          { label: "Gaps Closed", num: gapsClosedThisMonth, sub: "this month",
            icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M6 9H4a2 2 0 0 1-2-2V5h4"/><path d="M18 9h2a2 2 0 0 0 2-2V5h-4"/><path d="M12 17v4"/><path d="M8 21h8"/><path d="M6 9a6 6 0 0 0 12 0V3H6z"/></svg>,
            color: gapsClosedThisMonth > 0 ? "#27ae60" : "var(--text-light)" },
        ].map(({ label, num, sub, icon, color }, idx) => (
          <div key={label} className="progress-stat-card" style={{ animationDelay: `${idx * 0.07}s` }}>
            <div className="progress-stat-card__icon" style={{ color }}>{icon}</div>
            <p className="progress-stat-card__label">{label}</p>
            <strong className="progress-stat-card__num" style={{ color }}>{num}</strong>
            <p className="progress-stat-card__sub">{sub}</p>
          </div>
        ))}
      </div>

      <DisciplineInsights diagnostics={diagnostics} practice={practice} />
      <DailyTodoPanel />

      <div className="progress-tabs">
        {["overview", "diagnostics", "practice"].map(tab => (
          <button key={tab}
            className={`progress-tab ${activeTab === tab ? "progress-tab--active" : ""}`}
            onClick={() => setActiveTab(tab)}>
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
            {tab === "diagnostics" && totalDiag > 0 && <span className="progress-tab__count">{totalDiag}</span>}
            {tab === "practice"    && totalPrac > 0 && <span className="progress-tab__count">{totalPrac}</span>}
          </button>
        ))}
      </div>

      {activeTab === "overview" && (
        <div className="progress-overview">
          {topicStats.length === 0 ? (
            <p className="progress-empty-inline">No topic-specific data yet.</p>
          ) : (
            <div className="progress-topic-grid">
              {topicStats.map(t => (
                <div key={t.id} className="progress-topic-card">
                  <div className="progress-topic-card__head">
                    <span className="progress-topic-card__icon">{t.icon ? <t.icon /> : "?"}</span>
                    <div>
                      <h4 className="progress-topic-card__title">{t.title}</h4>
                      <p className="progress-topic-card__sessions">{t.totalSessions} session{t.totalSessions !== 1 ? "s" : ""}</p>
                    </div>
                    {t.diagAvg !== null && <MiniRing pct={t.diagAvg} color={scoreColor(t.diagAvg)} />}
                  </div>
                  <div className="progress-topic-card__stats">
                    <span>
                      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/></svg>
                      {t.diagSessions} diagnostic{t.diagSessions !== 1 ? "s" : ""}
                    </span>
                    <span>
                      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4z"/></svg>
                      {t.pracSessions} practice{t.pracSessions !== 1 ? "s" : ""}
                    </span>
                  </div>
                  {t.diagAvg !== null && (
                    <div className="progress-topic-card__bar-wrap">
                      <div className="progress-topic-card__bar">
                        <div style={{ width: `${t.diagAvg}%`, background: scoreColor(t.diagAvg) }}/>
                      </div>
                      <span style={{ color: scoreColor(t.diagAvg) }}>{t.diagAvg}%</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === "diagnostics" && (
        <div className="progress-history">
          {diagnostics.length === 0 ? (
            <div className="progress-empty-inline">No diagnostic sessions yet. <Link to="/diagnostics">Run one now →</Link></div>
          ) : (
            <div className="progress-history-list">
              {diagnostics.map((d, i) => {
                const pct = Math.round((d.score.correct / d.score.total) * 100);
                return (
                  <button key={i} type="button"
                    className="progress-history-row progress-history-row--clickable"
                    onClick={() => onDiagnosticClick?.(i)}
                    style={{ animationDelay: `${i * 0.05}s` }}>
                    <MiniRing pct={pct} color={scoreColor(pct)} size={46}/>
                    <div className="progress-history-row__info">
                      <div className="progress-history-row__top">
                        <h4 className="progress-history-row__title">{d.topicTitle}</h4>
                        <span className="progress-history-row__date">{formatDate(d.date)} · {formatTime(d.date)}</span>
                      </div>
                      <div className="progress-history-row__meta">
                        <span>{d.score.correct}/{d.score.total} correct</span>
                        {d.gaps?.length > 0 && (
                          <span className="progress-history-row__gaps">
                            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
                            </svg>
                            {d.gaps.length} gap{d.gaps.length !== 1 ? "s" : ""} found
                          </span>
                        )}
                      </div>
                      {d.gaps?.length > 0 && (
                        <div className="progress-history-row__gap-tags">
                          {d.gaps.map(g => <span key={g.id} className="progress-gap-tag">{g.title}</span>)}
                        </div>
                      )}
                    </div>
                    <span className="progress-history-row__arrow"><ChevronRight/></span>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      )}

      {activeTab === "practice" && (
        <div className="progress-history">
          {practice.length === 0 ? (
            <div className="progress-empty-inline">No practice sessions yet. <Link to="/practice">Start practising →</Link></div>
          ) : (
            <div className="progress-history-list">
              {practice.map((p, i) => {
                const correct = Number(p.correct) || 0, wrong = Number(p.wrong) || 0, total = correct + wrong;
                const pct = total > 0 ? Math.round((correct / total) * 100) : 0;
                const topic = topics.find(t => t.id === p.topicId);
                return (
                  <div key={i} className="progress-history-row" style={{ animationDelay: `${i * 0.05}s` }}>
                    <MiniRing pct={pct} color={scoreColor(pct)} size={46}/>
                    <div className="progress-history-row__info">
                      <div className="progress-history-row__top">
                        <h4 className="progress-history-row__title">
                          {topic?.icon ? <topic.icon /> : "?"}{" "}{topic?.title || p.topicId}
                          <span className="progress-history-row__subtopic">— {p.subtopicKey || "—"}</span>
                        </h4>
                        <span className="progress-history-row__date">{formatDate(p.date)} · {formatTime(p.date)}</span>
                      </div>
                      <p className="progress-history-row__meta">
                        <span>{correct}/{total} correct</span>
                        <span>{wrong} wrong</span>
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

    </div>
  );
};

export default ProgressSection;