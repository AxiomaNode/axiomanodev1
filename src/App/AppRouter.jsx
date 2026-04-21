// AppRouter.jsx — no changes needed here.
// The future flags must be added on <BrowserRouter> in your main.jsx or App.jsx:
//
// import { BrowserRouter } from "react-router-dom";
//
// <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
//   <App />
// </BrowserRouter>

import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

import AuthPage        from "../pages/authPages/AuthPage";
import VerifyEmailPage from "../pages/email/VerifyEmailPage";
import ProgressPage from '../pages/progressPages/ProgressPage'
import HomePage        from "../pages/homePages/HomePage";
import DiagnosticsPage from "../pages/diagnosticsPages/DiagnosticsPage";
import PracticePage    from "../pages/PracticePages/PracticePage";
import ResultsPage from '../pages/resultsPages/ResultsPage';
import SupportPage from "../pages/supportPages/SupportPage";
import TheoryPage from "../pages/theoryPages/TheoryPage";
import EmailActionPage from "../pages/email/EmailActionPage";
import AboutPage       from "../pages/aboutPages/AboutPage";
import ProfilePage     from "../pages/profilePages/ProfilePage";
import FeedbackPage from "../pages/feedbackPages/FeedbackPage";
import PublicProfilePage from "../pages/publicProfilePages/PublicProfilePage";
import PuzzlesPage from "../pages/puzzlesPages/PuzzlesPage";
import MasteryTestPage from "../pages/masteryTestPages/MasteryTestPage";
import PrivacyPage from "../pages/privacyPages/PrivacyPage";

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
    <Route path="/home"         element={<ProtectedRoute><HomePage /></ProtectedRoute>} />
    <Route path="/diagnostics"  element={<ProtectedRoute><DiagnosticsPage /></ProtectedRoute>} />
    <Route path="/practice"     element={<ProtectedRoute><PracticePage /></ProtectedRoute>} />
    <Route path="/puzzles"      element={<ProtectedRoute><PuzzlesPage /></ProtectedRoute>} />
    <Route path="/profile/:uid" element={<ProtectedRoute><PublicProfilePage /></ProtectedRoute>}/>
    <Route path="/progress"     element={<ProtectedRoute><ProgressPage/></ProtectedRoute>} />
    <Route path="/results"      element={<ProtectedRoute><ResultsPage /></ProtectedRoute>} />
    <Route path="/support"      element={<ProtectedRoute><SupportPage /></ProtectedRoute>} />
    <Route path="/feedback"     element={<ProtectedRoute><FeedbackPage /></ProtectedRoute>} />
    <Route path="/masteryTest"  element={<ProtectedRoute><MasteryTestPage /></ProtectedRoute>} />
    <Route path="/theory"       element={<ProtectedRoute><TheoryPage /></ProtectedRoute>} />
    <Route path="/privacy"      element={<ProtectedRoute><PrivacyPage /></ProtectedRoute>} />
    <Route path="/profile"      element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
    <Route path="/about"        element={<ProtectedRoute><AboutPage /></ProtectedRoute>} />
    <Route path="/auth/action"  element={<EmailActionPage />} />
    <Route path="*"             element={<Navigate to="/home" replace />} />
  </Routes>
);

export default AppRouter;