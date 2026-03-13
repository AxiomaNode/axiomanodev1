// src/pages/feedbackPages/FeedbackPage.jsx
import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import {
  collection, doc, setDoc, getDocs,
  orderBy, query, serverTimestamp, runTransaction,
} from "firebase/firestore";
import { db } from "../../firebase/firebaseConfig";
import { useAuth } from "../../context/AuthContext";
import { getUserProfile } from "../../firebase/auth";
import Header from "../../components/layout/Header";
import Sidebar from "../../components/layout/Sidebar";
import "./feedback.css";
import "../../styles/layout.css";

// ── Helpers ───────────────────────────────────────────────────────────────────
const getTier = (level) => {
  if (level >= 20) return { label: "Master",  color: "#9b59b6" };
  if (level >= 10) return { label: "Expert",  color: "#d35400" };
  if (level >= 5)  return { label: "Learner", color: "#2a8fa0" };
  return               { label: "Beginner", color: "rgba(120,140,160,0.9)" };
};
const getLevel = (xp) => Math.floor((xp || 0) / 200) + 1;

const formatDate = (ts) => {
  if (!ts) return "";
  const d = ts.toDate ? ts.toDate() : new Date(ts);
  return d.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
};

const initials = (name = "?") =>
  name.split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase();

// ── Network background (mirrors home page) ────────────────────────────────────
const NetworkBg = () => (
  <svg className="fb-hero__network" viewBox="0 0 900 380" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    {[[80,60],[220,30],[400,80],[580,40],[750,90],[860,50],
      [140,180],[320,150],[500,200],[680,160],[820,200],
      [60,300],[200,280],[380,320],[540,290],[720,310],[880,270]].map(([x,y],i) => (
      <circle key={i} cx={x} cy={y} r={i%3===0?4:3} fill="rgba(42,143,160,0.25)" />
    ))}
    {[[80,60,220,30],[220,30,400,80],[400,80,580,40],[580,40,750,90],[750,90,860,50],
      [80,60,140,180],[220,30,320,150],[400,80,500,200],[580,40,680,160],[750,90,820,200],
      [140,180,320,150],[320,150,500,200],[500,200,680,160],[680,160,820,200],
      [140,180,60,300],[320,150,200,280],[500,200,380,320],[540,290,720,310]].map(([x1,y1,x2,y2],i) => (
      <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="rgba(42,143,160,0.12)" strokeWidth="1" />
    ))}
    <text x="50"  y="240" fill="rgba(42,143,160,0.08)" fontSize="52" fontFamily="Georgia,serif">∑</text>
    <text x="700" y="340" fill="rgba(42,143,160,0.07)" fontSize="40" fontFamily="Georgia,serif">∫</text>
    <text x="430" y="360" fill="rgba(42,143,160,0.07)" fontSize="36" fontFamily="Georgia,serif">Δ</text>
    <text x="810" y="130" fill="rgba(42,143,160,0.07)" fontSize="30" fontFamily="Georgia,serif">π</text>
  </svg>
);

// ── Stars ─────────────────────────────────────────────────────────────────────
const Stars = ({ rating, size = 13 }) => (
  <div className="fb-stars">
    {[1, 2, 3, 4, 5].map((n) => (
      <svg key={n} width={size} height={size} viewBox="0 0 24 24"
        className={`fb-star ${n <= rating ? "fb-star--on" : "fb-star--off"}`}>
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"
          strokeWidth="1.5" strokeLinejoin="round"/>
      </svg>
    ))}
  </div>
);

// ── Star picker ───────────────────────────────────────────────────────────────
const StarPicker = ({ value, onChange }) => {
  const [hover, setHover] = useState(0);
  const active = hover || value;
  const labels = ["", "Poor", "Fair", "Good", "Great", "Excellent"];
  return (
    <div className="fb-picker">
      <div className="fb-picker__stars">
        {[1, 2, 3, 4, 5].map((n) => (
          <button key={n} type="button"
            className={`fb-picker__star ${n <= active ? "fb-picker__star--on" : ""}`}
            onMouseEnter={() => setHover(n)}
            onMouseLeave={() => setHover(0)}
            onClick={() => onChange(n)}
            aria-label={`${n} star${n > 1 ? "s" : ""}`}>
            <svg viewBox="0 0 24 24" width="30" height="30">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"
                strokeWidth="1.5" strokeLinejoin="round"/>
            </svg>
          </button>
        ))}
      </div>
      <span className="fb-picker__label">{labels[active] || "Select a rating"}</span>
    </div>
  );
};

