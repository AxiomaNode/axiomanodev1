import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Header from "../components/layout/Header";
import Sidebar from "../components/layout/Sidebar";
import { theory, theoryTopics } from "../data/theory";
import { useAuth } from "../context/AuthContext";
import { tasks as taskBank } from "../data/tasks";
import { getTheoryProgress, saveTheoryProgress } from "../services/db";
import { getUserProfile } from "../firebase/auth";


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
const ChevronDown = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round">
    <polyline points="6 9 12 15 18 9" />
  </svg>
);

/* ── Helpers ───────────────────────────── */
const norm = (s) => String(s ?? "").trim().toLowerCase().replace(/\s+/g, " ");

/* ═══════════════════════════════════════════════════════════
   CHALKBOARD CANVAS
═══════════════════════════════════════════════════════════ */
const Chalkboard = ({ scene, revealKey }) => {
  const canvasRef = useRef(null);
  const rafRef = useRef(null);
  const DPR = typeof window !== "undefined" ? Math.min(2, window.devicePixelRatio || 1) : 1;

  /* ── Drawing helpers ── */
  const chalkStyle = (ctx, alpha = 0.88) => {
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.shadowBlur = 4;
    ctx.shadowColor = "rgba(255,255,255,0.1)";
    ctx.globalAlpha = alpha;
  };

  const drawAxes = (ctx, ox, oy, w, h, scaleX, scaleY, xMin, xMax) => {
    ctx.save();
    ctx.strokeStyle = "rgba(255,255,255,0.45)";
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    // x-axis
    ctx.moveTo(ox + xMin * scaleX, oy);
    ctx.lineTo(ox + xMax * scaleX, oy);
    // y-axis
    ctx.moveTo(ox, 20);
    ctx.lineTo(ox, h - 20);
    ctx.stroke();

    // Arrow heads
    ctx.fillStyle = "rgba(255,255,255,0.45)";
    ctx.beginPath();
    const ax = ox + xMax * scaleX;
    ctx.moveTo(ax, oy); ctx.lineTo(ax - 8, oy - 4); ctx.lineTo(ax - 8, oy + 4);
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(ox, 20); ctx.lineTo(ox - 4, 28); ctx.lineTo(ox + 4, 28);
    ctx.fill();

    // Axis labels
    ctx.font = "italic 600 13px Georgia, serif";
    ctx.fillStyle = "rgba(255,255,255,0.4)";
    ctx.fillText("x", ax + 6, oy + 5);
    ctx.fillText("y", ox + 6, 18);

    // Tick marks + numbers
    ctx.lineWidth = 1;
    ctx.strokeStyle = "rgba(255,255,255,0.2)";
    ctx.font = "600 11px 'Courier New', monospace";
    ctx.fillStyle = "rgba(255,255,255,0.35)";
    for (let x = Math.ceil(xMin); x <= Math.floor(xMax); x++) {
      if (x === 0) continue;
      const px = ox + x * scaleX;
      ctx.beginPath(); ctx.moveTo(px, oy - 4); ctx.lineTo(px, oy + 4); ctx.stroke();
      ctx.fillText(String(x), px - 4, oy + 17);
    }
    ctx.restore();
  };

  /* ── Scene: parabola_single ── */
  const renderParabolaSingle = (ctx, w, h, t, scene) => {
    const { a = 1, b = -1, c = -6, roots = [-2, 3], xRange = [-3.5, 4.5] } = scene;

    const padL = 52, padR = 28, padT = 28, padB = 44;
    const cw = w - padL - padR;
    const ch = h - padT - padB;

    const xMin = xRange[0], xMax = xRange[1];
    const scaleX = cw / (xMax - xMin);

    // find yMin, yMax by sampling
    let yMin = Infinity, yMax = -Infinity;
    for (let xi = xMin; xi <= xMax; xi += 0.1) {
      const y = a * xi * xi + b * xi + c;
      if (y < yMin) yMin = y;
      if (y > yMax) yMax = y;
    }
    yMin = Math.floor(yMin) - 1;
    yMax = Math.ceil(yMax) + 1;
    const scaleY = ch / (yMax - yMin);

    const ox = padL + (-xMin) * scaleX;
    const oy = padT + (yMax) * scaleY;

    // Helper: math → canvas
    const toC = (x, y) => [ox + x * scaleX, oy - y * scaleY];

    // Axes
    drawAxes(ctx, ox, oy, w, h, scaleX, scaleY, xMin, xMax);

    // Phase 1 (t 0→0.65): draw the curve progressively
    const SAMPLES = 120;
    const curveEnd = Math.floor(SAMPLES * Math.min(1, t / 0.65));

    if (curveEnd > 1) {
      ctx.save();
      chalkStyle(ctx, 0.92);
      ctx.strokeStyle = "rgba(42, 213, 180, 0.85)";
      ctx.lineWidth = 2.2;
      ctx.shadowBlur = 8;
      ctx.shadowColor = "rgba(42, 213, 180, 0.25)";
      ctx.beginPath();
      for (let i = 0; i < curveEnd; i++) {
        const xi = xMin + (i / SAMPLES) * (xMax - xMin);
        const yi = a * xi * xi + b * xi + c;
        const [px, py] = toC(xi, yi);
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.stroke();
      ctx.restore();
    }

    // Phase 2 (t 0.65→0.82): root dots appear
    if (t > 0.65) {
      const dotT = Math.min(1, (t - 0.65) / 0.17);
      roots.forEach((rx) => {
        const [px, py] = toC(rx, 0);
        const r = 5 * dotT;

        // glow
        ctx.save();
        ctx.globalAlpha = 0.25 * dotT;
        const grad = ctx.createRadialGradient(px, py, 0, px, py, 14);
        grad.addColorStop(0, "rgba(42,213,180,0.8)");
        grad.addColorStop(1, "rgba(42,143,160,0)");
        ctx.fillStyle = grad;
        ctx.beginPath(); ctx.arc(px, py, 14, 0, Math.PI * 2); ctx.fill();
        ctx.restore();

        // dot
        ctx.save();
        ctx.globalAlpha = dotT;
        ctx.fillStyle = "rgba(42, 213, 180, 0.95)";
        ctx.shadowBlur = 8;
        ctx.shadowColor = "rgba(42,213,180,0.6)";
        ctx.beginPath(); ctx.arc(px, py, r, 0, Math.PI * 2); ctx.fill();
        ctx.restore();
      });
    }

    // Phase 3 (t 0.82→1.0): labels fade in
    if (t > 0.82) {
      const labelT = Math.min(1, (t - 0.82) / 0.18);
      roots.forEach((rx, idx) => {
        const [px, py] = toC(rx, 0);
        const label = idx === 0 ? `x₁ = ${rx}` : `x₂ = ${rx}`;
        const offsetX = rx < 0 ? -52 : 10;

        ctx.save();
        ctx.globalAlpha = labelT;
        ctx.font = "700 12px 'Courier New', monospace";
        ctx.fillStyle = "rgba(42, 213, 180, 0.9)";
        ctx.shadowBlur = 5;
        ctx.shadowColor = "rgba(42,213,180,0.4)";
        ctx.fillText(label, px + offsetX, py - 16);
        ctx.restore();
      });

      // vertex dot (subtle)
      const vx = -b / (2 * a);
      const vy = a * vx * vx + b * vx + c;
      const [vpx, vpy] = toC(vx, vy);
      ctx.save();
      ctx.globalAlpha = 0.4 * labelT;
      ctx.fillStyle = "rgba(255,255,255,0.6)";
      ctx.beginPath(); ctx.arc(vpx, vpy, 3, 0, Math.PI * 2); ctx.fill();
      ctx.restore();
    }
  };

  /* ── Scene: parabola_D_cases ── */
  const renderDCases = (ctx, w, h, t) => {
    const cols = 3;
    const pad = 14;
    const boxW = (w - pad * 2 - 18) / cols;
    const boxH = h - 18 - pad * 2;
    const top = pad;

    const shifts = [
      { shiftY: -1.4, label: "D > 0", hint: "2 real roots", color: "rgba(42,213,180,0.9)" },
      { shiftY: 0.0,  label: "D = 0", hint: "1 repeated root", color: "rgba(255,210,100,0.9)" },
      { shiftY: 1.4,  label: "D < 0", hint: "no real roots",   color: "rgba(255,100,100,0.9)" },
    ];

    for (let i = 0; i < 3; i++) {
      const left = pad + i * (boxW + 9);
      const s = shifts[i];

      // box border — subtle divider
      ctx.save();
      if (i < 2) {
        ctx.strokeStyle = "rgba(255,255,255,0.06)";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(left + boxW + 4, top + 10);
        ctx.lineTo(left + boxW + 4, top + boxH - 10);
        ctx.stroke();
      }
      ctx.restore();

      // local coordinate system
      const ox = left + boxW / 2;
      const oy = top + boxH * 0.58;
      const lw = boxW * 0.8;
      const lh = boxH * 0.65;

      // mini axes
      ctx.save();
      ctx.strokeStyle = "rgba(255,255,255,0.3)";
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.moveTo(left + 10, oy); ctx.lineTo(left + boxW - 8, oy);
      ctx.moveTo(ox, top + 10); ctx.lineTo(ox, top + boxH - 12);
      ctx.stroke();
      ctx.restore();

      // parabola points
      const pts = [];
      for (let k = -50; k <= 50; k++) {
        const x = k / 10;
        const y = 0.28 * x * x + s.shiftY;
        const px = ox + (x / 5) * (lw / 2);
        const py = oy - (y / 3) * lh;
        pts.push([px, py]);
      }

      // draw curve progressively
      const maxPts = Math.floor(pts.length * Math.min(1, t / 0.7));
      ctx.save();
      chalkStyle(ctx, 0.88);
      ctx.strokeStyle = "rgba(42, 213, 180, 0.75)";
      ctx.lineWidth = 2.0;
      ctx.shadowBlur = 6;
      ctx.shadowColor = "rgba(42,213,180,0.15)";
      ctx.beginPath();
      for (let p = 0; p < maxPts; p++) {
        const [px, py] = pts[p];
        if (p === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
      }
      ctx.stroke();
      ctx.restore();

      // root dots & labels after curve is drawn
      if (t > 0.7) {
        const tt = Math.min(1, (t - 0.7) / 0.3);

        if (s.label === "D > 0") {
          const r = Math.sqrt(Math.abs(s.shiftY) / 0.28);
          const p1x = ox - (r / 5) * (lw / 2);
          const p2x = ox + (r / 5) * (lw / 2);
          [p1x, p2x].forEach(px => {
            ctx.save();
            ctx.globalAlpha = tt;
            ctx.fillStyle = s.color;
            ctx.shadowBlur = 6;
            ctx.shadowColor = s.color;
            ctx.beginPath(); ctx.arc(px, oy, 4, 0, Math.PI * 2); ctx.fill();
            ctx.restore();
          });
        }
        if (s.label === "D = 0") {
          ctx.save();
          ctx.globalAlpha = tt;
          ctx.fillStyle = s.color;
          ctx.shadowBlur = 6;
          ctx.shadowColor = s.color;
          ctx.beginPath(); ctx.arc(ox, oy, 4, 0, Math.PI * 2); ctx.fill();
          ctx.restore();
        }

        // labels
        ctx.save();
        ctx.globalAlpha = tt;
        ctx.font = "800 12px 'Courier New', monospace";
        ctx.fillStyle = s.color;
        ctx.fillText(s.label, left + 10, top + 18);
        ctx.font = "500 11px -apple-system, sans-serif";
        ctx.fillStyle = "rgba(180, 210, 205, 0.6)";
        ctx.fillText(s.hint, left + 10, top + 34);
        ctx.restore();
      }
    }
  };

  /* ── Main render dispatcher ── */
  const renderScene = (ctx, w, h, t) => {
    ctx.clearRect(0, 0, w, h);

    // Fill with clean dark background (no green tint)
    ctx.fillStyle = "#0d1117";
    ctx.fillRect(0, 0, w, h);

    if (!scene) return;

    if (scene.type === "parabola_single") {
      renderParabolaSingle(ctx, w, h, t, scene);
    } else if (scene.type === "parabola_D_cases") {
      renderDCases(ctx, w, h, t);
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const parent = canvas.parentElement;
    const w = Math.max(320, parent?.clientWidth || 600);
    const h = scene?.type === "parabola_single" ? 260 : 220;

    canvas.width = Math.floor(w * DPR);
    canvas.height = Math.floor(h * DPR);
    canvas.style.width = `${w}px`;
    canvas.style.height = `${h}px`;

    const ctx = canvas.getContext("2d");
    ctx.scale(DPR, DPR);

    let start = null;
    const duration = scene?.type === "parabola_single" ? 1200 : 820;

    const tick = (ts) => {
      if (!start) start = ts;
      const p = Math.min(1, (ts - start) / duration);
      renderScene(ctx, w, h, p);
      if (p < 1) rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
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
      {scene.caption && <p className="th-boardviz__captext">{scene.caption}</p>}
    </div>
  );
};

/* ── MiniCheck ─────────────────────────── */
const MiniCheck = ({ check, isPassed, onPass }) => {
  const [selected, setSelected] = useState(null);
  const [checked, setChecked] = useState(false);

  useEffect(() => { setSelected(null); setChecked(false); }, [check]);

  if (!check) return null;
  if (isPassed) {
    return (
      <div className="th-check th-check--passed">
        <div className="th-check__icon"><CheckIcon /></div>
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

  const optText    = (opt) => (typeof opt === "string" ? opt : opt?.label ?? "");
  const optExplain = (opt) => (typeof opt === "object" ? opt?.explanation : "");

  const handleCheck = () => {
    setChecked(true);
    if (selected === correctIndex) setTimeout(onPass, 200);
  };

  const isCorrect = checked && selected === correctIndex;

  return (
    <div className="th-check th-check--chalk">
      <div className="th-check__cap">
        <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
        </svg>
        Section check
      </div>
      <p className="th-check__q">{check.question}</p>
      <div className="th-check__opts">
        {options.map((opt, i) => {
          const sel = selected === i;
          const cls = checked
            ? i === correctIndex
              ? "th-opt th-opt--correct"
              : sel ? "th-opt th-opt--wrong" : "th-opt"
            : sel ? "th-opt th-opt--selected" : "th-opt";
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
          <button className="th-linkbtn" onClick={() => { setChecked(false); setSelected(null); }}>
            Try again
          </button>
        </div>
      )}
      {!checked && (
        <button className="th-btn th-btn--primary" onClick={handleCheck} disabled={selected === null}>
          Submit Answer
        </button>
      )}
    </div>
  );
};

/* ── RevealCard (collapsible "I didn't get it") ── */
const RevealCard = ({ card }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className={`th-card th-card--reveal${open ? " th-card--reveal-open" : ""}`}>
      <button className="th-reveal__trigger" onClick={() => setOpen(v => !v)}>
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
          <circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><path d="M12 17h.01"/>
        </svg>
        {card.trigger || "I didn't understand — explain more"}
        <span className={`th-reveal__chevron${open ? " th-reveal__chevron--open" : ""}`}><ChevronDown /></span>
      </button>
      {open && (
        <div className="th-reveal__body">
          {(card.cards || []).map((c, i) => renderCard(c, i, "reveal"))}
        </div>
      )}
    </div>
  );
};

/* ── Card renderers ─────────────────────── */
const CardText       = ({ content }) => <p className="th-text">{content}</p>;

const CardFact       = ({ label, content }) => (
  <div className="th-card th-card--fact">
    <div className="th-card__cap"><span className="th-dot" />{label || "Key idea"}</div>
    <p className="th-p">{content}</p>
  </div>
);

const CardDefinition = ({ term, content }) => (
  <div className="th-card th-card--def">
    <span className="th-term">{term}</span>
    <p className="th-p">{content}</p>
  </div>
);

const CardFormula = ({ label, content, note }) => (
  <div className="th-card th-card--formula">
    <div className="th-formula__badge">
      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
        <path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5z"/>
      </svg>
      {label || "Write this down"}
    </div>
    <pre className="th-formula__expr">{content}</pre>
    {note && <p className="th-formula__note">{note}</p>}
  </div>
);

const CardAnalogy = ({ icon, title, content }) => (
  <div className="th-card th-card--analogy">
    <div className="th-analogy__head">
      <span className="th-analogy__icon">{icon}</span>
      <span className="th-analogy__title">{title}</span>
    </div>
    <p className="th-p">{content}</p>
  </div>
);

const CardExample    = ({ title, steps }) => (
  <div className="th-card th-card--example">
    <p className="th-smallcap">{title}</p>
    <div className="th-steps">
      {steps.map((st, i) => (
        st === "" ? <div key={i} className="th-step-spacer" /> : (
          <div key={i} className="th-step">
            <span className="th-step__n">{i + 1}</span>
            <p className="th-code">{st}</p>
          </div>
        )
      ))}
    </div>
  </div>
);

const CardInsight    = ({ title, content }) => (
  <div className="th-card th-card--insight">
    <div className="th-insight__head">
      <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
      </svg>
      {title}
    </div>
    <p className="th-p">{content}</p>
  </div>
);

const CardMethod     = ({ title, example, note, whenLabel, whenValue }) => (
  <div className="th-card th-card--method">
    <h4 className="th-h4">{title}</h4>
    <p className="th-meta"><strong>{whenLabel}:</strong> {whenValue}</p>
    <div className="th-codebox">{example}</div>
    {note && <p className="th-note">↳ {note}</p>}
  </div>
);

const CardBoard      = ({ scene, revealKey }) => (
  <div className="th-card th-card--board">
    <Chalkboard scene={scene} revealKey={revealKey} />
  </div>
);

const renderCard = (c, i, revealKey) => {
  if (!c) return null;
  if (c.type === "text")       return <CardText       key={i} content={c.content} />;
  if (c.type === "fact")       return <CardFact       key={i} label={c.label} content={c.content} />;
  if (c.type === "definition") return <CardDefinition key={i} term={c.term} content={c.content} />;
  if (c.type === "formula")    return <CardFormula    key={i} label={c.label} content={c.content} note={c.note} />;
  if (c.type === "analogy")    return <CardAnalogy    key={i} icon={c.icon} title={c.title} content={c.content} />;
  if (c.type === "example")    return <CardExample    key={i} title={c.title} steps={c.steps || []} />;
  if (c.type === "insight")    return <CardInsight    key={i} title={c.title} content={c.content} />;
  if (c.type === "method")     return <CardMethod     key={i} title={c.title} example={c.example} note={c.note} whenLabel="When" whenValue={c.when} />;
  if (c.type === "board")      return <CardBoard      key={i} scene={c.scene} revealKey={revealKey} />;
  if (c.type === "reveal")     return <RevealCard     key={i} card={c} />;
  return null;
};

/* ════════════════════════════════════════
   PAGE COMPONENT
════════════════════════════════════════ */
const TheoryPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [topicId, setTopicId]         = useState(theoryTopics?.[0]?.id || "quadratic");
  const [secIdx, setSecIdx]           = useState(0);
  const [stepIdx, setStepIdx]         = useState(0);
  const [passedChecks, setPassedChecks] = useState({});
  const [loading, setLoading]         = useState(true);
  const [userGrade, setUserGrade]     = useState(null);

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

  useEffect(() => {
    if (!filteredTopics?.length) return;
    const ok = filteredTopics.some((t) => t.id === topicId);
    if (!ok) setTopicId(filteredTopics[0].id);
  }, [filteredTopics]); // eslint-disable-line

  const tData         = theory[topicId] || null;
  const sectionsCount = tData?.sections?.length || 0;
  const storageKey    = useMemo(() => `theory_prog_${topicId}`, [topicId]);

  const loadProgress = async () => {
    setLoading(true);
    try {
      if (user?.uid) {
        const p = await getTheoryProgress(user.uid, topicId);
        setSecIdx(Number(p?.secIndex ?? 0));
        setStepIdx(Number(p?.stepIndex ?? 0));
        setPassedChecks(p?.passedChecks || {});
      } else {
        const raw = localStorage.getItem(storageKey);
        if (raw) {
          const p = JSON.parse(raw);
          setSecIdx(Number(p?.secIndex ?? 0));
          setStepIdx(Number(p?.stepIndex ?? 0));
          setPassedChecks(p?.passedChecks || {});
        } else {
          setSecIdx(0); setStepIdx(0); setPassedChecks({});
        }
      }
    } finally { setLoading(false); }
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

  const isPracticeMode = false;
  const currSection    = tData?.sections?.[secIdx] ?? null;
  const stepsCount     = currSection?.steps?.length || 0;

  useEffect(() => {
    if (!isPracticeMode && stepIdx > Math.max(stepsCount - 1, 0)) setStepIdx(0);
    if (!isPracticeMode && stepIdx < 0) setStepIdx(0);
  }, [topicId, secIdx, stepsCount, isPracticeMode]);

  const currStep  = currSection?.steps?.[stepIdx] ?? null;
  const revealKey = `${topicId}:${secIdx}:${stepIdx}`;

  const scrollTop = () => boardRef.current?.scrollTo({ top: 0, behavior: "auto" });

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
    setSecIdx(nextSec); setStepIdx(0);
    await saveProgress(nextSec, 0, passedChecks);
  };

  const handlePrevStep = async () => {
    scrollTop();
    if (stepIdx > 0) {
      const st = stepIdx - 1; setStepIdx(st);
      await saveProgress(secIdx, st, passedChecks);
      return;
    }
    if (secIdx > 0) {
      const ps   = secIdx - 1;
      const last = (tData?.sections?.[ps]?.steps?.length || 1) - 1;
      setSecIdx(ps); setStepIdx(Math.max(last, 0));
      await saveProgress(ps, Math.max(last, 0), passedChecks);
    }
  };

  const handlePassCheck = async () => {
    const key = `${secIdx}-${stepIdx}`;
    const neo = { ...passedChecks, [key]: true };
    setPassedChecks(neo);
    await saveProgress(secIdx, stepIdx, neo);
  };

  const handleGoHomework = () => {
    navigate("/homework", { state: { topicId } });
  };

  const handleRestartTheory = async () => {
    setSecIdx(0); setStepIdx(0); setPassedChecks({});
    await saveProgress(0, 0, {});
    scrollTop();
  };

  if (!tData) {
    return (
      <div className="page-shell">
        <main className="page-main th-wrap">Topic not found.</main>
      </div>
    );
  }

  const hasCheck       = !!currStep?.check;
  const isPassed       = !!passedChecks[`${secIdx}-${stepIdx}`];
  const canGoNext      = !hasCheck || isPassed;
  const isLastStep     = stepIdx + 1 === stepsCount;
  const isLastSection  = secIdx + 1 === sectionsCount;
  const isFinished     = isLastStep && isLastSection;
  const stepsDots      = currSection?.steps || [];
  const secProgress    = `${secIdx + 1}/${Math.max(sectionsCount, 1)}`;

  return (
    <div className="page-shell">
      <Header sidebarOpen={sidebarOpen} onToggleSidebar={() => setSidebarOpen((v) => !v)} />
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <main className="page-main th-wrap">
        {/* Hero */}
        <section className="th-hero th-hero--chalk">
          <div className="th-hero__content">
            <div className="th-hero__left">
              <div className="th-tag"><InfoIcon />Theory Board</div>
              <h1 className="th-title">{tData.title}</h1>
              <p className="th-sub">
                We move step-by-step like a real teacher on a board: explanation → example → mini check.
                Unlock homework at the end.
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
                      <strong>{stepIdx + 1}/{Math.max(stepsCount, 1)}</strong>
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
          {/* Sidebar */}
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
              <Link to="/tasks"    className="th-side__link">Go to Tasks    <ChevronRight /></Link>
              <Link to="/practice" className="th-side__link">Practice mode  <ChevronRight /></Link>
            </div>
          </aside>

          {/* Board */}
          <section className="th-board th-board--chalk" ref={boardRef}>
            <div className="th-board__top">
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
            </div>

            <div className="th-board__inner th-board__inner--chalk">
              {loading ? (
                <div className="th-skeleton">Loading…</div>
              ) : (
                <div className="th-flow">
                  <div className="th-cards">
                    {(currStep?.cards || []).map((c, i) => renderCard(c, i, revealKey))}
                  </div>
                  {hasCheck && (
                    <MiniCheck check={currStep.check} isPassed={isPassed} onPass={handlePassCheck} />
                  )}
                  {/* Completion card */}
                  {isFinished && canGoNext && (
                    <div className="th-complete">
                      <div className="th-complete__head">
                        <div className="th-complete__badge">
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                        </div>
                        <div>
                          <h3 className="th-complete__title">Theory complete</h3>
                          <p className="th-complete__sub">You have studied all {sectionsCount} sections.</p>
                        </div>
                      </div>
                      <div className="th-complete__actions">
                        <button className="th-btn th-btn--primary" onClick={handleGoHomework}>
                          Do homework <ChevronRight />
                        </button>
                        <button className="th-btn th-btn--ghost" onClick={handleRestartTheory}>
                          Restart from beginning
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Bottom nav */}
            {!loading && (
              <div className="th-nav">
                <button
                  className="th-navbtn"
                  onClick={handlePrevStep}
                  disabled={secIdx === 0 && stepIdx === 0}
                >
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

                <button
                  className="th-navbtn th-navbtn--primary"
                  onClick={isFinished && canGoNext ? handleGoHomework : handleNextStep}
                  disabled={!canGoNext || isFinished}
                >
                  <span>{isFinished ? "All done" : "Next"}</span>
                  <span className="th-navbtn__ic">
                    {isFinished ? (
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    ) : <ChevronRight />}
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