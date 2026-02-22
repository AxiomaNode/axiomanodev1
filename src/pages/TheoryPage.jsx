import { useState } from "react";
import { Link } from "react-router-dom";
import Header from "../components/layout/Header";
import Sidebar from "../components/layout/Sidebar";
import { theory, theoryTopics } from "../data/theory";
import "../styles/theory.css";
import "../styles/layout.css";

/* ── Icons ── */
const ChevronRight = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
    <polyline points="9 18 15 12 9 6" />
  </svg>
);
const CheckIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);
const XIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

/* ══════════════════════════════════════════
   CONTENT BLOCK RENDERERS
══════════════════════════════════════════ */

const BlockText = ({ block }) => (
  <p className="tb-text">{block.content}</p>
);

const BlockFact = ({ block }) => (
  <div className="tb-fact">
    <div className="tb-fact__icon">
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="10" />
        <line x1="12" y1="8" x2="12" y2="12" />
        <line x1="12" y1="16" x2="12.01" y2="16" />
      </svg>
    </div>
    <div>
      <span className="tb-fact__label">{block.label || "Origin"}</span>
      <p className="tb-fact__text">{block.content}</p>
    </div>
  </div>
);

const BlockDefinition = ({ block }) => (
  <div className="tb-def">
    <span className="tb-def__term">{block.term}</span>
    <p className="tb-def__text">{block.content}</p>
  </div>
);

const BlockExample = ({ block }) => (
  <div className="tb-example">
    <p className="tb-example__title">{block.title}</p>
    <ol className="tb-example__steps">
      {block.steps.map((step, i) => (
        <li key={i} className="tb-example__step">
          <span className="tb-example__num">{i + 1}</span>
          <span>{step}</span>
        </li>
      ))}
    </ol>
  </div>
);

const BlockMethod = ({ block }) => (
  <div className="tb-method">
    <div className="tb-method__head">
      <span className="tb-method__num">{block.number}</span>
      <h4 className="tb-method__title">{block.title}</h4>
    </div>
    <div className="tb-method__body">
      <p className="tb-method__when"><strong>When:</strong> {block.when}</p>
      <p className="tb-method__example">{block.example}</p>
      {block.note && <p className="tb-method__note">↳ {block.note}</p>}
    </div>
  </div>
);

const BlockDiscriminant = ({ block }) => (
  <div className="tb-discriminant">
    <div className="tb-discriminant__head">
      <h4 className="tb-discriminant__title">{block.title}</h4>
      {block.story && <p className="tb-discriminant__story">{block.story}</p>}
    </div>
    <div className="tb-discriminant__body">
      {/* Formula on a dark board */}
      <div className="tb-formula-board">
        <div className="tb-formula-board__grid" aria-hidden="true" />
        <p className="tb-formula-board__formula">{block.formula}</p>
      </div>
      {/* Cases */}
      <div className="tb-discriminant-cases">
        {block.meaning.map((m) => (
          <div key={m.condition} className="tb-discriminant-case">
            <span className="tb-discriminant-case__cond">{m.condition}</span>
            <span className="tb-discriminant-case__icon">{m.icon}</span>
            <span className="tb-discriminant-case__result">{m.result}</span>
          </div>
        ))}
      </div>
    </div>
  </div>
);

const BlockInsight = ({ block }) => (
  <div className="tb-insight">
    <div className="tb-insight__label">
      <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor" stroke="none">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
      </svg>
      Key insight
    </div>
    <h4 className="tb-insight__title">{block.title}</h4>
    <p className="tb-insight__text">{block.content}</p>
    {block.example && <p className="tb-insight__example">{block.example}</p>}
  </div>
);

const ContentBlock = ({ block }) => {
  switch (block.type) {
    case "text":          return <BlockText block={block} />;
    case "fact":          return <BlockFact block={block} />;
    case "definition":    return <BlockDefinition block={block} />;
    case "example":       return <BlockExample block={block} />;
    case "method":        return <BlockMethod block={block} />;
    case "discriminant":  return <BlockDiscriminant block={block} />;
    case "insight":       return <BlockInsight block={block} />;
    default:              return null;
  }
};

