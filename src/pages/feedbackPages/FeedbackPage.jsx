// src/pages/feedbackPages/FeedbackPage.jsx
import { useState, useEffect, useCallback, useRef } from "react";
import { Link } from "react-router-dom";
import {
  collection, doc, setDoc, getDocs, deleteDoc,
  orderBy, query, serverTimestamp, runTransaction,
  updateDoc, increment,
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

// ── Grid background ───────────────────────────────────────────────────────────
const GridBg = () => <div className="fb-hero__grid" aria-hidden="true" />;

// ── Toast system ──────────────────────────────────────────────────────────────
const useToast = () => {
  const [toasts, setToasts] = useState([]);
  const addToast = useCallback((message, type = "success") => {
    const id = Date.now();
    setToasts((t) => [...t, { id, message, type }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3400);
  }, []);
  return { toasts, addToast };
};

const TOAST_ICONS = {
  success: (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  ),
  delete: (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
      <polyline points="3 6 5 6 21 6" />
      <path d="M19 6l-1 14H6L5 6" />
      <path d="M10 11v6M14 11v6M9 6V4h6v2" />
    </svg>
  ),
  error: (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="8" x2="12" y2="12" />
      <circle cx="12" cy="16" r="0.5" fill="currentColor" />
    </svg>
  ),
};

const ToastStack = ({ toasts }) => (
  <div className="fb-toasts" aria-live="polite">
    {toasts.map((t) => (
      <div key={t.id} className={`fb-toast fb-toast--${t.type}`}>
        <span className="fb-toast__icon">{TOAST_ICONS[t.type]}</span>
        <span>{t.message}</span>
      </div>
    ))}
  </div>
);

// ── Stars ─────────────────────────────────────────────────────────────────────
const Stars = ({ rating, size = 13 }) => (
  <div className="fb-stars">
    {[1, 2, 3, 4, 5].map((n) => (
      <svg key={n} width={size} height={size} viewBox="0 0 24 24"
        className={`fb-star ${n <= rating ? "fb-star--on" : "fb-star--off"}`}>
        <polygon
          points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"
          strokeWidth="1.5" strokeLinejoin="round"
        />
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
            onMouseEnter={() => setHover(n)} onMouseLeave={() => setHover(0)}
            onClick={() => onChange(n)} aria-label={`${n} star${n > 1 ? "s" : ""}`}>
            <svg viewBox="0 0 24 24" width="30" height="30">
              <polygon
                points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"
                strokeWidth="1.5" strokeLinejoin="round" />
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
const FeedbackModal = ({ onClose, onSubmitted, existingReview, addToast }) => {
  const { user } = useAuth();
  const [rating,      setRating]      = useState(existingReview?.rating      ?? 0);
  const [strongSides, setStrongSides] = useState(existingReview?.strongSides ?? "");
  const [weakSides,   setWeakSides]   = useState(existingReview?.weakSides   ?? "");
  const [comment,     setComment]     = useState(existingReview?.comment     ?? "");
  const [submitting,  setSubmitting]  = useState(false);
  const [error,       setError]       = useState("");

  const isEdit    = !!existingReview;
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
      const isNew = !existingReview;

      await setDoc(doc(db, "feedback", user.uid), {
        uid:         user.uid,
        // Prefer Firestore displayName (always up-to-date) over Auth displayName
        displayName: prof?.displayName || user.displayName || "Anonymous",
        tier:        tier.label,
        tierColor:   tier.color,
        rating,
        strongSides: strongSides.trim(),
        weakSides:   weakSides.trim(),
        comment:     comment.trim(),
        photoURL: user.photoURL || null,
        createdAt:   existingReview?.createdAt ?? serverTimestamp(),
        updatedAt:   serverTimestamp(),
        edited:      !isNew,
        yesCount:    existingReview?.yesCount ?? 0,
        noCount:     existingReview?.noCount  ?? 0,
        voters:      existingReview?.voters   ?? {},
      });

      if (isNew) {
        try {
          await updateDoc(doc(db, "users", user.uid), {
            "stats.feedbackSent": increment(1),
            updatedAt: serverTimestamp(),
          });
        } catch { /* non-critical */ }
      }

      addToast(isNew ? "Review submitted!" : "Review updated!");
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
            <h2 className="fb-modal__title">{isEdit ? "Edit Review" : "Leave a Review"}</h2>
          </div>
          <button className="fb-modal__close" onClick={onClose} aria-label="Close">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
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
              : isEdit ? "Update Review" : "Submit Review"
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
          <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3z" />
          <path d="M7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3" />
        </svg>
      ) : (
        <svg width="12" height="12" viewBox="0 0 24 24"
          fill={active ? "currentColor" : "none"} stroke="currentColor"
          strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M10 15v4a3 3 0 0 0 3 3l4-9V2H5.72a2 2 0 0 0-2 1.7l-1.38 9a2 2 0 0 0 2 2.3z" />
          <path d="M17 2h2.67A2.31 2.31 0 0 1 22 4v7a2.31 2.31 0 0 1-2.33 2H17" />
        </svg>
      )}
      <span>{vote === "yes" ? "Helpful" : "Not helpful"}</span>
      {count > 0 && <span className="fb-vote__count">{count}</span>}
    </button>
  );
};

// ── Floating action popup ─────────────────────────────────────────────────────
const CardPopup = ({ x, y, onEdit, onDelete, onClose }) => {
  const ref = useRef(null);

  const style = (() => {
    const pw = 170, ph = 96;
    const vw = window.innerWidth, vh = window.innerHeight;
    let left = x;
    let top  = y + 8;
    if (left + pw > vw - 8) left = x - pw;
    if (top  + ph > vh - 8) top  = y - ph - 8;
    if (top < 8) top = 8;
    return { left, top };
  })();

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) onClose();
    };
    const id = setTimeout(() => document.addEventListener("mousedown", handler), 0);
    return () => { clearTimeout(id); document.removeEventListener("mousedown", handler); };
  }, [onClose]);

  return (
    <div ref={ref} className="fb-popup" style={{ left: style.left, top: style.top }}>
      <button className="fb-popup__btn" onClick={() => { onClose(); onEdit(); }}>
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4z" />
        </svg>
        Edit review
      </button>
      <div className="fb-popup__div" />
      <button className="fb-popup__btn fb-popup__btn--danger" onClick={() => { onClose(); onDelete(); }}>
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
          <polyline points="3 6 5 6 21 6" />
          <path d="M19 6l-1 14H6L5 6" />
          <path d="M10 11v6M14 11v6M9 6V4h6v2" />
        </svg>
        Delete review
      </button>
    </div>
  );
};

