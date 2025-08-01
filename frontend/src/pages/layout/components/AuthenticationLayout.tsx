import { CompanyLogo } from '@/components/ui';
import { Outlet } from 'react-router-dom';

export const AuthenticationLayout = () => {
    return (
        <div className="h-screen flex flex-col justify-center items-center space-y-5">
            <CompanyLogo />
            <div className="w-full lg:w-1/3 pl-4">
                <h1>Welcome back!</h1>
                <p>Enter your credentials to continue</p>
            </div>
            <Outlet />
        </div>
    )
}
