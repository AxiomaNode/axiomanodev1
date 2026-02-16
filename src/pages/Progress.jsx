import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { topics } from "../diagnostics/topics";

export default function Progress() {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();

  const getTopicProgress = (topicId) => {
    const completed = localStorage.getItem(`diagnostic_${topicId}_completed`) === "true";
    const answers = JSON.parse(
      localStorage.getItem(`diagnostic_${topicId}_answers`) || "{}"
    );
    const time = localStorage.getItem(`diagnostic_${topicId}_time`) || "0";
    
    return { completed, answersCount: Object.keys(answers).length, time };
  };

  const totalCompleted = topics.filter(topic => 
    getTopicProgress(topic.id).completed
  ).length;

  const totalTime = parseInt(localStorage.getItem("totalTime") || "0");
  const streak = parseInt(localStorage.getItem("streak") || "0");

  return (
    <div className="page-center">
      <div className="panel progress-panel">
        <div className="progress-header">
          <button 
            className="back-btn"
            onClick={() => navigate("/")}
          >
            ← {t("progress.back")}
          </button>
          <h1>📈 {t("progress.title")}</h1>
        </div>

        <div className="overview-stats">
          <div className="overview-card">
            <div className="overview-icon">✅</div>
            <div className="overview-content">
              <span className="overview-label">{t("progress.completed")}</span>
              <span className="overview-value">{totalCompleted}/{topics.length}</span>
            </div>
          </div>

          <div className="overview-card">
            <div className="overview-icon">⏱️</div>
            <div className="overview-content">
              <span className="overview-label">{t("progress.totalTime")}</span>
              <span className="overview-value">{totalTime} {t("home.minutes")}</span>
            </div>
          </div>

          <div className="overview-card">
            <div className="overview-icon">🔥</div>
            <div className="overview-content">
              <span className="overview-label">{t("progress.streak")}</span>
              <span className="overview-value">{streak} {t("home.days")}</span>
            </div>
          </div>

          <div className="overview-card">
            <div className="overview-icon">🎯</div>
            <div className="overview-content">
              <span className="overview-label">{t("progress.completion")}</span>
              <span className="overview-value">
                {Math.round((totalCompleted / topics.length) * 100)}%
              </span>
            </div>
          </div>
        </div>

        <div className="topics-progress">
          <h2>{t("progress.byTopic")}</h2>
          
          <div className="topics-progress-grid">
            {topics.map((topic) => {
              const progress = getTopicProgress(topic.id);
              
              return (
                <div key={topic.id} className="topic-progress-card">
                  <div className="topic-progress-header">
                    <span className="topic-icon large">{topic.icon}</span>
                    <div className="topic-info">
                      <h3>{topic.title[i18n.language] || topic.title.en}</h3>
                      <span className={`status-badge ${progress.completed ? "completed" : "pending"}`}>
                        {progress.completed ? t("progress.completed") : t("progress.notStarted")}
                      </span>
                    </div>
                  </div>

                  {progress.completed ? (
                    <div className="topic-stats">
                      <div className="topic-stat">
                        <span className="stat-icon">📝</span>
                        <span>{progress.answersCount} {t("progress.answers")}</span>
                      </div>
                      <div className="topic-stat">
                        <span className="stat-icon">⏱️</span>
                        <span>{progress.time} {t("home.minutes")}</span>
                      </div>
                      <button
                        className="view-results-btn"
                        onClick={() => {
                          localStorage.setItem("currentTopic", topic.id);
                          navigate("/results");
                        }}
                      >
                        {t("progress.viewResults")} →
                      </button>
                    </div>
                  ) : (
                    <div className="topic-actions">
                      <p className="not-started-text">
                        {t("progress.notStartedYet")}
                      </p>
                      <button
                        className="start-btn"
                        onClick={() => {
                          localStorage.setItem("currentTopic", topic.id);
                          navigate("/diagnostics");
                        }}
                      >
                        {t("progress.startNow")}
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div className="achievements-section">
          <h2>🏆 {t("progress.achievements")}</h2>
          <div className="achievements-grid">
            <div className={`achievement-card ${totalCompleted >= 1 ? "unlocked" : "locked"}`}>
              <span className="achievement-icon">🎯</span>
              <h4>{t("progress.achievement1")}</h4>
              <p>{t("progress.achievement1Desc")}</p>
            </div>

            <div className={`achievement-card ${totalCompleted >= topics.length / 2 ? "unlocked" : "locked"}`}>
              <span className="achievement-icon">⭐</span>
              <h4>{t("progress.achievement2")}</h4>
              <p>{t("progress.achievement2Desc")}</p>
            </div>

            <div className={`achievement-card ${totalCompleted >= topics.length ? "unlocked" : "locked"}`}>
              <span className="achievement-icon">🏆</span>
              <h4>{t("progress.achievement3")}</h4>
              <p>{t("progress.achievement3Desc")}</p>
            </div>

            <div className={`achievement-card ${streak >= 7 ? "unlocked" : "locked"}`}>
              <span className="achievement-icon">🔥</span>
              <h4>{t("progress.achievement4")}</h4>
              <p>{t("progress.achievement4Desc")}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}