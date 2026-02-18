import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "../components/layout/ProtectedRoute";
import AuthPage from "../pages/AuthPage";
import HomePage from "../pages/HomePage";
import DiagnosticsPage from "../pages/DiagnosticsPage";
import PracticePage from "../pages/PracticePage";
import ProgressPage from "../pages/ProgressPage";
import ResultsPage from "../pages/ResultsPage";
import { AuthProvider } from "../context/Authorisatisdfa";

const App = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/auth" element={<AuthPage />} />

          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/diagnostics" element={<DiagnosticsPage />} />
            <Route path="/practice" element={<PracticePage />} />
            <Route path="/progress" element={<ProgressPage />} />
            <Route path="/results" element={<ResultsPage />} />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;