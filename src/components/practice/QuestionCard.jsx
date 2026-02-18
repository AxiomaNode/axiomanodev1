
import React from 'react';

function QuestionCard({ question, options, selected, onSelect, showResult, correct }) {
  return (
    <div className="question-card">
      <p className="question-text">{question}</p>
      <div className="options">
        {options.map((opt) => {
          let className = 'option';
          if (showResult) {
            if (opt.label === correct) className += ' correct';
            if (opt.label === selected && opt.label !== correct) className += ' wrong';
          } else if (selected === opt.label) {
            className += ' selected';
          }
          return (
            <div key={opt.label} className={className} onClick={() => onSelect(opt.label)}>
              <span>{opt.label}</span> {opt.value}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default QuestionCard;