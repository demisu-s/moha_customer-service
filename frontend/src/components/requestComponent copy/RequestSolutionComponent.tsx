// src/components/dashboardComponents/RequestSolutionComponent.tsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@radix-ui/themes";
import { ServiceRequest } from "../../pages/User/askforhelp";
import { useUserContext } from "../../context/UserContext";
import { useDeviceContext } from "../../context/DeviceContext";

const RequestSolutionComponent: React.FC = () => {
  const { requestId } = useParams();
  const navigate = useNavigate();
  const [request, setRequest] = useState<ServiceRequest | null>(null);
  const [solution, setSolution] = useState("");
  const [resolvedDate, setResolvedDate] = useState<string>("");

  const { users } = useUserContext();
  const { devices } = useDeviceContext();

  // ✅ Load request from localStorage
  useEffect(() => {
    const stored = localStorage.getItem("serviceRequests");
    if (stored) {
      const requests: ServiceRequest[] = JSON.parse(stored);
      const found = requests.find((r) => String(r.id) === String(requestId));
      if (found) {
        setRequest(found);
        if (found.resolvedDate) {
          setResolvedDate(
            new Date(found.resolvedDate).toISOString().split("T")[0]
          );
        }
      }
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

  // 🔎 Look up related data
  const requester = users.find((u) => u.userId === request.userId);
  const supervisor = users.find((u) => u.userId === request.assignedTo);
  const device = devices.find((d) => d.id === request.deviceId);

  const handleSolve = () => {
    const stored = localStorage.getItem("serviceRequests");
    if (!stored) return;

    const requests: ServiceRequest[] = JSON.parse(stored);

    // ✅ Update request with solution + mark as Resolved
    const updatedRequests = requests.map((r) =>
      String(r.id) === String(requestId)
        ? {
            ...r,
            solution,
            status: "Resolved",
            resolvedDate: resolvedDate
              ? new Date(resolvedDate).toISOString()
              : new Date().toISOString(),
          }
        : r
    );

    localStorage.setItem("serviceRequests", JSON.stringify(updatedRequests));
    navigate("/dashboard");
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <h2 className="text-3xl font-bold text-gray-800">
        Solve Request - {device ? device.name : request.deviceSerial}
      </h2>
      <p className="text-sm text-gray-400 max-w-xl">
        Review the assigned issue and provide a solution.
      </p>

      {/* Request Details */}
      <div className="bg-white border rounded-2xl shadow-sm p-6">
        <h3 className="font-bold text-2xl mb-4 text-gray-800 flex items-center gap-2">
          📝 Request Details
        </h3>

        {/* Grid for short fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm mb-6">
          <div className="flex flex-col">
            <span className="text-gray-500 font-medium">Requester</span>
            <span className="text-gray-900">
              {requester
                ? `${requester.firstName} ${requester.lastName}`
                : request.requestedBy}
            </span>
          </div>

          <div className="flex flex-col">
            <span className="text-gray-500 font-medium">Supervisor</span>
            <span className="text-gray-900">
              {supervisor
                ? `${supervisor.firstName} ${supervisor.lastName}`
                : request.assignedToName || "Not assigned"}
            </span>
          </div>

          <div className="flex flex-col">
            <span className="text-gray-500 font-medium">Device</span>
            <span className="text-gray-900">
              {device ? `${device.name} (${device.type})` : "Unknown device"}
            </span>
          </div>

          <div className="flex flex-col">
            <span className="text-gray-500 font-medium">Urgency</span>
            <span
              className={`px-2 py-1 rounded-full text-xs w-fit ${
                request.urgency === "High"
                  ? "bg-red-100 text-red-600 font-semibold"
                  : request.urgency === "Medium"
                  ? "bg-yellow-100 text-yellow-600 font-semibold"
                  : "bg-green-100 text-green-600 font-semibold"
              }`}
            >
              {request.urgency}
            </span>
          </div>

          <div className="flex flex-col">
            <span className="text-gray-500 font-medium">Assigned Date</span>
            <span className="text-gray-900">
              {request.assignedDate
                ? new Date(request.assignedDate).toLocaleString()
                : "—"}
            </span>
          </div>
        </div>

        {/* Problem */}
        <div className="mb-6">
          <span className="block text-gray-500 font-medium mb-1">Problem</span>
          <div className="border rounded-lg p-3 bg-gray-50 text-gray-900 text-sm">
            {request.description}
          </div>
        </div>

        {/* Admin Notes */}
        <div>
          <span className="block text-gray-500 font-medium mb-1">
            Admin Notes
          </span>
          <div className="border rounded-lg p-3 bg-gray-50 text-gray-900 text-sm italic">
            {request.notes || "No notes provided"}
          </div>
        </div>
      </div>

      {/* Solution Form */}
      <div className="bg-white border rounded-2xl shadow-sm p-6 space-y-6">
        <h3 className="font-bold text-2xl mb-4 text-gray-800 flex items-center gap-2">
          ✅ Provide Solution
        </h3>

        <div className="flex flex-col space-y-2">
          <label className="text-gray-500 font-medium">Resolved Date</label>
          <input
            type="date"
            value={resolvedDate}
            onChange={(e) => setResolvedDate(e.target.value)}
            className="w-full border rounded-lg px-3 py-2 text-base focus:ring-2 focus:ring-primary-500 focus:outline-none"
          />
        </div>

        <div className="flex flex-col space-y-2">
          <label className="text-gray-500 font-medium">Solution</label>
          <textarea
            className="w-full border rounded-lg p-3 bg-gray-50 text-sm focus:ring-2 focus:ring-primary-500 focus:outline-none"
            rows={6}
            placeholder="Describe how you solved the problem..."
            value={solution}
            onChange={(e) => setSolution(e.target.value)}
          />
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-3">
        <Button
          onClick={() => navigate(-1)}
          className="bg-white text-black px-4 py-1 border border-gray-300 rounded-lg hover:bg-gray-100 duration-200 hover:shadow-md hover:scale-105"
        >
          Cancel
        </Button>
        <Button
          onClick={handleSolve}
          className="bg-primary-600 text-white px-4 py-1 border border-gray-300 rounded-lg hover:bg-primary-900 duration-200 hover:shadow-md hover:scale-105"
        >
          Solve
        </Button>
      </div>
    </div>
  );
};

export default RequestSolutionComponent;
