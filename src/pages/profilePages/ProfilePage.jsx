// src/pages/profilePages/ProfilePage.jsx
import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import Header from "../../components/layout/Header";
import Sidebar from "../../components/layout/Sidebar";
import { getPractice, getDiagnostics, getAllTopicNotes } from "../../services/db";
import { getUserProfile } from "../../firebase/auth";
import ResultsSection  from "../../components/sections/ResultsSection";
import ProgressSection from "../../components/sections/ProgressSections";
import NotesSection    from "../../components/sections/NotesSection";
import ProfileEditModal from "../../components/profile/ProfileEditModal";
import "./profile.css";
import "../progressPages/progress.css";
import '../resultsPages/results.css';
import "../../styles/layout.css";

// ── XP / level helpers ────────────────────────────────────────────────────────
const XP_PER_LEVEL = 200;
const getLevel    = (xp) => Math.floor((xp || 0) / XP_PER_LEVEL) + 1;
const getLevelXp  = (xp) => (xp || 0) % XP_PER_LEVEL;
const getLevelPct = (xp) => Math.round((getLevelXp(xp) / XP_PER_LEVEL) * 100);

const getTier = (level) => {
  if (level >= 20) return { label: "Master",   color: "#9b59b6" };
  if (level >= 10) return { label: "Expert",   color: "#d35400" };
  if (level >= 5)  return { label: "Learner",  color: "#2a8fa0" };
  return               { label: "Beginner", color: "rgba(255,255,255,0.3)" };
};

// ── Avatar ────────────────────────────────────────────────────────────────────
const Avatar = ({ name, photoURL, size = 68 }) => {
  const initials = (name || "?")
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  if (photoURL) {
    return (
      <img src={photoURL} alt={name} className="profile-avatar__img"
        style={{ width: size, height: size, borderRadius: "50%" }} />
    );
  }
  return (
    <div className="profile-avatar__initials"
      style={{ width: size, height: size, fontSize: size * 0.34 }}>
      {initials}
    </div>
  );
};

// ── Hero Card ─────────────────────────────────────────────────────────────────
const ProfileHeroCard = ({ user, profile, diagnostics, practice, onEditClick }) => {
  const xp       = profile?.ratingPoints || 0;
  const level    = getLevel(xp);
  const levelXp  = getLevelXp(xp);
  const levelPct = getLevelPct(xp);
  const tier     = getTier(level);

  const totalSessions = diagnostics.length + practice.length;
  const totalGaps     = diagnostics.reduce((s, d) => s + (d.gaps?.length || 0), 0);
  const avgScore      = diagnostics.length
    ? Math.round(
        diagnostics.reduce((s, d) => s + (d.score.correct / d.score.total) * 100, 0) /
        diagnostics.length
      )
    : null;

  const scoreCol = (p) => (p >= 70 ? "#27ae60" : p >= 40 ? "#d35400" : "#c0392b");

  return (
    <div className="profile-hero">
      {/* Left: avatar + identity */}
      <div className="profile-hero__left">
        <div className="profile-avatar-wrap">
          <Avatar name={user?.displayName} photoURL={user?.photoURL} size={68} />
          <div className="profile-avatar__lvl">{level}</div>
        </div>

        <div className="profile-hero__identity">
          <div className="profile-hero__name-row">
            <h1 className="profile-hero__name">{user?.displayName || "Anonymous"}</h1>
            <span className="profile-hero__tier"
              style={{ color: tier.color, borderColor: tier.color + "35",
                background: tier.color + "0e" }}>
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
                <svg width="9" height="9" viewBox="0 0 24 24" fill="currentColor">
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                </svg>
                {xp} xp
              </span>
              <span className="profile-xp__next">{levelXp} / {XP_PER_LEVEL} to level {level + 1}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right: stats + edit */}
      <div className="profile-hero__right">
        <div className="profile-hero__stats">
          <div className="profile-hero__stat">
            <strong>{totalSessions}</strong>
            <span>sessions</span>
          </div>
          <div className="profile-hero__stat-sep" />
          <div className="profile-hero__stat">
            <strong style={{ color: avgScore != null ? scoreCol(avgScore) : undefined }}>
              {avgScore != null ? `${avgScore}%` : "—"}
            </strong>
            <span>avg score</span>
          </div>
          <div className="profile-hero__stat-sep" />
          <div className="profile-hero__stat">
            <strong style={{ color: totalGaps > 0 ? "#d35400" : undefined }}>
              {totalGaps}
            </strong>
            <span>gaps</span>
          </div>
          <div className="profile-hero__stat-sep" />
          <div className="profile-hero__stat">
            <strong>{profile?.stats?.diagnosticsCompleted ?? diagnostics.length}</strong>
            <span>diagnostics</span>
          </div>
        </div>

        <button className="profile-hero__edit-btn" onClick={onEditClick} type="button">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4z"/>
          </svg>
          Edit profile
        </button>
      </div>
    </div>
  );
};

