// src/components/sections/CredentialsSection.jsx
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase/firebaseConfig";
import { topics } from "../../data/topics";
import "./credentials.css";

/* ════════════════════════════════════════
   MASTERY SEAL — earned
════════════════════════════════════════ */
export const MasterySeal = ({
  title,
  titleColor,
  topicIcon: TopicIcon,
  size = 120,
}) => {
  const r = size / 2;
  const cx = r;
  const cy = r;

  // --- layout ---
  const outerR = r - 3;

  // ticks live OUTSIDE text now
  const tickOuterR = outerR;
  const tickInnerR = r - 8;

  // text pushed inward into its own clean band
  const textR = r - 20;

  const innerRingR = r - 30;
  const fillR = r - 38;

  const topText = String(title || "AXIOMA").toUpperCase();
  const bottomText = "MASTERY CREDENTIAL";

  const safeId = `seal-${String(title || "mastery")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")}-${size}`;

  // balanced ticks (all 8, but visually lighter)
  const ticks = Array.from({ length: 8 }, (_, i) => {
    const angle = (i * 45 * Math.PI) / 180;

    const x1 = cx + tickOuterR * Math.sin(angle);
    const y1 = cy - tickOuterR * Math.cos(angle);
    const x2 = cx + tickInnerR * Math.sin(angle);
    const y2 = cy - tickInnerR * Math.cos(angle);

    return {
      x1,
      y1,
      x2,
      y2,
      major: i % 2 === 0,
    };
  });

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      className="ms-seal"
      aria-label={`${title} mastery credential`}
    >
      <defs>
        {/* top arc */}
        <path
          id={`${safeId}-top`}
          d={`M ${cx - textR}, ${cy} A ${textR},${textR} 0 0 1 ${cx + textR},${cy}`}
        />
        {/* bottom arc */}
        <path
          id={`${safeId}-bottom`}
          d={`M ${cx + textR}, ${cy} A ${textR},${textR} 0 0 1 ${cx - textR},${cy}`}
        />
      </defs>

      {/* outer ring */}
      <circle
        cx={cx}
        cy={cy}
        r={outerR}
        fill="none"
        stroke={titleColor}
        strokeWidth="1"
        opacity="0.3"
      />

      {/* ticks (outer lane) */}
      {ticks.map((t, i) => (
        <line
          key={i}
          x1={t.x1}
          y1={t.y1}
          x2={t.x2}
          y2={t.y2}
          stroke={titleColor}
          strokeWidth={t.major ? "1.5" : "1"}
          opacity="0.35"
          strokeLinecap="round"
        />
      ))}

      {/* text */}
      <text
        fill={titleColor}
        fontFamily="'Courier New', monospace"
        fontWeight="700"
        fontSize="8"
        letterSpacing="1.2"
      >
        <textPath
          href={`#${safeId}-top`}
          startOffset="50%"
          textAnchor="middle"
        >
          {topText}
        </textPath>
      </text>

      <text
        fill={titleColor}
        fontFamily="'Courier New', monospace"
        fontWeight="700"
        fontSize="8"
        letterSpacing="1.2"
      >
        <textPath
          href={`#${safeId}-bottom`}
          startOffset="50%"
          textAnchor="middle"
        >
          {bottomText}
        </textPath>
      </text>

      {/* center */}
      <circle cx={cx} cy={cy} r={fillR} fill={titleColor} opacity="0.1" />

      <circle
        cx={cx}
        cy={cy}
        r={innerRingR}
        fill="none"
        stroke={titleColor}
        strokeWidth="1"
        opacity="0.35"
      />

      {TopicIcon ? (
        <g transform={`translate(${cx - 14}, ${cy - 14})`}>
          <foreignObject width="28" height="28">
            <div
              style={{
                width: 28,
                height: 28,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: titleColor,
              }}
            >
              <TopicIcon size={20} strokeWidth={1.5} />
            </div>
          </foreignObject>
        </g>
      ) : (
        <text
          x={cx}
          y={cy + 5}
          textAnchor="middle"
          fontSize="16"
          fill={titleColor}
          opacity="0.7"
          fontFamily="Georgia, serif"
        >
          ✦
        </text>
      )}
    </svg>
  );
};
/* ════════════════════════════════════════
   LOCKED SEAL
════════════════════════════════════════ */
const LockedSeal = ({ size = 96 }) => {
  const r = size / 2, cx = r, cy = r;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}
      className="ms-seal ms-seal--locked">
      {/* Dashed outer ring */}
      <circle cx={cx} cy={cy} r={r - 3}
        fill="none" stroke="var(--border-strong)"
        strokeWidth="1.5" strokeDasharray="4 3" />
      {/* Inner disc */}
      <circle cx={cx} cy={cy} r={r - 16}
        fill="var(--card-bg-alt)" stroke="var(--border)" strokeWidth="1" />
      {/* Lock icon */}
      <g transform={`translate(${cx - 8}, ${cy - 10})`}>
        <rect x="1.5" y="7" width="13" height="10" rx="2.5"
          fill="none" stroke="var(--text-light)" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M4.5 7V5a3.5 3.5 0 0 1 7 0v2"
          fill="none" stroke="var(--text-light)" strokeWidth="1.5" strokeLinecap="round" />
      </g>
    </svg>
  );
};

