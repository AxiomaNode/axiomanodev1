import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/Authorisatisdfa";
import { topics } from "../data/topics";
import "../styles/home.css";

const HomePage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const progress = JSON.parse(localStorage.getItem("axioma_progress") || "{}");
  const completedTopics = Object.keys(progress).filter(k => progress[k]?.diagnosticDone).length;
  const totalStreak = Object.values(progress).reduce((sum, p) => sum + (p.streak || 0), 0);
  const totalTasks = Object.values(progress).reduce((sum, p) => sum + (p.tasksCompleted || 0), 0);

  return (
    <div className="home-page">
      <div className="home-welcome">
        <h1 className="home-greeting">
          Hello, <span>{user?.displayName || "Student"}</span>
        </h1>
        <p className="home-subtitle">
          Choose a topic to start your diagnostic or continue practicing.
        </p>
      </div>

      <div className="home-stats">
        <div className="stat-card">
          <div className="stat-value">{completedTopics}</div>
          <div className="stat-label">Topics Diagnosed</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{totalTasks}</div>
          <div className="stat-label">Tasks Solved</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">🔥 {totalStreak}</div>
          <div className="stat-label">Total Streak</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{topics.length}</div>
          <div className="stat-label">Topics Available</div>
        </div>
      </div>

      <h2 className="home-section-title">Topics</h2>
      <div className="home-topics-grid">
        {topics.map((topic) => {
          const done = progress[topic.id]?.diagnosticDone;
          return (
            <div
              key={topic.id}
              className="topic-card"
              onClick={() => navigate(`/diagnostics?topic=${topic.id}`)}
            >
              <div className="topic-card-icon">{topic.icon}</div>
              <div className="topic-card-title">
                {topic.title} {done && "✓"}
              </div>
              <div className="topic-card-desc">{topic.description}</div>
              <span className={`topic-card-difficulty difficulty-${topic.difficulty}`}>
                {topic.difficulty}
              </span>
            </div>
          );
        })}
      </div>

      <div className="home-cta">
        <div className="home-cta-text">
          <h3>Ready to discover how you think?</h3>
          <p>Start a diagnostic to uncover your reasoning patterns.</p>
        </div>
        <button
          className="home-cta-btn"
          onClick={() => navigate("/diagnostics")}
        >
          Start Diagnostic
        </button>
      </div>
    </div>
  );
};

export default HomePage;