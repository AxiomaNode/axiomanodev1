function QuestionCard({
  question,
  options,
  selected,
  onSelect,
  showResult,
  correct,
}) {
  return (
    <div className="question-card">
      <p>{question}</p>

      {options.map(({ label, value }) => {
        let cls = "option";

        if (showResult) {
          if (label === correct) cls += " correct";
          else if (label === selected) cls += " wrong";
        } else if (label === selected) {
          cls += " selected";
        }

        return (
          <button
            key={label}
            className={cls}
            onClick={() => onSelect(label)}
          >
            <strong>{label}</strong> {value}
          </button>
        );
      })}
    </div>
  );
}

export default QuestionCard;
