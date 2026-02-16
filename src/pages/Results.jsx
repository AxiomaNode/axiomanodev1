import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { analyzeResults } from "../diagnostics/analyzeResults";
import { topics } from "../diagnostics/topics";

export default function Results() {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const [result, setResult] = useState(null);
  const [topicId, setTopicId] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const savedTopic = localStorage.getItem("currentTopic");
    const saved = localStorage.getItem(`diagnostic_${savedTopic}_answers`);

    if (!saved || !savedTopic) {
      navigate("/");
      return;
    }

    setTopicId(savedTopic);

    try {
      const answers = JSON.parse(saved);
      const detected = analyzeResults(savedTopic, answers);
      setResult(detected);
    } catch (err) {
      console.error("Error processing results:", err);
      setError(t("results.error"));
      setResult([]);
    }
  }, [navigate, t]);

  const handleRestart = () => {
    if (topicId) {
      localStorage.removeItem(`diagnostic_${topicId}_answers`);
      localStorage.removeItem(`diagnostic_${topicId}_completed`);
    }
    navigate("/diagnostics");
  };

  const handleHome = () => {
    navigate("/");
  };

  if (result === null || !topicId) {
    return (
      <div className="page-center">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <h2>{t("results.loading")}</h2>
        </div>
      </div>
    );
  }

  const topic = topics.find(t => t.id === topicId);
  const timeSpent = localStorage.getItem(`diagnostic_${topicId}_time`) || "0";

  if (error) {
    return (
      <div className="page-center">
        <div className="panel error-panel">
          <div className="error-icon">⚠️</div>
          <h1>{t("results.errorTitle")}</h1>
          <p>{error}</p>
          <button className="primary-btn" onClick={handleRestart}>
            {t("results.restart_button")}
          </button>
        </div>
      </div>
    );
  }

  const score = Math.max(0, 100 - (result.length * 20));

  return (
    <div className="page-center">
      <div className="panel results-panel">
        <div className="results-header">
          <div className="topic-badge large">
            <span className="topic-icon">{topic.icon}</span>
            <span>{topic.title[i18n.language] || topic.title.en}</span>
          </div>
          
          <h1>{t("results.title")}</h1>
        </div>

        <div className="score-card">
          <div className="score-circle">
            <svg viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke="var(--border)"
                strokeWidth="10"
              />
              <circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke="var(--accent)"
                strokeWidth="10"
                strokeDasharray={`${score * 2.83} 283`}
                transform="rotate(-90 50 50)"
              />
            </svg>
            <div className="score-text">
              <span className="score-number">{score}</span>
              <span className="score-label">%</span>
            </div>
          </div>
          
          <div className="score-details">
            <div className="stat-row">
              <span className="stat-label">⏱️ {t("results.timeSpent")}:</span>
              <span className="stat-value">{timeSpent} {t("home.minutes")}</span>
            </div>
            <div className="stat-row">
              <span className="stat-label">📊 {t("results.gapsFound")}:</span>
              <span className="stat-value">{result.length}</span>
            </div>
          </div>
        </div>

        {result.length === 0 ? (
          <div className="result-box success">
            <div className="success-icon">🎉</div>
            <h2>{t("results.no_gaps")}</h2>
            <p>{t("results.great_job")}</p>
            <div className="success-message">
              {t("results.excellentUnderstanding")}
            </div>
          </div>
        ) : (
          <>
            <div className="gaps-header">
              <h2>{t("results.detected_gaps")}</h2>
              <p className="gaps-subtitle">
                {t("results.gapsSubtitle")}
              </p>
            </div>

            <div className="gaps-list">
              {result.map((gap, index) => (
                <div key={gap.id} className="gap-card">
                  <div className="gap-header">
                    <span className="gap-number">{index + 1}</span>
                    <h3>{gap.title[i18n.language] || gap.title.en}</h3>
                  </div>
                  
                  <div className="gap-content">
                    <div className="gap-description">
                      <strong>{t("results.problem")}:</strong>
                      <p>{gap.description[i18n.language] || gap.description.en}</p>
                    </div>
                    
                    <div className="gap-recommendation">
                      <strong>💡 {t("results.recommendation")}:</strong>
                      <p>{gap.recommendation[i18n.language] || gap.recommendation.en}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        <div className="results-actions">
          <button className="secondary-btn" onClick={handleHome}>
            ← {t("results.backHome")}
          </button>
          
          <button className="primary-btn" onClick={handleRestart}>
            🔄 {t("results.restart_button")}
          </button>
        </div>

        <div className="next-steps">
          <h3>{t("results.nextSteps")}</h3>
          <div className="steps-grid">
            <div className="step-card">
              <span className="step-icon">📚</span>
              <h4>{t("results.step1Title")}</h4>
              <p>{t("results.step1Desc")}</p>
            </div>
            
            <div className="step-card">
              <span className="step-icon">✍️</span>
              <h4>{t("results.step2Title")}</h4>
              <p>{t("results.step2Desc")}</p>
            </div>
            
            <div className="step-card">
              <span className="step-icon">🎯</span>
              <h4>{t("results.step3Title")}</h4>
              <p>{t("results.step3Desc")}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}