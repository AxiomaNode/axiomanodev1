import { gaps } from "./gaps";

export function analyzeResults(answers) {
  const detected = [];

  gaps.forEach((gap) => {
    let isDetected = false;

    for (const questionId in gap.signs) {
      const selected = answers[questionId];
      if (selected && gap.signs[questionId].includes(selected)) {
        isDetected = true;
        break;
      }
    }

    if (isDetected) {
      detected.push(gap);
    }
  });

  return detected;  
}