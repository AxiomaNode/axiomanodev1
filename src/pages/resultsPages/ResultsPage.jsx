// src/pages/ResultsPage.jsx
import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import Header from "../../components/layout/Header";
import Sidebar from "../../components/layout/Sidebar";
import { topics } from "../../data/topics";
import { questions as questionsDb } from "../../data/questions";
import { getDiagnostics } from "../../services/db";
import "./results.css";
import '../../styles/layout.css'
import { getRecommendations } from "../../core/recommendationEngine";

const ChevronRight = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
    <polyline points="9 18 15 12 9 6" />
  </svg>
);

const CheckIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

const XIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

const scoreColor = (pct) => (pct >= 70 ? "#27ae60" : pct >= 40 ? "#d35400" : "#c0392b");

const formatDate = (iso) =>
  new Date(iso).toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "long", year: "numeric" });

const TopicIcon = ({ topic, size = 16 }) => {
  const Icon = topic?.icon;
  if (typeof Icon === "function") return <Icon size={size} strokeWidth={2.5} />;
  if (typeof Icon === "string") return <span>{Icon}</span>;
  return <span>◆</span>;
};

const ScoreRing = ({ pct, color }) => {
  const circ = 2 * Math.PI * 52;
  const dash = (pct / 100) * circ;
  return (
    <svg viewBox="0 0 130 130" className="results-ring-svg">
      <defs>
        <filter id="ring-glow">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>
      <circle cx="65" cy="65" r="52" fill="none" stroke="var(--border)" strokeWidth="9" />
      <circle
        cx="65" cy="65" r="52" fill="none" stroke={color} strokeWidth="9"
        strokeDasharray={`${dash} ${circ}`} strokeLinecap="round"
        transform="rotate(-90 65 65)" opacity="0.25" filter="url(#ring-glow)"
      />
      <circle
        cx="65" cy="65" r="52" fill="none" stroke={color} strokeWidth="9"
        strokeDasharray={`${dash} ${circ}`} strokeLinecap="round" transform="rotate(-90 65 65)"
      />
    </svg>
  );
};

