// src/components/sections/ProgressSection.jsx
// Content from ProgressPage — no Header / Sidebar / layout shell.
// Props:
//   diagnostics       {Array}    from getDiagnostics()
//   practice          {Array}    from getPractice()
//   onDiagnosticClick {Function} (idx: number) → switches parent to Results tab
import { useState, useRef } from "react";
import { Link } from "react-router-dom";
import { topics } from "../../data/topics";

// ── Helpers ───────────────────────────────────────────────────────────────────

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

// ── Mini ring ─────────────────────────────────────────────────────────────────

const MiniRing = ({ pct, color, size = 48 }) => {
  const r    = 20;
  const circ = 2 * Math.PI * r;
  const dash = (pct / 100) * circ;
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" style={{ flexShrink: 0 }}>
      <circle cx="24" cy="24" r={r} fill="none"
        stroke="rgba(255,255,255,0.07)" strokeWidth="5"/>
      <circle cx="24" cy="24" r={r} fill="none" stroke={color} strokeWidth="5"
        strokeDasharray={`${dash} ${circ}`} strokeLinecap="round"
        transform="rotate(-90 24 24)"/>
      <text x="24" y="24" textAnchor="middle" dominantBaseline="middle"
        fontSize="8.5" fontWeight="700" fill={color}
        fontFamily="'Courier New', monospace">
        {pct}%
      </text>
    </svg>
  );
};

// ── Chart ─────────────────────────────────────────────────────────────────────

const DIAG_COL = "#2a8fa0";
const PRAC_COL = "#d35400";

