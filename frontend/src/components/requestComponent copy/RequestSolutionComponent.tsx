import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@radix-ui/themes";
import {
  useServiceRequests,
  Issues,
  PROBLEM_TYPES,
} from "../../context/ServiceRequestContext";
import { useUserContext } from "../../context/UserContext";
import { useDeviceContext } from "../../context/DeviceContext";

const RequestSolutionComponent: React.FC = () => {
  const { requestId } = useParams();
  const navigate = useNavigate();
  const { getRequestById, updateRequest } = useServiceRequests();
  const { users } = useUserContext();
  const { devices } = useDeviceContext();

  const [solution, setSolution] = useState("");
  const [issues, setIssues] = useState<Issues>("");

  const request = getRequestById(requestId || "");

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

  const requester = users.find((u) => u.userId === request.userId);
  const supervisor = users.find((u) => u.userId === request.assignedTo);
  const device = devices.find((d) => d.id === request.deviceId);

  // 🟢 Handle Resolved/Unresolved
  const handleSolve = (status: "Resolved" | "Unresolved") => {
    const now = new Date().toISOString();

    updateRequest(request.id, {
      status,
      solution,
      issues,
      resolvedDate: now, // Always current date
    });

    navigate("/dashboard");
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <h2 className="text-3xl font-bold text-gray-800">
        Solve Request – {device ? device.name : request.deviceSerial}
      </h2>
      <p className="text-sm text-gray-400 max-w-xl">
        Review the issue and provide a solution.
      </p>

      <div className="bg-white border rounded-2xl shadow-sm p-6">
        <h3 className="font-bold text-2xl mb-4 text-gray-800">📝 Request Details</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm mb-6">
          <div>
            <span className="text-gray-500 font-medium">Requester</span>
            <span className="block text-gray-900">
              {requester
                ? `${requester.firstName} ${requester.lastName}`
                : request.requestedBy}
            </span>
          </div>
          <div>
            <span className="text-gray-500 font-medium">Supervisor</span>
            <span className="block text-gray-900">
              {supervisor
                ? `${supervisor.firstName} ${supervisor.lastName}`
                : request.assignedToName || "Not assigned"}
            </span>
          </div>
          <div>
            <span className="text-gray-500 font-medium">Device</span>
            <span className="block text-gray-900">
              {device ? `${device.name} (${device.type})` : "Unknown"}
            </span>
          </div>
          <div>
            <span className="text-gray-500 font-medium">Urgency</span>
            <span
              className={`px-2 py-1 rounded text-xs font-semibold ${
                request.urgency === "High"
                  ? "bg-red-100 text-red-800"
                  : request.urgency === "Medium"
                  ? "bg-yellow-100 text-yellow-800"
                  : "bg-green-100 text-green-800"
              }`}
            >
              {request.urgency || "N/A"}
            </span>
          </div>
        </div>

        <div className="mb-4">
          <p className="text-gray-500 font-medium mb-2">Problem Description</p>
          <p className="text-gray-700">{request.description}</p>
        </div>

        <div className="border-t my-6"></div>
        <div className="w-full border rounded-md p-3">
          <p className="text-black font-medium mb-2">Admin Notes</p>
          <p className="text-gray-700">{request.notes}</p>
        </div>

        {/* 🟣 Problem Type (above Solution) */}
        <div className="mb-6">
          <label className="block text-gray-700 font-semibold mb-2">
            Problem Type
          </label>
          <select
            value={issues}
            onChange={(e) => setIssues(e.target.value as Issues)}
            className="w-full border rounded-md p-2 text-sm focus:ring-1 focus:ring-gray-400"
          >
            <option value="">Select problem type</option>
            {PROBLEM_TYPES.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>

        {/* 🧩 Solution */}
        <h3 className="font-bold text-2xl mb-3 text-gray-800">🧩 Solution</h3>
        <textarea
          value={solution}
          onChange={(e) => setSolution(e.target.value)}
          rows={4}
          className="w-full border rounded-md p-3 text-sm focus:ring-1 focus:ring-gray-400"
          placeholder="Describe the solution provided..."
        />

        {/* ✅ Resolved date (auto-filled, not editable) */}
        <div className="mt-4">
          <label className="block text-gray-500 font-medium mb-2">
            Resolved Date
          </label>
          <input
            type="text"
            readOnly
            disabled
            value={new Date().toLocaleString()}
            className="border rounded-md px-3 py-1 bg-gray-100 text-gray-700 cursor-not-allowed"
          />
        </div>

        <div className="mt-6 flex gap-4 justify-end">
          <Button
            onClick={() => handleSolve("Unresolved")}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-1 rounded-md"
          >
            Mark Unresolved
          </Button>
          <Button
            onClick={() => handleSolve("Resolved")}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-1 rounded-md"
          >
            Mark Resolved
          </Button>
        </div>
      </div>
    </div>
  );
};

export default RequestSolutionComponent;
