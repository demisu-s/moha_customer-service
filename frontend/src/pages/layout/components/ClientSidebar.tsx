import { useNavigate, NavLink } from "react-router-dom";
import {
  FaHome,
  FaHistory,
  FaSignOutAlt,
  FaChartPie,
} from "react-icons/fa";

import logo from "../../../assets/nono.png";

import {
  SIGN_IN_ROUTE,
  CLIENT_DASHBOARD_ROUTE,
} from "../../../router/routeConstants";

import { useUserContext } from "../../../context/UserContext";

export function ClientSidebar() {
  const navigate = useNavigate();
  const { logout } = useUserContext();

  const handleLogout = () => {
    logout();
    navigate(SIGN_IN_ROUTE, { replace: true });
  };

  const navItems = [
    {
      to: "/client-dashboard",
      icon: <FaHome />,
      label: "Home",
    },
    {
      to: "/client-dashboard/status",
      icon: <FaHistory />,
      label: "Status",
    },
    {
      to: "/client-dashboard/overview",
      icon: <FaChartPie />,
      label: "Overview",
    },
  ];

  return (
    <aside className="w-[230px] sm:w-[250px] h-screen bg-[#1891C3] text-white flex flex-col justify-between px-3 sm:px-4 py-4 sm:py-6">
      
      {/* TOP SECTION */}
      <div>
        {/* LOGO */}
        <div className="flex justify-center items-center mb-5 sm:mb-8">
          <img
            src={logo}
            alt="Logo"
            className="w-[120px] sm:w-[150px] h-auto object-contain"
          />
        </div>

        {/* NAVIGATION */}
        <nav className="space-y-2">
          {navItems.map(({ to, icon, label }) => (
            <NavLink
              key={label}
              to={to}
              end={to === CLIENT_DASHBOARD_ROUTE}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg text-xs sm:text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? "bg-white text-[#1891C3] shadow-sm"
                    : "hover:bg-white hover:text-[#1891C3]"
                }`
              }
            >
              <span className="text-sm sm:text-base">
                {icon}
              </span>

              <span>{label}</span>
            </NavLink>
          ))}
        </nav>
      </div>

      {/* LOGOUT */}
      <button
        onClick={handleLogout}
        className="flex items-center justify-between bg-white text-[#1891C3] px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg text-xs sm:text-sm font-semibold hover:bg-gray-100 transition"
      >
        <span>Logout</span>

        <FaSignOutAlt className="text-sm sm:text-base" />
      </button>
    </aside>
  );
}