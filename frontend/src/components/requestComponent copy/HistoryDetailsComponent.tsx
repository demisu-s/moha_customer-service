// src/components/dashboardComponents/HistoryDetailsComponent.tsx
import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@radix-ui/themes";
import { useServiceRequests } from "../../context/ServiceRequestContext";
import { useUserContext } from "../../context/UserContext";
import { useDeviceContext } from "../../context/DeviceContext";

const HistoryDetailsComponent: React.FC = () => {
  const { requestId } = useParams();
  const navigate = useNavigate();

  const { getRequestById } = useServiceRequests();
  const { users } = useUserContext();
  const { devices } = useDeviceContext();

  // ✅ GET request directly from context (backend)
  const request = getRequestById(requestId || "");

  /* =========================
     NOT FOUND
  ========================== */
  if (!request) {
    return (
      <div className="max-w-3xl mx-auto p-6 text-center text-red-600">
        <h2 className="text-xl font-semibold">Request not found</h2>
        <Button onClick={() => navigate(-1)} className="mt-4">
          Go Back
        </Button>
      </div>
    );
  }

  /* =========================
     LOOKUPS
  ========================== */

  const requester = users.find(
    (u) =>
      `${u.firstName} ${u.lastName}` === request.requestedBy
  );

  const supervisor = users.find((u) => u._id === request.assignedTo);

  const device = devices.find((d) => d._id === request.deviceId);

  /* =========================
     UI
  ========================== */

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold text-gray-800">
          Request – {device ? device.deviceName : request.serialNumber}
        </h2>
        <p className="text-sm text-gray-400">
          Detailed record of this service request.
        </p>
      </div>

      {/* Summary */}
      <div className="grid md:grid-cols-3 gap-4">
        {/* Device + Summary */}
        <div className="col-span-2 flex">
          {request.deviceImage && (
            <div className="border rounded-l-lg p-4 bg-white flex items-center">
              <img
                src={request.deviceImage}
                alt="Device"
                className="w-72 h-48 object-contain"
              />
            </div>
          )}

          <div className="border-t border-b border-r rounded-r-lg p-4 flex-1 bg-white">
            <h3 className="font-bold mb-3 text-xl">Request Summary</h3>

            <div className="text-sm space-y-1">
              <p>
                <strong className="text-gray-500 pr-2">Device:</strong>
                {device
                  ? `${device.deviceName} (${device.deviceType})`
                  : "Unknown"}
              </p>

              <p>
                <strong className="text-gray-500 pr-2">Serial:</strong>
                {request.serialNumber}
              </p>

              <p>
                <strong className="text-gray-500 pr-2">Requested Date:</strong>
                {request.createdAt
                  ? new Date(request.createdAt).toLocaleString()
                  : "—"}
              </p>

              <p>
                <strong className="text-gray-500 pr-2">Status:</strong>
                <span
                  className={`font-semibold ${
                    request.status === "Resolved"
                      ? "text-green-600"
                      : request.status === "Unresolved"
                      ? "text-red-500"
                      : "text-yellow-600"
                  }`}
                >
                  {request.status}
                </span>{" "}
                <span className="text-gray-500">by</span>{" "}
                {supervisor
                  ? `${supervisor.firstName} ${supervisor.lastName}`
                  : request.assignedToName || "Not assigned"}
              </p>
            </div>
          </div>
        </div>

        {/* Requester */}
        <div className="border rounded-lg p-4 bg-white">
          <h3 className="font-bold mb-3 text-xl">Requester Info</h3>

          <div className="text-sm space-y-1">
            <p>
              <strong className="text-gray-500 pr-2">User:</strong>
              {request.requestedBy}
            </p>

            <p>
              <strong className="text-gray-500 pr-2">Plant:</strong>
              {request.plant}
            </p>

            <p>
              <strong className="text-gray-500 pr-2">Department:</strong>
              {request.department}
            </p>
          </div>
        </div>
      </div>

      {/* Issue Details */}
      <div className="border rounded-lg p-4 bg-white">
        <h3 className="font-bold mb-3 text-xl">Issue Details</h3>

        <div className="text-sm space-y-2">
          <p>
            <strong className="text-gray-500 pr-2">Problem Category:</strong>
            {request.problemCategory || "—"}
          </p>

          <p>
            <strong className="text-gray-500 pr-2">Issue Type:</strong>
            {request.issues || "—"}
          </p>

          <p>
            <strong className="text-gray-500 pr-2">Assigned Date:</strong>
            {request.assignedDate
              ? new Date(request.assignedDate).toLocaleString()
              : "—"}
          </p>

          <p>
            <strong className="text-gray-500 pr-2">Resolved Date:</strong>
            {request.resolvedDate
              ? new Date(request.resolvedDate).toLocaleString()
              : "—"}
          </p>

          <div className="mt-3">
            <p className="text-gray-500 font-medium">Description:</p>
            <p className="text-gray-700">{request.description}</p>
          </div>
        </div>
      </div>

      {/* Notes + Solution */}
      <div className="border rounded-lg p-4 bg-white space-y-4">
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <h4 className="font-bold mb-2 text-lg">Admin Notes</h4>
            <div className="border rounded px-3 py-3 bg-gray-50 min-h-[80px]">
              {request.notes || "No notes provided."}
            </div>
          </div>

          <div>
            <h4 className="font-bold mb-2 text-lg">Solution</h4>
            <div className="border rounded px-3 py-3 bg-gray-50 min-h-[80px]">
              {request.solution || "No solution provided yet."}
            </div>
          </div>
        </div>
      </div>

      {/* Back */}
      <div className="flex justify-end">
        <Button onClick={() => navigate(-1)}>Back</Button>
      </div>
    </div>
  );
};

export default HistoryDetailsComponent;