import * as React from "react";
import * as Label from "@radix-ui/react-label";
import * as Select from "@radix-ui/react-select";
import {
  UploadIcon,
  ChevronDownIcon,
  CheckIcon,
} from "@radix-ui/react-icons";
import { useNavigate } from "react-router-dom";
import {
  useUserContext,
  Area,
  Department,
  Role,
  Gender,
} from "../../context/UserContext";

/* -------------------- Types -------------------- */

interface UserFormData {
  firstName: string;
  lastName: string;
  area: Area;
  department: Department | "";
  role: Role;
  gender: Gender;
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
  const { addUser, areas, departments, roles, genders } = useUserContext();
  const navigate = useNavigate();

  const [formData, setFormData] = React.useState<UserFormData>({
    firstName: "",
    lastName: "",
    area: "HO",
    department: "",
    role: "user",
    gender: "male",
    userId: "",
    password: "",
    photo: null,
  });

  const [loading, setLoading] = React.useState(false);

  /* -------------------- Handlers -------------------- */

  const handleChange = <K extends keyof UserFormData>(
    field: K,
    value: UserFormData[K]
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // Reset department when area changes
  React.useEffect(() => {
    setFormData((prev) => ({ ...prev, department: "" }));
  }, [formData.area]);

 const handleSubmit = async () => {
  await addUser({
    firstName: formData.firstName,
    lastName: formData.lastName,

    // ⚠️ this must be department ObjectId from backend
    department: formData.department,
    // department: selectedDepartmentId,

    role: formData.role,
    gender: formData.gender,
    userId: formData.userId,
    password: formData.password,
    photo: formData.photo,
  });
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
            onChange={(e) => handleChange("firstName", e.target.value)}
            className="w-full border rounded px-2 py-1 mt-1"
          />
        </div>

        {/* Last Name */}
        <div>
          <Label.Root>Last Name</Label.Root>
          <input
            value={formData.lastName}
            onChange={(e) => handleChange("lastName", e.target.value)}
            className="w-full border rounded px-2 py-1 mt-1"
          />
        </div>

        {/* Area */}
        <div>
          <Label.Root>Area</Label.Root>
          <Select.Root
            value={formData.area}
            onValueChange={(v) => handleChange("area", v as Area)}
          >
            <Select.Trigger className="border w-full px-2 py-1 rounded mt-1 flex justify-between">
              <Select.Value />
              <ChevronDownIcon />
            </Select.Trigger>
            <Select.Content className="bg-white border rounded shadow-md">
              <Select.Viewport>
                {areas.map((area) => (
                  <SelectItem key={area} value={area}>
                    {area}
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
            value={formData.department}
            onValueChange={(v) =>
              handleChange("department", v as Department)
            }
          >
            <Select.Trigger className="border w-full px-2 py-1 rounded mt-1 flex justify-between">
              <Select.Value placeholder="Select Department" />
              <ChevronDownIcon />
            </Select.Trigger>
            <Select.Content className="bg-white border rounded shadow-md">
              <Select.Viewport>
                {departments.map((dept) => (
                  <SelectItem key={dept} value={dept}>
                    {dept}
                  </SelectItem>
                ))}
              </Select.Viewport>
            </Select.Content>
          </Select.Root>
        </div>

        {/* Role */}
        <div>
          <Label.Root>Role</Label.Root>
          <Select.Root
            value={formData.role}
            onValueChange={(v) => handleChange("role", v as Role)}
          >
            <Select.Trigger className="border w-full px-2 py-1 rounded mt-1 flex justify-between">
              <Select.Value />
              <ChevronDownIcon />
            </Select.Trigger>
            <Select.Content className="bg-white border rounded shadow-md">
              <Select.Viewport>
                {roles.map((role) => (
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
            onValueChange={(v) => handleChange("gender", v as Gender)}
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
            onChange={(e) => handleChange("userId", e.target.value)}
            className="w-full border rounded px-2 py-1 mt-1"
          />
        </div>

        {/* Password */}
        <div>
          <Label.Root>Password</Label.Root>
          <input
            type="password"
            value={formData.password}
            onChange={(e) => handleChange("password", e.target.value)}
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
                handleChange("photo", e.target.files?.[0] ?? null)
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
