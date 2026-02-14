import * as React from "react";
import * as Label from "@radix-ui/react-label";
import * as Select from "@radix-ui/react-select";
import {
  UploadIcon,
  ChevronDownIcon,
  CheckIcon,
} from "@radix-ui/react-icons";
import { useNavigate } from "react-router-dom";
import { useUserContext } from "../../context/UserContext";
import { ADMIN_DASHBOARD_ROUTE, DASHBOARD_ROUTE, SUPERVISOR_DASHBOARD_ROUTE } from "../../router/routeConstants";

/* -------------------- Types -------------------- */

interface UserFormData {
  firstName: string;
  lastName: string;
  plantId: string;
  departmentId: string;
  role: "user" | "admin" | "supervisor" | "superadmin";
  gender: "male" | "female";
  userId: string;
  password: string;
  photo?: File | null;
}

/* -------------------- Select Item -------------------- */

const SelectItem = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<typeof Select.Item>
>(({ children, ...props }, ref) => (
  <Select.Item
    ref={ref}
    {...props}
    className="text-sm leading-none text-black rounded-sm flex items-center h-8 px-2 relative select-none data-[highlighted]:bg-gray-100"
  >
    <Select.ItemText>{children}</Select.ItemText>
    <Select.ItemIndicator className="absolute right-2">
      <CheckIcon />
    </Select.ItemIndicator>
  </Select.Item>
));

SelectItem.displayName = "SelectItem";

/* -------------------- Component -------------------- */

