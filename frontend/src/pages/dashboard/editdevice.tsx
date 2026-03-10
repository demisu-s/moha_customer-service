import * as React from "react";
import * as Label from "@radix-ui/react-label";
import * as Select from "@radix-ui/react-select";
import { UploadIcon, ChevronDownIcon, CheckIcon } from "@radix-ui/react-icons";
import { useNavigate, useParams } from "react-router-dom";

import { useDeviceContext } from "../../context/DeviceContext";
import { useUserContext } from "../../context/UserContext";

import {
  SUPERVISOR_DEVICES_ROUTE,
  ADMIN_DEVICES_ROUTE,
  DASHBOARD_ROUTE,
} from "../../router/routeConstants";
import {Device} from "../../api/global.types";

/* -------------------- Types -------------------- */

interface DeviceFormData {
  deviceName: string;
  deviceType:
    | "Printer"
    | "Laptop"
    | "Desktop"
    | "Scanner"
    | "Router"
    | "Switch"
    | "Other";
  serialNumber: string;
  plantId: string;
  departmentId: string;
  userId: string;
  image?: string;
  file?: File | null;
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

const EditDevice: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { devices, updateDevice } = useDeviceContext();

  const { users, plants, departments, loadDepartments, currentUser } =
    useUserContext();

  const deviceTypes = [
    "Printer",
    "Laptop",
    "Desktop",
    "Scanner",
    "Router",
    "Switch",
    "Other",
  ] as const;

  const deviceToEdit = devices?.find((d) => d._id === id);

  const [loading, setLoading] = React.useState(false);

  const [formData, setFormData] = React.useState<DeviceFormData>({
    deviceName: "",
    deviceType: "Other",
    serialNumber: "",
    plantId: "",
    departmentId: "",
    userId: "",
    image: "",
    file: null,
  });

  /* -------------------- Initialize Form -------------------- */

  React.useEffect(() => {
    if (!deviceToEdit) return;

    setFormData({
      deviceName: deviceToEdit.deviceName,
      deviceType: deviceToEdit.deviceType,
      serialNumber: deviceToEdit.serialNumber,

      plantId:
        typeof deviceToEdit.plant === "string"
          ? deviceToEdit.plant
          : deviceToEdit.plant?._id || "",

      departmentId:
        typeof deviceToEdit.department === "string"
          ? deviceToEdit.department
          : deviceToEdit.department?._id || "",

      userId:
        typeof deviceToEdit.user === "string"
          ? deviceToEdit.user
          : deviceToEdit.user?._id || "",

      image: deviceToEdit.image || "",
      file: null,
    });
  }, [deviceToEdit]);

  /* -------------------- Load Departments -------------------- */

  React.useEffect(() => {
    if (formData.plantId) {
      loadDepartments(formData.plantId);
    }
  }, [formData.plantId, loadDepartments]);

  /* -------------------- Filter Departments -------------------- */

  const filteredDepartments = React.useMemo(() => {
    return departments.filter((d) =>
      typeof d.plant === "string"
        ? d.plant === formData.plantId
        : d.plant?._id === formData.plantId
    );
  }, [departments, formData.plantId]);

  /* -------------------- Filter Users -------------------- */

  const filteredUsers = React.useMemo(() => {
    if (!formData.departmentId) return [];

    return users.filter((u) => {
      const depId = u.department?._id;

      const plantId =
        typeof u.department?.plant === "string"
          ? u.department.plant
          : u.department?.plant?._id;

      return (
        depId === formData.departmentId &&
        plantId === formData.plantId
      );
    });
  }, [users, formData.departmentId, formData.plantId]);

  /* -------------------- Change Handler -------------------- */

