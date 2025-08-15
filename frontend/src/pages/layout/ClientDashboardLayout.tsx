import { Outlet } from 'react-router-dom';
import { SIGN_IN_ROUTE } from '../../router/routeConstants';
import { useNavigate } from 'react-router-dom';
import { ClientSidebar } from '../../pages/layout/components/ClientSidebar';
import { DashboardHeader } from '../../pages/layout/components/DashboardHeader';

export function ClientDashboardLayout() {
    const navigate = useNavigate();
    const handleLogout = () => {
  localStorage.removeItem("access_token");
  navigate(SIGN_IN_ROUTE);
};

    return (
       <div className="flex h-screen overflow-hidden">
      <ClientSidebar />
      <div className="flex flex-col flex-1">
        <DashboardHeader />
        <main className="flex-1 overflow-y-auto bg-white p-6">
          <Outlet />
        </main>
      </div>
    </div>
    );
}
