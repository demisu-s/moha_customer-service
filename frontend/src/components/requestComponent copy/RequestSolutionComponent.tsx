// src/components/dashboardComponents/RequestSolutionComponent.tsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@radix-ui/themes";
import { ServiceRequest } from "../../pages/User/askforhelp";

const RequestSolutionComponent: React.FC = () => {
  const { requestId } = useParams();
  const navigate = useNavigate();
  const [request, setRequest] = useState<ServiceRequest | null>(null);
  const [solution, setSolution] = useState("");

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

  const handleSolve = () => {
    const stored = localStorage.getItem("serviceRequests");
    if (!stored) return;

    const requests: ServiceRequest[] = JSON.parse(stored);

    // ✅ Update request with solution + mark as Resolved
    const updatedRequests = requests.map((r) =>
      String(r.id) === String(requestId)
        ? { ...r, solution, status: "Resolved", resolvedDate: new Date().toISOString() }
        : r
    );

    localStorage.setItem("serviceRequests", JSON.stringify(updatedRequests));
    navigate("/dashboard/home"); // back to dashboard
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <h2 className="text-3xl font-bold text-gray-800">
        Solve Request - {request.deviceSerial}
      </h2>
      <p className="text-sm text-gray-400 max-w-xl">
        Review the assigned issue and provide a solution.
      </p>

      {/* Request Details */}
      <div className="border rounded-lg p-4 bg-white space-y-2">
        <h3 className="font-bold text-xl mb-2">Request Details</h3>
        <p><strong>Problem:</strong> {request.description}</p>
        <p><strong>Urgency:</strong> {request.urgency}</p>
        <p>
          <strong>Assigned Date:</strong>{" "}
          {request.assignedDate
            ? typeof request.assignedDate === "string"
              ? request.assignedDate
              : (request.assignedDate as Date).toLocaleString()
            : "—"}
        </p>
        <p><strong>Admin Notes:</strong> {request.notes || "No notes provided"}</p>
      </div>

      {/* Solution Form */}
      <div className="border rounded-lg p-4 bg-white space-y-3">
        <label className="block font-bold mb-2 text-xl">Solution</label>
        <textarea
          className="w-full border rounded px-3 py-2 text-sm"
          rows={6}
          placeholder="Describe how you solved the problem..."
          value={solution}
          onChange={(e) => setSolution(e.target.value)}
        />
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-3">
        <Button
          onClick={() => navigate(-1)}
          className="bg-white text-black px-4 py-1 border border-gray-300 rounded-md hover:bg-gray-100 duration-200 hover:shadow-md hover:scale-105"
        >
          Cancel
        </Button>
        <Button
          onClick={handleSolve}
          className="bg-primary-600 text-white px-4 py-1 border border-gray-300 rounded-md hover:bg-primary-900 duration-200 hover:shadow-md hover:scale-105"
        >
          Solve
        </Button>
      </div>
    </div>
  );
};

export default RequestSolutionComponent;
