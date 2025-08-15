import { Navigate, useLocation } from "react-router-dom";
import { SIGN_IN_ROUTE } from './routeConstants';
import { getAccessToken } from "../utils/localStorage";
import { JSX } from "react";
import { DASHBOARD_ROUTE } from './routeConstants';
import { useUserContext } from "../context/UserContext";

interface ProtectedRouteProps {
  children: JSX.Element;
  allowedRole?: string;
}

export const ProtectedRoute = ({ children, allowedRole }: ProtectedRouteProps) => {
  const location = useLocation();
  const { users } = useUserContext();
  const isAuthenticated = Boolean(getAccessToken());
  const userRole = localStorage.getItem("role");
  const userId = localStorage.getItem("userId");

  if (!isAuthenticated) {
    return <Navigate to={SIGN_IN_ROUTE} state={{ from: location }} replace />;
  }

  // Check if user exists in the users list (for non-admin users)
  if (userRole !== "admin" && userId !== "admin") {
    const userExists = users.find(user => user.userId === userId);
    if (!userExists) {
      // User doesn't exist in the system, redirect to login
      localStorage.clear();
      return <Navigate to={SIGN_IN_ROUTE} state={{ from: location }} replace />;
    }
  }

  if (allowedRole && userRole !== allowedRole) {
    // If role doesn't match, redirect to their dashboard
    return <Navigate to={userRole === "admin" ? DASHBOARD_ROUTE : "/client-dashboard"} replace />;
  }

  return children;
};

