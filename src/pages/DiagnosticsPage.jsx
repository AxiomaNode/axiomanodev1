import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Header from "../components/layout/Header";
import Sidebar from "../components/layout/Sidebar";
import { topics } from "../data/topics";
import { saveDiagnostic, getDiagnostics } from "../services/db";
import { gapsDatabase } from "../data/gaps";
import { questions } from "../data/questions";
import "../styles/diagnostics.css";
import "../styles/layout.css";

const ChevronRight = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
    <polyline points="9 18 15 12 9 6" />
  </svg>
);
const ChevronLeft = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
    <polyline points="15 18 9 12 15 6" />
  </svg>
);
const CheckIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);
const AlertIcon = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="8" x2="12" y2="12" />
    <line x1="12" y1="16" x2="12.01" y2="16" />
  </svg>
);

const MAX_QUESTIONS = 24;
const GAP_THRESHOLD = 2;

const buildFullDiagnostic = () => {
  const activeTopics = topics.filter(t => questions[t.id]?.length > 0);
  if (!activeTopics.length) return [];
  const perTopic = Math.max(1, Math.floor(MAX_QUESTIONS / activeTopics.length));
  const pool = [];
  activeTopics.forEach(topic => {
    (questions[topic.id] || []).slice(0, perTopic).forEach(q => {
      pool.push({ ...q, topicId: topic.id });
    });
  });
  if (pool.length < MAX_QUESTIONS) {
    activeTopics.forEach(topic => {
      const already = pool.filter(q => q.topicId === topic.id).length;
      (questions[topic.id] || []).slice(already).forEach(q => {
        if (pool.length < MAX_QUESTIONS) pool.push({ ...q, topicId: topic.id });
      });
    });
  }
  return pool.slice(0, MAX_QUESTIONS);
};

// Unanswered questions = wrong (no answer = wrong answer)
const detectAllGaps = (answers, allQuestions) => {
  // Build complete answers map: unanswered → "__skipped__"
  const fullAnswers = {};
  allQuestions.forEach(q => {
    fullAnswers[q.id] = answers[q.id] ?? "__skipped__";
  });

  const result = {};
  topics.forEach(topic => {
    const topicGaps = gapsDatabase[topic.id];
    if (!topicGaps) return;
    const found = [];
    topicGaps.forEach(gap => {
      let wrongCount = 0;
      Object.entries(gap.signs).forEach(([qId, wrongAnswers]) => {
        const given = fullAnswers[qId];
        // skipped or matched wrong answer = counts as wrong
        if (given === "__skipped__" || wrongAnswers.includes(given)) wrongCount++;
      });
      if (wrongCount >= GAP_THRESHOLD) found.push(gap);
    });
    if (found.length) result[topic.id] = found;
  });
  return result;
};

// ── Confirm Modal ─────────────────────────────────────────────────────────────

