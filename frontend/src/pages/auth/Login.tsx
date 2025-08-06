import InputField from "../../components/common/inputField";
import { Button } from "../../components/ui/button";
import { REGISTER_ROUTE, DASHBOARD_ROUTE, SIGN_IN_ROUTE } from "../../router/routeConstants";
import { RegisterData } from "../../store/types";
import { validator } from "../../utils/auth.validator";
import { useEffect, useState } from "react";
import { useNavigate, Link } from 'react-router-dom';
import { getAccessToken } from "../../utils/localStorage";

export interface ValidationErrors {
    [key: string]: string;
}

export const Login = () => {
    const navigate = useNavigate();
    const token = getAccessToken();

    const [userData, setUserData] = useState<RegisterData>({ userId: '', password: '' });
    const [validationError, setValidationError] = useState<ValidationErrors>();

    const handleInputChange = (
        e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
    ) => {
        const { name, value } = e.target;
        setUserData((prevFormData) => ({
            ...prevFormData,
            [name]: value,
        }));
    };

    const handleLoginSubmit = (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();

  const fieldsToValidate: (keyof RegisterData)[] = ["userId", "password"];
  const validate = validator(userData, fieldsToValidate);
  setValidationError(validate);

  if (Object.keys(validate).length === 0) {
    // 👇 Simulate storing a fake token
    localStorage.setItem("access_token", "fake-token");

    // ✅ Redirect to dashboard
    navigate(DASHBOARD_ROUTE);
  }
};


    useEffect(() => {
        if (token) {
            navigate(DASHBOARD_ROUTE);
        }
    }, [token, navigate]);

    return (
        
        <form onSubmit={handleLoginSubmit} className="w-full space-y-4">
            <InputField
                type="text"
                name="userId"
                placeholder="User ID"
                value={userData.userId}
                error={validationError}
                required={true}
                handleChange={handleInputChange}
            />

            <InputField
                type="password"
                name="password"
                placeholder="Password"
                value={userData.password}
                error={validationError}
                required={true}
                handleChange={handleInputChange}
            />

            <Button
                type="submit"
                className="w-full bg-primary-700 hover:bg-primary-800 text-white py-2 rounded-md transition"
            >
                Sign in
            </Button>


            <div className="text-center text-sm text-white">
                <p>
                    Forgot your password?{" "}
                    <Link to={SIGN_IN_ROUTE} className="text-[#ffdf6c] underline">
                        Recover
                    </Link>
                </p>
              
            </div>
        </form>
    );
};
