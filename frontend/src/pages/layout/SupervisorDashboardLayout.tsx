import { Outlet } from 'react-router-dom';
import { SIGN_IN_ROUTE } from '../../router/routeConstants';
import { useNavigate } from 'react-router-dom';
import { SupervisorSidebar } from '../../pages/layout/components/SupervisorSidebar';
import { DashboardHeader } from '../../pages/layout/components/DashboardHeader';

export function SupervisorDashboardLayout() {
    const navigate = useNavigate();
    const handleLogout = () => {
  localStorage.removeItem("access_token");
  localStorage.removeItem("role");
  localStorage.removeItem("userId");
  localStorage.removeItem("userName");
  localStorage.removeItem("userDepartment");
  localStorage.removeItem("userArea");
  navigate(SIGN_IN_ROUTE);
};

    return (
       <div className="flex h-screen overflow-hidden">
      <SupervisorSidebar />
      <div className="flex flex-col flex-1">
        <DashboardHeader />
        <main className="flex-1 overflow-y-auto bg-white p-6">
          <Outlet />
        </main>
      </div>
    </div>
    );
}
