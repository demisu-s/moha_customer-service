import InputField from "../../components/common/inputField";
import { Button } from "../../components/ui/button";
import {
  CLIENT_DASHBOARD_ROUTE,
  DASHBOARD_ROUTE,
  SIGN_IN_ROUTE,
  SUPERVISOR_DASHBOARD_ROUTE,
} from "../../router/routeConstants";
import { RegisterData } from "../../store/types";
import { validator } from "../../utils/auth.validator";
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { loginUser } from "../../api/auth.api";

export interface ValidationErrors {
  [key: string]: string;
}

export const Login = () => {
  const navigate = useNavigate();

  const [userData, setUserData] = useState<RegisterData>({
    userId: "",
    password: "",
  });

  const [validationError, setValidationError] =
    useState<ValidationErrors>({});
  const [loading, setLoading] = useState(false);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    setUserData((prev) => ({ ...prev, [name]: value }));
  };

  const handleLoginSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    const fieldsToValidate: (keyof RegisterData)[] = [
      "userId",
      "password",
    ];
    const errors = validator(userData, fieldsToValidate);
    setValidationError(errors);

    if (Object.keys(errors).length !== 0) return;

    try {
      setLoading(true);

      const result = await loginUser(userData);

      // 🔐 store auth data
      localStorage.setItem("access_token", result.token);
      localStorage.setItem("role", result.role); // already lowercase
      localStorage.setItem("userId", result.userId);
      localStorage.setItem(
        "userName",
        `${result.firstName} ${result.lastName}`
      );
      localStorage.setItem("department", result.department._id);

      // 🚦 role-based routing
      if (result.role === "admin") {
        navigate(DASHBOARD_ROUTE);
      } else if (result.role === "supervisor") {
        navigate(SUPERVISOR_DASHBOARD_ROUTE);
      } else {
        navigate(CLIENT_DASHBOARD_ROUTE);
      }
    } catch (err: any) {
      setValidationError({
        password: err?.response?.data?.message || "Invalid credentials",
      });
    } finally {
      setLoading(false);
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
        required
        handleChange={handleInputChange}
      />

      <InputField
        type="password"
        name="password"
        placeholder="Password"
        value={userData.password}
        error={validationError}
        required
        handleChange={handleInputChange}
      />

      <Button
        type="submit"
        disabled={loading}
        className="w-full bg-primary-700 hover:bg-primary-800 text-white py-2 rounded-md transition"
      >
        {loading ? "Signing in..." : "Sign in"}
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
