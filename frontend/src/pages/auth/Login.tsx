import InputField from "../../components/common/inputField";
import { Button } from "../../components/ui/button";
import { CLIENT_DASHBOARD_ROUTE, DASHBOARD_ROUTE, SIGN_IN_ROUTE, SUPERVISOR_DASHBOARD_ROUTE } from "../../router/routeConstants";
import { RegisterData } from "../../store/types";
import { validator } from "../../utils/auth.validator";
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useUserContext } from "../../context/UserContext";

export interface ValidationErrors {
  [key: string]: string;
}

// Only one admin
const ADMIN_CREDENTIALS = { userId: "admin", password: "admin123" };

export const Login = () => {
  const navigate = useNavigate();
  const { users } = useUserContext();

  const [userData, setUserData] = useState<RegisterData>({
    userId: "",
    password: ""
  });
  const [validationError, setValidationError] = useState<ValidationErrors>();

  const handleInputChange = (
    e: React.ChangeEvent<HTMLTextAreaElement | HTMLTextAreaElement | HTMLInputElement>
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
    const foundUser = users.find(
      (user) => user.userId === userData.userId && user.password === userData.password
    );

    if (foundUser) {
      localStorage.setItem("access_token", "fake-token");
      // localStorage.setItem("role", foundUser.role);
      localStorage.setItem("role", foundUser.role.toLowerCase());
      localStorage.setItem("userId", foundUser.userId);
      localStorage.setItem("userName", `${foundUser.firstName} ${foundUser.lastName}`);
      localStorage.setItem("userDepartment", foundUser.department);
      localStorage.setItem("userArea", foundUser.area);

      if (foundUser.role === "Admin") {
        navigate("/dashboard");
      } else if (foundUser.role === "Supervisor") {
        navigate("/dashboard");
      } else {
        navigate(CLIENT_DASHBOARD_ROUTE);
      }
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
