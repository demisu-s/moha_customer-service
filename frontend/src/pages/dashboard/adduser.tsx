import * as React from "react";
import * as Label from "@radix-ui/react-label";
import * as Select from "@radix-ui/react-select";
import { UploadIcon, ChevronDownIcon, CheckIcon } from "@radix-ui/react-icons";
import { useNavigate } from "react-router-dom";
import { useUserContext } from "../../context/UserContext"; // <-- import context

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

const AddUser = () => {
  const { addUser } = useUserContext();
  const navigate = useNavigate();

  const [formData, setFormData] = React.useState<UserFormData>({
    firstName: "",
    lastName: "",
    area: "Head Office",
    department: "",
    role: "normal user",
    gender: "Male",
    userId: "",
    password: "",
    photo: null,
  });

  const handleChange = (field: keyof UserFormData, value: string | File | null) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    addUser(formData); // Save to context
    setFormData({
      firstName: "",
      lastName: "",
      area: "Head Office",
      department: "",
      role: "normal user",
      gender: "Male",
      userId: "",
      password: "",
      photo: null,
    });
    navigate("/dashboard/users"); // go back to users page
  };

  return (
    <div className="max-w-3xl mx-auto mt-8 p-6 border rounded-md shadow-md">
      <h2 className="text-2xl font-semibold mb-6 text-center">Add User</h2>
      <div className="grid grid-cols-2 gap-4">
        {/* First Name */}
        <div>
          <Label.Root className="text-sm font-medium">First Name</Label.Root>
          <input
            value={formData.firstName}
            onChange={(e) => handleChange("firstName", e.target.value)}
            className="w-full border rounded px-2 py-1 mt-1" placeholder="Enter first name"
          />
        </div>

        {/* Last Name */}
        <div>
          <Label.Root className="text-sm font-medium">Last Name</Label.Root>
          <input
            value={formData.lastName}
            onChange={(e) => handleChange("lastName", e.target.value)}
            className="w-full border rounded px-2 py-1 mt-1" placeholder="Enter Last name"
          />
        </div>

        {/* Area */}
        <div>
          <Label.Root className="text-sm font-medium">Area</Label.Root>
          <Select.Root
            value={formData.area}
            onValueChange={(value) => handleChange("area", value)}
          >
            <Select.Trigger className="inline-flex items-center justify-between border w-full px-2 py-1 rounded mt-1">
              <Select.Value />
              <Select.Icon>
                <ChevronDownIcon />
              </Select.Icon>
            </Select.Trigger>
            <Select.Portal>
              <Select.Content className="bg-white border rounded shadow-md">
                <Select.Viewport>
                  <SelectItem value="HO">Head Office</SelectItem>
                  <SelectItem value="Kality">Kality</SelectItem>
                  <SelectItem value="Summit">Summit</SelectItem>
                </Select.Viewport>
              </Select.Content>
            </Select.Portal>
          </Select.Root>
        </div>

        {/* Department */}
        <div>
          <Label.Root className="text-sm font-medium">Department</Label.Root>
          <input
            value={formData.department}
            onChange={(e) => handleChange("department", e.target.value)}
            className="w-full border rounded px-2 py-1 mt-1" placeholder="Enter your department"
          />
        </div>

        {/* Role */}
        <div>
          <Label.Root className="text-sm font-medium">Role</Label.Root>
          <Select.Root
            value={formData.role}
            onValueChange={(value) => handleChange("role", value)}
          >
            <Select.Trigger className="inline-flex items-center justify-between border w-full px-2 py-1 rounded mt-1">
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
          <Label.Root className="text-sm font-medium">Gender</Label.Root>
          <Select.Root
            value={formData.gender}
            onValueChange={(value) => handleChange("gender", value)}
          >
            <Select.Trigger className="inline-flex items-center justify-between border w-full px-2 py-1 rounded mt-1">
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
          <Label.Root className="text-sm font-medium">User ID</Label.Root>
          <input
            value={formData.userId}
            onChange={(e) => handleChange("userId", e.target.value)}
            className="w-full border rounded px-2 py-1 mt-1" placeholder="Enter User ID"
          />
        </div>

        {/* Password */}
        <div>
          <Label.Root className="text-sm font-medium">Password</Label.Root>
          <input
            type="password"
            value={formData.password}
            onChange={(e) => handleChange("password", e.target.value)}
            className="w-full border rounded px-2 py-1 mt-1" placeholder="Enter Password"
          />
        </div>

        {/* Photo Upload */}
        <div className="col-span-2">
          <Label.Root className="text-sm font-medium">Upload Photo</Label.Root>
          <label className="inline-flex items-center gap-2 border px-3 py-2 rounded mt-1 cursor-pointer">
            <UploadIcon /> Upload
            <input
              type="file"
              className="hidden"
              onChange={(e) =>
                handleChange("photo", e.target.files?.[0] || null)
              }
            />
          </label>
          {formData.photo && (
            <span className="ml-2 text-sm text-gray-700">{formData.photo.name}</span>
          )}
        </div>
      </div>

      <button
        className="w-full bg-blue-600 hover:bg-blue-700 text-white mt-6 py-2 rounded"
        onClick={handleSubmit}
      >
        Add
      </button>
    </div>
  );
};

export default AddUser;
