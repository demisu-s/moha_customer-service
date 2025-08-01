import { Navigate, useLocation } from "react-router-dom";
import { SIGN_IN_ROUTE } from './routeConstants';
import { getAccessToken } from "@/utils/localStorage";
import { useAuthenticationStore } from "@/store/authentication";

export const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const location = useLocation();
  const isAuthenticated = Boolean(getAccessToken());

  const isLoggedOut = useAuthenticationStore(store => store.isLoggedOut)

  if (!isAuthenticated || isLoggedOut) {
    return <Navigate to={SIGN_IN_ROUTE} state={{ from: location }} />;
  }

  return <>{children}</>;
};
