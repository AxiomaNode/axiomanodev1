import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { analyzeResults } from "../diagnostics/analyzeResults";

export default function Results() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const saved = localStorage.getItem("diagnosticAnswers");

    if (!saved) {
      navigate("/diagnostics");
      return;
    }

    try {
      const answers = JSON.parse(saved);
      const detected = analyzeResults(answers);
      setResult(detected);
    } catch (err) {
      console.error("Error processing results:", err);
      setError(t("results.error"));
      setResult([]);
    }
  }, [navigate, t]);

  const handleRestart = () => {
    localStorage.removeItem("diagnosticAnswers");
    localStorage.removeItem("diagnosticCompleted");
    navigate("/diagnostics");
  };

  if (result === null) {
    return (
      <div className="page-center">
        <h2>{t("results.loading")}</h2>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page-center">
        <div className="panel">
          <h1>{t("results.errorTitle")}</h1>
          <p>{error}</p>
          <button className="primary-btn" onClick={handleRestart}>
            {t("login.take_again")}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="page-center">
      <div className="panel results-panel">
        <h1>{t("results.title")}</h1>

        {result.length === 0 ? (
          <div className="result-box success">
            <div className="success-icon">✓</div>
            <h2>{t("results.no_gaps")}</h2>
            <p>{t("results.great_job")}</p>
          </div>
        ) : (
          <div className="result-box">
            <h2>{t("results.detected_gaps")}</h2>
            <ul className="gaps-list">
              {result.map((gap) => (
                <li key={gap.id} className="gap-item">
                  <strong>{gap.title}</strong>
                  <p>{gap.description}</p>
                </li>
              ))}
            </ul>
          </div>
        )}

        <button className="primary-btn restart-btn" onClick={handleRestart}>
          {t("login.take_again")}
        </button>
      </div>
    </div>
  );
}