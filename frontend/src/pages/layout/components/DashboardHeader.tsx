import { CircleUser } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MobileMenu } from "./MobileMenu";
import { useNavigate } from "react-router-dom";
import { SETTINGS_ROUTE } from "@/router/routeConstants";
import { useAuthenticationStore } from "@/store/authentication";
import { AvatarComponent } from "@/components/common/AvatarComponent";
import profileImage from "@/assets/ProfileImage.jpg";

export function DashboardHeader() {
    const navigate = useNavigate();
    const { signOut, userProfile } = useAuthenticationStore(store => store)

    return (
        <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6">
            <MobileMenu />
            <div className="w-full flex-1"></div>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="secondary" size="icon" className="rounded-full">
                        <CircleUser className="h-5 w-5" />
                        <span className="sr-only">Toggle user menu</span>
                        <AvatarComponent imageLocation={userProfile?.imageUrl ?? profileImage} />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => navigate(SETTINGS_ROUTE)}>Settings</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => signOut()} >Logout</DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </header>
    );
}
