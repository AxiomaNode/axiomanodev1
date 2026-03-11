// src/components/sections/ProgressSections.jsx
// Content from ProgressPage — no Header / Sidebar / layout shell.
// Props:
//   diagnostics       {Array}    from getDiagnostics()
//   practice          {Array}    from getPractice()
//   onDiagnosticClick {Function} (idx: number) → switches parent to Results tab
import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { topics } from "../../data/topics";
import DailyTodoPanel from "../DailyTodoPanel";

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
        stroke="var(--border)" strokeWidth="5"/>
      <circle cx="24" cy="24" r={r} fill="none" stroke={color} strokeWidth="5"
        strokeDasharray={`${dash} ${circ}`} strokeLinecap="round"
        transform="rotate(-90 24 24)"/>
      <text x="24" y="24" textAnchor="middle" dominantBaseline="middle"
        fontSize="8.5" fontWeight="700" fill={color}
        fontFamily="-apple-system, sans-serif">
        {pct}%
      </text>
    </svg>
  );
};

// ── Animated Chart ────────────────────────────────────────────────────────────

const DIAG_COL = "#2a8fa0";
const PRAC_COL = "#d35400";

const ProgressChart = ({ diagnostics, practice }) => {
  const svgRef = useRef(null);
  const [tooltip, setTooltip] = useState(null);
  const [drawn, setDrawn] = useState(false);

  useEffect(() => {
    const raf = requestAnimationFrame(() => {
      requestAnimationFrame(() => setDrawn(true));
    });
    return () => cancelAnimationFrame(raf);
  }, []);

  const W = 860, H = 220;
  const PAD = { top: 24, right: 24, bottom: 16, left: 44 };
  const IW  = W - PAD.left - PAD.right;
  const IH  = H - PAD.top  - PAD.bottom;

  const diagPts = [...diagnostics]
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .map((d) => ({
      date:  d.date,
      pct:   Math.round((d.score.correct / d.score.total) * 100),
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
    pts.length === 1 ? PAD.left + IW / 2 : PAD.left + (i / (pts.length - 1)) * IW;
  const yPos  = (pct) => PAD.top + IH - (pct / 100) * IH;
  const poly  = (pts) =>
    pts.map((p, i) => `${xPos(pts, i).toFixed(1)},${yPos(p.pct).toFixed(1)}`).join(" ");

  const gridY  = [0, 25, 50, 75, 100];
  const hasD   = diagPts.length > 0;
  const hasP   = pracPts.length > 0;

  const TW = 180, TH = 54;
  const clampTip = (cx, cy) => {
    const tx = Math.min(Math.max(cx - TW / 2, PAD.left), PAD.left + IW - TW);
    const aboveY = cy - TH - 12;
    const ty = aboveY < PAD.top ? cy + 14 : aboveY;
    return { tx, ty };
  };

  const lineStyle = (delay = 0) => ({
    strokeDasharray: 2000,
    strokeDashoffset: drawn ? 0 : 2000,
    transition: drawn
      ? `stroke-dashoffset 1.4s cubic-bezier(0.4,0,0.2,1) ${delay}ms`
      : "none",
  });

  const areaStyle = (delay = 0) => ({
    opacity: drawn ? 1 : 0,
    transition: drawn ? `opacity 0.6s ease ${delay + 900}ms` : "none",
  });

  const dotStyle = (delay = 0) => ({
    opacity: drawn ? 1 : 0,
    transform: drawn ? "scale(1)" : "scale(0)",
    transformOrigin: "center",
    transition: drawn
      ? `opacity 0.25s ease ${delay}ms, transform 0.25s cubic-bezier(0.34,1.56,0.64,1) ${delay}ms`
      : "none",
  });

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

          <defs>
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
          </defs>

          {/* Grid */}
          {gridY.map((y) => (
            <g key={y}>
              <line x1={PAD.left} y1={yPos(y)} x2={PAD.left + IW} y2={yPos(y)}
                stroke="var(--border)" strokeWidth="1"
                strokeDasharray={y === 0 ? "none" : "4 4"}/>
              <text x={PAD.left - 8} y={yPos(y)} textAnchor="end" dominantBaseline="middle"
                fontSize="10" fill="var(--text-light)"
                fontFamily="-apple-system, sans-serif">
                {y}%
              </text>
            </g>
          ))}

          {/* Area fills */}
          {hasD && diagPts.length > 1 && (
            <polygon
              style={areaStyle(0)}
              points={[
                ...diagPts.map((p, i) => `${xPos(diagPts, i).toFixed(1)},${yPos(p.pct).toFixed(1)}`),
                `${xPos(diagPts, diagPts.length - 1).toFixed(1)},${yPos(0).toFixed(1)}`,
                `${xPos(diagPts, 0).toFixed(1)},${yPos(0).toFixed(1)}`,
              ].join(" ")}
              fill="url(#psDiagGrad)"
            />
          )}
          {hasP && pracPts.length > 1 && (
            <polygon
              style={areaStyle(200)}
              points={[
                ...pracPts.map((p, i) => `${xPos(pracPts, i).toFixed(1)},${yPos(p.pct).toFixed(1)}`),
                `${xPos(pracPts, pracPts.length - 1).toFixed(1)},${yPos(0).toFixed(1)}`,
                `${xPos(pracPts, 0).toFixed(1)},${yPos(0).toFixed(1)}`,
              ].join(" ")}
              fill="url(#psPracGrad)"
            />
          )}

          {/* Lines */}
          {hasD && diagPts.length > 1 && (
            <polyline style={lineStyle(0)} points={poly(diagPts)}
              fill="none" stroke={DIAG_COL} strokeWidth="2.5"
              strokeLinejoin="round" strokeLinecap="round"/>
          )}
          {hasP && pracPts.length > 1 && (
            <polyline style={lineStyle(200)} points={poly(pracPts)}
              fill="none" stroke={PRAC_COL} strokeWidth="2.5"
              strokeLinejoin="round" strokeLinecap="round"/>
          )}

          {/* Diagnostic dots */}
          {hasD && diagPts.map((pt, i) => {
            const cx = xPos(diagPts, i);
            const cy = yPos(pt.pct);
            const delay = 800 + i * 60;
            return (
              <g key={`d-${i}`}>
                <circle cx={cx} cy={cy} r="5" style={dotStyle(delay)}
                  fill={DIAG_COL} stroke="var(--card-bg)" strokeWidth="2.5"/>
                <circle cx={cx} cy={cy} r="14" fill="transparent"
                  style={{ cursor: "crosshair" }}
                  onMouseEnter={() => setTooltip({
                    x: cx, y: cy, label: pt.label, pct: pt.pct,
                    date: pt.date, type: "Diagnostic", col: scoreColor(pt.pct),
                  })}/>
              </g>
            );
          })}

          {/* Practice dots */}
          {hasP && pracPts.map((pt, i) => {
            const cx = xPos(pracPts, i);
            const cy = yPos(pt.pct);
            const delay = 1000 + i * 60;
            return (
              <g key={`p-${i}`}>
                <circle cx={cx} cy={cy} r="5" style={dotStyle(delay)}
                  fill={PRAC_COL} stroke="var(--card-bg)" strokeWidth="2.5"/>
                <circle cx={cx} cy={cy} r="14" fill="transparent"
                  style={{ cursor: "crosshair" }}
                  onMouseEnter={() => setTooltip({
                    x: cx, y: cy, label: pt.label, pct: pt.pct,
                    date: pt.date, type: "Practice", col: scoreColor(pt.pct),
                  })}/>
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
                {/* Colour accent on top edge */}
                <rect x={tx} y={ty} width={TW} height={2} rx="1"
                  fill={tooltip.col} opacity="0.6"/>
                <text x={tx + TW / 2} y={ty + 18} textAnchor="middle" fontSize="9.5"
                  fill="var(--text-light)" fontFamily="-apple-system, sans-serif">
                  {tooltip.type} · {formatDate(tooltip.date)}
                </text>
                <text x={tx + TW / 2} y={ty + 37} textAnchor="middle" fontSize="13"
                  fontWeight="700" fill={tooltip.col}
                  fontFamily="-apple-system, sans-serif">
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

      {/* Today's plan */}
      <DailyTodoPanel />

      {/* Stats row */}
      <div className="progress-stats-row">
        {[
          {
            label: "Diagnostic Sessions",
            num:   totalDiag,
            sub:   "sessions completed",
            icon: (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="1.8">
                <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
              </svg>
            ),
            color: "var(--teal)",
          },
          {
            label: "Practice Sessions",
            num:   totalPrac,
            sub:   "exercises attempted",
            icon: (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="1.8">
                <path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4z"/>
              </svg>
            ),
            color: "#d35400",
          },
          {
            label: "Average Score",
            num:   globalAvg !== null ? `${globalAvg}%` : "—",
            sub:   "across all diagnostics",
            icon: (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="1.8">
                <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
              </svg>
            ),
            color: globalAvg ? scoreColor(globalAvg) : "var(--teal)",
          },
          {
            label: "Gaps Identified",
            num:   totalGaps,
            sub:   "reasoning gaps found",
            icon: (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="1.8">
                <circle cx="12" cy="12" r="10"/>
                <line x1="12" y1="8"  x2="12"    y2="12"/>
                <line x1="12" y1="16" x2="12.01" y2="16"/>
              </svg>
            ),
            color: totalGaps > 0 ? "#d35400" : "var(--teal)",
          },
        ].map(({ label, num, sub, icon, color }, idx) => (
          <div key={label} className="progress-stat-card"
            style={{ animationDelay: `${idx * 0.07}s` }}>
            <div className="progress-stat-card__icon" style={{ color }}>{icon}</div>
            <p className="progress-stat-card__label">{label}</p>
            <strong className="progress-stat-card__num" style={{ color }}>{num}</strong>
            <p className="progress-stat-card__sub">{sub}</p>
          </div>
        ))}
      </div>

      {/* Chart */}
      {showChart && (
        <div className="progress-chart-section">
          <div className="progress-chart-section__header">
            <div>
              <div className="progress-chart-section__eyebrow">
                <span className="progress-chart-section__eyebrow-dot"/>
                Score History
              </div>
              <h3 className="progress-chart-section__title">Performance Over Time</h3>
              <p className="progress-chart-section__sub">
                Diagnostic and practice scores over time. Hover a point for details.
              </p>
            </div>
            <span className="progress-chart-section__tag">
              <span className="progress-chart-section__tag-dot"/>
              Live data
            </span>
          </div>
          <ProgressChart diagnostics={diagnostics} practice={practice}/>
        </div>
      )}

      {/* Sub-tabs */}
      <div className="progress-tabs">
        {["overview", "diagnostics", "practice"].map((tab) => (
          <button key={tab}
            className={`progress-tab ${activeTab === tab ? "progress-tab--active" : ""}`}
            onClick={() => setActiveTab(tab)}>
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
            {tab === "diagnostics" && totalDiag > 0 && (
              <span className="progress-tab__count">{totalDiag}</span>
            )}
            {tab === "practice" && totalPrac > 0 && (
              <span className="progress-tab__count">{totalPrac}</span>
            )}
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
                    onClick={() => onDiagnosticClick?.(i)}
                    style={{ animationDelay: `${i * 0.05}s` }}>
                    <MiniRing pct={pct} color={scoreColor(pct)} size={46}/>
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
                              <line x1="12" y1="8"  x2="12"    y2="12"/>
                              <line x1="12" y1="16" x2="12.01" y2="16"/>
                            </svg>
                            {d.gaps.length} gap{d.gaps.length !== 1 ? "s" : ""} found
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
                    <span className="progress-history-row__arrow"><ChevronRight/></span>
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
                  <div key={i} className="progress-history-row"
                    style={{ animationDelay: `${i * 0.05}s` }}>
                    <MiniRing pct={pct} color={scoreColor(pct)} size={46}/>
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