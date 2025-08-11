import { createBrowserRouter } from 'react-router-dom';
import {Dashboard, ErrorPage, LandingPage,Login,AuthenticationLayout} from "../pages";
import { DashboardLayout } from '../pages/layout/DashboardLayout';
import {LANDING_ROUTE,DASHBOARD_ROUTE,AUTH_ROUTE,SIGN_IN_ROUTE, USERS_ROUTE } from './routeConstants';
import { ProtectedRoute } from './ProtectedRoute';
import UserManagement from '../pages/dashboard/users'; 
import AddUser from '../pages/dashboard/adduser';
import RequestDetailsPage from '../pages/dashboard/RequestDetailsPage';
import AssignFormPage from '../pages/admin/assignForm';
import EditUser from '../pages/dashboard/edituser'; 
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
// ...existing code...
{
  path: DASHBOARD_ROUTE,
  element: (
    <ProtectedRoute>
      <DashboardLayout />
    </ProtectedRoute>
  ),
  children: [
    {
      path: "", // dashboard home
      element: <Dashboard />
    },
    {
  path: "dashboard/assign/:requestId", 
  element: <AssignFormPage />
},
  {
  path: "details/:requestId", 
  element: <RequestDetailsPage/>
},
    {
      path: "users", 
      element: <UserManagement />
    },
    {
      path: "users/adduser",
      element: <AddUser />
    },
    {
      path: "users/edit/:id",
      element: <EditUser />
    },
  ]
},
// ...existing code...
  
  {
    path: "*",
    element: <ErrorPage />
  }
]);