const AddUser: React.FC = () => {
  const {
    addUser,
    plants = [],
    departments = [],
    loadDepartments,
    roles = [],
    genders = [],
    currentUser,
  } = useUserContext();

  const navigate = useNavigate();

  const [formData, setFormData] = React.useState<UserFormData>({
    firstName: "",
    lastName: "",
    plantId: "",
    departmentId: "",
    role: "user",
    gender: "male",
    userId: "",
    password: "",
    photo: null,
  });

  const [loading, setLoading] = React.useState(false);

  /* ================= ROLE PERMISSION LOGIC ================= */

  const allowedRoles = React.useMemo(() => {
    if (!currentUser) return [];

    switch (currentUser.role) {
      case "superadmin":
        return ["superadmin", "admin", "supervisor", "user"];
      case "admin":
        return ["supervisor", "user"];
      case "supervisor":
        return ["user"];
      default:
        return [];
    }
  }, [currentUser]);

  /* Ensure selected role is always allowed */
  React.useEffect(() => {
    if (!allowedRoles.includes(formData.role)) {
      setFormData((prev) => ({
        ...prev,
        role: allowedRoles[0] as any,
      }));
    }
  }, [allowedRoles]);

  /* -------------------- Role helpers -------------------- */

  const isAdminOrSupervisor =
    currentUser?.role === "admin" ||
    currentUser?.role === "supervisor";

  const isSuperAdmin = currentUser?.role === "superadmin";

  /* -------------------- Handlers -------------------- */

  const handleChange = <K extends keyof UserFormData>(
    field: K,
    value: UserFormData[K]
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  /* -------------------- Effects -------------------- */

  // Auto set plant for admin & supervisor
  React.useEffect(() => {
    if (!currentUser || !isAdminOrSupervisor) return;

    const plantField = currentUser.department?.plant;
    if (!plantField) return;

    const plantId =
      typeof plantField === "string"
        ? plantField
        : plantField._id;

    setFormData((prev) => ({
      ...prev,
      plantId,
    }));

    loadDepartments(plantId);
  }, [currentUser, isAdminOrSupervisor, loadDepartments]);

  // Superadmin plant change
  React.useEffect(() => {
    if (!isSuperAdmin) return;
    if (!formData.plantId) return;

    loadDepartments(formData.plantId);

    setFormData((prev) => ({
      ...prev,
      departmentId: "",
    }));
  }, [formData.plantId, isSuperAdmin, loadDepartments]);

  /* -------------------- Filtered Departments -------------------- */

  const filteredDepartments = React.useMemo(() => {
    return departments.filter((d: any) =>
      typeof d.plant === "string"
        ? d.plant === formData.plantId
        : d.plant?._id === formData.plantId
    );
  }, [departments, formData.plantId]);

  /* -------------------- Submit -------------------- */

  const handleSubmit = async () => {
  setLoading(true);
  try {
    await addUser({
      firstName: formData.firstName,
      lastName: formData.lastName,
      department: formData.departmentId,
      role: formData.role,
      gender: formData.gender,
      userId: formData.userId,
      password: formData.password,
      photo: formData.photo,
    });

    // ✅ Role-based redirect
    if (currentUser?.role === "supervisor") {
      navigate(`${SUPERVISOR_DASHBOARD_ROUTE}/users`);
    } else if (currentUser?.role === "admin") {
      navigate(`${ADMIN_DASHBOARD_ROUTE}/users`);
    } else if (currentUser?.role === "superadmin") {
      navigate(`${DASHBOARD_ROUTE}/users`);
    }

  } finally {
    setLoading(false);
  }
};

  /* -------------------- UI -------------------- */

  return (
    <div className="max-w-4xl mx-auto mt-8 p-6 border rounded-md shadow-md">
      <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
        Add User
      </h2>

      <div className="grid grid-cols-2 gap-8">
        {/* First Name */}
        <div>
          <Label.Root>First Name</Label.Root>
          <input
            value={formData.firstName}
            onChange={(e) =>
              handleChange("firstName", e.target.value)
            }
            className="w-full border rounded px-2 py-1 mt-1"
          />
        </div>

        {/* Last Name */}
        <div>
          <Label.Root>Last Name</Label.Root>
          <input
            value={formData.lastName}
            onChange={(e) =>
              handleChange("lastName", e.target.value)
            }
            className="w-full border rounded px-2 py-1 mt-1"
          />
        </div>

         {/* Plant */}
        <div>
          <Label.Root>Plant</Label.Root>
          <Select.Root
            value={formData.plantId}
            onValueChange={(v) =>
              handleChange("plantId", v)
            }
            disabled={isAdminOrSupervisor}
          >
            <Select.Trigger className="border w-full px-2 py-1 rounded mt-1 flex justify-between">
              <Select.Value placeholder="Select Plant" />
              <ChevronDownIcon />
            </Select.Trigger>

            <Select.Content className="bg-white border rounded shadow-md">
              <Select.Viewport>
                {plants.map((p: any) => (
                  <SelectItem key={p._id} value={p._id}>
                    {p.name}
                  </SelectItem>
                ))}
              </Select.Viewport>
            </Select.Content>
          </Select.Root>
        </div>

        {/* Department */}
        <div>
          <Label.Root>Department</Label.Root>
          <Select.Root
            value={formData.departmentId}
            onValueChange={(v) =>
              handleChange("departmentId", v)
            }
            disabled={!formData.plantId}
          >
            <Select.Trigger className="border w-full px-2 py-1 rounded mt-1 flex justify-between">
              <Select.Value placeholder="Select Department" />
              <ChevronDownIcon />
            </Select.Trigger>

            <Select.Content className="bg-white border rounded shadow-md">
              <Select.Viewport>
                {filteredDepartments.map((d: any) => (
                  <SelectItem key={d._id} value={d._id}>
                    {d.name}
                  </SelectItem>
                ))}
              </Select.Viewport>
            </Select.Content>
          </Select.Root>
        </div>
 {/* ✅ ROLE (FILTERED) */}
        <div>
          <Label.Root>Role</Label.Root>
          <Select.Root
            value={formData.role}
            onValueChange={(v) =>
              handleChange("role", v as any)
            }
          >
            <Select.Trigger className="border w-full px-2 py-1 rounded mt-1 flex justify-between">
              <Select.Value />
              <ChevronDownIcon />
            </Select.Trigger>

            <Select.Content className="bg-white border rounded shadow-md">
              <Select.Viewport>
                {allowedRoles.map((role) => (
                  <SelectItem key={role} value={role}>
                    {role}
                  </SelectItem>
                ))}
              </Select.Viewport>
            </Select.Content>
          </Select.Root>
        </div>

        {/* Gender */}
        <div>
          <Label.Root>Gender</Label.Root>
          <Select.Root
            value={formData.gender}
            onValueChange={(v) =>
              handleChange("gender", v as any)
            }
          >
            <Select.Trigger className="border w-full px-2 py-1 rounded mt-1 flex justify-between">
              <Select.Value />
              <ChevronDownIcon />
            </Select.Trigger>
            <Select.Content className="bg-white border rounded shadow-md">
              <Select.Viewport>
                {genders.map((g) => (
                  <SelectItem key={g} value={g}>
                    {g}
                  </SelectItem>
                ))}
              </Select.Viewport>
            </Select.Content>
          </Select.Root>
        </div>

        {/* User ID */}
        <div>
          <Label.Root>User ID</Label.Root>
          <input
            value={formData.userId}
            onChange={(e) =>
              handleChange("userId", e.target.value)
            }
            className="w-full border rounded px-2 py-1 mt-1"
          />
        </div>

        {/* Password */}
        <div>
          <Label.Root>Password</Label.Root>
          <input
            type="password"
            value={formData.password}
            onChange={(e) =>
              handleChange("password", e.target.value)
            }
            className="w-full border rounded px-2 py-1 mt-1"
          />
        </div>

        {/* Photo */}
        <div className="col-span-2">
          <Label.Root>Upload Photo</Label.Root>
          <label className="inline-flex items-center gap-2 border px-3 py-2 rounded cursor-pointer mt-1">
            <UploadIcon />
            Upload
            <input
              type="file"
              hidden
              onChange={(e) =>
                handleChange(
                  "photo",
                  e.target.files?.[0] ?? null
                )
              }
            />
          </label>
        </div>
      </div>

      <button
        onClick={handleSubmit}
        disabled={loading}
        className="w-full mt-6 py-2 bg-blue-600 text-white rounded font-bold disabled:opacity-50"
      >
        {loading ? "Creating..." : "Add User"}
      </button>
    </div>
  );
};

export default AddUser;
