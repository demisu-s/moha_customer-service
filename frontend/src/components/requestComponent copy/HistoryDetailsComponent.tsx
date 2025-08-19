import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@radix-ui/themes";
import { maintenanceRequests } from "../../data/mockdata";

const HistoryDetailsComponent: React.FC = () => {
  const { requestId } = useParams();
  const navigate = useNavigate();

   const currentUserId = localStorage.getItem("userId") || "USR123";

  // Ensure correct type comparison (convert to string if ids are strings)
  const request = maintenanceRequests.find(
    (req) => String(req.id) === String(requestId)
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

  return (
    <div className="max-w-5xl mx-auto space-y-4">
      <h2 className="text-3xl font-bold text-gray-800">
        Request - {request.device?.serial}
      </h2>
      <p className="text-sm text-gray-400 max-w-xl">
        View and manage all incoming reported issues and new machine requests.
      </p>

      <div className="grid md:grid-cols-3 gap-4">
        {/* Device Image + Request Summary */}
        <div className="col-span-2 flex gap-0">
          <div className="border rounded-l-lg p-4 flex items-center justify-center bg-white">
            <img
              src={request.device?.image}
              alt="Device"
              className="w-72 h-48 object-contain"
            />
          </div>
          <div className="border-t border-b border-r rounded-r-lg p-4 flex-1 bg-white">
            <h3 className="font-bold mb-3 text-xl">Request Summary</h3>
            <div className="text-sm space-y-1">
              <p>
                <strong className="text-lg font-light text-gray-500 pr-4">
                  Device Name:
                </strong>{" "}
                {request.device?.name}
              </p>
              <p>
                <strong className="text-lg font-light text-gray-500 pr-6">
                  Device Type:
                </strong>{" "}
                {request.device?.type}
              </p>
              <p>
                <strong className="text-lg font-light text-gray-500 pr-4">
                  Device ID/Serial:
                </strong>{" "}
                {request.device?.serial}
              </p>
              <p>
                <strong className="text-lg font-light text-gray-500 pr-4">
                  Submission Date:
                </strong>{" "}
                {request.device?.submissionDate}
              </p>
<p>
  <strong className="text-lg font-light text-gray-500 pr-2">
    Status:
  </strong>{" "}
  <span className="text-red-500 font-semibold">
    {request.device?.status}{" "}
    <span className="text-gray-500 font-normal">by</span>{" "}
    {request.supervisor?.name || "Supervisor"}
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
              {request.requester?.name}
            </p>
            <p>
              <strong className="text-lg font-light text-gray-500 pr-4">
                Plant Location:
              </strong>{" "}
              {request.requester?.location}
            </p>
            <p>
              <strong className="text-lg font-light text-gray-500 pr-4">
                Department:
              </strong>{" "}
              {request.requester?.department}
            </p>
            <p>
              <strong className="text-lg font-light text-gray-500 pr-4">
                Phone number:
              </strong>{" "}
              {request.requester?.phone}
            </p>
          </div>
        </div>
      </div>

      {/* Issue Description */}
      <div className="border rounded-lg p-4">
        <h3 className="font-bold mb-3 text-xl">Issue Description</h3>
        <p className="text-md font-light text-gray-500 mb-2">Description</p>
        <p className="text-md font-light mb-3">{request.issue?.description}</p>
      </div>

      {/* Recommendation & Solution */}
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
            <label className="block font-bold mb-3 text-xl">
              Solution
            </label>
            <div className="w-full border rounded px-3 py-6 text-sm">
              <p className="text-md text-gray-500">
                {request.issue?.solution}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HistoryDetailsComponent;