// ── Limited textarea ──────────────────────────────────────────────────────────
const LimitedTextarea = ({ label, labelColor, value, onChange, max, placeholder }) => (
  <div className="fb-field">
    <div className="fb-field__top">
      <label className="fb-field__label" style={{ color: labelColor }}>{label}</label>
      <span className={`fb-field__count ${value.length >= max ? "fb-field__count--over" : ""}`}>
        {value.length}/{max}
      </span>
    </div>
    <textarea
      className="fb-field__input"
      value={value}
      onChange={(e) => onChange(e.target.value.slice(0, max))}
      placeholder={placeholder}
      rows={3}
    />
  </div>
);

// ── Modal ─────────────────────────────────────────────────────────────────────
const FeedbackModal = ({ onClose, onSubmitted, existingReview }) => {
  const { user } = useAuth();
  const [rating,      setRating]      = useState(existingReview?.rating      ?? 0);
  const [strongSides, setStrongSides] = useState(existingReview?.strongSides ?? "");
  const [weakSides,   setWeakSides]   = useState(existingReview?.weakSides   ?? "");
  const [comment,     setComment]     = useState(existingReview?.comment     ?? "");
  const [submitting,  setSubmitting]  = useState(false);
  const [error,       setError]       = useState("");

  const canSubmit = rating > 0 && !submitting;

  const handleSubmit = async () => {
    if (!canSubmit) return;
    setSubmitting(true);
    setError("");
    try {
      const prof  = await getUserProfile(user.uid);
      const xp    = prof?.ratingPoints || 0;
      const level = getLevel(xp);
      const tier  = getTier(level);

      await setDoc(doc(db, "feedback", user.uid), {
        uid:         user.uid,
        displayName: user.displayName || "Anonymous",
        tier:        tier.label,
        tierColor:   tier.color,
        rating,
        strongSides: strongSides.trim(),
        weakSides:   weakSides.trim(),
        comment:     comment.trim(),
        createdAt:   serverTimestamp(),
        // preserve vote data on edit
        yesCount:    existingReview?.yesCount ?? 0,
        noCount:     existingReview?.noCount  ?? 0,
        voters:      existingReview?.voters   ?? {},
      });

      onSubmitted();
      onClose();
    } catch {
      setError("Something went wrong. Please try again.");
      setSubmitting(false);
    }
  };

  return (
    <div className="fb-modal-backdrop" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="fb-modal">
        <div className="fb-modal__accent" />
        <div className="fb-modal__header">
          <div>
            <p className="fb-modal__eyebrow">Share your experience</p>
            <h2 className="fb-modal__title">Leave a Review</h2>
          </div>
          <button className="fb-modal__close" onClick={onClose} aria-label="Close">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>
        <div className="fb-modal__body">
          <StarPicker value={rating} onChange={setRating} />
          <LimitedTextarea label="Strong sides" labelColor="#27ae60"
            value={strongSides} onChange={setStrongSides}
            max={300} placeholder="What does Axioma do well?" />
          <LimitedTextarea label="Weak sides" labelColor="#d35400"
            value={weakSides} onChange={setWeakSides}
            max={300} placeholder="What could be improved?" />
          <LimitedTextarea label="General comment" labelColor="var(--text-light)"
            value={comment} onChange={setComment}
            max={500} placeholder="Anything else you'd like to say…" />
          {error && <p className="fb-modal__error">{error}</p>}
        </div>
        <div className="fb-modal__footer">
          <button className="fb-btn fb-btn--ghost" onClick={onClose}>Cancel</button>
          <button className="fb-btn fb-btn--primary" onClick={handleSubmit} disabled={!canSubmit}>
            {submitting
              ? <><span className="fb-spinner" /> Submitting…</>
              : existingReview ? "Update Review" : "Submit Review"
            }
          </button>
        </div>
      </div>
    </div>
  );
};

