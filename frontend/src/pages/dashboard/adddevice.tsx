import * as React from "react";
import { useState, useEffect, useMemo } from "react";
import * as Label from "@radix-ui/react-label";
import * as Select from "@radix-ui/react-select";
import { UploadIcon, ChevronDownIcon, CheckIcon } from "@radix-ui/react-icons";
import { useNavigate } from "react-router-dom";
import { useDeviceContext } from "../../context/DeviceContext";
import { useUserContext } from "../../context/UserContext";
import { usePlantContext } from "../../context/PlantContext";
import { useDepartmentContext } from "../../context/DepartmentContext";
import { PlantPayload, DepartmentPayload, User } from "../../api/global.types";
import { ADMIN_DASHBOARD_ROUTE, DASHBOARD_ROUTE, SUPERVISOR_DASHBOARD_ROUTE } from "../../router/routeConstants";

interface DeviceFormData {
  deviceType: "Printer" | "Laptop" | "Desktop" | "Scanner" | "Router" | "Switch" | "Other";
  name: string;
  serial: string;
  plant: PlantPayload | null;
  department: DepartmentPayload | null;
  user: User | null;
  area: string;
  image: string;
  file?: File | null;
}

const deviceTypes: DeviceFormData["deviceType"][] = [
  "Printer",
  "Laptop",
  "Desktop",
  "Scanner",
  "Router",
  "Switch",
  "Other",
];

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

