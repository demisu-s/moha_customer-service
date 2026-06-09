import React, { useMemo, useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@radix-ui/themes";

import { useDeviceContext } from "../../context/DeviceContext";
import { useServiceRequests } from "../../context/ServiceRequestContext";

import { IoArrowBack } from "react-icons/io5";

import {
  FiCpu,
  FiUser,
  FiHash,
  FiGrid,
  FiTool,
  FiCalendar,
} from "react-icons/fi";

import LoadingDialog from "../../components/ui/LoadingDialog";
import ErrorDialog from "../../components/ui/ErrorDialog";
import { getImageUrl } from "../../utils/image";

const DeviceDetail: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { devices } = useDeviceContext();
  const { requests } = useServiceRequests();

  const [showError, setShowError] = useState(false);

  // FIND DEVICE
  const device = devices.find((dev) => dev._id === id);

  // LOADING STATE
  const isLoading = devices.length === 0;

  // FIXED HOOK ORDER
  const repairHistory = useMemo(() => {
    if (!device) return [];

    return requests
      .filter(
        (r) =>
          r.deviceId === device._id &&
          r.status === "Resolved"
      )
      .map((r, index) => ({
        sn: index + 1,
        deviceName: device.deviceName,
        solvedBy: r.assignedToName || "Technician",
        solvedDate: r.resolvedDate || r.createdAt,
      }));
  }, [requests, device]);

  // HANDLE ERROR DIALOG
  useEffect(() => {
    if (!isLoading && !device) {
      setShowError(true);
    }
  }, [isLoading, device]);

  // LOADING UI
  if (isLoading) {
    return (
      <LoadingDialog
        open={true}
        message="Loading device details..."
      />
    );
  }

  // ERROR UI
  if (!device) {
    return (
      <>
        <ErrorDialog
          open={showError}
          onOpenChange={(open) => {
            setShowError(open);

            if (!open) {
              navigate(-1);
            }
          }}
          message="The requested device could not be found."
        />
      </>
    );
  }

  const userName = device.user
    ? `${device.user.firstName} ${device.user.lastName}`
    : "Unassigned";

  return (
    <div className="max-w-6xl mx-auto px-4 md:px-6 py-5 space-y-5">

      {/* HEADER */}
      <div className="flex items-center justify-between flex-wrap gap-3">

        <div>
          <h1 className="text-xl md:text-2xl font-semibold text-gray-800">
            Device Details
          </h1>

          <p className="text-sm text-gray-500 mt-1">
            {device.serialNumber}
          </p>
        </div>

        <Button
          onClick={() => navigate(-1)}
          className="inline-flex items-center bg-primary-600 text-white px-3 sm:px-4 py-1 text-xs sm:text-sm font-semibold rounded-lg whitespace-nowrap"
          
        >
        <IoArrowBack className="mr-1 sm:mr-2 text-sm" />
          
          Back
        </Button>
      </div>

      {/* MAIN SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

        {/* IMAGE */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">

          <div className="border-b px-4 py-3 bg-gray-50">
            <h2 className="text-sm font-semibold text-gray-700">
              Device Image
            </h2>
          </div>

          <div className="p-5 flex justify-center items-center">
          <img
  src={
  device.image
    ? getImageUrl(device.image)
    : "/placeholder-device.png"
}
  alt={device.deviceName}
  className="h-56 w-full object-contain transition duration-300 hover:scale-105"
/>
          </div>
        </div>

        {/* INFO */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">

          <div className="border-b px-4 py-3 bg-gray-50">
            <h2 className="text-sm font-semibold text-gray-700">
              Device Information
            </h2>
          </div>

          <div className="p-4 grid grid-cols-1 sm:grid-cols-2 gap-4">

            <InfoCard
              icon={<FiCpu />}
              label="Device Name"
              value={device.deviceName}
            />

            <InfoCard
              icon={<FiGrid />}
              label="Device Type"
              value={device.deviceType}
            />

            <InfoCard
              icon={<FiHash />}
              label="Serial Number"
              value={device.serialNumber}
            />

            <InfoCard
              icon={<FiGrid />}
              label="Plant"
              value={device.plant?.name || "N/A"}
            />

            <InfoCard
              icon={<FiGrid />}
              label="Department"
              value={device.department?.name || "N/A"}
            />

            <InfoCard
              icon={<FiUser />}
              label="Assigned User"
              value={userName}
            />

          </div>
        </div>
      </div>

      {/* REPAIR HISTORY */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">

        <div className="border-b px-4 py-3 bg-gray-50 flex items-center justify-between">

          <div className="flex items-center gap-2">
            <FiTool className="text-blue-600" />

            <h2 className="text-sm font-semibold text-gray-700">
              Repair History
            </h2>
          </div>

          <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-md">
            {repairHistory.length} Records
          </span>
        </div>

        <div className="p-4">

          {repairHistory.length > 0 ? (
            <div className="space-y-3">

              {repairHistory.map((item) => (
                <div
                  key={item.sn}
                  className="border border-gray-200 rounded-xl p-4 hover:border-blue-300 hover:shadow-sm transition-all duration-200 bg-white"
                >

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

                    <div>
                      <p className="text-xs text-gray-400 mb-1">
                        Device
                      </p>

                      <p className="text-sm font-medium text-gray-700">
                        {item.deviceName}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-gray-400 mb-1">
                        Solved By
                      </p>

                      <p className="text-sm text-gray-700">
                        {item.solvedBy}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-gray-400 mb-1">
                        Resolved Date
                      </p>

                      <div className="flex items-center text-sm text-gray-700">
                        <FiCalendar className="mr-1 text-blue-500" />

                        {new Date(item.solvedDate).toLocaleDateString()}
                      </div>
                    </div>

                  </div>
                </div>
              ))}

            </div>
          ) : (
            <div className="text-center py-10">
              <p className="text-sm text-gray-500">
                No repair history available.
              </p>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

const InfoCard = ({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon: React.ReactNode;
}) => (
  <div className="border border-gray-200 rounded-xl p-4 hover:border-blue-300 hover:bg-blue-50/40 transition-all duration-200">

    <div className="flex items-center gap-2 mb-2">

      <div className="text-blue-600 text-base">
        {icon}
      </div>

      <p className="text-xs text-gray-500">
        {label}
      </p>
    </div>

    <p className="text-sm font-medium text-gray-800 break-words">
      {value}
    </p>
  </div>
);

export default DeviceDetail;