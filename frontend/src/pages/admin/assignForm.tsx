
import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@radix-ui/themes";
import { maintenanceRequests } from "../../data/mockdata";

const AssignFormPage: React.FC = () => {
  const { requestId } = useParams();
  const navigate = useNavigate();

  const request = maintenanceRequests.find((req) => req.id === requestId);

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
        Request Details - {request.device.serial}
      </h2>
      <p className="text-sm text-gray-400 max-w-xl">
        View and manage all incoming reported issues and new machine requests.
      </p>

<div className="grid md:grid-cols-3 gap-4">
  {/* Device Image + Request Summary (merged, no gap) */}
  <div className="col-span-2 flex gap-0">
    {/* Device Image */}
    <div className="border rounded-l-lg p-4 flex items-center justify-center bg-white">
      <img src={request.device.image} alt="Device" className="w-72 h-48 object-contain" />
    </div>
    {/* Request Summary */}
    <div className="border-t border-b border-r rounded-r-lg p-4 flex-1 bg-white">
      <h3 className="font-bold mb-3 text-xl">Request Summary</h3>
      <div className="text-sm space-y-1">
        <p ><strong className="text-lg font-light text-gray-500 pr-4 ">Device Name:</strong> {request.device.name}</p>
        <p><strong className="text-lg font-light text-gray-500 pr-6 ">Device Type:</strong> {request.device.type}</p>
        <p><strong className="text-lg font-light text-gray-500 pr-4 ">Device ID/Serial:</strong> {request.device.serial}</p>
        <p><strong className="text-lg font-light text-gray-500 pr-4 ">Submission Date:</strong> {request.device.submissionDate}</p>
        <p>
          <strong className="text-lg font-light text-gray-500 pr-2">Status:</strong>{" "}
          <span className="text-red-500 font-semibold">
            {request.device.status}
          </span>
        </p>
      </div>
    </div>
  </div>

  {/* Requester Info */}
  <div className="border rounded-lg p-4 bg-white">
    <h3 className="font-bold mb-3 text-xl">Requester Information</h3>
    <div className="text-sm space-y-1">
      <p><strong className="text-lg font-light text-gray-500 pr-4 ">User Name:</strong> {request.requester.name}</p>
      <p><strong className="text-lg font-light text-gray-500 pr-4 ">Plant Location:</strong> {request.requester.location}</p>
      <p><strong className="text-lg font-light text-gray-500 pr-4 ">Department:</strong> {request.requester.department}</p>
      <p><strong className="text-lg font-light text-gray-500 pr-4 ">Phone number:</strong> {request.requester.phone}</p>
    </div>
  </div>
</div>

      {/* Issue Description */}
      <div className="border rounded-lg p-4">
        <h3 className="font-bold mb-3 text-xl">Issue Description</h3>
        <p className="text-lg font-light text-gray-500 mb-2">Description </p>
        <p className="text-lg font-light mb-3">{request.issue.description}</p>
        <p className="text-lg font-light text-gray-500 mb-2">
          Urgency:{" "}</p>
          <p className="text-red-500 font-bold text-lg mb-3">
            {request.issue.urgency}
          </p>
        <div className="flex flex-wrap gap-2">
          {request.issue.attachments.map((file, index) => (
            <div
              key={index}
              className="flex items-center border rounded px-3 py-1 text-sm"
            >
              📎 {file}
            </div>
          ))}
        </div>
      </div>

      {/* Assign Supervisor */}
      <div className="border rounded-lg p-4 space-y-3">
        <h3 className="font-bold mb-3 text-xl">Assign Supervisor</h3>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-lg font-light text-gray-500 mb-1">
              Select Supervisor
            </label>
            <select className="w-full border rounded px-3 py-2 text-base">
              <option >Choose a supervisor</option>
              <option>Supervisor 1</option>
              <option>Supervisor 2</option>
            </select>
          </div>
          <div>
            <label className="block text-lg font-light text-gray-500 mb-1">
              Assignment date
            </label>
            <input
              type="date"
              className="w-full border rounded px-3 py-1 text-base"
            />
          </div>
        </div>

        <div>
          <label className="block font-bold mb-3 text-xl">Additional Notes</label>
          <textarea
            className="w-full border rounded px-3 py-2 text-sm"
            rows={3}
            placeholder="Add any relevant note for the supervisor."
          ></textarea>
        </div>
      </div>

      <div className="flex justify-end gap-3">
        <Button onClick={() => navigate(-1)} className="bg-white text-blak px-4 py-1 border border-gray-300 rounded-md hover:bg-gray-100 duration-200 hover:shadow-md hover:scale-105">
          Cancel
        </Button>
        <Button className="bg-primary-600 text-white px-4 py-1 border border-gray-300 rounded-md hover:bg-primary-900 duration-200 hover:shadow-md hover:scale-105">Submit Request</Button>
      </div>
    </div>
  );
};

export default AssignFormPage;
