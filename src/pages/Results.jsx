import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { analyzeResults } from "../diagnostics/analyzeResults";

export default function Results() {
  const navigate = useNavigate();
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const saved = localStorage.getItem("diagnosticAnswers");

    if (!saved) {
      navigate("/diagnostics");
      return;
    }

    try {
      const answers = JSON.parse(saved);
      console.log("Parsed answers:", answers);

      const detected = analyzeResults(answers);
      console.log("Detected gaps:", detected);

      setResult(detected);
    } catch (err) {
      console.error("Error processing results:", err);
      setError("Something went wrong while processing your answers.");
      setResult([]); // fallback so we don't stay stuck
    }
  }, [navigate]);

  const handleRestart = () => {
    localStorage.removeItem("diagnosticAnswers");
    localStorage.removeItem("diagnosticCompleted");
    navigate("/diagnostics");
  };

  if (result === null) {
    return (
      <div className="page-center">
        <div className="panel">
          <h2>Loading results...</h2>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page-center">
        <div className="panel">
          <h1>Error</h1>
          <p>{error}</p>
          <button className="primary-btn" onClick={handleRestart}>
            Try again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="page-center">
      <div className="panel">
        <h1>Diagnostic Results</h1>

        {result.length === 0 ? (
          <div className="result-box success">
            <h2>No gaps detected</h2>
            <p>Great job! Your understanding of quadratic equations looks solid.</p>
          </div>
        ) : (
          <div className="result-box">
            <h2>Detected learning gaps:</h2>
            <ul className="gaps-list">
              {result.map((gap) => (
                <li key={gap.id} className="gap-item">
                  <strong>{gap.title}</strong>
                  <p>{gap.description}</p>
                </li>
              ))}
            </ul>
          </div>
        )}

        <button className="primary-btn" onClick={handleRestart}>
          Take the diagnostic again
        </button>
      </div>
    </div>
  );
}