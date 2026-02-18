
function DiagnosticCard({ title, description, onClick }) {
  return (
    <div className="diagnostic-card" onClick={onClick}>
      <h3>{title}</h3>
      <p>{description}</p>
    </div>
  );
}

export default DiagnosticCard;