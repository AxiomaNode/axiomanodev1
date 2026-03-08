import { getDiagnostics, getPractice } from "./db";
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

/* ── plan generation — always 2 cards ── */
const generatePlan = () => {
  const practiceTarget = Math.random() < 0.5 ? 1 : 2;
  return [
    {
      id: "plan_diagnostic",
      type: "diagnostic",
      title: "Run today's diagnostic",
      target: 1,
      xp: 20,
      xpAwarded: false,
    },
    {
      id: "plan_practice",
      type: "practice",
      title: `Complete ${practiceTarget} practice session${practiceTarget > 1 ? "s" : ""}`,
      target: practiceTarget,
      xp: practiceTarget === 1 ? 15 : 25,
      xpAwarded: false,
    },
  ];
};

export const getDailyPlan = async (uid) => {
  const todayDoc = await getTodayDoc(uid);

  let plan = todayDoc.plan;
  if (!plan || plan.length === 0) {
    plan = generatePlan();
    await savePlan(uid, plan);
  }

  const [allDiagnostics, allPractice] = await Promise.all([
    getDiagnostics(uid),
    getPractice(uid),
  ]);

  const todayDiagCount  = allDiagnostics.filter((s) => isToday(s.date)).length;
  const todayPractCount = allPractice.filter((s) => isToday(s.date)).length;

  const resolved = await Promise.all(
    plan.map(async (item) => {
      const completed =
        item.type === "diagnostic"
          ? todayDiagCount >= item.target
          : todayPractCount >= item.target;

      if (completed && !item.xpAwarded) {
        await awardPoints(uid, "todo_complete", {
          xp: item.xp,
          label: `Daily todo: ${item.title}`,
        });
        await markPlanItemXpAwarded(uid, item.id);
        return { ...item, completed: true, xpAwarded: true };
      }

      return { ...item, completed };
    })
  );

  return resolved;
};