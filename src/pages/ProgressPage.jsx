// src/pages/ProgressPage.jsx
import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Header from "../components/layout/Header";
import Sidebar from "../components/layout/Sidebar";
import { topics } from "../data/topics";
import { getPractice, getDiagnostics } from "../services/db";
import "../styles/progress.css";
import "../styles/layout.css";

const ChevronRight = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
    <polyline points="9 18 15 12 9 6" />
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

const MiniRing = ({ pct, color, size = 52 }) => {
  const r = 20;
  const circ = 2 * Math.PI * r;
  const dash = (pct / 100) * circ;
  return (
    <svg width={size} height={size} viewBox="0 0 48 48">
      <circle cx="24" cy="24" r={r} fill="none" stroke="var(--border)" strokeWidth="5" />
      <circle cx="24" cy="24" r={r} fill="none" stroke={color} strokeWidth="5"
        strokeDasharray={`${dash} ${circ}`} strokeLinecap="round" transform="rotate(-90 24 24)" />
      <text x="24" y="24" textAnchor="middle" dominantBaseline="middle" fontSize="9"
        fontWeight="700" fill={color} fontFamily="-apple-system, sans-serif">
        {pct}%
      </text>
    </svg>
  );
};

const scoreColor = (pct) => (pct >= 70 ? "#27ae60" : pct >= 40 ? "#d35400" : "#c0392b");

const CHART_DIAG_COLOR = "#2a8fa0";
const CHART_PRAC_COLOR = "#d35400";

