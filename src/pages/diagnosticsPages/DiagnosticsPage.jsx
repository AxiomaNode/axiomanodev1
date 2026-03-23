import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import Header from "../../components/layout/Header";
import Sidebar from "../../components/layout/Sidebar";
import NotesPanel from "../../components/NotesPanel";
import { topics } from "../../data/topics";
import { saveDiagnostic, getLastDiagnosticDate, getActiveGaps } from "../../services/db";
import { gapsDatabase } from "../../data/gaps";
import "./diagnostics.css";
import "../../styles/layout.css";
import { awardPoints } from "../../core/scoringEngine";
import { buildFullDiagnostic, detectAllGaps } from "../../core/diagnosticEngine";
import { questionTemplates } from "../../data/questionTemplates";

const ChevronRight = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
    <polyline points="9 18 15 12 9 6" />
  </svg>
);
const ChevronLeft = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
    <polyline points="15 18 9 12 15 6" />
  </svg>
);
const CheckIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);
const AlertIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
  </svg>
);

/* ── Confirm modal ── */
const ConfirmModal = ({ answeredCount, totalCount, onConfirm, onCancel }) => {
  const unanswered = totalCount - answeredCount;
  useEffect(() => {
    const h = (e) => {
      if (e.key === "Escape") onCancel();
      if (e.key === "Enter") onConfirm();
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [onConfirm, onCancel]);

  return (
    <div className="diag-modal-overlay" onClick={onCancel}>
      <div className="diag-modal" onClick={e => e.stopPropagation()}>
        <div className="diag-modal__header">
          <div className="diag-modal__header-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
          </div>
          <button className="diag-modal__close" onClick={onCancel}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>
        <div className="diag-modal__body">
          <h3 className="diag-modal__title">Submit diagnostic?</h3>
          <p className="diag-modal__desc">
            You answered <strong>{answeredCount}</strong> of <strong>{totalCount}</strong> questions.
          </p>
          {unanswered > 0 ? (
            <div className="diag-modal__warn-block">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
                <line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
              </svg>
              <p><strong>{unanswered} question{unanswered !== 1 ? "s" : ""} skipped</strong> — skipped count as wrong.</p>
            </div>
          ) : (
            <div className="diag-modal__ok-block">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
              <p>All questions answered. Ready to submit.</p>
            </div>
          )}
        </div>
        <div className="diag-modal__divider" />
        <div className="diag-modal__footer">
          <button className="diag-btn diag-btn--ghost" onClick={onCancel}>Go back</button>
          <button className="diag-btn diag-btn--primary diag-btn--submit" onClick={onConfirm}>
            Submit &amp; see analysis <ChevronRight />
          </button>
        </div>
        <p className="diag-modal__hint">Press <kbd>Enter</kbd> to submit · <kbd>Esc</kbd> to go back</p>
      </div>
    </div>
  );
};

/* ── Daily limit block screen ── */
const BlockScreen = ({ activeGap }) => {
  const topicId  = activeGap?.evidence?.[0]?.topicId ?? activeGap?.topicId ?? null;
  const gapTitle = activeGap?.title ?? null;
  const recText  = activeGap?.evidence?.[0]?.recommendationText ?? activeGap?.recommendationText ?? null;

  return (
    <div className="diag-block-page">

      <div className="diag-block-hero">
        <div className="diag-block-hero__icon">
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
            <circle cx="12" cy="12" r="10"/>
            <polyline points="12 6 12 12 16 14"/>
          </svg>
        </div>
        <div className="diag-block-hero__text">
          <h2 className="diag-block-hero__title">You've run your diagnostic today.</h2>
          <p className="diag-block-hero__desc">
            Coming back tomorrow gives your memory time to consolidate what you practiced.
            That's not a delay — it's how learning actually works.
          </p>
        </div>
        <div className="diag-block-hero__badge">
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
          Done for today
        </div>
      </div>

      <div className="diag-block-wait">
        <p className="diag-block-wait__label">While you wait</p>
        <div className="diag-block-wait__grid">

          {activeGap && (
            <Link to="/theory" state={{ topicId }} className="diag-block-card diag-block-card--primary">
              <div className="diag-block-card__icon diag-block-card__icon--teal">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                  <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/>
                  <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
                </svg>
              </div>
              <div className="diag-block-card__body">
                <span className="diag-block-card__eyebrow">Active gap — theory</span>
                <h4 className="diag-block-card__title">{gapTitle}</h4>
                {recText && <p className="diag-block-card__desc">{recText}</p>}
              </div>
              <div className="diag-block-card__arrow"><ChevronRight /></div>
            </Link>
          )}

          <Link
            to="/practice"
            state={topicId ? { gapId: activeGap?.evidence?.[0]?.gapId, topicId } : undefined}
            className="diag-block-card"
          >
            <div className="diag-block-card__icon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                <polyline points="9 11 12 14 22 4"/>
                <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>
              </svg>
            </div>
            <div className="diag-block-card__body">
              <span className="diag-block-card__eyebrow">{activeGap ? "Targeted" : "Free"} practice</span>
              <h4 className="diag-block-card__title">
                {activeGap ? `Practice on ${gapTitle?.toLowerCase() ?? "your active gap"}` : "Free practice session"}
              </h4>
              <p className="diag-block-card__desc">Work through questions while the theory is fresh.</p>
            </div>
            <div className="diag-block-card__arrow"><ChevronRight /></div>
          </Link>

          <Link to="/profile" className="diag-block-card">
            <div className="diag-block-card__icon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
              </svg>
            </div>
            <div className="diag-block-card__body">
              <span className="diag-block-card__eyebrow">Your progress</span>
              <h4 className="diag-block-card__title">Review your reasoning map</h4>
              <p className="diag-block-card__desc">See how your gaps have shifted across sessions.</p>
            </div>
            <div className="diag-block-card__arrow"><ChevronRight /></div>
          </Link>

        </div>
      </div>

      <p className="diag-block-page__footer">
        Next diagnostic available tomorrow. Each session uses a fresh set of questions.
      </p>

    </div>
  );
};

/* ── Intro screen ── */
const IntroScreen = ({ onConfigure }) => {
  const activeTopics = topics.filter(t => questionTemplates[t.id]?.length > 0);
  const totalQ = activeTopics.length * 20;

  return (
    <div className="diag-intro">
      <div className="diag-intro__badge">
        <span className="diag-intro__badge-dot" />
        REASONING DIAGNOSTIC SYSTEM
      </div>
      <div className="diag-intro__hero">
        <div className="diag-intro__icon">
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
            <rect x="3" y="3" width="7" height="7" rx="1.5" />
            <rect x="14" y="3" width="7" height="7" rx="1.5" />
            <rect x="3" y="14" width="7" height="7" rx="1.5" />
            <rect x="14" y="14" width="7" height="7" rx="1.5" />
          </svg>
        </div>
        <h2 className="diag-intro__title">Reasoning Diagnostic</h2>
        <p className="diag-intro__desc">
          Not a grade. A <em>map</em> of where your thinking breaks down.
          Select topics, answer each question — we track <em>how</em> you reason, not just the final answer.
        </p>
      </div>
      <div className="diag-intro__stats">
        <div className="diag-intro__stat"><strong>{activeTopics.length}</strong><span>Topics</span></div>
        <div className="diag-intro__stat-divider" />
        <div className="diag-intro__stat"><strong>{totalQ}</strong><span>Questions</span></div>
        <div className="diag-intro__stat-divider" />
        <div className="diag-intro__stat"><strong>~20 min</strong><span>Estimated</span></div>
      </div>
      <div className="diag-intro__terminal">
        <div className="diag-intro__terminal-bar">
          <span className="diag-intro__terminal-dot diag-intro__terminal-dot--red" />
          <span className="diag-intro__terminal-dot diag-intro__terminal-dot--yellow" />
          <span className="diag-intro__terminal-dot diag-intro__terminal-dot--green" />
          <span className="diag-intro__terminal-label">axioma.diagnostic</span>
        </div>
        <div className="diag-intro__terminal-body">
          <p><span className="diag-intro__cmd-prompt">$</span> init_diagnostic --mode=reasoning</p>
          <p><span className="diag-intro__cmd-prompt">→</span> {activeTopics.length} topic modules loaded</p>
          <p><span className="diag-intro__cmd-prompt">→</span> 5 gap types · 4 signal questions each</p>
          <p><span className="diag-intro__cmd-prompt">→</span> Gap flagged if 3+ signals wrong</p>
          <p><span className="diag-intro__cmd-prompt">→</span> Ready. Select topics to configure.</p>
        </div>
      </div>
      <button className="diag-btn diag-btn--primary diag-btn--lg" onClick={onConfigure}>
        Configure &amp; Start <ChevronRight />
      </button>
      <div className="diag-intro__topics">
        {activeTopics.map(topic => (
          <span key={topic.id} className="diag-intro__topic-chip">
            <topic.icon size={12} strokeWidth={2.5} />{topic.title}
          </span>
        ))}
      </div>
    </div>
  );
};

/* ── Topic select ── */
const TopicSelectScreen = ({ onStart, onBack }) => {
  const availableTopics = topics.filter(t => questionTemplates[t.id]?.length > 0);
  const [selected, setSelected] = useState(new Set(availableTopics.map(t => t.id)));

  const toggleTopic = (id) => {
    setSelected(prev => {
      const next = new Set(prev);
      if (next.has(id)) { if (next.size === 1) return prev; next.delete(id); }
      else next.add(id);
      return next;
    });
  };

  const selectAll = () => setSelected(new Set(availableTopics.map(t => t.id)));
  const clearAll  = () => { const f = availableTopics[0]; if (f) setSelected(new Set([f.id])); };
  const estimatedQ   = selected.size * 20;
  const estimatedMin = Math.round(estimatedQ * 0.5);
  const diffColor    = { easy: "easy", medium: "med", hard: "hard" };

  return (
    <div className="diag-topic-select">
      <div className="diag-topic-select__header">
        <div className="diag-topic-select__step-tag">
          <span className="diag-topic-select__step-num">01</span>Configure
        </div>
        <h2 className="diag-topic-select__title">Select topics</h2>
        <p className="diag-topic-select__desc">
          Choose which reasoning areas to probe. All questions for selected topics will appear — this ensures reliable gap detection.
        </p>
      </div>
      <div className="diag-topic-select__controls">
        <div className="diag-topic-select__ctrl-btns">
          <button className="diag-btn diag-btn--ghost diag-btn--xs" onClick={selectAll}>All</button>
          <button className="diag-btn diag-btn--ghost diag-btn--xs" onClick={clearAll}>Reset</button>
        </div>
        <div className="diag-topic-select__info-row">
          <span><strong>{selected.size}</strong> / {availableTopics.length} topics</span>
          <span className="diag-topic-select__info-divider">·</span>
          <span><strong>{estimatedQ}</strong> questions</span>
          <span className="diag-topic-select__info-divider">·</span>
          <span>~<strong>{estimatedMin}</strong> min</span>
        </div>
      </div>
      <div className="diag-topic-grid">
        {availableTopics.map(topic => {
          const isSelected = selected.has(topic.id);
          const gapCount   = gapsDatabase[topic.id]?.length || 0;
          const diff       = topic.difficulty || "medium";
          return (
            <button key={topic.id} className={`diag-topic-card${isSelected ? " diag-topic-card--selected" : ""}`} onClick={() => toggleTopic(topic.id)}>
              <div className="diag-topic-card__check-box">{isSelected && <CheckIcon />}</div>
              <div className="diag-topic-card__icon"><topic.icon size={21} strokeWidth={1.7} /></div>
              <h4 className="diag-topic-card__title">{topic.title}</h4>
              <p className="diag-topic-card__desc">{topic.description}</p>
              <div className="diag-topic-card__footer">
                <span className="diag-topic-card__q-count">20q · {gapCount} gaps</span>
                <span className={`diag-topic-card__diff diag-topic-card__diff--${diffColor[diff] || "med"}`}>{diff}</span>
              </div>
            </button>
          );
        })}
      </div>
      <div className="diag-topic-select__actions">
        <button className="diag-btn diag-btn--ghost" onClick={onBack}><ChevronLeft /> Back</button>
        <button className="diag-btn diag-btn--primary diag-btn--lg" onClick={() => onStart([...selected])} disabled={selected.size === 0}>
          Start Diagnostic <ChevronRight />
        </button>
      </div>
    </div>
  );
};

/* ── Question step ── */
const QuestionStep = ({ allQuestions, onFinish }) => {
  const [current, setCurrent]         = useState(0);
  const [answers, setAnswers]         = useState({});
  const [showConfirm, setShowConfirm] = useState(false);

  const q         = allQuestions[current];
  const topicMeta = topics.find(t => t.id === q?.topicId);
  const progress  = ((current + 1) / allQuestions.length) * 100;
  const selected  = answers[q?.id] ?? null;
  const isLast    = current + 1 >= allQuestions.length;

  const handleSelect = (value) => setAnswers(prev => ({ ...prev, [q.id]: value }));
  const handleNext   = () => { if (isLast) setShowConfirm(true); else setCurrent(c => c + 1); };
  const handlePrev   = () => { if (current > 0) setCurrent(c => c - 1); };
  const handleSubmit = () => { setShowConfirm(false); onFinish(answers); };

  useEffect(() => {
    const h = (e) => {
      if (showConfirm) return;
      if (e.target.tagName === "TEXTAREA" || e.target.tagName === "INPUT") return;
      if (e.key === "ArrowDown" || e.key === "ArrowUp") {
        e.preventDefault();
        const opts = q.options.map(o => o.value);
        const idx  = opts.indexOf(selected);
        handleSelect(e.key === "ArrowDown"
          ? opts[idx < opts.length - 1 ? idx + 1 : 0]
          : opts[idx > 0 ? idx - 1 : opts.length - 1]
        );
      }
      if (e.key === "ArrowLeft" && current > 0) handlePrev();
      if (e.key === "ArrowRight") handleNext();
      if (e.key === "Enter") handleNext();
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [selected, current, showConfirm, isLast, q]);

  const prevTopicId  = current > 0 ? allQuestions[current - 1]?.topicId : null;
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
              <topicMeta.icon size={12} strokeWidth={2.5} />{topicMeta.title}
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
          {topicMeta && <topicMeta.icon size={13} strokeWidth={2} />}
          Now: {topicMeta?.title}
        </div>
      )}
      <div className="diag-question-card">
        <div className="diag-question-card__header">
          <p className="diag-question-card__meta">
            <span className="diag-question-card__id">// Q{String(current + 1).padStart(2, "0")}</span>
            <span className="diag-question-card__qid">{q?.id}</span>
          </p>
        </div>
        <h3 className="diag-question-card__text">{q.text}</h3>
        <div className="diag-options">
          {q.options.map(opt => {
            const isSel = opt.label === selected;
            return (
              <button key={opt.value} className={`diag-option${isSel ? " diag-option--selected" : ""}`} onClick={() => handleSelect(opt.label)}>
                <span className="diag-option__letter">{opt.label}</span>
                <span className="diag-option__text">{opt.value}</span>
              </button>
            );
          })}
        </div>
        <div className="diag-question-card__actions diag-question-card__actions--row">
          <button className="diag-btn diag-btn--ghost diag-btn--icon" onClick={handlePrev} disabled={current === 0}>
            <ChevronLeft /> Previous
          </button>
          <button className="diag-btn diag-btn--primary" onClick={handleNext}>
            {isLast ? "Finish" : "Next"} <ChevronRight />
          </button>
        </div>
        <div className="diag-seg-nav">
          <span className="diag-seg-nav__label">{Object.keys(answers).length} / {allQuestions.length} answered</span>
          <div className="diag-seg-nav__track">
            {allQuestions.map((_, i) => (
              <button
                key={i}
                className={["diag-seg", i === current ? "diag-seg--current" : "", answers[allQuestions[i].id] ? "diag-seg--answered" : ""].join(" ")}
                onClick={() => setCurrent(i)}
                title={`Q${i + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

/* ── Results step ── */
const ResultsStep = ({ answers, allQuestions, onRetry }) => {
  const navigate = useNavigate();
  const [activeIdx,     setActiveIdx]     = useState(0);
  const [expandedGap,   setExpandedGap]   = useState(null);
  const [showBreakdown, setShowBreakdown] = useState(false);

  const { profile: coreGapProfile, cleanGaps } = detectAllGaps(answers, allQuestions);
  const activeGaps = Object.values(coreGapProfile).filter(cg => cg.strength !== null);
  const totalGaps  = activeGaps.length;

  const wrongQuestions = allQuestions.filter(q => answers[q.id] !== q.correct);
  const correctCount   = allQuestions.length - wrongQuestions.length;
  const accuracy       = Math.round((correctCount / allQuestions.length) * 100);

  const topicIds      = [...new Set(allQuestions.map(q => q.topicId))];
  const isSingleTopic = topicIds.length === 1;
  const singleTopicId = isSingleTopic ? topicIds[0] : null;

  const gapStats = {};
  allQuestions.forEach(q => {
    const given = answers[q.id];
    if (given == null) return;
    if (!gapStats[q.gapTag]) gapStats[q.gapTag] = { wrong: 0, total: 0 };
    gapStats[q.gapTag].total++;
    if (given !== q.correct) gapStats[q.gapTag].wrong++;
  });
  const hasNoFoundation = Object.values(gapStats).some(s => s.total >= 3 && s.wrong === s.total);
  const resultType = totalGaps > 0 ? "gaps" : hasNoFoundation ? "no-foundation" : "no-signal";

  useEffect(() => {
    if (resultType !== "gaps") return;
    const h = (e) => {
      if (e.key === "ArrowLeft")  setActiveIdx(i => Math.max(0, i - 1));
      if (e.key === "ArrowRight") setActiveIdx(i => Math.min(activeGaps.length - 1, i + 1));
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [resultType, activeGaps.length]);

  const handleTrain = (ev) => {
    navigate("/practice", { state: { gapId: ev.gapId, gapTitle: ev.gapTitle, topicId: ev.topicId } });
  };

  const getEvidenceItems = (cg) => {
    const ev = cg.evidence[0];
    if (!ev?.failedTaskIds?.length) return { items: [], total: 0 };
    const items = ev.failedTaskIds.map(taskId => {
      const q = allQuestions.find(q => q.id === taskId);
      if (!q) return null;
      const givenLabel = answers[q.id];
      const givenOpt   = q.options?.find(o => o.label === givenLabel);
      const correctOpt = q.options?.find(o => o.label === q.correct);
      return {
        text:    q.text?.length > 100 ? q.text.slice(0, 97) + "…" : q.text,
        given:   givenOpt?.value ?? givenLabel ?? "—",
        correct: correctOpt?.value ?? q.correct ?? "—",
      };
    }).filter(Boolean);
    return { items, total: items.length };
  };

  const GAP_COLOR = "#c0392b";

  return (
    <div className="diag-step">
      <div className="diag-results">

        {/* Summary banner */}
        <div className={`diag-results__summary diag-results__summary--${totalGaps === 0 ? "clean" : "gaps"}`}>
          <div className="diag-results__summary-icon">
            {totalGaps === 0 ? <CheckIcon /> : <AlertIcon />}
          </div>
          <div className="diag-results__summary-text">
            <h2 className="diag-results__summary-title">
              {totalGaps === 0
                ? resultType === "no-foundation" ? "Foundation check needed" : "No reasoning gaps detected"
                : `${totalGaps} reasoning gap${totalGaps !== 1 ? "s" : ""} identified`}
            </h2>
            <p className="diag-results__summary-sub">
              {totalGaps === 0
                ? resultType === "no-foundation"
                  ? "You missed all questions in at least one area — work through theory first."
                  : "Your answers didn't show a consistent reasoning pattern."
                : "Specific reasoning patterns that broke down — not wrong answers, thinking gaps."}
            </p>
            <div className="diag-results__accuracy">
              <span className="diag-results__accuracy-label">Accuracy</span>
              <span className="diag-results__accuracy-val">{correctCount}/{allQuestions.length}</span>
              <span className="diag-results__accuracy-pct">{accuracy}%</span>
            </div>
          </div>
        </div>

        {/* Clean gaps — solid reasoning areas */}
        {cleanGaps.length > 0 && (
          <div className="diag-results__clean">
            <p className="diag-results__clean-label"><CheckIcon /> Solid reasoning in:</p>
            <div className="diag-results__clean-topics">
              {cleanGaps.map(cg => (
                <span key={cg.id} className="diag-results__clean-chip">
                  {cg.shortLabel || cg.title}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Gap carousel */}
        {resultType === "gaps" && (
          <div className="rsl-carousel">
            <div className="rsl-carousel__hd">
              <div className="rsl-carousel__hd-left">
                <AlertIcon />
                <span className="rsl-carousel__hd-title">Where your reasoning broke</span>
                <span className="rsl-carousel__hd-count">{totalGaps}</span>
              </div>
            </div>

            <div className="rsl-carousel__nav">
              {totalGaps > 1 && (
                <button
                  className={`rsl-carousel__arrow${activeIdx === 0 ? " rsl-carousel__arrow--off" : ""}`}
                  onClick={() => setActiveIdx(i => Math.max(0, i - 1))}
                  aria-label="Previous gap"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                    <polyline points="15 18 9 12 15 6" />
                  </svg>
                </button>
              )}

              <div className="rsl-carousel__viewport">
                {activeGaps.map((cg, idx) => {
                  if (idx !== activeIdx) return null;
                  const ev0              = cg.evidence[0];
                  const { items, total } = getEvidenceItems(cg);
                  const isExpanded       = expandedGap === cg.coreGapId;

                  return (
                    <div key={cg.coreGapId} className="rsl-gap-card" style={{ "--gap-color": GAP_COLOR }}>
                      <div className="rsl-gap-card__inner">

                        <div className="rsl-gap-card__header">
                          <div className="rsl-gap-card__badge" style={{ color: GAP_COLOR, borderColor: GAP_COLOR + "35", background: GAP_COLOR + "12" }}>
                            gap detected
                          </div>
                        </div>

                        <h4 className="rsl-gap-card__title">{cg.title}</h4>
                        <p className="rsl-gap-card__desc">{cg.userFacingLabel}</p>

                        <div className="rsl-gap-card__divider" />

                        {ev0?.description && (
                          <div className="rsl-gap-card__notes">
                            {ev0.description.what && (
                              <div className="rsl-gap-card__note rsl-gap-card__note--what">
                                <span className="rsl-gap-card__note-label">What happened</span>
                                <p className="rsl-gap-card__note-text">{ev0.description.what}</p>
                              </div>
                            )}
                            {ev0.description.check && (
                              <div className="rsl-gap-card__note rsl-gap-card__note--check">
                                <span className="rsl-gap-card__note-label">Next time</span>
                                <p className="rsl-gap-card__note-text">{ev0.description.check}</p>
                              </div>
                            )}
                          </div>
                        )}

                        {items.length > 0 && (
                          <div className="rsl-gap-card__evidence">
                            <p className="rsl-gap-card__evidence-label">Examples from your answers</p>
                            <div className="rsl-gap-card__evidence-list">
                              {(isExpanded ? items : items.slice(0, 2)).map((item, i) => (
                                <div key={i} className="rsl-ev-item">
                                  <p className="rsl-ev-item__q">{item.text}</p>
                                  <div className="rsl-ev-item__row">
                                    <div className="rsl-ev-item__col rsl-ev-item__col--wrong">
                                      <span className="rsl-ev-item__lbl">Your answer</span>
                                      <span className="rsl-ev-item__val">{item.given}</span>
                                    </div>
                                    <div className="rsl-ev-item__col rsl-ev-item__col--correct">
                                      <span className="rsl-ev-item__lbl">Correct</span>
                                      <span className="rsl-ev-item__val">{item.correct}</span>
                                    </div>
                                  </div>
                                </div>
                              ))}
                              {total > 2 && (
                                <button className="rsl-gap-card__more" onClick={() => setExpandedGap(isExpanded ? null : cg.coreGapId)}>
                                  {isExpanded ? "Show less ↑" : `+${total - 2} more ↓`}
                                </button>
                              )}
                            </div>
                          </div>
                        )}

                        {ev0 && (
                          <div className="rsl-gap-card__footer">
                            <button className="rsl-gap-card__train" onClick={() => handleTrain(ev0)}>
                              Fix this gap
                              <span className="rsl-gap-card__train-arrow">→</span>
                            </button>
                          </div>
                        )}

                      </div>
                    </div>
                  );
                })}
              </div>

              {totalGaps > 1 && (
                <button
                  className={`rsl-carousel__arrow${activeIdx === activeGaps.length - 1 ? " rsl-carousel__arrow--off" : ""}`}
                  onClick={() => setActiveIdx(i => Math.min(activeGaps.length - 1, i + 1))}
                  aria-label="Next gap"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                    <polyline points="9 18 15 12 9 6" />
                  </svg>
                </button>
              )}
            </div>

            {totalGaps > 1 && (
              <div className="rsl-carousel__dots">
                {activeGaps.map((_, i) => (
                  <button
                    key={i}
                    className={`rsl-carousel__dot${i === activeIdx ? " rsl-carousel__dot--active" : ""}`}
                    onClick={() => setActiveIdx(i)}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* No signal */}
        {resultType === "no-signal" && (
          <div className="diag-result-state diag-result-state--no-signal">
            <div className="diag-result-state__icon">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
                <circle cx="12" cy="12" r="10"/>
                <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/>
                <line x1="12" y1="17" x2="12.01" y2="17"/>
              </svg>
            </div>
            <h3 className="diag-result-state__title">No consistent pattern found.</h3>
            <p className="diag-result-state__desc">Your answers didn't show a clear reasoning gap. Work through theory, then run the diagnostic again tomorrow.</p>
            <div className="diag-result-state__actions">
              <Link to="/theory" state={isSingleTopic ? { topicId: singleTopicId } : undefined} className="diag-btn diag-btn--primary">
                Review Theory <ChevronRight />
              </Link>
            </div>
          </div>
        )}

        {/* No foundation */}
        {resultType === "no-foundation" && (
          <div className="diag-result-state diag-result-state--no-foundation">
            <div className="diag-result-state__icon">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                <polyline points="9 22 9 12 15 12 15 22"/>
              </svg>
            </div>
            <h3 className="diag-result-state__title">Start with the basics first.</h3>
            <p className="diag-result-state__desc">You missed every question in at least one area. Theory will walk you through from scratch — then run the diagnostic again.</p>
            <div className="diag-result-state__actions">
              <Link to="/theory" state={isSingleTopic ? { topicId: singleTopicId } : undefined} className="diag-btn diag-btn--primary">
                Go to Theory <ChevronRight />
              </Link>
            </div>
          </div>
        )}

        {/* All responses breakdown */}
        {wrongQuestions.length > 0 && (
          <div className="rsl-breakdown">
            <button className="rsl-breakdown__toggle" onClick={() => setShowBreakdown(v => !v)}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <polyline points={showBreakdown ? "18 15 12 9 6 15" : "6 9 12 15 18 9"} />
              </svg>
              <span>All responses</span>
              <span className="rsl-breakdown__toggle-count">{wrongQuestions.length} wrong · {correctCount} correct</span>
            </button>
            {showBreakdown && (
              <div className="rsl-breakdown__list">
                {wrongQuestions.map(q => {
                  const givenLabel  = answers[q.id];
                  const isSkipped   = !givenLabel;
                  const givenOpt    = q.options?.find(o => o.label === givenLabel);
                  const correctOpt  = q.options?.find(o => o.label === q.correct);
                  const givenText   = givenOpt?.value   ?? givenLabel ?? "—";
                  const correctText = correctOpt?.value ?? q.correct  ?? "—";
                  const topicMeta   = topics.find(t => t.id === q.topicId);
                  return (
                    <div key={q.id} className="rsl-breakdown__item">
                      <div className="rsl-breakdown__item-hd">
                        <span className="rsl-breakdown__item-id">// {q.id}</span>
                        {topicMeta && (
                          <span className="rsl-breakdown__item-topic">
                            <topicMeta.icon size={10} strokeWidth={2.5} />{topicMeta.title}
                          </span>
                        )}
                      </div>
                      <p className="rsl-breakdown__item-q">{q.text}</p>
                      <div className="rsl-breakdown__item-answers">
                        <div className="rsl-breakdown__answer rsl-breakdown__answer--wrong">
                          <span className="rsl-breakdown__answer-lbl">Your answer</span>
                          <span className="rsl-breakdown__answer-val">{isSkipped ? "— skipped" : givenText}</span>
                        </div>
                        <div className="rsl-breakdown__answer rsl-breakdown__answer--correct">
                          <span className="rsl-breakdown__answer-lbl">Correct answer</span>
                          <span className="rsl-breakdown__answer-val">{correctText}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Soft rest recommendation */}
        <div className="diag-rest-hint">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
            <circle cx="12" cy="12" r="10"/>
            <polyline points="12 6 12 12 16 14"/>
          </svg>
          <div>
            <p className="diag-rest-hint__title">You've run your diagnostic for today.</p>
            <p className="diag-rest-hint__sub">Rest now — your brain needs time to consolidate. Come back tomorrow for the next session.</p>
          </div>
          <div className="diag-rest-hint__actions">
            <Link to="/theory" state={isSingleTopic ? { topicId: singleTopicId } : undefined} className="diag-btn diag-btn--ghost diag-btn--sm">Theory</Link>
            <Link to="/practice" className="diag-btn diag-btn--ghost diag-btn--sm">Free Practice</Link>
          </div>
        </div>

      </div>
    </div>
  );
};

/* ── Page root ── */
const DiagnosticsPage = () => {
  const { user } = useAuth();
  const [sidebarOpen, setSidebarOpen]   = useState(false);
  const [step, setStep]                 = useState("intro");
  const [diagStatus, setDiagStatus]     = useState("loading"); // "loading" | "available" | "blocked"
  const [activeGap, setActiveGap]       = useState(null);
  const [finalAnswers, setFinalAnswers] = useState({});
  const [allQuestions, setAllQuestions] = useState([]);
  const [sessionId, setSessionId]       = useState(() => `s_${Date.now()}`);
  const savingRef = useRef(false);

  // Check daily limit + fetch active gap for block screen
  useEffect(() => {
    if (!user) return;
    Promise.all([
      getLastDiagnosticDate(user.uid),
      getActiveGaps(user.uid),
    ]).then(([lastDate, gaps]) => {
      const today = new Date().toLocaleDateString();
      setDiagStatus(lastDate === today ? "blocked" : "available");
      setActiveGap(gaps?.[0] ?? null);
    });
  }, [user]);

  const handleTopicStart = (selectedTopicIds) => {
    const qs = buildFullDiagnostic(selectedTopicIds);
    setAllQuestions(qs);
    setStep("questions");
  };

  const handleFinish = async (answers) => {
    if (savingRef.current) return;
    savingRef.current = true;

    const { profile: coreGapProfile, cleanGaps } = detectAllGaps(answers, allQuestions);
    const activeGaps = Object.values(coreGapProfile).filter(cg => cg.strength !== null);

    const sanitizeProfile = (p) => {
      const out = {};
      Object.entries(p).forEach(([key, cg]) => {
        out[key] = {
          ...cg,
          evidence: (cg.evidence || []).map(ev => {
            const { failedTaskIds, ...rest } = ev;
            return { ...rest, failedCount: (failedTaskIds || []).length };
          }),
        };
      });
      return out;
    };

    const result = {
      type:           "full",
      answers,
      coreGapProfile: sanitizeProfile(coreGapProfile),
      gaps:           activeGaps,
      cleanGaps:      cleanGaps.map(cg => ({ coreGapId: cg.id, title: cg.title, shortLabel: cg.shortLabel })),
      topicId:        "full",
      topicTitle:     "Full Diagnostic",
      questions: allQuestions.map(q => ({ id: q.id, text: q.text, correct: q.correct, options: q.options, topicId: q.topicId })),
      score: {
        correct: allQuestions.filter(q => answers[q.id] === q.correct).length,
        total:   allQuestions.length,
      },
    };

    await saveDiagnostic(user.uid, result);
    setFinalAnswers(answers);
    setDiagStatus("blocked");
    setStep("results");
    savingRef.current = false;
    await awardPoints(user.uid, "diagnostic_complete", { correct: result.score.correct, total: result.score.total });
  };

  const handleRetry = () => {
    setFinalAnswers({}); setAllQuestions([]);
    setSessionId(`s_${Date.now()}`);
    setStep("intro");
  };

  const isQuestionStep = step === "questions";

  if (diagStatus === "loading") {
    return (
      <div className="page-shell">
        <Header sidebarOpen={sidebarOpen} onToggleSidebar={() => setSidebarOpen(v => !v)} />
        <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <main className="page-main">
          <div className="diag-page">
            <div className="diag-limit-msg">Checking session status…</div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="page-shell">
      <Header sidebarOpen={sidebarOpen} onToggleSidebar={() => setSidebarOpen(v => !v)} />
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <main className="page-main">
        <div className={`diag-shell${isQuestionStep ? " diag-shell--with-notes" : ""}`}>
          <div className="diag-shell__main">
            <div className="diag-page">
              <div className="diag-breadcrumb">
                <Link to="/home" className="diag-breadcrumb__item">Home</Link>
                <ChevronRight />
                <span className="diag-breadcrumb__item diag-breadcrumb__item--active">Diagnostics</span>
              </div>
              <div className="diag-header">
                <div className="diag-header__icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
                  </svg>
                </div>
                <div>
                  <h1 className="diag-header__title">Diagnostics</h1>
                  <p className="diag-header__sub">Find exactly where your reasoning breaks across all topics.</p>
                </div>
              </div>

              {/* Hard block on intro/topic-select if already done today */}
              {diagStatus === "blocked" && (step === "intro" || step === "topic-select") && <BlockScreen activeGap={activeGap} />}

              {(diagStatus === "available" || step === "questions" || step === "results") && (
                <>
                  {step === "intro"        && <IntroScreen onConfigure={() => setStep("topic-select")} />}
                  {step === "topic-select" && <TopicSelectScreen onStart={handleTopicStart} onBack={() => setStep("intro")} />}
                  {step === "questions"    && <QuestionStep allQuestions={allQuestions} onFinish={handleFinish} />}
                  {step === "results"      && <ResultsStep answers={finalAnswers} allQuestions={allQuestions} onRetry={handleRetry} />}
                </>
              )}
            </div>
          </div>
          {isQuestionStep && <NotesPanel sessionId={sessionId} />}
        </div>
      </main>
    </div>
  );
};

export default DiagnosticsPage;