import { useNavigate } from 'react-router-dom';
import { FaHome, FaUsers, FaMicrochip, FaMapMarkerAlt, FaClock, FaSignOutAlt } from 'react-icons/fa';
import { NavLink } from 'react-router-dom';
import logo from '../../../assets/nono.png'; // Replace with your actual logo
import { DASHBOARD_ROUTE, USERS_ROUTE, DEVICES_ROUTE, PLANTS_ROUTE, SCHEDULES_ROUTE, SIGN_IN_ROUTE } from '../../../router/routeConstants';

export function DashboardSidebar() {
  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.removeItem("access_token");
    navigate(SIGN_IN_ROUTE);
  };

  const navItems = [
    { to: DASHBOARD_ROUTE, icon: <FaHome />, label: 'Home' },
{ to: "/dashboard/users", icon: <FaUsers />, label: 'Users' },
    { to: DEVICES_ROUTE, icon: <FaMicrochip />, label: 'Devices' },
    { to: PLANTS_ROUTE, icon: <FaMapMarkerAlt />, label: 'Plants' },
    { to: SCHEDULES_ROUTE, icon: <FaClock />, label: 'Schedule' },
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