const ProgressChart = ({ diagnostics, practice }) => {
  const svgRef = useRef(null);
  const [tooltip, setTooltip] = useState(null);

  const W = 860;
  const H = 220;
  const PAD = { top: 24, right: 24, bottom: 16, left: 44 };
  const INNER_W = W - PAD.left - PAD.right;
  const INNER_H = H - PAD.top - PAD.bottom;

  const diagPoints = [...diagnostics]
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .map((d) => ({
      date: d.date,
      pct: Math.round((d.score.correct / d.score.total) * 100),
      label: d.topicTitle,
    }));

  const pracPoints = [...practice]
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .map((p) => {
      const correct = Number(p.correct) || 0;
      const wrong = Number(p.wrong) || 0;
      const total = correct + wrong;
      return {
        date: p.date,
        pct: total > 0 ? Math.round((correct / total) * 100) : 0,
        label: topics.find((t) => t.id === p.topicId)?.title || p.topicId,
      };
    });

  if (diagPoints.length + pracPoints.length < 1) return null;

  const xForSeries = (pts, i) => {
    if (pts.length === 1) return PAD.left + INNER_W / 2;
    return PAD.left + (i / (pts.length - 1)) * INNER_W;
  };

  const toY = (pct) => PAD.top + INNER_H - (pct / 100) * INNER_H;

  const polylineStr = (pts) =>
    pts.map((p, i) => `${xForSeries(pts, i).toFixed(1)},${toY(p.pct).toFixed(1)}`).join(" ");

  const gridY = [0, 25, 50, 75, 100];
  const hasDisag = diagPoints.length > 0;
  const hasPrac = pracPoints.length > 0;

  return (
    <div className="progress-chart-wrap">
      <div className="progress-chart-legend">
        {hasDisag && (
          <span className="progress-chart-legend__item">
            <span className="progress-chart-legend__dot" style={{ background: CHART_DIAG_COLOR }} />
            Diagnostics
          </span>
        )}
        {hasPrac && (
          <span className="progress-chart-legend__item">
            <span className="progress-chart-legend__dot" style={{ background: CHART_PRAC_COLOR }} />
            Practice
          </span>
        )}
      </div>
      <div className="progress-chart-svg-wrap">
        <svg ref={svgRef} viewBox={`0 0 ${W} ${H}`} className="progress-chart-svg" onMouseLeave={() => setTooltip(null)}>
          {gridY.map((y) => (
            <g key={y}>
              <line x1={PAD.left} y1={toY(y)} x2={PAD.left + INNER_W} y2={toY(y)}
                stroke="var(--border)" strokeWidth="1" strokeDasharray={y === 0 ? "none" : "4 4"} />
              <text x={PAD.left - 8} y={toY(y)} textAnchor="end" dominantBaseline="middle"
                fontSize="10" fill="var(--text-light)" fontFamily="-apple-system, sans-serif">
                {y}%
              </text>
            </g>
          ))}

          {hasDisag && diagPoints.length > 1 && (
            <polyline points={polylineStr(diagPoints)} fill="none" stroke={CHART_DIAG_COLOR}
              strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" />
          )}
          {hasPrac && pracPoints.length > 1 && (
            <polyline points={polylineStr(pracPoints)} fill="none" stroke={CHART_PRAC_COLOR}
              strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" />
          )}

          {hasDisag && diagPoints.map((pt, i) => {
            const cx = xForSeries(diagPoints, i);
            const cy = toY(pt.pct);
            return (
              <g key={i}>
                <circle cx={cx} cy={cy} r="5" fill={CHART_DIAG_COLOR} stroke="var(--card-bg)" strokeWidth="2" />
                <circle cx={cx} cy={cy} r="12" fill="transparent"
                  onMouseEnter={() => setTooltip({ x: cx, y: cy, label: pt.label, pct: pt.pct, date: pt.date, type: "Diagnostic", col: scoreColor(pt.pct) })} />
              </g>
            );
          })}

          {hasPrac && pracPoints.map((pt, i) => {
            const cx = xForSeries(pracPoints, i);
            const cy = toY(pt.pct);
            return (
              <g key={i}>
                <circle cx={cx} cy={cy} r="5" fill={CHART_PRAC_COLOR} stroke="var(--card-bg)" strokeWidth="2" />
                <circle cx={cx} cy={cy} r="12" fill="transparent"
                  onMouseEnter={() => setTooltip({ x: cx, y: cy, label: pt.label, pct: pt.pct, date: pt.date, type: "Practice", col: scoreColor(pt.pct) })} />
              </g>
            );
          })}

          {tooltip && (() => {
            const TW = 168, TH = 52;
            const tx = Math.min(Math.max(tooltip.x - TW / 2, PAD.left), PAD.left + INNER_W - TW);
            const ty = Math.max(PAD.top, tooltip.y - TH - 12);
            return (
              <g>
                <rect x={tx} y={ty} width={TW} height={TH} rx="6" fill="var(--card-bg)" stroke="var(--border)" strokeWidth="1" />
                <text x={tx + TW / 2} y={ty + 16} textAnchor="middle" fontSize="10" fill="var(--text-light)" fontFamily="-apple-system, sans-serif">
                  {tooltip.type} · {formatDate(tooltip.date)}
                </text>
                <text x={tx + TW / 2} y={ty + 34} textAnchor="middle" fontSize="13" fontWeight="700" fill={tooltip.col} fontFamily="-apple-system, sans-serif">
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

const ProgressPage = () => {
  const { user } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [diagnostics, setDiagnostics] = useState([]);
  const [practice, setPractice] = useState([]);
  const [activeTab, setActiveTab] = useState("overview");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    // Load both in parallel
    Promise.all([
      getDiagnostics(user.uid),
      getPractice(user.uid),
    ]).then(([diags, pracs]) => {
      setDiagnostics(diags);
      setPractice(pracs);
      setLoading(false);
    });
  }, [user]);

  const firstName = user?.displayName?.split(" ")[0] ?? "there";

  const topicStats = topics
    .map((topic) => {
      const diagSessions = diagnostics.filter((d) => d.topicId === topic.id);
      const pracSessions = practice.filter((p) => p.topicId === topic.id);

      const diagAvg = diagSessions.length
        ? Math.round(diagSessions.reduce((s, d) => s + (d.score.correct / d.score.total) * 100, 0) / diagSessions.length)
        : null;

      const pracAvg = pracSessions.length
        ? Math.round(pracSessions.reduce((s, p) => {
            const correct = Number(p.correct) || 0;
            const wrong = Number(p.wrong) || 0;
            const total = correct + wrong;
            return s + (total > 0 ? (correct / total) * 100 : 0);
          }, 0) / pracSessions.length)
        : null;

      const totalSessions = diagSessions.length + pracSessions.length;
      return { ...topic, diagAvg, pracAvg, totalSessions, diagSessions: diagSessions.length, pracSessions: pracSessions.length };
    })
    .filter((t) => t.totalSessions > 0);

  const totalDiag = diagnostics.length;
  const totalPrac = practice.length;
  const globalAvg = diagnostics.length
    ? Math.round(diagnostics.reduce((s, d) => s + (d.score.correct / d.score.total) * 100, 0) / diagnostics.length)
    : null;
  const totalGaps = diagnostics.reduce((s, d) => s + (d.gaps?.length || 0), 0);
  const isEmpty = totalDiag === 0 && totalPrac === 0;
  const showChart = diagnostics.length + practice.length >= 2;

  if (loading) {
    return (
      <div className="page-shell">
        <Header sidebarOpen={sidebarOpen} onToggleSidebar={() => setSidebarOpen((v) => !v)} />
        <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <main className="page-main">
          <div className="progress-page">
            <div className="progress-empty">
              <p style={{ color: "var(--text-light)", fontFamily: "-apple-system, sans-serif" }}>Loading your progress...</p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="page-shell">
      <Header sidebarOpen={sidebarOpen} onToggleSidebar={() => setSidebarOpen((v) => !v)} />
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <main className="page-main">
        <div className="progress-page">
          <div className="progress-breadcrumb">
            <Link to="/home" className="progress-breadcrumb__item">Home</Link>
            <ChevronRight />
            <span className="progress-breadcrumb__item progress-breadcrumb__item--active">Progress</span>
          </div>

          <div className="progress-header">
            <div>
              <h1 className="progress-header__title">My Progress</h1>
              <p className="progress-header__sub">Track your diagnostic sessions and practice history, {firstName}.</p>
            </div>
            <Link to="/diagnostics" className="progress-header__cta">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              Run Diagnostic
            </Link>
          </div>

          {isEmpty ? (
            <div className="progress-empty">
              <div className="progress-empty__icon">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3">
                  <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
                </svg>
              </div>
              <h3>No activity yet</h3>
              <p>Complete a diagnostic or practice session to start tracking your progress.</p>
              <div className="progress-empty__actions">
                <Link to="/diagnostics" className="progress-btn progress-btn--primary">Start Diagnostic</Link>
                <Link to="/practice" className="progress-btn progress-btn--ghost">Go to Practice</Link>
              </div>
            </div>
          ) : (
            <>
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
                  <strong className="progress-stat-card__num" style={{ color: globalAvg ? scoreColor(globalAvg) : undefined }}>
                    {globalAvg !== null ? `${globalAvg}%` : "—"}
                  </strong>
                  <p className="progress-stat-card__sub">across all diagnostics</p>
                </div>
                <div className="progress-stat-card">
                  <p className="progress-stat-card__label">Gaps Identified</p>
                  <strong className="progress-stat-card__num" style={{ color: totalGaps > 0 ? "#d35400" : undefined }}>
                    {totalGaps}
                  </strong>
                  <p className="progress-stat-card__sub">reasoning gaps found</p>
                </div>
              </div>

              {showChart && (
                <div className="progress-chart-section">
                  <h3 className="progress-chart-section__title">Score History</h3>
                  <p className="progress-chart-section__sub">Your diagnostic and practice scores over time. Hover a point for details.</p>
                  <ProgressChart diagnostics={diagnostics} practice={practice} />
                </div>
              )}

              <div className="progress-tabs">
                {["overview", "diagnostics", "practice"].map((tab) => (
                  <button
                    key={tab}
                    className={`progress-tab ${activeTab === tab ? "progress-tab--active" : ""}`}
                    onClick={() => setActiveTab(tab)}
                  >
                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                  </button>
                ))}
              </div>

              {activeTab === "overview" && (
                <div className="progress-overview">
                  {topicStats.length === 0 ? (
                    <p className="progress-empty-inline">No topic-specific data yet.</p>
                  ) : (
                    <div className="progress-topic-grid">
                      {topicStats.map((t) => (
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
                              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <circle cx="11" cy="11" r="8" />
                              </svg>
                              {t.diagSessions} diagnostic{t.diagSessions !== 1 ? "s" : ""}
                            </span>
                            <span>
                              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M12 20h9" /><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4z" />
                              </svg>
                              {t.pracSessions} practice{t.pracSessions !== 1 ? "s" : ""}
                            </span>
                          </div>
                          {t.diagAvg !== null && (
                            <div className="progress-topic-card__bar-wrap">
                              <div className="progress-topic-card__bar">
                                <div style={{ width: `${t.diagAvg}%`, background: scoreColor(t.diagAvg) }} />
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
                          <div key={i} className="progress-history-row">
                            <MiniRing pct={pct} color={scoreColor(pct)} size={48} />
                            <div className="progress-history-row__info">
                              <div className="progress-history-row__top">
                                <h4 className="progress-history-row__title">{d.topicTitle}</h4>
                                <span className="progress-history-row__date">{formatDate(d.date)} · {formatTime(d.date)}</span>
                              </div>
                              <div className="progress-history-row__meta">
                                <span>{d.score.correct}/{d.score.total} correct</span>
                                {d.gaps?.length > 0 && (
                                  <span className="progress-history-row__gaps">
                                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                      <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
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
                          </div>
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
                        const correct = Number(p.correct) || 0;
                        const wrong = Number(p.wrong) || 0;
                        const total = correct + wrong;
                        const pct = total > 0 ? Math.round((correct / total) * 100) : 0;
                        const topic = topics.find((t) => t.id === p.topicId);
                        return (
                          <div key={i} className="progress-history-row">
                            <MiniRing pct={pct} color={scoreColor(pct)} size={48} />
                            <div className="progress-history-row__info">
                              <div className="progress-history-row__top">
                                <h4 className="progress-history-row__title">
                                  {topic?.icon ? <topic.icon /> : "?"}{" "}
                                  {topic?.title || p.topicId}
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
            </>
          )}
        </div>
      </main>
    </div>
  );
};

export default ProgressPage;