import React, { useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@radix-ui/themes";
import { useDeviceContext } from "../../context/DeviceContext";
import { IoArrowBack } from "react-icons/io5";
import { useServiceRequests } from "../../context/ServiceRequestContext";

const DeviceDetail: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { devices } = useDeviceContext();
  const { requests } = useServiceRequests(); // ✅ GET REAL DATA

  const device = devices.find((dev) => dev._id === id);

  if (!device) {
    return (
      <div className="max-w-3xl mx-auto p-6 text-center text-red-600">
        <h2 className="text-xl font-semibold">Device not found</h2>
        <Button onClick={() => navigate(-1)} className="mt-4">
          Go Back
        </Button>
      </div>
    );
  }

  const userName = device.user
    ? `${device.user.firstName} ${device.user.lastName}`
    : "Unassigned";

  /* =========================
     ✅ REAL REPAIR HISTORY
  ========================== */
  const repairHistory = useMemo(() => {
    return requests
      .filter(
        (r) =>
          r.deviceId === device._id &&
          r.status === "Resolved" // ✅ only solved ones
      )
      .map((r, index) => ({
        sn: index + 1,
        deviceName: device.deviceName,
        solvedBy: r.assignedToName || "Technician", // ✅ FIXED HERE
        solvedDate: r.resolvedDate || r.createdAt,
      }));
  }, [requests, device]);

  return (
    <div className="max-w-6xl mx-auto space-y-6 p-6">

      {/* HEADER */}
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-gray-900">
          Device Details - {device.serialNumber}
        </h2>

        <Button
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md inline-flex items-center shadow-md"
          onClick={() => navigate(-1)}
        >
          <IoArrowBack className="mr-2" />
          Go Back
        </Button>
      </div>

      <p className="text-gray-500 text-lg font-light">
        Review the full device information and repair history.
      </p>

      {/* DEVICE INFO */}
      <div className="grid md:grid-cols-3 gap-6">

        <div className="col-span-1 bg-white rounded-xl shadow p-5 flex items-center justify-center">
          <img
            src={device.image || "/placeholder-device.png"}
            alt={device.deviceName}
            className="w-full h-64 object-contain rounded-lg"
          />
        </div>

        <div className="col-span-2 bg-white border border-gray-200 rounded-xl p-6 space-y-6 shadow">
          <h3 className="text-2xl font-semibold border-b pb-2">
            Device Information
          </h3>

          <div className="grid grid-cols-2 gap-4 text-gray-700">
            <Info label="Device Name" value={device.deviceName} />
            <Info label="Device Type" value={device.deviceType} />
            <Info label="Serial Number" value={device.serialNumber} />
            <Info label="Plant" value={device.plant?.name || "N/A"} />
            <Info label="Department" value={device.department?.name || "N/A"} />
            <Info label="User" value={userName} />
          </div>
        </div>
      </div>

      {/* =========================
          ✅ REPAIR HISTORY TABLE
      ========================== */}
      <div className="bg-blue-50 shadow rounded-xl p-6">
        <h3 className="text-2xl font-semibold border-b pb-2 mb-4">
          Repair History
        </h3>

        {repairHistory.length > 0 ? (
          <div className="overflow-x-auto">

            {/* HEADER */}
            <div className="grid grid-cols-12 font-semibold text-black border-b pb-2 mb-2">
              <div className="col-span-4">Device Name</div>
              <div className="col-span-4">Solved By</div>
              <div className="col-span-3">Solved Date</div>
            </div>

            {/* ROWS */}
            {repairHistory.map((item) => (
              <div
                key={item.sn}
                className="grid grid-cols-12 items-center bg-white rounded-lg p-3 mb-2 shadow hover:bg-gray-50"
              >

                <div className="col-span-4 text-gray-700">
                  {item.deviceName}
                </div>

                <div className="col-span-4 text-gray-600">
                  {item.solvedBy}
                </div>

                <div className="col-span-3 text-gray-500">
                  {new Date(item.solvedDate).toLocaleDateString()}
                </div>
              </div>
            ))}

          </div>
        ) : (
          <p className="text-gray-500">
            No repair history available for this device.
          </p>
        )}
      </div>
    </div>
  );
};

const Info = ({ label, value }: { label: string; value: string }) => (
  <div className="flex flex-col">
    <span className="text-gray-500 text-sm">{label}</span>
    <span className="text-gray-900 font-semibold">{value}</span>
  </div>
);

export default DeviceDetail;