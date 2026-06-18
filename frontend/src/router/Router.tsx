import { createBrowserRouter } from 'react-router-dom';
import {Dashboard, ErrorPage, LandingPage,Login,AuthenticationLayout} from "../pages";
import { DashboardLayout } from '../pages/layout/DashboardLayout';
import { ClientDashboardLayout } from '../pages/layout/ClientDashboardLayout';
import {LANDING_ROUTE,DASHBOARD_ROUTE,AUTH_ROUTE,SIGN_IN_ROUTE, USERS_ROUTE, SUPERVISOR_DASHBOARD_ROUTE, CLIENT_DASHBOARD_ROUTE, ADMIN_DASHBOARD_ROUTE } from './routeConstants';
import { ProtectedRoute } from './ProtectedRoute';
import UserManagement from '../pages/dashboard/UserManagement/users'; 
import AddUser from '../pages/dashboard/UserManagement/adduser';
import RequestDetailsPage from '../pages/request/RequestDetailsPage';
import AssignFormPage from '../components/requestComponent/AssignForm';
import EditUser from '../pages/dashboard/UserManagement/edituser'; 
import Devices from '../pages/dashboard/DeviceManagement/devices';
import AddDevice from '../pages/dashboard/DeviceManagement/adddevice';
import EditDevice from '../pages/dashboard/DeviceManagement/editdevice';
import Plants from '../pages/dashboard/PlantAndDepertmentManagement/plants';
import Overview from '../pages/dashboard/Report/Overview';
import Report from '../pages/dashboard/Report/Report';
import Scheduler from '../pages/dashboard/Report/Scheduler';
import DeviceDetail from '../pages/dashboard/DeviceManagement/devicedetail';
import Home from '../pages/User/Home'; 
import SolutionPage from '../pages/request/SolutionPage';
import RequestHistoryPage from '../pages/request/RequestHistoryPage';
import AskForHelp from '../pages/User/askforhelp';
import StatusPage from '../pages/User/status';
import ClientOverview from '../pages/User/overview';
import UnresolvedPage from '../pages/request/UnresolvedPage';
import { SupervisorDashboardLayout } from '../pages/layout/SupervisorDashboardLayout';
import { AdminDashboardLayout } from '../pages/layout/AdminDasboardLayout';
import Users from '../pages/dashboard/UserManagement/users';
import Department from '../pages/dashboard/PlantAndDepertmentManagement/Department';
import SolutionByAdminPage from '../pages/request/SolutionByAdminPage';
import AssignedDevices from '../pages/dashboard/DeviceManagement/AssignedDevices';
import CreateWorkOrder from '../pages/dashboard/PMaintenance/CreateWorkOrder';
import ExecuteWorkOrder from '../pages/dashboard/PMaintenance/ExecuteWorkOrder';
import SolutionBySuperadminPage from '../pages/request/SolutionBySuperadminPage';

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
    // {path: "solve/:requestId",element: <SolutionPage/>},
    {path: "history/:requestId",element: <RequestHistoryPage/>},
    {path: "solve/:requestId",element: <SolutionBySuperadminPage/>},
    {path: "unresolved/:requestId", element: <UnresolvedPage/>},
    {path: "users", element: <UserManagement/>},
    {path: "users/adduser",element: <AddUser />},
    {path: "users/editUser/:id",element: <EditUser />},
    {path: "devices",element: <Devices />},
    {path: "devices",element: <Devices />},
    {path: "assigned-devices",element: <AssignedDevices />},
    {path: "devices/adddevice", element: <AddDevice />},
    {path: "devices/editDevice/:id",element: <EditDevice/>},
    {path: "devices/detail/:id",element: <DeviceDetail/>},
    { path: "plants",element: <Plants/>},
    {path: "overview",element: <Overview/>},
    {path: "report",element: <Report/> },
    {path: "schedules",element: <Scheduler/>},
    {path: "work-orders/execute/:id",element: <ExecuteWorkOrder/>},
    {path: "work-orders",element: <CreateWorkOrder/>},


  
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
    {path: "solve/:requestId",element: <SolutionByAdminPage/>},
    {path: "history/:requestId",element: <RequestHistoryPage/>},
    {path: "unresolved/:requestId", element: <UnresolvedPage/>},
    {path: "users", element: <UserManagement />},
    {path: "users/adduser",element: <AddUser />},
    {path: `users/editUser/:id`,element: <EditUser />},
    {path: "devices",element: <Devices />},
    {path: "assigned-devices",element: <AssignedDevices />},
    {path: "devices/adddevice", element: <AddDevice />},
    {path: "devices/editDevice/:id",element: <EditDevice/>},
    {path: "devices/detail/:id",element: <DeviceDetail/>},
    {path: "overview",element: <Overview/>},
    {path: "report",element: <Report/> },
    {path: "schedules",element: <Scheduler/>},
    {path: "work-orders/execute/:id",element: <ExecuteWorkOrder/>},
    {path: "work-orders",element: <CreateWorkOrder/>},
    { path: "departments",element: <Department/>},
  
  ]
},

//supervisor route
  
  {
    path: SUPERVISOR_DASHBOARD_ROUTE,
    element: (
      <ProtectedRoute allowedRole="supervisor">
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
    {path: "assigned-devices",element: <AssignedDevices />},
    {path: "devices/adddevice", element: <AddDevice />},
    {path: "devices/editDevice/:id",element: <EditDevice/>},
    {path: "devices/detail/:id",element: <DeviceDetail/>},
    {path: "overview",element: <Overview/>},
    {path: "report",element: <Report/> },
    {path: "schedules",element: <Scheduler/>},
    {path: "work-orders/execute/:id",element: <ExecuteWorkOrder/>},
    {path: "work-orders",element: <CreateWorkOrder/>},
  
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