  const handleChange = <K extends keyof DeviceFormData>(
    field: K,
    value: DeviceFormData[K]
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  /* -------------------- Submit -------------------- */

  const handleSubmit = async () => {
    if (!deviceToEdit) return;

    setLoading(true);

    try {
      const selectedPlant = plants.find((p) => p._id === formData.plantId);

      const selectedDepartment = departments.find(
        (d) => d._id === formData.departmentId
      );

      const selectedUser = users.find((u) => u._id === formData.userId);

      if (!selectedPlant || !selectedDepartment || !selectedUser) {
        console.error("Missing plant, department, or user");
        return;
      }

      await updateDevice(deviceToEdit._id, {
        deviceName: formData.deviceName,
        deviceType: formData.deviceType,
        serialNumber: formData.serialNumber,
        plant: selectedPlant,
        department: selectedDepartment,
        user: selectedUser,
        image: formData.image,
      });

      if (currentUser?.role === "supervisor") {
        navigate(SUPERVISOR_DEVICES_ROUTE);
      } else if (currentUser?.role === "admin") {
        navigate(ADMIN_DEVICES_ROUTE);
      } else {
        navigate(`${DASHBOARD_ROUTE}/devices`);
      }
    } catch (error) {
      console.error("Update device failed:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => navigate("/dashboard/devices");

  if (!deviceToEdit) {
    return <div className="text-center mt-8">Device not found</div>;
  }

  /* -------------------- UI -------------------- */

  return (
    <div className="max-w-4xl mx-auto mt-8 p-6 border rounded-md shadow-md">

      <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
        Edit Device
      </h2>

      <div className="grid grid-cols-2 gap-8">

        {/* Device Type */}

        <div>
          <Label.Root>Device Type</Label.Root>

          <Select.Root
            value={formData.deviceType}
            onValueChange={(v) =>
              handleChange("deviceType", v as DeviceFormData["deviceType"])
            }
          >
            <Select.Trigger className="border w-full px-2 py-1 rounded mt-1 flex justify-between">
              <Select.Value />
              <ChevronDownIcon />
            </Select.Trigger>

            <Select.Content className="bg-white border rounded shadow-md">
              <Select.Viewport>
                {deviceTypes.map((t) => (
                  <SelectItem key={t} value={t}>
                    {t}
                  </SelectItem>
                ))}
              </Select.Viewport>
            </Select.Content>
          </Select.Root>
        </div>

        {/* Device Name */}

        <div>
          <Label.Root>Device Name</Label.Root>

          <input
            value={formData.deviceName}
            onChange={(e) =>
              handleChange("deviceName", e.target.value)
            }
            className="w-full border rounded px-2 py-1 mt-1"
          />
        </div>

        {/* Plant */}

        <div>
          <Label.Root>Plant</Label.Root>

          <Select.Root
            value={formData.plantId}
            onValueChange={(v) => handleChange("plantId", v)}
            disabled={currentUser?.role !== "superadmin"}
          >
            <Select.Trigger className="border w-full px-2 py-1 rounded mt-1 flex justify-between">
              <Select.Value placeholder="Select Plant" />
              <ChevronDownIcon />
            </Select.Trigger>

            <Select.Content className="bg-white border rounded shadow-md">
              <Select.Viewport>
                {plants.map((p) => (
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
            onValueChange={(v) => handleChange("departmentId", v)}
            disabled={!formData.plantId}
          >
            <Select.Trigger className="border w-full px-2 py-1 rounded mt-1 flex justify-between">
              <Select.Value placeholder="Select Department" />
              <ChevronDownIcon />
            </Select.Trigger>

            <Select.Content className="bg-white border rounded shadow-md">
              <Select.Viewport>
                {filteredDepartments.map((d) => (
                  <SelectItem key={d._id} value={d._id}>
                    {d.name}
                  </SelectItem>
                ))}
              </Select.Viewport>
            </Select.Content>
          </Select.Root>
        </div>

        {/* Serial */}

        <div>
          <Label.Root>Serial Number</Label.Root>

          <input
            value={formData.serialNumber}
            onChange={(e) =>
              handleChange("serialNumber", e.target.value)
            }
            className="w-full border rounded px-2 py-1 mt-1"
          />
        </div>

        {/* User */}

        <div>
          <Label.Root>User</Label.Root>

          <Select.Root
            value={formData.userId}
            onValueChange={(v) => handleChange("userId", v)}
          >
            <Select.Trigger className="border w-full px-2 py-1 rounded mt-1 flex justify-between">
              <Select.Value placeholder="Select User" />
              <ChevronDownIcon />
            </Select.Trigger>

            <Select.Content className="bg-white border rounded shadow-md">
              <Select.Viewport>
                {filteredUsers.map((u) => (
                  <SelectItem key={u._id} value={u._id}>
                    {u.firstName} {u.lastName}
                  </SelectItem>
                ))}
              </Select.Viewport>
            </Select.Content>
          </Select.Root>
        </div>

        {/* Upload */}

        <div className="col-span-2">
          <Label.Root>Upload Image</Label.Root>

          <label className="inline-flex items-center gap-2 border px-3 py-2 rounded cursor-pointer mt-1">
            <UploadIcon /> Upload

            <input
              hidden
              type="file"
              onChange={(e) => {
                const file = e.target.files?.[0] ?? null;

                handleChange("file", file);

                if (file) {
                  const reader = new FileReader();

                  reader.onload = (ev) =>
                    handleChange("image", ev.target?.result as string);

                  reader.readAsDataURL(file);
                }
              }}
            />
          </label>
        </div>
      </div>

      {/* Buttons */}

      <div className="flex gap-4 mt-6">

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-1/2 py-2 bg-blue-600 text-white rounded font-bold disabled:opacity-50"
        >
          {loading ? "Updating..." : "Save Changes"}
        </button>

        <button
          onClick={handleCancel}
          className="w-1/2 py-2 bg-gray-400 text-white rounded font-bold"
        >
          Cancel
        </button>

      </div>
    </div>
  );
};

export default EditDevice;