import * as React from "react";
import * as Label from "@radix-ui/react-label";
import * as Select from "@radix-ui/react-select";
import { UploadIcon, ChevronDownIcon, CheckIcon } from "@radix-ui/react-icons";
import { useNavigate } from "react-router-dom";
import { useUserContext } from "../../context/UserContext";

interface UserFormData {
  firstName: string;
  lastName: string;
  area: string;
  department: string;
  role: string;
  gender: string;
  userId: string;
  password: string;
  photo?: File | null;
}

const SelectItem = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<typeof Select.Item>
>(({ children, ...props }, forwardedRef) => (
  <Select.Item
    className="text-sm leading-none text-black rounded-sm flex items-center h-8 px-2 relative select-none data-[highlighted]:bg-gray-100"
    {...props}
    ref={forwardedRef}
  >
    <Select.ItemText>{children}</Select.ItemText>
    <Select.ItemIndicator className="absolute right-2">
      <CheckIcon />
    </Select.ItemIndicator>
  </Select.Item>
));
SelectItem.displayName = "SelectItem";

// Plant -> Departments mapping
const departmentsByPlant: Record<string, string[]> = {
  HO: ["HR", "MIS", "Finance","Planning","Project","procrument", "Sales", "Marketing", "Law", "Property","Audit","Quality"],
  Summit: ["Production","Operations", "Quality Control","Sales", "Logistics","HR", "Maintenance","Technitian"],
  NifasSilk: ["Production","Operations", "Quality Control","Sales", "Logistics","HR", "Maintenance","Technitian"],
  Teklehaymanot: ["Production","Operations", "Quality Control","Sales", "Logistics","HR", "Maintenance","Technitian"],
  Bure:["Production","Operations", "Quality Control","Sales", "Logistics","HR", "Maintenance","Technitian"],
  Mekelle: ["Production","Operations", "Quality Control","Sales", "Logistics","HR", "Maintenance","Technitian"],
  Dessie: ["Production","Operations", "Quality Control","Sales", "Logistics","HR", "Maintenance","Technitian"],
  Gonder: ["Production","Operations", "Quality Control","Sales", "Logistics","HR", "Maintenance","Technitian"],
  Hawassa: ["Production","Operations", "Quality Control","Sales", "Logistics","HR", "Maintenance","Technitian"],
};

