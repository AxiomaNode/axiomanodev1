// src/components/sections/GapsSection.jsx
import { useMemo, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { topics } from "../../data/topics";
import { coreGaps } from "../../data/coreGaps";
import { useAuth } from "../../context/AuthContext";
import { getActiveGaps } from "../../services/db";

/* ── Constants ── */
const GAP_COLOR = "#c0392b"; // single color — "detected" has no severity gradient

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

/* ── Data helpers ───────────────────────────────────────── */

const gapKey      = (g) => g.gapId || g.id;
const gapDesc     = (g) => g.userFacingLabel ?? g.description?.what ?? g.description ?? "";
const gapTopicId  = (g) => g.evidence?.[0]?.topicId ?? g.topicId;
const gapWrong    = (g) => g.evidence?.[0]?.wrongCount ?? g.wrongCount;
const gapSignal   = (g) => g.evidence?.[0]?.signalCount ?? g.signalCount;
const gapSeverity = (g) => g.evidence?.[0]?.severity ?? g.severity ?? 9;
const gapRecText  = (g) => g.evidence?.[0]?.recommendationText ?? g.recommendationText;

const deriveCleanGaps = (diagnostics) => {
  const sorted = [...diagnostics].sort((a, b) => new Date(b.date) - new Date(a.date));
  for (const s of sorted) {
    if (Array.isArray(s.cleanGaps) && s.cleanGaps.length > 0) return s.cleanGaps;
    if (s.gaps?.length > 0 || Array.isArray(s.cleanGaps)) return s.cleanGaps ?? [];
  }
  return [];
};

const deriveMostCommonGap = (diagnostics) => {
  const tally = {};
  diagnostics.forEach(s => {
    s.gaps?.forEach(g => {
      const key = gapKey(g);
      if (!key) return;
      if (!tally[key]) tally[key] = { gap: g, count: 0 };
      tally[key].count++;
    });
  });
  const entries = Object.values(tally);
  if (!entries.length) return null;
  return entries.sort((a, b) => b.count - a.count)[0];
};

const sortGaps = (gaps) =>
  [...gaps].sort((a, b) => gapSeverity(a) - gapSeverity(b));

const groupByTopic = (gaps) =>
  gaps.reduce((acc, g) => {
    const key = gapTopicId(g) || "unknown";
    if (!acc[key]) acc[key] = [];
    acc[key].push(g);
    return acc;
  }, {});

/* ── Icons ── */
const ChevronRight = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
    <polyline points="9 18 15 12 9 6" />
  </svg>
);
const AlertIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
  </svg>
);
const CheckIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

/* ── Gap detected badge ── */
const DetectedBadge = () => (
  <span
    className="gaps-strength-badge"
    style={{ color: GAP_COLOR, background: GAP_COLOR + "14", borderColor: GAP_COLOR + "30" }}
  >
    detected
  </span>
);

/* ── Primary Gap Block ── */
const PrimaryGapBlock = ({ gap }) => {
  const topicId = gapTopicId(gap);
  const topic   = topics.find(t => t.id === topicId);
  const wrong   = gapWrong(gap);
  const signal  = gapSignal(gap);
  const recText = gapRecText(gap);

  return (
    <div className="gaps-primary">
      <div className="gaps-primary__accent" />
      <div className="gaps-primary__header">
        <div className="gaps-primary__eyebrow">
          <span className="gaps-primary__eyebrow-dot" />
          Currently working on
        </div>
        <DetectedBadge />
      </div>
      <h3 className="gaps-primary__title">{gap.title}</h3>
      <p className="gaps-primary__desc">{gapDesc(gap)}</p>
      {wrong != null && signal != null && (
        <div className="gaps-primary__signal">
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
          </svg>
          {wrong} / {signal} signal questions missed
          {topic && (
            <span className="gaps-primary__topic">
              {topic.icon && <topic.icon size={10} strokeWidth={2.5} />}
              {topic.title}
            </span>
          )}
        </div>
      )}
      {recText && (
        <div className="gaps-primary__rec">
          <p>{recText}</p>
        </div>
      )}
      <Link to="/theory" state={{ topicId }} className="gaps-primary__cta">
        Go to Theory <ChevronRight />
      </Link>
    </div>
  );
};

/* ── Active Gap Card ── */
const ActiveGapCard = ({ gap, isPrimary }) => {
  const wrong  = gapWrong(gap);
  const signal = gapSignal(gap);
  const cg     = coreGaps.find(g => g.id === gap.coreGapId);

  return (
    <div className={`gaps-card${isPrimary ? " gaps-card--primary-mark" : ""}`}>
      <div className="gaps-card__head">
        <span className="gaps-card__title">{gap.title}</span>
        <DetectedBadge />
      </div>
      <p className="gaps-card__desc">{gapDesc(gap)}</p>
      <div className="gaps-card__meta">
        {wrong != null && signal != null && <span>{wrong}/{signal} signals missed</span>}
        {cg && <span className="gaps-card__core">{cg.title}</span>}
      </div>
    </div>
  );
};

