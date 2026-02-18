import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { topics } from "../data/topics";
import { questions } from "../data/questions";
import { gapsDatabase } from "../data/gaps";
import "../styles/diagnostics.css";

const DiagnosticsPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const preselected = searchParams.get("topic");

  const [selectedTopic, setSelectedTopic] = useState(preselected || "");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [complete, setComplete] = useState(false);

  const topicQuestions = selectedTopic ? (questions[selectedTopic] || []) : [];
  const currentQuestion = topicQuestions[currentIndex];
  const progress = topicQuestions.length > 0
    ? ((currentIndex + 1) / topicQuestions.length) * 100
    : 0;

  useEffect(() => {
    if (preselected && questions[preselected]) {
      setSelectedTopic(preselected);
    }
  }, [preselected]);

  const handleSelect = (value) => {
    setAnswers({ ...answers, [currentQuestion.id]: value });
  };

  const handleNext = () => {
    if (currentIndex < topicQuestions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      analyzeDiagnostics();
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const analyzeDiagnostics = () => {
    const topicGaps = gapsDatabase[selectedTopic] || [];
    const detectedGaps = [];

    topicGaps.forEach((gap) => {
      let triggered = false;
      Object.entries(gap.signs).forEach(([questionId, triggerValues]) => {
        const userAnswer = answers[questionId];
        if (userAnswer && triggerValues.includes(userAnswer)) {
          triggered = true;
        }
      });
      if (triggered) {
        detectedGaps.push(gap);
      }
    });

    const stored = JSON.parse(localStorage.getItem("axioma_progress") || "{}");
    stored[selectedTopic] = {
      ...stored[selectedTopic],
      diagnosticDone: true,
      answers: answers,
      gaps: detectedGaps.map(g => g.id),
      diagnosticDate: new Date().toISOString()
    };
    localStorage.setItem("axioma_progress", JSON.stringify(stored));

    const storedResults = JSON.parse(localStorage.getItem("axioma_results") || "{}");
    storedResults[selectedTopic] = {
      gaps: detectedGaps,
      answers: answers,
      date: new Date().toISOString()
    };
    localStorage.setItem("axioma_results", JSON.stringify(storedResults));

    setComplete(true);
  };

  if (!selectedTopic) {
    return (
      <div className="diagnostics-page">
        <div className="diag-topic-select">
          <h2>Diagnostic</h2>
          <p>Choose a topic to begin your thinking assessment.</p>
          <div className="diag-topic-list">
            {topics.map((t) => (
              <button
                key={t.id}
                className="diag-topic-btn"
                onClick={() => {
                  setSelectedTopic(t.id);
                  setCurrentIndex(0);
                  setAnswers({});
                  setComplete(false);
                }}
              >
                {t.icon} {t.title}
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (complete) {
    return (
      <div className="diagnostics-page">
        <div className="diag-complete">
          <div className="diag-complete-icon">✨</div>
          <h2>Diagnostic Complete</h2>
          <p>Your thinking profile for this topic has been built.</p>
          <button
            className="diag-complete-btn"
            onClick={() => navigate(`/results?topic=${selectedTopic}`)}
          >
            View Results
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="diagnostics-page">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
        <span style={{ fontSize: "0.8rem", color: "var(--color-text-muted)" }}>
          {topics.find(t => t.id === selectedTopic)?.title}
        </span>
        <span style={{ fontSize: "0.8rem", color: "var(--color-text-muted)" }}>
          {currentIndex + 1} / {topicQuestions.length}
        </span>
      </div>

      <div className="diag-progress-bar">
        <div className="diag-progress-fill" style={{ width: `${progress}%` }} />
      </div>

      <div className="diag-question-card">
        <div className="diag-question-number">
          Savol {currentIndex + 1}
        </div>
        <div className="diag-question-text">
          {currentQuestion.text}
        </div>
        <div className="diag-options">
          {currentQuestion.options.map((opt) => (
            <div
              key={opt.value}
              className={`diag-option ${answers[currentQuestion.id] === opt.value ? "selected" : ""}`}
              onClick={() => handleSelect(opt.value)}
            >
              <span className="diag-option-label">{opt.label}</span>
              <span>{opt.value}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="diag-nav">
        <button
          className="diag-nav-btn secondary"
          onClick={handlePrev}
          disabled={currentIndex === 0}
        >
          ← Back
        </button>
        <button
          className="diag-nav-btn primary"
          onClick={handleNext}
          disabled={!answers[currentQuestion.id]}
        >
          {currentIndex === topicQuestions.length - 1 ? "Finish" : "Next →"}
        </button>
      </div>
    </div>
  );
};

export default DiagnosticsPage;