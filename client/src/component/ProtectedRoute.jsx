import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../AuthContext";

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();
  if (loading) return <div className="min-h-screen bg-[var(--bg)]" />;
  return user ? children : <Navigate to="/login" replace state={{ from: location.pathname }} />;
};

export default ProtectedRoute;
