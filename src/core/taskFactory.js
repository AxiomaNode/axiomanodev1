import { tasks as taskBank } from "../data/tasks";
import { generateQuadraticTasks } from "./generators/quadraticGenerator";

const pickBank = (topicId) => {
  const t = taskBank?.[topicId];
  return t?.practice?.length ? t.practice : (t?.homework?.length ? t.homework : []);
};

export const getTaskSet = ({ topicId, mode = "practice", count = 10, useGenerated = true }) => {
  if (useGenerated && topicId === "quadratic") {
    return generateQuadraticTasks(count);
  }
  return pickBank(topicId).slice(0, count);
};