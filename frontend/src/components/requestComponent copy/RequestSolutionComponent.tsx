import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@radix-ui/themes";
import { maintenanceRequests } from "../../data/mockdata";

const RequestSolutionComponent: React.FC = () => {
  const { requestId } = useParams();
  const navigate = useNavigate();

  const currentUserId = localStorage.getItem("userId") || "USR123";

  // local state for solution input
  const [solution, setSolution] = useState("");

  // Load requests from localStorage (fallback to mockdata if none)
  const stored = localStorage.getItem("requests");
  const requests = stored ? JSON.parse(stored) : maintenanceRequests;

  const request = requests.find(
    (req: any) => String(req.id) === String(requestId)
  );

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
    const updatedRequests = requests.map((r: any) =>
      String(r.id) === String(requestId)
        ? {
            ...r,
            status: "Resolved", // ✅ mark resolved
            resolvedBy: currentUserId,
            resolvedDate: new Date().toISOString(),
            issue: {
              ...r.issue,
              solution, // ✅ store supervisor’s solution text
            },
          }
        : r
    );

    localStorage.setItem("requests", JSON.stringify(updatedRequests));
    navigate("/history"); // redirect to history page
  };

  return (
    <div className="max-w-5xl mx-auto space-y-4">
      <h2 className="text-3xl font-bold text-gray-800">
        Request - {request.device?.serial}
      </h2>
      <p className="text-sm text-gray-400 max-w-xl">
        View and manage the assigned issue and provide a solution.
      </p>

      {/* ... same UI as before ... */}

      {/* Solution Input */}
      <div className="border rounded-lg p-4 space-y-3">
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block font-bold mb-3 text-xl">
              Recommendation
            </label>
            <div className="w-full border rounded px-3 py-6 text-sm">
              <p className="text-md text-gray-500">
                {request.issue?.recommendation}
              </p>
            </div>
          </div>

          <div>
            <label className="block font-bold mb-3 text-xl">Solution</label>
            <textarea
              className="w-full border rounded px-3 py-2 text-sm"
              rows={6}
              placeholder="Write how you solved the problem."
              value={solution}
              onChange={(e) => setSolution(e.target.value)}
            />
          </div>
        </div>
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
