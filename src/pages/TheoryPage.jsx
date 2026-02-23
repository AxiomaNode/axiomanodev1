import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import Header from "../components/layout/Header";
import Sidebar from "../components/layout/Sidebar";
import { theory, theoryTopics } from "../data/theory";
import { useAuth } from "../context/AuthContext";
import { getTheoryProgress, saveTheoryProgress } from "../services/db";

import "../styles/theory.css";
import "../styles/layout.css";

/* ── Icons ─────────────────────────────── */
const ChevronRight = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round">
    <polyline points="9 18 15 12 9 6" />
  </svg>
);
const ChevronLeft = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round">
    <polyline points="15 18 9 12 15 6" />
  </svg>
);
const CheckIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);
const LockIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </svg>
);
const InfoIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
    <circle cx="12" cy="12" r="10" />
    <path d="M12 10v7" />
    <path d="M12 7h.01" />
  </svg>
);

/* ── Network BG (same vibe as Home) ─────── */
const NetworkBg = () => (
  <svg className="th-hero__network" viewBox="0 0 900 420" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    {[
      [70, 60],[210, 35],[380, 80],[560, 45],[740, 95],[850, 55],
      [130, 170],[310, 145],[490, 195],[670, 155],[820, 195],
      [55, 285],[205, 265],[380, 305],[540, 275],[720, 295],[880, 265],
      [120, 385],[300, 365],[480, 395],[650, 375],[810, 405],
    ].map(([x,y],i) => (
      <circle key={i} cx={x} cy={y} r={i%3===0?4:3} fill="rgba(42,143,160,0.22)" />
    ))}
    {[
      [70,60,210,35],[210,35,380,80],[380,80,560,45],[560,45,740,95],[740,95,850,55],
      [70,60,130,170],[210,35,310,145],[380,80,490,195],[560,45,670,155],[740,95,820,195],
      [130,170,310,145],[310,145,490,195],[490,195,670,155],[670,155,820,195],
      [130,170,55,285],[310,145,205,265],[490,195,380,305],[670,155,540,275],[820,195,720,295],
      [55,285,205,265],[205,265,380,305],[380,305,540,275],[540,275,720,295],[720,295,880,265],
      [55,285,120,385],[205,265,300,365],[380,305,480,395],[540,275,650,375],[720,295,810,405],
      [120,385,300,365],[300,365,480,395],[480,395,650,375],[650,375,810,405],
    ].map(([x1,y1,x2,y2],i) => (
      <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="rgba(42,143,160,0.11)" strokeWidth="1" />
    ))}
    <text x="58"  y="220" fill="rgba(42,143,160,0.10)" fontSize="52" fontFamily="Georgia, serif">∑</text>
    <text x="700" y="340" fill="rgba(42,143,160,0.08)" fontSize="38" fontFamily="Georgia, serif">∫</text>
    <text x="430" y="398" fill="rgba(42,143,160,0.08)" fontSize="34" fontFamily="Georgia, serif">Δ</text>
    <text x="805" y="130" fill="rgba(42,143,160,0.08)" fontSize="28" fontFamily="Georgia, serif">π</text>
    <text x="260" y="405" fill="rgba(42,143,160,0.08)" fontSize="26" fontFamily="Georgia, serif">f(x)</text>
    <text x="610" y="415" fill="rgba(42,143,160,0.07)" fontSize="24" fontFamily="Georgia, serif">√n</text>
  </svg>
);

/* ── Helpers ───────────────────────────── */
const norm = (s) => String(s ?? "").trim().toLowerCase().replace(/\s+/g, " ");
const equalAnswer = (a, b) => {
  const A = norm(a);
  const B = norm(b);
  if (A === B) return true;
  const na = Number(A);
  const nb = Number(B);
  if (Number.isFinite(na) && Number.isFinite(nb)) return na === nb;
  return false;
};

/* ── Cards ─────────────────────────────── */
const CardText = ({ content }) => <p className="th-text">{content}</p>;