const ConfirmModal = ({ answeredCount, totalCount, onConfirm, onCancel }) => {
  const unanswered = totalCount - answeredCount;

  useEffect(() => {
    const handler = (e) => {
      if (e.key === "Escape") onCancel();
      if (e.key === "Enter") onConfirm();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  return (
    <div className="diag-modal-overlay" onClick={onCancel}>
      <div className="diag-modal" onClick={e => e.stopPropagation()}>

        {/* Top bar */}
        <div className="diag-modal__header">
          <div className="diag-modal__header-icon">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
          </div>
          <button className="diag-modal__close" onClick={onCancel} aria-label="Close">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="diag-modal__body">
          <h3 className="diag-modal__title">Submit diagnostic?</h3>
          <p className="diag-modal__desc">
            You've answered <strong>{answeredCount}</strong> of <strong>{totalCount}</strong> questions.
          </p>

          {unanswered > 0 ? (
            <div className="diag-modal__warn-block">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
                <line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
              </svg>
              <p>
                <strong>{unanswered} question{unanswered !== 1 ? "s" : ""} skipped</strong> — skipped questions count as wrong answers.
              </p>
            </div>
          ) : (
            <div className="diag-modal__ok-block">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
              <p>All questions answered. Ready to submit.</p>
            </div>
          )}
        </div>

        {/* Divider */}
        <div className="diag-modal__divider" />

        {/* Footer */}
        <div className="diag-modal__footer">
          <button className="diag-btn diag-btn--ghost" onClick={onCancel}>
            Go back
          </button>
          <button className="diag-btn diag-btn--primary diag-btn--submit" onClick={onConfirm}>
            Submit & see analysis
            <ChevronRight />
          </button>
        </div>

        <p className="diag-modal__hint">Press <kbd>Enter</kbd> to submit · <kbd>Esc</kbd> to go back</p>
      </div>
    </div>
  );
};

// ── Intro ─────────────────────────────────────────────────────────────────────

const IntroScreen = ({ onStart, questionCount }) => {
  const activeTopics = topics.filter(t => questions[t.id]?.length > 0);
  return (
    <div className="diag-intro">
      <div className="diag-intro__icon">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
          <rect x="3" y="3" width="7" height="7" rx="1.5" />
          <rect x="14" y="3" width="7" height="7" rx="1.5" />
          <rect x="3" y="14" width="7" height="7" rx="1.5" />
          <rect x="14" y="14" width="7" height="7" rx="1.5" />
        </svg>
      </div>
      <div className="diag-intro__content">
        <p className="diag-intro__eyebrow">Full Reasoning Diagnostic</p>
        <h2 className="diag-intro__title">One diagnostic. All topics.</h2>
        <p className="diag-intro__desc">
          This covers every topic at once. We are looking at <em>how</em> you think,
          not whether your final answer is right. When you finish, you will see
          exactly which reasoning blocks broke down — not a score.
        </p>
        <div className="diag-intro__stats">
          <div className="diag-intro__stat">
            <strong>{questionCount}</strong>
            <span>Questions</span>
          </div>
          <div className="diag-intro__stat-divider" />
          <div className="diag-intro__stat">
            <strong>{activeTopics.length}</strong>
            <span>Topics</span>
          </div>
          <div className="diag-intro__stat-divider" />
          <div className="diag-intro__stat">
            <strong>~12 min</strong>
            <span>Estimated</span>
          </div>
        </div>
        <button className="diag-btn diag-btn--primary diag-btn--lg" onClick={onStart}>
          Start Diagnostic <ChevronRight />
        </button>
      </div>
      <div className="diag-intro__topics">
        {activeTopics.map(topic => (
          <span key={topic.id} className="diag-intro__topic-chip">
            <topic.icon size={13} strokeWidth={2.5} />
            {topic.title}
          </span>
        ))}
      </div>
    </div>
  );
};

// ── Question Step ─────────────────────────────────────────────────────────────

const QuestionStep = ({ allQuestions, onFinish }) => {
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState({});
  const [showConfirm, setShowConfirm] = useState(false);

  const q = allQuestions[current];
  const topicMeta = topics.find(t => t.id === q?.topicId);
  const progress = ((current + 1) / allQuestions.length) * 100;
  const selected = answers[q?.id] ?? null;
  const isLast = current + 1 >= allQuestions.length;

  const handleSelect = (value) => {
    setAnswers(prev => ({ ...prev, [q.id]: value }));
  };

  // Navigation is always free — no answer required to move
  const handleNext = () => {
    if (isLast) {
      setShowConfirm(true);
    } else {
      setCurrent(c => c + 1);
    }
  };

  const handlePrev = () => {
    if (current > 0) setCurrent(c => c - 1);
  };

  const handleSubmit = () => {
    setShowConfirm(false);
    onFinish(answers);
  };

  // Keyboard navigation
  useEffect(() => {
    const handler = (e) => {
      if (showConfirm) return;

      if (e.key === "ArrowDown" || e.key === "ArrowUp") {
        e.preventDefault();
        const options = q.options.map(o => o.value);
        const currentIdx = options.indexOf(selected);
        if (e.key === "ArrowDown") {
          const next = currentIdx < options.length - 1 ? currentIdx + 1 : 0;
          handleSelect(options[next]);
        } else {
          const prev = currentIdx > 0 ? currentIdx - 1 : options.length - 1;
          handleSelect(options[prev]);
        }
      }

      // Arrow left/right — free navigation, no answer required
      if (e.key === "ArrowLeft" && current > 0) handlePrev();
      if (e.key === "ArrowRight") handleNext();

      // Enter — advance (free)
      if (e.key === "Enter") handleNext();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [selected, current, showConfirm, isLast, q]);

  const prevTopicId = current > 0 ? allQuestions[current - 1]?.topicId : null;
  const topicChanged = current > 0 && q?.topicId !== prevTopicId;

  return (
    <div className="diag-step">
      {showConfirm && (
        <ConfirmModal
          answeredCount={Object.keys(answers).length}
          totalCount={allQuestions.length}
          onConfirm={handleSubmit}
          onCancel={() => setShowConfirm(false)}
        />
      )}

      <div className="diag-progress-header">
        <div className="diag-progress-header__meta">
          {topicMeta && (
            <span className="diag-progress-header__topic">
              <topicMeta.icon size={13} strokeWidth={2.5} />
              {topicMeta.title}
            </span>
          )}
          <span className="diag-progress-header__count">{current + 1} / {allQuestions.length}</span>
        </div>
        <div className="diag-progress__track">
          <div className="diag-progress__fill" style={{ width: `${progress}%` }} />
        </div>
      </div>

      {topicChanged && (
        <div className="diag-topic-transition">
          {topicMeta && <topicMeta.icon size={14} strokeWidth={2} />}
          Now: {topicMeta?.title}
        </div>
      )}

      <div className="diag-question-card">
        <p className="diag-question-card__meta">Question {current + 1}</p>
        <h3 className="diag-question-card__text">{q.text}</h3>

        <div className="diag-options">
          {q.options.map(opt => {
            const state = opt.value === selected ? "selected" : "";
            return (
              <button
                key={opt.value}
                className={`diag-option diag-option--${state || "default"}`}
                onClick={() => handleSelect(opt.value)}
              >
                <span className="diag-option__letter">{opt.label}</span>
                <span className="diag-option__text">{opt.value}</span>
              </button>
            );
          })}
        </div>

        {/* Skip note — shows when nothing selected */}
        {!selected && (
          <p className="diag-skip-note">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10"/>
              <line x1="12" y1="8" x2="12" y2="12"/>
              <line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
            No answer selected — skipping counts as wrong
          </p>
        )}

        <div className="diag-question-card__actions diag-question-card__actions--row">
          <button
            className="diag-btn diag-btn--ghost diag-btn--icon"
            onClick={handlePrev}
            disabled={current === 0}
          >
            <ChevronLeft /> Previous
          </button>
          {/* Next is always enabled — free navigation */}
          <button
            className="diag-btn diag-btn--primary"
            onClick={handleNext}
          >
            {isLast ? "Finish" : "Next"} <ChevronRight />
          </button>
        </div>

        {/* Segmented dot nav */}
        <div className="diag-seg-nav">
          <span className="diag-seg-nav__label">
            {Object.keys(answers).length} / {allQuestions.length} answered
          </span>
          <div className="diag-seg-nav__track">
            {allQuestions.map((_, i) => (
              <button
                key={i}
                className={[
                  "diag-seg",
                  i === current ? "diag-seg--current" : "",
                  answers[allQuestions[i].id] ? "diag-seg--answered" : "",
                ].join(" ")}
                onClick={() => setCurrent(i)}
                title={`Question ${i + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// ── Results ───────────────────────────────────────────────────────────────────

const ResultsStep = ({ answers, allQuestions, onRetry }) => {
  const gapsByTopic = detectAllGaps(answers, allQuestions);
  const totalGaps = Object.values(gapsByTopic).flat().length;
  const topicsWithGaps = Object.keys(gapsByTopic);
  const activeTopics = topics.filter(t => questions[t.id]?.length > 0);
  const topicsClean = activeTopics.filter(t => !gapsByTopic[t.id]);

  return (
    <div className="diag-step">
      <div className="diag-results">
        <div className={`diag-results__summary diag-results__summary--${totalGaps === 0 ? "clean" : "gaps"}`}>
          <div className="diag-results__summary-icon">
            {totalGaps === 0 ? <CheckIcon /> : <AlertIcon />}
          </div>
          <div className="diag-results__summary-text">
            <h2 className="diag-results__summary-title">
              {totalGaps === 0
                ? "No reasoning gaps found"
                : `${totalGaps} reasoning gap${totalGaps !== 1 ? "s" : ""} identified`}
            </h2>
            <p className="diag-results__summary-sub">
              {totalGaps === 0
                ? "Your reasoning held up across all topics."
                : "These are the specific reasoning blocks that broke down. Not wrong answers — thinking gaps."}
            </p>
          </div>
        </div>

        {topicsClean.length > 0 && (
          <div className="diag-results__clean">
            <p className="diag-results__clean-label"><CheckIcon /> Solid reasoning in:</p>
            <div className="diag-results__clean-topics">
              {topicsClean.map(t => (
                <span key={t.id} className="diag-results__clean-chip">
                  <t.icon size={13} strokeWidth={2.5} />
                  {t.title}
                </span>
              ))}
            </div>
          </div>
        )}

        {topicsWithGaps.length > 0 && (
          <div className="diag-gaps">
            <h4 className="diag-gaps__title"><AlertIcon /> Where your reasoning broke</h4>
            {topicsWithGaps.map(topicId => {
              const topic = topics.find(t => t.id === topicId);
              const topicGaps = gapsByTopic[topicId];
              return (
                <div key={topicId} className="diag-gaps__topic-group">
                  <div className="diag-gaps__topic-head">
                    {topic?.icon && <topic.icon size={15} strokeWidth={2.5} />}
                    <h4 className="diag-gaps__topic-title">{topic?.title || topicId}</h4>
                    <span className="diag-gaps__topic-count">{topicGaps.length} gap{topicGaps.length > 1 ? "s" : ""}</span>
                  </div>
                  <div className="diag-gaps__list">
                    {topicGaps.map(gap => (
                      <div key={gap.id} className="diag-gap-card">
                        <div className="diag-gap-card__head">
                          <span className="diag-gap-card__label">Reasoning gap</span>
                          <h5 className="diag-gap-card__title">{gap.title}</h5>
                        </div>
                        <p className="diag-gap-card__desc">{gap.description}</p>
                        <div className="diag-gap-card__rec">
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
                          </svg>
                          <p>{gap.recommendation}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <div className="diag-results__cta-block">
          {totalGaps > 0 && (
            <div className="diag-results__cta-hint">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              <p>Practice now shows targeted exercises for every gap above. Theory explains the reasoning from scratch.</p>
            </div>
          )}
          <div className="diag-results__actions">
            <button className="diag-btn diag-btn--ghost" onClick={onRetry}>Run again</button>
            {totalGaps > 0 && (
              <Link to="/theory" className="diag-btn diag-btn--primary">Study the gaps <ChevronRight /></Link>
            )}
            <Link to="/practice" className="diag-btn diag-btn--ghost">Targeted practice</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

// ── Page ──────────────────────────────────────────────────────────────────────

const DiagnosticsPage = () => {
  const { user } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [step, setStep] = useState("intro");
  const [finalAnswers, setFinalAnswers] = useState({});
  const [allQuestions] = useState(() => buildFullDiagnostic());
  const [alreadyDone, setAlreadyDone] = useState(false);
  const [checkingLimit, setCheckingLimit] = useState(true);
  const savingRef = useRef(false);

  useEffect(() => {
    if (!user) return;
    getDiagnostics(user.uid).then((data) => {
      if (data.length > 0) {
        const lastDate = new Date(data[0].date);
        const today = new Date();
        const sameDay =
          lastDate.getFullYear() === today.getFullYear() &&
          lastDate.getMonth() === today.getMonth() &&
          lastDate.getDate() === today.getDate();
        setAlreadyDone(sameDay);
      }
      setCheckingLimit(false);
    });
  }, [user]);

  const handleFinish = async (answers) => {
    if (savingRef.current) return;
    savingRef.current = true;

    const gapsByTopic = detectAllGaps(answers, allQuestions);
    const result = {
      type: "full",
      answers,
      gapsByTopic,
      gaps: Object.values(gapsByTopic).flat(),
      topicId: "full",
      topicTitle: "Full Diagnostic",
      score: {
        correct: allQuestions.filter(q => answers[q.id] === q.correct).length,
        total: allQuestions.length,
      },
    };

    await saveDiagnostic(user.uid, result);
    setFinalAnswers(answers);
    setStep("results");
    savingRef.current = false;
  };

  return (
    <div className="page-shell">
      <Header sidebarOpen={sidebarOpen} onToggleSidebar={() => setSidebarOpen(v => !v)} />
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <main className="page-main">
        <div className="diag-page">
          <div className="diag-breadcrumb">
            <Link to="/home" className="diag-breadcrumb__item">Home</Link>
            <ChevronRight />
            <span className="diag-breadcrumb__item diag-breadcrumb__item--active">Diagnostics</span>
          </div>
          <div className="diag-header">
            <div className="diag-header__icon">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
            </div>
            <div>
              <h1 className="diag-header__title">Diagnostics</h1>
              <p className="diag-header__sub">Find exactly where your reasoning breaks across all topics.</p>
            </div>
          </div>

          {step === "intro" && (
            checkingLimit ? (
              <div className="diag-limit-msg">Checking...</div>
            ) : alreadyDone ? (
              <div className="diag-limit-block">
                <div className="diag-limit-block__icon">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="12" y1="8" x2="12" y2="12" />
                    <line x1="12" y1="16" x2="12.01" y2="16" />
                  </svg>
                </div>
                <h3 className="diag-limit-block__title">Diagnostic already completed today</h3>
                <p className="diag-limit-block__desc">
                  Come back tomorrow for a fresh diagnostic. In the meantime, practice your weak areas.
                </p>
                <div className="diag-limit-block__actions">
                  <Link to="/practice" className="diag-btn diag-btn--primary">
                    Go to Practice <ChevronRight />
                  </Link>
                  <Link to="/results" className="diag-btn diag-btn--ghost">
                    View Results
                  </Link>
                </div>
              </div>
            ) : (
              <IntroScreen onStart={() => setStep("questions")} questionCount={allQuestions.length} />
            )
          )}

          {step === "questions" && (
            <QuestionStep allQuestions={allQuestions} onFinish={handleFinish} />
          )}

          {step === "results" && (
            <ResultsStep
              answers={finalAnswers}
              allQuestions={allQuestions}
              onRetry={() => { setFinalAnswers({}); setStep("intro"); }}
            />
          )}
        </div>
      </main>
    </div>
  );
};

export default DiagnosticsPage;