// ── Vote button ───────────────────────────────────────────────────────────────
const VoteBtn = ({ vote, count, myVote, onVote, disabled }) => {
  const active = myVote === vote;
  return (
    <button
      className={`fb-vote${active ? " fb-vote--on" : ""}${disabled ? " fb-vote--off" : ""}`}
      onClick={() => !disabled && onVote(vote)}
      title={disabled ? "You can't vote on your own review" : undefined}
    >
      {vote === "yes" ? (
        <svg width="12" height="12" viewBox="0 0 24 24"
          fill={active ? "currentColor" : "none"} stroke="currentColor"
          strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3z"/>
          <path d="M7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"/>
        </svg>
      ) : (
        <svg width="12" height="12" viewBox="0 0 24 24"
          fill={active ? "currentColor" : "none"} stroke="currentColor"
          strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M10 15v4a3 3 0 0 0 3 3l4-9V2H5.72a2 2 0 0 0-2 1.7l-1.38 9a2 2 0 0 0 2 2.3z"/>
          <path d="M17 2h2.67A2.31 2.31 0 0 1 22 4v7a2.31 2.31 0 0 1-2.33 2H17"/>
        </svg>
      )}
      <span>{vote === "yes" ? "Helpful" : "Not helpful"}</span>
      {count > 0 && <span className="fb-vote__count">{count}</span>}
    </button>
  );
};

// ── Card ──────────────────────────────────────────────────────────────────────
const FeedbackCard = ({ item, isOwn, onVote }) => (
  <div className={`fb-card${isOwn ? " fb-card--own" : ""}`}>
    {isOwn && <div className="fb-card__stripe" />}

    <div className="fb-card__head">
      <Link to={`/profile/${item.uid}`} className="fb-card__av-link" tabIndex={-1}>
        <div className="fb-card__av">{initials(item.displayName)}</div>
      </Link>

      <div className="fb-card__meta">
        <div className="fb-card__name-row">
          <Link to={`/profile/${item.uid}`} className="fb-card__name-link">
            <span className="fb-card__name">{item.displayName}</span>
          </Link>
          {isOwn && <span className="fb-card__you">you</span>}
          <span className="fb-card__tier" style={{
            color:       item.tierColor,
            borderColor: item.tierColor + "35",
            background:  item.tierColor + "0e",
          }}>{item.tier}</span>
          <span className="fb-card__date">{formatDate(item.createdAt)}</span>
        </div>
        <Stars rating={item.rating} size={13} />
      </div>
    </div>

    {(item.strongSides || item.weakSides || item.comment) && (
      <div className="fb-card__body">
        {item.strongSides && (
          <div className="fb-card__section fb-card__section--strong">
            <span className="fb-card__slabel">
              <svg width="9" height="9" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01z"/>
              </svg>
              Strong
            </span>
            <p>{item.strongSides}</p>
          </div>
        )}
        {item.weakSides && (
          <div className="fb-card__section fb-card__section--weak">
            <span className="fb-card__slabel">
              <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="5" y1="12" x2="19" y2="12"/>
              </svg>
              Weak
            </span>
            <p>{item.weakSides}</p>
          </div>
        )}
        {item.comment && (
          <div className="fb-card__section">
            <span className="fb-card__slabel">
              <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
              </svg>
              Comment
            </span>
            <p>{item.comment}</p>
          </div>
        )}
      </div>
    )}

    <div className="fb-card__foot">
      <span className="fb-card__foot-label">Was this helpful?</span>
      <VoteBtn vote="yes"
        count={item.yesCount || 0}
        myVote={item.myVote}
        onVote={(v) => onVote(item.uid, v)}
        disabled={isOwn} />
      <VoteBtn vote="no"
        count={item.noCount || 0}
        myVote={item.myVote}
        onVote={(v) => onVote(item.uid, v)}
        disabled={isOwn} />
    </div>
  </div>
);

