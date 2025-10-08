// src/components/dashboardComponents/HistoryDetailsComponent.tsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@radix-ui/themes";
import {
  useServiceRequests,
  ServiceRequest,
} from "../../context/ServiceRequestContext";
import { useUserContext } from "../../context/UserContext";
import { useDeviceContext } from "../../context/DeviceContext";

const HistoryDetailsComponent: React.FC = () => {
  const { requestId } = useParams();
  const navigate = useNavigate();
  const { users } = useUserContext();
  const { devices } = useDeviceContext();
  const [request, setRequest] = useState<ServiceRequest | null>(null);

  // ✅ Load specific request from localStorage
  useEffect(() => {
    const stored = localStorage.getItem("serviceRequests");
    if (stored) {
      const requests: ServiceRequest[] = JSON.parse(stored);
      const found = requests.find((r) => String(r.id) === String(requestId));
      if (found) setRequest(found);
    }
  }, [requestId]);

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

  // ✅ Lookup requester, supervisor, and device
  const requester = users.find((u) => u.userId === request.userId);
  const supervisor = users.find((u) => u.userId === request.assignedTo);
  const device = devices.find((d) => d.id === request.deviceId);

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold text-gray-800">
          Request – {device ? device.name : request.deviceSerial}
        </h2>
        <p className="text-sm text-gray-400">
          Detailed record of this service request.
        </p>
      </div>

      {/* Summary Section */}
      <div className="grid md:grid-cols-3 gap-4">
        {/* Left: Device Image + Summary */}
        <div className="col-span-2 flex gap-0">
          {request.deviceImage && (
            <div className="border rounded-l-lg p-4 flex items-center justify-center bg-white">
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
                <strong className="text-gray-500 pr-2">Device Name:</strong>
                {device ? device.name : "Unknown"}
              </p>
              <p>
                <strong className="text-gray-500 pr-2">Device Type:</strong>
                {device ? device.type : "Unknown"}
              </p>
              <p>
                <strong className="text-gray-500 pr-2">Serial:</strong>
                {request.deviceSerial}
              </p>
              <p>
                <strong className="text-gray-500 pr-2">Requested Date:</strong>
                {request.requestedDate
                  ? new Date(request.requestedDate).toLocaleString()
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
                <span className="text-gray-500 font-normal">by</span>{" "}
                {supervisor
                  ? `${supervisor.firstName} ${supervisor.lastName}`
                  : request.assignedToName || "Not assigned"}
              </p>
            </div>
          </div>
        </div>

        {/* Requester Info */}
        <div className="border rounded-lg p-4 bg-white">
          <h3 className="font-bold mb-3 text-xl">Requester Information</h3>
          <div className="text-sm space-y-1">
            <p>
              <strong className="text-gray-500 pr-2">User:</strong>
              {requester
                ? `${requester.firstName} ${requester.lastName}`
                : request.requestedBy || "Unknown"}
            </p>
            <p>
              <strong className="text-gray-500 pr-2">Plant Location:</strong>
              {request.area}
            </p>
            <p>
              <strong className="text-gray-500 pr-2">Department:</strong>
              {request.department}
            </p>
            <p>
              <strong className="text-gray-500 pr-2">Phone:</strong>
              {request.phone}
            </p>
          </div>
        </div>
      </div>

      {/* Issue Description */}
      <div className="border rounded-lg p-4 bg-white">
        <h3 className="font-bold mb-3 text-xl">Issue Details</h3>
        <div className="text-sm text-gray-600 space-y-1">
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
          <p>
            <strong className="text-gray-500 pr-2">Issue:</strong>
            {request.issues || "—"}
          </p>
          <div className="mt-3">
            <p className="text-gray-500 font-medium mb-1">Description:</p>
            <p className="text-gray-700">{request.description}</p>
          </div>
        </div>
      </div>

      {/* Recommendation & Solution */}
      <div className="border rounded-lg p-4 bg-white space-y-4">
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <h4 className="font-bold mb-2 text-lg">Recommendation</h4>
            <div className="border rounded px-3 py-3 text-sm text-gray-700 bg-gray-50 min-h-[80px]">
              {request.notes || "No recommendation provided."}
            </div>
          </div>

          <div>
            <h4 className="font-bold mb-2 text-lg">Solution</h4>
            <div className="border rounded px-3 py-3 text-sm text-gray-700 bg-gray-50 min-h-[80px]">
              {request.solution || "No solution provided yet."}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HistoryDetailsComponent;
