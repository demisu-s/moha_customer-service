import React, {
  useEffect,
  useMemo,
  useState,
} from "react";

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
  SUPERVISOR_DEVICES_ROUTE,
} from "../../router/routeConstants";

export default function AssignedDevices() {
  const { devices } = useDeviceContext();

  const { plants } = usePlantContext();

  const { departments, refreshDepartments } =
    useDepartmentContext();

  const { currentUser } = useUserContext();

  const navigate = useNavigate();

  /* ================= STATES ================= */

  const [search, setSearch] = useState("");

  const [selectedPlant, setSelectedPlant] =
    useState("");

  const [
    selectedDepartment,
    setSelectedDepartment,
  ] = useState("");

  /* ================= LOAD DEPARTMENTS ================= */

  useEffect(() => {
    if (selectedPlant) {
      refreshDepartments(selectedPlant);

      setSelectedDepartment("");
    }
  }, [selectedPlant, refreshDepartments]);

  /* ================= FILTER DEVICES ================= */

  const assignedDevices = useMemo(() => {
    return devices.filter((d) => {
      // only assigned devices
      if (!d.user) return false;

      const searchLower =
        search.toLowerCase();

      const fullName =
        `${d.user?.firstName} ${d.user?.lastName}`.toLowerCase();

      return (
        (
          d.deviceType
            ?.toLowerCase()
            .includes(searchLower) ||

          d.serialNumber
            ?.toLowerCase()
            .includes(searchLower) ||

          fullName.includes(searchLower)
        ) &&
        (selectedPlant
          ? d.plant?._id === selectedPlant
          : true) &&
        (selectedDepartment
          ? d.department?._id ===
            selectedDepartment
          : true)
      );
    });
  }, [
    devices,
    search,
    selectedPlant,
    selectedDepartment,
  ]);

  /* ================= NAVIGATION ================= */

  const goToEditDevice = (id: string) => {
    if (currentUser?.role === "supervisor") {
      navigate(
        `${SUPERVISOR_DEVICES_ROUTE}/editDevice/${id}`
      );
    } else if (currentUser?.role === "admin") {
      navigate(
        `${ADMIN_DASHBOARD_ROUTE}/devices/editDevice/${id}`
      );
    } else if (
      currentUser?.role === "superadmin"
    ) {
      navigate(
        `${DASHBOARD_ROUTE}/devices/editDevice/${id}`
      );
    }
  };

  const goToDeviceDetails = (
    id: string
  ) => {
    if (currentUser?.role === "supervisor") {
      navigate(
        `${SUPERVISOR_DEVICES_ROUTE}/detail/${id}`
      );
    } else if (currentUser?.role === "admin") {
      navigate(
        `${ADMIN_DASHBOARD_ROUTE}/devices/detail/${id}`
      );
    } else if (
      currentUser?.role === "superadmin"
    ) {
      navigate(
        `${DASHBOARD_ROUTE}/devices/detail/${id}`
      );
    }
  };

  return (
    <div className="max-w-7xl mx-auto">

      {/* HEADER */}

      <div className="mb-6">
        <h1 className="text-3xl font-bold">
          Assigned Devices
        </h1>
      </div>

      {/* SEARCH + FILTER */}

      <div className="flex flex-col lg:flex-row justify-between gap-4 mb-6">

        <div className="flex items-center gap-2">

          {/* SEARCH */}

          <input
            type="text"
            placeholder="Search assigned device..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            className="border rounded-md px-3 py-2 text-sm w-72"
          />

          {/* FILTER */}

          <DropdownMenu.Root>

            <DropdownMenu.Trigger asChild>
              <button className="px-4 py-2 border rounded-md">
                Filter
              </button>
            </DropdownMenu.Trigger>

            <DropdownMenu.Portal>

              <DropdownMenu.Content className="bg-white border shadow-md rounded-md p-4 w-60 space-y-4">

                {/* PLANT */}

                <div>
                  <label className="text-xs text-gray-500">
                    Plant
                  </label>

                  <select
                    className="w-full border rounded px-2 py-1 mt-1 text-sm"
                    value={selectedPlant}
                    onChange={(e) =>
                      setSelectedPlant(
                        e.target.value
                      )
                    }
                  >
                    <option value="">
                      All
                    </option>

                    {plants.map((plant) => (
                      <option
                        key={plant._id}
                        value={plant._id}
                      >
                        {plant.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* DEPARTMENT */}

                <div>
                  <label className="text-xs text-gray-500">
                    Department
                  </label>

                  <select
                    className="w-full border rounded px-2 py-1 mt-1 text-sm"
                    value={selectedDepartment}
                    onChange={(e) =>
                      setSelectedDepartment(
                        e.target.value
                      )
                    }
                    disabled={!selectedPlant}
                  >
                    <option value="">
                      All
                    </option>

                    {departments.map((dept) => (
                      <option
                        key={dept._id}
                        value={dept._id}
                      >
                        {dept.name}
                      </option>
                    ))}
                  </select>
                </div>

              </DropdownMenu.Content>

            </DropdownMenu.Portal>

          </DropdownMenu.Root>

        </div>

      </div>

      {/* DEVICE GRID */}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">

        {assignedDevices.length > 0 ? (
          assignedDevices.map((device) => (
            <DeviceCard2
              key={device._id}
               image={device.image}
              id={device._id}
              deviceType={device.deviceType}
              serialNo={device.serialNumber}
              userName={`${device.user?.firstName} ${device.user?.lastName}`}
              department={
                device.department?.name
              }
              plant={device.plant?.name}

              // IMPORTANT
              onEdit={goToEditDevice}

              onDetails={
                goToDeviceDetails
              }
            />
          ))
        ) : (
          <div className="col-span-full text-center py-10 text-gray-500">
            No assigned devices found.
          </div>
        )}

      </div>

    </div>
  );
}