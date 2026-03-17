// src/components/sections/GapsSection.jsx
// Props:
//   diagnostics    {Array}   from getDiagnostics() — already fetched in ProfilePage
//   topicProgress  {Array}   from getTopicProgress() — completed theme cards

import { useMemo, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { topics } from "../../data/topics";
import { coreGaps } from "../../data/coreGaps";

/* ── Helpers ─────────────────────────────────────────────────────────────── */

const STRENGTH_ORDER = { critical: 0, strong: 1, moderate: 2 };

const STRENGTH_COLOR = {
  critical: "#e05c5c",
  strong:   "#d35400",
  moderate: "#f0a500",
};

const MASTERY_TITLE = (score) => {
  if (score >= 95) return "Expert";
  if (score >= 85) return "Advanced";
  return "Learner";
};

const MASTERY_COLOR = {
  Expert:   "#9b59b6",
  Advanced: "#d35400",
  Learner:  "#2a8fa0",
};

/** Returns gaps from the most recent session that has any. */
const deriveActiveGaps = (diagnostics) => {
  const sorted = [...diagnostics].sort((a, b) => new Date(b.date) - new Date(a.date));
  for (const session of sorted) {
    if (session.gaps?.length > 0) return session.gaps;
  }
  return [];
};

/** Returns the single most critical gap — severity 1 first, then strength order. */
const derivePrimaryGap = (gaps) =>
  [...gaps].sort((a, b) => {
    const sd = (a.severity ?? 9) - (b.severity ?? 9);
    if (sd !== 0) return sd;
    return (STRENGTH_ORDER[a.strength] ?? 9) - (STRENGTH_ORDER[b.strength] ?? 9);
  })[0] ?? null;

/** Tallies gap occurrences across all sessions and returns the most frequent. */
const deriveMostCommonGap = (diagnostics) => {
  const tally = {};
  diagnostics.forEach((s) => {
    s.gaps?.forEach((g) => {
      if (!tally[g.id]) tally[g.id] = { gap: g, count: 0 };
      tally[g.id].count++;
    });
  });
  const entries = Object.values(tally);
  if (!entries.length) return null;
  return entries.sort((a, b) => b.count - a.count)[0];
};

const groupByTopic = (gaps) =>
  gaps.reduce((acc, gap) => {
    const key = gap.topicId || "unknown";
    if (!acc[key]) acc[key] = [];
    acc[key].push(gap);
    return acc;
  }, {});

/* ── Small shared pieces ─────────────────────────────────────────────────── */

const ChevronRight = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
    <polyline points="9 18 15 12 9 6" />
  </svg>
);

const AlertIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="8" x2="12" y2="12" />
    <line x1="12" y1="16" x2="12.01" y2="16" />
  </svg>
);

const CheckIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

const StrengthBadge = ({ strength }) => {
  if (!strength) return null;
  return (
    <span
      className="gaps-strength-badge"
      style={{
        color:       STRENGTH_COLOR[strength],
        background:  STRENGTH_COLOR[strength] + "14",
        borderColor: STRENGTH_COLOR[strength] + "30",
      }}
    >
      {strength}
    </span>
  );
};

const CoreGapTag = ({ coreGapId }) => {
  const cg = coreGaps.find((g) => g.id === coreGapId);
  if (!cg) return null;
  return <span className="gaps-core-tag">{cg.userFacingLabel}</span>;
};

/* ── Primary Gap Block ───────────────────────────────────────────────────── */

const PrimaryGapBlock = ({ gap }) => {
  const topic = topics.find((t) => t.id === gap.topicId);

  return (
    <div className="gaps-primary">
      <div className="gaps-primary__accent" />
      <div className="gaps-primary__header">
        <div className="gaps-primary__eyebrow">
          <span className="gaps-primary__eyebrow-dot" />
          Currently working on
        </div>
        <StrengthBadge strength={gap.strength} />
      </div>

      <h3 className="gaps-primary__title">{gap.title}</h3>
      <p className="gaps-primary__desc">{gap.description}</p>

      <CoreGapTag coreGapId={gap.coreGapId} />

      <div className="gaps-primary__signal">
        <svg width="11" height="11" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" strokeWidth="2">
          <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
        </svg>
        {gap.wrongCount} / {gap.signalCount} signal questions missed
        {topic && (
          <span className="gaps-primary__topic">
            {topic.icon && <topic.icon size={10} strokeWidth={2.5} />}
            {topic.title}
          </span>
        )}
      </div>

      <div className="gaps-primary__rec">
        <p>{gap.recommendationText}</p>
      </div>

      <Link
        to="/theory"
        state={{ topicId: gap.topicId }}
        className="gaps-primary__cta"
      >
        Go to Theory <ChevronRight />
      </Link>
    </div>
  );
};

