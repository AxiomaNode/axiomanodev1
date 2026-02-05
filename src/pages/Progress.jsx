export default function Progress() {
  const completed =
    localStorage.getItem("diagnosticCompleted") === "true";

  const answers = JSON.parse(
    localStorage.getItem("diagnosticAnswers") || "{}"
  );

  return (
    <div className="page-center">
      <div className="panel">
        <h1>📈 My Progress</h1>

        <div className="progress-grid">
          <div className="stat-card">
            <h3>Diagnostic</h3>
            <p>{completed ? "Completed" : "Not completed"}</p>
          </div>

          <div className="stat-card">
            <h3>Answered Questions</h3>
            <p>{Object.keys(answers).length}</p>
          </div>

          <div className="stat-card">
            <h3>Next Step</h3>
            <p>
              {completed
                ? "Review recommendations"
                : "Take the diagnostic"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
