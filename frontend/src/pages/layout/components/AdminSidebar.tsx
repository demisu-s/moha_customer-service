import { useNavigate } from 'react-router-dom';
import { FaHome, FaUsers, FaMicrochip, FaMapMarkerAlt, FaClock, FaSignOutAlt, FaChartPie, FaRegFileAlt,FaBuilding } from 'react-icons/fa';
import { NavLink } from 'react-router-dom';
import logo from '../../../assets/nono.png'; 
import {  SIGN_IN_ROUTE, ADMIN_DASHBOARD_ROUTE, ADMIN_USERS_ROUTE, ADMIN_DEVICES_ROUTE, ADMIN_SCHEDULES_ROUTE, ADMIN_REPORT_ROUTE, ADMIN_OVERVIEW_ROUTE, ADMIN_DEPARTMENT_ROUTE } from '../../../router/routeConstants';
import { useUserContext } from '../../../context/UserContext';

export function AdminSidebar() {
  const navigate = useNavigate();
   const { logout } = useUserContext();

const handleLogout = () => {
    logout();
    navigate(SIGN_IN_ROUTE, { replace: true });
  };

  const navItems = [
    { to: ADMIN_DASHBOARD_ROUTE, icon: <FaHome />, label: 'Home' },
    { to: ADMIN_USERS_ROUTE, icon: <FaUsers />, label: 'Users' },
     { to: ADMIN_DEPARTMENT_ROUTE, icon: <FaBuilding />, label: 'department' },
    { to: ADMIN_DEVICES_ROUTE, icon: <FaMicrochip />, label: 'Devices' },
    { to: ADMIN_SCHEDULES_ROUTE, icon: <FaClock />, label: 'Schedule' },
    { to: ADMIN_REPORT_ROUTE, icon: <FaRegFileAlt />, label: 'Report' },
    { to: ADMIN_OVERVIEW_ROUTE, icon: <FaChartPie />, label: 'Overview' },
   

  ];

  return (
    <aside className="w-[250px] bg-[#1891C3] text-white flex flex-col justify-between py-6 px-4">
      <div>
        <div className="mb-8 flex items-center gap-3">
          <img src={logo} alt="Logo" className="h-50 w-50 object-contain" />
        </div>

        <nav className="space-y-4">
          {navItems.map(({ to, icon, label }) => (
            <NavLink
              key={label}
              to={to}
              end={to === ADMIN_DASHBOARD_ROUTE}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-2 rounded-md text-sm font-medium ${
                  isActive ? 'bg-white text-[#1891C3]' : 'hover:bg-white hover:text-[#1891C3]'
                }`
              }
            >
              {icon}
              {label}
            </NavLink>
          ))}
        </nav>
      </div>

      <button
        onClick={handleLogout}
        className="mt-4 flex items-center justify-between bg-white text-[#1891C3] w-full px-4 py-2 rounded-md font-semibold hover:bg-gray-100"
      >
        Logout <FaSignOutAlt />
      </button>
    </aside>
  );
}