// ── ProfilePage ───────────────────────────────────────────────────────────────
const VALID_TABS = ["progress", "results", "notes"];

const ProfilePage = () => {
  const { user }   = useAuth();
  const location   = useLocation();

  // Initialise tab and result index from navigation state (e.g. redirects from
  // /progress or /results, or sidebar links that pass state={{ tab: "..." }}).
  const initialTab = VALID_TABS.includes(location.state?.tab)
    ? location.state.tab
    : "progress";
  const initialIdx = location.state?.selectedIdx ?? 0;

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab,   setActiveTab]   = useState(initialTab);
  const [editOpen,    setEditOpen]    = useState(false);

  // Re-sync tab when navigating to /profile from elsewhere (e.g. header links)
  // while the component is already mounted — useState initialiser won't re-run.
  useEffect(() => {
    const tab = location.state?.tab;
    if (tab && VALID_TABS.includes(tab)) {
      setActiveTab(tab);
    }
    if (location.state?.selectedIdx != null) {
      setResultIdx(location.state.selectedIdx);
    }
  }, [location.state]);

  const [resultIdx,   setResultIdx]   = useState(initialIdx);

  const [diagnostics, setDiagnostics] = useState([]);
  const [practice,    setPractice]    = useState([]);
  const [profile,     setProfile]     = useState(null);
  const [topicNotes,  setTopicNotes]  = useState([]);
  const [loading,     setLoading]     = useState(true);

  // Dot-grid background on body
  useEffect(() => {
    document.body.classList.add("axioma-profile-bg");
    return () => {
      document.body.classList.remove("axioma-profile-bg");
    };
  }, []);

  useEffect(() => {
    if (!user) return;
    Promise.all([
      getDiagnostics(user.uid),
      getPractice(user.uid),
      getUserProfile(user.uid),
      getAllTopicNotes(user.uid),
    ]).then(([diags, pracs, prof, notes]) => {
      setDiagnostics(diags  ?? []);
      setPractice(pracs     ?? []);
      setProfile(prof);
      setTopicNotes(notes   ?? []);
      setLoading(false);
    });
  }, [user]);

  const handleDiagnosticClick = (idx) => {
    setResultIdx(idx);
    setActiveTab("results");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleNoteUpdated = (topicId, newContent) => {
    setTopicNotes((prev) =>
      prev.map((n) => (n.topicId === topicId ? { ...n, content: newContent } : n))
    );
  };

  const TABS = [
    { id: "progress", label: "Progress" },
    { id: "results",  label: "Results",  badge: diagnostics.length || null },
    { id: "notes",    label: "Notes",    badge: topicNotes.length  || null },
  ];

  return (
    <div className="page-shell">
      <Header sidebarOpen={sidebarOpen}
        onToggleSidebar={() => setSidebarOpen((v) => !v)} />
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <main className="page-main">
        <div className="profile-page">

          {/* Breadcrumb */}
          <nav className="profile-breadcrumb" aria-label="breadcrumb">
            <Link to="/home" className="profile-breadcrumb__item">Home</Link>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <polyline points="9 18 15 12 9 6"/>
            </svg>
            <span className="profile-breadcrumb__item profile-breadcrumb__item--active">
              Profile
            </span>
          </nav>

          {loading ? (
            <div className="profile-loading">
              <div className="profile-loading__ring" />
              <p>Loading profile…</p>
            </div>
          ) : (
            <>
              <ProfileHeroCard
                user={user}
                profile={profile}
                diagnostics={diagnostics}
                practice={practice}
                onEditClick={() => setEditOpen(true)}
              />

              <div className="profile-tabs" role="tablist">
                {TABS.map((t) => (
                  <button key={t.id} role="tab"
                    aria-selected={activeTab === t.id}
                    className={`profile-tab ${activeTab === t.id ? "profile-tab--active" : ""}`}
                    onClick={() => setActiveTab(t.id)}>
                    {t.label}
                    {t.badge > 0 && (
                      <span className="profile-tab__badge">{t.badge}</span>
                    )}
                  </button>
                ))}
              </div>

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
                {activeTab === "notes" && (
                  <NotesSection
                    notes={topicNotes}
                    uid={user?.uid}
                    onNoteUpdated={handleNoteUpdated}
                  />
                )}
              </div>
            </>
          )}
        </div>
      </main>

      {editOpen && (
        <ProfileEditModal
          user={user}
          profile={profile}
          onClose={() => setEditOpen(false)}
          onSaved={(updated) => setProfile(updated)}
        />
      )}
    </div>
  );
};

export default ProfilePage;