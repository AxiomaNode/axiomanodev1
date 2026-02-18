import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { topics } from "../data/topics";
import "../styles/results.css";

const ResultsPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const preselected = searchParams.get("topic");
  const [activeTopic, setActiveTopic] = useState(preselected || "");
  const [results, setResults] = useState({});

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("axioma_results") || "{}");
    setResults(stored);
    if (preselected && stored[preselected]) {
      setActiveTopic(preselected);
    } else if (!preselected) {
      const first = Object.keys(stored)[0];
      if (first) setActiveTopic(first);
    }
  }, [preselected]);

  const availableTopics = topics.filter(t => results[t.id]);
  const currentResult = results[activeTopic];

  if (availableTopics.length === 0) {
    return (
      <div className="results-page">
        <div className="results-empty">
          <h3>No results yet</h3>
          <p>Complete a diagnostic first to see your thinking profile.</p>
          <button
            className="results-action-btn"
            style={{ marginTop: "1.5rem" }}
            onClick={() => navigate("/diagnostics")}
          >
            Start Diagnostic
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="results-page">
      <div className="results-header">
        <h2>Results</h2>
        <p>Your thinking profile and identified gaps.</p>
      </div>

      <div className="results-topic-tabs">
        {availableTopics.map((t) => (
          <button
            key={t.id}
            className={`results-tab ${activeTopic === t.id ? "active" : ""}`}
            onClick={() => setActiveTopic(t.id)}
          >
            {t.icon} {t.title}
          </button>
        ))}
      </div>

      {currentResult && (
        <>
          <div className="results-summary">
            <div className="results-summary-icon">
              {currentResult.gaps.length === 0 ? "🎯" : "🔍"}
            </div>
            <div className="results-summary-text">
              <h3>
                {currentResult.gaps.length === 0
                  ? "Ajoyib natija!"
                  : `${currentResult.gaps.length} ta bo'shliq aniqlandi`
                }
              </h3>
              <p>
                {currentResult.gaps.length === 0
                  ? "Bu mavzuda fikrlash bo'shliqlari aniqlanmadi."
                  : "Quyida sizning tushunish bo'shliqlaringiz va tavsiyalar ko'rsatilgan."
                }
              </p>
            </div>
          </div>

          {currentResult.gaps.length === 0 ? (
            <div className="results-no-gaps">
              <h3>Zo'r! Siz bu mavzuni yaxshi tushunasiz.</h3>
              <p>Mashq qilishni davom eting yoki boshqa mavzuni sinab ko'ring.</p>
            </div>
          ) : (
            currentResult.gaps.map((gap, i) => (
              <div key={gap.id} className="gap-card" style={{ animationDelay: `${i * 0.1}s` }}>
                <div className="gap-card-header">
                  <div className="gap-indicator" />
                  <div className="gap-card-title">{gap.title}</div>
                </div>
                <div className="gap-card-desc">{gap.description}</div>
                <div className="gap-card-recommendation">
                  <div className="gap-rec-label">Tavsiya</div>
                  <div className="gap-rec-text">{gap.recommendation}</div>
                </div>
              </div>
            ))
          )}

          <div className="results-action">
            <button
              className="results-action-btn"
              onClick={() => navigate(`/practice?topic=${activeTopic}`)}
            >
              Start Practice →
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default ResultsPage;