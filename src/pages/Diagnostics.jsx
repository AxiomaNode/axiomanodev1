import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { diagnosticQuestions } from "../diagnostics/questions";
import { topics } from "../diagnostics/topics";

export default function Diagnostics() {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const [answers, setAnswers] = useState({});
  const [currentSection, setCurrentSection] = useState(0);
  const [topicId, setTopicId] = useState(null);
  const [startTime] = useState(Date.now());

  useEffect(() => {
    const savedTopic = localStorage.getItem("currentTopic");
    if (!savedTopic) {
      navigate("/");
      return;
    }
    setTopicId(savedTopic);
  }, [navigate]);

  if (!topicId || !diagnosticQuestions[topicId]) {
    return null;
  }

  const topic = topics.find(t => t.id === topicId);
  const sections = diagnosticQuestions[topicId].sections;

  const setAnswer = (id, value) => {
    setAnswers((prev) => ({ ...prev, [id]: value }));
  };

  const submit = () => {
    const timeSpent = Math.floor((Date.now() - startTime) / 1000 / 60);
    
    localStorage.setItem(`diagnostic_${topicId}_answers`, JSON.stringify(answers));
    localStorage.setItem(`diagnostic_${topicId}_completed`, "true");
    localStorage.setItem(`diagnostic_${topicId}_time`, timeSpent.toString());
    
    // Update total time
    const currentTotal = parseInt(localStorage.getItem("totalTime") || "0");
    localStorage.setItem("totalTime", (currentTotal + timeSpent).toString());
    
    navigate("/results");
  };

  const progress = Math.round(
    (Object.keys(answers).length / 
    sections.reduce((acc, s) => acc + s.questions.length, 0)) * 100
  );

  return (
    <div className="page-center">
      <div className="panel diagnostic-panel">
        <div className="diagnostic-header">
          <button 
            className="back-btn"
            onClick={() => navigate("/")}
          >
            ← {t("diagnostics.back")}
          </button>
          
          <div className="topic-badge">
            <span className="topic-icon">{topic.icon}</span>
            <span>{topic.title[i18n.language] || topic.title.en}</span>
          </div>
        </div>

        <h1>{t("diagnostics.title")}</h1>
        <p className="subtitle">{t("diagnostics.subtitle")}</p>

        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${progress}%` }}>
            <span className="progress-text">{progress}%</span>
          </div>
        </div>

        <div className="section-tabs">
          {sections.map((section, idx) => (
            <button
              key={section.id}
              className={`tab-btn ${currentSection === idx ? "active" : ""}`}
              onClick={() => setCurrentSection(idx)}
            >
              {section.title[i18n.language] || section.title.en}
            </button>
          ))}
        </div>

        <Section section={sections[currentSection]} lang={i18n.language}>
          {sections[currentSection].questions.map((q) => (
            <Question
              key={q.id}
              question={q}
              lang={i18n.language}
              onSelect={setAnswer}
              selected={answers[q.id]}
            />
          ))}
        </Section>

        <div className="diagnostic-footer">
          <button
            className="nav-btn"
            onClick={() => setCurrentSection(Math.max(0, currentSection - 1))}
            disabled={currentSection === 0}
          >
            ← {t("diagnostics.previous")}
          </button>

          {currentSection < sections.length - 1 ? (
            <button
              className="nav-btn primary"
              onClick={() => setCurrentSection(currentSection + 1)}
            >
              {t("diagnostics.next")} →
            </button>
          ) : (
            <button 
              className="primary-btn" 
              onClick={submit}
              disabled={Object.keys(answers).length === 0}
            >
              {t("diagnostics.finish_button")}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function Section({ section, lang, children }) {
  return (
    <section className="section diagnostic-section">
      <h2 className="section-name">{section.title[lang] || section.title.en}</h2>
      <div className="questions-container">
        {children}
      </div>
    </section>
  );
}

function Question({ question, lang, onSelect, selected }) {
  const options = question.options[lang] || question.options.en;

  return (
    <div className="question-card">
      <p className="question-text">{question.text[lang] || question.text.en}</p>

      <div className="options">
        {options.map((option) => (
          <label 
            key={option} 
            className={`option-card ${selected === option ? "selected" : ""}`}
          >
            <input
              type="radio"
              name={question.id}
              checked={selected === option}
              onChange={() => onSelect(question.id, option)}
            />
            <span>{option}</span>
            {selected === option && <span className="check-icon">✓</span>}
          </label>
        ))}
      </div>
    </div>
  );
}