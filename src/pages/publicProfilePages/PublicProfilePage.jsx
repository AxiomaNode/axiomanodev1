// src/pages/publicProfilePages/PublicProfilePage.jsx
import { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db }       from "../../firebase/firebaseConfig";
import { useAuth }  from "../../context/AuthContext";
import Header  from "../../components/layout/Header";
import Sidebar from "../../components/layout/Sidebar";
import { topics } from "../../data/topics";
import { MasterySeal } from "../../components/sections/CredentialsSection";
import "./public-profile.css";
import "../../styles/layout.css";

const XP_PER_LEVEL = 200;
const getLevel    = (xp) => Math.floor((xp || 0) / XP_PER_LEVEL) + 1;
const getLevelXp  = (xp) => (xp || 0) % XP_PER_LEVEL;
const getLevelPct = (xp) => Math.round((getLevelXp(xp) / XP_PER_LEVEL) * 100);

const getTier = (lvl) => {
  if (lvl >= 20) return { label: "Master",  color: "#9b59b6" };
  if (lvl >= 10) return { label: "Expert",  color: "#d35400" };
  if (lvl >= 5)  return { label: "Learner", color: "#2a8fa0" };
  return               { label: "Beginner", color: "rgba(120,140,160,0.9)" };
};

const initials = (name = "?") =>
  name.split(" ").map(w => w[0]).slice(0, 2).join("").toUpperCase();

  const normalizePhotoURL = (url) => {
    if (!url) return null;
    if (url.includes("googleusercontent.com")) {
      // Remove size param and request 200px — avoids expiry issues
      return url.split("=")[0] + "=s200-c";
    }
    return url;
  };

const formatJoin = (str) => {
  if (!str) return null;
  const d = new Date(str);
  return isNaN(d) ? null
    : d.toLocaleDateString("en-GB", { month: "long", year: "numeric" });
};

const formatReviewDate = (ts) => {
  if (!ts) return "";
  const d = ts.toDate ? ts.toDate() : new Date(ts);
  return d.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
};

const scoreColor = (p) => p >= 70 ? "#27ae60" : p >= 40 ? "#d35400" : "#c0392b";

const Stars = ({ rating, size = 14 }) => (
  <div className="pub-stars">
    {[1,2,3,4,5].map(n => (
      <svg key={n} width={size} height={size} viewBox="0 0 24 24"
        className={`pub-star ${n <= rating ? "pub-star--on" : "pub-star--off"}`}>
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"
          strokeWidth="1.5" strokeLinejoin="round"/>
      </svg>
    ))}
  </div>
);

