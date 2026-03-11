// src/pages/progressPages/ProgressPage.jsx
// Redirects to the unified Profile hub with the Progress tab active.
import { Navigate } from "react-router-dom";

const ProgressPage = () => (
  <Navigate to="/profile" state={{ tab: "progress" }} replace />
);

export default ProgressPage;