/* ── Clean Gaps Block ── */
const CleanGapsBlock = ({ cleanGaps }) => {
  if (!cleanGaps?.length) return null;

  return (
    <div className="gaps-clean-gaps">
      <div className="gaps-section__header">
        <CheckIcon />
        <h4 className="gaps-section__title">Solid reasoning</h4>
      </div>
      <div className="gaps-clean-gaps__chips">
        {cleanGaps.map(cg => (
          <span key={cg.gapId || cg.id} className="gaps-clean-gaps__chip">
            <CheckIcon />
            {cg.shortLabel || cg.title}
          </span>
        ))}
      </div>
      <p className="gaps-clean-gaps__note">No reasoning gaps detected in these areas this session.</p>
    </div>
  );
};

/* ── Most Common Block ── */
const MostCommonBlock = ({ entry }) => {
  if (!entry) return null;

  return (
    <div className="gaps-common">
      <div className="gaps-common__header">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
        </svg>
        <span>Most common across all diagnostics</span>
        <span className="gaps-common__count">{entry.count}× detected</span>
      </div>
      <p className="gaps-common__title">{entry.gap.title}</p>
      <p className="gaps-common__desc">{gapDesc(entry.gap)}</p>
    </div>
  );
};

/* ── Theme Card ── */
const ThemeCard = ({ progress }) => {
  const topic = topics.find(t => t.id === progress.topicId);
  const title = MASTERY_TITLE(progress.score);
  const color = MASTERY_COLOR[title];
  const date  = progress.completedAt
    ? new Date(
        progress.completedAt?.seconds
          ? progress.completedAt.seconds * 1000
          : progress.completedAt
      ).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })
    : null;

  return (
    <div className="gaps-theme-card">
      <div className="gaps-theme-card__accent" style={{ background: color }} />
      <div className="gaps-theme-card__header">
        {topic?.icon && <topic.icon size={16} strokeWidth={1.8} />}
        <h4 className="gaps-theme-card__topic">{topic?.title || progress.topicId}</h4>
        <span className="gaps-theme-card__title" style={{ color, background: color + "14", borderColor: color + "30" }}>
          {title}
        </span>
      </div>
      <div className="gaps-theme-card__score">
        <strong style={{ color }}>{progress.score != null ? `${progress.score}%` : "—"}</strong>
        <span>mastery score</span>
        {date && <span className="gaps-theme-card__date">{date}</span>}
      </div>
      {progress.gapsAtCompletion?.length > 0 ? (
        <div className="gaps-theme-card__gaps">
          <p className="gaps-theme-card__gaps-label">Gaps at completion</p>
          <div className="gaps-theme-card__gap-tags">
            {progress.gapsAtCompletion.map(g => (
              <span key={gapKey(g)} className="gaps-theme-card__gap-tag">{g.title}</span>
            ))}
          </div>
        </div>
      ) : (
        <div className="gaps-theme-card__clean"><CheckIcon /> No gaps at completion</div>
      )}
    </div>
  );
};

/* ── Empty State ── */
const GapsEmpty = () => (
  <div className="profile-empty-state">

    <div className="profile-empty-state__head">
      <div className="profile-empty-state__head-icon profile-empty-state__head-icon--orange">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
          <circle cx="12" cy="12" r="10"/>
          <line x1="12" y1="8"  x2="12"    y2="12"/>
          <line x1="12" y1="16" x2="12.01" y2="16"/>
        </svg>
      </div>
      <div>
        <h3 className="profile-empty-state__title">No gaps detected yet</h3>
        <p className="profile-empty-state__sub">
          A gap is a specific reasoning pattern that consistently breaks down —
          not just a wrong answer, but a predictable place where your thinking goes off track.
          Run a diagnostic to find yours.
        </p>
      </div>
    </div>

    <div className="profile-empty-state__explainer">
      <div className="profile-empty-state__explainer-row">
        <div className="profile-empty-state__explainer-icon">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <circle cx="11" cy="11" r="8"/>
            <line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
        </div>
        <div>
          <strong>What gets detected</strong>
          <p>5 gap types across quadratic reasoning — each one maps to where in the thinking process errors actually originate.</p>
        </div>
      </div>
      <div className="profile-empty-state__explainer-row">
        <div className="profile-empty-state__explainer-icon">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
          </svg>
        </div>
        <div>
          <strong>How detection works</strong>
          <p>4 signal questions per gap. Get 3 or 4 wrong and the gap is flagged. Not enough signal — nothing fires.</p>
        </div>
      </div>
      <div className="profile-empty-state__explainer-row">
        <div className="profile-empty-state__explainer-icon">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <polyline points="9 11 12 14 22 4"/>
            <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>
          </svg>
        </div>
        <div>
          <strong>What to do with a gap</strong>
          <p>Go to Theory for that gap, do targeted practice, then run the diagnostic again the next day to check if it closed.</p>
        </div>
      </div>
    </div>

    <div className="profile-empty-state__actions">
      <Link to="/diagnostics" className="profile-empty-state__btn profile-empty-state__btn--primary">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
          <circle cx="11" cy="11" r="8"/>
          <line x1="21" y1="21" x2="16.65" y2="16.65"/>
        </svg>
        Run a diagnostic
      </Link>
      <Link to="/theory" className="profile-empty-state__btn profile-empty-state__btn--ghost">
        Read theory first
      </Link>
    </div>

  </div>
);

