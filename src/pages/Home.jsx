import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { logoutUser } from "../firebase/auth";           
import { topics } from "../diagnostics/topics";
import LanguageSwitcher from "../components/layout/LanguageSwitcher";
import ThemeToggle from "../components/layout/ThemeToggle";
import logo from "../img/axiomaLogo.png"

export default function Home() {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const [selectedTopic, setSelectedTopic] = useState(null);

  const startDiagnostic = (topicId) => {
    localStorage.setItem("currentTopic", topicId);
    navigate("/diagnostics");
  };

  const viewProgress = () => {
    navigate("/progress");
  };

  const handleLogout = async () => {
    try {
      await logoutUser();
      localStorage.clear(); // можно оставить, если хотите полностью очистить
      navigate("/login");
    } catch (error) {
      console.error("Ошибка выхода:", error);
    }
  };

  return (
    <div className="app-layout">
      <LanguageSwitcher />
      <ThemeToggle />

      <aside className="sidebar">
        <div className="sidebar-logo">
          <span className="logo-icon"><img src={logo} alt="" className="logo-icon-img" /></span>
          <span>Axioma</span>
        </div>

        <nav className="sidebar-nav">
          <button className="sidebar-item active">
            🏠 {t("home.home")}
          </button>

          <button className="sidebar-item" onClick={viewProgress}>
            📊 {t("home.progress")}
          </button>

          <button className="sidebar-item">
            🎯 {t("home.practice")}
          </button>

          <button className="sidebar-item">
            📚 {t("home.theory")}
          </button>
        </nav>

        <button className="logout-btn" onClick={handleLogout}>
          🚪 {t("home.logout")}
        </button>
      </aside>

      <div className="main">
        <header className="topbar">
          <h1>{t("home.welcome")}</h1>

          <div className="topbar-links">
            <span style={{ cursor: "pointer" }}>❓ {t("home.help")}</span>
            <span style={{ cursor: "pointer" }}>ℹ️ {t("home.about")}</span>
          </div>
        </header>

        <section className="content">
          <div className="card-box welcome-card">
            <h2>👋 {t("home.greetingTitle")}</h2>
            <p>{t("home.greetingText")}</p>
          </div>

          <div className="section-header">
            <h2>📋 {t("home.selectTopic")}</h2>
            <p className="subtitle">{t("home.selectTopicDesc")}</p>
          </div>

          <div className="topics-grid">
            {topics.map((topic) => (
              <div
                key={topic.id}
                className={`topic-card ${selectedTopic === topic.id ? "selected" : ""}`}
                onClick={() => setSelectedTopic(topic.id)}
              >
                <div className="topic-icon">{topic.icon}</div>
                <h3>{topic.title[i18n.language] || topic.title.en}</h3>
                <p className="topic-desc">
                  {topic.description[i18n.language] || topic.description.en}
                </p>
                <div className={`difficulty-badge ${topic.difficulty}`}>
                  {t(`home.difficulty.${topic.difficulty}`)}
                </div>
                <button
                  className="topic-start-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    startDiagnostic(topic.id);
                  }}
                >
                  {t("home.startDiagnostic")} →
                </button>
              </div>
            ))}
          </div>

          <div className="stats-section">
            <h2>📊 {t("home.quickStats")}</h2>
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-icon">✅</div>
                <h3>{t("home.completed")}</h3>
                <p className="stat-number">
                  {Object.keys(localStorage).filter((k) =>
                    k.startsWith("diagnostic_")
                  ).length}
                </p>
              </div>

              <div className="stat-card">
                <div className="stat-icon">🎯</div>
                <h3>{t("home.accuracy")}</h3>
                <p className="stat-number">
                  {localStorage.getItem("averageScore") || "0"}%
                </p>
              </div>

              <div className="stat-card">
                <div className="stat-icon">🔥</div>
                <h3>{t("home.streak")}</h3>
                <p className="stat-number">
                  {localStorage.getItem("streak") || "0"} {t("home.days")}
                </p>
              </div>

              <div className="stat-card">
                <div className="stat-icon">⏱️</div>
                <h3>{t("home.timeSpent")}</h3>
                <p className="stat-number">
                  {localStorage.getItem("totalTime") || "0"} {t("home.minutes")}
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}