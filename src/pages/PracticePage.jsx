import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Header from "../components/layout/Header";
import Sidebar from "../components/layout/Sidebar";
import { topics } from "../data/topics";
import { tasks as taskBank } from "../data/tasks";
import { getUserProfile } from "../firebase/auth";
import { assignHomework, getHomeworkDoc, getTopicProgress } from "../services/db";
import "../styles/practice.css";
import "../styles/layout.css";

const ChevronRight = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
    <polyline points="9 18 15 12 9 6" />
  </svg>
);

const AlertIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="8" x2="12" y2="12" />
    <line x1="12" y1="16" x2="12.01" y2="16" />
  </svg>
);

const TopicSelect = ({ availableTopics, onPick }) => {
  return (
    <div className="practice-step">
      <div className="practice-step__head">
        <p className="practice-step__eyebrow">Homework</p>
        <h2 className="practice-step__title">Choose a topic</h2>
        <p className="practice-step__sub">
          Each topic has an assigned homework set in Firestore. Complete all tasks to finish the topic.
        </p>
      </div>

      <div className="practice-topic-grid">
        {availableTopics.map((topic) => (
          <button key={topic.id} className="practice-topic-card" onClick={() => onPick(topic)}>
            <div className="practice-topic-card__left">
              <span className="practice-topic-card__icon">{topic.icon ? <topic.icon size={22} /> : "?"}</span>
              <div className="practice-topic-card__text">
                <h3 className="practice-topic-card__title">{topic.title}</h3>
                <p className="practice-topic-card__desc">{topic.description}</p>
              </div>
            </div>
            <div className="practice-topic-card__right">
              <span className="practice-topic-card__count">Assign</span>
              <ChevronRight />
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

const TopicCard = ({ topic, grade, onAssign, state }) => {
  const hasBank = !!taskBank?.[topic.id]?.homework?.length;

  return (
    <div className="practice-task-card" style={{ padding: 22 }}>
      <p className="practice-task-card__num">Topic</p>
      <h3 className="practice-task-card__text" style={{ marginTop: 2 }}>
        {topic.title}
      </h3>

      <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
        <span className="practice-gap-tag" style={{ cursor: "default" }}>
          <AlertIcon /> Grade: {grade ?? "unknown"}
        </span>

        <span className="practice-gap-tag" style={{ cursor: "default" }}>
          <AlertIcon /> Bank: {hasBank ? `${taskBank[topic.id].homework.length} tasks` : "missing"}
        </span>

        {state?.progress?.status && (
          <span className="practice-gap-tag" style={{ cursor: "default" }}>
            <AlertIcon /> Status: {state.progress.status}
          </span>
        )}

        {state?.homework?.status && (
          <span className="practice-gap-tag" style={{ cursor: "default" }}>
            <AlertIcon /> Homework: {state.homework.status}
          </span>
        )}

        {typeof state?.homework?.score?.percent === "number" && (
          <span className="practice-gap-tag" style={{ cursor: "default" }}>
            <AlertIcon /> Score: {state.homework.score.percent}%
          </span>
        )}
      </div>

      <div className="practice-task-card__actions">
        <button
          className="practice-btn practice-btn--primary"
          onClick={() => onAssign(false)}
          disabled={!hasBank || state.loading}
        >
          {state.homework ? "Open homework" : "Assign homework"} <ChevronRight />
        </button>

        <button
          className="practice-btn practice-btn--ghost"
          onClick={() => onAssign(true)}
          disabled={!hasBank || state.loading}
          title="Recreate homework set"
        >
          Reassign
        </button>

        <Link to="/theory" className="practice-btn practice-btn--ghost">
          Back to theory
        </Link>

        <Link to="/tasks" className="practice-btn practice-btn--ghost">
          Go to Tasks
        </Link>
      </div>

      {!hasBank && (
        <div className="practice-feedback practice-feedback--wrong" style={{ marginTop: 14 }}>
          <div className="practice-feedback__icon"><AlertIcon /></div>
          <div>
            <p className="practice-feedback__verdict">Missing task bank</p>
            <p className="practice-feedback__explanation">
              This topic has no homework tasks in src/data/tasks.js yet.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

const PracticePage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [grade, setGrade] = useState(null);
  const [step, setStep] = useState("select"); // select | topic
  const [picked, setPicked] = useState(null);

  const [state, setState] = useState({
    loading: false,
    homework: null,
    progress: null,
  });

  useEffect(() => {
    if (!user?.uid) return;
    getUserProfile(user.uid).then((p) => setGrade(p?.grade ?? null));
  }, [user?.uid]);

  const availableTopics = useMemo(() => {
    // show only topics that have a homework bank
    return topics.filter((t) => taskBank?.[t.id]?.homework?.length);
  }, []);

  const loadTopicState = async (topicId) => {
    if (!user?.uid) return;
    setState((s) => ({ ...s, loading: true }));
    try {
      const [hw, prog] = await Promise.all([
        getHomeworkDoc(user.uid, topicId),
        getTopicProgress(user.uid, topicId),
      ]);
      setState({ loading: false, homework: hw, progress: prog });
    } finally {
      setState((s) => ({ ...s, loading: false }));
    }
  };

  const pickTopic = async (t) => {
    setPicked(t);
    setStep("topic");
    await loadTopicState(t.id);
  };

  const handleAssign = async (force) => {
    if (!user?.uid || !picked) return;
    const bank = taskBank?.[picked.id]?.homework || [];
    if (!bank.length) return;

    setState((s) => ({ ...s, loading: true }));
    try {
      const hw = await assignHomework(
        user.uid,
        picked.id,
        {
          topicTitle: picked.title,
          grade,
          tasks: bank,
        },
        force
      );

      setState((s) => ({ ...s, homework: hw, loading: false }));

      // Go to tasks page (assumed route)
      navigate("/tasks", { state: { topicId: picked.id } });
    } finally {
      setState((s) => ({ ...s, loading: false }));
    }
  };

  return (
    <div className="page-shell">
      <Header sidebarOpen={sidebarOpen} onToggleSidebar={() => setSidebarOpen((v) => !v)} />
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <main className="page-main">
        <div className="practice-page">
          <div className="practice-breadcrumb">
            <Link to="/home" className="practice-breadcrumb__item">Home</Link>
            <ChevronRight />
            <span className="practice-breadcrumb__item practice-breadcrumb__item--active">Tasks</span>
            {picked && (
              <>
                <ChevronRight />
                <span className="practice-breadcrumb__item practice-breadcrumb__item--active">{picked.title}</span>
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
              <h1 className="practice-header__title">Tasks</h1>
              <p className="practice-header__sub">
                Assign homework to a topic. Complete all tasks to finish and earn percent.
              </p>
            </div>
          </div>

          {step === "select" && (
            <TopicSelect
              availableTopics={availableTopics}
              onPick={pickTopic}
            />
          )}

          {step === "topic" && picked && (
            <div className="practice-step">
              <TopicCard topic={picked} grade={grade} onAssign={handleAssign} state={state} />

              <button
                className="practice-btn practice-btn--ghost"
                onClick={() => {
                  setPicked(null);
                  setState({ loading: false, homework: null, progress: null });
                  setStep("select");
                }}
              >
                Choose another topic
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default PracticePage;