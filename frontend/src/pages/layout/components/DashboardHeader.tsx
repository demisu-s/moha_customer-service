import { CircleUser } from "lucide-react";
import { Button } from "../../../components/ui/button";
import { SIGN_IN_ROUTE } from '../../../router/routeConstants';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../../../components/ui/dropdown-menu";
import { MobileMenu } from "./MobileMenu";
import { useNavigate } from "react-router-dom";
import { SETTINGS_ROUTE } from "../../../router/routeConstants";
import { AvatarComponent } from "../../../components/common/AvatarComponent";
import profileImage from "@/assets/ProfileImage.jpg";

export function DashboardHeader() {
  const navigate = useNavigate();

      const handleLogout = () => {
    localStorage.removeItem("access_token");
    navigate(SIGN_IN_ROUTE);
  };

  return (
    <header className="flex h-16 items-center justify-between bg-[#1891C3] px-4 text-white shadow-md lg:px-6">
      <div className="flex items-center gap-4">
        <MobileMenu />
        <h1 className="text-lg ml-30 font-bold sm:text-xl">
          MOHA SOFT DRINKS INDUSTRY S.C
        </h1>
      </div>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="rounded-full focus:outline-none">
            <CircleUser className="h-5 w-5" />
            <span className="sr-only">Toggle user menu</span>
            <AvatarComponent
              imageLocation={profileImage}
            />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>My Account</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => navigate(SETTINGS_ROUTE)}>
            Settings
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleLogout}>Logout</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}
