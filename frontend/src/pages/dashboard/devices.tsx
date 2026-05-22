import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import * as XLSX from "xlsx";

import { useDeviceContext } from "../../context/DeviceContext";
import { usePlantContext } from "../../context/PlantContext";
import { useDepartmentContext } from "../../context/DepartmentContext";
import { useUserContext } from "../../context/UserContext";
import { getDepartmentsByPlant } from "../../api/department.api";

import DeviceTable from "../../components/deviceComponents/DeviceTable";

import {
  ADMIN_DASHBOARD_ROUTE,
  DASHBOARD_ROUTE,
  SUPERVISOR_DEVICES_ROUTE,
} from "../../router/routeConstants";

import { CreateDevicePayload, Device } from "../../api/global.types";

import LoadingDialog from "../../components/ui/LoadingDialog";
import ErrorDialog from "../../components/ui/ErrorDialog";
import SuccessDialog from "../../components/ui/SuccessDialog";

export default function Devices() {
  const { devices, deleteDevice, addDevice } =
    useDeviceContext();

  const { plants } = usePlantContext();

  const {
    departments,
    refreshDepartments,
  } = useDepartmentContext();

  const { currentUser, users } =
    useUserContext();

  const navigate = useNavigate();

  const [search, setSearch] = useState("");

  const [selectedPlant, setSelectedPlant] =
    useState("");

  const [
    selectedDepartment,
    setSelectedDepartment,
  ] = useState("");

  const [currentPage, setCurrentPage] =
    useState(1);

  const devicesPerPage = 10;

  const [showDialog, setShowDialog] =
    useState(false);

  const [deviceToDelete, setDeviceToDelete] =
    useState<string | null>(null);

  // ================= UI STATES =================

  const [loading, setLoading] =
    useState(false);

  const [successOpen, setSuccessOpen] =
    useState(false);

  const [errorOpen, setErrorOpen] =
    useState(false);

  const [dialogMessage, setDialogMessage] =
    useState("");

  // ================= LOAD DEPARTMENTS =================

  useEffect(() => {
    if (selectedPlant) {
      refreshDepartments(selectedPlant);

      setSelectedDepartment("");
    }
  }, [selectedPlant, refreshDepartments]);

  // ================= FILTER =================

  const filteredDevices = useMemo(() => {
    return (devices ?? []).filter((d) => {
      const searchLower =
        search.toLowerCase();

      return (
        (d.deviceName
          ?.toLowerCase()
          .includes(searchLower) ||
          d.deviceType
            ?.toLowerCase()
            .includes(searchLower) ||
          d.serialNumber
            ?.toLowerCase()
            .includes(searchLower)) &&
        (selectedDepartment
          ? d.department?._id ===
            selectedDepartment
          : true) &&
        (selectedPlant
          ? d.plant?._id === selectedPlant
          : true)
      );
    });
  }, [
    devices,
    search,
    selectedPlant,
    selectedDepartment,
  ]);

  // ================= PAGINATION =================

  const totalDevices =
    filteredDevices.length;

  const startIndex =
    (currentPage - 1) * devicesPerPage;

  const endIndex = Math.min(
    startIndex + devicesPerPage,
    totalDevices
  );

  const paginatedDevices =
    filteredDevices.slice(
      startIndex,
      endIndex
    );

  useEffect(() => {
    if (
      startIndex >= filteredDevices.length &&
      currentPage !== 1
    ) {
      setCurrentPage(1);
    }
  }, [
    filteredDevices,
    startIndex,
    currentPage,
  ]);

  // ================= EXPORT =================

  const exportToExcel = () => {
    const data = filteredDevices.map(
      (d) => ({
        Name: d.deviceName,
        Type: d.deviceType,
        Serial: d.serialNumber,
        Plant: d.plant?.name,
        Department: d.department?.name,
        User: d.user
          ? `${d.user.firstName} ${d.user.lastName}`
          : "Unassigned",
      })
    );

    const ws =
      XLSX.utils.json_to_sheet(data);

    const wb = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(
      wb,
      ws,
      "Devices"
    );

    XLSX.writeFile(wb, "devices.xlsx");
  };

  // ================= IMPORT =================

  const importFromExcel = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];

    if (!file) return;

    setLoading(true);

    try {
      const data =
        await file.arrayBuffer();

      const workbook = XLSX.read(data);

      const sheetName =
        workbook.SheetNames[0];

      const jsonData: any[] =
        XLSX.utils.sheet_to_json(
          workbook.Sheets[sheetName]
        );

      let successCount = 0;

      const failedRows: string[] = [];

      for (const item of jsonData) {
        try {
          // ================= EXCEL VALUES =================

          const deviceName =
            item.Name?.toString().trim() ||
            "";

          const deviceType =
            item.Type?.toString().trim() ||
            "";

          const serialNumber =
            item.Serial?.toString().trim() ||
            "";

          const plantName =
            item.Plant?.toString().trim() ||
            "";

          const departmentName =
            item.Department
              ?.toString()
              .trim() || "";

          const excelUser =
            item.User?.toString().trim() ||
            "";

          // ================= VALIDATION =================

          if (
            !deviceName ||
            !deviceType ||
            !serialNumber ||
            !plantName ||
            !departmentName
          ) {
            failedRows.push(
              `${
                deviceName ||
                "Unknown Device"
              } -> Missing required fields`
            );

            continue;
          }

          // ================= FIND PLANT =================

          const matchedPlant =
            plants.find(
              (p) =>
                p.name
                  .trim()
                  .toLowerCase() ===
                plantName
                  .trim()
                  .toLowerCase()
            );

          if (!matchedPlant) {
            failedRows.push(
              `${deviceName} -> Plant not found (${plantName})`
            );

            continue;
          }

          // ================= ACCESS CONTROL =================

          if (
            currentUser?.role !==
              "superadmin" &&
            typeof currentUser
              ?.department?.plant ===
              "object" &&
            currentUser.department.plant
              ._id !== matchedPlant._id
          ) {
            failedRows.push(
              `${deviceName} -> You cannot import devices to another plant`
            );

            continue;
          }

          // ================= LOAD DEPARTMENTS =================

          const plantDepartments =
            await getDepartmentsByPlant(
              matchedPlant._id
            );

          // ================= FIND DEPARTMENT =================

          const matchedDepartment =
            plantDepartments.find(
              (d: any) =>
                d.name
                  .trim()
                  .toLowerCase() ===
                departmentName
                  .trim()
                  .toLowerCase()
            );

          if (!matchedDepartment) {
            failedRows.push(
              `${deviceName} -> Department not found (${departmentName})`
            );

            continue;
          }

          // ================= FIND USER =================

          let matchedUser = null;

          if (
            excelUser &&
            excelUser
              .toLowerCase()
              .trim() !== "unassigned"
          ) {
            const normalizedExcelUser =
              excelUser
                .toLowerCase()
                .trim();

            matchedUser =
              users.find((u) => {
                const fullName =
                  `${
                    u.firstName || ""
                  } ${
                    u.lastName || ""
                  }`
                    .toLowerCase()
                    .trim();

                const userId =
                  u.userId
                    ?.toLowerCase()
                    .trim() || "";

                return (
                  userId ===
                    normalizedExcelUser ||
                  fullName ===
                    normalizedExcelUser
                );
              }) || null;

            // USER NOT FOUND -> UNASSIGNED
            if (!matchedUser) {
              console.warn(
                `User not found for device ${deviceName}: ${excelUser}`
              );
            }
          }

          // ================= PAYLOAD =================

          const payload: CreateDevicePayload =
            {
              deviceName,

              deviceType,

              serialNumber,

              deviceId: `DEV-${Date.now()}-${Math.floor(
                Math.random() * 10000
              )}`,

              plant: matchedPlant._id,

              department:
                matchedDepartment._id,

              user: matchedUser
                ? matchedUser._id
                : null,

              image: "",
            };

          await addDevice(
            payload as unknown as Omit<
              Device,
              "_id"
            >
          );

          successCount++;
        } catch (err: any) {
          console.error(err);

          failedRows.push(
            `${item.Name || "Unknown"} -> ${
              err?.response?.data
                ?.message ||
              err.message ||
              "Failed to create device"
            }`
          );
        }
      }

      // ================= SUCCESS / ERROR DIALOG =================

      let message = `loading completed.\n\n`;

      message += `Success: ${successCount}\n`;

      message += `Failed: ${failedRows.length}\n`;

      if (failedRows.length > 0) {
        message += `\nFailure Reasons:\n`;

        message += failedRows.join("\n");
      }

      setDialogMessage(message);

      if (failedRows.length > 0) {
        setErrorOpen(true);
      } else {
        setSuccessOpen(true);
      }
    } catch (err) {
      console.error(err);

      setDialogMessage(
        "Failed to read Excel file."
      );

      setErrorOpen(true);
    } finally {
      setLoading(false);

      e.target.value = "";
    }
  };

  // ================= NAVIGATION =================

  const goToAddDevice = () => {
    if (
      currentUser?.role ===
      "supervisor"
    ) {
      navigate(
        `${SUPERVISOR_DEVICES_ROUTE}/adddevice`
      );
    } else if (
      currentUser?.role === "admin"
    ) {
      navigate(
        `${ADMIN_DASHBOARD_ROUTE}/devices/adddevice`
      );
    } else if (
      currentUser?.role ===
      "superadmin"
    ) {
      navigate(
        `${DASHBOARD_ROUTE}/devices/adddevice`
      );
    }
  };

  const goToEditDevice = (
    id: string
  ) => {
    if (
      currentUser?.role ===
      "supervisor"
    ) {
      navigate(
        `${SUPERVISOR_DEVICES_ROUTE}/editDevice/${id}`
      );
    } else if (
      currentUser?.role === "admin"
    ) {
      navigate(
        `${ADMIN_DASHBOARD_ROUTE}/devices/editDevice/${id}`
      );
    } else if (
      currentUser?.role ===
      "superadmin"
    ) {
      navigate(
        `${DASHBOARD_ROUTE}/devices/editDevice/${id}`
      );
    }
  };

  const goToDeviceDetails = (
    id: string
  ) => {
    if (
      currentUser?.role ===
      "supervisor"
    ) {
      navigate(
        `${SUPERVISOR_DEVICES_ROUTE}/detail/${id}`
      );
    } else if (
      currentUser?.role === "admin"
    ) {
      navigate(
        `${ADMIN_DASHBOARD_ROUTE}/devices/detail/${id}`
      );
    } else if (
      currentUser?.role ===
      "superadmin"
    ) {
      navigate(
        `${DASHBOARD_ROUTE}/devices/detail/${id}`
      );
    }
  };

  // ================= DELETE =================

  const handleDelete = async () => {
    if (!deviceToDelete) return;

    try {
      setLoading(true);

      await deleteDevice(deviceToDelete);

      setShowDialog(false);

      setDeviceToDelete(null);

      setDialogMessage(
        "Device deleted successfully."
      );

      setSuccessOpen(true);
    } catch (err) {
      console.error(err);

      setDialogMessage(
        "Failed to delete device."
      );

      setErrorOpen(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      {/* LOADING */}
      <LoadingDialog open={loading} />

      {/* SUCCESS */}
      <SuccessDialog
        open={successOpen}
        onOpenChange={setSuccessOpen}
        message={dialogMessage}
      />

      {/* ERROR */}
      <ErrorDialog
        open={errorOpen}
        onOpenChange={setErrorOpen}
        message={dialogMessage}
      />

      {/* HEADER */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold">
          Device Management
        </h1>
      </div>

      {/* SEARCH + FILTER */}
      <div className="flex flex-col lg:flex-row justify-between gap-4 mb-6">
        <div className="flex items-center gap-2">
          <input
            type="text"
            placeholder="Search device..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            className="border rounded-md px-3 py-2 text-sm w-72"
          />

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
                    value={
                      selectedDepartment
                    }
                    onChange={(e) =>
                      setSelectedDepartment(
                        e.target.value
                      )
                    }
                    disabled={
                      !selectedPlant
                    }
                  >
                    <option value="">
                      All
                    </option>

                    {departments.map(
                      (dept) => (
                        <option
                          key={dept._id}
                          value={
                            dept._id
                          }
                        >
                          {dept.name}
                        </option>
                      )
                    )}
                  </select>
                </div>
              </DropdownMenu.Content>
            </DropdownMenu.Portal>
          </DropdownMenu.Root>
        </div>

        {/* ACTIONS */}

        <div className="flex gap-2 flex-wrap">
          <label className="px-4 py-2 border rounded-md text-sm cursor-pointer hover:bg-gray-100">
            Import

            <input
              type="file"
              accept=".xlsx,.xls"
              hidden
              onChange={
                importFromExcel
              }
            />
          </label>

          <button
            className="px-4 py-2 border rounded-md text-sm cursor-pointer hover:bg-gray-100"
            onClick={exportToExcel}
          >
            Export
          </button>

          <button
            className="px-4 py-2 border rounded-md text-sm cursor-pointer hover:bg-gray-100"
            onClick={goToAddDevice}
          >
            + Add Device
          </button>
        </div>
      </div>

      {/* TABLE */}

      <DeviceTable
        devices={paginatedDevices}
        onEdit={goToEditDevice}
        onDetails={
          goToDeviceDetails
        }
        onDelete={(id) => {
          setDeviceToDelete(id);

          setShowDialog(true);
        }}
      />

      {/* PAGINATION */}

      <div className="flex justify-between items-center mt-4 px-2 text-sm text-gray-600">
        <span>
          Showing{" "}
          {totalDevices === 0
            ? 0
            : startIndex + 1}
          –{endIndex} of{" "}
          {totalDevices}
        </span>

        <div className="space-x-2">
          <button
            onClick={() =>
              setCurrentPage((p) =>
                Math.max(p - 1, 1)
              )
            }
            disabled={
              currentPage === 1
            }
            className="px-3 py-1 border rounded-md"
          >
            Previous
          </button>

          <button
            onClick={() =>
              setCurrentPage((p) =>
                endIndex <
                totalDevices
                  ? p + 1
                  : p
              )
            }
            disabled={
              endIndex >=
              totalDevices
            }
            className="px-3 py-1 border rounded-md"
          >
            Next
          </button>
        </div>
      </div>

      {/* DELETE MODAL */}

      {showDialog && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl w-80 shadow-lg">
            <h2 className="text-lg font-semibold">
              Delete Device?
            </h2>

            <p className="text-sm text-gray-500 mt-2">
              Are you sure you want to
              delete this device?
            </p>

            <div className="flex justify-end gap-2 mt-6">
              <button
                onClick={() =>
                  setShowDialog(false)
                }
                className="px-4 py-2 border rounded-md"
              >
                Cancel
              </button>

              <button
              disabled
                onClick={handleDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
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