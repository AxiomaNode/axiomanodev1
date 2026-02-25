import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Header from "../components/layout/Header";
import Sidebar from "../components/layout/Sidebar";
import { theory, theoryTopics } from "../data/theory";
import { useAuth } from "../context/AuthContext";
import { getTheoryProgress, saveTheoryProgress, assignHomework } from "../services/db";
import { getUserProfile } from "../firebase/auth";
import { tasks as taskBank } from "../data/tasks";

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

/* ── Helpers ───────────────────────────── */
const norm = (s) => String(s ?? "").trim().toLowerCase().replace(/\s+/g, " ");

/* =========================================================
   DIGITAL CHALKBOARD (simple, no libs)
   - draws "chalk strokes" gradually
   - supports few predefined scenes for now
========================================================= */

const Chalkboard = ({ scene, revealKey }) => {
  const canvasRef = useRef(null);
  const rafRef = useRef(null);

  const DPR = typeof window !== "undefined" ? Math.min(2, window.devicePixelRatio || 1) : 1;

  const drawAxes = (ctx, w, h) => {
    ctx.save();
    ctx.globalAlpha = 0.9;
    ctx.lineWidth = 2.2;
    ctx.strokeStyle = "rgba(245,245,245,0.75)";
    ctx.beginPath();
    // x axis
    ctx.moveTo(40, h - 40);
    ctx.lineTo(w - 24, h - 40);
    // y axis
    ctx.moveTo(40, h - 40);
    ctx.lineTo(40, 24);
    ctx.stroke();

    // ticks
    ctx.globalAlpha = 0.55;
    ctx.lineWidth = 1.4;
    for (let i = 0; i < 8; i++) {
      const x = 40 + i * ((w - 80) / 7);
      ctx.beginPath();
      ctx.moveTo(x, h - 40);
      ctx.lineTo(x, h - 34);
      ctx.stroke();
    }
    for (let i = 0; i < 6; i++) {
      const y = (h - 40) - i * ((h - 80) / 5);
      ctx.beginPath();
      ctx.moveTo(40, y);
      ctx.lineTo(34, y);
      ctx.stroke();
    }

    ctx.restore();
  };

  const chalkStroke = (ctx) => {
    // tiny noisy line style
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.shadowBlur = 6;
    ctx.shadowColor = "rgba(255,255,255,0.18)";
  };

  const pathParabola = (w, h, a = 0.06, shiftX = 0, shiftY = 0) => {
    // map math coords to canvas
    const ox = 40;
    const oy = h - 40;
    const sx = (w - 80) / 14; // -7..7
    const sy = (h - 80) / 10; // -2..8

    const pts = [];
    for (let i = -70; i <= 70; i++) {
      const x = i / 10; // -7..7
      const y = a * (x - shiftX) * (x - shiftX) + shiftY;
      const cx = ox + (x + 7) * sx;
      const cy = oy - (y + 2) * sy;
      pts.push([cx, cy]);
    }
    return pts;
  };

  const drawPoint = (ctx, x, y, label) => {
    ctx.save();
    ctx.fillStyle = "rgba(255,255,255,0.9)";
    ctx.beginPath();
    ctx.arc(x, y, 3.2, 0, Math.PI * 2);
    ctx.fill();

    if (label) {
      ctx.font = "700 12px ui-monospace, SFMono-Regular, Menlo, monospace";
      ctx.fillStyle = "rgba(245,245,245,0.78)";
      ctx.fillText(label, x + 8, y - 8);
    }
    ctx.restore();
  };

  const renderScene = (ctx, w, h, t) => {
    // t: 0..1 progress
    ctx.clearRect(0, 0, w, h);

    // board faint grid
    ctx.save();
    ctx.globalAlpha = 0.35;
    ctx.lineWidth = 1;
    ctx.strokeStyle = "rgba(255,255,255,0.06)";
    const step = 28;
    for (let x = 0; x < w; x += step) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, h);
      ctx.stroke();
    }
    for (let y = 0; y < h; y += step) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(w, y);
      ctx.stroke();
    }
    ctx.restore();

    if (!scene) return;

    // Common: axes
    if (scene.type === "axes" || scene.type?.startsWith("parabola")) {
      drawAxes(ctx, w, h);
    }

    if (scene.type === "axes") {
      ctx.save();
      chalkStroke(ctx);
      ctx.globalAlpha = 0.9;
      ctx.fillStyle = "rgba(245,245,245,0.82)";
      ctx.font = "800 13px ui-monospace, SFMono-Regular, Menlo, monospace";
      ctx.fillText("x-axis", w - 70, h - 18);
      ctx.fillText("y-axis", 10, 30);
      ctx.restore();
      return;
    }

    if (scene.type === "parabola_D_cases") {
      // three mini-parabolas: D>0, D=0, D<0
      const cols = 3;
      const pad = 14;
      const boxW = (w - pad * 2 - 18) / cols;
      const boxH = h - 18 - pad * 2;
      const top = pad;

      for (let i = 0; i < 3; i++) {
        const left = pad + i * (boxW + 9);

        // box
        ctx.save();
        ctx.globalAlpha = 0.9;
        ctx.strokeStyle = "rgba(255,255,255,0.12)";
        ctx.lineWidth = 1.2;
        ctx.strokeRect(left, top, boxW, boxH);
        ctx.restore();

        // mini axes
        const ox = left + 18;
        const oy = top + boxH - 22;
        ctx.save();
        ctx.strokeStyle = "rgba(245,245,245,0.55)";
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(ox, oy);
        ctx.lineTo(left + boxW - 12, oy);
        ctx.moveTo(ox, oy);
        ctx.lineTo(ox, top + 12);
        ctx.stroke();
        ctx.restore();

        // parabola + intercepts
        const localW = boxW - 30;
        const localH = boxH - 34;

        const map = (x, y) => {
          // x: -5..5, y: -1..6
          const sx = localW / 10;
          const sy = localH / 7;
          const cx = ox + (x + 5) * sx;
          const cy = oy - (y + 1) * sy;
          return [cx, cy];
        };

        // shift cases
        const shifts = [
          { shiftY: -1.2, label: "D > 0", hint: "2 roots" },
          { shiftY: 0.0, label: "D = 0", hint: "1 root" },
          { shiftY: 1.2, label: "D < 0", hint: "no real roots" },
        ];

        const s = shifts[i];
        const pts = [];
        for (let k = -60; k <= 60; k++) {
          const x = k / 6; // -10..10 approx
          const xx = Math.max(-5, Math.min(5, x));
          const y = 0.22 * xx * xx + s.shiftY;
          pts.push(map(xx, y));
        }

        ctx.save();
        chalkStroke(ctx);
        ctx.strokeStyle = "rgba(245,245,245,0.82)";
        ctx.lineWidth = 2.2;

        const maxSeg = Math.floor(pts.length * t);
        ctx.beginPath();
        for (let p = 0; p < maxSeg; p++) {
          const [x, y] = pts[p];
          if (p === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
        ctx.restore();

        // draw intercept points progressively a bit later
        if (t > 0.6) {
          const tt = (t - 0.6) / 0.4;

          // compute approximate intercepts by checking sign change around y=0 line (y=0 corresponds to map y=0)
          const roots = [];
          for (let k = -50; k < 50; k++) {
            const x1 = k / 10;
            const x2 = (k + 1) / 10;
            const y1 = 0.22 * x1 * x1 + s.shiftY;
            const y2 = 0.22 * x2 * x2 + s.shiftY;
            // y=0 crossing
            if ((y1 <= 0 && y2 >= 0) || (y1 >= 0 && y2 <= 0)) {
              // linear approx
              const x = x1 + (0 - y1) * (x2 - x1) / (y2 - y1 || 1e-9);
              roots.push(x);
            }
          }

          ctx.save();
          ctx.globalAlpha = Math.min(1, tt);
          chalkStroke(ctx);

          if (s.label === "D > 0") {
            // two roots, roughly ±something
            const r = Math.sqrt(Math.max(0.001, -s.shiftY / 0.22));
            const [p1x, p1y] = map(-r, 0);
            const [p2x, p2y] = map(r, 0);
            drawPoint(ctx, p1x, p1y, "root");
            drawPoint(ctx, p2x, p2y, "root");
          }
          if (s.label === "D = 0") {
            const [px, py] = map(0, 0);
            drawPoint(ctx, px, py, "touch");
          }
          // D < 0 => none

          // labels
          ctx.fillStyle = "rgba(245,245,245,0.82)";
          ctx.font = "900 12px ui-monospace, SFMono-Regular, Menlo, monospace";
          ctx.fillText(s.label, left + 14, top + 18);
          ctx.globalAlpha = 0.75;
          ctx.font = "700 12px -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif";
          ctx.fillText(s.hint, left + 14, top + 36);
          ctx.restore();
        }
      }
      return;
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const parent = canvas.parentElement;
    const w = Math.max(320, parent?.clientWidth || 640);
    const h = 220;

    canvas.width = Math.floor(w * DPR);
    canvas.height = Math.floor(h * DPR);
    canvas.style.width = `${w}px`;
    canvas.style.height = `${h}px`;

    const ctx = canvas.getContext("2d");
    ctx.scale(DPR, DPR);

    let start = null;
    const duration = 780;

    const tick = (ts) => {
      if (!start) start = ts;
      const p = Math.min(1, (ts - start) / duration);
      renderScene(ctx, w, h, p);
      if (p < 1) rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scene?.type, revealKey]);

  if (!scene) return null;

  return (
    <div className="th-boardviz">
      <div className="th-boardviz__cap">
        <span className="th-chalkdot" />
        <span>{scene.title || "Board"}</span>
      </div>
      <canvas ref={canvasRef} className="th-boardviz__canvas" />
      {scene.caption ? <p className="th-boardviz__captext">{scene.caption}</p> : null}
    </div>
  );
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
    check.correctIndex !== undefined
      ? Number(check.correctIndex)
      : options.findIndex((o) => typeof o === "object" && o?.isCorrect);
  const correctIndex = actualCorrectIndex >= 0 ? actualCorrectIndex : 0;

  const optText = (opt) => (typeof opt === "string" ? opt : opt?.label ?? "");
  const optExplain = (opt) => (typeof opt === "object" ? opt?.explanation : "");

  const handleCheck = () => {
    setChecked(true);
    if (selected === correctIndex) setTimeout(onPass, 160);
  };

  const isCorrect = checked && selected === correctIndex;

  return (
    <div className="th-check th-check--chalk">
      <div className="th-check__cap">Mini check</div>
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
          <p className="th-p">{optExplain(options[selected]) || "Not quite. Re-read and try again."}</p>
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

/* ── Render cards (chalk vibe) ─────────── */
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

const CardBoard = ({ scene, revealKey }) => (
  <div className="th-card th-card--board">
    <Chalkboard scene={scene} revealKey={revealKey} />
  </div>
);

const renderCard = (c, i, revealKey) => {
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
  if (c.type === "board") return <CardBoard key={i} scene={c.scene} revealKey={revealKey} />;
  return null;
};

/* ════════════════════════════════════════
   PAGE
════════════════════════════════════════ */
const TheoryPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [topicId, setTopicId] = useState(theoryTopics?.[0]?.id || "quadratic");

  const [secIdx, setSecIdx] = useState(0);
  const [stepIdx, setStepIdx] = useState(0);
  const [passedChecks, setPassedChecks] = useState({});
  const [loading, setLoading] = useState(true);

  const [userGrade, setUserGrade] = useState(null);

  const boardRef = useRef(null);

  useEffect(() => {
    if (!user?.uid) return;
    getUserProfile(user.uid).then((p) => setUserGrade(p?.grade ?? null));
  }, [user?.uid]);

  const filteredTopics = useMemo(() => {
    const g = Number(userGrade);
    if (!Number.isFinite(g)) return theoryTopics;
    return theoryTopics.filter((t) => {
      const minG = t.minGrade ?? 0;
      const maxG = t.maxGrade ?? 99;
      return g >= minG && g <= maxG;
    });
  }, [userGrade]);

  // if grade filter hides current topic, switch to first allowed
  useEffect(() => {
    if (!filteredTopics?.length) return;
    const ok = filteredTopics.some((t) => t.id === topicId);
    if (!ok) setTopicId(filteredTopics[0].id);
  }, [filteredTopics]); // eslint-disable-line

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

  const isPracticeMode = secIdx >= sectionsCount;
  const currSection = !isPracticeMode ? tData?.sections?.[secIdx] : null;
  const stepsCount = currSection?.steps?.length || 0;

  useEffect(() => {
    if (!isPracticeMode && stepIdx > Math.max(stepsCount - 1, 0)) setStepIdx(0);
    if (!isPracticeMode && stepIdx < 0) setStepIdx(0);
  }, [topicId, secIdx, stepsCount, isPracticeMode]);

  const currStep = !isPracticeMode ? currSection?.steps?.[stepIdx] : null;
  const revealKey = `${topicId}:${secIdx}:${stepIdx}`;

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

  const handleAssignHomework = async () => {
    if (!user?.uid) {
      // allow viewing theory without account, but homework needs auth
      navigate("/auth");
      return;
    }
    const bank = taskBank?.[topicId]?.homework || [];
    if (!bank.length) return;

    await assignHomework(
      user.uid,
      topicId,
      {
        topicTitle: tData?.title || topicId,
        grade: userGrade,
        tasks: bank,
      },
      false
    );

    navigate("/tasks", { state: { topicId } });
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
        <section className="th-hero th-hero--chalk">
          <div className="th-hero__content">
            <div className="th-hero__left">
              <div className="th-tag">
                <InfoIcon />
                Theory Board
              </div>

              <h1 className="th-title">{tData.title}</h1>

              <p className="th-sub">
                We move step-by-step like a real teacher on a board: explanation → example → mini check. Unlock homework at the end.
              </p>

              <div className="th-stats">
                <div className="th-stat">
                  <strong>{filteredTopics.length}</strong>
                  <span>Topics</span>
                </div>
                <div className="th-stat__div" />
                <div className="th-stat">
                  <strong>{sectionsCount}</strong>
                  <span>Sections</span>
                </div>
                <div className="th-stat__div" />
                <div className="th-stat">
                  <strong>{tData.homeworkCount || (taskBank?.[topicId]?.homework?.length || 0)}</strong>
                  <span>Homework tasks</span>
                </div>
              </div>
            </div>

            <div className="th-hero__right">
              <div className="th-hero__card th-hero__card--chalk">
                <p className="th-hero__cardcap">Current progress</p>
                <div className="th-hero__progress">
                  <div className="th-hero__pill">
                    <span>Section</span>
                    <strong>{secProgress}</strong>
                  </div>
                  {!isPracticeMode && (
                    <div className="th-hero__pill">
                      <span>Step</span>
                      <strong>
                        {stepIdx + 1}/{Math.max(stepsCount, 1)}
                      </strong>
                    </div>
                  )}
                  {userGrade && (
                    <div className="th-hero__pill">
                      <span>Grade</span>
                      <strong>{userGrade}</strong>
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
              {filteredTopics.map((tp) => (
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

            <div className="th-side__footer">
              <Link to="/tasks" className="th-side__link">
                Go to Tasks <ChevronRight />
              </Link>
              <Link to="/practice" className="th-side__link">
                Practice mode <ChevronRight />
              </Link>
            </div>
          </aside>

          {/* Right board */}
          <section className="th-board th-board--chalk" ref={boardRef}>
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
                  <span className="th-crumbs__sec">Homework</span>
                </div>
              )}
            </div>

            <div className="th-board__inner th-board__inner--chalk">
              {loading ? (
                <div className="th-skeleton">Loading…</div>
              ) : !isPracticeMode ? (
                <div className="th-flow">
                  <div className="th-cards">
                    {(currStep?.cards || []).map((c, i) => renderCard(c, i, revealKey))}
                  </div>

                  {hasCheck && <MiniCheck check={currStep.check} isPassed={isPassed} onPass={handlePassCheck} />}
                </div>
              ) : (
                <div className="th-homework-unlock">
                  <div className="th-homework-unlock__head">
                    <div className="th-homework-unlock__icon">
                      <LockIcon />
                    </div>
                    <div>
                      <h2 className="th-homework-unlock__title">Homework unlocked</h2>
                      <p className="th-p">
                        Homework is stored in Firestore. You must answer all tasks to complete the topic and earn percent.
                      </p>
                    </div>
                  </div>

                  <div className="th-homework-unlock__actions">
                    <button className="th-btn th-btn--primary" onClick={handleAssignHomework}>
                      Assign Homework & Go <ChevronRight />
                    </button>
                    <Link to="/tasks" className="th-btn th-btn--ghost">
                      Open Tasks <ChevronRight />
                    </Link>
                    <button className="th-btn th-btn--ghost" onClick={handlePrevStep}>
                      Back to theory <ChevronLeft />
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Bottom nav */}
            {!loading && (
              <div className="th-nav">
                <button className="th-navbtn" onClick={handlePrevStep} disabled={secIdx === 0 && stepIdx === 0}>
                  <span className="th-navbtn__ic"><ChevronLeft /></span>
                  <span>Prev</span>
                </button>

                {!isPracticeMode ? (
                  <div className="th-navmid">
                    <span className="th-navpill">
                      <strong>{stepIdx + 1}</strong>
                      <span>/</span>
                      <strong>{Math.max(stepsCount, 1)}</strong>
                    </span>
                  </div>
                ) : (
                  <div className="th-navmid">
                    <span className="th-navpill">
                      <strong>Homework</strong>
                    </span>
                  </div>
                )}

                {!isPracticeMode ? (
                  <button className="th-navbtn th-navbtn--primary" onClick={handleNextStep} disabled={!canGoNext}>
                    <span>{isLastStep && isLastSection ? "Unlock Homework" : "Next"}</span>
                    <span className="th-navbtn__ic">
                      {isLastStep && isLastSection ? <LockIcon /> : <ChevronRight />}
                    </span>
                  </button>
                ) : (
                  <button className="th-navbtn th-navbtn--primary" onClick={handleAssignHomework}>
                    <span>Assign & Go</span>
                    <span className="th-navbtn__ic"><ChevronRight /></span>
                  </button>
                )}
              </div>
            )}
          </section>
        </section>
      </main>
    </div>
  );
};

export default TheoryPage;