import { Navigate, useLocation } from "react-router-dom";
import { SIGN_IN_ROUTE } from './routeConstants';
import { getAccessToken } from "../utils/localStorage";
import { JSX } from "react";
import { DASHBOARD_ROUTE } from './routeConstants';

interface ProtectedRouteProps {
  children: JSX.Element;
  allowedRole?: string;
}

export const ProtectedRoute = ({ children, allowedRole }: ProtectedRouteProps) => {
  const location = useLocation();
  const isAuthenticated = Boolean(getAccessToken());
  const userRole = localStorage.getItem("role");

  if (!isAuthenticated) {
    return <Navigate to={SIGN_IN_ROUTE} state={{ from: location }} replace />;
  }

  if (allowedRole && userRole !== allowedRole) {
    // If role doesn't match, redirect to their dashboard
    return <Navigate to={userRole === "admin" ? DASHBOARD_ROUTE : "/client-dashboard"} replace />;
  }

  return children;
};