/* ── All Active Gaps List ────────────────────────────────────────────────── */

const ActiveGapCard = ({ gap, isPrimary }) => (
  <div className={`gaps-card${isPrimary ? " gaps-card--primary-mark" : ""}`}>
    <div className="gaps-card__head">
      <span className="gaps-card__title">{gap.title}</span>
      <StrengthBadge strength={gap.strength} />
    </div>
    <p className="gaps-card__desc">{gap.description}</p>
    <div className="gaps-card__meta">
      <span>{gap.wrongCount}/{gap.signalCount} signals missed</span>
      {gap.coreGapId && (
        <span className="gaps-card__core">
          {coreGaps.find((g) => g.id === gap.coreGapId)?.title}
        </span>
      )}
    </div>
  </div>
);

/* ── Most Common Gap ─────────────────────────────────────────────────────── */

const MostCommonBlock = ({ entry }) => {
  if (!entry) return null;
  return (
    <div className="gaps-common">
      <div className="gaps-common__header">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
        </svg>
        <span>Most common across all diagnostics</span>
        <span className="gaps-common__count">{entry.count}× detected</span>
      </div>
      <p className="gaps-common__title">{entry.gap.title}</p>
      <p className="gaps-common__desc">{entry.gap.description}</p>
    </div>
  );
};

/* ── Theme Cards ─────────────────────────────────────────────────────────── */

const ThemeCard = ({ progress }) => {
  const topic = topics.find((t) => t.id === progress.topicId);
  const title = MASTERY_TITLE(progress.score);
  const color = MASTERY_COLOR[title];
  const date = progress.completedAt
    ? new Date(progress.completedAt?.seconds
        ? progress.completedAt.seconds * 1000   // Firestore Timestamp
      : progress.completedAt                   // ISO string
      ).toLocaleDateString("en-GB", {
        day: "numeric", month: "short", year: "numeric",
      })
    : null;

  return (
    <div className="gaps-theme-card">
      <div className="gaps-theme-card__accent" style={{ background: color }} />
      <div className="gaps-theme-card__header">
        {topic?.icon && <topic.icon size={16} strokeWidth={1.8} />}
        <h4 className="gaps-theme-card__topic">{topic?.title || progress.topicId}</h4>
        <span
          className="gaps-theme-card__title"
          style={{ color, background: color + "14", borderColor: color + "30" }}
        >
          {title}
        </span>
      </div>

      <div className="gaps-theme-card__score">
        <strong style={{ color }}>{progress.score}%</strong>
        <span>mastery score</span>
        {date && <span className="gaps-theme-card__date">{date}</span>}
        <div className="gaps-theme-card__score">
          <strong style={{ color }}>
            {progress.score != null ? `${progress.score}%` : "—"}
          </strong>
          <span>mastery score</span>
          {date && <span className="gaps-theme-card__date">{date}</span>}
        </div>
      </div>

      {progress.gapsAtCompletion?.length > 0 && (
        <div className="gaps-theme-card__gaps">
          <p className="gaps-theme-card__gaps-label">Gaps at completion</p>
          <div className="gaps-theme-card__gap-tags">
            {progress.gapsAtCompletion.map((g) => (
              <span key={g.id} className="gaps-theme-card__gap-tag">{g.title}</span>
            ))}
          </div>
        </div>
      )}

      {(!progress.gapsAtCompletion?.length) && (
        <div className="gaps-theme-card__clean">
          <CheckIcon /> No gaps at completion
        </div>
      )}
    </div>
  );
};

/* ── Empty State ─────────────────────────────────────────────────────────── */

const GapsEmpty = () => (
  <div className="gaps-empty">
    <div className="gaps-empty__icon">
      <svg width="36" height="36" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth="1.3" strokeLinecap="round">
        <circle cx="11" cy="11" r="8" />
        <line x1="21" y1="21" x2="16.65" y2="16.65" />
      </svg>
    </div>
    <h3>No gaps detected yet</h3>
    <p>Run a diagnostic to find where your reasoning breaks down.</p>
    <Link to="/diagnostics" className="gaps-empty__cta">
      Start Diagnostic <ChevronRight />
    </Link>
  </div>
);

/* ── GapsSection ─────────────────────────────────────────────────────────── */

