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

 if (allowedRole && userRole?.toLowerCase() !== allowedRole.toLowerCase()) {
  // redirect to correct dashboard depending on role
  if (userRole?.toLowerCase() === "admin") {
    return <Navigate to={DASHBOARD_ROUTE} replace />;
  }
  if (userRole?.toLowerCase() === "supervisor") {
    return <Navigate to="/supervisor-dashboard" replace />;
  }
  return <Navigate to="/client-dashboard" replace />;
}



  return children;
};