const PublicMasteryCards = ({ masteryCards }) => {
  if (!masteryCards || Object.keys(masteryCards).length === 0) return null;
 
  const cards = Object.values(masteryCards);
 
  return (
    <div className="pub-credentials">
      <div className="pub-section-head">
        <div className="pub-section-head__line" />
        <span className="pub-section-head__text">Credentials</span>
        <div className="pub-section-head__line" />
      </div>
      <div className="pub-cred-list">
        {cards.map((card) => {
          const topicMeta = topics.find(t => t.id === card.topicId);
          return (
            <div key={card.topicId} className="pub-cred-card" style={{ "--card-color": card.titleColor }}>
              <div className="pub-cred-card__seal">
                <MasterySeal
                  title={card.title}
                  titleColor={card.titleColor}
                  topicIcon={topicMeta?.icon}
                  size={72}
                />
              </div>
              <div className="pub-cred-card__body">
                <div className="pub-cred-card__meta">
                  <span className="pub-cred-card__title" style={{ color: card.titleColor }}>
                    {card.title}
                  </span>
                  <span className="pub-cred-card__score">{card.score}%</span>
                </div>
                <p className="pub-cred-card__topic">{card.topicTitle}</p>
                {card.earnedAt && (
                  <span className="pub-cred-card__date">
                    {new Date(card.earnedAt).toLocaleDateString("en-GB", {
                      day: "numeric", month: "long", year: "numeric"
                    })}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const PublicProfilePage = () => {
 
  const { uid }  = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading,     setLoading]     = useState(true);
  const [notFound,    setNotFound]    = useState(false);
  const [profile,     setProfile]     = useState(null);
  const [review,      setReview]      = useState(null);

  useEffect(() => {
    if (user && uid === user.uid) navigate("/profile", { replace: true });
  }, [uid, user, navigate]);

  useEffect(() => {
    if (!uid) return;
    const load = async () => {
      setLoading(true);
      setNotFound(false);
      try {
        const profSnap = await getDoc(doc(db, "publicProfiles", uid));
        if (!profSnap.exists()) {
          // Fallback — build minimal profile from feedback doc
          const revSnap = await getDoc(doc(db, "feedback", uid));
          if (!revSnap.exists()) { setNotFound(true); setLoading(false); return; }
          const rev = revSnap.data();
          setProfile({
            displayName:  rev.displayName || "Unknown",
            photoURL:     rev.photoURL    || "",
            ratingPoints: 0,
            createdAt:    null,
            stats: { diagnosticsCompleted: 0, practiceCompleted: 0, avgScore: null },
          });
          setReview(rev);
          setLoading(false);
          return;
        }
        setProfile(profSnap.data());
        const revSnap = await getDoc(doc(db, "feedback", uid));
        if (revSnap.exists()) setReview(revSnap.data());
      } catch (err) {
        console.error("PublicProfile load error:", err);
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [uid]);

  const xp          = profile?.ratingPoints || 0;
  const level       = getLevel(xp);
  const levelXp     = getLevelXp(xp);
  const levelPct    = getLevelPct(xp);
  const tier        = getTier(level);
  const diagCount   = profile?.stats?.diagnosticsCompleted || 0;
  const practCount  = profile?.stats?.practiceCompleted    || 0;
  const avgScore    = profile?.stats?.avgScore             ?? null;
  const displayName = profile?.displayName || "Unknown";
  const joinDate    = formatJoin(profile?.createdAt);

  const stats = [
    { val: level,                                      label: "Level"       },
    { val: xp.toLocaleString(),                        label: "Total XP"    },
    { val: diagCount  || "—",                          label: "Diagnostics" },
    { val: practCount || "—",                          label: "Practice"    },
    { val: avgScore != null ? `${avgScore}%` : "—",   label: "Avg Score",
      color: avgScore != null ? scoreColor(avgScore) : undefined },
  ];

  return (
    <div className="page-shell">
      <Header sidebarOpen={sidebarOpen} onToggleSidebar={() => setSidebarOpen(v => !v)} />
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <main className="page-main">
        <div className="pub-page">

          {loading && (
            <div className="pub-loading">
              <div className="pub-loading__ring" />
              <span>Loading profile…</span>
            </div>
          )}

          {!loading && notFound && (
            <div className="pub-not-found">
              <svg width="52" height="52" viewBox="0 0 24 24" fill="none"
                stroke="var(--border)" strokeWidth="1.2" strokeLinecap="round">
                <circle cx="12" cy="8" r="4"/>
                <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>
              </svg>
              <h3>Profile not found</h3>
              <p>This user doesn't exist or has been removed.</p>
              <Link to="/feedback" className="pub-back">← Back to Feedback</Link>
            </div>
          )}

          {!loading && !notFound && profile && (
            <>
              {/* ── Hero ── */}
              <div className="pub-hero">
                <div className="pub-hero__accent" />

                <nav className="pub-breadcrumb">
                  <Link to="/home" className="pub-breadcrumb__item">Home</Link>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                    <polyline points="9 18 15 12 9 6"/>
                  </svg>
                  <Link to="/feedback" className="pub-breadcrumb__item">Feedback</Link>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                    <polyline points="9 18 15 12 9 6"/>
                  </svg>
                  <span className="pub-breadcrumb__item pub-breadcrumb__item--cur">{displayName}</span>
                </nav>

                <div className="pub-hero__body">
                  <div className="pub-av-wrap">
                    {normalizePhotoURL(profile.photoURL) ? (
                      <img src={normalizePhotoURL(profile.photoURL)} alt={displayName} className="pub-av pub-av--img" />
                    ) : (
                      <div className="pub-av">{initials(displayName)}</div>
                    )}
                    <div className="pub-av__lvl">{level}</div>
                  </div>

                  <div className="pub-identity">
                    <div className="pub-name-row">
                      <h1 className="pub-name">{displayName}</h1>
                      <span className="pub-tier" style={{
                        color: tier.color,
                        borderColor: tier.color + "35",
                        background:  tier.color + "0e",
                      }}>{tier.label}</span>
                    </div>

                    {joinDate && (
                      <p className="pub-join">
                        <svg width="11" height="11" viewBox="0 0 24 24" fill="none"
                          stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                          <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                          <line x1="16" y1="2" x2="16" y2="6"/>
                          <line x1="8"  y1="2" x2="8"  y2="6"/>
                          <line x1="3"  y1="10" x2="21" y2="10"/>
                        </svg>
                        Joined {joinDate}
                      </p>
                    )}

                    <div className="pub-xp">
                      <div className="pub-xp__bar-outer">
                        <div className="pub-xp__bar-inner" style={{ width: `${levelPct}%` }} />
                      </div>
                      <div className="pub-xp__meta">
                        <span className="pub-xp__total">
                          <svg width="9" height="9" viewBox="0 0 24 24" fill="currentColor">
                            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                          </svg>
                          {xp.toLocaleString()} xp
                        </span>
                        <span className="pub-xp__next">{levelXp} / {XP_PER_LEVEL} to level {level + 1}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* ── Stats ── */}
              <div className="pub-stats">
                {stats.map(({ val, label, color }) => (
                  <div key={label} className="pub-stat">
                    <span className="pub-stat__val" style={color ? { color } : undefined}>{val}</span>
                    <span className="pub-stat__key">{label}</span>
                  </div>
                ))}
              </div>

              <PublicMasteryCards masteryCards={profile.masteryCards} />

              {/* ── Review ── */}
              <div className="pub-section-head">
                <div className="pub-section-head__line" />
                <span className="pub-section-head__text">Their review</span>
                <div className="pub-section-head__line" />
              </div>

              {review ? (
                <div className="pub-review">
                  <div className="pub-review__accent" />

                  <div className="pub-review__top">
                    <Stars rating={review.rating} size={16} />
                    <span className="pub-review__rating-num">{review.rating}.0</span>
                    <span className="pub-review__date">{formatReviewDate(review.createdAt)}</span>
                  </div>

                  {(review.strongSides || review.weakSides || review.comment) && (
                    <div className="pub-review__sections">
                      {review.strongSides && (
                        <div className="pub-review__section">
                          <span className="pub-review__label pub-review__label--strong">
                            <svg width="9" height="9" viewBox="0 0 24 24" fill="currentColor">
                              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01z"/>
                            </svg>
                            Strong
                          </span>
                          <p className="pub-review__text">{review.strongSides}</p>
                        </div>
                      )}
                      {review.weakSides && (
                        <div className="pub-review__section">
                          <span className="pub-review__label pub-review__label--weak">
                            <svg width="9" height="9" viewBox="0 0 24 24" fill="none"
                              stroke="currentColor" strokeWidth="2.5">
                              <line x1="5" y1="12" x2="19" y2="12"/>
                            </svg>
                            Weak
                          </span>
                          <p className="pub-review__text">{review.weakSides}</p>
                        </div>
                      )}
                      {review.comment && (
                        <div className="pub-review__section">
                          <span className="pub-review__label">
                            <svg width="9" height="9" viewBox="0 0 24 24" fill="none"
                              stroke="currentColor" strokeWidth="2.5">
                              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                            </svg>
                            Comment
                          </span>
                          <p className="pub-review__text">{review.comment}</p>
                        </div>
                      )}
                    </div>
                  )}

                  {(review.yesCount > 0 || review.noCount > 0) && (
                    <div className="pub-review__votes">
                      <span className="pub-review__votes-label">Community found this</span>
                      {review.yesCount > 0 && (
                        <span className="pub-review__vote pub-review__vote--yes">
                          👍 {review.yesCount} helpful
                        </span>
                      )}
                      {review.noCount > 0 && (
                        <span className="pub-review__vote">
                          👎 {review.noCount}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              ) : (
                <div className="pub-no-review">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                  </svg>
                  This user hasn't left a review yet.
                </div>
              )}

              <Link to="/feedback" className="pub-back pub-back--bottom">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <line x1="19" y1="12" x2="5" y2="12"/>
                  <polyline points="12 19 5 12 12 5"/>
                </svg>
                All reviews
              </Link>
            </>
          )}
        </div>
      </main>
    </div>
  );
};

export default PublicProfilePage;