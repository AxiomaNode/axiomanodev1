import { Navigate, Route, Routes } from "react-router-dom"
import AuthPage from "../pages/AuthPage"
import ProtectedRoute from "../components/layout/ProtectedRoute"
import HomePage from "../pages/HomePage"
import DiagonsticPage from "../pages/DiagnosticsPage"
import PracticePage from "../pages/PracticePage"
import ProgressPage from "../pages/ProgressPage"
import ResultsPage from "../pages/ResultsPage"

export default function AppRoutes() {
  return (
    <Routes>

      <Route path="/auth" element={<AuthPage />} />

      <Route element={<ProtectedRoute />}>
        <Route path="/"               element={<HomePage />} />
        <Route path="/home"           element={<Navigate to="/" replace />} />
        <Route path="/diagnostics"    element={<DiagonsticPage />} />
        <Route path="/practice"       element={<PracticePage />} />
        <Route path="/progress"       element={<ProgressPage />} />
        <Route path="/results"        element={<ResultsPage />} />

      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />

    </Routes>
  );
}