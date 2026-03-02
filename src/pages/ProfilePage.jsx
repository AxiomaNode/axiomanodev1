// src/pages/ProfilePage.jsx
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Header from "../components/layout/Header";
import Sidebar from "../components/layout/Sidebar";
import { getPractice, getDiagnostics } from "../services/db";
import { getUserProfile } from "../firebase/auth";
import ProgressSection from "../components/sections/ProgressSection";
import ResultsSection  from "../components/sections/ResultsSection";
import "../styles/profile.css";
import "../styles/progress.css";
import "../styles/results.css";
import "../styles/layout.css";

// ── XP / levelling helpers ────────────────────────────────────────────────────
const XP_PER_LEVEL = 200;
const getLevel    = (xp) => Math.floor((xp || 0) / XP_PER_LEVEL) + 1;
const getLevelXp  = (xp) => (xp || 0) % XP_PER_LEVEL;
const getLevelPct = (xp) => Math.round((getLevelXp(xp) / XP_PER_LEVEL) * 100);

const getTier = (level) => {
  if (level >= 20) return { label: "Master",   color: "#9b59b6" };
  if (level >= 10) return { label: "Expert",   color: "#d35400" };
  if (level >= 5)  return { label: "Learner",  color: "#2a8fa0" };
  return              { label: "Beginner", color: "#7f8c8d" };
};

// ── Avatar ────────────────────────────────────────────────────────────────────
const Avatar = ({ name, photoURL, size = 72 }) => {
  const initials = (name || "?")
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  if (photoURL) {
    return (
      <img
        src={photoURL}
        alt={name}
        className="profile-avatar__img"
        style={{ width: size, height: size, borderRadius: "50%" }}
      />
    );
  }
  return (
    <div className="profile-avatar__initials" style={{ width: size, height: size, fontSize: size * 0.36 }}>
      {initials}
    </div>
  );
};

// ── Profile Hero Card ─────────────────────────────────────────────────────────
const ProfileHeroCard = ({ user, profile, diagnostics, practice }) => {
  const xp       = profile?.ratingPoints || 0;
  const level    = getLevel(xp);
  const levelXp  = getLevelXp(xp);
  const levelPct = getLevelPct(xp);
  const tier     = getTier(level);

  const totalSessions = diagnostics.length + practice.length;
  const totalGaps     = diagnostics.reduce((s, d) => s + (d.gaps?.length || 0), 0);
  const avgScore      = diagnostics.length
    ? Math.round(diagnostics.reduce((s, d) => s + (d.score.correct / d.score.total) * 100, 0) / diagnostics.length)
    : null;

  const scoreCol = (pct) => (pct >= 70 ? "#27ae60" : pct >= 40 ? "#d35400" : "#c0392b");

  return (
    <div className="profile-hero">
      {/* Left: avatar + identity + XP */}
      <div className="profile-hero__left">
        <div className="profile-avatar-wrap">
          <Avatar name={user?.displayName} photoURL={user?.photoURL} size={72} />
          <div className="profile-avatar__lvl">{level}</div>
        </div>

        <div className="profile-hero__identity">
          <div className="profile-hero__name-row">
            <h1 className="profile-hero__name">{user?.displayName || "Anonymous"}</h1>
            <span
              className="profile-hero__tier"
              style={{ color: tier.color, borderColor: tier.color + "40", background: tier.color + "12" }}
            >
              {tier.label}
            </span>
          </div>
          <p className="profile-hero__email">{user?.email}</p>

          {/* XP bar */}
          <div className="profile-xp">
            <div className="profile-xp__bar-outer">
              <div className="profile-xp__bar-inner" style={{ width: `${levelPct}%` }} />
            </div>
            <div className="profile-xp__meta">
              <span className="profile-xp__total">
                <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor">
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                </svg>
                {xp} XP
              </span>
              <span className="profile-xp__next">{levelXp} / {XP_PER_LEVEL} → lvl {level + 1}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right: quick stats pill */}
      <div className="profile-hero__stats">
        <div className="profile-hero__stat">
          <strong>{totalSessions}</strong>
          <span>Sessions</span>
        </div>
        <div className="profile-hero__stat-sep" />
        <div className="profile-hero__stat">
          <strong style={{ color: avgScore != null ? scoreCol(avgScore) : undefined }}>
            {avgScore != null ? `${avgScore}%` : "—"}
          </strong>
          <span>Avg score</span>
        </div>
        <div className="profile-hero__stat-sep" />
        <div className="profile-hero__stat">
          <strong style={{ color: totalGaps > 0 ? "#d35400" : undefined }}>{totalGaps}</strong>
          <span>Gaps</span>
        </div>
        <div className="profile-hero__stat-sep" />
        <div className="profile-hero__stat">
          <strong>{profile?.stats?.diagnosticsCompleted ?? diagnostics.length}</strong>
          <span>Diagnostics</span>
        </div>
      </div>
    </div>
  );
};