/* ── GapsSection ── */
const GapsSection = ({ diagnostics = [], topicProgress = [] }) => {
  const { user } = useAuth();

  const [activeGaps, setActiveGaps] = useState([]);
  const [activeTopic, setActiveTopic] = useState(null);
  const [loadingActive, setLoadingActive] = useState(true);

  useEffect(() => {
    let cancelled = false;

    const loadActiveGaps = async () => {
      if (!user?.uid) {
        if (!cancelled) {
          setActiveGaps([]);
          setLoadingActive(false);
        }
        return;
      }

      setLoadingActive(true);
      const liveActiveGaps = await getActiveGaps(user.uid);

      if (!cancelled) {
        setActiveGaps(Array.isArray(liveActiveGaps) ? liveActiveGaps : []);
        setLoadingActive(false);
      }
    };

    loadActiveGaps();
    return () => { cancelled = true; };
  }, [user?.uid]);

  const cleanGaps  = useMemo(() => deriveCleanGaps(diagnostics), [diagnostics]);
  const mostCommon = useMemo(() => deriveMostCommonGap(diagnostics), [diagnostics]);
  const sortedGaps = useMemo(() => sortGaps(activeGaps), [activeGaps]);
  const primaryGap = sortedGaps[0] ?? null;
  const primaryKey = primaryGap ? gapKey(primaryGap) : null;

  const grouped  = useMemo(() => groupByTopic(sortedGaps), [sortedGaps]);
  const topicIds = Object.keys(grouped);

  useEffect(() => {
    if (!topicIds.length) {
      setActiveTopic(null);
      return;
    }

    if (!activeTopic || !topicIds.includes(activeTopic)) {
      setActiveTopic(topicIds[0]);
    }
  }, [topicIds, activeTopic]);

  if (!loadingActive && !diagnostics.length && !activeGaps.length) {
    return <GapsEmpty />;
  }

  return (
    <div className="gaps-section">

      {/* Primary gap */}
      {primaryGap ? (
        <PrimaryGapBlock gap={primaryGap} />
      ) : (
        <div className="gaps-clean">
          <div className="gaps-clean__icon"><CheckIcon /></div>
          <div>
            <h3 className="gaps-clean__title">No active gaps</h3>
            <p className="gaps-clean__sub">Your current gap status shows no active reasoning gaps. Run another diagnostic to stay sharp.</p>
            <Link to="/diagnostics" className="gaps-clean__link">Run Diagnostic <ChevronRight /></Link>
          </div>
        </div>
      )}

      {/* All active gaps */}
      {sortedGaps.length > 0 && (
        <div className="gaps-all">
          <div className="gaps-section__header">
            <AlertIcon />
            <h4 className="gaps-section__title">All active gaps</h4>
            <span className="gaps-section__count">{sortedGaps.length}</span>
          </div>
          <div className="gaps-all__layout">
            <div className="gaps-all__sidebar">
              {topicIds.map(tid => {
                const topic = topics.find(t => t.id === tid);
                return (
                  <button
                    key={tid}
                    className={`gaps-topic-tab${tid === activeTopic ? " gaps-topic-tab--active" : ""}`}
                    onClick={() => setActiveTopic(tid)}
                  >
                    {topic?.icon && <topic.icon size={12} strokeWidth={2.5} />}
                    <span>{topic?.title || tid}</span>
                    <span className="gaps-topic-tab__count">{grouped[tid].length}</span>
                  </button>
                );
              })}
            </div>
            <div className="gaps-all__content">
              {activeTopic && grouped[activeTopic]?.map(g => (
                <ActiveGapCard key={gapKey(g)} gap={g} isPrimary={gapKey(g) === primaryKey} />
              ))}
            </div>
          </div>
          <p className="gaps-all__hint">Theory and practice are targeted at your most critical gap first.</p>
        </div>
      )}

      {/* Clean gaps from latest session */}
      {cleanGaps.length > 0 && <CleanGapsBlock cleanGaps={cleanGaps} />}

      {/* Most common historically */}
      {diagnostics.length >= 2 && mostCommon && gapKey(mostCommon.gap) !== primaryKey && (
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
            {topicProgress.map(p => <ThemeCard key={p.topicId} progress={p} />)}
          </div>
        </div>
      )}
    </div>
  );
};

export default GapsSection;