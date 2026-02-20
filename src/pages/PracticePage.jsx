// src/pages/PracticePage.jsx
import { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import Header from "../components/layout/Header";
import Sidebar from "../components/layout/Sidebar";
import { topics } from "../data/topics";
import { tasks } from "../data/tasks";
import "../styles/practice.css";
import "../styles/layout.css";

const ChevronRight = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
  >
    <polyline points="9 18 15 12 9 6" />
  </svg>
);

const CheckIcon = () => (
  <svg
    width="15"
    height="15"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
  >
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

const XIcon = () => (
  <svg
    width="15"
    height="15"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
  >
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

const AlertIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="8" x2="12" y2="12" />
    <line x1="12" y1="16" x2="12.01" y2="16" />
  </svg>
);

const savePracticeSession = (topicId, subtopicKey, scoreData) => {
  const session = { topicId, subtopicKey, date: new Date().toISOString(), ...scoreData };
  const existing = JSON.parse(localStorage.getItem("axioma-practice") || "[]");
  existing.unshift(session);
  localStorage.setItem("axioma-practice", JSON.stringify(existing.slice(0, 100)));
};

const buildGapRecs = () => {
  const diagnostics = JSON.parse(localStorage.getItem("axioma-diagnostics") || "[]");
  if (!diagnostics.length) return [];
  const latest = diagnostics[0];
  if (!latest.gaps?.length) return [];
  const found = [];
  latest.gaps.forEach((gap) => {
    const topicTasks = tasks[latest.topicId];
    if (topicTasks?.[gap.id]) {
      const topic = topics.find((t) => t.id === latest.topicId);
      found.push({
        topicId: latest.topicId,
        topicTitle: latest.topicTitle,
        topicIcon: topic?.icon,
        subtopicKey: gap.id,
        gapTitle: gap.title,
        taskList: topicTasks[gap.id],
      });
    }
  });
  return found;
};

const buildTopicTaskList = (topicId) => {
  const topicTasks = tasks[topicId];
  if (!topicTasks) return [];
  const entries = Object.entries(topicTasks);
  entries.sort(([a], [b]) => a.localeCompare(b));
  return entries.flatMap(([, list]) => list || []);
};

const formatKey = (key) => {
  if (!key) return "Full topic";
  return key.charAt(0).toUpperCase() + key.slice(1).replace(/_/g, " ");
};

const GapBanner = ({ recs, onJump }) => {
  if (!recs.length) return null;
  return (
    <div className="practice-gap-banner">
      <div className="practice-gap-banner__head">
        <AlertIcon />
        <h4>Based on your last diagnostic</h4>
        <span>Recommended practice to close your gaps</span>
      </div>
      <div className="practice-gap-banner__tags">
        {recs.map((rec, i) => (
          <button key={i} className="practice-gap-tag" onClick={() => onJump(rec)}>
            <AlertIcon />
            {rec.topicIcon && <rec.topicIcon size={16} strokeWidth={2.5} />}
            {rec.gapTitle}
          </button>
        ))}
      </div>
      <p className="practice-gap-banner__hint">Click a gap above to jump straight into targeted practice exercises.</p>
    </div>
  );
};

const TopicSelect = ({ onStartTopic }) => {
  const availableTopics = useMemo(() => topics.filter((t) => tasks[t.id]), []);
  return (
    <div className="practice-step">
      <div className="practice-step__head">
        <p className="practice-step__eyebrow">Practice Mode</p>
        <h2 className="practice-step__title">Choose a topic</h2>
        <p className="practice-step__sub">Tap a topic to practise all exercises in that topic.</p>
      </div>

      <div className="practice-topic-grid">
        {availableTopics.map((topic) => {
          const count = buildTopicTaskList(topic.id).length;
          return (
            <button key={topic.id} className="practice-topic-card" onClick={() => onStartTopic(topic)}>
              <div className="practice-topic-card__left">
                <span className="practice-topic-card__icon">{topic.icon ? <topic.icon size={22} /> : "?"}</span>
                <div className="practice-topic-card__text">
                  <h3 className="practice-topic-card__title">{topic.title}</h3>
                  <p className="practice-topic-card__desc">{topic.description}</p>
                </div>
              </div>
              <div className="practice-topic-card__right">
                <span className="practice-topic-card__count">{count} exercises</span>
                <ChevronRight />
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

const PracticeSession = ({ topic, subtopicKey, taskList, onFinish }) => {
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState(null);
  const [confirmed, setConfirmed] = useState(false);
  const [score, setScore] = useState({ correct: 0, wrong: 0 });

  const task = taskList[current];
  const isCorrect = selected === task?.correct;

  const handleConfirm = () => {
    if (!selected) return;
    setConfirmed(true);
    setScore((s) => ({
      correct: s.correct + (selected === task.correct ? 1 : 0),
      wrong: s.wrong + (selected !== task.correct ? 1 : 0),
    }));
  };

  const handleNext = () => {
    if (current + 1 >= taskList.length) {
      const final = {
        correct: score.correct + (isCorrect ? 1 : 0),
        wrong: score.wrong + (!isCorrect ? 1 : 0),
        total: taskList.length,
      };
      savePracticeSession(topic.id, subtopicKey || "all", final);
      onFinish(final);
    } else {
      setCurrent((c) => c + 1);
      setSelected(null);
      setConfirmed(false);
    }
  };

  if (!task) return null;
  const progress = (current / taskList.length) * 100;

  return (
    <div className="practice-step">
      <div className="practice-session-head">
        <div className="practice-session-head__info">
          <span className="practice-session-head__topic">
            {topic.icon && <topic.icon size={20} />} {topic.title}
          </span>
          <span className="practice-session-head__sub">{formatKey(subtopicKey)}</span>
        </div>
        <span className="practice-session-head__counter">
          {current + 1} / {taskList.length}
        </span>
      </div>

      <div className="practice-progress">
        <div className="practice-progress__track">
          <div className="practice-progress__fill" style={{ width: `${progress}%` }} />
        </div>
      </div>

      <div className="practice-task-card">
        <p className="practice-task-card__num">Exercise {current + 1}</p>
        <h3 className="practice-task-card__text">{task.text}</h3>

        <div className="practice-options">
          {task.options.map((opt) => {
            let state = "";
            if (confirmed) {
              if (opt.label === task.correct) state = "correct";
              else if (opt.label === selected && selected !== task.correct) state = "wrong";
            } else if (opt.label === selected) state = "selected";

            return (
              <button
                key={opt.label}
                className={`practice-option practice-option--${state || "default"}`}
                onClick={() => !confirmed && setSelected(opt.label)}
                disabled={confirmed}
              >
                <span className="practice-option__letter">{opt.label}</span>
                <span className="practice-option__text">{opt.value}</span>
                {confirmed && opt.label === task.correct && (
                  <span className="practice-option__icon practice-option__icon--ok">
                    <CheckIcon />
                  </span>
                )}
                {confirmed && opt.label === selected && selected !== task.correct && (
                  <span className="practice-option__icon practice-option__icon--err">
                    <XIcon />
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {confirmed && (
          <div className={`practice-feedback practice-feedback--${isCorrect ? "correct" : "wrong"}`}>
            <div className="practice-feedback__icon">{isCorrect ? <CheckIcon /> : <XIcon />}</div>
            <div>
              <p className="practice-feedback__verdict">{isCorrect ? "Correct!" : "Not quite."}</p>
              <p className="practice-feedback__explanation">{task.explanation}</p>
            </div>
          </div>
        )}

        <div className="practice-task-card__actions">
          {!confirmed ? (
            <button className="practice-btn practice-btn--primary" onClick={handleConfirm} disabled={!selected}>
              Check Answer
            </button>
          ) : (
            <button className="practice-btn practice-btn--primary" onClick={handleNext}>
              {current + 1 >= taskList.length ? "See Results" : "Next Exercise"}
              <ChevronRight />
            </button>
          )}
        </div>
      </div>

      <div className="practice-running-score">
        <span className="practice-running-score__correct">
          <CheckIcon /> {score.correct + (confirmed && isCorrect ? 1 : 0)} correct
        </span>
        <span className="practice-running-score__wrong">
          <XIcon /> {score.wrong + (confirmed && !isCorrect ? 1 : 0)} wrong
        </span>
      </div>
    </div>
  );
};

const SessionSummary = ({ topic, subtopicKey, score, onRetry, onNewTopic }) => {
  const pct = Math.round((score.correct / score.total) * 100);
  const color = pct >= 70 ? "#27ae60" : pct >= 40 ? "#d35400" : "#c0392b";
  const circ = 2 * Math.PI * 42;

  return (
    <div className="practice-step">
      <div className="practice-summary">
        <div className="practice-summary__card">
          <div className="practice-summary__ring-wrap">
            <svg viewBox="0 0 100 100" className="practice-ring-svg">
              <circle cx="50" cy="50" r="42" fill="none" stroke="var(--border)" strokeWidth="8" />
              <circle
                cx="50"
                cy="50"
                r="42"
                fill="none"
                stroke={color}
                strokeWidth="8"
                strokeDasharray={`${(pct / 100) * circ} ${circ}`}
                strokeLinecap="round"
                transform="rotate(-90 50 50)"
              />
            </svg>
            <div className="practice-ring-label">
              <strong style={{ color }}>{pct}%</strong>
              <span>
                {score.correct}/{score.total}
              </span>
            </div>
          </div>

          <div className="practice-summary__info">
            <p className="practice-summary__eyebrow">
              {topic.icon && <topic.icon size={18} />} {topic.title}
            </p>
            <h3 className="practice-summary__title">
              {pct >= 70 ? "Great work!" : pct >= 40 ? "Keep going!" : "Needs more practice"}
            </h3>
            <p className="practice-summary__sub">
              {formatKey(subtopicKey)} — {score.correct} correct, {score.wrong} wrong.
            </p>
            <div className="practice-summary__stats">
              <div className="practice-summary__stat">
                <strong style={{ color: "#27ae60" }}>{score.correct}</strong>
                <span>Correct</span>
              </div>
              <div className="practice-summary__stat">
                <strong style={{ color: "#c0392b" }}>{score.wrong}</strong>
                <span>Wrong</span>
              </div>
              <div className="practice-summary__stat">
                <strong>{score.total}</strong>
                <span>Total</span>
              </div>
            </div>
          </div>
        </div>

        <div className="practice-summary__actions">
          <button className="practice-btn practice-btn--ghost" onClick={onRetry}>
            Retry
          </button>
          <Link to="/diagnostics" className="practice-btn practice-btn--primary">
            Run Diagnostic <ChevronRight />
          </Link>
          <button className="practice-btn practice-btn--ghost" onClick={onNewTopic}>
            Choose another topic
          </button>
        </div>
      </div>
    </div>
  );
};

const PracticePage = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [step, setStep] = useState("select");
  const [topic, setTopic] = useState(null);
  const [subtopicKey, setSubtopicKey] = useState(null);
  const [taskList, setTaskList] = useState([]);
  const [sessionScore, setSessionScore] = useState(null);
  const [gapRecs, setGapRecs] = useState([]);

  useEffect(() => {
    setGapRecs(buildGapRecs());
  }, []);

  const handleStartTopic = (t) => {
    setTopic(t);
    setSubtopicKey(null);
    setTaskList(buildTopicTaskList(t.id));
    setStep("practice");
  };

  const handleJumpGap = (rec) => {
    const t = topics.find((x) => x.id === rec.topicId);
    if (!t) return;
    setTopic(t);
    setSubtopicKey(rec.subtopicKey);
    setTaskList(rec.taskList);
    setStep("practice");
  };

  const handleFinish = (score) => {
    setSessionScore(score);
    setStep("summary");
  };

  const handleRetry = () => {
    setSessionScore(null);
    setStep("practice");
  };

  const handleNewTopic = () => {
    setTopic(null);
    setSubtopicKey(null);
    setTaskList([]);
    setSessionScore(null);
    setStep("select");
  };

  return (
    <div className="page-shell">
      <Header sidebarOpen={sidebarOpen} onToggleSidebar={() => setSidebarOpen((v) => !v)} />
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <main className="page-main">
        <div className="practice-page">
          <div className="practice-breadcrumb">
            <Link to="/home" className="practice-breadcrumb__item">
              Home
            </Link>
            <ChevronRight />
            <span className="practice-breadcrumb__item practice-breadcrumb__item--active">Practice</span>
            {topic && (
              <>
                <ChevronRight />
                <span className="practice-breadcrumb__item practice-breadcrumb__item--active">{topic.title}</span>
              </>
            )}
          </div>

          <div className="practice-header">
            <div className="practice-header__icon">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path d="M12 20h9" />
                <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
              </svg>
            </div>
            <div>
              <h1 className="practice-header__title">Practice</h1>
              <p className="practice-header__sub">Targeted exercises to sharpen your reasoning in each block.</p>
            </div>
          </div>

          {step === "select" && <GapBanner recs={gapRecs} onJump={handleJumpGap} />}
          {step === "select" && <TopicSelect onStartTopic={handleStartTopic} />}

          {step === "practice" && topic && (
            <PracticeSession
              key={`${topic.id}-${subtopicKey || "all"}`}
              topic={topic}
              subtopicKey={subtopicKey}
              taskList={taskList}
              onFinish={handleFinish}
            />
          )}

          {step === "summary" && topic && sessionScore && (
            <SessionSummary
              topic={topic}
              subtopicKey={subtopicKey}
              score={sessionScore}
              onRetry={handleRetry}
              onNewTopic={handleNewTopic}
            />
          )}
        </div>
      </main>
    </div>
  );
};

export default PracticePage;