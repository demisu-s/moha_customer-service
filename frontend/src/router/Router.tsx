import { createBrowserRouter } from 'react-router-dom';
import {Dashboard, ErrorPage, LandingPage,Login,AuthenticationLayout} from "../pages";
import { DashboardLayout } from '../pages/layout/DashboardLayout';
import {LANDING_ROUTE,DASHBOARD_ROUTE,AUTH_ROUTE,SIGN_IN_ROUTE} from './routeConstants';
import { ProtectedRoute } from './ProtectedRoute';



export const router = createBrowserRouter([
  {
    path: LANDING_ROUTE,
    element: (
      <LandingPage />
    ),
    errorElement: <ErrorPage />
  },
    {
    path: AUTH_ROUTE,
    element: <AuthenticationLayout />,
    children: [
      {
        path: SIGN_IN_ROUTE,
        element: <Login />,
      },
    
    ],
    errorElement: <ErrorPage />
  }
,
{
  path: DASHBOARD_ROUTE,
  element: (
    <ProtectedRoute>
      <DashboardLayout />
    </ProtectedRoute>
  ),
  children: [
    {
      path: DASHBOARD_ROUTE,
      element: <Dashboard />
    }
  ]
}
,
  
  {
    path: "*",
    element: <ErrorPage />
  }
]);