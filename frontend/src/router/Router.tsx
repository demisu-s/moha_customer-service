import { createBrowserRouter } from 'react-router-dom';
import {Dashboard, ErrorPage, LandingPage} from "../pages";
import {LANDING_ROUTE,DASHBOARD_ROUTE} from './routeConstants';



export const router = createBrowserRouter([
  {
    path: LANDING_ROUTE,
    element: (
      <LandingPage />
    ),
    errorElement: <ErrorPage />
  },
  {
    path: DASHBOARD_ROUTE,
    element: (
    <Dashboard />
    ),
    errorElement: <ErrorPage />
  }
,
  
  {
    path: "*",
    element: <ErrorPage />
  }
]);