const ProgressChart = ({ diagnostics, practice }) => {
  const svgRef = useRef(null);
  const [tooltip, setTooltip] = useState(null);

  const W = 860, H = 220;
  const PAD = { top: 24, right: 24, bottom: 16, left: 44 };
  const IW  = W - PAD.left - PAD.right;
  const IH  = H - PAD.top  - PAD.bottom;

  const diagPts = [...diagnostics]
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .map((d) => ({
      date: d.date,
      pct:  Math.round((d.score.correct / d.score.total) * 100),
      label: d.topicTitle,
    }));

  const pracPts = [...practice]
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .map((p) => {
      const c = Number(p.correct) || 0;
      const w = Number(p.wrong)   || 0;
      const t = c + w;
      return {
        date:  p.date,
        pct:   t > 0 ? Math.round((c / t) * 100) : 0,
        label: topics.find((t2) => t2.id === p.topicId)?.title || p.topicId,
      };
    });

  if (diagPts.length + pracPts.length < 1) return null;

  const xPos  = (pts, i) =>
    pts.length === 1
      ? PAD.left + IW / 2
      : PAD.left + (i / (pts.length - 1)) * IW;
  const yPos  = (pct) => PAD.top + IH - (pct / 100) * IH;
  const poly  = (pts) =>
    pts.map((p, i) => `${xPos(pts, i).toFixed(1)},${yPos(p.pct).toFixed(1)}`).join(" ");

  const gridY      = [0, 25, 50, 75, 100];
  const hasD       = diagPts.length > 0;
  const hasP       = pracPts.length > 0;

  return (
    <div className="progress-chart-wrap">
      <div className="progress-chart-legend">
        {hasD && (
          <span className="progress-chart-legend__item">
            <span className="progress-chart-legend__dot" style={{ background: DIAG_COL }}/>
            Diagnostics
          </span>
        )}
        {hasP && (
          <span className="progress-chart-legend__item">
            <span className="progress-chart-legend__dot" style={{ background: PRAC_COL }}/>
            Practice
          </span>
        )}
      </div>

      <div className="progress-chart-svg-wrap">
        <svg ref={svgRef} viewBox={`0 0 ${W} ${H}`} className="progress-chart-svg"
          onMouseLeave={() => setTooltip(null)}>

          {/* Grid */}
          {gridY.map((y) => (
            <g key={y}>
              <line x1={PAD.left} y1={yPos(y)} x2={PAD.left + IW} y2={yPos(y)}
                stroke="rgba(255,255,255,0.05)" strokeWidth="1"
                strokeDasharray={y === 0 ? "none" : "4 4"}/>
              <text x={PAD.left - 8} y={yPos(y)} textAnchor="end" dominantBaseline="middle"
                fontSize="9.5" fill="rgba(255,255,255,0.22)"
                fontFamily="'Courier New', monospace">
                {y}%
              </text>
            </g>
          ))}

          {/* Lines */}
          {hasD && diagPts.length > 1 && (
            <polyline points={poly(diagPts)} fill="none" stroke={DIAG_COL}
              strokeWidth="2" strokeLinejoin="round" strokeLinecap="round"
              opacity="0.8"/>
          )}
          {hasP && pracPts.length > 1 && (
            <polyline points={poly(pracPts)} fill="none" stroke={PRAC_COL}
              strokeWidth="2" strokeLinejoin="round" strokeLinecap="round"
              opacity="0.8"/>
          )}

          {/* Dots — diagnostics */}
          {hasD && diagPts.map((pt, i) => {
            const cx = xPos(diagPts, i);
            const cy = yPos(pt.pct);
            return (
              <g key={i}>
                <circle cx={cx} cy={cy} r="4.5" fill={DIAG_COL}
                  stroke="var(--card-bg,#0f1520)" strokeWidth="2"/>
                <circle cx={cx} cy={cy} r="12" fill="transparent"
                  onMouseEnter={() => setTooltip({
                    x: cx, y: cy, label: pt.label, pct: pt.pct,
                    date: pt.date, type: "Diagnostic", col: scoreColor(pt.pct),
                  })}/>
              </g>
            );
          })}

          {/* Dots — practice */}
          {hasP && pracPts.map((pt, i) => {
            const cx = xPos(pracPts, i);
            const cy = yPos(pt.pct);
            return (
              <g key={i}>
                <circle cx={cx} cy={cy} r="4.5" fill={PRAC_COL}
                  stroke="var(--card-bg,#0f1520)" strokeWidth="2"/>
                <circle cx={cx} cy={cy} r="12" fill="transparent"
                  onMouseEnter={() => setTooltip({
                    x: cx, y: cy, label: pt.label, pct: pt.pct,
                    date: pt.date, type: "Practice", col: scoreColor(pt.pct),
                  })}/>
              </g>
            );
          })}

          {/* Tooltip */}
          {tooltip && (() => {
            const TW = 172, TH = 52;
            const tx = Math.min(Math.max(tooltip.x - TW / 2, PAD.left), PAD.left + IW - TW);
            const ty = Math.max(PAD.top, tooltip.y - TH - 14);
            return (
              <g>
                <rect x={tx} y={ty} width={TW} height={TH} rx="6"
                  fill="#0f1520" stroke="rgba(255,255,255,0.07)" strokeWidth="1"/>
                <text x={tx + TW / 2} y={ty + 16} textAnchor="middle" fontSize="9.5"
                  fill="rgba(255,255,255,0.35)" fontFamily="'Courier New', monospace">
                  {tooltip.type} · {formatDate(tooltip.date)}
                </text>
                <text x={tx + TW / 2} y={ty + 35} textAnchor="middle" fontSize="12"
                  fontWeight="700" fill={tooltip.col}
                  fontFamily="'Courier New', monospace">
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
    ? Math.round(
        diagnostics.reduce((s, d) => s + (d.score.correct / d.score.total) * 100, 0) /
        diagnostics.length
      )
    : null;
  const totalGaps = diagnostics.reduce((s, d) => s + (d.gaps?.length || 0), 0);
  const isEmpty   = totalDiag === 0 && totalPrac === 0;
  const showChart = diagnostics.length + practice.length >= 2;

  const topicStats = topics
    .map((topic) => {
      const ds = diagnostics.filter((d) => d.topicId === topic.id);
      const ps = practice.filter((p) => p.topicId === topic.id);
      const diagAvg = ds.length
        ? Math.round(ds.reduce((s, d) => s + (d.score.correct / d.score.total) * 100, 0) / ds.length)
        : null;
      const pracAvg = ps.length
        ? Math.round(ps.reduce((s, p) => {
            const c = Number(p.correct) || 0;
            const w = Number(p.wrong)   || 0;
            const t = c + w;
            return s + (t > 0 ? (c / t) * 100 : 0);
          }, 0) / ps.length)
        : null;
      const totalSessions = ds.length + ps.length;
      return { ...topic, diagAvg, pracAvg, totalSessions,
        diagSessions: ds.length, pracSessions: ps.length };
    })
    .filter((t) => t.totalSessions > 0);

  if (isEmpty) {
    return (
      <div className="progress-empty">
        <div className="progress-empty__icon">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="1.3">
            <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
          </svg>
        </div>
        <h3>No activity yet</h3>
        <p>Complete a diagnostic or practice session to start tracking your progress.</p>
        <div className="progress-empty__actions">
          <Link to="/diagnostics" className="progress-btn progress-btn--primary">
            Start Diagnostic
          </Link>
          <Link to="/practice" className="progress-btn progress-btn--ghost">
            Go to Practice
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="progress-section-inner">

      {/* Stats row */}
      <div className="progress-stats-row">
        <div className="progress-stat-card">
          <p className="progress-stat-card__label">Diagnostic Sessions</p>
          <strong className="progress-stat-card__num">{totalDiag}</strong>
          <p className="progress-stat-card__sub">sessions completed</p>
        </div>
        <div className="progress-stat-card">
          <p className="progress-stat-card__label">Practice Sessions</p>
          <strong className="progress-stat-card__num">{totalPrac}</strong>
          <p className="progress-stat-card__sub">exercises attempted</p>
        </div>
        <div className="progress-stat-card">
          <p className="progress-stat-card__label">Average Score</p>
          <strong className="progress-stat-card__num"
            style={{ color: globalAvg != null ? scoreColor(globalAvg) : undefined }}>
            {globalAvg != null ? `${globalAvg}%` : "—"}
          </strong>
          <p className="progress-stat-card__sub">across all diagnostics</p>
        </div>
        <div className="progress-stat-card">
          <p className="progress-stat-card__label">Gaps Identified</p>
          <strong className="progress-stat-card__num"
            style={{ color: totalGaps > 0 ? "#d35400" : undefined }}>
            {totalGaps}
          </strong>
          <p className="progress-stat-card__sub">reasoning gaps found</p>
        </div>
      </div>

      {/* Chart */}
      {showChart && (
        <div className="progress-chart-section">
          <h3 className="progress-chart-section__title">Score History</h3>
          <p className="progress-chart-section__sub">
            Diagnostic and practice scores over time. Hover a point for details.
          </p>
          <ProgressChart diagnostics={diagnostics} practice={practice} />
        </div>
      )}

      {/* Sub-tabs */}
      <div className="progress-tabs">
        {["overview", "diagnostics", "practice"].map((tab) => (
          <button key={tab}
            className={`progress-tab ${activeTab === tab ? "progress-tab--active" : ""}`}
            onClick={() => setActiveTab(tab)}>
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* Overview */}
      {activeTab === "overview" && (
        <div className="progress-overview">
          {topicStats.length === 0 ? (
            <p className="progress-empty-inline">No topic-specific data yet.</p>
          ) : (
            <div className="progress-topic-grid">
              {topicStats.map((t) => (
                <div key={t.id} className="progress-topic-card">
                  <div className="progress-topic-card__head">
                    <span className="progress-topic-card__icon">
                      {t.icon ? <t.icon /> : "?"}
                    </span>
                    <div>
                      <h4 className="progress-topic-card__title">{t.title}</h4>
                      <p className="progress-topic-card__sessions">
                        {t.totalSessions} session{t.totalSessions !== 1 ? "s" : ""}
                      </p>
                    </div>
                    {t.diagAvg !== null && (
                      <MiniRing pct={t.diagAvg} color={scoreColor(t.diagAvg)} />
                    )}
                  </div>
                  <div className="progress-topic-card__stats">
                    <span>
                      <svg width="11" height="11" viewBox="0 0 24 24" fill="none"
                        stroke="currentColor" strokeWidth="2">
                        <circle cx="11" cy="11" r="8"/>
                      </svg>
                      {t.diagSessions} diagnostic{t.diagSessions !== 1 ? "s" : ""}
                    </span>
                    <span>
                      <svg width="11" height="11" viewBox="0 0 24 24" fill="none"
                        stroke="currentColor" strokeWidth="2">
                        <path d="M12 20h9"/>
                        <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4z"/>
                      </svg>
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

      {/* Diagnostics */}
      {activeTab === "diagnostics" && (
        <div className="progress-history">
          {diagnostics.length === 0 ? (
            <div className="progress-empty-inline">
              No diagnostic sessions yet.{" "}
              <Link to="/diagnostics">Run one now →</Link>
            </div>
          ) : (
            <div className="progress-history-list">
              {diagnostics.map((d, i) => {
                const pct = Math.round((d.score.correct / d.score.total) * 100);
                return (
                  <button key={i} type="button"
                    className="progress-history-row progress-history-row--clickable"
                    onClick={() => onDiagnosticClick?.(i)}>
                    <MiniRing pct={pct} color={scoreColor(pct)} size={46} />
                    <div className="progress-history-row__info">
                      <div className="progress-history-row__top">
                        <h4 className="progress-history-row__title">{d.topicTitle}</h4>
                        <span className="progress-history-row__date">
                          {formatDate(d.date)} · {formatTime(d.date)}
                        </span>
                      </div>
                      <div className="progress-history-row__meta">
                        <span>{d.score.correct}/{d.score.total} correct</span>
                        {d.gaps?.length > 0 && (
                          <span className="progress-history-row__gaps">
                            <svg width="10" height="10" viewBox="0 0 24 24" fill="none"
                              stroke="currentColor" strokeWidth="2">
                              <circle cx="12" cy="12" r="10"/>
                              <line x1="12" y1="8"  x2="12" y2="12"/>
                              <line x1="12" y1="16" x2="12.01" y2="16"/>
                            </svg>
                            {d.gaps.length} gap{d.gaps.length !== 1 ? "s" : ""}
                          </span>
                        )}
                      </div>
                      {d.gaps?.length > 0 && (
                        <div className="progress-history-row__gap-tags">
                          {d.gaps.map((g) => (
                            <span key={g.id} className="progress-gap-tag">{g.title}</span>
                          ))}
                        </div>
                      )}
                    </div>
                    <span className="progress-history-row__arrow"><ChevronRight /></span>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Practice */}
      {activeTab === "practice" && (
        <div className="progress-history">
          {practice.length === 0 ? (
            <div className="progress-empty-inline">
              No practice sessions yet.{" "}
              <Link to="/practice">Start practising →</Link>
            </div>
          ) : (
            <div className="progress-history-list">
              {practice.map((p, i) => {
                const correct = Number(p.correct) || 0;
                const wrong   = Number(p.wrong)   || 0;
                const total   = correct + wrong;
                const pct     = total > 0 ? Math.round((correct / total) * 100) : 0;
                const topic   = topics.find((t) => t.id === p.topicId);
                return (
                  <div key={i} className="progress-history-row">
                    <MiniRing pct={pct} color={scoreColor(pct)} size={46} />
                    <div className="progress-history-row__info">
                      <div className="progress-history-row__top">
                        <h4 className="progress-history-row__title">
                          {topic?.icon ? <topic.icon /> : "?"}{" "}
                          {topic?.title || p.topicId}
                          <span className="progress-history-row__subtopic">
                            — {p.subtopicKey || "—"}
                          </span>
                        </h4>
                        <span className="progress-history-row__date">
                          {formatDate(p.date)} · {formatTime(p.date)}
                        </span>
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