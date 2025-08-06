import { Navigate, useLocation } from "react-router-dom";
import { SIGN_IN_ROUTE } from './routeConstants';
import { getAccessToken } from "../utils/localStorage";
import { JSX } from "react";

interface ProtectedRouteProps {
  children: JSX.Element;
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const location = useLocation();
  const isAuthenticated = Boolean(getAccessToken());

  if (!isAuthenticated) {
    return <Navigate to={SIGN_IN_ROUTE} state={{ from: location }} replace />;
  }

  return children;
};
