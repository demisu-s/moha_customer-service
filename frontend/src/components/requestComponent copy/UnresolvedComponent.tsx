// src/components/dashboardComponents/HistoryDetailsComponent.tsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@radix-ui/themes";
import { ServiceRequest } from "../../pages/User/askforhelp";
import { useUserContext } from "../../context/UserContext";
import { useDeviceContext } from "../../context/DeviceContext";

const UnresolvedComponent: React.FC = () => {
  const { requestId } = useParams();
  const navigate = useNavigate();
  const { users } = useUserContext();
  const [request, setRequest] = useState<ServiceRequest | null>(null);
   const { devices } = useDeviceContext();   // ✅ device lookup

  // ✅ Load request from localStorage
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

  // ✅ Lookup requester & supervisor from context
  const requester = users.find((u) => u.userId === request.userId);
  const supervisor = users.find((u) => u.userId === request.assignedTo);
    const device = devices.find((d) => d.id === request.deviceId);

  return (
    <div className="max-w-5xl mx-auto space-y-4">
      <h2 className="text-3xl font-bold text-gray-800">
        Request - {request.deviceSerial}
        {/* Request - {device ? device.name : request.deviceSerial} */}
      </h2>
      <p className="text-sm text-gray-400 max-w-xl">
        View reason of unresolved and issues and the actions taken.
      </p>

      <div className="grid md:grid-cols-3 gap-4">
        {/* Device Image + Request Summary */}
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
                <strong className="text-lg font-light text-gray-500 pr-4">
                  Device Name:
                </strong>{" "}
                {device ? device.name : "Unknown"}
              </p>
              <p>
                <strong className="text-lg font-light text-gray-500 pr-6">
                  Device Type:
                </strong>{" "}
                {device ? device.type : "Unknown"}
              </p>
              <p>
                <strong className="text-lg font-light text-gray-500 pr-4">
                  Device ID/Serial:
                </strong>{" "}
                {request.deviceSerial}
              </p>
              <p>
                <strong className="text-lg font-light text-gray-500 pr-4">
                  Requested Date:
                </strong>{" "}
                 {request.requestedDate
                  ? new Date(request.requestedDate).toLocaleString()
                  : "—"}
              </p>
              <p>
                <strong className="text-lg font-light text-gray-500 pr-2">
                  Status:
                </strong>{" "}
                <span className="text-red-500 font-semibold">
                  {request.status}{" "}
                 
                  
                </span>
              </p>
            </div>
          </div>
        </div>

        {/* Requester Info */}
        <div className="border rounded-lg p-4 bg-white">
          <h3 className="font-bold mb-3 text-xl">Requester Information</h3>
          <div className="text-sm space-y-1">
            <p>
              <strong className="text-lg font-light text-gray-500 pr-4">
                User Name:
              </strong>{" "}
              {requester
                ? requester.firstName + " " + requester.lastName
                : request.requestedBy || "Unknown"}
            </p>
            <p>
              <strong className="text-lg font-light text-gray-500 pr-4">
                Plant Location:
              </strong>{" "}
              {request.area}
            </p>
            <p>
              <strong className="text-lg font-light text-gray-500 pr-4">
                Department:
              </strong>{" "}
              {request.department}
            </p>
            <p>
              <strong className="text-lg font-light text-gray-500 pr-4">
                Phone number:
              </strong>{" "}
              {request.phone}
            </p>
          </div>
        </div>
      </div>

      {/* Issue Description */}
      <div className="border rounded-lg p-4">
        <h3 className="font-bold mb-3 text-xl">Issue Description</h3>
        <div>
          <p>
            <strong className="text-lg font-light text-gray-500 pr-4">
              Assigned Date:
            </strong>{" "}
            {request.assignedDate
              ? new Date(request.assignedDate).toLocaleString()
              : "—"}
          </p>
          <p>
            <strong className="text-lg font-light text-gray-500 pr-4">
              Resolved Date:
            </strong>{" "}
            {request.resolvedDate
              ? new Date(request.resolvedDate).toLocaleString()
              : "—"}
          </p>
        </div>
        <p className="text-md font-light text-gray-500 mb-2">Description</p>
        <p className="text-md font-light mb-3">{request.description}</p>
      </div>

      {/* Recommendation & Solution */}
      <div className="border rounded-lg p-4 space-y-3">
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block font-bold mb-3 text-xl">Recommendation</label>
            <div className="w-full border rounded px-3 py-6 text-sm">
              <p className="text-md text-gray-500">{request.notes}</p>
            </div>
          </div>

          <div>
            <label className="block font-bold mb-3 text-xl">Reason of Unresolved</label>
            <div className="w-full border rounded px-3 py-6 text-sm">
              <p className="text-md text-gray-500">
                {request.solution || "No solution provided yet"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UnresolvedComponent;
