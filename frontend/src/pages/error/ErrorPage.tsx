import { DASHBOARD_ROUTE } from "../../router/routeConstants";
// import Error from "../../assets/logo.svg"
import { useNavigate } from "react-router-dom";

export const ErrorPage = () => {
    const navigate = useNavigate();

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-white p-4">
            <img
                src="../assets/logo.svg"
                alt="Error"
                className="w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg h-auto mb-6"
            />
            <p className="text-base sm:text-lg md:text-xl font-semibold text-gray-700 mb-2 text-center">
                "Oops! The page you're looking for couldn't be found."
            </p>
            <p className="text-sm sm:text-base text-gray-500 mb-6 text-center">
                Let's get you back on track
            </p>
            <button
                onClick={() => navigate(DASHBOARD_ROUTE)}
                className="px-4 sm:px-6 py-2 bg-main-color text-white rounded-lg hover:bg-gray-900 transition duration-200"
            >
                Go Home
            </button>
        </div>
    );
};
