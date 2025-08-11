import * as React from "react";
import * as Label from "@radix-ui/react-label";
import * as Select from "@radix-ui/react-select";
import { UploadIcon, ChevronDownIcon, CheckIcon } from "@radix-ui/react-icons";
import { useNavigate } from "react-router-dom";
import { useDeviceContext } from "../../context/DeviceContext";
import { useUserContext } from "../../context/UserContext";

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

export default function AddDevice() {
  const { addDevice } = useDeviceContext();
  const { users } = useUserContext();
  const navigate = useNavigate();

  const [formData, setFormData] = React.useState({
    type: "",
    name: "",
    serial: "",
    user: "",
    department: "",
    area: "HO",
    image: "/device-image.png",
    file: null as File | null,
  });

  // Filter users based on selected department and area
  const filteredUsers = users.filter(
    (u) =>
      (formData.department ? u.department === formData.department : true) &&
      (formData.area ? u.area === formData.area : true)
  );

  const handleChange = (field: string, value: string | File | null) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!filteredUsers.find((u) => u.firstName === formData.user)) {
      alert("Selected user is invalid for the chosen department and area.");
      return;
    }
    addDevice({
      id: Date.now().toString(),
      type: formData.type,
      name: formData.name,
      serial: formData.serial,
      user: formData.user,
      department: formData.department,
      area: formData.area,
      image: formData.image,
    });
    navigate("/dashboard/devices");
  };

  // Reset user if department or area changes
  React.useEffect(() => {
    setFormData((prev) => ({ ...prev, user: "" }));
  }, [formData.department, formData.area]);

  return (
    <div className="max-w-4xl mx-auto mt-8 p-6 border rounded-md shadow-md">
      <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">Add Device</h2>
      <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-8">
        {/* Device Type */}
        <div>
          <Label.Root className="text-lg font-light">Device Type</Label.Root>
          <input
            value={formData.type}
            onChange={(e) => handleChange("type", e.target.value)}
            className="w-full border border-gray-500 shadow-md rounded px-2 py-1 mt-1"
            placeholder="Enter device type"
            required
          />
        </div>
        {/* Serial Number */}
        <div>
          <Label.Root className="text-lg font-light">Device Name</Label.Root>
          <input
            value={formData.name}
            onChange={(e) => handleChange("name", e.target.value)}
            className="w-full border border-gray-500 shadow-md rounded px-2 py-1 mt-1"
            placeholder="Enter device name"
            required
          />
        </div>
        {/* Area */}
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
          <Label.Root className="text-lg font-light">Department</Label.Root>
          <Select.Root
            value={formData.department}
            onValueChange={(value) => handleChange("department", value)}
          >
            <Select.Trigger className="inline-flex items-center justify-between border border-gray-500 shadow-md w-full px-2 py-1 rounded mt-1">
              <Select.Value placeholder="Select department" />
              <Select.Icon>
                <ChevronDownIcon />
              </Select.Icon>
            </Select.Trigger>
            <Select.Portal>
              <Select.Content className="bg-white border rounded shadow-md">
                <Select.Viewport>
                  <SelectItem value="MIS">MIS</SelectItem>
                  <SelectItem value="Finance">Finance</SelectItem>
                  <SelectItem value="HR">HR</SelectItem>
                </Select.Viewport>
              </Select.Content>
            </Select.Portal>
          </Select.Root>
        </div>
        {/* User */}
        <div>
        <Label.Root className="text-lg font-light">User</Label.Root>
        <Select.Root
            value={formData.user}
            onValueChange={(value) => handleChange("user", value)}
            disabled={!formData.department || !formData.area || filteredUsers.length === 0}
        >
            <Select.Trigger
            className="inline-flex items-center justify-between border border-gray-500 shadow-md w-full px-2 py-1 rounded mt-1"
            disabled={!formData.department || !formData.area || filteredUsers.length === 0}
            >
            <Select.Value placeholder={filteredUsers.length === 0 ? "No users found" : "Select user"} />
            <Select.Icon>
                <ChevronDownIcon />
            </Select.Icon>
            </Select.Trigger>
            {filteredUsers.length > 0 && (
            <Select.Portal>
                <Select.Content className="bg-white border rounded shadow-md">
                <Select.Viewport>
                    {filteredUsers.map((u) => (
                    <SelectItem key={u.id} value={u.firstName}>
                        {u.firstName}
                    </SelectItem>
                    ))}
                </Select.Viewport>
                </Select.Content>
            </Select.Portal>
            )}
        </Select.Root>
        {filteredUsers.length === 0 && (
            <div className="text-sm text-red-500 mt-1">No users found for this department and area.</div>
        )}
        </div>

        <div>
          <Label.Root className="text-lg font-light">Serial Number</Label.Root>
          <input
            value={formData.serial}
            onChange={(e) => handleChange("serial", e.target.value)}
            className="w-full border border-gray-500 shadow-md rounded px-2 py-1 mt-1"
            placeholder="Enter seiral number"
            required
          />
        </div>

        {/* Image Upload */}
        <div className="col-span-2">
          <Label.Root className="text-lg font-light mr-5">Upload Image</Label.Root>
          <label className="inline-flex items-center gap-2 border px-3 py-2 rounded border-gray-500 shadow-md mt-1 cursor-pointer">
            <UploadIcon /> Upload
            <input
              type="file"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                handleChange("file", file || null);
                if (file) {
                  const reader = new FileReader();
                  reader.onload = (ev) => {
                    handleChange("image", ev.target?.result as string);
                  };
                  reader.readAsDataURL(file);
                }
              }}
            />
          </label>
          {formData.file && (
            <span className="ml-2 text-sm text-gray-700">{formData.file.name}</span>
          )}
        </div>
        {/* Save Button */}
        <div className="col-span-2">
          <button
            type="submit"
            className="w-full bg-primary-500 text-lg hover:bg-primary-900 text-white mt-6 py-1 rounded-lg font-bold shadow-md transition duration-200 hover:scale-105"
          >
            Add Device
          </button>
        </div>
      </form>
    </div>
  );
}