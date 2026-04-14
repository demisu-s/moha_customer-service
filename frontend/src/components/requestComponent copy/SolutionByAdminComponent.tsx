import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@radix-ui/themes";
import {
  useServiceRequests,
  Issues,
  PROBLEM_TYPES,
} from "../../context/ServiceRequestContext";
import { useUserContext } from "../../context/UserContext";
import { useDeviceContext } from "../../context/DeviceContext";

const SolutionByAdminComponent: React.FC = () => {
  const { requestId } = useParams();
  const navigate = useNavigate();
  const { getRequestById, updateRequest } = useServiceRequests();
  const { users, currentUser } = useUserContext();
  const { devices } = useDeviceContext();

  const [solution, setSolution] = useState("");
  const [issues, setIssues] = useState<Issues | "">("");

  const request = getRequestById(requestId || "");

  // ✅ Load existing issue
  useEffect(() => {
    if (request?.issues) {
      setIssues(request.issues);
    }
  }, [request]);

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
     ✅ DATA LOOKUPS
  ========================== */

  const requester = users.find((u) => u._id === request.requestedBy);

  // ✅ Logged-in admin (who is solving)
  const solved = users.find((u) => u._id === currentUser?._id);

  const device = devices.find((d) => d._id === request.deviceId);

  /* =========================
     ✅ HANDLE SOLVE
  ========================== */

  const handleSolve = (status: "Resolved" | "Unresolved") => {
  const now = new Date().toISOString();

  updateRequest(request.id || request._id, {
    status,
    solution,
    issues: issues || request.issues,
    resolvedDate: now,

    // ✅ ADD THIS (IMPORTANT)
    assignedTo: currentUser?._id,
    assignedToName: `${currentUser?.firstName} ${currentUser?.lastName}`,
  });

  navigate("/dashboard");
};
  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <h2 className="text-3xl font-bold text-gray-800">
        Solve Request –{" "}
        {device ? device.deviceName : request.serialNumber}
      </h2>

      <p className="text-sm text-gray-400 max-w-xl">
        Review the issue and provide a solution.
      </p>

      <div className="bg-white border rounded-2xl shadow-sm p-6">
        <h3 className="font-bold text-2xl mb-4 text-gray-800">
          📝 Request Details
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm mb-6">
          {/* Requester */}
          <div>
            <span className="text-gray-500 font-medium">Requester</span>
            <span className="block text-gray-900">
              {requester
                ? `${requester.firstName} ${requester.lastName}`
                : request.requestedBy}
            </span>
          </div>

          {/* Solved By */}
          <div>
            <span className="text-gray-500 font-medium">Solved by</span>
            <span className="block text-gray-900">
              {solved
                ? `${solved.firstName} ${solved.lastName}`
                : "—"}
            </span>
          </div>

          {/* Device */}
          <div>
            <span className="text-gray-500 font-medium">Device</span>
            <span className="block text-gray-900">
              {device
                ? `${device.deviceName} (${device.deviceType})`
                : "Unknown"}
            </span>
          </div>

          {/* Date */}
          <div>
            <span className="text-gray-500 font-medium">
              Requested Date
            </span>
            <span className="block text-gray-900">
              {request.createdAt}
            </span>
          </div>
        </div>

        {/* Description */}
        <div className="mb-4">
          <p className="text-gray-500 font-medium mb-2">
            Problem Description
          </p>
          <p className="text-gray-700">{request.description}</p>
        </div>

        <div className="border-t my-6"></div>

        {/* Problem Category */}
        <div className="w-full border rounded-md p-3 mb-4">
          <p className="text-gray-700">
            Problem Category:{" "}
            <strong>{request.problemCategory}</strong>
          </p>
        </div>

        {/* Problem Type */}
        <div className="mb-6">
          <label className="block text-gray-700 font-semibold mb-2">
            Problem Type
          </label>
          <select
            value={issues}
            onChange={(e) =>
              setIssues(e.target.value as Issues)
            }
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

        {/* Solution */}
        <h3 className="font-bold text-2xl mb-3 text-gray-800">
          🧩 Solution
        </h3>
        <textarea
          value={solution}
          onChange={(e) => setSolution(e.target.value)}
          rows={4}
          className="w-full border rounded-md p-3 text-sm focus:ring-1 focus:ring-gray-400"
          placeholder="Describe the solution provided..."
        />

        {/* Resolved Date */}
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

        {/* Actions */}
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

export default SolutionByAdminComponent;