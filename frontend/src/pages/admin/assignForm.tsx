// src/pages/dashboard/AssignFormPage.tsx

import React, { useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@radix-ui/themes";

import {
  useServiceRequests,
  Urgency,
} from "../../context/ServiceRequestContext";

import { useUserContext } from "../../context/UserContext";

import { assignRequest } from "../../api/request.api";

const AssignFormPage: React.FC = () => {
  const { requestId } = useParams();

  const navigate = useNavigate();

  const { users } = useUserContext();

  const {
    requests,
    getRequestById,
    refreshRequests,
  } = useServiceRequests();

  const [supervisorId, setSupervisorId] =
    useState("");

  const [notes, setNotes] = useState("");

  
  // ✅ ASSIGN DATE WITH TIME
const [date, setDate] = useState(
  new Date().toISOString().slice(0, 16)
);

  const [urgency, setUrgency] =
    useState<Urgency>("");

    

  const urgencyOptions: Urgency[] = [
    "Low",
    "Medium",
    "High",
  ];

  const request = getRequestById(requestId || "");

  if (!request) {
    return (
      <div className="max-w-3xl mx-auto p-6 text-center text-red-600">
        <h2 className="text-xl font-semibold">
          Request not found
        </h2>

        <Button
          onClick={() => navigate(-1)}
          className="mt-4"
        >
          Go Back
        </Button>
      </div>
    );
  }

  /* =========================
     ✅ SUPERVISORS SAME PLANT
  ========================== */

  const supervisors = users.filter((u) => {
    if (u.role !== "supervisor") return false;

    const userPlant =
      typeof u.department?.plant === "string"
        ? u.department.plant
        : u.department?.plant?.name;

    return userPlant === request.plant;
  });

  /* =========================
     ✅ WORKLOAD + SOLVED
  ========================== */

  const supervisorStats = useMemo(() => {
    const stats: Record<
      string,
      {
        workload: number;
        solved: number;
      }
    > = {};

    requests.forEach((req) => {
      if (!req.assignedTo) return;

      if (!stats[req.assignedTo]) {
        stats[req.assignedTo] = {
          workload: 0,
          solved: 0,
        };
      }

      // ✅ Current workload
      if (
        req.status === "Assigned" ||
        req.status === "Pending"
      ) {
        stats[req.assignedTo].workload += 1;
      }

      // ✅ Completed tasks
      if (req.status === "Resolved") {
        stats[req.assignedTo].solved += 1;
      }
    });

    return stats;
  }, [requests]);

  /* =========================
     ✅ SUBMIT
  ========================== */

  const handleSubmit = async () => {
    if (!supervisorId || !urgency) {
      alert(
        "Please select supervisor and urgency"
      );
      return;
    }

    const selectedSupervisor = supervisors.find(
      (s) => s._id === supervisorId
    );

    if (!selectedSupervisor) return;

    await assignRequest(request.id, {
      assignedTo: selectedSupervisor._id,
      notes,
      // ✅ save full date + time
    assignedDate: new Date(date).toISOString(),
      urgency,
    });

    await refreshRequests();

    navigate("/dashboard");
  };

  return (
    <div className="max-w-5xl mx-auto space-y-4">
      {/* HEADER */}
      <h2 className="text-3xl font-bold text-gray-800">
        Assign Request - {request.deviceName}
      </h2>

      {/* =========================
          REQUEST SUMMARY
      ========================== */}

      <div className="border rounded-lg p-4 bg-white">
        <h3 className="font-bold mb-3 text-xl">
          Request Summary
        </h3>

        <p>
          <strong>Description:</strong>{" "}
          {request.description}
        </p>

        <p>
          <strong>Status:</strong>{" "}
          {request.status}
        </p>

        <p>
          <strong>Problem Category:</strong>{" "}
          {request.problemCategory}
        </p>

        <p>
          <strong>Requested Date:</strong>{" "}
          {new Date(
            request.createdAt
          ).toLocaleDateString("en-US")}
        </p>
      </div>

      {/* =========================
          ASSIGN SECTION
      ========================== */}

      <div className="border rounded-lg p-4 space-y-4 bg-white">
        <h3 className="font-bold mb-2 text-xl">
          Assign Supervisor
        </h3>

        {/* =========================
            SUPERVISOR CARDS
        ========================== */}

        <div className="grid md:grid-cols-2 gap-4">
          {supervisors.length > 0 ? (
            supervisors.map((s) => {
              const stats =
                supervisorStats[s._id] || {
                  workload: 0,
                  solved: 0,
                };

              return (
                <div
                  key={s._id}
                  onClick={() =>
                    setSupervisorId(s._id)
                  }
                  className={`border rounded-xl p-4 cursor-pointer transition-all ${
                    supervisorId === s._id
                      ? "border-primary-600 bg-primary-50"
                      : "border-gray-300 hover:border-primary-400"
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-bold text-lg">
                        {s.firstName}{" "}
                        {s.lastName}
                      </h4>

                      <p className="text-sm text-gray-500">
                        Supervisor
                      </p>
                    </div>

                    <input
                      type="radio"
                      checked={
                        supervisorId === s._id
                      }
                      readOnly
                    />
                  </div>

                  {/* STATS */}
                  <div className="grid grid-cols-2 gap-3 mt-4">
                    <div className="border rounded-lg p-3 bg-gray-50">
                      <p className="text-xs text-gray-500">
                        Current Workload
                      </p>

                      <h3 className="text-2xl font-bold text-orange-600">
                        {stats.workload}
                      </h3>
                    </div>

                    <div className="border rounded-lg p-3 bg-gray-50">
                      <p className="text-xs text-gray-500">
                        Tasks Solved
                      </p>

                      <h3 className="text-2xl font-bold text-green-600">
                        {stats.solved}
                      </h3>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <p className="text-gray-500">
              No supervisors found
            </p>
          )}
        </div>

        {/* =========================
            ASSIGNMENT DATE
        ========================== */}

        <div>
  <label className="block text-gray-500 mb-1">
    Assignment Date
  </label>

  <input
    type="datetime-local"
    value={date}
    onChange={(e) => setDate(e.target.value)}
    className="w-full border rounded px-3 py-2 text-base"
  />
</div>

        {/* =========================
            URGENCY
        ========================== */}

        <div className="mt-4">
          <label className="block font-semibold text-2xl">
            Urgency level
          </label>

          <p className="text-gray-500 text-sm mb-4">
            Specify urgency level accurately.
          </p>

          <select
            value={urgency}
            onChange={(e) =>
              setUrgency(
                e.target.value as Urgency
              )
            }
            className="w-60 border border-black rounded-md p-2 focus:outline-none focus:ring-1 focus:ring-gray-300"
          >
            <option value="">
              Select urgency
            </option>

            {urgencyOptions.map((level) => (
              <option
                key={level}
                value={level}
              >
                {level}
              </option>
            ))}
          </select>
        </div>

        {/* =========================
            NOTES
        ========================== */}

        <div className="mt-4">
          <label className="block font-bold mb-2">
            Additional Notes
          </label>

          <textarea
            value={notes}
            onChange={(e) =>
              setNotes(e.target.value)
            }
            className="w-full border rounded px-3 py-2 text-sm"
            rows={3}
            placeholder="Add any relevant note."
          />
        </div>
      </div>

      {/* =========================
          ACTION BUTTONS
      ========================== */}

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