const AddDevice = () => {
  const navigate = useNavigate();

  const { addDevice } = useDeviceContext();
  const { plants } = usePlantContext();
  const { departments, refreshDepartments } = useDepartmentContext();
  const { currentUser, users } = useUserContext();
  const [loading, setLoading] = React.useState(false);
  

  const [formData, setFormData] = useState<DeviceFormData>({
    deviceType: "Printer",
    name: "",
    serial: "",
    plant: null,
    department: null,
    user: null,
    area: "",
    image: "",
    file: null,
  });

  /* ROLE LOGIC */

  const isAdminOrSupervisor =
    currentUser?.role === "admin" ||
    currentUser?.role === "supervisor";

  /* AUTO SET PLANT */

  useEffect(() => {
    if (!currentUser || !isAdminOrSupervisor) return;

    const plantField = currentUser.department?.plant;

    const plantId =
      typeof plantField === "string"
        ? plantField
        : plantField?._id;

    const plantObj = plants.find((p) => p._id === plantId) || null;

    setFormData((prev) => ({
      ...prev,
      plant: plantObj,
    }));

    if (plantId) refreshDepartments(plantId);
  }, [currentUser, plants, refreshDepartments, isAdminOrSupervisor]);

  /* RESET DEPARTMENT WHEN PLANT CHANGES */

  useEffect(() => {
    if (!formData.plant) return;

    refreshDepartments(formData.plant._id);

    setFormData((prev) => ({
      ...prev,
      department: null,
      user: null,
    }));
  }, [formData.plant, refreshDepartments]);

  const handleChange = (field: keyof DeviceFormData, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  /* FILTER DEPARTMENTS */

  const filteredDepartments = useMemo(() => {
    if (!formData.plant) return [];

    return departments.filter((d) =>
      typeof d.plant === "string"
        ? d.plant === formData.plant?._id
        : d.plant?._id === formData.plant?._id
    );
  }, [departments, formData.plant]);

  /* FILTER USERS */

  const filteredUsers = useMemo(() => {
    if (!formData.department || !formData.plant) return [];

    return users.filter((u) => {
      const sameDepartment =
        u.department?._id === formData.department?._id;

      const userPlant =
        typeof u.department?.plant === "string"
          ? u.department?.plant
          : u.department?.plant?._id;

      const samePlant = userPlant === formData.plant?._id;

      return sameDepartment && samePlant;
    });
  }, [users, formData.department, formData.plant]);

  const handleSubmit = async () => {
  setLoading(true);

  try {
    if (!formData.user || !formData.department || !formData.plant) {
      alert("Please select valid user, department, and plant.");
      return;
    }

    const newDevice = {
      deviceName: formData.name,
      deviceType: formData.deviceType,
      deviceId: `DEV-${Date.now()}`,
      serialNumber: formData.serial,
      plant: formData.plant._id,
      department: formData.department._id,
      user: formData.user._id,
      area: formData.area,
      image: formData.image,
    };

    // ✅ CREATE DEVICE
    await addDevice(newDevice);

    // ✅ ROLE BASED REDIRECT
    if (currentUser?.role === "supervisor") {
      navigate(`${SUPERVISOR_DASHBOARD_ROUTE}/devices`);
    } else if (currentUser?.role === "admin") {
      navigate(`${ADMIN_DASHBOARD_ROUTE}/devices`);
    } else if (currentUser?.role === "superadmin") {
      navigate(`${DASHBOARD_ROUTE}/devices`);
    }

  } catch (error) {
    console.error("Failed to create device:", error);
    alert("Device creation failed");
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="max-w-4xl mx-auto mt-8 p-6 border rounded-md shadow-md">
      <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
        Add Device
      </h2>

      <div className="grid grid-cols-2 gap-8">

        {/* Device Type */}
        <div>
          <Label.Root className="text-lg font-light">Device Type</Label.Root>
          <Select.Root
            value={formData.deviceType}
            onValueChange={(value) => handleChange("deviceType", value)}
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
            placeholder="Enter device name"
          />
        </div>

        {/* Plant */}
        <div>
          <Label.Root className="text-lg font-light">Plant</Label.Root>
          <Select.Root
            value={formData.plant?._id || ""}
            onValueChange={(value) => {
              const selected = plants.find((p) => p._id === value) || null;
              handleChange("plant", selected);
            }}
            disabled={isAdminOrSupervisor}
          >
            <Select.Trigger className="inline-flex items-center justify-between border border-gray-500 shadow-md w-full px-2 py-1 rounded mt-1">
              <Select.Value placeholder="Select Plant" />
              <Select.Icon>
                <ChevronDownIcon />
              </Select.Icon>
            </Select.Trigger>

            <Select.Portal>
              <Select.Content className="bg-white border rounded shadow-md">
                <Select.Viewport>
                  {plants.map((p) => (
                    <SelectItem key={p._id} value={p._id}>
                      {p.name}
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
            value={formData.department?._id || ""}
            onValueChange={(value) => {
              const selected =
                filteredDepartments.find((d) => d._id === value) || null;
              handleChange("department", selected);
            }}
            disabled={!formData.plant}
          >
            <Select.Trigger className="inline-flex items-center justify-between border border-gray-500 shadow-md w-full px-2 py-1 rounded mt-1">
              <Select.Value placeholder="Select Department" />
              <Select.Icon>
                <ChevronDownIcon />
              </Select.Icon>
            </Select.Trigger>

            <Select.Portal>
              <Select.Content className="bg-white border rounded shadow-md">
                <Select.Viewport>
                  {filteredDepartments.map((d) => (
                    <SelectItem key={d._id} value={d._id}>
                      {d.name}
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
            value={formData.user?._id || ""}
            onValueChange={(value) => {
              const selected =
                filteredUsers.find((u) => u._id === value) || null;
              handleChange("user", selected);
            }}
            disabled={!formData.department}
          >
            <Select.Trigger className="inline-flex items-center justify-between border border-gray-500 shadow-md w-full px-2 py-1 rounded mt-1">
              <Select.Value
                placeholder={
                  filteredUsers.length === 0
                    ? "No users found"
                    : "Select user"
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
                      <SelectItem key={u._id} value={u._id}>
                        {u.firstName} {u.lastName}
                      </SelectItem>
                    ))}
                  </Select.Viewport>
                </Select.Content>
              </Select.Portal>
            )}
          </Select.Root>

          {filteredUsers.length === 0 && (
            <div className="text-sm text-red-500 mt-1">
              No users found for this department and plant.
            </div>
          )}
        </div>

        {/* Serial Number */}
        <div>
          <Label.Root className="text-lg font-light">Serial Number</Label.Root>
          <input
            value={formData.serial}
            onChange={(e) => handleChange("serial", e.target.value)}
            className="w-full border border-gray-500 shadow-md rounded px-2 py-1 mt-1"
            placeholder="Enter serial number"
          />
        </div>

        {/* Image Upload */}
        <div className="col-span-2">
          <Label.Root className="text-lg font-light mr-5">
            Upload Image
          </Label.Root>

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
                  reader.onload = (ev) =>
                    handleChange("image", ev.target?.result as string);
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

      </div>

      <button
        className="w-full bg-primary-500 text-lg hover:bg-primary-900 text-white mt-6 py-1 rounded-lg font-bold shadow-md transition duration-200 hover:scale-105"
        onClick={handleSubmit}
      >
        Add Device
      </button>
    </div>
  );
};

export default AddDevice;