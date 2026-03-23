  // src/components/sections/ResultsSection.jsx
  // Content from ResultsPage — no Header / Sidebar / layout shell.
  // Props:
  //   sessions   {Array}  already-loaded diagnostics array from parent
  //   initialIdx {number} session to open first (default 0)
  import { useState } from "react";
  import { Link } from "react-router-dom";
  import { topics } from "../../data/topics";


  // ── Icons ─────────────────────────────────────────────────────────────────────

  const ChevronRight = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="2.5" strokeLinecap="round">
      <polyline points="9 18 15 12 9 6"/>
    </svg>
  );

  const CheckIcon = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="2.5" strokeLinecap="round">
      <polyline points="20 6 9 17 4 12"/>
    </svg>
  );

  const XIcon = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="2.5" strokeLinecap="round">
      <line x1="18" y1="6"  x2="6"  y2="18"/>
      <line x1="6"  y1="6"  x2="18" y2="18"/>
    </svg>
  );

  // ── Helpers ───────────────────────────────────────────────────────────────────

  const scoreColor = (pct) => (pct >= 70 ? "#27ae60" : pct >= 40 ? "#d35400" : "#c0392b");

  const formatDate = (iso) =>
    new Date(iso).toLocaleDateString("en-GB", {
      weekday: "short", day: "numeric", month: "long", year: "numeric",
    });

  const TopicIcon = ({ topic, size = 16 }) => {
    const Icon = topic?.icon;
    if (typeof Icon === "function") return <Icon size={size} strokeWidth={2.5}/>;
    if (typeof Icon === "string")   return <span>{Icon}</span>;
  };

  // ── Score ring ────────────────────────────────────────────────────────────────

  const ScoreRing = ({ pct, color }) => {
    const circ = 2 * Math.PI * 52;
    const dash = (pct / 100) * circ;
    return (
      <svg viewBox="0 0 130 130" className="results-ring-svg">
        <circle cx="65" cy="65" r="52" fill="none"
          stroke="rgba(255,255,255,0.06)" strokeWidth="9"/>
        <circle cx="65" cy="65" r="52" fill="none" stroke={color} strokeWidth="9"
          strokeDasharray={`${dash} ${circ}`} strokeLinecap="round"
          transform="rotate(-90 65 65)"/>
      </svg>
    );
  };

  // ── Answer Breakdown ──────────────────────────────────────────────────────────

  const AnswerBreakdown = ({ session }) => {
    const allQMap = {};
    (session.questions || []).forEach((q) => { allQMap[q.id] = q; });
    const entries      = Object.entries(session.answers || {});
    const wrongEntries = entries.filter(([qId, userAns]) => {
      const q = allQMap[qId];
      return q && userAns !== q.correct;
    });
    const correctCount = entries.length - wrongEntries.length;

    if (wrongEntries.length === 0) {
      return (
        <div className="results-no-gaps">
          <CheckIcon/>
          <p>All answers were correct — perfect score.</p>
        </div>
      );
    }

    return (
      <div className="results-breakdown">
        <div className="results-breakdown__header">
          <div className="results-breakdown__header-left">
            <XIcon/>
            <span className="results-breakdown__title">Answer Breakdown</span>
          </div>
          <span className="results-breakdown__count">
            {wrongEntries.length} wrong · {correctCount} correct
          </span>
        </div>

        <div className="results-breakdown__list">
          {wrongEntries.map(([qId, userAns]) => {
            const q = allQMap[qId];
            if (!q) return null;
            const isSkipped = !userAns;
            const topicMeta = topics.find((t) => t.id === q?.topicId);
            return (
              <div key={qId} className="results-breakdown__item">
                <div className="results-breakdown__item-header">
                  <span className="results-breakdown__item-id">// {qId}</span>
                  {topicMeta && (
                    <span className="results-breakdown__item-topic">
                      <TopicIcon topic={topicMeta} size={11}/>
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

  // ── ResultsSection ────────────────────────────────────────────────────────────

  const ResultsSection = ({ sessions = [], initialIdx = 0 }) => {
    const clampedInitial = Math.min(initialIdx, Math.max(sessions.length - 1, 0));
    const [selectedIdx,   setSelectedIdx]   = useState(clampedInitial);
    const [prevInitialIdx, setPrevInitialIdx] = useState(initialIdx);

    // Sync when parent changes initialIdx (e.g. click from ProgressSection)
    if (initialIdx !== prevInitialIdx) {
      setPrevInitialIdx(initialIdx);
      setSelectedIdx(Math.min(initialIdx, Math.max(sessions.length - 1, 0)));
    }


  if (sessions.length === 0) {
    return (
      <div className="profile-empty-state">

        <div className="profile-empty-state__head">
          <div className="profile-empty-state__head-icon profile-empty-state__head-icon--teal">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
              <rect x="3" y="3" width="18" height="18" rx="2"/>
              <line x1="8" y1="8"  x2="16" y2="8"/>
              <line x1="8" y1="12" x2="16" y2="12"/>
              <line x1="8" y1="16" x2="12" y2="16"/>
            </svg>
          </div>
          <div>
            <h3 className="profile-empty-state__title">No diagnostic results yet</h3>
            <p className="profile-empty-state__sub">
              After running a diagnostic you'll see a full breakdown here — score,
              identified gaps, and every question with your answer vs the correct one.
            </p>
          </div>
        </div>

        <div className="profile-empty-state__cards">
          <div className="profile-empty-state__card">
            <div className="profile-empty-state__card-icon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
              </svg>
            </div>
            <h4>Score over time</h4>
            <p>Track how your accuracy changes across sessions and see if your gaps are closing.</p>
          </div>
          <div className="profile-empty-state__card">
            <div className="profile-empty-state__card-icon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                <circle cx="12" cy="12" r="10"/>
                <line x1="12" y1="8"  x2="12"    y2="12"/>
                <line x1="12" y1="16" x2="12.01" y2="16"/>
              </svg>
            </div>
            <h4>Gap breakdown</h4>
            <p>See which reasoning gaps were detected and exactly which questions triggered them.</p>
          </div>
          <div className="profile-empty-state__card">
            <div className="profile-empty-state__card-icon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                <rect x="3" y="3" width="18" height="18" rx="2"/>
                <line x1="8" y1="12" x2="16" y2="12"/>
                <line x1="8" y1="8"  x2="16" y2="8"/>
              </svg>
            </div>
            <h4>Answer review</h4>
            <p>Every wrong answer shown with what you chose and what was correct — no guessing.</p>
          </div>
        </div>

        <div className="profile-empty-state__actions">
          <Link to="/diagnostics" className="profile-empty-state__btn profile-empty-state__btn--primary">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <circle cx="11" cy="11" r="8"/>
              <line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
            Run your first diagnostic
          </Link>
        </div>

      </div>
    );
  }
    const session = sessions[selectedIdx] || null;
    const pct     = session ? Math.round((session.score.correct / session.score.total) * 100) : 0;
    const color   = scoreColor(pct);
    const topic   = session ? topics.find((t) => t.id === session.topicId) : null;

    return (
      <div className="results-section-inner">
        <div className="results-layout">

          {/* Sidebar — session list */}
          <aside className="results-sidebar">
            <p className="results-sidebar__label">Session History</p>
            <div className="results-sidebar__list">
              {sessions.map((s, i) => {
                const p = Math.round((s.score.correct / s.score.total) * 100);
                const t = topics.find((tt) => tt.id === s.topicId);
                return (
                  <button key={i}
                    className={`results-session-btn ${i === selectedIdx ? "results-session-btn--active" : ""}`}
                    onClick={() => setSelectedIdx(i)}>
                    <span className="results-session-btn__icon">
                      <TopicIcon topic={t} size={15}/>
                    </span>
                    <div className="results-session-btn__info">
                      <span className="results-session-btn__title">{s.topicTitle}</span>
                      <span className="results-session-btn__date">
                        {new Date(s.date).toLocaleDateString("en-GB", {
                          day: "numeric", month: "short",
                        })}
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
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2.5">
                <line x1="12" y1="5"  x2="12" y2="19"/>
                <line x1="5"  y1="12" x2="19" y2="12"/>
              </svg>
              New Diagnostic
            </Link>
          </aside>

          {/* Main — session detail */}
          {session && (
            <div className="results-main">

              {/* Score card */}
              <div className="results-overview-card">
                <div className="results-overview-ring">
                  <ScoreRing pct={pct} color={color}/>
                  <div className="results-ring-center">
                    <strong style={{ color }}>{pct}%</strong>
                    <span>{session.score.correct}/{session.score.total}</span>
                  </div>
                </div>

                <div className="results-overview-info">
                  <p className="results-overview-date">{formatDate(session.date)}</p>
                  <h2 className="results-overview-title">
                    {topic?.icon ? <topic.icon size={18} strokeWidth={2.5}/> : ""}
                    {session.topicTitle}
                  </h2>
                  <p className="results-overview-verdict" style={{ color }}>
                    {pct >= 70
                      ? "Strong performance"
                      : pct >= 40
                      ? "Partial understanding"
                      : "Significant gaps identified"}
                  </p>

                  <div className="results-overview-stats">
                    <div className="results-overview-stat">
                      <strong style={{ color: "#27ae60" }}>{session.score.correct}</strong>
                      <span>Correct</span>
                    </div>
                    <div className="results-overview-stat">
                      <strong style={{ color: "#c0392b" }}>
                        {session.score.total - session.score.correct}
                      </strong>
                      <span>Wrong</span>
                    </div>
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
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
                      stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="10"/>
                      <line x1="12" y1="8"  x2="12" y2="12"/>
                      <line x1="12" y1="16" x2="12.01" y2="16"/>
                    </svg>
                    Reasoning gaps identified
                  </h3>
                  <div className="results-gaps-list">
                    {session.gaps.map((gap) => {
                      const ev0    = gap.evidence?.[0];
                      const desc   = gap.userFacingLabel ?? gap.description ?? "";
                      const recTxt = ev0?.recommendationText ?? gap.recommendationText;
                      return (
                        <div key={gap.coreGapId || gap.id} className="results-gap-card">
                          <div className="results-gap-card__head">
                            <div className="results-gap-card__label-row">
                              <span className="results-gap-card__tag">Gap</span>
                              <h4 className="results-gap-card__title">{gap.title}</h4>
                            </div>
                          </div>
                          <p className="results-gap-card__desc">{desc}</p>
                          {recTxt && (
                            <div className="results-gap-card__rec">
                              <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
                                stroke="currentColor" strokeWidth="2">
                                <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
                              </svg>
                              <p>{recTxt}</p>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {session.gaps?.length === 0 && (
                <div className="results-no-gaps">
                  <CheckIcon/>
                  <p>No reasoning gaps detected. Consider a harder topic.</p>
                </div>
              )}

              {/* Answer breakdown */}
              <div className="results-section">
                <h3 className="results-section__title">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="3" width="18" height="18" rx="2"/>
                    <line x1="8" y1="12" x2="16" y2="12"/>
                    <line x1="8" y1="8"  x2="16" y2="8"/>
                  </svg>
                  Answer breakdown
                </h3>
                <AnswerBreakdown session={session}/>
              </div>

              {/* Actions */}
              <div className="results-actions">
                <Link to="/diagnostics" className="results-btn results-btn--primary">
                  Retry topic <ChevronRight/>
                </Link>
                <Link to="/practice" className="results-btn results-btn--ghost">
                  Go to Practice
                </Link>
              </div>

            </div>
          )}
        </div>
      </div>
    );
  };

  export default ResultsSection;