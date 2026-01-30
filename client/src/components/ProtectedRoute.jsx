import { Navigate } from "react-router-dom";
import { getToken } from "../lib/auth";

export default function ProtectedRoute({ children }) {
  const t = getToken();
  if (!t) return <Navigate to="/login" replace />;
  return children;
}
