
import { Link } from 'react-router-dom';
import { Menu, Home, ShoppingCart, Package } from "lucide-react";
import { FaCog, FaQuestionCircle, FaSignOutAlt } from 'react-icons/fa';
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { CompanyLogo } from '@/components/ui';
import { DASHBOARD_ROUTE, POSTS_ROUTE, PROPERTIES_ROUTE, SETTINGS_ROUTE } from '@/router/routeConstants';
import { NavLinkItem } from './NavLinkItem';
import { useAuthenticationStore } from '@/store/authentication';

export function MobileMenu() {
    const signOut = useAuthenticationStore((store) => store.signOut);

    return (
        <Sheet>
            <SheetTrigger asChild>
                <Button variant="outline" size="icon" className="shrink-0 md:hidden">
                    <Menu className="h-5 w-5" />
                    <span className="sr-only">Toggle navigation menu</span>
                </Button>
            </SheetTrigger>
            <SheetContent side="left" className="flex flex-col">
                <nav className="grid gap-2 text-lg font-medium">
                    <Link to={DASHBOARD_ROUTE} className="flex items-center gap-2 text-lg font-semibold p-6">
                        <CompanyLogo />
                    </Link>
                    <NavLinkItem to={DASHBOARD_ROUTE} icon={Home} label="Dashboard" isSmallScreen />
                    <NavLinkItem to={PROPERTIES_ROUTE} icon={ShoppingCart} label="Properties" isSmallScreen />
                    <NavLinkItem to={POSTS_ROUTE} icon={Package} label="Posts" isSmallScreen />
                    <NavLinkItem to={SETTINGS_ROUTE} icon={FaCog} label="Settings" isSmallScreen />
                </nav>
                <div className="mt-auto p-4">
                    <div className="p-4">
                        <NavLinkItem to="/support" icon={FaQuestionCircle} label="Help & Support" isSmallScreen />
                        <NavLinkItem to="/" icon={FaSignOutAlt} label="Log Out" isSmallScreen onClick={signOut} />
                    </div>
                </div>
            </SheetContent>
        </Sheet>
    );
}
