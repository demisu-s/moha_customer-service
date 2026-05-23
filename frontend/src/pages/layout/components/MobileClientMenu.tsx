import {
  FaHome,
  FaHistory,
  FaChartPie,
  FaSignOutAlt,
} from "react-icons/fa";

import { Menu } from "lucide-react";

import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "../../../components/ui/sheet";

import { Button } from "../../../components/ui/button";

import {
  CLIENT_DASHBOARD_ROUTE,
  SIGN_IN_ROUTE,
} from "../../../router/routeConstants";

import { NavLink, useNavigate } from "react-router-dom";

import logo from "../../../assets/nono.png";

import { useUserContext } from "../../../context/UserContext";

export function MobileClientMenu() {
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
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon">
          <Menu className="h-5 w-5" />
        </Button>
      </SheetTrigger>

      <SheetContent
        side="left"
        className="bg-[#1891C3] text-white border-none w-[260px]"
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="mb-8 flex items-center gap-3">
          <img src={logo} alt="Logo" className="h-50 w-50 object-contain" />
        </div>

          {/* Navigation */}
          <nav className="flex flex-col gap-3">
            {navItems.map(({ to, icon, label }) => (
              <NavLink
                key={label}
                to={to}
                end={to === CLIENT_DASHBOARD_ROUTE}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                    isActive
                      ? "bg-white text-[#1891C3]"
                      : "hover:bg-white hover:text-[#1891C3]"
                  }`
                }
              >
                {icon}
                {label}
              </NavLink>
            ))}
          </nav>

          {/* Logout */}
          <div className="mt-auto">
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-between bg-white text-[#1891C3] px-4 py-3 rounded-lg font-semibold"
            >
              Logout
              <FaSignOutAlt />
            </button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}