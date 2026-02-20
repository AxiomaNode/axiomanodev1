import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Header from "../components/layout/Header";
import Sidebar from "../components/layout/Sidebar";
import { topics } from "../data/topics";
import { questions } from "../data/questions";
import { gapsDatabase } from "../data/gaps";
import "../styles/diagnostics.css";
import "../styles/layout.css";

/* ── Icons ── */
const ChevronRight = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
    <polyline points="9 18 15 12 9 6" />
  </svg>
);
const CheckIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);
const XIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="6" />
  </svg>
);
const AlertIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="8" x2="12" y2="12" />
    <line x1="12" y1="16" x2="12.01" y2="16" />
  </svg>
);

/* ── Detect gaps from user's answers ── */
const detectGaps = (topicId, userAnswers) => {
  const topicGaps = gapsDatabase[topicId];
  if (!topicGaps) return [];

  const foundGaps = [];

  topicGaps.forEach(gap => {
    let triggered = false;
    Object.entries(gap.signs).forEach(([questionId, wrongAnswers]) => {
      const userAnswer = userAnswers[questionId];
      if (userAnswer && wrongAnswers.includes(userAnswer)) {
        triggered = true;
      }
    });
    if (triggered) foundGaps.push(gap);
  });

  return foundGaps;
};

/* ── Difficulty badge ── */
const DiffBadge = ({ difficulty }) => {
  const map = {
    easy:   { label: "Easy",   color: "#27ae60", bg: "rgba(39,174,96,0.1)" },
    medium: { label: "Medium", color: "#d35400", bg: "rgba(211,84,0,0.1)" },
    hard:   { label: "Hard",   color: "#c0392b", bg: "rgba(192,57,43,0.1)" },
  };
  const s = map[difficulty] || map.medium;
  return (
    <span className="diag-diff-badge" style={{ color: s.color, background: s.bg }}>
      {s.label}
    </span>
  );
};

/* ══════════════════════════════════════════
   STEP 1 — Topic selection
══════════════════════════════════════════ */
const TopicSelect = ({ onSelect }) => (
  <div className="diag-step">
    <div className="diag-step__head">
      <p className="diag-step__eyebrow">Step 1 of 3</p>
      <h2 className="diag-step__title">Choose a topic to diagnose</h2>
      <p className="diag-step__sub">
        Axioma will ask you a set of targeted questions to identify exactly where your reasoning breaks.
      </p>
    </div>

    <div className="diag-topic-grid">
      {topics.map(topic => {
        const topicQuestions = questions[topic.id];
        const count = topicQuestions ? topicQuestions.length : 0;
        const hasData = count > 0;

        return (
          <button
            key={topic.id}
            className={`diag-topic-card ${!hasData ? "diag-topic-card--disabled" : ""}`}
            onClick={() => hasData && onSelect(topic)}
            disabled={!hasData}
          >
            <div className="diag-topic-card__top">
              <div className="diag-topic-card__icon">
                <topic.icon />           {/* ← FIXED: render as component */}
              </div>
              <DiffBadge difficulty={topic.difficulty} />
            </div>
            <h3 className="diag-topic-card__title">{topic.title}</h3>
            <p className="diag-topic-card__desc">{topic.description}</p>
            <div className="diag-topic-card__footer">
              <span>{hasData ? `${count} questions` : "Coming soon"}</span>
              {hasData && <ChevronRight />}
            </div>
          </button>
        );
      })}
    </div>
  </div>
);

