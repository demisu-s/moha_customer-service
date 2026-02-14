import { Outlet } from 'react-router-dom';
import { SIGN_IN_ROUTE } from '../../router/routeConstants';
import { useNavigate } from 'react-router-dom';
import { DashboardHeader } from '../../pages/layout/components/DashboardHeader';
import { AdminSidebar } from './components/AdminSidebar';

export function AdminDashboardLayout() {
    const navigate = useNavigate();
    const handleLogout = () => {
  localStorage.removeItem("access_token");
  navigate(SIGN_IN_ROUTE);
};

    return (
       <div className="flex h-screen overflow-hidden">
      <AdminSidebar/>
      <div className="flex flex-col flex-1">
        <DashboardHeader />
        <main className="flex-1 overflow-y-auto bg-white p-6">
          <Outlet />
        </main>
      </div>
    </div>
    );
}