// ── ProfilePage ───────────────────────────────────────────────────────────────

const ProfilePage = () => {
  const { user } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("progress");

  const [diagnostics, setDiagnostics] = useState([]);
  const [practice,    setPractice]    = useState([]);
  const [profile,     setProfile]     = useState(null);
  const [loading,     setLoading]     = useState(true);

  // When user clicks a diagnostic row in ProgressSection → jump to that index in ResultsSection
  
  const [resultIdx, setResultIdx] = useState(0);

  useEffect(() => {
    if (!user) return;
    Promise.all([
      getDiagnostics(user.uid),
      getPractice(user.uid),
      getUserProfile(user.uid),
    ]).then(([diags, pracs, prof]) => {
      setDiagnostics(diags);
      setPractice(pracs);
      setProfile(prof);
      setLoading(false);
    });
  }, [user]);

  const handleDiagnosticClick = (idx) => {
    setResultIdx(idx);
    setActiveTab("results");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const TABS = [
    { id: "progress", label: "Progress" },
    { id: "results",  label: "Results",  badge: diagnostics.length || null },
  ];

  return (
    <div className="page-shell">
      <Header sidebarOpen={sidebarOpen} onToggleSidebar={() => setSidebarOpen((v) => !v)} />
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <main className="page-main">
        <div className="profile-page">

          {/* Breadcrumb */}
          <nav className="profile-breadcrumb" aria-label="breadcrumb">
            <Link to="/home" className="profile-breadcrumb__item">Home</Link>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <polyline points="9 18 15 12 9 6" />
            </svg>
            <span className="profile-breadcrumb__item profile-breadcrumb__item--active">Profile</span>
          </nav>

          {loading ? (
            <div className="profile-loading">
              <div className="profile-loading__ring" />
              <p>Loading profile…</p>
            </div>
          ) : (
            <>
              {/* ── Hero ── */}
              <ProfileHeroCard
                user={user}
                profile={profile}
                diagnostics={diagnostics}
                practice={practice}
              />

              {/* ── Tabs ── */}
              <div className="profile-tabs" role="tablist">
                {TABS.map((t) => (
                  <button
                    key={t.id}
                    role="tab"
                    aria-selected={activeTab === t.id}
                    className={`profile-tab ${activeTab === t.id ? "profile-tab--active" : ""}`}
                    onClick={() => setActiveTab(t.id)}
                  >
                    {t.label}
                    {t.badge > 0 && (
                      <span className="profile-tab__badge">{t.badge}</span>
                    )}
                  </button>
                ))}
              </div>

              {/* ── Section container ── */}
              <div className="profile-section" role="tabpanel">
                {activeTab === "progress" && (
                  <ProgressSection
                    diagnostics={diagnostics}
                    practice={practice}
                    onDiagnosticClick={handleDiagnosticClick}
                  />
                )}
                {activeTab === "results" && (
                  <ResultsSection
                    sessions={diagnostics}
                    initialIdx={resultIdx}
                  />
                )}
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
};

export default ProfilePage;