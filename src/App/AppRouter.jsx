import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

import AuthPage        from "../pages/AuthPage";
import VerifyEmailPage from "../pages/VerifyEmailPage";
import HomePage        from "../pages/HomePage";
import DiagnosticsPage from "../pages/DiagnosticsPage";
import PracticePage    from "../pages/PracticePage";
import ProgressPage    from "../pages/ProgressPage";
import ResultsPage     from "../pages/ResultsPage";
import SupportPage     from "../pages/SupportPage";
import TheoryPage      from "../pages/TheoryPage";
import EmailActionPage from "../pages/EmailActionPage";
import AboutPage from "../pages/AboutPage";
import HomeWorkPage from "../pages/HomeWorkPage";


const PublicRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return null;
  return user ? <Navigate to="/home" replace /> : children;
};

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (!user) return <Navigate to="/auth" replace />;
  if (!user.emailVerified) return <Navigate to="/verify-email" replace />;
  return children;
};

const AppRouter = () => (
  <Routes>
    <Route path="/auth"         element={<PublicRoute><AuthPage /></PublicRoute>} />
    <Route path="/verify-email" element={<VerifyEmailPage />} />
    <Route path="/home"        element={<ProtectedRoute><HomePage /></ProtectedRoute>} />
    <Route path="/diagnostics" element={<ProtectedRoute><DiagnosticsPage /></ProtectedRoute>} />
    <Route path="/practice"    element={<ProtectedRoute><PracticePage /></ProtectedRoute>} />
    <Route path="/progress"    element={<ProtectedRoute><ProgressPage /></ProtectedRoute>} />
    <Route path="/results"     element={<ProtectedRoute><ResultsPage /></ProtectedRoute>} />
    <Route path="/support"     element={<ProtectedRoute><SupportPage /></ProtectedRoute>} />
    <Route path="/homework"     element={<ProtectedRoute><HomeWorkPage /></ProtectedRoute>} />
    <Route path="/theory"      element={<ProtectedRoute><TheoryPage /></ProtectedRoute>} />
    <Route path="/about"      element={<ProtectedRoute><AboutPage /></ProtectedRoute>} />
    <Route path="/auth/action" element={<EmailActionPage />} />

    <Route path="*" element={<Navigate to="/home" replace />} />
  </Routes>
);

export default AppRouter;