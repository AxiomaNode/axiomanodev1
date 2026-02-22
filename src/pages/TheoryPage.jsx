import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import Header from "../components/layout/Header";
import Sidebar from "../components/layout/Sidebar";
import { theory, theoryTopics } from "../data/theory";
import { useAuth } from "../context/AuthContext";
import { getTheoryProgress, saveTheoryProgress } from "../services/db";
import "../styles/theory.css";
import "../styles/layout.css";

const ChevronRight = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
    <polyline points="9 18 15 12 9 6" />
  </svg>
);
const ChevronLeft = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
    <polyline points="15 18 9 12 15 6" />
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

const resolve = (value, lang) => {
  if (!value) return "";
  if (typeof value === "string") return value;
  return value[lang] ?? value["ru"] ?? Object.values(value)[0] ?? "";
};

const BlockText = ({ block, t }) => <p className="tb-text">{t(block.content)}</p>;

const BlockFact = ({ block, t }) => (
  <div className="tb-fact">
    <div className="tb-fact__icon">
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="10" />
        <line x1="12" y1="8" x2="12" y2="12" />
        <line x1="12" y1="16" x2="12.01" y2="16" />
      </svg>
    </div>
    <div>
      <span className="tb-fact__label">{t(block.label) || "Origin"}</span>
      <p className="tb-fact__text">{t(block.content)}</p>
    </div>
  </div>
);

const BlockDefinition = ({ block, t }) => (
  <div className="tb-def">
    <span className="tb-def__term">{t(block.term)}</span>
    <p className="tb-def__text">{t(block.content)}</p>
  </div>
);

const BlockExample = ({ block, t }) => (
  <div className="tb-example">
    <p className="tb-example__title">{t(block.title)}</p>
    <ol className="tb-example__steps">
      {block.steps.map((step, i) => (
        <li key={i} className="tb-example__step">
          <span className="tb-example__num">{i + 1}</span>
          <span>{t(step)}</span>
        </li>
      ))}
    </ol>
  </div>
);

const BlockMethod = ({ block, t }) => (
  <div className="tb-method">
    <div className="tb-method__head">
      <span className="tb-method__num">{block.number}</span>
      <h4 className="tb-method__title">{t(block.title)}</h4>
    </div>
    <div className="tb-method__body">
      <p className="tb-method__when"><strong>When:</strong> {t(block.when)}</p>
      <p className="tb-method__example">{t(block.example)}</p>
      {block.note && <p className="tb-method__note">↳ {t(block.note)}</p>}
    </div>
  </div>
);

const BlockDiscriminant = ({ block, t }) => (
  <div className="tb-discriminant">
    <div className="tb-discriminant__head">
      <h4 className="tb-discriminant__title">{t(block.title)}</h4>
      {block.story && <p className="tb-discriminant__story">{t(block.story)}</p>}
    </div>
    <div className="tb-discriminant__body">
      <div className="tb-formula-board">
        <div className="tb-formula-board__grid" aria-hidden="true" />
        <p className="tb-formula-board__formula">{t(block.formula)}</p>
      </div>
      <div className="tb-discriminant-cases">
        {block.meaning.map((m) => (
          <div key={m.condition} className="tb-discriminant-case">
            <span className="tb-discriminant-case__cond">{m.condition}</span>
            <span className="tb-discriminant-case__icon">{m.icon}</span>
            <span className="tb-discriminant-case__result">{t(m.result)}</span>
          </div>
        ))}
      </div>
    </div>
  </div>
);

const BlockInsight = ({ block, t }) => (
  <div className="tb-insight">
    <div className="tb-insight__label">
      <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor" stroke="none">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
      </svg>
      Key insight
    </div>
    <h4 className="tb-insight__title">{t(block.title)}</h4>
    <p className="tb-insight__text">{t(block.content)}</p>
    {block.example && <p className="tb-insight__example">{t(block.example)}</p>}
  </div>
);

const ContentBlock = ({ block, t }) => {
  switch (block.type) {
    case "text": return <BlockText block={block} t={t} />;
    case "fact": return <BlockFact block={block} t={t} />;
    case "definition": return <BlockDefinition block={block} t={t} />;
    case "example": return <BlockExample block={block} t={t} />;
    case "method": return <BlockMethod block={block} t={t} />;
    case "discriminant": return <BlockDiscriminant block={block} t={t} />;
    case "insight": return <BlockInsight block={block} t={t} />;
    default: return null;
  }
};

