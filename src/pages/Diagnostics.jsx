  import { useState } from "react";
  import { useNavigate } from "react-router-dom";

  export default function Diagnostics() {
    const navigate = useNavigate();
    const [answers, setAnswers] = useState({});

    const setAnswer = (id, value) => {
      setAnswers((prev) => ({ ...prev, [id]: value }));
    };

    const submit = () => {
      localStorage.setItem("diagnosticAnswers", JSON.stringify(answers));
      localStorage.setItem("diagnosticCompleted", "true");
      navigate("/results");
    };

    return (
      <div className="page-center">
        <div className="panel">
          <h1>📘 Quadratic Equations Diagnostic</h1>
          <p className="subtitle">
            This is not a test. It helps identify learning gaps.
          </p>

          <Section title="A. Conceptual Understanding">
            <Question
              id="A1"
              text="What is a root of an equation?"
              options={[
                "A value that makes the equation true",
                "An answer found by a formula",
                "A number after calculations",
                "I don't know",
              ]}
              onSelect={setAnswer}
            />

            <Question
              id="A2"
              text="Can a quadratic equation have no real solutions?"
              options={["Yes", "No", "I don't know"]}
              onSelect={setAnswer}
            />
          </Section>

          <Section title="B. Typical Mistakes">
            <Question
              id="B1"
              text="Find the mistake: x² − 5x = 0 → x = (5 ± √25)/2"
              options={[
                "Wrong formula usage",
                "Should factor the equation",
                "No mistake",
                "I don't know",
              ]}
              onSelect={setAnswer}
            />
          </Section>

          <Section title="C. Choosing a Method">
            <Question
              id="C1"
              text="Best method to solve x² − 9 = 0?"
              options={[
                "Factoring",
                "Discriminant formula",
                "Graph",
                "I don't know",
              ]}
              onSelect={setAnswer}
            />

            <Question
              id="C2"
              text="Best method to solve 3x² + 7x − 5 = 0?"
              options={[
                "Discriminant formula",
                "Factoring",
                "Graph",
                "I don't know",
              ]}
              onSelect={setAnswer}
            />
          </Section>

          <button className="primary-btn" onClick={submit}>
            Finish Diagnostic
          </button>
        </div>
      </div>
    );
  }

  function Section({ title, children }) {
    return (
      <section className="section">
        <h2>{title}</h2>
        {children}
      </section>
    );
  }

  function Question({ id, text, options, onSelect }) {
    return (
      <div className="question-card">
        <p className="question-text">{text}</p>

        <div className="options">
          {options.map((option) => (
            <label key={option} className="option-card">
              <input
                type="radio"
                name={id}
                onChange={() => onSelect(id, option)}
              />
              <span>{option}</span>
            </label>
          ))}
        </div>
      </div>
    );
  }
