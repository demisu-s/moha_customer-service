import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";

import { useDeviceContext } from "../../context/DeviceContext";
import { usePlantContext } from "../../context/PlantContext";
import { useDepartmentContext } from "../../context/DepartmentContext";
import { useUserContext } from "../../context/UserContext";

import DeviceCard2 from "../../components/dashboardComponents/DeviceCard2";

import {
  ADMIN_DASHBOARD_ROUTE,
  DASHBOARD_ROUTE,
  SUPERVISOR_DASHBOARD_ROUTE,
  SUPERVISOR_DEVICES_ROUTE,
} from "../../router/routeConstants";

export default function Devices() {
  const { devices, deleteDevice } = useDeviceContext();
  const { plants } = usePlantContext();
  const { departments, refreshDepartments } = useDepartmentContext();
  const { currentUser } = useUserContext();

  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [selectedPlant, setSelectedPlant] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("");

  const [showDialog, setShowDialog] = useState(false);
  const [deviceToDelete, setDeviceToDelete] = useState<string | null>(null);

  useEffect(() => {
    if (selectedPlant) {
      refreshDepartments(selectedPlant);
      setSelectedDepartment("");
    }
  }, [selectedPlant, refreshDepartments]);

  /* FILTER DEVICES */

  const filteredDevices = (devices ?? []).filter((d) => {
    const searchLower = search.toLowerCase();

    return (
      (
        d.deviceName?.toLowerCase().includes(searchLower) ||
        d.deviceType?.toLowerCase().includes(searchLower) ||
        d.serialNumber?.toLowerCase().includes(searchLower)
      ) &&
      (selectedDepartment
        ? d.department?._id === selectedDepartment
        : true) &&
      (selectedPlant
        ? d.plant?._id === selectedPlant
        : true)
    );
  });

  /* ROLE BASED NAVIGATION */

  const goToAddDevice = () => {
    if (currentUser?.role === "supervisor") {
      navigate(`${SUPERVISOR_DEVICES_ROUTE}/adddevice`);
    } else if (currentUser?.role === "admin") {
      navigate(`${ADMIN_DASHBOARD_ROUTE}/devices/adddevice`);
    } else if (currentUser?.role === "superadmin") {
      navigate(`${DASHBOARD_ROUTE}/devices/adddevice`);
    }
  };

  const goToEditDevice = (id: string) => {
    if (currentUser?.role === "supervisor") {
      navigate(`${SUPERVISOR_DEVICES_ROUTE}/devices/editDevice/${id}`);
    } else if (currentUser?.role === "admin") {
      navigate(`${ADMIN_DASHBOARD_ROUTE}/devices/editDevice/${id}`);
    } else if (currentUser?.role === "superadmin") {
      navigate(`${DASHBOARD_ROUTE}/devices/editDevice/${id}`);
    }
  };

  const goToDeviceDetails = (id: string) => {
  if (currentUser?.role === "supervisor") {
    navigate(`${SUPERVISOR_DASHBOARD_ROUTE}/devices/detail/${id}`);
  } 
  else if (currentUser?.role === "admin") {
    navigate(`${ADMIN_DASHBOARD_ROUTE}/devices/detail/${id}`);
  } 
  else if (currentUser?.role === "superadmin") {
    navigate(`${DASHBOARD_ROUTE}/devices/detail/${id}`);
  }
};

  return (
    <div className="max-w-6xl mx-auto">

      {/* TITLE */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800 pb-1">
          Device Management
        </h1>
        <p className="text-sm text-gray-400">
          Manage devices by plant and department efficiently.
        </p>
      </div>

      {/* SEARCH + FILTER */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-3 mb-4">

        <div className="flex items-center gap-2 w-full sm:max-w-md">

          <input
            type="text"
            placeholder="Search device..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full border rounded-md px-3 py-2 text-sm"
          />

          {/* FILTER DROPDOWN */}

          <DropdownMenu.Root>
            <DropdownMenu.Trigger asChild>
              <button className="px-3 py-2 border rounded-md text-sm hover:bg-gray-100">
                Filter
              </button>
            </DropdownMenu.Trigger>

            <DropdownMenu.Portal>
              <DropdownMenu.Content className="bg-white shadow-lg border rounded-md p-3 w-60 space-y-3">

                {/* PLANT */}
                <div>
                  <label className="text-xs text-gray-500">Plant</label>
                  <select
                    className="w-full border mt-1 px-2 py-1 rounded text-sm"
                    value={selectedPlant}
                    onChange={(e) => setSelectedPlant(e.target.value)}
                  >
                    <option value="">All</option>
                    {plants.map((plant) => (
                      <option key={plant._id} value={plant._id}>
                        {plant.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* DEPARTMENT */}
                <div>
                  <label className="text-xs text-gray-500">Department</label>
                  <select
                    className="w-full border mt-1 px-2 py-1 rounded text-sm"
                    value={selectedDepartment}
                    onChange={(e) => setSelectedDepartment(e.target.value)}
                    disabled={!selectedPlant}
                  >
                    <option value="">All</option>
                    {departments.map((dept) => (
                      <option key={dept._id} value={dept._id}>
                        {dept.name}
                      </option>
                    ))}
                  </select>
                </div>

              </DropdownMenu.Content>
            </DropdownMenu.Portal>
          </DropdownMenu.Root>

        </div>

        {/* ADD DEVICE BUTTON */}

        <button
          className="bg-black text-white px-4 py-2 rounded-md text-sm hover:shadow-md hover:scale-105 hover:bg-gray-400 transition"
          onClick={goToAddDevice}
        >
          + Add Device
        </button>

      </div>

      {/* DEVICE GRID */}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">

        {filteredDevices.length === 0 ? (
          <div className="col-span-full text-center text-gray-500 text-lg py-10">
            No devices found.
          </div>
        ) : (
          filteredDevices.map((device) => (
            <DeviceCard2
              key={device._id}
              id={device._id}
              deviceType={device.deviceType}
              serialNo={device.serialNumber}
              userName={
                device.user
                  ? `${device.user.firstName} ${device.user.lastName}`
                  : "Unassigned"
              }
              department={device.department?.name}
              plant={device.plant?.name}
              onEdit={goToEditDevice}
              onDetails={goToDeviceDetails}
              onDelete={(id) => {
                setDeviceToDelete(id);
                setShowDialog(true);
              }}
            />
          ))
        )}

      </div>

      {/* DELETE DIALOG */}

      {showDialog && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-80">

            <h2 className="text-lg mb-4">
              Are you sure you want to delete this device?
            </h2>

            <div className="flex justify-end gap-2">

              <button
                className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
                onClick={() => setShowDialog(false)}
              >
                Cancel
              </button>

              <button
                className="px-4 py-2 rounded bg-black text-white hover:bg-red-700"
                onClick={() => {
                  if (deviceToDelete) {
                    deleteDevice(deviceToDelete);
                  }
                  setShowDialog(false);
                  setDeviceToDelete(null);
                }}
              >
                Delete
              </button>

            </div>
          </div>
        </div>
      )}

    </div>
  );
}