/* ════════════════════════════════════════
   PROGRESS STEPS CONFIG
════════════════════════════════════════ */
const PROGRESS_STEPS = [
  { title: "Proficient", threshold: null },
  { title: "Advanced",   threshold: "80%" },
  { title: "Expert",     threshold: "87%" },
  { title: "Flawless",   threshold: "95%" },
];

/* ════════════════════════════════════════
   EARNED CARD
════════════════════════════════════════ */
const EarnedCard = ({ card, topicMeta }) => {
  const isFlawless  = card.title === "Flawless";
  const currentStep = PROGRESS_STEPS.findIndex(s => s.title === card.title);
  const nextStep    = PROGRESS_STEPS[currentStep + 1] ?? null;

  const earnedDate = card.earnedAt
    ? new Date(card.earnedAt).toLocaleDateString("en-GB", {
        day: "numeric", month: "long", year: "numeric",
      })
    : null;

  return (
    <div
      className="cred-card cred-card--earned"
      style={{ "--card-color": card.titleColor }}
    >
      {/* Left accent */}
      <div className="cred-card__accent" style={{ background: card.titleColor }} />

      {/* Seal */}
      <div className="cred-card__seal">
        <MasterySeal
          title={card.title}
          titleColor={card.titleColor}
          topicIcon={topicMeta?.icon}
          size={112}
        />
      </div>

      {/* Body */}
      <div className="cred-card__body">

        {/* TOP ROW */}
        <div className="cred-card__top">
          <div style={{ flex: 1, minWidth: 0 }}>
            {/* Meta: tier pill + date */}
            <div className="cred-card__meta">
              <span
                className="cred-card__title"
                style={{ color: card.titleColor }}
              >
                {card.title}
              </span>
              {earnedDate && (
                <span className="cred-card__date">
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <rect x="3" y="4" width="18" height="18" rx="2"/>
                    <line x1="16" y1="2" x2="16" y2="6"/>
                    <line x1="8"  y1="2" x2="8"  y2="6"/>
                    <line x1="3"  y1="10" x2="21" y2="10"/>
                  </svg>
                  {earnedDate}
                </span>
              )}
            </div>

            {/* Topic name */}
            <h3 className="cred-card__topic">{card.topicTitle}</h3>

            {/* Desc */}
            <p className="cred-card__desc">
              Proved reasoning across all 5 gap types simultaneously.
            </p>
          </div>

          {/* Stats */}
          <div className="cred-card__stats">
            <div className="cred-card__stat">
              <strong style={{ color: card.titleColor }}>{card.score}%</strong>
              <span>Score</span>
            </div>
            <div className="cred-card__stat-div" />
            <div className="cred-card__stat">
              <strong>5 / 5</strong>
              <span>Gap types</span>
            </div>
          </div>
        </div>

        {/* PROGRESS LADDER */}
        <div className="cred-card__progress">
          <div className="cred-card__progress-steps">
            {PROGRESS_STEPS.map((step, i) => {
              const isDone    = i <= currentStep;
              const isCurrent = i === currentStep;
              return (
                <div key={step.title} className="cred-card__progress-step">
                  {/* Dot */}
                  <div
                    className={[
                      "cred-card__progress-dot",
                      isDone    ? "cred-card__progress-dot--done"    : "",
                      isCurrent ? "cred-card__progress-dot--current" : "",
                    ].join(" ")}
                    style={isDone ? {
                      background: card.titleColor,
                      borderColor: card.titleColor,
                      boxShadow: isCurrent
                        ? `0 0 0 3px ${card.titleColor}28`
                        : "none",
                    } : {}}
                  />
                  {/* Label */}
                  <span
                    className={[
                      "cred-card__progress-label",
                      isCurrent ? "cred-card__progress-label--active" : "",
                    ].join(" ")}
                    style={isCurrent ? { color: card.titleColor } : {}}
                  >
                    {step.title}
                  </span>
                  {/* Connector line (not after last) */}
                  {i < PROGRESS_STEPS.length - 1 && (
                    <div
                      className={[
                        "cred-card__progress-line",
                        i < currentStep ? "cred-card__progress-line--done" : "",
                      ].join(" ")}
                      style={i < currentStep ? { background: card.titleColor } : {}}
                    />
                  )}
                </div>
              );
            })}
          </div>

          {/* Hint */}
          {!isFlawless && nextStep && (
            <span className="cred-card__progress-hint">
              Score {nextStep.threshold}+ to reach {nextStep.title}
            </span>
          )}
          {isFlawless && (
            <span className="cred-card__progress-hint" style={{ color: "#f1c40f" }}>
              ★ Maximum title reached
            </span>
          )}
        </div>

        {/* ACTIONS */}
        <div className="cred-card__actions">
          {!isFlawless ? (
            <Link
              to="/masteryTest"
              state={{ topicId: card.topicId }}
              className="cred-btn cred-btn--primary"
            >
              Retry to upgrade
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <polyline points="9 18 15 12 9 6"/>
              </svg>
            </Link>
          ) : (
            <span className="cred-badge-expert">
              <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
              </svg>
              Flawless — maximum title reached
            </span>
          )}
          <Link to="/theory" className="cred-btn cred-btn--ghost">
            Review Theory
          </Link>
        </div>

      </div>
    </div>
  );
};