const PuzzleEngine = ({ puzzles, t }) => {
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
    setCurrent(0);
    setSelected(null);
    setConfirmed(false);
    setShowMentor(false);
    setCompleted(false);
    setScore({ correct: 0, total: 0 });
  };

  const levelDots = Array.from({ length: 6 }, (_, i) => i < (puzzle?.level || 1));

  if (completed) {
    return (
      <div className="tp-complete">
        <div className="tp-complete__icon"><CheckIcon /></div>
        <h3>Section complete</h3>
        <p>
          {score.correct} of {score.total} correct.
          {score.correct === score.total ? " Solid reasoning on this topic." : " Review the mentor notes above, then retry."}
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
      <div className="tp-puzzle__meta">
        <span className="tp-puzzle__tag">{t(puzzle.label)}</span>
        <div className="tp-puzzle__dots">
          {levelDots.map((filled, i) => (
            <span key={i} className={`tp-puzzle__dot ${filled ? "tp-puzzle__dot--on" : ""}`} />
          ))}
        </div>
      </div>

      <h3 className="tp-puzzle__question">{t(puzzle.text)}</h3>

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
              <span className="tp-option__text">{t(opt.value)}</span>
              {confirmed && opt.label === puzzle.correct && <CheckIcon />}
              {confirmed && opt.label === selected && selected !== puzzle.correct && <XIcon />}
            </button>
          );
        })}
      </div>

      {confirmed && (
        <div className={`tp-feedback tp-feedback--${isCorrect ? "ok" : "err"}`}>
          <span className="tp-feedback__icon">{isCorrect ? <CheckIcon /> : <XIcon />}</span>
          <div>
            <p className="tp-feedback__verdict">{isCorrect ? "Correct." : "Not quite."}</p>
            <p className="tp-feedback__exp">{t(puzzle.explanation)}</p>
          </div>
        </div>
      )}

      {showMentor && puzzle.mentor && (
        <div className="tp-mentor">
          <div className="tp-mentor__head">
            <div className="tp-mentor__avatar">🧑‍🏫</div>
            <div>
              <p className="tp-mentor__role">Mentor</p>
              <p className="tp-mentor__subject">{t(puzzle.mentor.title)}</p>
            </div>
          </div>
          <p className="tp-mentor__text">{t(puzzle.mentor.text)}</p>
        </div>
      )}

      <div className="tp-puzzle__actions">
        {!confirmed ? (
          <button className="tp-btn tp-btn--primary" onClick={handleConfirm} disabled={!selected}>
            Check answer
          </button>
        ) : (
          <button className="tp-btn tp-btn--primary" onClick={handleNext}>
            {current + 1 >= puzzles.length ? "Finish" : "Next puzzle"} <ChevronRight />
          </button>
        )}
      </div>
    </div>
  );
};