const CardFact = ({ label, content }) => (
  <div className="th-card th-card--fact">
    <div className="th-card__cap">
      <span className="th-dot" />
      <span>{label || "Key idea"}</span>
    </div>
    <p className="th-p">{content}</p>
  </div>
);

const CardDefinition = ({ term, content }) => (
  <div className="th-card th-card--def">
    <span className="th-term">{term}</span>
    <p className="th-p">{content}</p>
  </div>
);

const CardExample = ({ title, steps }) => (
  <div className="th-card th-card--example">
    <p className="th-smallcap">{title}</p>
    <div className="th-steps">
      {steps.map((st, i) => (
        <div key={i} className="th-step">
          <span className="th-step__n">{i + 1}</span>
          <p className="th-code">{st}</p>
        </div>
      ))}
    </div>
  </div>
);

const CardInsight = ({ title, content }) => (
  <div className="th-card th-card--insight">
    <div className="th-insight__head">
      <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
      </svg>
      {title}
    </div>
    <p className="th-p">{content}</p>
  </div>
);

const CardMethod = ({ title, example, note, whenLabel, whenValue }) => (
  <div className="th-card th-card--method">
    <h4 className="th-h4">{title}</h4>
    <p className="th-meta">
      <strong>{whenLabel}:</strong> {whenValue}
    </p>
    <div className="th-codebox">{example}</div>
    {note && <p className="th-note">↳ {note}</p>}
  </div>
);

const CardDiscriminant = ({ data }) => (
  <div className="th-card th-card--disc">
    <div className="th-disc__top">
      <div className="th-disc__formula">{data.formula}</div>
      {data.story && <p className="th-p">{data.story}</p>}
    </div>
    <div className="th-disc__cases">
      {(data.meaning || []).map((m) => (
        <div key={m.condition} className="th-disc__case">
          <div className="th-disc__cond">{m.condition}</div>
          <div className="th-disc__icon">{m.icon}</div>
          <p className="th-p">{m.result}</p>
        </div>
      ))}
    </div>
  </div>
);

const renderCard = (c, i) => {
  if (!c) return null;
  if (c.type === "text") return <CardText key={i} content={c.content} />;
  if (c.type === "fact") return <CardFact key={i} label={c.label} content={c.content} />;
  if (c.type === "definition") return <CardDefinition key={i} term={c.term} content={c.content} />;
  if (c.type === "example") return <CardExample key={i} title={c.title} steps={c.steps || []} />;
  if (c.type === "insight") return <CardInsight key={i} title={c.title} content={c.content} />;
  if (c.type === "method")
    return (
      <CardMethod
        key={i}
        title={c.title}
        example={c.example}
        note={c.note}
        whenLabel="When"
        whenValue={c.when}
      />
    );
  if (c.type === "discriminant") return <CardDiscriminant key={i} data={c} />;
  return null;
};