const GapsSection = ({ diagnostics = [], topicProgress = [] }) => {
    const STRENGTH_ORDER = { critical: 0, strong: 1, moderate: 2 };
  const activeGaps = useMemo(() => deriveActiveGaps(diagnostics), [diagnostics]);
  const mostCommon = useMemo(() => deriveMostCommonGap(diagnostics), [diagnostics]);

  const sortedActiveGaps = useMemo(
    () =>
      [...activeGaps].sort((a, b) => {
        const sd = (a.severity ?? 9) - (b.severity ?? 9);
        if (sd !== 0) return sd;
        return (STRENGTH_ORDER[a.strength] ?? 9) - (STRENGTH_ORDER[b.strength] ?? 9);
      }),
    [activeGaps]
  );


    const primaryGap = useMemo(() => {
      if (!activeGaps.length) return null;
      return [...activeGaps].sort((a, b) => {
        const sd = (a.severity ?? 9) - (b.severity ?? 9);
        if (sd !== 0) return sd;
        return (STRENGTH_ORDER[a.strength] ?? 9) - (STRENGTH_ORDER[b.strength] ?? 9);
      })[0];
    }, [activeGaps]);


  const grouped  = groupByTopic(sortedActiveGaps);
  const topicIds = Object.keys(grouped);

  const [activeTopic, setActiveTopic] = useState(null);

  useEffect(() => {
    if (topicIds.length && !activeTopic) setActiveTopic(topicIds[0]);
  }, [topicIds.length]);

  // Sort active gaps: severity 1 first, then strength order

  const hasActivity = diagnostics.length > 0;

  if (!hasActivity) return <GapsEmpty />;

  return (
    <div className="gaps-section">

      {/* Primary gap — most critical */}
      {primaryGap ? (
        <PrimaryGapBlock gap={primaryGap} />
      ) : (
        <div className="gaps-clean">
          <div className="gaps-clean__icon"><CheckIcon /></div>
          <div>
            <h3 className="gaps-clean__title">No active gaps</h3>
            <p className="gaps-clean__sub">
              Your most recent diagnostic found no reasoning gaps.
              Run another to stay on top of your reasoning.
            </p>
            <Link to="/diagnostics" className="gaps-clean__link">
              Run Diagnostic <ChevronRight />
            </Link>
          </div>
        </div>
      )}

      {/* All active gaps */}
    {sortedActiveGaps.length > 0 && (
      <div className="gaps-all">
        <div className="gaps-section__header">
      <AlertIcon />
      <h4 className="gaps-section__title">All active gaps</h4>
      <span className="gaps-section__count">{sortedActiveGaps.length}</span>
        </div>
    
        <div className="gaps-all__layout">
          {/* Sidebar */}
          <div className="gaps-all__sidebar">
            {topicIds.map((tid) => {
              const topic = topics.find((t) => t.id === tid);
              const count = grouped[tid].length;
              const isActive = tid === activeTopic;
              return (
                <button
                  key={tid}
                  className={`gaps-topic-tab${isActive ? " gaps-topic-tab--active" : ""}`}
                  onClick={() => setActiveTopic(tid)}
                >
                  {topic?.icon && <topic.icon size={12} strokeWidth={2.5} />}
                  <span>{topic?.title || tid}</span>
                  <span className="gaps-topic-tab__count">{count}</span>
                </button>
              );
            })}
          </div>
        
          {/* Content */}
          <div className="gaps-all__content">      
            {activeTopic && grouped[activeTopic]?.map((g) => (
          <ActiveGapCard
            key={g.id}
            gap={g}
            isPrimary={g.id === primaryGap?.id}
          />
        ))}
          </div>
        </div>
        
        <p className="gaps-all__hint">     
          Theory and practice are targeted at your most critical gap first.
        </p>
      </div>
    )}

      {/* Most common historically */}
      {diagnostics.length >= 2 && mostCommon && mostCommon.gap.id !== primaryGap?.id && (
        <MostCommonBlock entry={mostCommon} />
      )}

      {/* Theme cards */}
      {topicProgress.length > 0 && (
        <div className="gaps-themes">
          <div className="gaps-section__header">
            <CheckIcon />
            <h4 className="gaps-section__title">Completed themes</h4>
            <span className="gaps-section__count">{topicProgress.length}</span>
          </div>
          <div className="gaps-themes__grid">
            {topicProgress.map((p) => (
              <ThemeCard key={p.topicId} progress={p} />
            ))}
          </div>
        </div>
      )}

    </div>
  );
};

export default GapsSection;