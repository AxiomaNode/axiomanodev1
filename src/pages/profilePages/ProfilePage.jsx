import { useState, useEffect, useMemo } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import Header from "../../components/layout/Header";
import Sidebar from "../../components/layout/Sidebar";
import {
  getPractice,
  getDiagnostics,
  getAllTopicNotes,
  getTopicProgress,
  savePublicProfile,
} from "../../services/db";
import { getUserProfile } from "../../firebase/auth";
import ResultsSection from "../../components/sections/ResultsSection";
import ProgressSection from "../../components/sections/ProgressSections";
import NotesSection from "../../components/sections/NotesSection";
import GapsSection from "../../components/sections/GapsSection";
import ProfileEditModal from "../../components/profile/ProfileEditModal";
import "./profile.css";
import "../progressPages/progress.css";
import "../resultsPages/results.css";
import "../../styles/layout.css";
import "./profile.gaps.css";

const XP_PER_LEVEL = 200;
const getLevel = (xp) => Math.floor((xp || 0) / XP_PER_LEVEL) + 1;
const getLevelXp = (xp) => (xp || 0) % XP_PER_LEVEL;
const getLevelPct = (xp) => Math.round((getLevelXp(xp) / XP_PER_LEVEL) * 100);

const getTier = (level) => {
  if (level >= 20) return { label: "Master", color: "#9b59b6" };
  if (level >= 10) return { label: "Expert", color: "#d35400" };
  if (level >= 5) return { label: "Learner", color: "#2a8fa0" };
  return { label: "Beginner", color: "rgba(255,255,255,0.3)" };
};