const TheoryBoard = ({ uid, topicId, topicData, t }) => {
  const totalSections = topicData?.sections?.length || 0;

  const [loading, setLoading] = useState(true);
  const [sec, setSec] = useState(0);
  const [selected, setSelected] = useState(null);
  const [checked, setChecked] = useState(false);
  const [passed, setPassed] = useState(() => ({}));

  const section = useMemo(() => topicData?.sections?.[sec], [topicData, sec]);
  const hasCheck = !!section?.check;
  const isCorrect = checked && selected === section?.check?.correctIndex;
  const isLastSection = sec === totalSections - 1;

  useEffect(() => {
    let alive = true;
    const load = async () => {
      if (!uid || !topicId) return;
      setLoading(true);
      const data = await getTheoryProgress(uid, topicId);
      if (!alive) return;
      setSec(Math.min(Number(data?.secIndex ?? 0), Math.max(totalSections - 1, 0)));
      setPassed(data?.passedSections || {});
      setSelected(null);
      setChecked(false);
      setLoading(false);
    };
    load();
    return () => { alive = false; };
  }, [uid, topicId, totalSections]);

  const persist = async (nextSec, nextPassed) => {
    if (!uid || !topicId) return;
    await saveTheoryProgress(uid, topicId, {
      secIndex: nextSec,
      passedSections: nextPassed,
    });
  };

  if (!topicData) {
    return (
      <div className="tb-coming-soon">
        <h3>Coming soon</h3>
        <p>This topic is being prepared.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="tb-coming-soon">
        <p>Loading...</p>
      </div>
    );
  }

  const sectionKey = section?.id || String(sec);
  const alreadyPassed = !!passed[sectionKey];
  const canProceed = hasCheck ? (alreadyPassed || isCorrect) : true;
  const canShowPuzzles = isLastSection && canProceed;

  const goNext = async () => {
    const next = Math.min(sec + 1, totalSections - 1);
    setSec(next);
    setSelected(null);
    setChecked(false);
    await persist(next, passed);
  };

  const goPrev = async () => {
    const prev = Math.max(sec - 1, 0);
    setSec(prev);
    setSelected(null);
    setChecked(false);
    await persist(prev, passed);
  };

  const onCheck = async () => {
    setChecked(true);
    if (!hasCheck) return;
    if (selected === section.check.correctIndex) {
      const nextPassed = { ...passed, [sectionKey]: true };
      setPassed(nextPassed);
      await persist(sec, nextPassed);
    }
  };

  return (
    <div className="theory-board">
      <div className="tb-topic-strip">
        <h2 className="tb-topic-strip__title">{t(topicData.title)}</h2>
        <p className="tb-topic-strip__sub">{t(topicData.subtitle)}</p>
      </div>

      <div className="tb-section">
        <div className="tb-section__head">
          <span className="tb-section__num">{sec + 1}</span>
          <h3 className="tb-section__title">{t(section.title)}</h3>
        </div>

        <div className="tb-section__body">
          {section.blocks.map((block, bi) => (
            <ContentBlock key={bi} block={block} t={t} />
          ))}
        </div>

        {hasCheck && (
          <div className="tb-check">
            <h4 className="tb-check__q">{t(section.check.question)}</h4>

            <div className="tb-check__opts">
              {section.check.options.map((opt, i) => (
                <button
                  key={i}
                  className={`tb-check__opt ${selected === i ? "is-selected" : ""}`}
                  onClick={() => !checked && !alreadyPassed && setSelected(i)}
                  disabled={checked || alreadyPassed}
                >
                  {t(opt)}
                </button>
              ))}
            </div>

            <div className="tb-check__actions">
              {alreadyPassed ? (
                <div className="tp-feedback tp-feedback--ok">
                  <span className="tp-feedback__icon"><CheckIcon /></span>
                  <div>
                    <p className="tp-feedback__verdict">Passed.</p>
                    <p className="tp-feedback__exp">You already passed this check.</p>
                  </div>
                </div>
              ) : !checked ? (
                <button className="tp-btn tp-btn--primary" onClick={onCheck} disabled={selected === null}>
                  Check
                </button>
              ) : (
                <div className={`tp-feedback tp-feedback--${isCorrect ? "ok" : "err"}`}>
                  <span className="tp-feedback__icon">{isCorrect ? <CheckIcon /> : <XIcon />}</span>
                  <div>
                    <p className="tp-feedback__verdict">{isCorrect ? "Correct." : "Not quite."}</p>
                    <p className="tp-feedback__exp">
                      {isCorrect ? "Great. You can continue." : "Re-read the section above and try again."}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        <div style={{ display: "flex", gap: 10, marginTop: 14 }}>
          <button className="tp-btn tp-btn--ghost" onClick={goPrev} disabled={sec === 0}>
            <ChevronLeft /> Prev
          </button>

          {!isLastSection ? (
            <button className="tp-btn tp-btn--primary" onClick={goNext} disabled={!canProceed}>
              Next section <ChevronRight />
            </button>
          ) : (
            <button className="tp-btn tp-btn--primary" disabled={!canProceed}>
              Puzzles unlocked <CheckIcon />
            </button>
          )}
        </div>
      </div>

      {canShowPuzzles && topicData.puzzles?.length > 0 && (
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
          <div className="tb-puzzles__track" />
          <PuzzleEngine puzzles={topicData.puzzles} t={t} />
        </div>
      )}
    </div>
  );
};

const TheoryPage = () => {
  const { user, language } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTopic, setActiveTopic] = useState("quadratic");

  const t = (value) => resolve(value, language);

  const topicData = theory[activeTopic] || null;
  const activeMeta = theoryTopics.find(tp => tp.id === activeTopic);

  return (
    <div className="page-shell">
      <Header sidebarOpen={sidebarOpen} onToggleSidebar={() => setSidebarOpen(v => !v)} />
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <main className="page-main">
        <div className="theory-page">
          <div className="theory-breadcrumb">
            <Link to="/home" className="theory-breadcrumb__item">Home</Link>
            <ChevronRight />
            <span className="theory-breadcrumb__item theory-breadcrumb__item--active">Theory</span>
            {activeMeta && (
              <>
                <ChevronRight />
                <span className="theory-breadcrumb__item theory-breadcrumb__item--active">{t(activeMeta.title)}</span>
              </>
            )}
          </div>

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

          <div className="theory-layout">
            <aside className="theory-sidebar">
              <span className="theory-sidebar__label">Topics</span>
              {theoryTopics.map(topic => (
                <button
                  key={topic.id}
                  className={`theory-topic-btn ${activeTopic === topic.id ? "theory-topic-btn--active" : ""}`}
                  onClick={() => setActiveTopic(topic.id)}
                >
                  <div className="theory-topic-btn__info">
                    <h4 className="theory-topic-btn__title">{t(topic.title)}</h4>
                    <p className="theory-topic-btn__sub">{t(topic.subtitle)}</p>
                  </div>
                  <ChevronRight />
                </button>
              ))}
            </aside>

            <div className="theory-board-wrap">
              <TheoryBoard uid={user?.uid} topicId={activeTopic} topicData={topicData} t={t} />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default TheoryPage;