const AnswerBreakdown = ({ session }) => {
  const allQMap = {};
  Object.values(questionsDb).flat().forEach((q) => { allQMap[q.id] = q; });

  const entries = Object.entries(session.answers || {});
  const wrongEntries = entries.filter(([qId, userAns]) => {
    const q = allQMap[qId];
    return q && userAns !== q.correct;
  });
  const correctCount = entries.length - wrongEntries.length;

  if (wrongEntries.length === 0) {
    return (
      <div className="results-no-gaps">
        <CheckIcon />
        <p>All answers were correct — perfect score.</p>
      </div>
    );
  }

  return (
    <div className="results-breakdown">
      <div className="results-breakdown__header">
        <div className="results-breakdown__header-left">
          <XIcon />
          <span className="results-breakdown__title">Answer Breakdown</span>
        </div>
        <span className="results-breakdown__count">
          {wrongEntries.length} wrong · {correctCount} correct
        </span>
      </div>
      <div className="results-breakdown__list">
        {wrongEntries.map(([qId, userAns], idx) => {
          const q = allQMap[qId];
          if (!q) return null;
          const isSkipped = !userAns;
          const topicMeta = topics.find((t) =>
            questionsDb[t.id]?.some((qq) => qq.id === qId)
          );
          return (
            <div key={qId} className="results-breakdown__item">
              <div className="results-breakdown__item-header">
                <span className="results-breakdown__item-num">#{idx + 1}</span>
                <span className="results-breakdown__item-id">// {qId}</span>
                {topicMeta && (
                  <span className="results-breakdown__item-topic">
                    <TopicIcon topic={topicMeta} size={11} />
                    {topicMeta.title}
                  </span>
                )}
              </div>
              <p className="results-breakdown__item-question">{q.text}</p>
              <div className="results-breakdown__item-answers">
                <div className="results-breakdown__answer results-breakdown__answer--wrong">
                  <span className="results-breakdown__answer-label">Your answer</span>
                  <span className="results-breakdown__answer-value">
                    {isSkipped ? "— skipped" : userAns}
                  </span>
                </div>
                <div className="results-breakdown__answer results-breakdown__answer--correct">
                  <span className="results-breakdown__answer-label">Correct answer</span>
                  <span className="results-breakdown__answer-value">{q.correct}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const ResultsPage = () => {
  const { user } = useAuth();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sessions, setSessions] = useState([]);
  const [selectedIdx, setSelectedIdx] = useState(location.state?.selectedIdx ?? 0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    getDiagnostics(user.uid).then((data) => {
      setSessions(data ?? []);
      setLoading(false);
    });
  }, [user]);

  const session = sessions[selectedIdx] || null;
  const pct = session ? Math.round((session.score.correct / session.score.total) * 100) : 0;
  const color = scoreColor(pct);
  const topic = session ? topics.find((t) => t.id === session.topicId) : null;

  return (
    <div className="page-shell">
      <Header sidebarOpen={sidebarOpen} onToggleSidebar={() => setSidebarOpen((v) => !v)} />
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <main className="page-main">
        <div className="results-page">

          {/* Breadcrumb */}
          <div className="results-breadcrumb">
            <Link to="/home" className="results-breadcrumb__item">Home</Link>
            <ChevronRight />
            <Link to="/progress" className="results-breadcrumb__item">Progress</Link>
            <ChevronRight />
            <span className="results-breadcrumb__item results-breadcrumb__item--active">Results</span>
          </div>

          {/* Header */}
          <div className="results-header">
            <div className="results-header__icon">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <rect x="3" y="3" width="18" height="18" rx="2" />
                <line x1="8" y1="12" x2="16" y2="12" />
                <line x1="8" y1="8" x2="16" y2="8" />
                <line x1="8" y1="16" x2="12" y2="16" />
              </svg>
            </div>
            <div>
              <div className="results-header__eyebrow">
                <span className="results-header__eyebrow-dot" />
                Diagnostic Report
              </div>
              <h1 className="results-header__title">Diagnostic Results</h1>
              <p className="results-header__sub">Full breakdown of your reasoning performance.</p>
            </div>
          </div>

          {loading ? (
            <div className="results-empty">
              <p style={{ color: "var(--text-light)", fontFamily: "-apple-system, sans-serif" }}>Loading results...</p>
            </div>
          ) : sessions.length === 0 ? (
            <div className="results-empty">
              <div className="results-empty__icon">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3">
                  <rect x="3" y="3" width="18" height="18" rx="2" />
                  <line x1="8" y1="12" x2="16" y2="12" />
                  <line x1="8" y1="8" x2="16" y2="8" />
                  <line x1="8" y1="16" x2="12" y2="16" />
                </svg>
              </div>
              <h3>No diagnostic results yet</h3>
              <p>Run a diagnostic to see your full reasoning breakdown here.</p>
              <Link to="/diagnostics" className="results-btn results-btn--primary">
                Start Diagnostic <ChevronRight />
              </Link>
            </div>
          ) : (
            <div className="results-layout">

              {/* Sidebar */}
              <aside className="results-sidebar">
                <p className="results-sidebar__label">Session History</p>
                <div className="results-sidebar__list">
                  {sessions.map((s, i) => {
                    const p = Math.round((s.score.correct / s.score.total) * 100);
                    const t = topics.find((tt) => tt.id === s.topicId);
                    return (
                      <button
                        key={i}
                        className={`results-session-btn ${i === selectedIdx ? "results-session-btn--active" : ""}`}
                        onClick={() => setSelectedIdx(i)}
                      >
                        <span className="results-session-btn__icon">
                          <TopicIcon topic={t} size={14} />
                        </span>
                        <div className="results-session-btn__info">
                          <span className="results-session-btn__title">{s.topicTitle}</span>
                          <span className="results-session-btn__date">
                            {new Date(s.date).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                          </span>
                        </div>
                        <span className="results-session-btn__pct" style={{ color: scoreColor(p) }}>
                          {p}%
                        </span>
                      </button>
                    );
                  })}
                </div>
                <Link to="/diagnostics" className="results-sidebar__new-btn">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <line x1="12" y1="5" x2="12" y2="19" />
                    <line x1="5" y1="12" x2="19" y2="12" />
                  </svg>
                  New Diagnostic
                </Link>
              </aside>

              {session && (
                <div className="results-main">

                  {/* Overview card */}
                  <div className="results-overview-card">
                    <div className="results-overview-ring">
                      <ScoreRing pct={pct} color={color} />
                      <div className="results-ring-center">
                        <strong style={{ color }}>{pct}%</strong>
                        <span>{session.score.correct}/{session.score.total}</span>
                      </div>
                    </div>

                    <div className="results-overview-info">
                      <p className="results-overview-date">{formatDate(session.date)}</p>
                      <h2 className="results-overview-title">
                        {topic?.icon ? <topic.icon size={18} strokeWidth={2.5} /> : ""}
                        {session.topicTitle}
                      </h2>
                      <p className="results-overview-verdict" style={{ color }}>
                        {pct >= 70 ? "Strong performance" : pct >= 40 ? "Partial understanding" : "Significant gaps identified"}
                      </p>

                      <div className="results-overview-stats">
                        <div className="results-overview-stat">
                          <strong style={{ color: "#27ae60" }}>{session.score.correct}</strong>
                          <span>Correct</span>
                        </div>
                        <div className="results-overview-stat__div" />
                        <div className="results-overview-stat">
                          <strong style={{ color: "#c0392b" }}>{session.score.total - session.score.correct}</strong>
                          <span>Wrong</span>
                        </div>
                        <div className="results-overview-stat__div" />
                        <div className="results-overview-stat">
                          <strong style={{ color: "#d35400" }}>{session.gaps?.length ?? 0}</strong>
                          <span>Gaps</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Gaps */}
                  {session.gaps?.length > 0 && (
                    <div className="results-section">
                      <h3 className="results-section__title">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <circle cx="12" cy="12" r="10" />
                          <line x1="12" y1="8" x2="12" y2="12" />
                          <line x1="12" y1="16" x2="12.01" y2="16" />
                        </svg>
                        Reasoning gaps identified
                        <span className="results-section__count">{session.gaps.length}</span>
                      </h3>
                      <div className="results-gaps-list">
                        {session.gaps.map((gap, gIdx) => (
                          <div key={gap.id} className="results-gap-card" style={{ animationDelay: `${gIdx * 0.07}s` }}>
                            <div className="results-gap-card__head">
                              <div className="results-gap-card__label-row">
                                <span className="results-gap-card__tag">Gap</span>
                                <h4 className="results-gap-card__title">{gap.title}</h4>
                              </div>
                            </div>
                            <p className="results-gap-card__desc">{gap.description}</p>
                            <div className="results-gap-card__rec">
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
                              </svg>
                              <p>{gap.recommendation}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {session.gaps?.length === 0 && (
                    <div className="results-no-gaps">
                      <CheckIcon />
                      <p>No reasoning gaps detected in this session. Consider a harder topic.</p>
                    </div>
                  )}

                  {/* Answer breakdown */}
                  <div className="results-section">
                    <h3 className="results-section__title">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="3" y="3" width="18" height="18" rx="2" />
                        <line x1="8" y1="12" x2="16" y2="12" />
                        <line x1="8" y1="8" x2="16" y2="8" />
                      </svg>
                      Answer breakdown
                    </h3>
                    <AnswerBreakdown session={session} />
                  </div>

                  {/* ── Actions ── */}
                  {(() => {
                    const { hasGaps, nextActions } = getRecommendations(session.gaps);
                    return (
                      <div className="results-actions">
                        {hasGaps ? (
                          <>
                            <Link
                              to="/theory"
                              state={{ topicId: session.topicId }}
                              className="results-btn results-btn--primary"
                            >
                              Review Theory <ChevronRight />
                            </Link>
                            <Link to="/practice" className="results-btn results-btn--ghost">
                              Go to Practice
                            </Link>
                          </>
                        ) : (
                          <Link
                            to="/homework"
                            state={{ topicId: session.topicId }}
                            className="results-btn results-btn--primary"
                          >
                            Go to Homework <ChevronRight />
                          </Link>
                        )}
                        <Link to="/diagnostics" className="results-btn results-btn--ghost">
                          Retry Diagnostic
                        </Link>
                      </div>
                    );
                  })()}

                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default ResultsPage;