const todayStr = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
    d.getDate()
  ).padStart(2, "0")}`;
};

const getStreakColor = (streak, activeToday) => {
  if (!activeToday || streak === 0) return null;
  if (streak >= 30) return "#9b59b6";
  if (streak >= 14) return "#e74c3c";
  if (streak >= 7) return "#e67e22";
  if (streak >= 3) return "#f39c12";
  return "#f1c40f";
};

const normalizePhotoURL = (url) => {
  if (!url) return null;
  if (url.includes("googleusercontent.com")) {
    // Remove size param and request 200px — avoids expiry issues
    return url.split("=")[0] + "=s200-c";
  }
  return url;
};
 

const Avatar = ({ name, photoURL, size = 68 }) => {
  const initials = (name || "?")
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  const src = normalizePhotoURL(photoURL);
  if (src) {
    return (
      <img src={src} alt={name} className="profile-avatar__img"
        style={{ width: size, height: size, borderRadius: "50%" }}
      />
    );
  }

  return (
    <div
      className="profile-avatar__initials"
      style={{ width: size, height: size, fontSize: size * 0.34 }}
    >
      {initials}
    </div>
  );
};

const StreakPill = ({ profile }) => {
  const streak = profile?.currentStreak ?? 0;
  const best = profile?.bestStreak ?? 0;
  const lastActive = profile?.lastActiveDate ?? null;
  const activeToday = lastActive === todayStr();
  const color = getStreakColor(streak, activeToday);
  const dimColor = "var(--text-light)";

  return (
    <div className="profile-streak" style={{ borderColor: color ? color + "40" : undefined }}>
      <svg
        width="15"
        height="15"
        viewBox="0 0 24 24"
        fill={color ?? dimColor}
        style={{ flexShrink: 0 }}
      >
        <path d="M12 2C10 5.5 6 9 6 13.5a6 6 0 0 0 12 0C18 9 14 5.5 12 2z" />
        <path
          d="M12 22a3.5 3.5 0 0 1-3.5-3.5c0-2 2-4.5 3.5-6 1.5 1.5 3.5 4 3.5 6A3.5 3.5 0 0 1 12 22z"
          fill={color ? "rgba(255,255,255,0.4)" : "transparent"}
        />
      </svg>

      <span className="profile-streak__val" style={{ color: color ?? dimColor }}>
        {streak}
      </span>
      <span className="profile-streak__label">
        {activeToday ? "day streak" : "streak · inactive"}
      </span>

      {best > 0 && best !== streak && (
        <span className="profile-streak__best">best {best}</span>
      )}
    </div>
  );
};

const ProfileHeroCard = ({
  user,
  profile,
  diagnostics,
  onEditClick,
  activeGapCount,
  onTabChange,
  forcedPhotoURL,
}) => {
  const xp = profile?.ratingPoints || 0;
  const level = getLevel(xp);
  const levelXp = getLevelXp(xp);
  const levelPct = getLevelPct(xp);
  const tier = getTier(level);

  const avgScore = diagnostics.length
    ? Math.round(
        diagnostics.reduce((s, d) => s + (d.score.correct / d.score.total) * 100, 0) /
          diagnostics.length
      )
    : null;

  const scoreCol = (p) => (p >= 70 ? "#27ae60" : p >= 40 ? "#d35400" : "#c0392b");

  const lastDiagDate = useMemo(() => {
    if (!diagnostics.length) return null;
    const sorted = [...diagnostics].sort((a, b) => new Date(b.date) - new Date(a.date));
    return new Date(sorted[0].date).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
    });
  }, [diagnostics]);

  const statusLine = useMemo(() => {
    const parts = [];
    if (activeGapCount > 0) parts.push(`${activeGapCount} active gap${activeGapCount !== 1 ? "s" : ""}`);
    else if (diagnostics.length > 0) parts.push("no active gaps");
    if (lastDiagDate) parts.push(`last run ${lastDiagDate}`);
    if (diagnostics.length > 0) parts.push(`${diagnostics.length} session${diagnostics.length !== 1 ? "s" : ""}`);
    return parts.join(" · ");
  }, [activeGapCount, lastDiagDate, diagnostics.length]);

  return (
    <div className="profile-hero">
      <div className="profile-hero__left">
        <div className="profile-avatar-wrap">
          <Avatar
            name={profile?.displayName || user?.displayName}
            photoURL={profile?.photoURL || user?.photoURL}
            size={68}
          />
          <div className="profile-avatar__lvl">{level}</div>
        </div>

        <div className="profile-hero__identity">
          <div className="profile-hero__name-row">
            <h1 className="profile-hero__name">
              {profile?.displayName || user?.displayName || "Anonymous"}
            </h1>
            <span
              className="profile-hero__tier"
              style={{
                color: tier.color,
                borderColor: `${tier.color}35`,
                background: `${tier.color}0e`,
              }}
            >
              {tier.label}
            </span>
          </div>

          {statusLine && <p className="profile-hero__status">{statusLine}</p>}

          <div className="profile-xp">
            <div className="profile-xp__bar-outer">
              <div className="profile-xp__bar-inner" style={{ width: `${levelPct}%` }} />
            </div>
            <div className="profile-xp__meta">
              <span className="profile-xp__total">
                <svg width="9" height="9" viewBox="0 0 24 24" fill="currentColor">
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                </svg>
                {xp} xp
              </span>
              <span className="profile-xp__next">
                {levelXp} / {XP_PER_LEVEL} to level {level + 1}
              </span>
            </div>
          </div>

          <StreakPill profile={profile} />
        </div>
      </div>

      <div className="profile-hero__right">
        <div className="profile-hero__stats">
          <button
            className="profile-hero__stat profile-hero__stat--btn"
            onClick={() => onTabChange("gaps")}
            title="View your active gaps"
          >
            <strong style={{ color: activeGapCount > 0 ? "#d35400" : undefined }}>
              {activeGapCount}
            </strong>
            <span>gaps</span>
          </button>

          <div className="profile-hero__stat-sep" />

          <button
            className="profile-hero__stat profile-hero__stat--btn"
            onClick={() => onTabChange("results")}
            title="View diagnostic results"
          >
            <strong style={{ color: avgScore != null ? scoreCol(avgScore) : undefined }}>
              {avgScore != null ? `${avgScore}%` : "—"}
            </strong>
            <span>avg score</span>
          </button>

          <div className="profile-hero__stat-sep" />

          <button
            className="profile-hero__stat profile-hero__stat--btn"
            onClick={() => onTabChange("results")}
            title="View latest diagnostic"
          >
            <strong style={{ fontSize: "0.95rem" }}>{lastDiagDate ?? "—"}</strong>
            <span>last run</span>
          </button>

          <div className="profile-hero__stat-sep" />

          <button
            className="profile-hero__stat profile-hero__stat--btn"
            onClick={() => onTabChange("results")}
            title="View all diagnostic sessions"
          >
            <strong>{profile?.stats?.diagnosticsCompleted ?? diagnostics.length}</strong>
            <span>diagnostics</span>
          </button>
        </div>

        <button className="profile-hero__edit-btn" onClick={onEditClick} type="button">
          <svg
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
          >
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4z" />
          </svg>
          Edit profile
        </button>
      </div>
    </div>
  );
};

const VALID_TABS = ["progress", "gaps", "results", "notes"];

const ProfilePage = () => {
  const { user } = useAuth();
  const location = useLocation();

  const initialTab = VALID_TABS.includes(location.state?.tab) ? location.state.tab : "progress";
  const initialIdx = location.state?.selectedIdx ?? 0;

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState(initialTab);
  const [topicProgress, setTopicProgress] = useState([]);
  const [editOpen, setEditOpen] = useState(false);
  const [resultIdx, setResultIdx] = useState(initialIdx);
  const [diagnostics, setDiagnostics] = useState([]);
  const [practice, setPractice] = useState([]);
  const [profile, setProfile] = useState(null);
  const [topicNotes, setTopicNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [forcedPhotoURL, setForcedPhotoURL] = useState(null);

  const activeGapCount = useMemo(() => {
    const sorted = [...diagnostics].sort((a, b) => new Date(b.date) - new Date(a.date));
    for (const s of sorted) {
      if (s.gaps?.length > 0) return s.gaps.length;
    }
    return 0;
  }, [diagnostics]);

  useEffect(() => {
    const tab = location.state?.tab;
    if (tab && VALID_TABS.includes(tab)) setActiveTab(tab);
    if (location.state?.selectedIdx != null) setResultIdx(location.state.selectedIdx);
  }, [location.state]);

  useEffect(() => {
    document.body.classList.add("axioma-profile-bg");
    return () => document.body.classList.remove("axioma-profile-bg");
  }, []);

  useEffect(() => {
    if (!user?.uid) {
      setLoading(false);
      return;
    }

    let cancelled = false;

    const loadProfile = async () => {
      setLoading(true);
      setLoadError("");

      try {
        const [diags, pracs, prof, notes, progress] = await Promise.all([
          getDiagnostics(user.uid),
          getPractice(user.uid),
          getUserProfile(user.uid),
          getAllTopicNotes(user.uid),
          getTopicProgress(user.uid),
        ]);

        if (cancelled) return;

        const safeDiags = Array.isArray(diags) ? diags : [];
        const safePracs = Array.isArray(pracs) ? pracs : [];
        const safeNotes = Array.isArray(notes) ? notes : [];
        const safeProgress = Array.isArray(progress) ? progress : [];

        setDiagnostics(safeDiags);
        setPractice(safePracs);
        setProfile(prof ?? null);
        setTopicNotes(safeNotes);
        setTopicProgress(safeProgress);

        const avgScore =
          safeDiags.length > 0
            ? Math.round(
                safeDiags.reduce((sum, d) => {
                  const correct = d?.score?.correct ?? 0;
                  const total = d?.score?.total ?? 0;
                  if (!total) return sum;
                  return sum + (correct / total) * 100;
                }, 0) / safeDiags.length
              )
            : null;

        try {
          await savePublicProfile(user.uid, {
            displayName: prof?.displayName || user?.displayName || "Anonymous",
            photoURL:     prof?.photoURL     || user?.photoURL    || "",
            ratingPoints: prof?.ratingPoints || 0,
            createdAt: prof?.createdAt || new Date().toISOString(),
            stats: {
              diagnosticsCompleted: safeDiags.length,
              practiceCompleted: safePracs.length,
              avgScore,
            },
          });
        } catch (e) {
          console.error("[ProfilePage] savePublicProfile error:", e);
        }
      } catch (e) {
        console.error("[ProfilePage] load error:", e);
        if (!cancelled) {
          setDiagnostics([]);
          setPractice([]);
          setProfile(null);
          setTopicNotes([]);
          setTopicProgress([]);
          setLoadError("Failed to load profile data.");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    loadProfile();

    return () => {
      cancelled = true;
    };
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
    { id: "gaps", label: "Gaps", badge: activeGapCount || null },
    { id: "results", label: "Results", badge: diagnostics.length || null },
    { id: "notes", label: "Notes", badge: topicNotes.length || null },
  ];

  return (
    <div className="page-shell">
      <Header
        sidebarOpen={sidebarOpen}
        onToggleSidebar={() => setSidebarOpen((v) => !v)}
      />
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <main className="page-main">
        <div className="profile-page">
          <nav className="profile-breadcrumb" aria-label="breadcrumb">
            <Link to="/home" className="profile-breadcrumb__item">
              Home
            </Link>
            <svg
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
            >
              <polyline points="9 18 15 12 9 6" />
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
          ) : loadError ? (
            <div className="profile-loading">
              <p>{loadError}</p>
            </div>
          ) : (
            <>
              <ProfileHeroCard
                user={user}
                profile={profile}
                diagnostics={diagnostics}
                onEditClick={() => setEditOpen(true)}
                activeGapCount={activeGapCount}
                onTabChange={setActiveTab}
                forcedPhotoURL={forcedPhotoURL}
              />

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
                    {t.badge > 0 && <span className="profile-tab__badge">{t.badge}</span>}
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
                  <ResultsSection sessions={diagnostics} initialIdx={resultIdx} />
                )}

                {activeTab === "gaps" && (
                  <GapsSection diagnostics={diagnostics} topicProgress={topicProgress} />
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
          onSaved={(updated, newPhotoURL) => {
            setProfile(updated);
            if (newPhotoURL) setForcedPhotoURL(newPhotoURL);
          }}
        />
      )}
    </div>
  );
};

export default ProfilePage;