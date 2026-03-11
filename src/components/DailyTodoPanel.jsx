import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getDailyPlan } from "../services/systemTodos";
import "./daily-todo-panel.css";

// ── Ring — mirrors ScoreRing from ResultsPage, teal only ─────────────────────
const TodoRing = ({ progress, target }) => {
  const pct  = target > 0 ? Math.round((progress / target) * 100) : 0;
  const r    = 52;
  const circ = 2 * Math.PI * r;
  const dash = (pct / 100) * circ;

  return (
    <div className="todo-ring-wrap">
      <svg viewBox="0 0 130 130" className="todo-ring-svg">
        <defs>
          <filter id="todo-ring-glow">
            <feGaussianBlur stdDeviation="3" result="blur"/>
            <feMerge>
              <feMergeNode in="blur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
        {/* track */}
        <circle cx="65" cy="65" r={r} fill="none"
          stroke="var(--border)" strokeWidth="9"/>
        {/* glow layer */}
        {pct > 0 && (
          <circle cx="65" cy="65" r={r} fill="none"
            stroke="var(--teal)" strokeWidth="9"
            strokeDasharray={`${dash} ${circ}`}
            strokeLinecap="round"
            transform="rotate(-90 65 65)"
            opacity="0.25"
            filter="url(#todo-ring-glow)"
          />
        )}
        {/* main arc */}
        <circle cx="65" cy="65" r={r} fill="none"
          stroke="var(--teal)" strokeWidth="9"
          strokeDasharray={`${dash} ${circ}`}
          strokeLinecap="round"
          transform="rotate(-90 65 65)"
          style={{ transition: "stroke-dashoffset 0.6s cubic-bezier(0.4,0,0.2,1)" }}
        />
      </svg>
      <div className="todo-ring-center">
        <strong>{pct}%</strong>
        <span>{progress}/{target}</span>
      </div>
    </div>
  );
};

// ── Single card ───────────────────────────────────────────────────────────────
const PlanCard = ({ item }) => {
  const navigate = useNavigate();
  const progress = item.progress ?? (item.completed ? item.target : 0);
  const target   = item.target   ?? 1;
  const dest     = item.type === "diagnostic" ? "/diagnostics" : "/practice";

  return (
    <button
      className={`todo-card${item.completed ? " todo-card--done" : ""}`}
      onClick={() => !item.completed && navigate(dest)}
      disabled={item.completed}
    >
      <div className="todo-card__accent" />
      <TodoRing progress={progress} target={target} />
      <span className="todo-card__type">
        {item.type === "diagnostic" ? "Diagnostic" : "Practice"}
      </span>
      <p className="todo-card__title">{item.title}</p>
      <span className={`todo-card__xp${item.completed ? " todo-card__xp--earned" : ""}`}>
        {item.completed ? `+${item.xp} XP earned` : `+${item.xp} XP`}
      </span>
    </button>
  );
};

// ── Panel ─────────────────────────────────────────────────────────────────────
const DailyTodoPanel = () => {
  const { user }              = useAuth();
  const [plan, setPlan]       = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.uid) { setLoading(false); return; }
    getDailyPlan(user.uid)
      .then(setPlan)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [user?.uid]);

  const allDone = plan.length > 0 && plan.every((i) => i.completed);

  return (
    <div className="todo-panel">
      <div className="todo-panel__header">
        <div className="todo-panel__eyebrow">
          <span className="todo-panel__eyebrow-dot" />
          Today's Plan
        </div>
        {!loading && allDone && (
          <span className="todo-panel__done-badge">All done ✓</span>
        )}
      </div>
      <div className="todo-panel__cards">
        {loading
          ? [1, 2].map((i) => <div key={i} className="todo-card todo-card--skeleton" />)
          : plan.map((item) => <PlanCard key={item.id} item={item} />)
        }
      </div>
    </div>
  );
};

export default DailyTodoPanel;