// ── Delete confirm modal ──────────────────────────────────────────────────────
const DeleteConfirmModal = ({ onConfirm, onCancel, deleting }) => (
  <div className="fb-modal-backdrop" onClick={(e) => e.target === e.currentTarget && onCancel()}>
    <div className="fb-modal" style={{ maxWidth: 360 }}>
      <div className="fb-modal__accent" />
      <div className="fb-modal__header">
        <div>
          <p className="fb-modal__eyebrow">Confirm action</p>
          <h2 className="fb-modal__title">Delete your review?</h2>
        </div>
      </div>
      <div className="fb-modal__body">
        <p style={{ fontSize: "0.85rem", color: "var(--text-mid)", fontFamily: "-apple-system, sans-serif", margin: 0 }}>
          This action cannot be undone.
        </p>
      </div>
      <div className="fb-modal__footer">
        <button className="fb-btn fb-btn--ghost" onClick={onCancel} disabled={deleting}>Cancel</button>
        <button
          className="fb-btn"
          style={{ background: "#c0392b", color: "#fff", borderColor: "#c0392b" }}
          onClick={onConfirm}
          disabled={deleting}
        >
          {deleting ? <><span className="fb-spinner" /> Deleting…</> : "Yes, delete"}
        </button>
      </div>
    </div>
  </div>
);

const FeedbackAvatar = ({ name, photoURL }) => {
  if (photoURL) {
    return (
      <img
        src={photoURL}
        alt={name}
        className="fb-card__av fb-card__av--photo"
      />
    );
  }
  return <div className="fb-card__av">{initials(name)}</div>;
};

