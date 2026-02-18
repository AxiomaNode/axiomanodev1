import { useState, useEffect } from "react";
import { topics } from "../data/topics";
import "../styles/progress.css";

const ProgressPage = () => {
  const [progress, setProgress] = useState({});

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("axioma_progress") || "{}");
    setProgress(stored);
  }, []);

  const completedTopics = Object.keys(progress).filter(k => progress[k]?.diagnosticDone).length;
  const totalTasks = Object.values(progress).reduce((sum, p) => sum + (p.tasksCompleted || 0), 0);
  const maxStreak = Object.values(progress).reduce((max, p) => Math.max(max, p.streak || 0), 0);
  const totalGaps = Object.values(progress).reduce((sum, p) => sum + (p.gaps?.length || 0), 0);

  return (
    <div className="progress-page">
      <div className="progress-header">
        <h2>Progress</h2>
        <p>Track your learning journey across all topics.</p>
      </div>

      <div className="progress-overview">
        <div className="progress-stat">
          <div className="progress-stat-value">{completedTopics}/{topics.length}</div>
          <div className="progress-stat-label">Topics Diagnosed</div>
        </div>
        <div className="progress-stat">
          <div className="progress-stat-value">{totalTasks}</div>
          <div className="progress-stat-label">Tasks Solved</div>
        </div>
        <div className="progress-stat">
          <div className="progress-stat-value">🔥 {maxStreak}</div>
          <div className="progress-stat-label">Best Streak</div>
        </div>
        <div className="progress-stat">
          <div className="progress-stat-value">{totalGaps}</div>
          <div className="progress-stat-label">Gaps Found</div>
        </div>
      </div>

      <h3 className="progress-topics-title">Topics Breakdown</h3>

      {topics.map((topic) => {
        const tp = progress[topic.id] || {};
        const isDone = tp.diagnosticDone;
        const gapCount = tp.gaps?.length || 0;
        const tasksCount = tp.tasksCompleted || 0;
        const streakVal = tp.streak || 0;

        return (
          <div key={topic.id} className="progress-topic-card">
            <div className="progress-topic-icon">{topic.icon}</div>
            <div className="progress-topic-info">
              <div className="progress-topic-name">{topic.title}</div>
              <div className="progress-topic-meta">
                <span>{gapCount} gaps</span>
                <span>{tasksCount} tasks</span>
                <span>🔥 {streakVal}</span>
              </div>
              <div className="progress-topic-bar">
                <div
                  className="progress-topic-bar-fill"
                  style={{ width: isDone ? `${Math.min(100, (tasksCount / Math.max(gapCount * 3, 3)) * 100)}%` : "0%" }}
                />
              </div>
            </div>
            <div className="progress-topic-status">
              <span className={`progress-badge ${isDone ? "done" : "pending"}`}>
                {isDone ? "Diagnosed" : "Not started"}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ProgressPage;