// src/pages/dashboard/AssignFormPage.tsx

import React, { useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@radix-ui/themes";
import { 
  IoArrowBack, 
  IoAlertCircle, 
  IoCalendar, 
  IoPerson, 
  IoTime, 
  IoChatbubbleEllipses,
  IoFlag,
  IoCheckmarkCircle,
  IoWarning
} from "react-icons/io5";

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
  const { requests, getRequestById, refreshRequests } = useServiceRequests();

  // ✅ ALL HOOKS FIRST (before any conditional returns)
  const [supervisorId, setSupervisorId] = useState("");
  const [notes, setNotes] = useState("");
  const [date, setDate] = useState(new Date().toISOString().slice(0, 16));
  const [urgency, setUrgency] = useState<Urgency>("");

  const urgencyOptions: Urgency[] = ["Low", "Medium", "High"];

  // ✅ Get request AFTER hooks but BEFORE conditional returns
  const request = getRequestById(requestId || "");

  // ✅ Filter supervisors (regular calculation, not a hook)
  const supervisors = request ? users.filter((u) => {
    if (u.role !== "supervisor") return false;

    const userPlant =
      typeof u.department?.plant === "string"
        ? u.department.plant
        : u.department?.plant?.name;

    return userPlant === request.plant;
  }) : [];

  // ✅ useMemo hook (called every time, even if request is null)
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

      if (
        req.status === "Assigned" ||
        req.status === "Pending"
      ) {
        stats[req.assignedTo].workload += 1;
      }

      if (req.status === "Resolved") {
        stats[req.assignedTo].solved += 1;
      }
    });

    return stats;
  }, [requests]);

  // Get urgency color and icon
  const getUrgencyStyles = (level: Urgency) => {
    switch(level) {
      case "High":
        return { bg: "bg-red-50", border: "border-red-200", text: "text-red-700", icon: IoWarning };
      case "Medium":
        return { bg: "bg-yellow-50", border: "border-yellow-200", text: "text-yellow-700", icon: IoAlertCircle };
      case "Low":
        return { bg: "bg-green-50", border: "border-green-200", text: "text-green-700", icon: IoCheckmarkCircle };
      default:
        return { bg: "bg-gray-50", border: "border-gray-200", text: "text-gray-700", icon: IoFlag };
    }
  };

  // ✅ Conditional return AFTER all hooks
  if (!request) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md mx-auto p-8 text-center bg-white rounded-2xl shadow-lg">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <IoWarning className="w-10 h-10 text-red-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Request Not Found
          </h2>
          <p className="text-gray-500 mb-6">
            The service request you're trying to assign doesn't exist or has been removed.
          </p>
          <Button 
            onClick={() => navigate(-1)} 
            className="inline-flex items-center gap-2 bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700 transition-all"
          >
            <IoArrowBack className="w-4 h-4" />
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  const urgencyStyles = urgency ? getUrgencyStyles(urgency) : null;

  const handleSubmit = async () => {
    if (!supervisorId || !urgency) {
      alert("Please select supervisor and urgency");
      return;
    }

    const selectedSupervisor = supervisors.find(
      (s) => s._id === supervisorId
    );

    if (!selectedSupervisor) return;

    await assignRequest(request.id, {
      assignedTo: selectedSupervisor._id,
      notes,
      assignedDate: new Date(date).toISOString(),
      urgency,
    });

    await refreshRequests();
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* HEADER with Back Button */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate(-1)}
              className="p-2 hover:bg-gray-200 rounded-xl transition-colors"
            >
              <IoArrowBack className="w-6 h-6 text-gray-600" />
            </button>
            <div>
              <h1 className="text-3xl font-bold text-gray-800">
                Assign Service Request
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                Review details and assign to appropriate supervisor
              </p>
            </div>
          </div>
          
          {/* Status Badge */}
          <div className={`px-4 py-2 rounded-full text-sm font-semibold ${
            request.status === "Pending" ? "bg-yellow-100 text-yellow-700" :
            request.status === "Assigned" ? "bg-blue-100 text-blue-700" :
            request.status === "Resolved" ? "bg-green-100 text-green-700" :
            "bg-red-100 text-red-700"
          }`}>
            {request.status}
          </div>
        </div>

        {/* REQUEST SUMMARY - Enhanced Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="bg-gradient-to-r from-primary-400 to-primary-900 px-6 py-4">
            <h3 className="font-bold text-xl text-white flex items-center gap-2">
              <IoAlertCircle className="w-5 h-5" />
              Request Details
            </h3>
          </div>
          
          <div className="p-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-blue-600 font-bold text-sm">💻</span>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wide">Device Name</p>
                    <p className="font-semibold text-gray-800">{request.deviceName}</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-purple-600 font-bold text-sm">📋</span>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wide">Problem Category</p>
                    <p className="font-semibold text-gray-800">{request.problemCategory}</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <IoCalendar className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wide">Requested Date</p>
                    <p className="font-semibold text-gray-800">
                      {new Date(request.createdAt).toLocaleDateString("en-US", {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <IoPerson className="w-5 h-5 text-orange-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wide">Requested By</p>
                    <p className="font-semibold text-gray-800">{request.requestedBy}</p>
                    <p className="text-sm text-gray-500">{request.department} • {request.plant}</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <IoChatbubbleEllipses className="w-5 h-5 text-red-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-gray-500 uppercase tracking-wide">Description</p>
                    <p className="text-gray-700 bg-gray-50 p-3 rounded-lg mt-1">{request.description}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ASSIGN SECTION */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="bg-gradient-to-r from-gray-600 to-gray-300 px-6 py-4">
            <h3 className="font-bold text-xl text-white flex items-center gap-2">
              <IoPerson className="w-5 h-5" />
              Assign to Supervisor
            </h3>
            <p className="text-gray-300 text-sm mt-1">
              Select a supervisor from the same plant ({request.plant})
            </p>
          </div>
          
          <div className="p-6">
            {/* SUPERVISOR CARDS */}
            {supervisors.length > 0 ? (
              <div className="grid md:grid-cols-2 gap-6 mb-8">
                {supervisors.map((s) => {
                  const stats = supervisorStats[s._id] || { workload: 0, solved: 0 };
                  const isSelected = supervisorId === s._id;
                  
                  return (
                    <div
                      key={s._id}
                      onClick={() => setSupervisorId(s._id)}
                      className={`
                        relative rounded-xl p-5 cursor-pointer transition-all duration-300
                        ${isSelected 
                          ? "border-2 border-primary-600 bg-gradient-to-br from-primary-50 to-white shadow-lg transform scale-[1.02]" 
                          : "border border-gray-200 hover:border-primary-400 hover:shadow-md hover:scale-[1.01]"
                        }
                      `}
                    >
                      {isSelected && (
                        <div className="absolute top-3 right-3">
                          <div className="w-6 h-6 bg-primary-600 rounded-full flex items-center justify-center">
                            <IoCheckmarkCircle className="w-4 h-4 text-white" />
                          </div>
                        </div>
                      )}
                      
                      <div className="flex items-center gap-4 mb-4">
                        <div className={`w-14 h-14 rounded-full flex items-center justify-center text-2xl font-bold
                          ${isSelected ? "bg-primary-600 text-white" : "bg-gray-200 text-gray-600"}
                        `}>
                          {s.firstName.charAt(0)}{s.lastName.charAt(0)}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-bold text-lg text-gray-800">
                            {s.firstName} {s.lastName}
                          </h4>
                          <p className="text-sm text-gray-500">Supervisor</p>
                        </div>
                      </div>

                      {/* STATS */}
                      <div className="grid grid-cols-2 gap-3">
                        <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-3 text-center">
                          <p className="text-xs text-orange-600 font-medium mb-1">Current Workload</p>
                          <h3 className="text-2xl font-bold text-orange-700">{stats.workload}</h3>
                          <p className="text-xs text-orange-500 mt-1">active tasks</p>
                        </div>
                        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-3 text-center">
                          <p className="text-xs text-green-600 font-medium mb-1">Tasks Solved</p>
                          <h3 className="text-2xl font-bold text-green-700">{stats.solved}</h3>
                          <p className="text-xs text-green-500 mt-1">completed</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-12 bg-gray-50 rounded-xl mb-8">
                <IoPerson className="w-16 h-16 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-500 font-medium">No supervisors found</p>
                <p className="text-sm text-gray-400 mt-1">No supervisors available in {request.plant}</p>
              </div>
            )}

            {/* ASSIGNMENT DETAILS */}
            <div className="space-y-6 border-t border-gray-200 pt-6">
              {/* Assignment Date */}
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                  <IoCalendar className="w-4 h-4 text-primary-600" />
                  Assign  for 
                </label>
                <input
                  type="datetime-local"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full md:w-96 border border-gray-300 rounded-lg px-4 py-2.5 text-gray-700 focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                />
              </div>

              {/* Urgency Level */}
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                  <IoFlag className="w-4 h-4 text-primary-600" />
                  Urgency Level
                </label>
                <p className="text-xs text-gray-500 mb-3">
                  Specify how urgent this request needs to be addressed
                </p>
                
                <div className="flex gap-3">
                  {urgencyOptions.map((level) => {
                    const styles = getUrgencyStyles(level);
                    const Icon = styles.icon;
                    const isActive = urgency === level;
                    
                    return (
                      <button
                        key={level}
                        onClick={() => setUrgency(level)}
                        className={`
                          flex items-center gap-2 px-6 py-2.5 rounded-lg font-medium transition-all
                          ${isActive 
                            ? `${styles.bg} ${styles.border} border-2 ${styles.text} shadow-md` 
                            : "bg-gray-50 border border-gray-200 text-gray-600 hover:bg-gray-100"
                          }
                        `}
                      >
                        <Icon className="w-4 h-4" />
                        {level}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                  <IoChatbubbleEllipses className="w-4 h-4 text-primary-600" />
                  Additional Notes
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-700 focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all resize-none"
                  rows={4}
                  placeholder="Add any special instructions or relevant information for the supervisor..."
                />
              </div>
            </div>
          </div>
        </div>

        {/* ACTION BUTTONS */}
        <div className="flex justify-end gap-4 pt-4">
          <Button
            onClick={() => navigate(-1)}
            className="px-6 py-2.5 bg-white text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-all font-medium"
          >
            Cancel
          </Button>

          <Button
            onClick={handleSubmit}
            disabled={!supervisorId || !urgency}
            className={`
              px-8 py-2.5 rounded-lg font-semibold transition-all flex items-center gap-2
              ${!supervisorId || !urgency 
                ? "bg-gray-300 text-gray-500 cursor-not-allowed" 
                : "bg-gradient-to-r from-primary-400 to-primary-900 text-white hover:shadow-lg hover:scale-[1.02]"
              }
            `}
          >
            <IoCheckmarkCircle className="w-5 h-5" />
            Submit Assignment
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AssignFormPage;