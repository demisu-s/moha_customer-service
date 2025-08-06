import Logo from '@/assets/logo.jpg';

export const CompanyLogo = () => {
    return (
        <div className="flex items-center space-x-3 p-4 bg-white shadow rounded-xl">
            <img 
                src={Logo} 
                alt="Company Logo" 
                className="w-20 h-12 object-cover"
            />
            <span className="text-1xl font-semibold text-gray-800 tracking-wide">
                Moha Soft Drinks
            </span>
        </div>
    );
};
