import { getDiagnostics, getPractice, getActiveGaps } from "./db";
import { awardPoints } from "../core/scoringEngine";
import { getTodayDoc, savePlan, markPlanItemXpAwarded } from "./dailyTodos";

/* ── date helpers ── */
const todayStr = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
};
const toLocalDate = (iso) => {
  if (!iso) return "";
  const d = new Date(iso);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
};
const isToday = (iso) => toLocalDate(iso) === todayStr();

/* ── plan generation ── */
const generatePlan = (activeGap = null) => {
  // Puzzle target varies 10–15
  const puzzleTarget = Math.floor(Math.random() * 6) + 10;

  const plan = [
    {
      id:          "plan_diagnostic",
      type:        "diagnostic",
      title:       "Run today's diagnostic",
      description: "Map where your reasoning breaks.",
      target:      1,
      xp:          20,
      xpAwarded:   false,
      route:       "/diagnostics",
      routeState:  null,
    },
  ];

  if (activeGap) {
    plan.push({
      id:          "plan_practice",
      type:        "practice_targeted",
      title:       `Train on: ${activeGap.title}`,
      description: "Targeted practice on your active gap.",
      target:      1,
      xp:          15,
      xpAwarded:   false,
      route:       "/practice",
      routeState:  {
        gapId:    activeGap.evidence?.[0]?.gapId,
        gapTitle: activeGap.title,
        topicId:  activeGap.evidence?.[0]?.topicId,
      },
      gapTitle: activeGap.title,
    });
  } else {
    plan.push({
      id:          "plan_practice",
      type:        "practice_free",
      title:       "Complete a practice session",
      description: "Free practice across any topic.",
      target:      1,
      xp:          15,
      xpAwarded:   false,
      route:       "/practice",
      routeState:  null,
    });
  }

  plan.push({
    id:          "plan_puzzles",
    type:        "puzzles",
    title:       `Solve ${puzzleTarget} puzzles`,
    description: "Sharpen pattern recognition.",
    target:      puzzleTarget,
    xp:          20,
    xpAwarded:   false,
    route:       "/puzzles",
    routeState:  null,
  });

  return plan;
};

/* ── getDailyPlan ── */
export const getDailyPlan = async (uid) => {
  const [todayDoc, allDiagnostics, allPractice, activeGaps] = await Promise.all([
    getTodayDoc(uid),
    getDiagnostics(uid),
    getPractice(uid),
    getActiveGaps(uid),
  ]);

  const activeGap    = activeGaps?.[0] ?? null;
  const puzzleCount  = todayDoc.puzzleCount || 0; // tracked separately, not from sessions

  let plan = todayDoc.plan;

  if (!plan || plan.length === 0) {
    plan = generatePlan(activeGap);
    await savePlan(uid, plan);
  } else {
    // Patch practice task if active gap changed
    const practiceItem = plan.find(i => i.id === "plan_practice");
    if (practiceItem && activeGap) {
      const expectedTitle = `Train on: ${activeGap.title}`;
      if (practiceItem.type !== "practice_targeted" || practiceItem.title !== expectedTitle) {
        plan = plan.map(i => {
          if (i.id !== "plan_practice") return i;
          return {
            ...i,
            type:        "practice_targeted",
            title:       expectedTitle,
            description: "Targeted practice on your active gap.",
            route:       "/practice",
            routeState:  {
              gapId:    activeGap.evidence?.[0]?.gapId,
              gapTitle: activeGap.title,
              topicId:  activeGap.evidence?.[0]?.topicId,
            },
            gapTitle: activeGap.title,
          };
        });
        await savePlan(uid, plan);
      }
    } else if (practiceItem && !activeGap && practiceItem.type === "practice_targeted") {
      plan = plan.map(i => {
        if (i.id !== "plan_practice") return i;
        return {
          ...i,
          type:        "practice_free",
          title:       "Complete a practice session",
          description: "Free practice across any topic.",
          routeState:  null,
          gapTitle:    null,
        };
      });
      await savePlan(uid, plan);
    }

    // Add puzzles card to old 2-card plans
    if (!plan.find(i => i.id === "plan_puzzles")) {
      const puzzleTarget = Math.floor(Math.random() * 6) + 10;
      plan = [
        ...plan,
        {
          id:          "plan_puzzles",
          type:        "puzzles",
          title:       `Solve ${puzzleTarget} puzzles`,
          description: "Sharpen pattern recognition.",
          target:      puzzleTarget,
          xp:          20,
          xpAwarded:   false,
          route:       "/puzzles",
          routeState:  null,
        },
      ];
      await savePlan(uid, plan);
    }
  }

  const todayDiagCount  = allDiagnostics.filter(s => isToday(s.date)).length;
  const todayPractCount = allPractice.filter(s => isToday(s.date)).length;

  const resolved = await Promise.all(
    plan.map(async (item) => {
      let rawProgress = 0;
      if (item.type === "diagnostic")             rawProgress = todayDiagCount;
      else if (item.type === "practice_targeted") rawProgress = todayPractCount;
      else if (item.type === "practice_free")     rawProgress = todayPractCount;
      else if (item.type === "puzzles")           rawProgress = puzzleCount; // from dailyTodos doc

      const progress  = Math.min(rawProgress, item.target);
      const completed = progress >= item.target;

      if (completed && !item.xpAwarded) {
        await awardPoints(uid, "todo_complete", {
          xp:    item.xp,
          label: `Daily todo: ${item.title}`,
        });
        await markPlanItemXpAwarded(uid, item.id);
        return { ...item, completed: true, xpAwarded: true, progress, target: item.target };
      }

      return { ...item, completed, progress, target: item.target };
    })
  );

  return resolved;
};