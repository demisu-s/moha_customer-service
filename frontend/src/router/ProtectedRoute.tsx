import { Navigate, useLocation } from "react-router-dom";
import {
  CLIENT_DASHBOARD_ROUTE,
  SIGN_IN_ROUTE,
  SUPERVISOR_DASHBOARD_ROUTE,
  ADMIN_DASHBOARD_ROUTE,
  DASHBOARD_ROUTE,
} from "./routeConstants";
import { getAccessToken } from "../utils/localStorage";
import { JSX } from "react";
import { useUserContext } from "../context/UserContext";

interface ProtectedRouteProps {
  children: JSX.Element;
  allowedRole?: string;
}

export const ProtectedRoute = ({ children, allowedRole }: ProtectedRouteProps) => {
  
   const location = useLocation();
  const { currentUser } = useUserContext();
  const isAuthenticated = Boolean(getAccessToken());

 

  /* 🔴 Not logged in */
  if (!isAuthenticated || !currentUser) {
    return <Navigate to={SIGN_IN_ROUTE} state={{ from: location }} replace />;
  }

   /* 🚫 Role not allowed */
  if (allowedRole && currentUser.role !== allowedRole.toLowerCase()) {
    switch (currentUser.role) {
      case "superadmin":
        return <Navigate to={DASHBOARD_ROUTE} replace />;
      case "admin":
        return <Navigate to={ADMIN_DASHBOARD_ROUTE} replace />;
      case "supervisor":
        return <Navigate to={SUPERVISOR_DASHBOARD_ROUTE} replace />;
      default:
        return <Navigate to={CLIENT_DASHBOARD_ROUTE} replace />;
    }
  }

  /* ✅ Access granted */
  return children;
};
