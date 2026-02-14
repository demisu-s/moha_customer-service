import { createBrowserRouter } from 'react-router-dom';
import {Dashboard, ErrorPage, LandingPage,Login,AuthenticationLayout} from "../pages";
import { DashboardLayout } from '../pages/layout/DashboardLayout';
import { ClientDashboardLayout } from '../pages/layout/ClientDashboardLayout';
import {LANDING_ROUTE,DASHBOARD_ROUTE,AUTH_ROUTE,SIGN_IN_ROUTE, USERS_ROUTE, SUPERVISOR_DASHBOARD_ROUTE, CLIENT_DASHBOARD_ROUTE, ADMIN_DASHBOARD_ROUTE } from './routeConstants';
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
import Report from '../pages/admin/Report';
import Scheduler from '../pages/dashboard/Scheduler';
import DeviceDetail from '../pages/dashboard/devicedetail';
import Home from '../pages/User/Home'; 
import SolutionPage from '../pages/request/SolutionPage';
import RequestHistoryPage from '../pages/request/RequestHistoryPage';
import AskForHelp from '../pages/User/askforhelp';
import StatusPage from '../pages/User/status';
import ClientOverview from '../pages/User/overview';
import UnresolvedPage from '../pages/request/UnresolvedPage';
import { SupervisorDashboardLayout } from '../pages/layout/SupervisorDashboardLayout';
import { AdminDashboardLayout } from '../pages/layout/AdminDasboardLayout';
import Users from '../pages/dashboard/users';
import Department from '../pages/dashboard/Department';

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

// superadmin route 
{
  path: DASHBOARD_ROUTE,
  element: (
     <ProtectedRoute allowedRole="superadmin">
      <DashboardLayout />
    </ProtectedRoute>
  ),
  children: [
    {path: "", element: <Dashboard />},
    {path: "assign/:requestId",element: <AssignFormPage />},
    {path: "details/:requestId",element: <RequestDetailsPage/>},
    {path: "solve/:requestId",element: <SolutionPage/>},
    {path: "history/:requestId",element: <RequestHistoryPage/>},
    {path: "unresolved/:requestId", element: <UnresolvedPage/>},
    {path: "users", element: <UserManagement />},
    {path: "users/adduser",element: <AddUser />},
    {path: "users/editUser/:id",element: <EditUser />},
    {path: "devices",element: <Devices />},
    {path: "devices/adddevice", element: <AddDevice />},
    {path: "devices/edit/:id",element: <EditDevice/>},
    {path: "devices/detail/:id",element: <DeviceDetail/>},
    { path: "plants",element: <Plants/>},
    {path: "overview",element: <Overview/>},
    {path: "report",element: <Report/> },
    {path: "schedules",element: <Scheduler/>},
  
  ]
},

//admin route
{
  path: ADMIN_DASHBOARD_ROUTE,
  element: (
    <ProtectedRoute allowedRole="admin">
      <AdminDashboardLayout />
    </ProtectedRoute>
  ),
  children: [
    {path: "", element: <Dashboard />},
    {path: "assign/:requestId",element: <AssignFormPage />},
    {path: "details/:requestId",element: <RequestDetailsPage/>},
    {path: "solve/:requestId",element: <SolutionPage/>},
    {path: "history/:requestId",element: <RequestHistoryPage/>},
    {path: "unresolved/:requestId", element: <UnresolvedPage/>},
    {path: "users", element: <UserManagement />},
    {path: "users/adduser",element: <AddUser />},
    {path: `users/editUser/:id`,element: <EditUser />},
    {path: "devices",element: <Devices />},
    {path: "devices/adddevice", element: <AddDevice />},
    {path: "devices/edit/:id",element: <EditDevice/>},
    {path: "devices/detail/:id",element: <DeviceDetail/>},
    {path: "overview",element: <Overview/>},
    {path: "report",element: <Report/> },
    {path: "schedules",element: <Scheduler/>},
    { path: "departments",element: <Department/>},
  
  ]
},

//supervisor route
  
  {
    path: SUPERVISOR_DASHBOARD_ROUTE,
    element: (
      <ProtectedRoute allowedRole="Supervisor">
        <SupervisorDashboardLayout/>
      </ProtectedRoute>
    ),
    
    children: [
    {path: "", element: <Dashboard />},
    {path: "assign/:requestId",element: <AssignFormPage />},
    {path: "details/:requestId",element: <RequestDetailsPage/>},
    {path: "solve/:requestId",element: <SolutionPage/>},
    {path: "history/:requestId",element: <RequestHistoryPage/>},
    {path: "unresolved/:requestId", element: <UnresolvedPage/>},
    {path: "users", element: <UserManagement />},
    {path: "users/adduser",element: <AddUser />},
    {path: `users/editUser/:id`,element: <EditUser />},
    {path: "devices",element: <Devices />},
    {path: "devices/adddevice", element: <AddDevice />},
    {path: "devices/edit/:id",element: <EditDevice/>},
    {path: "devices/detail/:id",element: <DeviceDetail/>},
    {path: "overview",element: <Overview/>},
    {path: "report",element: <Report/> },
    {path: "schedules",element: <Scheduler/>},
  
  ]

  
  },
  {
    path: "*",
    element: <ErrorPage />
  },


  //client route

  {
  path: CLIENT_DASHBOARD_ROUTE,
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

]);