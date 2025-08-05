import { useNavigate } from "react-router-dom";
import backGroundImage from "../../assets/pepsi.jpg";

export const LandingPage = () => {
  const navigate = useNavigate();

  const handleSignIn = () => {
    navigate("/signin"); // Adjust the path as needed 
  };

  return (
    <div
      className="relative min-h-screen bg-cover bg-center flex items-center justify-center text-white"
      style={{ backgroundImage: `url(${backGroundImage})` }}
    >
      {/* Dark overlay for readability */}
      <div className="absolute inset-0 bg-black bg-opacity-60 z-0" />

      {/* Main Content */}
      <div className="relative z-10 text-center px-6">
        <h1 className="text-4xl md:text-3xl font-bold mb-4 drop-shadow-md">
          Welcome to <span className="text-green-300 text-6xl">Moha</span> IT Support Team
        </h1>
        <p className="text-lg md:text-xl mb-8 drop-shadow-sm">
          Explore powerful features and start your journey with us.
        </p>
        <button
          type="button"
          onClick={handleSignIn}
          className="bg-white text-black px-6 py-3 rounded-full font-semibold text-sm hover:bg-gray-200 transition duration-300 shadow-lg"
        >
          Sign In
        </button>
      </div>
    </div>
  );
};