/* ── Mini Check ────────────────────────── */
const MiniCheck = ({ check, isPassed, onPass }) => {
  const [selected, setSelected] = useState(null);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    setSelected(null);
    setChecked(false);
  }, [check]);

  if (!check) return null;

  if (isPassed) {
    return (
      <div className="th-check th-check--passed">
        <div className="th-check__icon">
          <CheckIcon />
        </div>
        <div>
          <div className="th-check__title">Check passed</div>
          <div className="th-check__sub">You can continue.</div>
        </div>
      </div>
    );
  }

  const options = Array.isArray(check.options) ? check.options : [];
  const actualCorrectIndex =
    check.correctIndex !== undefined ? Number(check.correctIndex) : options.findIndex((o) => typeof o === "object" && o?.isCorrect);
  const correctIndex = actualCorrectIndex >= 0 ? actualCorrectIndex : 0;

  const optText = (opt) => (typeof opt === "string" ? opt : opt?.label ?? "");
  const optExplain = (opt) => (typeof opt === "object" ? opt?.explanation : "");

  const handleCheck = () => {
    setChecked(true);
    if (selected === correctIndex) setTimeout(onPass, 160);
  };

  const isCorrect = checked && selected === correctIndex;

  return (
    <div className="th-check">
      <div className="th-check__cap">Check your understanding</div>
      <p className="th-check__q">{check.question}</p>

      <div className="th-check__opts">
        {options.map((opt, i) => {
          const sel = selected === i;
          const cls = checked
            ? i === correctIndex
              ? "th-opt th-opt--correct"
              : sel
                ? "th-opt th-opt--wrong"
                : "th-opt"
            : sel
              ? "th-opt th-opt--selected"
              : "th-opt";

          return (
            <button key={i} className={cls} onClick={() => !checked && setSelected(i)} disabled={checked}>
              <span className="th-radio">{sel ? <span /> : null}</span>
              {optText(opt)}
            </button>
          );
        })}
      </div>

      {checked && !isCorrect && selected !== null && (
        <div className="th-check__error">
          <p className="th-p">{optExplain(options[selected]) || "Not quite. Review and try again."}</p>
          <button
            className="th-linkbtn"
            onClick={() => {
              setChecked(false);
              setSelected(null);
            }}
          >
            Retry
          </button>
        </div>
      )}

      {!checked && (
        <button className="th-btn th-btn--primary" onClick={handleCheck} disabled={selected === null}>
          Submit
        </button>
      )}
    </div>
  );
};

/* ── Practice Ladder ───────────────────── */
const PracticeLadder = ({ puzzles }) => {
  const [curr, setCurr] = useState(0);
  const [val, setVal] = useState("");
  const [selectedOpt, setSelectedOpt] = useState(null);
  const [status, setStatus] = useState("idle");
  const [score, setScore] = useState(0);

  const puzzle = puzzles?.[curr];

  const next = () => {
    setCurr((c) => c + 1);
    setVal("");
    setSelectedOpt(null);
    setStatus("idle");
  };

  if (curr >= (puzzles?.length || 0)) {
    return (
      <div className="th-done">
        <div className="th-done__icon">
          <CheckIcon />
        </div>
        <h2 className="th-done__h2">Topic complete</h2>
        <p className="th-p">You scored {score} out of {puzzles.length}.</p>
        <Link to="/home" className="th-btn th-btn--ghost" style={{ marginTop: 16 }}>
          Return Home
        </Link>
      </div>
    );
  }

  if (!puzzle) return null;

  const submit = () => {
    if (status !== "idle") return;

    const ok =
      puzzle.type === "mcq"
        ? selectedOpt != null && selectedOpt === puzzle.correct
        : val && equalAnswer(val, puzzle.correct);

    if (ok) {
      setStatus("success");
      setScore((s) => s + 1);
    } else {
      setStatus("error");
    }
  };

  const chosenExplain =
    puzzle.type === "mcq" && selectedOpt != null
      ? puzzle.options?.find((o) => o.label === selectedOpt)?.explanation
      : null;

  return (
    <div className="th-practice">
      <div className="th-badge">{puzzle.label}</div>
      <h3 className="th-practice__q">{puzzle.text}</h3>

      <div className="th-practice__interactive">
        {puzzle.type === "mcq" ? (
          <div className="th-mcq">
            {(puzzle.options || []).map((o) => {
              const isChosen = selectedOpt === o.label;
              const smod =
                status !== "idle"
                  ? o.label === puzzle.correct
                    ? "correct"
                    : isChosen
                      ? "error"
                      : ""
                  : isChosen
                    ? "selected"
                    : "";

              return (
                <button
                  key={o.label}
                  className={`th-mcq__btn ${smod ? `th-mcq__btn--${smod}` : ""}`}
                  onClick={() => status === "idle" && setSelectedOpt(o.label)}
                  disabled={status !== "idle"}
                >
                  <span className="th-mcq__letter">{o.label}</span>
                  <span className="th-mcq__text">{o.value}</span>
                </button>
              );
            })}
          </div>
        ) : (
          <div className="th-sa">
            <input
              type="text"
              className="th-input"
              placeholder="Type answer here..."
              value={val}
              onChange={(e) => setVal(e.target.value)}
              disabled={status !== "idle"}
            />
          </div>
        )}
      </div>

      {status === "idle" ? (
        <button className="th-btn th-btn--primary" onClick={submit} disabled={puzzle.type === "mcq" ? !selectedOpt : !val}>
          Check Answer
        </button>
      ) : (
        <div className={`th-feedback th-feedback--${status}`}>
          <div className="th-feedback__res">
            <strong>{status === "success" ? "Correct!" : "Incorrect."}</strong>
            <p className="th-p">{status === "success" ? puzzle.explanation : chosenExplain || puzzle.explanation || ""}</p>
          </div>

          {status === "error" && puzzle.mentor && (
            <div className="th-mentor">
              <div className="th-mentor__head">Mentor tip: {puzzle.mentor.title}</div>
              <p className="th-p">{puzzle.mentor.text}</p>
            </div>
          )}

          <button className="th-btn th-btn--ghost" onClick={next} style={{ marginTop: 14 }}>
            {curr + 1 === puzzles.length ? "Finish" : "Next"} <ChevronRight />
          </button>
        </div>
      )}
    </div>
  );
};

