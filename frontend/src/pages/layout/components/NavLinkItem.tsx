import { NavLink } from 'react-router-dom';
import { IconType } from 'react-icons';
import { ForwardRefExoticComponent, RefAttributes } from 'react';
import { LucideProps } from 'lucide-react';

interface NavLinkItemProps {
    to: string;
    icon: IconType | ForwardRefExoticComponent<Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>>;
    label: string;
    isSmallScreen?: boolean;
    onClick?: () => void;
}

export function NavLinkItem({ to, icon: Icon, label, isSmallScreen = false, onClick }: NavLinkItemProps) {
    const navLinkClass = ({ isActive }: { isActive: boolean }) =>
        `flex items-center gap-${isSmallScreen ? '4' : '3'} rounded-${isSmallScreen ? 'xl' : 'lg'} px-3 py-2 ${isActive ? 'text-primary bg-main-color' : 'text-muted-foreground'} transition-all hover:text-primary hover:bg-main-color`;

    return (
        <NavLink to={to} className={navLinkClass} onClick={onClick}>
            <Icon className="h-4 w-4" />
            <span className="ml-4">{label}</span>
        </NavLink>
    );
}