/* ════════════════════════════════════════
   LOCKED CARD
════════════════════════════════════════ */
const LockedCard = ({ topic }) => (
  <div className="cred-card cred-card--locked">
    <div className="cred-card__accent" style={{ background: "var(--border)" }} />
    <div className="cred-card__seal">
      <LockedSeal size={96} />
    </div>
    <div className="cred-card__body">
      <div className="cred-card__top">
        <div>
          <span className="cred-card__locked-label">Not yet earned</span>
          <h3 className="cred-card__topic cred-card__topic--locked">
            {topic.title}
          </h3>
          <p className="cred-card__desc">
            Complete the diagnostic loop — identify gaps, work through theory and
            practice, then prove your reasoning here.
          </p>
        </div>
      </div>
      <div className="cred-card__actions">
        <Link to="/diagnostics" className="cred-btn cred-btn--ghost">
          Run Diagnostic
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <polyline points="9 18 15 12 9 6"/>
          </svg>
        </Link>
      </div>
    </div>
  </div>
);

/* ════════════════════════════════════════
   EMPTY STATE
════════════════════════════════════════ */
const EmptyState = () => (
  <div className="cred-empty">
    <div className="cred-empty__icon">
      <svg width="36" height="36" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth="1.3" strokeLinecap="round">
        <circle cx="12" cy="8" r="6"/>
        <path d="M3 20c0-4 4-7 9-7s9 3 9 7"/>
        <path d="M9 8h.01M15 8h.01"/>
      </svg>
    </div>
    <h3 className="cred-empty__title">No credentials yet</h3>
    <p className="cred-empty__sub">
      Mastery credentials prove you've closed all reasoning gaps on a topic.
      Run a diagnostic to find your gaps, work through theory and practice,
      then take the mastery test to earn your first credential.
    </p>
    <div className="cred-empty__actions">
      <Link to="/diagnostics" className="cred-btn cred-btn--primary">
        Start with a Diagnostic
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
          <polyline points="9 18 15 12 9 6"/>
        </svg>
      </Link>
      <Link to="/theory" className="cred-btn cred-btn--ghost">
        Review Theory
      </Link>
    </div>
  </div>
);

/* ════════════════════════════════════════
   MAIN COMPONENT
════════════════════════════════════════ */
const CredentialsSection = ({ uid }) => {
  const [cards,   setCards]   = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!uid) return;
    const load = async () => {
      try {
        const snap = await getDocs(collection(db, "users", uid, "masteryCards"));
        setCards(snap.docs.map(d => d.data()));
      } catch (err) {
        console.error("[CredentialsSection]", err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [uid]);

  const earnedIds       = new Set(cards.map(c => c.topicId));
  const availableTopics = topics.filter(t => t.id);

  if (loading) {
    return (
      <div className="cred-loading">
        <div className="cred-loading__ring" />
        <span>Loading credentials…</span>
      </div>
    );
  }

  return (
    <div className="cred-section">

      {/* Header */}
      <div className="cred-header">
        <div>
          <h2 className="cred-header__title">Credentials</h2>
          <p className="cred-header__sub">
            Earned by proving reasoning across all gap types simultaneously.
            {cards.length > 0
              ? ` ${cards.length} of ${availableTopics.length} topic${availableTopics.length !== 1 ? "s" : ""} completed.`
              : " Complete the diagnostic loop to start earning."}
          </p>
        </div>
        {cards.length > 0 && (
          <div className="cred-header__count">
            <span className="cred-header__num">{cards.length}</span>
            <span className="cred-header__denom">/ {availableTopics.length}</span>
          </div>
        )}
      </div>

      {/* Empty state */}
      {cards.length === 0 && <EmptyState />}

      {/* Cards */}
      <div className="cred-list">
        {cards.map(card => {
          const topicMeta = topics.find(t => t.id === card.topicId);
          return (
            <EarnedCard key={card.topicId} card={card} topicMeta={topicMeta} />
          );
        })}
        {cards.length > 0 &&
          availableTopics
            .filter(t => !earnedIds.has(t.id))
            .map(topic => <LockedCard key={topic.id} topic={topic} />)
        }
      </div>

    </div>
  );
};

export default CredentialsSection;