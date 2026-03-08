import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { getDailyPlan } from "../services/systemTodos";
import "./daily-todo-panel.css";

/* ── progress circle ── */
const ProgressCircle = ({ completed }) => {
  const size = 36;
  const cx = size / 2, cy = size / 2, r = 13;
  const circ = 2 * Math.PI * r;
  return (
    <svg className="plan-card__circle" width={size} height={size}
      viewBox={`0 0 ${size} ${size}`} aria-hidden="true">
      <circle cx={cx} cy={cy} r={r} fill="none"
        stroke="rgba(42,143,160,0.15)" strokeWidth="2" />
      <circle cx={cx} cy={cy} r={r} fill="none"
        stroke="#2a8fa0" strokeWidth="2" strokeLinecap="round"
        strokeDasharray={circ}
        strokeDashoffset={completed ? 0 : circ}
        transform={`rotate(-90 ${cx} ${cy})`}
        style={{ transition: "stroke-dashoffset 0.55s cubic-bezier(0.4,0,0.2,1)" }}
      />
      {completed
        ? <text x={cx} y={cy + 4.5} textAnchor="middle" fontSize="11"
            fill="#2a8fa0" fontFamily="-apple-system, sans-serif">✓</text>
        : <circle cx={cx} cy={cy} r="3" fill="rgba(42,143,160,0.3)" />
      }
    </svg>
  );
};

/* ── single card ── */
const PlanCard = ({ item }) => (
  <div className={`plan-card${item.completed ? " plan-card--done" : ""}`}>
    <ProgressCircle completed={item.completed} />
    <div className="plan-card__body">
      <span className="plan-card__type">
        {item.type === "diagnostic" ? "Diagnostic" : "Practice"}
      </span>
      <p className="plan-card__title">{item.title}</p>
      <span className={`plan-card__xp${item.completed ? " plan-card__xp--earned" : ""}`}>
        {item.completed ? `+${item.xp} XP earned` : `+${item.xp} XP`}
      </span>
    </div>
  </div>
);

/* ── panel ── */
const DailyTodoPanel = () => {
  const { user } = useAuth();
  const [plan, setPlan]       = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.uid) { setLoading(false); return; }
    getDailyPlan(user.uid)
      .then(setPlan)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [user?.uid]);

  return (
    <div className="plan-strip">
      {/* connector label */}
      <div className="plan-strip__label">
        <span className="plan-strip__line" />
        <span className="plan-strip__text">Today's plan</span>
      </div>

      {/* cards */}
      <div className="plan-strip__cards">
        {loading
          ? [1, 2].map((i) => <div key={i} className="plan-card plan-card--skeleton" />)
          : plan.map((item) => <PlanCard key={item.id} item={item} />)
        }
      </div>
    </div>
  );
};

export default DailyTodoPanel;