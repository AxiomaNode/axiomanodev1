import { useState, useEffect, useCallback } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { topics } from "../data/topics";
import { tasks } from "../data/tasks";
import "../styles/practice.css";

const shuffle = (arr) => [...arr].sort(() => Math.random() - 0.5);

const PracticePage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const preselected = searchParams.get("topic");

  const [activeTopic, setActiveTopic] = useState(preselected || "");
  const [taskQueue, setTaskQueue] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [totalAnswered, setTotalAnswered] = useState(0);
  const [done, setDone] = useState(false);

  const buildQueue = useCallback((topicId) => {
    const topicTasks = tasks[topicId];
    if (!topicTasks) return [];

    const progress = JSON.parse(localStorage.getItem("axioma_progress") || "{}");
    const detectedGaps = progress[topicId]?.gaps || [];

    let prioritized = [];
    let others = [];

    Object.entries(topicTasks).forEach(([gapId, gapTasks]) => {
      if (detectedGaps.includes(gapId)) {
        prioritized.push(...gapTasks);
      } else {
        others.push(...gapTasks);
      }
    });

    return [...shuffle(prioritized), ...shuffle(others)];
  }, []);

  useEffect(() => {
    if (activeTopic) {
      const queue = buildQueue(activeTopic);
      setTaskQueue(queue);
      setCurrentIndex(0);
      setSelectedAnswer(null);
      setShowResult(false);
      setStreak(0);
      setBestStreak(0);
      setCorrectCount(0);
      setTotalAnswered(0);
      setDone(false);
    }
  }, [activeTopic, buildQueue]);

  const currentTask = taskQueue[currentIndex];

  const handleAnswer = (label) => {
    if (showResult) return;
    setSelectedAnswer(label);
    setShowResult(true);
    setTotalAnswered(prev => prev + 1);

    const isCorrect = label === currentTask.correct;
    if (isCorrect) {
      const newStreak = streak + 1;
      setStreak(newStreak);
      setCorrectCount(prev => prev + 1);
      if (newStreak > bestStreak) setBestStreak(newStreak);
    } else {
      setStreak(0);
    }
  };

  const handleNext = () => {
    if (currentIndex < taskQueue.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setSelectedAnswer(null);
      setShowResult(false);
    } else {
      const stored = JSON.parse(localStorage.getItem("axioma_progress") || "{}");
      stored[activeTopic] = {
        ...stored[activeTopic],
        tasksCompleted: (stored[activeTopic]?.tasksCompleted || 0) + totalAnswered,
        streak: Math.max(stored[activeTopic]?.streak || 0, bestStreak),
        lastPractice: new Date().toISOString()
      };
      localStorage.setItem("axioma_progress", JSON.stringify(stored));
      setDone(true);
    }
  };

  if (!activeTopic) {
    return (
      <div className="practice-page">
        <div className="practice-header">
          <h2>Practice</h2>
        </div>
        <div className="practice-topic-select">
          <p>Choose a topic to practice. Tasks are prioritized based on your diagnostic results.</p>
          <div className="practice-topic-list">
            {topics.map((t) => (
              <button
                key={t.id}
                className="practice-topic-btn"
                onClick={() => setActiveTopic(t.id)}
              >
                {t.icon} {t.title}
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (done) {
    return (
      <div className="practice-page">
        <div className="practice-done">
          <h2>Session Complete 🎉</h2>
          <p>Zo'r ish! Mashq yakunlandi.</p>
          <div className="practice-done-stats">
            <div className="practice-done-stat">
              <div className="practice-done-stat-value">{correctCount}/{totalAnswered}</div>
              <div className="practice-done-stat-label">Correct</div>
            </div>
            <div className="practice-done-stat">
              <div className="practice-done-stat-value">🔥 {bestStreak}</div>
              <div className="practice-done-stat-label">Best Streak</div>
            </div>
          </div>
          <button
            className="practice-next-btn"
            style={{ maxWidth: "300px", margin: "0 auto" }}
            onClick={() => {
              setActiveTopic("");
              setDone(false);
            }}
          >
            Practice Another Topic
          </button>
        </div>
      </div>
    );
  }

  if (!currentTask) {
    return (
      <div className="practice-page">
        <div className="practice-done">
          <h2>No tasks available</h2>
          <p>Bu mavzu uchun hozircha topshiriqlar yo'q.</p>
          <button
            className="practice-next-btn"
            style={{ maxWidth: "300px", margin: "1rem auto 0" }}
            onClick={() => navigate("/diagnostics")}
          >
            Run Diagnostic First
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="practice-page">
      <div className="practice-header">
        <h2>Practice</h2>
        <div className="practice-streak">
          <span className="practice-streak-fire">🔥</span>
          <span>{streak}</span>
        </div>
      </div>

      <div className="practice-info">
        {topics.find(t => t.id === activeTopic)?.title} — {currentIndex + 1} / {taskQueue.length}
      </div>

      <div className="practice-card">
        <div className="practice-question-text">{currentTask.text}</div>
        <div className="practice-options">
          {currentTask.options.map((opt) => {
            let className = "practice-option";
            if (showResult) {
              className += " disabled";
              if (opt.label === currentTask.correct) className += " correct";
              else if (opt.label === selectedAnswer && opt.label !== currentTask.correct) className += " wrong";
            } else if (selectedAnswer === opt.label) {
              className += " selected";
            }
            return (
              <div
                key={opt.label}
                className={className}
                onClick={() => handleAnswer(opt.label)}
              >
                <span className="practice-option-label">{opt.label}</span>
                <span>{opt.value}</span>
              </div>
            );
          })}
        </div>

        {showResult && (
          <div className="practice-explanation">
            <div className="practice-explanation-label">Tushuntirish</div>
            <div className="practice-explanation-text">{currentTask.explanation}</div>
          </div>
        )}

        {showResult && (
          <button className="practice-next-btn" onClick={handleNext}>
            {currentIndex === taskQueue.length - 1 ? "Finish" : "Next →"}
          </button>
        )}
      </div>
    </div>
  );
};

export default PracticePage;