import { Navigate } from "react-router-dom";
import Loading from "../../pages/Loading";
import { useAuth } from "../../context/authContext";

export default function PublicRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return <Loading />;
  }

  if (user) {
    return <Navigate to="/" replace />;
  }

  return children;
}
