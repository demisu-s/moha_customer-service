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

import { useState } from "react";

export function MobileClientMenu() {
  const navigate = useNavigate();
  const { logout } = useUserContext();

  const [open, setOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate(SIGN_IN_ROUTE, { replace: true });
    setOpen(false);
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
    <Sheet open={open} onOpenChange={setOpen}>
      {/* MENU BUTTON */}
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="
            border-none
            shadow-none
            outline-none
            focus:outline-none
            focus:ring-0
            hover:bg-transparent
          "
        >
          <Menu className="h-5 w-5 text-white" />
        </Button>
      </SheetTrigger>

      {/* SIDEBAR */}
      <SheetContent
        side="left"
        className="bg-[#1891C3] text-white border-none w-[260px]"
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="mb-8 flex items-center justify-center">
            <img
              src={logo}
              alt="Logo"
              className="h-40 w-40 object-contain"
            />
          </div>

          {/* Navigation */}
          <nav className="flex flex-col gap-3">
            {navItems.map(({ to, icon, label }) => (
              <NavLink
                key={label}
                to={to}
                end={to === CLIENT_DASHBOARD_ROUTE}
                onClick={() => setOpen(false)}
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