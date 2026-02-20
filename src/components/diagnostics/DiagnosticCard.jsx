function DiagnosticCard({ title, description, onClick }) {
  return (
    <button className="diagnostic-card" onClick={onClick}>
      <h3>{title}</h3>
      <p>{description}</p>
    </button>
  );
}

export default DiagnosticCard;