// ── Card ──────────────────────────────────────────────────────────────────────
const FeedbackCard = ({ item, isOwn, onEdit, onDelete, onVote }) => {
  const [popup,      setPopup]      = useState(null);
  const [confirmDel, setConfirmDel] = useState(false);
  const [deleting,   setDeleting]   = useState(false);

  const handleClick = (e) => {
    if (!isOwn) return;
    if (e.target.closest("a, button")) return;
    e.stopPropagation();
    setPopup(popup ? null : { x: e.clientX, y: e.clientY });
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await onDelete();
      setConfirmDel(false);
    } catch {
      setDeleting(false);
      setConfirmDel(false);
    }
  };

  return (
    <>
      <div
        className={[
          "fb-card",
          isOwn         ? "fb-card--own"      : "",
          popup         ? "fb-card--active"   : "",
          item.removing ? "fb-card--removing" : "",
        ].filter(Boolean).join(" ")}
        onClick={handleClick}
      >
        {isOwn && <div className="fb-card__stripe" />}

        <div className="fb-card__head">
          <Link to={`/profile/${item.uid}`} className="fb-card__av-link" tabIndex={-1}>
            <FeedbackAvatar name={item.displayName} photoURL={item.photoURL} />
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
              {item.edited && <span className="fb-card__edited">edited</span>}
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
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01z" />
                  </svg>
                  Strong
                </span>
                <p>{item.strongSides}</p>
              </div>
            )}
            {item.weakSides && (
              <div className="fb-card__section fb-card__section--weak">
                <span className="fb-card__slabel">
                  <svg width="9" height="9" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" strokeWidth="2.5">
                    <line x1="5" y1="12" x2="19" y2="12" />
                  </svg>
                  Weak
                </span>
                <p>{item.weakSides}</p>
              </div>
            )}
            {item.comment && (
              <div className="fb-card__section">
                <span className="fb-card__slabel">
                  <svg width="9" height="9" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" strokeWidth="2.5">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
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
          <VoteBtn vote="yes" count={item.yesCount || 0} myVote={item.myVote}
            onVote={(v) => onVote(item.uid, v)} disabled={isOwn} />
          <VoteBtn vote="no"  count={item.noCount  || 0} myVote={item.myVote}
            onVote={(v) => onVote(item.uid, v)} disabled={isOwn} />
        </div>
      </div>

      {popup && (
        <CardPopup
          x={popup.x}
          y={popup.y}
          onClose={() => setPopup(null)}
          onEdit={onEdit}
          onDelete={() => setConfirmDel(true)}
        />
      )}

      {confirmDel && (
        <DeleteConfirmModal
          onConfirm={handleDelete}
          onCancel={() => setConfirmDel(false)}
          deleting={deleting}
        />
      )}
    </>
  );
};

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
    <p className="fb-sidebar__head">Rating</p>
    <div className="fb-sidebar__list">
      <button
        className={`fb-sidebar__btn${starFilter === null ? " fb-sidebar__btn--on" : ""}`}
        onClick={() => setStarFilter(null)}>
        <span>All ratings</span>
        <span className="fb-sidebar__n">{items.length}</span>
      </button>
      {[5, 4, 3, 2, 1].map((star) => {
        const count = items.filter((i) => i.rating === star).length;
        return (
          <button key={star}
            className={`fb-sidebar__btn${starFilter === star ? " fb-sidebar__btn--on" : ""}`}
            onClick={() => setStarFilter(starFilter === star ? null : star)}>
            <div className="fb-sidebar__bar-wrap">
              <div className="fb-sidebar__bar"
                style={{ width: items.length ? `${(count / items.length) * 100}%` : "0%" }} />
            </div>
            <Stars rating={star} size={11} />
            <span className="fb-sidebar__n">{count}</span>
          </button>
        );
      })}
    </div>
    <div className="fb-sidebar__div" />
    <p className="fb-sidebar__head">Tier</p>
    <div className="fb-sidebar__list">
      {["All", "Master", "Expert", "Learner", "Beginner"].map((tier) => {
        const count = tier === "All" ? items.length : items.filter((i) => i.tier === tier).length;
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
  { key: "recent",   label: "Recent"       },
  { key: "top",      label: "Top rated"    },
  { key: "critical", label: "Critical"     },
  { key: "helpful",  label: "Most helpful" },
];

const FeedbackPage = () => {
  const { user }             = useAuth();
  const { toasts, addToast } = useToast();

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
  const data = await Promise.all(
    snap.docs.map(async (d) => {
      const item = { id: d.id, ...d.data() };
      try {
        const prof = await getUserProfile(item.uid);
        if (prof?.photoURL) item.photoURL = prof.photoURL;
        if (prof?.displayName) item.displayName = prof.displayName;
      } catch { /* non-critical */ }
      return item;
    })
  );
  setItems(data);
  setOwnReview(data.find((i) => i.uid === user?.uid) || null);
  setLoading(false);
}, [user?.uid]);

  useEffect(() => { loadFeedback(); }, [loadFeedback]);

  const handleDelete = async () => {
    await deleteDoc(doc(db, "feedback", user.uid));
    setItems((prev) => prev.map((i) => (i.uid === user.uid ? { ...i, removing: true } : i)));
    setTimeout(() => {
      setItems((prev) => prev.filter((i) => i.uid !== user.uid));
      setOwnReview(null);
    }, 340);
    try {
      await updateDoc(doc(db, "users", user.uid), {
        "stats.feedbackSent": increment(-1),
        updatedAt: serverTimestamp(),
      });
    } catch { /* non-critical */ }
    addToast("Review deleted", "delete");
  };

  const handleVote = async (reviewUid, vote) => {
    if (!user) return;
    setItems((prev) => prev.map((item) => {
      if (item.uid !== reviewUid) return item;
      const voters   = { ...(item.voters || {}) };
      const prevVote = voters[user.uid];
      let yes = item.yesCount || 0;
      let no  = item.noCount  || 0;
      if (prevVote === vote) {
        delete voters[user.uid];
        if (vote === "yes") yes = Math.max(0, yes - 1);
        else                no  = Math.max(0, no  - 1);
      } else {
        if (prevVote === "yes") yes = Math.max(0, yes - 1);
        if (prevVote === "no")  no  = Math.max(0, no  - 1);
        voters[user.uid] = vote;
        if (vote === "yes") yes++;
        else                no++;
      }
      return { ...item, voters, yesCount: yes, noCount: no };
    }));
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
    } catch (err) {
      console.error("Vote error:", err);
      await loadFeedback();
    }
  };

  const filtered = items.filter((item) => {
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
    return 0;
  });

  const hasFilters = starFilter !== null || tierFilter !== "All";
  const avg        = items.length ? items.reduce((s, i) => s + i.rating, 0) / items.length : 0;
  const highPct    = items.length
    ? Math.round((items.filter((i) => i.rating >= 4).length / items.length) * 100) : 0;

  return (
    <div className="page-shell">
      <Header sidebarOpen={sidebarOpen} onToggleSidebar={() => setSidebarOpen((v) => !v)} />
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <main className="page-main">
        <div className="fb-page">

          <section className="fb-hero">
            <GridBg />
            <div className="fb-hero__inner">
              <div className="fb-hero__left">
                <nav className="fb-breadcrumb">
                  <Link to="/home" className="fb-breadcrumb__item">Home</Link>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                    <polyline points="9 18 15 12 9 6" />
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
                {!loading && !ownReview && (
                  <button className="fb-hero__cta" onClick={() => setModalOpen(true)}>
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
                      stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                    </svg>
                    Leave a Review
                  </button>
                )}
              </div>
              {!loading && items.length > 0 && (
                <div className="fb-hero__right">
                  <AggregateScore items={items} />
                </div>
              )}
            </div>
          </section>

          <div className="fb-body">
            <div className="fb-body__inner">
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
                      {SORTS.map((o) => (
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
                    {[1, 2, 3].map((i) => <div key={i} className="fb-skeleton" />)}
                  </div>
                ) : items.length === 0 ? (
                  <div className="fb-empty">
                    <div className="fb-empty__icon">
                      <svg width="28" height="28" viewBox="0 0 24 24" fill="none"
                        stroke="currentColor" strokeWidth="1.3">
                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
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
                      <svg width="28" height="28" viewBox="0 0 24 24" fill="none"
                        stroke="currentColor" strokeWidth="1.3">
                        <circle cx="11" cy="11" r="8" />
                        <line x1="21" y1="21" x2="16.65" y2="16.65" />
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
                    {sorted.map((item) => (
                      <FeedbackCard
                        key={item.id}
                        item={{ ...item, myVote: item.voters?.[user?.uid] }}
                        isOwn={item.uid === user?.uid}
                        onEdit={() => setModalOpen(true)}
                        onDelete={handleDelete}
                        onVote={handleVote}
                      />
                    ))}
                  </div>
                )}
              </div>

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
          addToast={addToast}
        />
      )}

      <ToastStack toasts={toasts} />
    </div>
  );
};

export default FeedbackPage;