// ── Aggregate score (hero right) ──────────────────────────────────────────────
const AggregateScore = ({ items }) => {
  if (!items.length) return null;
  const avg  = items.reduce((s, i) => s + i.rating, 0) / items.length;
  const dist = [5,4,3,2,1].map((star) => ({
    star,
    count: items.filter(i => i.rating === star).length,
    pct:   Math.round((items.filter(i => i.rating === star).length / items.length) * 100),
  }));
  return (
    <div className="fb-agg">
      <div className="fb-agg__accent" />
      <div className="fb-agg__left">
        <span className="fb-agg__num">{avg.toFixed(1)}</span>
        <Stars rating={Math.round(avg)} size={16} />
        <span className="fb-agg__label">{items.length} review{items.length !== 1 ? "s" : ""}</span>
      </div>
      <div className="fb-agg__div" />
      <div className="fb-agg__bars">
        {dist.map(({ star, pct, count }) => (
          <div key={star} className="fb-agg__row">
            <span className="fb-agg__star">{star}★</span>
            <div className="fb-agg__track">
              <div className="fb-agg__fill" style={{ width: `${pct}%` }} />
            </div>
            <span className="fb-agg__count">{count}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

// ── Sidebar filters ───────────────────────────────────────────────────────────
const TIER_META = {
  Master:   "#9b59b6",
  Expert:   "#d35400",
  Learner:  "#2a8fa0",
  Beginner: "rgba(120,140,160,0.9)",
};

const SidebarFilters = ({ starFilter, setStarFilter, tierFilter, setTierFilter, items }) => (
  <aside className="fb-sidebar">
    {/* Star filter */}
    <p className="fb-sidebar__head">Rating</p>
    <div className="fb-sidebar__list">
      <button
        className={`fb-sidebar__btn${starFilter === null ? " fb-sidebar__btn--on" : ""}`}
        onClick={() => setStarFilter(null)}>
        <span>All ratings</span>
        <span className="fb-sidebar__n">{items.length}</span>
      </button>
      {[5,4,3,2,1].map(star => {
        const count = items.filter(i => i.rating === star).length;
        return (
          <button key={star}
            className={`fb-sidebar__btn${starFilter === star ? " fb-sidebar__btn--on" : ""}`}
            onClick={() => setStarFilter(starFilter === star ? null : star)}>
            <div className="fb-sidebar__bar-wrap">
              <div className="fb-sidebar__bar"
                style={{ width: items.length ? `${(count/items.length)*100}%` : "0%" }} />
            </div>
            <Stars rating={star} size={11} />
            <span className="fb-sidebar__n">{count}</span>
          </button>
        );
      })}
    </div>

    <div className="fb-sidebar__div" />

    {/* Tier filter */}
    <p className="fb-sidebar__head">Tier</p>
    <div className="fb-sidebar__list">
      {["All", "Master", "Expert", "Learner", "Beginner"].map(tier => {
        const count = tier === "All" ? items.length : items.filter(i => i.tier === tier).length;
        const color = TIER_META[tier];
        const on    = tierFilter === tier;
        return (
          <button key={tier}
            className={`fb-sidebar__btn${on ? " fb-sidebar__btn--on" : ""}`}
            onClick={() => setTierFilter(tier)}
            style={on && tier !== "All" ? {
              color, borderColor: color + "50", background: color + "12",
            } : {}}>
            {tier !== "All" && <span className="fb-sidebar__dot" style={{ background: color }} />}
            <span>{tier}</span>
            <span className="fb-sidebar__n">{count}</span>
          </button>
        );
      })}
    </div>
  </aside>
);

// ── Page ──────────────────────────────────────────────────────────────────────
const SORTS = [
  { key: "recent",   label: "Recent" },
  { key: "top",      label: "Top rated" },
  { key: "critical", label: "Critical" },
  { key: "helpful",  label: "Most helpful" },
];

const FeedbackPage = () => {
  const { user }   = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [items,       setItems]       = useState([]);
  const [loading,     setLoading]     = useState(true);
  const [modalOpen,   setModalOpen]   = useState(false);
  const [ownReview,   setOwnReview]   = useState(null);
  const [sort,        setSort]        = useState("recent");
  const [starFilter,  setStarFilter]  = useState(null);
  const [tierFilter,  setTierFilter]  = useState("All");

  const loadFeedback = useCallback(async () => {
    const snap = await getDocs(
      query(collection(db, "feedback"), orderBy("createdAt", "desc"))
    );
    const data = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
    setItems(data);
    setOwnReview(data.find((i) => i.uid === user?.uid) || null);
    setLoading(false);
  }, [user?.uid]);

  useEffect(() => { loadFeedback(); }, [loadFeedback]);

  // ── Voting ──────────────────────────────────────────────────────────────────
  const handleVote = async (reviewUid, vote) => {
    if (!user) return;
    try {
      const ref = doc(db, "feedback", reviewUid);
      await runTransaction(db, async (tx) => {
        const snap = await tx.get(ref);
        if (!snap.exists()) return;
        const d      = snap.data();
        const voters = { ...(d.voters || {}) };
        const prev   = voters[user.uid];
        let yes = d.yesCount || 0;
        let no  = d.noCount  || 0;

        if (prev === vote) {
          delete voters[user.uid];
          if (vote === "yes") yes = Math.max(0, yes - 1);
          else                no  = Math.max(0, no  - 1);
        } else {
          if (prev === "yes") yes = Math.max(0, yes - 1);
          if (prev === "no")  no  = Math.max(0, no  - 1);
          voters[user.uid] = vote;
          if (vote === "yes") yes++;
          else                no++;
        }
        tx.update(ref, { voters, yesCount: yes, noCount: no });
      });
      await loadFeedback();
    } catch (err) {
      console.error("Vote error:", err);
    }
  };

  // ── Filter + sort ────────────────────────────────────────────────────────────
  const filtered = items.filter(item => {
    if (starFilter !== null && item.rating !== starFilter) return false;
    if (tierFilter !== "All" && item.tier !== tierFilter)   return false;
    return true;
  });

  const sorted = [...filtered].sort((a, b) => {
    if (a.uid === user?.uid) return -1;
    if (b.uid === user?.uid) return  1;
    if (sort === "top")      return b.rating - a.rating;
    if (sort === "critical") return a.rating - b.rating;
    if (sort === "helpful")  return (b.yesCount || 0) - (a.yesCount || 0);
    return 0; // recent: Firestore already descending
  });

  const hasFilters = starFilter !== null || tierFilter !== "All";
  const avg        = items.length ? items.reduce((s, i) => s + i.rating, 0) / items.length : 0;
  const highPct    = items.length ? Math.round((items.filter(i => i.rating >= 4).length / items.length) * 100) : 0;

  return (
    <div className="page-shell">
      <Header sidebarOpen={sidebarOpen} onToggleSidebar={() => setSidebarOpen(v => !v)} />
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <main className="page-main">
        <div className="fb-page">

          {/* ── Hero ─────────────────────────────────────────────────────────── */}
          <section className="fb-hero">
            <NetworkBg />
            <div className="fb-hero__inner">
              <div className="fb-hero__left">
                <nav className="fb-breadcrumb">
                  <Link to="/home" className="fb-breadcrumb__item">Home</Link>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                    <polyline points="9 18 15 12 9 6"/>
                  </svg>
                  <span className="fb-breadcrumb__item fb-breadcrumb__item--cur">Feedback</span>
                </nav>

                <div className="fb-hero__tag">
                  <span className="fb-hero__dot" />
                  Community Voice
                </div>

                <h1 className="fb-hero__title">What the students say.</h1>
                <p className="fb-hero__sub">
                  Honest reviews from people who use Axioma every day.
                  Your feedback shapes the platform.
                </p>

                {!loading && items.length > 0 && (
                  <div className="fb-hero__stats">
                    <div className="fb-hero__stat">
                      <strong>{avg.toFixed(1)}</strong>
                      <span>Avg rating</span>
                    </div>
                    <div className="fb-hero__sdiv" />
                    <div className="fb-hero__stat">
                      <strong>{items.length}</strong>
                      <span>Reviews</span>
                    </div>
                    <div className="fb-hero__sdiv" />
                    <div className="fb-hero__stat">
                      <strong>{highPct}%</strong>
                      <span>Rated 4★ or above</span>
                    </div>
                  </div>
                )}

                <button
                  className={`fb-hero__cta${ownReview ? " fb-hero__cta--edit" : ""}`}
                  onClick={() => setModalOpen(true)}>
                  {ownReview ? (
                    <>
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
                        stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4z"/>
                      </svg>
                      Edit my review
                    </>
                  ) : (
                    <>
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
                        stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                      </svg>
                      Leave a Review
                    </>
                  )}
                </button>
              </div>

              {!loading && items.length > 0 && (
                <div className="fb-hero__right">
                  <AggregateScore items={items} />
                </div>
              )}
            </div>
          </section>

          {/* ── Body: feed + sidebar ─────────────────────────────────────────── */}
          <div className="fb-body">
            <div className="fb-body__inner">

              {/* Feed */}
              <div className="fb-feed">
                {!loading && items.length > 0 && (
                  <div className="fb-toolbar">
                    <span className="fb-toolbar__count">
                      {sorted.length} of {items.length} review{items.length !== 1 ? "s" : ""}
                      {hasFilters && (
                        <button className="fb-toolbar__clear"
                          onClick={() => { setStarFilter(null); setTierFilter("All"); }}>
                          Clear filters ×
                        </button>
                      )}
                    </span>
                    <div className="fb-toolbar__sort">
                      <span className="fb-toolbar__sort-lbl">Sort:</span>
                      {SORTS.map(o => (
                        <button key={o.key}
                          className={`fb-toolbar__sort-btn${sort === o.key ? " fb-toolbar__sort-btn--on" : ""}`}
                          onClick={() => setSort(o.key)}>
                          {o.label}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {loading ? (
                  <div className="fb-skeletons">
                    {[1,2,3].map(i => <div key={i} className="fb-skeleton" />)}
                  </div>
                ) : items.length === 0 ? (
                  <div className="fb-empty">
                    <div className="fb-empty__icon">
                      <svg width="32" height="32" viewBox="0 0 24 24" fill="none"
                        stroke="currentColor" strokeWidth="1.3">
                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                      </svg>
                    </div>
                    <h3>No reviews yet</h3>
                    <p>Be the first to share your thoughts on Axioma.</p>
                    <button className="fb-hero__cta" onClick={() => setModalOpen(true)}>
                      Leave a Review
                    </button>
                  </div>
                ) : sorted.length === 0 ? (
                  <div className="fb-empty">
                    <div className="fb-empty__icon">
                      <svg width="32" height="32" viewBox="0 0 24 24" fill="none"
                        stroke="currentColor" strokeWidth="1.3">
                        <circle cx="11" cy="11" r="8"/>
                        <line x1="21" y1="21" x2="16.65" y2="16.65"/>
                      </svg>
                    </div>
                    <h3>No matching reviews</h3>
                    <p>Try adjusting the filters.</p>
                    <button className="fb-hero__cta"
                      onClick={() => { setStarFilter(null); setTierFilter("All"); }}>
                      Clear filters
                    </button>
                  </div>
                ) : (
                  <div className="fb-list">
                    {sorted.map(item => (
                      <FeedbackCard
                        key={item.id}
                        item={{ ...item, myVote: item.voters?.[user?.uid] }}
                        isOwn={item.uid === user?.uid}
                        onVote={handleVote}
                      />
                    ))}
                  </div>
                )}
              </div>

              {/* Sidebar */}
              {!loading && items.length > 0 && (
                <SidebarFilters
                  starFilter={starFilter} setStarFilter={setStarFilter}
                  tierFilter={tierFilter} setTierFilter={setTierFilter}
                  items={items}
                />
              )}
            </div>
          </div>
        </div>
      </main>

      {modalOpen && (
        <FeedbackModal
          onClose={() => setModalOpen(false)}
          onSubmitted={loadFeedback}
          existingReview={ownReview}
        />
      )}
    </div>
  );
};

export default FeedbackPage;