import { useNavigate } from 'react-router-dom';
import { REGISTER_ROUTE, SIGN_IN_ROUTE } from '../../router/routeConstants';

export const Nav = () => {
    const navigate = useNavigate();

    return (
        <div data-testid="landingPage" className="flex text-black h-auto md:h-[80px] items-center justify-between px-4 py-2 md:py-0 shadow-lg">
            <div className="flex flex-row space-x-2 md:space-x-4 text-[14px] mr-8">
                <button
                    className="text-main-color hover:bg-main-hover-color font-bold py-2 px-4 rounded transition duration-200"
                    onClick={() => navigate(SIGN_IN_ROUTE)}
                >Login</button>
                <button
                    className="bg-main-color hover:bg-main-hover-color text-white font-bold py-2 px-4 rounded transition duration-200"
                    onClick={() => navigate(REGISTER_ROUTE)}
                >Sign Up</button>
            </div>
        </div>
    );
};
