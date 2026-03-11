// src/pages/resultsPages/ResultsPage.jsx
// Redirects to the unified Profile hub with the Results tab active.
// Forwards selectedIdx so a direct link to a specific session still works.
import { Navigate, useLocation } from "react-router-dom";

const ResultsPage = () => {
  const { state } = useLocation();
  return (
    <Navigate
      to="/profile"
      state={{ tab: "results", selectedIdx: state?.selectedIdx ?? 0 }}
      replace
    />
  );
};

export default ResultsPage;