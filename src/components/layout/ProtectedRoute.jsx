import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../context/Authorisatisdfa";
import Header from "./Header";
import "../../styles/layout.css";

const ProtectedRoute = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div style={{
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "var(--color-bg)"
      }}>
        <div style={{
          fontFamily: "var(--font-display)",
          fontSize: "2rem",
          color: "var(--color-accent)",
          animation: "pulse 1.5s infinite"
        }}>
          Axioma
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  return (
    <div className="app-layout">
      <Header />
      <main className="app-content">
        <Outlet />
      </main>
    </div>
  );
};

export default ProtectedRoute;