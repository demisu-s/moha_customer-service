import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@radix-ui/themes";
import { useServiceRequests, Urgency } from "../../context/ServiceRequestContext";
import { useUserContext } from "../../context/UserContext";

const AssignFormPage: React.FC = () => {
  const { requestId } = useParams();
  const navigate = useNavigate();
  const { users } = useUserContext();
  const { getRequestById, updateRequest } = useServiceRequests();

  const [supervisorId, setSupervisorId] = useState("");
  const [notes, setNotes] = useState("");
  const [date, setDate] = useState("");
  const [urgency, setUrgency] = useState<Urgency>("");

  const request = getRequestById(requestId || "");
  const supervisors = users.filter((u) => u.role === "Supervisor");

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

  const handleSubmit = () => {
    if (!supervisorId || !urgency) {
      alert("Please select supervisor and urgency");
      return;
    }

    const selectedSupervisor = supervisors.find(
      (s) => s.userId === supervisorId
    );
    if (!selectedSupervisor) return;

    updateRequest(request.id, {
      status: "Assigned",
      assignedTo: selectedSupervisor.userId,
      assignedToName: `${selectedSupervisor.firstName} ${selectedSupervisor.lastName}`,
      notes,
      assignedDate: date,
      urgency,
    });

    navigate("/dashboard");
  };

  return (
    <div className="max-w-5xl mx-auto space-y-4">
      <h2 className="text-3xl font-bold text-gray-800">
        Assign Request - {request.deviceSerial}
      </h2>

      <div className="border rounded-lg p-4 bg-white">
        <h3 className="font-bold mb-3 text-xl">Request Summary</h3>
        <p><strong>Description:</strong> {request.description}</p>
        <p><strong>Status:</strong> {request.status}</p>
        <p><strong>Problem Category:</strong>{request.problemCategory}</p>
        <p> <strong>Requested Date:</strong>{request.requestedDate}</p>
      </div>

      <div className="border rounded-lg p-4 space-y-3 bg-white">
        <h3 className="font-bold mb-3 text-xl">Assign Supervisor</h3>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-500 mb-1">Select Supervisor</label>
            <select
              value={supervisorId}
              onChange={(e) => setSupervisorId(e.target.value)}
              className="w-full border rounded px-3 py-2 text-base"
            >
              <option value="">Choose a supervisor</option>
              {supervisors.length > 0 ? (
                supervisors.map((s) => (
                  <option key={s.userId} value={s.userId}>
                    {s.firstName} {s.lastName}
                  </option>
                ))
              ) : (
                <option disabled>No supervisors found</option>
              )}
            </select>
          </div>

          <div>
            <label className="block text-gray-500 mb-1">Assignment Date</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full border rounded px-3 py-1 text-base"
            />
          </div>
        </div>

        <div className="mt-4">
          <label className="block font-semibold text-2xl">Urgency level</label>
          <p className="text-gray-500 text-sm mb-4">
            Specify urgency level accurately.
          </p>
          <select
            value={urgency}
            onChange={(e) => setUrgency(e.target.value as Urgency)}
            className="w-60 border border-black rounded-md p-2 focus:outline-none focus:ring-1 focus:ring-gray-300"
          >
            <option value="">Select urgency</option>
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>
        </div>

        <div className="mt-4">
          <label className="block font-bold mb-2">Additional Notes</label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full border rounded px-3 py-2 text-sm"
            rows={3}
            placeholder="Add any relevant note."
          />
        </div>
      </div>

      <div className="flex justify-end gap-3">
        <Button
          onClick={() => navigate(-1)}
          className="bg-white text-black px-4 py-1 border border-gray-300 rounded-md hover:bg-gray-100"
        >
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          className="bg-primary-600 text-white px-4 py-1 rounded-md hover:bg-primary-900"
        >
          Submit Assignment
        </Button>
      </div>
    </div>
  );
};

export default AssignFormPage;
