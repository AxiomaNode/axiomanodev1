import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

import AuthPage        from "../pages/AuthPage";
import HomePage        from "../pages/HomePage";
import DiagnosticsPage from "../pages/DiagnosticsPage";
import PracticePage    from "../pages/PracticePage";
import ProgressPage    from "../pages/ProgressPage";
import ResultsPage     from "../pages/ResultsPage";
import SupportPage     from "../pages/SupportPage";
import TheoryPage      from "../pages/TheoryPage";

const PublicRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return null;
  return user ? <Navigate to="/home" replace /> : children;
};

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return null;
  return user ? children : <Navigate to="/auth" replace />;
};

const AppRouter = () => (
  <Routes>
    <Route path="/auth" element={<PublicRoute><AuthPage /></PublicRoute>} />

    <Route path="/home"        element={<ProtectedRoute><HomePage /></ProtectedRoute>} />
    <Route path="/diagnostics" element={<ProtectedRoute><DiagnosticsPage /></ProtectedRoute>} />
    <Route path="/practice"    element={<ProtectedRoute><PracticePage /></ProtectedRoute>} />
    <Route path="/progress"    element={<ProtectedRoute><ProgressPage /></ProtectedRoute>} />
    <Route path="/results"     element={<ProtectedRoute><ResultsPage /></ProtectedRoute>} />
    <Route path="/support"     element={<ProtectedRoute><SupportPage /></ProtectedRoute>} />
    <Route path="/theory"      element={<ProtectedRoute><TheoryPage /></ProtectedRoute>} />

    <Route path="*" element={<Navigate to="/home" replace />} />
  </Routes>
);

export default AppRouter;