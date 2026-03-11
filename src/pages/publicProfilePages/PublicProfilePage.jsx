// src/pages/publicProfilePages/PublicProfilePage.jsx
//
// Route: /profile/:uid
// Shows a read-only public snapshot of any user:
//   avatar (initials), name, tier, XP bar, level, join date,
//   sessions total, avg diagnostic score, and their Feedback review.

import { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { doc, getDoc, collection, getDocs, query, orderBy } from "firebase/firestore";
import { db } from "../../firebase/firebaseConfig";
import { useAuth } from "../../context/AuthContext";
import Header from "../../components/layout/Header";
import Sidebar from "../../components/layout/Sidebar";
import "./publicProfile.css";
import "../../styles/layout.css";

// ── Constants / helpers ───────────────────────────────────────────────────────
const XP_PER_LEVEL = 200;
const getLevel    = (xp) => Math.floor((xp || 0) / XP_PER_LEVEL) + 1;
const getLevelXp  = (xp) => (xp || 0) % XP_PER_LEVEL;
const getLevelPct = (xp) => Math.round((getLevelXp(xp) / XP_PER_LEVEL) * 100);

const getTier = (level) => {
  if (level >= 20) return { label: "Master",  color: "#9b59b6" };
  if (level >= 10) return { label: "Expert",  color: "#d35400" };
  if (level >= 5)  return { label: "Learner", color: "#2a8fa0" };
  return               { label: "Beginner", color: "rgba(120,140,160,0.9)" };
};

const initials = (name) =>
  (name || "?").split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase();

const formatJoinDate = (str) => {
  if (!str) return "Unknown";
  const d = new Date(str);
  return d.toLocaleDateString("en-GB", { month: "long", year: "numeric" });
};

const formatReviewDate = (ts) => {
  if (!ts) return "";
  const d = ts.toDate ? ts.toDate() : new Date(ts);
  return d.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
};

const scoreColor = (p) => (p >= 70 ? "#27ae60" : p >= 40 ? "#d35400" : "#c0392b");

// ── Stars ─────────────────────────────────────────────────────────────────────
const Stars = ({ rating, size = 15 }) => (
  <div className="pub-stars">
    {[1, 2, 3, 4, 5].map((n) => (
      <svg key={n} width={size} height={size} viewBox="0 0 24 24"
        className={`pub-star ${n <= rating ? "pub-star--on" : "pub-star--off"}`}>
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"
          strokeWidth="1.5" strokeLinejoin="round"/>
      </svg>
    ))}
  </div>
);

// ── Page ──────────────────────────────────────────────────────────────────────
const PublicProfilePage = () => {
  const { uid }   = useParams();
  const { user }  = useAuth();
  const navigate  = useNavigate();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading,     setLoading]     = useState(true);
  const [profile,     setProfile]     = useState(null);     // users/{uid} doc
  const [review,      setReview]      = useState(null);     // feedback/{uid} doc
  const [diagCount,   setDiagCount]   = useState(0);
  const [practCount,  setPractCount]  = useState(0);
  const [avgScore,    setAvgScore]    = useState(null);
  const [notFound,    setNotFound]    = useState(false);

  // If the viewer is looking at their own profile, redirect to full profile
  useEffect(() => {
    if (user && uid === user.uid) {
      navigate("/profile", { replace: true });
    }
  }, [uid, user]);

  useEffect(() => {
    if (!uid) return;

    const load = async () => {
      try {
        // 1. User doc
        const profSnap = await getDoc(doc(db, "users", uid));
        if (!profSnap.exists()) { setNotFound(true); setLoading(false); return; }
        setProfile(profSnap.data());

        // 2. Feedback / review
        const revSnap = await getDoc(doc(db, "feedback", uid));
        if (revSnap.exists()) setReview(revSnap.data());

        // 3. Diagnostic sessions (for count + avg score)
        const diagQ = query(
          collection(db, "users", uid, "diagnostic_sessions"),
          orderBy("date", "desc")
        );
        const diagSnap = await getDocs(diagQ);
        const diags = diagSnap.docs.map((d) => d.data());
        setDiagCount(diags.length);

        if (diags.length > 0) {
          const avg = Math.round(
            diags.reduce((s, d) => {
              const total = d.score?.total || 1;
              const correct = d.score?.correct ?? 0;
              return s + (correct / total) * 100;
            }, 0) / diags.length
          );
          setAvgScore(avg);
        }

        // 4. Practice sessions (for count)
        const practQ = query(
          collection(db, "users", uid, "practice_sessions"),
          orderBy("date", "desc")
        );
        const practSnap = await getDocs(practQ);
        setPractCount(practSnap.docs.length);

      } catch (err) {
        console.error("PublicProfile load error:", err);
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [uid]);

  // ── Derived ──
  const xp       = profile?.ratingPoints || 0;
  const level    = getLevel(xp);
  const levelXp  = getLevelXp(xp);
  const levelPct = getLevelPct(xp);
  const tier     = getTier(level);
  const totalSessions = diagCount + practCount;
  const displayName   = profile?.displayName || "Unknown";

  return (
    <div className="page-shell">
      <Header sidebarOpen={sidebarOpen} onToggleSidebar={() => setSidebarOpen(v => !v)} />
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <main className="page-main">
        <div className="pub-page">

          {/* Breadcrumb */}
          <nav className="pub-breadcrumb" aria-label="breadcrumb">
            <Link to="/home" className="pub-breadcrumb__item">Home</Link>
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <polyline points="9 18 15 12 9 6"/>
            </svg>
            <Link to="/feedback" className="pub-breadcrumb__item">Feedback</Link>
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <polyline points="9 18 15 12 9 6"/>
            </svg>
            <span className="pub-breadcrumb__item pub-breadcrumb__item--active">
              {loading ? "…" : displayName}
            </span>
          </nav>

          {/* ── Loading ── */}
          {loading && (
            <div className="pub-loading">
              <div className="pub-loading__ring" />
              <span>Loading profile…</span>
            </div>
          )}

          {/* ── Not found ── */}
          {!loading && notFound && (
            <div className="pub-not-found">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none"
                stroke="var(--border)" strokeWidth="1.2" strokeLinecap="round">
                <circle cx="12" cy="8" r="4"/>
                <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>
              </svg>
              <h3>Profile not found</h3>
              <p>This user doesn't exist or may have been removed.</p>
              <Link to="/feedback" style={{
                marginTop: 8, fontSize: "0.8rem",
                color: "var(--teal)", fontFamily: "'Courier New', monospace"
              }}>← Back to Feedback</Link>
            </div>
          )}

          {/* ── Profile card ── */}
          {!loading && !notFound && profile && (
            <>
              <div className="pub-card">
                <div className="pub-card__stripe" />
                <div className="pub-card__body">

                  {/* Identity */}
                  <div className="pub-identity">
                    <div className="pub-avatar-wrap">
                      <div className="pub-avatar">{initials(displayName)}</div>
                      <div className="pub-avatar__lvl">{level}</div>
                    </div>
                    <div className="pub-identity__info">
                      <div className="pub-name-row">
                        <h1 className="pub-name">{displayName}</h1>
                        <span className="pub-tier"
                          style={{
                            color: tier.color,
                            borderColor: tier.color + "35",
                            background: tier.color + "12",
                          }}>
                          {tier.label}
                        </span>
                      </div>
                      <span className="pub-join">
                        Joined {formatJoinDate(profile.createdAt)}
                      </span>
                    </div>
                  </div>

                  {/* XP bar */}
                  <div className="pub-xp">
                    <div className="pub-xp__track">
                      <div className="pub-xp__fill" style={{ width: `${levelPct}%` }} />
                    </div>
                    <div className="pub-xp__meta">
                      <span className="pub-xp__label">
                        <svg width="9" height="9" viewBox="0 0 24 24" fill="currentColor">
                          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                        </svg>
                        {xp} XP total
                      </span>
                      <span className="pub-xp__next">
                        {levelXp} / {XP_PER_LEVEL} → level {level + 1}
                      </span>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="pub-stats">
                    <div className="pub-stat">
                      <span className="pub-stat__val">{level}</span>
                      <span className="pub-stat__key">Level</span>
                    </div>
                    <div className="pub-stat">
                      <span className="pub-stat__val">{totalSessions}</span>
                      <span className="pub-stat__key">Sessions</span>
                    </div>
                    <div className="pub-stat">
                      <span className="pub-stat__val"
                        style={{ color: avgScore != null ? scoreColor(avgScore) : undefined }}>
                        {avgScore != null ? `${avgScore}%` : "—"}
                      </span>
                      <span className="pub-stat__key">Avg score</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* ── Their review ── */}
              <div className="pub-section-head">
                <div className="pub-section-head__line" />
                <span className="pub-section-head__text">Their review</span>
                <div className="pub-section-head__line" />
              </div>

              {review ? (
                <div className="pub-review">
                  <div className="pub-review__stars-row">
                    <Stars rating={review.rating} size={15} />
                    <span className="pub-review__date">{formatReviewDate(review.createdAt)}</span>
                  </div>
                  <div className="pub-review__sections">
                    {review.strongSides && (
                      <div className="pub-review__section">
                        <span className="pub-review__label pub-review__label--strong">Strong</span>
                        <p className="pub-review__text">{review.strongSides}</p>
                      </div>
                    )}
                    {review.weakSides && (
                      <div className="pub-review__section">
                        <span className="pub-review__label pub-review__label--weak">Weak</span>
                        <p className="pub-review__text">{review.weakSides}</p>
                      </div>
                    )}
                    {review.comment && (
                      <div className="pub-review__section">
                        <span className="pub-review__label">Comment</span>
                        <p className="pub-review__text">{review.comment}</p>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="pub-no-review">
                  This user hasn't left a review yet.
                </div>
              )}
            </>
          )}

        </div>
      </main>
    </div>
  );
};

export default PublicProfilePage;