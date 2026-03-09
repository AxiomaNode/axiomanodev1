import { topics } from "../data/topics";
import { questions } from "../data/questions";
import { gapsDatabase } from "../data/gaps";

const GAP_WRONG_THRESHOLD = 2;

export const buildFullDiagnostic = (selectedTopicIds = null) => {
  const activeTopics = topics.filter(t => {
    const hasQ = questions[t.id]?.length > 0;
    const isSel = selectedTopicIds ? selectedTopicIds.includes(t.id) : true;
    return hasQ && isSel;
  });
  if (!activeTopics.length) return [];
  const pool = [];
  activeTopics.forEach(topic => {
    (questions[topic.id] || []).forEach(q => pool.push({ ...q, topicId: topic.id }));
  });
  return pool;
};

export const detectAllGaps = (answers, allQuestions) => {
  const fullAnswers = {};
  allQuestions.forEach(q => { fullAnswers[q.id] = answers[q.id] ?? "__skipped__"; });
  const result = {};
  topics.forEach(topic => {
    const topicGaps = gapsDatabase[topic.id];
    if (!topicGaps) return;
    const found = [];
    topicGaps.forEach(gap => {
      let wrongCount = 0, signalCount = 0;
      Object.entries(gap.signs).forEach(([qId, wrongAnswers]) => {
        if (fullAnswers[qId] === undefined) return;
        signalCount++;
        const given = fullAnswers[qId];
        if (given === "__skipped__" || wrongAnswers.includes(given)) wrongCount++;
      });
      if (signalCount >= 2 && wrongCount >= GAP_WRONG_THRESHOLD) {
        found.push({ ...gap, wrongCount, signalCount });
      }
    });
    if (found.length) result[topic.id] = found;
  });
  return result;
};