/* ══════════════════════════════════════════
   PUZZLE ENGINE
   - escalating difficulty
   - mentor card on wrong answer
   - no replay of same question set
══════════════════════════════════════════ */
const PuzzleEngine = ({ puzzles }) => {
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState(null);
  const [confirmed, setConfirmed] = useState(false);
  const [showMentor, setShowMentor] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [score, setScore] = useState({ correct: 0, total: 0 });

  const puzzle = puzzles[current];
  const isCorrect = confirmed && selected === puzzle?.correct;

  const handleConfirm = () => {
    if (!selected || confirmed) return;
    const correct = selected === puzzle.correct;
    setConfirmed(true);
    setScore(s => ({ correct: s.correct + (correct ? 1 : 0), total: s.total + 1 }));
    if (!correct) setShowMentor(true);
  };

  const handleNext = () => {
    if (current + 1 >= puzzles.length) {
      setCompleted(true);
    } else {
      setCurrent(c => c + 1);
      setSelected(null);
      setConfirmed(false);
      setShowMentor(false);
    }
  };

  const handleRestart = () => {
    setCurrent(0); setSelected(null); setConfirmed(false);
    setShowMentor(false); setCompleted(false);
    setScore({ correct: 0, total: 0 });
  };

  /* Level indicator dots */
  const levelDots = Array.from({ length: 6 }, (_, i) => i < (puzzle?.level || 1));

  if (completed) {
    return (
      <div className="tp-complete">
        <div className="tp-complete__icon"><CheckIcon /></div>
        <h3>Section complete</h3>
        <p>
          {score.correct} of {score.total} correct.
          {score.correct === score.total
            ? " Solid reasoning on this topic."
            : " Review the mentor notes above, then retry."}
        </p>
        <div className="tp-complete__actions">
          <button className="tp-btn tp-btn--ghost" onClick={handleRestart}>Restart</button>
          <Link to="/diagnostics" className="tp-btn tp-btn--primary">
            Run full diagnostic <ChevronRight />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="tp-puzzle">
      {/* Difficulty meta */}
      <div className="tp-puzzle__meta">
        <span className="tp-puzzle__tag">{puzzle.label}</span>
        <div className="tp-puzzle__dots">
          {levelDots.map((filled, i) => (
            <span key={i} className={`tp-puzzle__dot ${filled ? "tp-puzzle__dot--on" : ""}`} />
          ))}
        </div>
      </div>

      {/* Question */}
      <h3 className="tp-puzzle__question">{puzzle.text}</h3>

      {/* Options */}
      <div className="tp-puzzle__options">
        {puzzle.options.map(opt => {
          let mod = "";
          if (confirmed) {
            if (opt.label === puzzle.correct) mod = "correct";
            else if (opt.label === selected && selected !== puzzle.correct) mod = "wrong";
          } else if (opt.label === selected) mod = "selected";

          return (
            <button
              key={opt.label}
              className={`tp-option tp-option--${mod || "idle"}`}
              onClick={() => !confirmed && setSelected(opt.label)}
              disabled={confirmed}
            >
              <span className="tp-option__letter">{opt.label}</span>
              <span className="tp-option__text">{opt.value}</span>
              {confirmed && opt.label === puzzle.correct && <CheckIcon />}
              {confirmed && opt.label === selected && selected !== puzzle.correct && <XIcon />}
            </button>
          );
        })}
      </div>

      {/* Feedback */}
      {confirmed && (
        <div className={`tp-feedback tp-feedback--${isCorrect ? "ok" : "err"}`}>
          <span className="tp-feedback__icon">{isCorrect ? <CheckIcon /> : <XIcon />}</span>
          <div>
            <p className="tp-feedback__verdict">{isCorrect ? "Correct." : "Not quite."}</p>
            <p className="tp-feedback__exp">{puzzle.explanation}</p>
          </div>
        </div>
      )}

      {/* Mentor — only on wrong answer */}
      {showMentor && puzzle.mentor && (
        <div className="tp-mentor">
          <div className="tp-mentor__head">
            <div className="tp-mentor__avatar">🧑‍🏫</div>
            <div>
              <p className="tp-mentor__role">Mentor</p>
              <p className="tp-mentor__subject">{puzzle.mentor.title}</p>
            </div>
          </div>
          <p className="tp-mentor__text">{puzzle.mentor.text}</p>
        </div>
      )}

      {/* Actions */}
      <div className="tp-puzzle__actions">
        {!confirmed ? (
          <button className="tp-btn tp-btn--primary" onClick={handleConfirm} disabled={!selected}>
            Check answer
          </button>
        ) : (
          <button className="tp-btn tp-btn--primary" onClick={handleNext}>
            {current + 1 >= puzzles.length ? "Finish" : "Next puzzle"}
            <ChevronRight />
          </button>
        )}
      </div>
    </div>
  );
};

/* ══════════════════════════════════════════
   BOARD — renders topic content + puzzles
══════════════════════════════════════════ */
const TheoryBoard = ({ topicData }) => {
  if (!topicData) {
    return (
      <div className="tb-coming-soon">
        <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3">
          <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
          <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
        </svg>
        <h3>Coming soon</h3>
        <p>This topic is being prepared.</p>
      </div>
    );
  }

  return (
    <div className="theory-board">

      {/* Topic title strip */}
      <div className="tb-topic-strip">
        <h2 className="tb-topic-strip__title">{topicData.title}</h2>
        <p className="tb-topic-strip__sub">{topicData.subtitle}</p>
      </div>

      {/* Content sections */}
      {topicData.sections.map((section, si) => (
        <div key={section.id} className="tb-section">
          <div className="tb-section__head">
            <span className="tb-section__num">{si + 1}</span>
            <h3 className="tb-section__title">{section.title}</h3>
          </div>
          <div className="tb-section__body">
            {section.blocks.map((block, bi) => (
              <ContentBlock key={bi} block={block} />
            ))}
          </div>
        </div>
      ))}

      {/* Puzzles */}
      {topicData.puzzles?.length > 0 && (
        <div className="tb-puzzles">
          <div className="tb-puzzles__head">
            <div className="tb-puzzles__head-left">
              <div className="tb-puzzles__icon">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M19.439 7.85c-.049.322.059.648.289.878l1.568 1.568c.47.47.706 1.087.706 1.704s-.235 1.233-.706 1.704l-1.611 1.611a.98.98 0 0 1-.837.276c-.47-.07-.802-.48-.968-.943a2.51 2.51 0 0 0-2.357-1.576 2.51 2.51 0 0 0-2.51 2.511c0 .401.098.78.27 1.115.14.281.21.598.21.916a.81.81 0 0 1-.24.574l-1.527 1.527c-.47.47-1.087.706-1.704.706s-1.233-.236-1.704-.706l-1.568-1.568c-.23-.23-.556-.338-.878-.289-.463.066-.875.397-.875.875 0 .617-.235 1.234-.706 1.704" />
                </svg>
              </div>
              <h3 className="tb-puzzles__title">Practice puzzles</h3>
            </div>
            <span className="tb-puzzles__meta">{topicData.puzzles.length} puzzles · escalating difficulty</span>
          </div>
          {/* Thin progress track */}
          <div className="tb-puzzles__track" />
          <PuzzleEngine puzzles={topicData.puzzles} />
        </div>
      )}
    </div>
  );
};

/* ══════════════════════════════════════════
   MAIN PAGE
══════════════════════════════════════════ */
const TheoryPage = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTopic, setActiveTopic] = useState("quadratic");

  const topicData = theory[activeTopic] || null;
  const activeMeta = theoryTopics.find(t => t.id === activeTopic);

  return (
    <div className="page-shell">
      <Header sidebarOpen={sidebarOpen} onToggleSidebar={() => setSidebarOpen(v => !v)} />
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <main className="page-main">
        <div className="theory-page">

          {/* Breadcrumb */}
          <div className="theory-breadcrumb">
            <Link to="/home" className="theory-breadcrumb__item">Home</Link>
            <ChevronRight />
            <span className="theory-breadcrumb__item theory-breadcrumb__item--active">Theory</span>
            {activeMeta && (
              <>
                <ChevronRight />
                <span className="theory-breadcrumb__item theory-breadcrumb__item--active">{activeMeta.title}</span>
              </>
            )}
          </div>

          {/* Page header */}
          <div className="theory-header">
            <div className="theory-header__icon">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
              </svg>
            </div>
            <div>
              <h1 className="theory-header__title">Theory</h1>
              <p className="theory-header__sub">
                Understand the concept before you practice it. Each topic explains the why, not just the how.
              </p>
            </div>
          </div>

          {/* Layout: sidebar + board */}
          <div className="theory-layout">

            {/* Topic sidebar */}
            <aside className="theory-sidebar">
              <span className="theory-sidebar__label">Topics</span>
              {theoryTopics.map(topic => (
                <button
                  key={topic.id}
                  className={`theory-topic-btn ${activeTopic === topic.id ? "theory-topic-btn--active" : ""}`}
                  onClick={() => setActiveTopic(topic.id)}
                >
                  <div className="theory-topic-btn__info">
                    <h4 className="theory-topic-btn__title">{topic.title}</h4>
                    <p className="theory-topic-btn__sub">{topic.subtitle}</p>
                  </div>
                  <ChevronRight />
                </button>
              ))}
            </aside>

            {/* Board */}
            <div className="theory-board-wrap">
              <TheoryBoard topicData={topicData} />
            </div>
          </div>

        </div>
      </main>
    </div>
  );
};

export default TheoryPage;