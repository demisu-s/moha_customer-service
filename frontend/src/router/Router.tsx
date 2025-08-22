import { createBrowserRouter } from 'react-router-dom';
import {Dashboard, ErrorPage, LandingPage,Login,AuthenticationLayout} from "../pages";
import { DashboardLayout } from '../pages/layout/DashboardLayout';
import { ClientDashboardLayout } from '../pages/layout/ClientDashboardLayout';
import {LANDING_ROUTE,DASHBOARD_ROUTE,AUTH_ROUTE,SIGN_IN_ROUTE, USERS_ROUTE, SUPERVISOR_DASHBOARD_ROUTE, CLIENT_DASHBOARD_ROUTE } from './routeConstants';
import { ProtectedRoute } from './ProtectedRoute';
import UserManagement from '../pages/dashboard/users'; 
import AddUser from '../pages/dashboard/adduser';
import RequestDetailsPage from '../pages/request/RequestDetailsPage';
import AssignFormPage from '../pages/admin/assignForm';
import EditUser from '../pages/dashboard/edituser'; 
import Devices from '../pages/dashboard/devices';
import AddDevice from '../pages/dashboard/adddevice';
import EditDevice from '../pages/dashboard/editdevice';
import Plants from '../pages/dashboard/plants';
import Overview from '../pages/admin/Overview';
import Scheduler from '../pages/dashboard/Scheduler';
import DeviceDetail from '../pages/dashboard/devicedetail';
import Home from '../pages/User/Home'; // Assuming you have a Home component for the user dashboard
import SolutionPage from '../pages/request/SolutionPage';
import RequestHistoryPage from '../pages/request/RequestHistoryPage';
import { SupervisorDashboardLayout } from '../pages/layout/SupervisorDashboardLayout';
import AskForHelp from '../pages/User/askforhelp';
import StatusPage from '../pages/User/status';
import ClientOverview from '../pages/User/overview';

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
  path: "assign/:requestId", 
  element: <AssignFormPage />
},
  {
  path: "details/:requestId", 
  element: <RequestDetailsPage/>
},
  {
  path: "solve/:requestId", 
  element: <SolutionPage/>
},
 {
  path: "history/:requestId", 
  element: <RequestHistoryPage/>
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
    {
      path: "devices", 
      element: <Devices />
    },
    {
      path: "devices/adddevice", 
      element: <AddDevice />
    },
    {
      path: "devices/edit/:id", 
      element: <EditDevice/>
    },
    {
      path: "devices/detail/:id", 
      element: <DeviceDetail/>
    },
    {
      path: "plants", 
      element: <Plants/>
    },
    {
      path: "overview", 
      element: <Overview/>
    },
    {
      path: "schedules", 
      element: <Scheduler/>
    },
  ]
},
{
  path: CLIENT_DASHBOARD_ROUTE, // "/client-dashboard"
  element: (
    <ProtectedRoute allowedRole="user">
      <ClientDashboardLayout />
    </ProtectedRoute>
  ),
  children: [
    { index: true, element: <Home /> },
    { path: "status", element: <StatusPage /> },
    { path: "overview", element: <ClientOverview /> },
    { path: "device/:id", element: <DeviceDetail /> },
    { path: "help/:id", element: <AskForHelp /> }
  ]
}


,
  
  // {
  //   path: SUPERVISOR_DASHBOARD_ROUTE,
  //   element: (
  //     <ProtectedRoute allowedRole="Supervisor">
  //       <SupervisorDashboardLayout/>
  //     </ProtectedRoute>
  //   ),
  //   children: [
 

  // ]
  // },
  {
    path: "*",
    element: <ErrorPage />
  }
]);