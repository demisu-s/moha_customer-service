import { Button } from "../../../components/ui/button";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../../../components/ui/dropdown-menu";

import { AvatarComponent } from "../../../components/common/AvatarComponent";

import { MobileClientMenu } from "./MobileClientMenu";

import { useNavigate } from "react-router-dom";

import {
  SETTINGS_ROUTE,
  SIGN_IN_ROUTE,
} from "../../../router/routeConstants";

import profileImage from "@/assets/ProfileImage.jpg";

export function ClientHeader() {
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
    <header className="h-16 bg-[#1891C3] text-white shadow-md">
      <div className="flex h-full items-center justify-between px-4 md:px-6">
        
        {/* Left */}
        <div className="flex items-center gap-3 min-w-0">
          
          {/* Mobile Menu */}
          <div className="md:hidden">
            <MobileClientMenu />
          </div>

          {/* Title */}
          <h1 className="text-sm ml-30 font-bold sm:text-xl">
          MOHA SOFT DRINKS INDUSTRY S.C
        </h1>
        </div>

        {/* Right */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full hover:bg-transparent"
            >
              <AvatarComponent imageLocation={profileImage} />
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end">
            <DropdownMenuLabel>
              My Account
            </DropdownMenuLabel>

            <DropdownMenuSeparator />

            <DropdownMenuItem
              onClick={() => navigate(SETTINGS_ROUTE)}
            >
              Settings
            </DropdownMenuItem>

            <DropdownMenuItem onClick={handleLogout}>
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}