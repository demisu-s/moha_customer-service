
import { Link } from 'react-router-dom';
import { Home, Package, ShoppingCart } from "lucide-react";
import { FaCog, FaQuestionCircle, FaSignOutAlt } from 'react-icons/fa';
import { CompanyLogo } from '@/components/ui';
import { DASHBOARD_ROUTE, POSTS_ROUTE, PROPERTIES_ROUTE, SETTINGS_ROUTE } from '@/router/routeConstants';
import { useAuthenticationStore } from '@/store/authentication';
import { NavLinkItem } from './NavLinkItem';

export function DashboardSidebar() {
    const signOut = useAuthenticationStore((store) => store.signOut);

    return (
        <div className="hidden border-r bg-muted/40 md:block">
            <div className="flex h-full max-h-screen flex-col gap-2">
                <div className="flex h-20 items-center border-b px-4 lg:h-[60px] lg:px-6">
                    <Link to={DASHBOARD_ROUTE} className="flex items-center gap-2 font-semibold">
                        <CompanyLogo />
                    </Link>
                </div>
                <div className="flex-1 pt-8">
                    <nav className="grid items-start px-2 text-sm font-medium lg:px-4 space-y-4">
                        <NavLinkItem to={DASHBOARD_ROUTE} icon={Home} label="Dashboard" />
                        <NavLinkItem to={PROPERTIES_ROUTE} icon={ShoppingCart} label="Properties" />
                        <NavLinkItem to={POSTS_ROUTE} icon={Package} label="Posts" />
                        <NavLinkItem to={SETTINGS_ROUTE} icon={FaCog} label="Settings" />
                    </nav>
                </div>
                <div className="mt-auto p-4">
                    <div className="p-4">
                        <NavLinkItem to="/support" icon={FaQuestionCircle} label="Help & Support" />
                        <NavLinkItem to="/" icon={FaSignOutAlt} label="Log Out" onClick={signOut} />
                    </div>
                </div>
            </div>
        </div>
    );
}
