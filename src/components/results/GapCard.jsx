
import React from 'react';

function GapCard({ gap }) {
  return (
    <div className="gap-card">
      <h3>{gap.title}</h3>
      <p>{gap.description}</p>
      <div className="recommendation">
        <strong>Recommendation:</strong> {gap.recommendation}
      </div>
    </div>
  );
}

export default GapCard;