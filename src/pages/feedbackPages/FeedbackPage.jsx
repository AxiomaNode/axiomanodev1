// src/pages/feedbackPages/FeedbackPage.jsx
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  collection, doc, setDoc, getDocs,
  orderBy, query, serverTimestamp,
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
const LimitedTextarea = ({ label, labelColor, value, onChange, max, placeholder, required }) => (
  <div className="fb-field">
    <div className="fb-field__top">
      <label className="fb-field__label" style={{ color: labelColor }}>
        {label}{required && <span className="fb-field__req">*</span>}
      </label>
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

// ── Card ──────────────────────────────────────────────────────────────────────
const FeedbackCard = ({ item, isOwn }) => (
  <div className={`fb-card${isOwn ? " fb-card--own" : ""}`}>
    <div className="fb-card__head">
      <Link to={`/profile/${item.uid}`} className="fb-card__avatar-link">
        <div className="fb-card__avatar">{initials(item.displayName)}</div>
      </Link>
      <div className="fb-card__meta">
        <div className="fb-card__name-row">
          <Link to={`/profile/${item.uid}`} className="fb-card__name-link">
            <span className="fb-card__name">{item.displayName}</span>
          </Link>
          {isOwn && <span className="fb-card__you">you</span>}
          <span className="fb-card__tier" style={{
            color: item.tierColor,
            borderColor: item.tierColor + "35",
            background:  item.tierColor + "0e",
          }}>
            {item.tier}
          </span>
        </div>
        <div className="fb-card__bottom-row">
          <Stars rating={item.rating} size={12} />
          <span className="fb-card__date">{formatDate(item.createdAt)}</span>
        </div>
      </div>
    </div>

    {(item.strongSides || item.weakSides || item.comment) && (
      <div className="fb-card__body">
        {item.strongSides && (
          <div className="fb-card__section fb-card__section--strong">
            <span className="fb-card__section-label">Strong</span>
            <p>{item.strongSides}</p>
          </div>
        )}
        {item.weakSides && (
          <div className="fb-card__section fb-card__section--weak">
            <span className="fb-card__section-label">Weak</span>
            <p>{item.weakSides}</p>
          </div>
        )}
        {item.comment && (
          <div className="fb-card__section">
            <span className="fb-card__section-label">Comment</span>
            <p>{item.comment}</p>
          </div>
        )}
      </div>
    )}
  </div>
);

// ── Aggregate score ───────────────────────────────────────────────────────────
const AggregateScore = ({ items }) => {
  if (!items.length) return null;
  const avg  = items.reduce((s, i) => s + i.rating, 0) / items.length;
  const dist = [5, 4, 3, 2, 1].map((star) => ({
    star,
    count: items.filter((i) => i.rating === star).length,
    pct:   Math.round((items.filter((i) => i.rating === star).length / items.length) * 100),
  }));
  return (
    <div className="fb-aggregate">
      <div className="fb-aggregate__score">
        <strong className="fb-aggregate__num">{avg.toFixed(1)}</strong>
        <Stars rating={Math.round(avg)} size={14} />
        <span className="fb-aggregate__count">{items.length} review{items.length !== 1 ? "s" : ""}</span>
      </div>
      <div className="fb-aggregate__bars">
        {dist.map(({ star, count, pct }) => (
          <div key={star} className="fb-aggregate__bar-row">
            <span className="fb-aggregate__bar-label">{star}</span>
            <div className="fb-aggregate__bar-track">
              <div className="fb-aggregate__bar-fill" style={{ width: `${pct}%` }} />
            </div>
            <span className="fb-aggregate__bar-count">{count}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

// ── Page ──────────────────────────────────────────────────────────────────────
const SORT_OPTIONS = [
  { key: "recent",  label: "Recent" },
  { key: "top",     label: "Top" },
  { key: "critical",label: "Critical" },
];

const FeedbackPage = () => {
  const { user }   = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [items,       setItems]       = useState([]);
  const [loading,     setLoading]     = useState(true);
  const [modalOpen,   setModalOpen]   = useState(false);
  const [ownReview,   setOwnReview]   = useState(null);
  const [sort,        setSort]        = useState("recent");

  const loadFeedback = async () => {
    const snap = await getDocs(
      query(collection(db, "feedback"), orderBy("createdAt", "desc"))
    );
    const data = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
    setItems(data);
    setOwnReview(data.find((i) => i.uid === user?.uid) || null);
    setLoading(false);
  };

  useEffect(() => { loadFeedback(); }, [user?.uid]);

  const sorted = [...items].sort((a, b) => {
    if (a.uid === user?.uid) return -1;
    if (b.uid === user?.uid) return  1;
    if (sort === "top")      return b.rating - a.rating;
    if (sort === "critical") return a.rating - b.rating;
    return 0;
  });

  return (
    <div className="page-shell">
      <Header sidebarOpen={sidebarOpen} onToggleSidebar={() => setSidebarOpen(v => !v)} />
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <main className="page-main">
        <div className="fb-page">

          {/* Hero band */}
          <div className="fb-hero-band">
            <div className="fb-hero-inner">
              <div className="fb-hero__left">
                <nav className="fb-breadcrumb">
                  <Link to="/home" className="fb-breadcrumb__item">Home</Link>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                    <polyline points="9 18 15 12 9 6"/>
                  </svg>
                  <span className="fb-breadcrumb__item fb-breadcrumb__item--active">Feedback</span>
                </nav>

                <div className="fb-hero__eyebrow">
                  <span className="fb-hero__eyebrow-dot" />
                  Community Voice
                </div>
                <h1 className="fb-hero__title">What the students say.</h1>
                <p className="fb-hero__sub">
                  Honest reviews from people who use Axioma every day.
                  Your feedback shapes the platform.
                </p>

                <button
                  className={`fb-cta${ownReview ? " fb-cta--edit" : ""}`}
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

              {!loading && items.length > 0 && <AggregateScore items={items} />}
            </div>
          </div>

          {/* Feed */}
          <div className="fb-feed">
            {!loading && items.length > 0 && (
              <div className="fb-toolbar">
                <span className="fb-toolbar__count">
                  {items.length} review{items.length !== 1 ? "s" : ""}
                </span>
                <div className="fb-toolbar__sort">
                  <span className="fb-toolbar__sort-label">Sort:</span>
                  {SORT_OPTIONS.map((o) => (
                    <button key={o.key}
                      className={`fb-toolbar__sort-btn ${sort === o.key ? "fb-toolbar__sort-btn--active" : ""}`}
                      onClick={() => setSort(o.key)}>
                      {o.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {loading ? (
              <div className="fb-grid">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="fb-card fb-card--skeleton" />
                ))}
              </div>
            ) : items.length === 0 ? (
              <div className="fb-empty">
                <div className="fb-empty__icon">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" strokeWidth="1.3">
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                  </svg>
                </div>
                <h3>No reviews yet</h3>
                <p>Be the first to share your thoughts on Axioma.</p>
                <button className="fb-cta" onClick={() => setModalOpen(true)}>
                  Leave a Review
                </button>
              </div>
            ) : (
              <div className="fb-grid">
                {sorted.map((item) => (
                  <FeedbackCard key={item.id} item={item} isOwn={item.uid === user?.uid} />
                ))}
              </div>
            )}
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