/* ════════════════════════════════════════
   PAGE
════════════════════════════════════════ */
const TheoryPage = () => {
  const { user } = useAuth();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [topicId, setTopicId] = useState(theoryTopics?.[0]?.id || "quadratic");
  const [secIdx, setSecIdx] = useState(0);
  const [stepIdx, setStepIdx] = useState(0);
  const [passedChecks, setPassedChecks] = useState({});
  const [loading, setLoading] = useState(true);

  const boardRef = useRef(null);

  const tData = theory[topicId] || null;
  const sectionsCount = tData?.sections?.length || 0;

  const storageKey = useMemo(() => `theory_prog_${topicId}`, [topicId]);

  const loadProgress = async () => {
    setLoading(true);
    try {
      if (user?.uid) {
        const p = await getTheoryProgress(user.uid, topicId);
        const s = Number(p?.secIndex ?? 0);
        const st = Number(p?.stepIndex ?? 0);
        setSecIdx(Number.isFinite(s) ? s : 0);
        setStepIdx(Number.isFinite(st) ? st : 0);
        setPassedChecks(p?.passedChecks || {});
      } else {
        const raw = localStorage.getItem(storageKey);
        if (raw) {
          const p = JSON.parse(raw);
          setSecIdx(Number(p?.secIndex ?? 0));
          setStepIdx(Number(p?.stepIndex ?? 0));
          setPassedChecks(p?.passedChecks || {});
        } else {
          setSecIdx(0);
          setStepIdx(0);
          setPassedChecks({});
        }
      }
    } finally {
      setLoading(false);
    }
  };

  const saveProgress = async (s = secIdx, st = stepIdx, ch = passedChecks) => {
    const payload = { secIndex: s, stepIndex: st, passedChecks: ch };
    if (user?.uid) await saveTheoryProgress(user.uid, topicId, payload);
    else localStorage.setItem(storageKey, JSON.stringify(payload));
  };

  useEffect(() => {
    if (!tData) return;
    loadProgress();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [topicId, user?.uid]);

  useEffect(() => {
    if (!tData) return;
    const maxSec = Math.max(sectionsCount, 0);
    if (secIdx < 0) setSecIdx(0);
    if (secIdx > maxSec) setSecIdx(maxSec);
  }, [sectionsCount]); // eslint-disable-line react-hooks/exhaustive-deps

  const isPracticeMode = secIdx >= sectionsCount;
  const currSection = !isPracticeMode ? tData?.sections?.[secIdx] : null;
  const stepsCount = currSection?.steps?.length || 0;

  useEffect(() => {
    if (!isPracticeMode && stepIdx > Math.max(stepsCount - 1, 0)) setStepIdx(0);
    if (!isPracticeMode && stepIdx < 0) setStepIdx(0);
  }, [topicId, secIdx, stepsCount, isPracticeMode]);

  const currStep = !isPracticeMode ? currSection?.steps?.[stepIdx] : null;

  const scrollTop = () => {
    const el = boardRef.current;
    if (el) el.scrollTo({ top: 0, left: 0, behavior: "auto" });
  };

  const handleNextStep = async () => {
    scrollTop();
    if (!currSection) return;

    if (stepIdx + 1 < stepsCount) {
      const st = stepIdx + 1;
      setStepIdx(st);
      await saveProgress(secIdx, st, passedChecks);
      return;
    }

    const nextSec = secIdx + 1;
    setSecIdx(nextSec);
    setStepIdx(0);
    await saveProgress(nextSec, 0, passedChecks);
  };

  const handlePrevStep = async () => {
    scrollTop();

    if (isPracticeMode) {
      const lastSec = Math.max(sectionsCount - 1, 0);
      const lastSteps = tData?.sections?.[lastSec]?.steps?.length || 1;
      setSecIdx(lastSec);
      setStepIdx(Math.max(lastSteps - 1, 0));
      await saveProgress(lastSec, Math.max(lastSteps - 1, 0), passedChecks);
      return;
    }

    if (stepIdx > 0) {
      const st = stepIdx - 1;
      setStepIdx(st);
      await saveProgress(secIdx, st, passedChecks);
      return;
    }

    if (secIdx > 0) {
      const ps = secIdx - 1;
      const last = (tData?.sections?.[ps]?.steps?.length || 1) - 1;
      setSecIdx(ps);
      setStepIdx(Math.max(last, 0));
      await saveProgress(ps, Math.max(last, 0), passedChecks);
    }
  };

  const handlePassCheck = async () => {
    const key = `${secIdx}-${stepIdx}`;
    const neo = { ...passedChecks, [key]: true };
    setPassedChecks(neo);
    await saveProgress(secIdx, stepIdx, neo);
  };

  if (!tData) {
    return (
      <div className="page-shell">
        <main className="page-main th-wrap">Topic not found.</main>
      </div>
    );
  }

  const hasCheck = !!currStep?.check;
  const isPassed = !!passedChecks[`${secIdx}-${stepIdx}`];
  const canGoNext = !hasCheck || isPassed;

  const isLastStep = !isPracticeMode && stepIdx + 1 === stepsCount;
  const isLastSection = !isPracticeMode && secIdx + 1 === sectionsCount;

  const stepsDots = currSection?.steps || [];
  const secProgress = `${secIdx + 1}/${Math.max(sectionsCount, 1)}`;

  return (
    <div className="page-shell">
      <Header sidebarOpen={sidebarOpen} onToggleSidebar={() => setSidebarOpen((v) => !v)} />
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <main className="page-main th-wrap">

        {/* Hero header */}
        <section className="th-hero">
          <NetworkBg />
          <div className="th-hero__content">
            <div className="th-hero__left">
              <div className="th-tag">
                <InfoIcon />
                Theory Track
              </div>

              <h1 className="th-title">
                {tData.title}
              </h1>

              <p className="th-sub">
                Learn the concept, verify understanding, then unlock practice. Progress is saved automatically.
              </p>

              <div className="th-stats">
                <div className="th-stat">
                  <strong>{theoryTopics.length}</strong>
                  <span>Topics</span>
                </div>
                <div className="th-stat__div" />
                <div className="th-stat">
                  <strong>{sectionsCount}</strong>
                  <span>Sections</span>
                </div>
                <div className="th-stat__div" />
                <div className="th-stat">
                  <strong>{tData.puzzles?.length || 0}</strong>
                  <span>Practice items</span>
                </div>
              </div>
            </div>

            <div className="th-hero__right">
              <div className="th-hero__card">
                <p className="th-hero__cardcap">Current progress</p>
                <div className="th-hero__progress">
                  <div className="th-hero__pill">
                    <span>Section</span>
                    <strong>{secProgress}</strong>
                  </div>
                  {!isPracticeMode && (
                    <div className="th-hero__pill">
                      <span>Step</span>
                      <strong>{stepIdx + 1}/{Math.max(stepsCount, 1)}</strong>
                    </div>
                  )}
                  {isPracticeMode && (
                    <div className="th-hero__pill">
                      <span>Mode</span>
                      <strong>Practice</strong>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Layout */}
        <section className="th-layout">
          {/* Left topics */}
          <aside className="th-side">
            <div className="th-side__head">
              <div>
                <div className="th-side__eyebrow">Topics</div>
                <div className="th-side__hint">Pick what to study</div>
              </div>
              <div className="th-side__badge">{secProgress}</div>
            </div>

            <div className="th-side__list">
              {theoryTopics.map((tp) => (
                <button
                  key={tp.id}
                  className={`th-topic ${tp.id === topicId ? "is-active" : ""}`}
                  onClick={() => setTopicId(tp.id)}
                >
                  <div className="th-topic__txt">
                    <div className="th-topic__title">{tp.title}</div>
                    <div className="th-topic__sub">{tp.subtitle}</div>
                  </div>
                  <ChevronRight />
                </button>
              ))}
            </div>
          </aside>

          {/* Right board (BIGGER) */}
          <section className="th-board" ref={boardRef}>
            <div className="th-board__top">
              {!isPracticeMode ? (
                <>
                  <div className="th-crumbs">
                    <span className="th-crumbs__topic">{tData.title}</span>
                    <span className="th-crumbs__sep">/</span>
                    <span className="th-crumbs__sec">{currSection?.title}</span>
                  </div>

                  <div className="th-tracker">
                    {stepsDots.map((_, i) => (
                      <div key={i} className={`th-dotstep ${i === stepIdx ? "active" : i < stepIdx ? "done" : ""}`} />
                    ))}
                  </div>
                </>
              ) : (
                <div className="th-crumbs">
                  <span className="th-crumbs__topic">{tData.title}</span>
                  <span className="th-crumbs__sep">/</span>
                  <span className="th-crumbs__sec">Practice</span>
                </div>
              )}
            </div>

            <div className="th-board__inner">
              {loading ? (
                <div className="th-skeleton">Loading…</div>
              ) : !isPracticeMode ? (
                <div className="th-flow">
                  <div className="th-cards">
                    {(currStep?.cards || []).map((c, i) => renderCard(c, i))}
                  </div>
                  {hasCheck && (
                    <MiniCheck
                      check={currStep.check}
                      isPassed={isPassed}
                      onPass={handlePassCheck}
                    />
                  )}
                </div>
              ) : (
                <PracticeLadder puzzles={tData.puzzles || []} />
              )}
            </div>

            {/* Bottom nav */}
            {!isPracticeMode && !loading && (
              <div className="th-nav">
                <button className="th-navbtn" onClick={handlePrevStep} disabled={secIdx === 0 && stepIdx === 0}>
                  <span className="th-navbtn__ic"><ChevronLeft /></span>
                  <span>Prev</span>
                </button>

                <div className="th-navmid">
                  <span className="th-navpill">
                    <strong>{stepIdx + 1}</strong>
                    <span>/</span>
                    <strong>{Math.max(stepsCount, 1)}</strong>
                  </span>
                </div>

                <button className="th-navbtn th-navbtn--primary" onClick={handleNextStep} disabled={!canGoNext}>
                  <span>{isLastStep && isLastSection ? "Unlock Practice" : "Next"}</span>
                  <span className="th-navbtn__ic">
                    {isLastStep && isLastSection ? <LockIcon /> : <ChevronRight />}
                  </span>
                </button>
              </div>
            )}
          </section>
        </section>
      </main>
    </div>
  );
};

export default TheoryPage;