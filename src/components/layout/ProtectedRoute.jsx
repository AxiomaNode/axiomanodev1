import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

// CHANGED: removed emailVerified redirect
// Google users are always verified. Email users get through
// and can verify at their own pace via a banner elsewhere.
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="auth-loading">
        <div className="auth-loading__spinner" />
      </div>
    );
  }

  if (!user) return <Navigate to="/auth" replace />;

  return children;
};

export default ProtectedRoute;