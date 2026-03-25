import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getDailyPlan } from "../services/systemTodos";
import "./daily-todo-panel.css";

// ── Ring ──────────────────────────────────────────────────────────────────────
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
        <circle cx="65" cy="65" r={r} fill="none" stroke="var(--border)" strokeWidth="9"/>
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

// ── Type metadata ─────────────────────────────────────────────────────────────
const TYPE_META = {
  diagnostic: {
    label: "Diagnostic",
    icon: (
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
        <circle cx="11" cy="11" r="8"/>
        <line x1="21" y1="21" x2="16.65" y2="16.65"/>
      </svg>
    ),
  },
  practice_targeted: {
    label: "Targeted",
    icon: (
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
        <circle cx="12" cy="12" r="10"/>
        <circle cx="12" cy="12" r="4"/>
        <line x1="21.17" y1="8" x2="19" y2="8"/>
        <line x1="2.83" y1="8" x2="5" y2="8"/>
        <line x1="16" y1="2.83" x2="16" y2="5"/>
      </svg>
    ),
  },
  practice_free: {
    label: "Practice",
    icon: (
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
        <path d="M12 20h9"/>
        <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4z"/>
      </svg>
    ),
  },
  puzzles: {
    label: "Puzzle",
    icon: (
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
        <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/>
        <line x1="7" y1="7" x2="7.01" y2="7"/>
      </svg>
    ),
  },
};

// ── Single card ───────────────────────────────────────────────────────────────
const PlanCard = ({ item }) => {
  const navigate = useNavigate();
  const progress = item.progress ?? (item.completed ? item.target : 0);
  const target   = item.target ?? 1;
  const meta     = TYPE_META[item.type] ?? TYPE_META.practice_free;

  const handleClick = () => {
    if (item.completed) return;
    navigate(item.route, item.routeState ? { state: item.routeState } : undefined);
  };

  return (
    <button
      className={`todo-card todo-card--${item.type}${item.completed ? " todo-card--done" : ""}`}
      onClick={handleClick}
      disabled={item.completed}
    >
      <div className="todo-card__accent" />
      <TodoRing progress={progress} target={target} />

      <span className="todo-card__type">
        {meta.icon}
        {meta.label}
        {item.type === "practice_targeted" && (
          <span className="todo-card__type-gap">gap</span>
        )}
      </span>

      <p className="todo-card__title">{item.title}</p>

      {item.description && (
        <p className="todo-card__desc">{item.description}</p>
      )}

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

  const allDone    = plan.length > 0 && plan.every(i => i.completed);
  const doneCount  = plan.filter(i => i.completed).length;
  const totalCount = plan.length;

  return (
    <div className="todo-panel">
      <div className="todo-panel__header">
        <div className="todo-panel__eyebrow">
          <span className="todo-panel__eyebrow-dot" />
          Today's Plan
        </div>
        {!loading && (
          <span className={`todo-panel__progress-label${allDone ? " todo-panel__progress-label--done" : ""}`}>
            {allDone ? "All done ✓" : `${doneCount}/${totalCount} done`}
          </span>
        )}
      </div>
      <div className="todo-panel__cards">
        {loading
          ? [1, 2, 3].map(i => <div key={i} className="todo-card todo-card--skeleton" />)
          : plan.map(item => <PlanCard key={item.id} item={item} />)
        }
      </div>
    </div>
  );
};

export default DailyTodoPanel;