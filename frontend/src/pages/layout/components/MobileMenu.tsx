import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Menu } from "lucide-react";
import {
  FaHome,
  FaUsers,
  FaMicrochip,
  FaChartPie,
  FaRegFileAlt,
  FaBuilding,
  FaClipboardList,
  FaLaptop,
  FaSignOutAlt,
  FaIndustry,
} from 'react-icons/fa';
import { Button } from "../../../components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "../../../components/ui/sheet";
import { useUserContext } from '../../../context/UserContext';
import logo from '../../../assets/nono.png';
import {
  SIGN_IN_ROUTE,
  DASHBOARD_ROUTE,
  USERS_ROUTE,
  PLANTS_ROUTE,
  DEPARTMENT_ROUTE,
  DEVICES_ROUTE,
  ASSIGNED_DEVICES_ROUTE,
  PLAN_PM_ROUTE,
  SUPERADMIN_PLAN_PM_ROUTE, // Added missing export
  REPORT_ROUTE,
  OVERVIEW_ROUTE,
  ADMIN_DASHBOARD_ROUTE,
  ADMIN_USERS_ROUTE,
  ADMIN_DEPARTMENT_ROUTE,
  ADMIN_DEVICES_ROUTE,
  ADMIN_ASSIGNED_DEVICES_ROUTE,
  ADMIN_PLAN_PM_ROUTE,
  ADMIN_REPORT_ROUTE,
  ADMIN_OVERVIEW_ROUTE,
  SUPERVISOR_DASHBOARD_ROUTE,
  SUPERVISOR_USERS_ROUTE,
  SUPERVISOR_DEVICES_ROUTE,
} from '../../../router/routeConstants';

export function MobileMenu() {
  const navigate = useNavigate();
  const { currentUser, logout } = useUserContext();
  const [open, setOpen] = useState(false);

  const role = currentUser?.role || localStorage.getItem("role") || "admin";

  const handleLogout = () => {
    logout();
    setOpen(false);
    navigate(SIGN_IN_ROUTE, { replace: true });
  };

  const getNavItems = () => {
    if (role === "superadmin") {
      return [
        { to: DASHBOARD_ROUTE, icon: <FaHome />, label: 'Home' },
        { to: USERS_ROUTE, icon: <FaUsers />, label: 'Users' },
        { to: PLANTS_ROUTE, icon: <FaIndustry />, label: 'Plants' },
        { to: DEPARTMENT_ROUTE, icon: <FaBuilding />, label: 'Department' },
        { to: DEVICES_ROUTE, icon: <FaMicrochip />, label: 'Devices' },
        { to: ASSIGNED_DEVICES_ROUTE, icon: <FaLaptop />, label: 'Assigned Devices' },
        { to: SUPERADMIN_PLAN_PM_ROUTE || PLAN_PM_ROUTE, icon: <FaClipboardList />, label: 'Work Orders' },
        { to: REPORT_ROUTE, icon: <FaRegFileAlt />, label: 'Report' },
        { to: OVERVIEW_ROUTE, icon: <FaChartPie />, label: 'Overview' },
      ];
    } else if (role === "supervisor") {
      return [
        { to: SUPERVISOR_DASHBOARD_ROUTE, icon: <FaHome />, label: 'Home' },
        { to: SUPERVISOR_USERS_ROUTE, icon: <FaUsers />, label: 'Users' },
        { to: SUPERVISOR_DEVICES_ROUTE, icon: <FaMicrochip />, label: 'Devices' },
        { to: PLAN_PM_ROUTE, icon: <FaClipboardList />, label: 'Work Orders' },
        { to: REPORT_ROUTE, icon: <FaRegFileAlt />, label: 'Report' },
        { to: OVERVIEW_ROUTE, icon: <FaChartPie />, label: 'Overview' },
      ];
    } else {
      return [
        { to: ADMIN_DASHBOARD_ROUTE, icon: <FaHome />, label: 'Home' },
        { to: ADMIN_USERS_ROUTE, icon: <FaUsers />, label: 'Users' },
        { to: ADMIN_DEPARTMENT_ROUTE, icon: <FaBuilding />, label: 'Department' },
        { to: ADMIN_DEVICES_ROUTE, icon: <FaMicrochip />, label: 'Devices' },
        { to: ADMIN_ASSIGNED_DEVICES_ROUTE, icon: <FaLaptop />, label: 'Assigned Devices' },
        { to: ADMIN_PLAN_PM_ROUTE, icon: <FaClipboardList />, label: 'Work Orders' },
        { to: ADMIN_REPORT_ROUTE, icon: <FaRegFileAlt />, label: 'Report' },
        { to: ADMIN_OVERVIEW_ROUTE, icon: <FaChartPie />, label: 'Overview' },
      ];
    }
  };

  const navItems = getNavItems();

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="shrink-0 md:hidden text-white hover:bg-transparent">
          <Menu className="h-6 w-6" />
          <span className="sr-only">Toggle navigation menu</span>
        </Button>
      </SheetTrigger>

      <SheetContent side="left" className="bg-[#1891C3] text-white border-none w-[260px] p-4 flex flex-col justify-between">
        <div>
          <div className="mb-6 flex items-center justify-center">
            <img src={logo} alt="Logo" className="h-32 w-32 object-contain" />
          </div>

          <nav className="flex flex-col gap-2">
            {navItems.map(({ to, icon, label }) => (
              <NavLink
                key={label}
                to={to}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition ${
                    isActive ? 'bg-white text-[#1891C3]' : 'hover:bg-white/10 hover:text-white'
                  }`
                }
              >
                {icon}
                {label}
              </NavLink>
            ))}
          </nav>
        </div>

        <div className="mt-auto pt-4">
          <button
            onClick={handleLogout}
            className="flex items-center justify-between bg-white text-[#1891C3] w-full px-4 py-2.5 rounded-lg font-semibold text-sm hover:bg-gray-100 transition"
          >
            <span>Logout</span>
            <FaSignOutAlt />
          </button>
        </div>
      </SheetContent>
    </Sheet>
  );
}