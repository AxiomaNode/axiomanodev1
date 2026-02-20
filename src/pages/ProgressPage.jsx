import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Header from "../components/layout/Header";
import Sidebar from "../components/layout/Sidebar";
import { topics } from "../data/topics";
import "../styles/progress.css";
import "../styles/layout.css";

const ChevronRight = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
    <polyline points="9 18 15 12 9 6" />
  </svg>
);

const formatDate = (iso) => {
  if (!iso) return "—";
  const d = new Date(iso);
  return d.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
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
      <circle
        cx="24"
        cy="24"
        r={r}
        fill="none"
        stroke={color}
        strokeWidth="5"
        strokeDasharray={`${dash} ${circ}`}
        strokeLinecap="round"
        transform="rotate(-90 24 24)"
      />
      <text
        x="24"
        y="24"
        textAnchor="middle"
        dominantBaseline="middle"
        fontSize="9"
        fontWeight="700"
        fill={color}
        fontFamily="-apple-system, sans-serif"
      >
        {pct}%
      </text>
    </svg>
  );
};

const scoreColor = (pct) => (pct >= 70 ? "#27ae60" : pct >= 40 ? "#d35400" : "#c0392b");

const ProgressPage = () => {
  const { user } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [diagnostics, setDiagnostics] = useState([]);
  const [practice, setPractice] = useState([]);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    setDiagnostics(JSON.parse(localStorage.getItem("axioma-diagnostics") || "[]"));
    setPractice(JSON.parse(localStorage.getItem("axioma-practice") || "[]"));
  }, []);

  const firstName = user?.displayName?.split(" ")[0] ?? "there";

  const topicStats = topics
    .map((topic) => {
      const diagSessions = diagnostics.filter((d) => d.topicId === topic.id);
      const pracSessions = practice.filter((p) => p.topicId === topic.id);

      const diagAvg = diagSessions.length
        ? Math.round(
            diagSessions.reduce((s, d) => s + (d.score.correct / d.score.total) * 100, 0) / diagSessions.length
          )
        : null;

      const pracAvg = pracSessions.length
        ? Math.round(
            pracSessions.reduce((s, p) => {
              const correct = Number(p.correct) || 0;
              const wrong = Number(p.wrong) || 0;
              const total = correct + wrong;
              return s + (total > 0 ? (correct / total) * 100 : 0);
            }, 0) / pracSessions.length
          )
        : null;

      const totalSessions = diagSessions.length + pracSessions.length;

      return {
        ...topic,
        diagAvg,
        pracAvg,
        totalSessions,
        diagSessions: diagSessions.length,
        pracSessions: pracSessions.length,
      };
    })
    .filter((t) => t.totalSessions > 0);

  const totalDiag = diagnostics.length;
  const totalPrac = practice.length;
  const globalAvg = diagnostics.length
    ? Math.round(
        diagnostics.reduce((s, d) => s + (d.score.correct / d.score.total) * 100, 0) / diagnostics.length
      )
    : null;
  const totalGaps = diagnostics.reduce((s, d) => s + (d.gaps?.length || 0), 0);

  const isEmpty = totalDiag === 0 && totalPrac === 0;

  return (
    <div className="page-shell">
      <Header sidebarOpen={sidebarOpen} onToggleSidebar={() => setSidebarOpen((v) => !v)} />
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <main className="page-main">
        <div className="progress-page">
          <div className="progress-breadcrumb">
            <Link to="/home" className="progress-breadcrumb__item">
              Home
            </Link>
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
                <Link to="/diagnostics" className="progress-btn progress-btn--primary">
                  Start Diagnostic
                </Link>
                <Link to="/practice" className="progress-btn progress-btn--ghost">
                  Go to Practice
                </Link>
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
                  <strong
                    className="progress-stat-card__num"
                    style={{ color: globalAvg ? scoreColor(globalAvg) : undefined }}
                  >
                    {globalAvg !== null ? `${globalAvg}%` : "—"}
                  </strong>
                  <p className="progress-stat-card__sub">across all diagnostics</p>
                </div>
                <div className="progress-stat-card">
                  <p className="progress-stat-card__label">Gaps Identified</p>
                  <strong
                    className="progress-stat-card__num"
                    style={{ color: totalGaps > 0 ? "#d35400" : undefined }}
                  >
                    {totalGaps}
                  </strong>
                  <p className="progress-stat-card__sub">reasoning gaps found</p>
                </div>
              </div>

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
                              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <circle cx="11" cy="11" r="8" />
                              </svg>
                              {t.diagSessions} diagnostic{t.diagSessions !== 1 ? "s" : ""}
                            </span>
                            <span>
                              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M12 20h9" />
                                <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4z" />
                              </svg>
                              {t.pracSessions} practice{t.pracSessions !== 1 ? "s" : ""}
                            </span>
                          </div>
                          {t.diagAvg !== null && (
                            <div className="progress-topic-card__bar-wrap">
                              <div className="progress-topic-card__bar">
                                <div
                                  style={{ width: `${t.diagAvg}%`, background: scoreColor(t.diagAvg) }}
                                />
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
                    <div className="progress-empty-inline">
                      No diagnostic sessions yet. <Link to="/diagnostics">Run one now →</Link>
                    </div>
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
                                <span className="progress-history-row__date">
                                  {formatDate(d.date)} · {formatTime(d.date)}
                                </span>
                              </div>
                              <div className="progress-history-row__meta">
                                <span>
                                  {d.score.correct}/{d.score.total} correct
                                </span>
                                {d.gaps?.length > 0 && (
                                  <span className="progress-history-row__gaps">
                                    <svg
                                      width="11"
                                      height="11"
                                      viewBox="0 0 24 24"
                                      fill="none"
                                      stroke="currentColor"
                                      strokeWidth="2"
                                    >
                                      <circle cx="12" cy="12" r="10" />
                                      <line x1="12" y1="8" x2="12" y2="12" />
                                      <line x1="12" y1="16" x2="12.01" y2="16" />
                                    </svg>
                                    {d.gaps.length} gap{d.gaps.length !== 1 ? "s" : ""} found
                                  </span>
                                )}
                              </div>
                              {d.gaps?.length > 0 && (
                                <div className="progress-history-row__gap-tags">
                                  {d.gaps.map((g) => (
                                    <span key={g.id} className="progress-gap-tag">
                                      {g.title}
                                    </span>
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
                    <div className="progress-empty-inline">
                      No practice sessions yet. <Link to="/practice">Start practising →</Link>
                    </div>
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
                                <span className="progress-history-row__date">
                                  {formatDate(p.date)} · {formatTime(p.date)}
                                </span>
                              </div>
                              <p className="progress-history-row__meta">
                                <span>
                                  {correct}/{total} correct
                                </span>
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