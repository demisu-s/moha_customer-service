import InputField from "../../components/common/inputField";
import { Button } from "../../components/ui/button";
import {
  ADMIN_DASHBOARD_ROUTE,
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
import { useUserContext } from "../../context/UserContext";

export interface ValidationErrors {
  [key: string]: string;
}

export const Login = () => {
  const navigate = useNavigate();
  const { login } = useUserContext(); // ✅ use context login

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

      login({
        _id: result._id,
        firstName: result.firstName,
        lastName: result.lastName,
        department: {
          _id: result.department._id,
          name: result.department.name,
          plant: result.department.plant,
          block: result.department.block,
          floor: result.department.floor,
        },
        role: result.role,
        gender: result.gender,
        userId: result.userId,
        photo: result.photo,
      });

      // store extra info if needed
      localStorage.setItem("access_token", result.token);
      localStorage.setItem(
        "userName",
        `${result.firstName} ${result.lastName}`
      );
      localStorage.setItem("department", result.department?._id);


      // 🚦 role-based routing
      if (result.role === "superadmin") {
        navigate(DASHBOARD_ROUTE, { replace: true });
      } else if (result.role === "admin") {
        navigate(ADMIN_DASHBOARD_ROUTE, { replace: true });
      } else if (result.role === "supervisor") {
        navigate(SUPERVISOR_DASHBOARD_ROUTE, { replace: true });
      } else {
        navigate(CLIENT_DASHBOARD_ROUTE, { replace: true });
      }

    } catch (err: any) {
      setValidationError({
        password:
          err?.response?.data?.message || "Invalid credentials",
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