const AddUser = () => {
  const { addUser } = useUserContext();
  const navigate = useNavigate();

  const [formData, setFormData] = React.useState<UserFormData>({
    firstName: "",
    lastName: "",
    area: "HO",
    department: "",
    role: "User",
    gender: "Male",
    userId: "",
    password: "",
    photo: null,
  });

  const handleChange = (field: keyof UserFormData, value: string | File | null) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // Reset department when plant (area) changes
  React.useEffect(() => {
    setFormData((prev) => ({ ...prev, department: "" }));
  }, [formData.area]);

  const handleSubmit = () => {
    addUser(formData);
    setFormData({
      firstName: "",
      lastName: "",
      area: "HO",
      department: "",
      role: "User",
      gender: "Male",
      userId: "",
      password: "",
      photo: null,
    });
    navigate("/dashboard/users");
  };

  return (
    <div className="max-w-4xl mx-auto mt-8 p-6 border rounded-md shadow-md">
      <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">Add User</h2>
      <div className="grid grid-cols-2 gap-8">
        {/* First Name */}
        <div>
          <Label.Root className="text-lg font-light">First Name</Label.Root>
          <input
            value={formData.firstName}
            onChange={(e) => handleChange("firstName", e.target.value)}
            className="w-full border border-gray-500 shadow-md rounded px-2 py-1 mt-1"
            placeholder="Enter first name"
          />
        </div>

        {/* Last Name */}
        <div>
          <Label.Root className="text-lg font-light">Last Name</Label.Root>
          <input
            value={formData.lastName}
            onChange={(e) => handleChange("lastName", e.target.value)}
            className="w-full border border-gray-500 shadow-md rounded px-2 py-1 mt-1"
            placeholder="Enter last name"
          />
        </div>

        {/* Area (Plant) */}
        <div>
          <Label.Root className="text-lg font-light">Area</Label.Root>
          <Select.Root
            value={formData.area}
            onValueChange={(value) => handleChange("area", value)}
          >
            <Select.Trigger className="inline-flex items-center justify-between border border-gray-500 shadow-md w-full px-2 py-1 rounded mt-1">
              <Select.Value />
              <Select.Icon>
                <ChevronDownIcon />
              </Select.Icon>
            </Select.Trigger>
            <Select.Portal>
              <Select.Content className="bg-white border rounded shadow-md">
                <Select.Viewport>
                  {Object.keys(departmentsByPlant).map((plant) => (
                    <SelectItem key={plant} value={plant}>
                      {plant}
                    </SelectItem>
                  ))}
                </Select.Viewport>
              </Select.Content>
            </Select.Portal>
          </Select.Root>
        </div>

        {/* Department */}
        <div>
          <Label.Root className="text-lg font-light">Department</Label.Root>
          <Select.Root
            value={formData.department}
            onValueChange={(value) => handleChange("department", value)}
            disabled={!formData.area}
          >
            <Select.Trigger className="inline-flex items-center justify-between border border-gray-500 shadow-md w-full px-2 py-1 rounded mt-1 disabled:opacity-50">
              <Select.Value placeholder="Select Department" />
              <Select.Icon>
                <ChevronDownIcon />
              </Select.Icon>
            </Select.Trigger>
            <Select.Portal>
              <Select.Content className="bg-white border rounded shadow-md">
                <Select.Viewport>
                  {(departmentsByPlant[formData.area] || []).map((dept) => (
                    <SelectItem key={dept} value={dept}>
                      {dept}
                    </SelectItem>
                  ))}
                </Select.Viewport>
              </Select.Content>
            </Select.Portal>
          </Select.Root>
        </div>

        {/* Role */}
        <div>
          <Label.Root className="text-lg font-light">Role</Label.Root>
          <Select.Root
            value={formData.role}
            onValueChange={(value) => handleChange("role", value)}
          >
            <Select.Trigger className="inline-flex items-center justify-between border border-gray-500 shadow-md w-full px-2 py-1 rounded mt-1">
              <Select.Value />
              <Select.Icon>
                <ChevronDownIcon />
              </Select.Icon>
            </Select.Trigger>
            <Select.Portal>
              <Select.Content className="bg-white border rounded shadow-md">
                <Select.Viewport>
                  <SelectItem value="User">User</SelectItem>
                  <SelectItem value="Supervisor">Supervisor</SelectItem>
                  <SelectItem value="Admin">Admin</SelectItem>
                </Select.Viewport>
              </Select.Content>
            </Select.Portal>
          </Select.Root>
        </div>

        {/* Gender */}
        <div>
          <Label.Root className="text-lg font-light">Gender</Label.Root>
          <Select.Root
            value={formData.gender}
            onValueChange={(value) => handleChange("gender", value)}
          >
            <Select.Trigger className="inline-flex items-center justify-between border border-gray-500 shadow-md w-full px-2 py-1 rounded mt-1">
              <Select.Value />
              <Select.Icon>
                <ChevronDownIcon />
              </Select.Icon>
            </Select.Trigger>
            <Select.Portal>
              <Select.Content className="bg-white border rounded shadow-md">
                <Select.Viewport>
                  <SelectItem value="Male">Male</SelectItem>
                  <SelectItem value="Female">Female</SelectItem>
                </Select.Viewport>
              </Select.Content>
            </Select.Portal>
          </Select.Root>
        </div>

        {/* User ID */}
        <div>
          <Label.Root className="text-lg font-light">User ID</Label.Root>
          <input
            value={formData.userId}
            onChange={(e) => handleChange("userId", e.target.value)}
            className="w-full border border-gray-500 shadow-md rounded px-2 py-1 mt-1"
            placeholder="Enter User ID"
          />
        </div>

        {/* Password */}
        <div>
          <Label.Root className="text-lg font-light">Password</Label.Root>
          <input
            type="password"
            value={formData.password}
            onChange={(e) => handleChange("password", e.target.value)}
            className="w-full border border-gray-500 shadow-md rounded px-2 py-1 mt-1"
            placeholder="Enter Password"
          />
        </div>

        {/* Photo Upload */}
        <div className="col-span-2">
          <Label.Root className="text-lg font-light mr-5">Upload Photo</Label.Root>
          <label className="inline-flex items-center gap-2 border px-3 py-2 rounded border-gray-500 shadow-md mt-1 cursor-pointer">
            <UploadIcon /> Upload
            <input
              type="file"
              className="hidden"
              onChange={(e) => handleChange("photo", e.target.files?.[0] || null)}
            />
          </label>
          {formData.photo && (
            <span className="ml-2 text-sm text-gray-700">{formData.photo.name}</span>
          )}
        </div>
      </div>

      <button
        className="w-full bg-primary-500 text-lg hover:bg-primary-900 text-white mt-6 py-1 rounded-lg font-bold shadow-md transition duration-200 hover:scale-105"
        onClick={handleSubmit}
      >
        Add
      </button>
    </div>
  );
};

export default AddUser;
