import { useAuth } from "../../context/authContext";
import { Navigate } from "react-router-dom";
import Loading from "../../pages/Loading";

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