/* ══════════════════════════════════════════
   STEP 2 — Questions
══════════════════════════════════════════ */
const QuestionStep = ({ topic, onFinish }) => {
  const topicQuestions = questions[topic.id] || [];

  // Guard against empty topic
  if (!topicQuestions.length) {
    return (
      <div className="diag-step">
        <div className="diag-empty">
          <AlertIcon />
          <h3>No questions available</h3>
          <p>This topic doesn't have any questions yet. Please choose another one.</p>
        </div>
      </div>
    );
  }

  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState(null);
  const [confirmed, setConfirmed] = useState(false);
  const [answers, setAnswers] = useState({});

  const q = topicQuestions[current];
  const progress = ((current + 1) / topicQuestions.length) * 100; // ← FIXED: better UX
  const isCorrect = selected === q?.correct;

  const handleConfirm = () => {
    if (!selected) return;
    setConfirmed(true);
    setAnswers(prev => ({ ...prev, [q.id]: selected }));
  };

  const handleNext = () => {
    // Always save the current selection if it exists (fixes last-question loss)
    let nextAnswers = { ...answers };
    if (selected !== null) {
      nextAnswers[q.id] = selected;
    }

    if (current + 1 >= topicQuestions.length) {
      onFinish(nextAnswers);
    } else {
      setCurrent(c => c + 1);
      setSelected(null);
      setConfirmed(false);
    }
  };

  return (
    <div className="diag-step">
      {/* Progress */}
      <div className="diag-progress">
        <div className="diag-progress__track">
          <div className="diag-progress__fill" style={{ width: `${progress}%` }} />
        </div>
        <span className="diag-progress__label">{current + 1} / {topicQuestions.length}</span>
      </div>

      <div className="diag-question-card">
        <p className="diag-question-card__meta">{topic.title} — Question {current + 1}</p>
        <h3 className="diag-question-card__text">{q.text}</h3>

        <div className="diag-options">
          {q.options.map(opt => {
            let state = "";
            if (confirmed) {
              if (opt.value === q.correct) state = "correct";
              else if (opt.value === selected && selected !== q.correct) state = "wrong";
            } else if (opt.value === selected) {
              state = "selected";
            }

            return (
              <button
                key={opt.value}
                className={`diag-option diag-option--${state || "default"}`}
                onClick={() => !confirmed && setSelected(opt.value)}
                disabled={confirmed}
              >
                <span className="diag-option__letter">{opt.label}</span>
                <span className="diag-option__text">{opt.value}</span>
                {confirmed && opt.value === q.correct && (
                  <span className="diag-option__icon diag-option__icon--correct"><CheckIcon /></span>
                )}
                {confirmed && opt.value === selected && selected !== q.correct && (
                  <span className="diag-option__icon diag-option__icon--wrong"><XIcon /></span>
                )}
              </button>
            );
          })}
        </div>

        {/* Feedback after confirm */}
        {confirmed && (
          <div className={`diag-feedback diag-feedback--${isCorrect ? "correct" : "wrong"}`}>
            {isCorrect ? <CheckIcon /> : <XIcon />}
            <p>{isCorrect ? "Correct!" : `Correct answer: ${q.correct}`}</p>
          </div>
        )}

        <div className="diag-question-card__actions">
          {!confirmed ? (
            <button
              className="diag-btn diag-btn--primary"
              onClick={handleConfirm}
              disabled={!selected}
            >
              Confirm Answer
            </button>
          ) : (
            <button className="diag-btn diag-btn--primary" onClick={handleNext}>
              {current + 1 >= topicQuestions.length ? "See Results" : "Next Question"}
              <ChevronRight />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

/* ══════════════════════════════════════════
   STEP 3 — Results
══════════════════════════════════════════ */
const ResultsStep = ({ topic, answers, onRetry, onDone }) => {
  const topicQuestions = questions[topic.id] || [];
  const correctCount = topicQuestions.filter(q => answers[q.id] === q.correct).length;
  const total = topicQuestions.length;
  const pct = total > 0 ? Math.round((correctCount / total) * 100) : 0;
  const gaps = detectGaps(topic.id, answers);

  const scoreColor = pct >= 70 ? "#27ae60" : pct >= 40 ? "#d35400" : "#c0392b";

  return (
    <div className="diag-step">
      <div className="diag-results">
        {/* Score header */}
        <div className="diag-results__score-card">
          <div className="diag-results__score-ring" style={{ "--score-color": scoreColor }}>
            <svg viewBox="0 0 100 100" className="diag-ring-svg">
              <circle cx="50" cy="50" r="42" fill="none" stroke="var(--border)" strokeWidth="8" />
              <circle
                cx="50" cy="50" r="42" fill="none"
                stroke={scoreColor} strokeWidth="8"
                strokeDasharray={`${pct * 2.64} 264`}
                strokeLinecap="round"
                transform="rotate(-90 50 50)"
              />
            </svg>
            <div className="diag-ring-label">
              <strong style={{ color: scoreColor }}>{pct}%</strong>
              <span>{correctCount}/{total}</span>
            </div>
          </div>

          <div className="diag-results__score-info">
            <p className="diag-results__score-eyebrow">{topic.title}</p>
            <h3 className="diag-results__score-title">
              {pct >= 70 ? "Strong performance" : pct >= 40 ? "Partial understanding" : "Significant gaps found"}
            </h3>
            <p className="diag-results__score-sub">
              You answered {correctCount} out of {total} questions correctly.
              {gaps.length > 0
                ? ` ${gaps.length} reasoning gap${gaps.length > 1 ? "s" : ""} identified.`
                : " No major gaps detected in this topic."
              }
            </p>
          </div>
        </div>

        {/* Gaps */}
        {gaps.length > 0 ? (
          <div className="diag-gaps">
            <h4 className="diag-gaps__title">
              <AlertIcon />
              Identified reasoning gaps
            </h4>
            <div className="diag-gaps__list">
              {gaps.map(gap => (
                <div key={gap.id} className="diag-gap-card">
                  <div className="diag-gap-card__head">
                    <span className="diag-gap-card__label">Gap identified</span>
                    <h5 className="diag-gap-card__title">{gap.title}</h5>
                  </div>
                  <p className="diag-gap-card__desc">{gap.description}</p>
                  <div className="diag-gap-card__rec">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
                    </svg>
                    <p>{gap.recommendation}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="diag-no-gaps">
            <CheckIcon />
            <p>No significant gaps detected. Try a harder topic or run the diagnostic again.</p>
          </div>
        )}

        {/* Answer review */}
        <div className="diag-review">
          <h4 className="diag-review__title">Answer Review</h4>
          <div className="diag-review__list">
            {topicQuestions.map((q, i) => {
              const userAns = answers[q.id];
              const correct = userAns === q.correct;
              return (
                <div key={q.id} className={`diag-review__row ${correct ? "diag-review__row--correct" : "diag-review__row--wrong"}`}>
                  <span className="diag-review__num">{i + 1}</span>
                  <div className="diag-review__content">
                    <p className="diag-review__question">{q.text}</p>
                    {!correct && (
                      <p className="diag-review__answer">
                        <span>Your answer: <em>{userAns || "—"}</em></span>
                        <span>Correct: <strong>{q.correct}</strong></span>
                      </p>
                    )}
                  </div>
                  <span className={`diag-review__icon ${correct ? "diag-review__icon--ok" : "diag-review__icon--err"}`}>
                    {correct ? <CheckIcon /> : <XIcon />}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Actions */}
        <div className="diag-results__actions">
          <button className="diag-btn diag-btn--ghost" onClick={onRetry}>
            Retry this topic
          </button>
          <Link to="/practice" className="diag-btn diag-btn--primary">
            Go to Practice
            <ChevronRight />
          </Link>
          <button className="diag-btn diag-btn--ghost" onClick={onDone}>
            Back to Topics
          </button>
        </div>
      </div>
    </div>
  );
};

/* ══════════════════════════════════════════
   MAIN PAGE
══════════════════════════════════════════ */
const DiagnosticsPage = () => {
  const { user } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [step, setStep] = useState("select"); // select | questions | results
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [finalAnswers, setFinalAnswers] = useState({});

  const handleTopicSelect = (topic) => {
    setSelectedTopic(topic);
    setStep("questions");
  };

  const handleFinish = (answers) => {
    setFinalAnswers(answers);

    // Save to localStorage
    const result = {
      topicId: selectedTopic.id,
      topicTitle: selectedTopic.title,
      date: new Date().toISOString(),
      answers,
      gaps: detectGaps(selectedTopic.id, answers),
      score: {
        correct: Object.entries(answers).filter(([qId, ans]) => {
          const q = (questions[selectedTopic.id] || []).find(q => q.id === qId);
          return q && q.correct === ans;
        }).length,
        total: (questions[selectedTopic.id] || []).length,
      }
    };

    const existing = JSON.parse(localStorage.getItem("axioma-diagnostics") || "[]");
    existing.unshift(result);
    localStorage.setItem("axioma-diagnostics", JSON.stringify(existing.slice(0, 50)));

    setStep("results");
  };

  const handleRetry = () => {
    setFinalAnswers({});
    setStep("questions");
  };

  const handleDone = () => {
    setSelectedTopic(null);
    setFinalAnswers({});
    setStep("select");
  };

  return (
    <div className="page-shell">
      <Header sidebarOpen={sidebarOpen} onToggleSidebar={() => setSidebarOpen(v => !v)} />
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <main className="page-main">
        <div className="diag-page">

          {/* Breadcrumb */}
          <div className="diag-breadcrumb">
            <Link to="/home" className="diag-breadcrumb__item">Home</Link>
            <ChevronRight />
            <span className="diag-breadcrumb__item diag-breadcrumb__item--active">Diagnostics</span>
            {selectedTopic && (
              <>
                <ChevronRight />
                <span className="diag-breadcrumb__item diag-breadcrumb__item--active">{selectedTopic.title}</span>
              </>
            )}
          </div>

          {/* Page header */}
          <div className="diag-header">
            <div className="diag-header__icon">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
            </div>
            <div>
              <h1 className="diag-header__title">Diagnostics</h1>
              <p className="diag-header__sub">Identify your reasoning gaps across mathematical thinking blocks.</p>
            </div>
          </div>

          {/* Steps */}
          {step === "select" && <TopicSelect onSelect={handleTopicSelect} />}
          {step === "questions" && selectedTopic && (
            <QuestionStep
              topic={selectedTopic}
              onFinish={handleFinish}
            />
          )}
          {step === "results" && selectedTopic && (
            <ResultsStep
              topic={selectedTopic}
              answers={finalAnswers}
              onRetry={handleRetry}
              onDone={handleDone}
            />
          )}
        </div>
      </main>
    </div>
  );
};

export default DiagnosticsPage;