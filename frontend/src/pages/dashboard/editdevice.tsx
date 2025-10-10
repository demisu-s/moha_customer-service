import * as React from "react";
import * as Label from "@radix-ui/react-label";
import * as Select from "@radix-ui/react-select";
import { UploadIcon, ChevronDownIcon, CheckIcon } from "@radix-ui/react-icons";
import { useNavigate, useParams } from "react-router-dom";
import {
  useDeviceContext,
  DeviceType,
  Device,
} from "../../context/DeviceContext";
import { useUserContext, Area, Department } from "../../context/UserContext";

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

// Local form type for editing (extends Device but allows a file upload)
interface DeviceFormData extends Omit<Device, "id"> {
  id: string;
  file?: File | null;
}

export default function EditDevice() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { devices, updateDevice, deviceTypes } = useDeviceContext();
  const { users, areas, departments } = useUserContext();

  const deviceToEdit = devices.find((d) => d.id === id);

  React.useEffect(() => {
    if (!deviceToEdit) {
      navigate("/dashboard/devices");
    }
  }, [deviceToEdit, navigate]);

  const [formData, setFormData] = React.useState<DeviceFormData>(
    deviceToEdit || {
      id: "",
      type: "Printer" as DeviceType,
      name: "",
      serial: "",
      user: "",
      department: "",
      area: "HO" as Area,
      image: "/device-image.png",
      file: null,
    }
  );

  const filteredUsers = users.filter(
    (u) =>
      (formData.department ? u.department === formData.department : true) &&
      (formData.area ? u.area === formData.area : true)
  );

  const handleChange = (field: keyof DeviceFormData, value: string | File | null) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();

    const selectedUser = (!filteredUsers.find((u) => `${u.firstName} ${u.lastName}` === formData.user));
    if (!selectedUser) {
      alert("Selected user is invalid for the chosen department and area.");
      return;
    }
 


    const updatedDevice: Device = {
      id: formData.id,
      type: formData.type,
      name: formData.name,
      serial: formData.serial,
      user: formData.user,
      department: formData.department,
      area: formData.area,
      image: formData.image,
    };

    updateDevice(updatedDevice);
    navigate("/dashboard/devices");
  };

  const handleCancel = () => navigate("/dashboard/devices");

  // Reset user when department or area changes
  React.useEffect(() => {
    setFormData((prev) => ({ ...prev, user: "" }));
  }, [formData.department, formData.area]);

  return (
    <div className="max-w-4xl mx-auto mt-8 p-6 border rounded-md shadow-md">
      <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
        Edit Device
      </h2>

      <form onSubmit={handleSave} className="grid grid-cols-2 gap-8">
        {/* Device Type (Dropdown like AddDevice) */}
        <div>
          <Label.Root className="text-lg font-light">Device Type</Label.Root>
          <Select.Root
            value={formData.type}
            onValueChange={(value) => handleChange("type", value)}
          >
            <Select.Trigger className="inline-flex items-center justify-between border border-gray-500 shadow-md w-full px-2 py-1 rounded mt-1">
              <Select.Value placeholder="Select device type" />
              <Select.Icon>
                <ChevronDownIcon />
              </Select.Icon>
            </Select.Trigger>
            <Select.Portal>
              <Select.Content className="bg-white border rounded shadow-md">
                <Select.Viewport>
                  {deviceTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </Select.Viewport>
              </Select.Content>
            </Select.Portal>
          </Select.Root>
        </div>

        {/* Device Name */}
        <div>
          <Label.Root className="text-lg font-light">Device Name</Label.Root>
          <input
            value={formData.name}
            onChange={(e) => handleChange("name", e.target.value)}
            className="w-full border border-gray-500 shadow-md rounded px-2 py-1 mt-1"
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
                  {areas.map((area) => (
                    <SelectItem key={area} value={area}>
                      {area}
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
                  {departments.map((dept) => (
                    <SelectItem key={dept} value={dept}>
                      {dept}
                    </SelectItem>
                  ))}
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
              <Select.Value
                placeholder={
                  filteredUsers.length === 0 ? "No users found" : "Select user"
                }
              />
              <Select.Icon>
                <ChevronDownIcon />
              </Select.Icon>
            </Select.Trigger>
            {filteredUsers.length > 0 && (
              <Select.Portal>
                <Select.Content className="bg-white border rounded shadow-md">
                  <Select.Viewport>
                    {filteredUsers.map((u) => (
                      <SelectItem key={u.id} value={u.firstName} >
                        {u.firstName} {u.lastName}
                      </SelectItem>
                    ))}
                  </Select.Viewport>
                </Select.Content>
              </Select.Portal>
            )}
          </Select.Root>
        </div>

        {/* Serial */}
        <div>
          <Label.Root className="text-lg font-light">Serial Number</Label.Root>
          <input
            value={formData.serial}
            onChange={(e) => handleChange("serial", e.target.value)}
            className="w-full border border-gray-500 shadow-md rounded px-2 py-1 mt-1"
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
            <span className="ml-2 text-sm text-gray-700">
              {formData.file.name}
            </span>
          )}
        </div>

        {/* Buttons */}
        <div className="col-span-2 flex gap-4">
          <button
            type="submit"
            className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg font-bold shadow-md"
          >
            Save Changes
          </button>
          <button
            type="button"
            onClick={handleCancel}
            className="flex-1 bg-gray-400 hover:bg-gray-500 text-white py-2 rounded-lg font-bold shadow-md"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
