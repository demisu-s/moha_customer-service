import InputField from "../../components/common/inputField";
import { Button } from "../../components/ui/button";
import { DASHBOARD_ROUTE, SIGN_IN_ROUTE } from "../../router/routeConstants";
import { RegisterData } from "../../store/types";
import { validator } from "../../utils/auth.validator";
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

export interface ValidationErrors {
  [key: string]: string;
}

// Only one admin
const ADMIN_CREDENTIALS = { userId: "admin", password: "admin123" };

export const Login = () => {
  const navigate = useNavigate();

  const [userData, setUserData] = useState<RegisterData>({
    userId: "",
    password: ""
  });
  const [validationError, setValidationError] = useState<ValidationErrors>();

  const handleInputChange = (
    e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    setUserData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleLoginSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const fieldsToValidate: (keyof RegisterData)[] = ["userId", "password"];
    const validate = validator(userData, fieldsToValidate);
    setValidationError(validate);

    if (Object.keys(validate).length === 0) {
      const isAdmin =
        userData.userId === ADMIN_CREDENTIALS.userId &&
        userData.password === ADMIN_CREDENTIALS.password;

      // In a real app, here you'd call an API to check credentials
      if (isAdmin) {
        localStorage.setItem("access_token", "fake-token");
        localStorage.setItem("role", "admin");
        navigate(DASHBOARD_ROUTE);
      } else if (userData.userId && userData.password) {
        // Any other valid login → client
        localStorage.setItem("access_token", "fake-token");
        localStorage.setItem("role", "client");
        navigate("/client-dashboard");
      } else {
        setValidationError({ password: "Invalid username or password" });
      }
    }
  };

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
