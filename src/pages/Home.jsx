import { useNavigate } from "react-router-dom";
import { logoutUser } from "../firebase/auth";
import logo from "../img/axiomalogo.png";

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="app-layout">
      <aside className="sidebar">
        <div className="sidebar-logo">
          <img src={logo} alt="Axioma logo" />
          <span>Axioma</span>
        </div>

        <nav className="sidebar-nav">
          <button
            className="sidebar-item"
            onClick={() => navigate("/diagnostics")}
          >
            🧠 Dignostics
          </button>

          <button className="sidebar-item">
            📊 My progress
          </button>

          <button className="sidebar-item">
            🧩 Puzzles
          </button>
        </nav>

        <button className="logout-btn" onClick={logoutUser}>
          Leave
        </button>
      </aside>

      <div className="main">
        <header className="topbar">
          <h1>Home</h1>

          <div className="topbar-links">
            <span>Support</span>
            <span>About project</span>
          </div>
        </header>

        <section className="content">
          <div className="card-box">
            <h2>WELCOME👋</h2>
            <p>
             This section will help identify gaps in the topic
              real foundation and build further training.
            </p>
          </div>

          <div className="stats-grid">
            <div className="stat-card">
              <h3>Diagnostic📊</h3>
              <p>
               Take the test to find out where they arise
                difficulties.
              </p>
              <button
                onClick={() => navigate("/diagnostics")}
              >
                Start
              </button>
            </div>

            <div className="stat-card">
              <h3>My results🔥</h3>
              <p>
                Take a look at the types of gaps and recommendations identified.
              </p>
              <button
                onClick={() => navigate("/results")}
              >
                Open
              </button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
