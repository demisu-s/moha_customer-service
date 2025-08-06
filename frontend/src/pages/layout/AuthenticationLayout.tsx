import { CompanyLogo } from '../../components/ui/CompanyLogo';
import { Outlet } from 'react-router-dom';

export const AuthenticationLayout = () => {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-primary-500 to-primary-500">
            <div className="bg-primary-600 p-8 rounded-xl shadow-lg w-[100%] max-w-sm flex flex-col items-center">
                {/* Logo */}
                <div className="mb-6">
                    <CompanyLogo />
                </div>

                {/* Title and Subtitle */}
                <div className="text-center text-white mb-6">
                    <h1 className="text-xl font-bold">Welcome back!</h1>
                    <p className="text-sm">Enter your credentials to continue</p>
                </div>

                <Outlet />
            </div>
        </div>
    );
};
