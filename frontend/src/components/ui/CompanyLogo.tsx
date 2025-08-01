import Logo from '@/assets/logo.svg';

export const CompanyLogo = () => {
    return (
        <div className="flex items-end space-x-2 font-bold text-xl p-4">
            <img src={Logo} alt="logo" />
            <h4 className={`text-[#1C1C1E]`}>Live Dream</h4>
        </div>
    )
}
