import { Navigate, useLocation } from "react-router-dom";

export default function RequireAuth({ children }) {
  const username = localStorage.getItem("username");
  const location = useLocation();

  if (!username) {
    // Redirect unauthenticated users to /auth
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }
  return children;
}
