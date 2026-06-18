// src/pages/dashboard/AssignFormPage.tsx

import React, { useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@radix-ui/themes";
import { 
  IoArrowBack, 
  IoAlertCircle, 
  IoCalendar, 
  IoPerson, 
  IoChatbubbleEllipses,
  IoFlag,
  IoCheckmarkCircle,
  IoWarning,
  IoStatsChart,
  IoCheckmarkDoneCircle
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

  // Get urgency color and icon using your custom color palette
  const getUrgencyStyles = (level: Urgency) => {
    switch(level) {
      case "High":
        return { 
          bg: "bg-red-50", 
          border: "border-red-200", 
          text: "text-red-700", 
          icon: IoWarning,
          buttonBg: "bg-red-500 hover:bg-red-600",
          badgeBg: "bg-red-100 text-red-700"
        };
      case "Medium":
        return { 
          bg: "bg-orange-50", 
          border: "border-orange-200", 
          text: "text-orange-700", 
          icon: IoAlertCircle,
          buttonBg: "bg-orange-500 hover:bg-orange-600",
          badgeBg: "bg-orange-100 text-orange-700"
        };
      case "Low":
        return { 
          bg: "bg-green-50", 
          border: "border-green-200", 
          text: "text-green-700", 
          icon: IoCheckmarkCircle,
          buttonBg: "bg-primary-700 hover:bg-primary-800",
          badgeBg: "bg-green-100 text-green-700"
        };
      default:
        return { 
          bg: "bg-gray-50", 
          border: "border-gray-200", 
          text: "text-gray-700", 
          icon: IoFlag,
          buttonBg: "bg-gray-500 hover:bg-gray-600",
          badgeBg: "bg-gray-100 text-gray-700"
        };
    }
  };

  // Get status badge styles
  const getStatusStyles = (status: string) => {
    switch(status) {
      case "Pending":
        return "bg-yellow-100 text-yellow-700";
      case "Assigned":
        return "bg-blue-100 text-blue-600";
      case "Resolved":
        return "bg-green-100 text-green-700";
      case "Unresolved":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  // ✅ Conditional return AFTER all hooks
  if (!request) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-light-200">
        <div className="max-w-md mx-auto p-8 text-center bg-white rounded-2xl shadow-lg">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <IoWarning className="w-10 h-10 text-red-500" />
          </div>
          <h2 className="text-2xl font-bold text-dark-400 mb-2">
            Request Not Found
          </h2>
          <p className="text-dark-600 mb-6">
            The service request you're trying to assign doesn't exist or has been removed.
          </p>
          <Button 
            onClick={() => navigate(-1)} 
            className="inline-flex items-center gap-2 bg-primary-700 text-white px-6 py-2 rounded-lg hover:bg-primary-800 transition-all"
          >
            <IoArrowBack className="w-4 h-4" />
            Go Back
          </Button>
        </div>
      </div>
    );
  }

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
    <div className="min-h-screen bg-light-200 py-8 px-4">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* HEADER with Back Button */}
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate(-1)}
              className="p-2 hover:bg-white rounded-xl transition-colors"
            >
              <IoArrowBack className="w-6 h-6 text-dark-600" />
            </button>
            <div>
              <h1 className="text-3xl font-bold text-dark-400">
                Assign Service Request
              </h1>
              <p className="text-sm text-dark-600 mt-1">
                Review details and assign to appropriate supervisor
              </p>
            </div>
          </div>
          
          {/* Status Badge */}
          <div className={`px-4 py-2 rounded-full text-sm font-semibold ${getStatusStyles(request.status)}`}>
            {request.status}
          </div>
        </div>

        {/* REQUEST SUMMARY - Enhanced Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-light-200 overflow-hidden">
          <div className="bg-gradient-to-r from-primary-500 to-primary-900 px-6 py-4">
            <h3 className="font-bold text-xl text-white flex items-center gap-2">
              <IoAlertCircle className="w-5 h-5" />
              Request Details
            </h3>
          </div>
          
          <div className="p-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-blue-600 font-bold text-sm">💻</span>
                  </div>
                  <div>
                    <p className="text-xs text-dark-600 uppercase tracking-wide">Device Name</p>
                    <p className="font-semibold text-dark-400">{request.deviceName}</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-purple-600 font-bold text-sm">📋</span>
                  </div>
                  <div>
                    <p className="text-xs text-dark-600 uppercase tracking-wide">Problem Category</p>
                    <p className="font-semibold text-dark-400">{request.problemCategory}</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <IoCalendar className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-xs text-dark-600 uppercase tracking-wide">Requested Date</p>
                    <p className="font-semibold text-dark-400">
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
              
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <IoPerson className="w-5 h-5 text-orange-600" />
                  </div>
                  <div>
                    <p className="text-xs text-dark-600 uppercase tracking-wide">Requested By</p>
                    <p className="font-semibold text-dark-400">{request.requestedBy}</p>
                    <p className="text-sm text-dark-600">{request.department} • {request.plant}</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <IoChatbubbleEllipses className="w-5 h-5 text-red-500" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-dark-600 uppercase tracking-wide">Description</p>
                    <p className="text-dark-400 bg-light-200 p-3 rounded-lg mt-1">{request.description}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ASSIGN SECTION */}
        <div className="bg-white rounded-2xl shadow-sm border border-light-200 overflow-hidden">
          <div className="bg-gradient-to-r from-dark-400 to-dark-700 px-6 py-4">
            <h3 className="font-bold text-xl text-white flex items-center gap-2">
              <IoPerson className="w-5 h-5" />
              Assign to Supervisor
            </h3>
            <p className="text-dark-700 text-sm mt-1">
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
                          ? "border-2 border-primary-500 bg-gradient-to-br from-primary-50 to-white shadow-lg transform scale-[1.02]" 
                          : "border border-light-200 hover:border-primary-400 hover:shadow-md hover:scale-[1.01]"
                        }
                      `}
                    >
                      {isSelected && (
                        <div className="absolute top-3 right-3">
                          <div className="w-6 h-6 bg-primary-500 rounded-full flex items-center justify-center">
                            <IoCheckmarkCircle className="w-4 h-4 text-white" />
                          </div>
                        </div>
                      )}
                      
                      <div className="flex items-center gap-4 mb-4">
                        <div className={`w-14 h-14 rounded-full flex items-center justify-center text-2xl font-bold
                          ${isSelected ? "bg-primary-500 text-white" : "bg-light-200 text-dark-500"}
                        `}>
                          {s.firstName.charAt(0)}{s.lastName.charAt(0)}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-bold text-lg text-dark-400">
                            {s.firstName} {s.lastName}
                          </h4>
                          <p className="text-sm text-dark-600">Supervisor</p>
                        </div>
                      </div>

                      {/* STATS */}
                      <div className="grid grid-cols-2 gap-3">
                        <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-3 text-center">
                          <IoStatsChart className="w-4 h-4 text-orange-600 mx-auto mb-1" />
                          <p className="text-xs text-orange-600 font-medium">Current Workload</p>
                          <h3 className="text-2xl font-bold text-orange-600">{stats.workload}</h3>
                          <p className="text-xs text-orange-500 mt-1">active tasks</p>
                        </div>
                        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-3 text-center">
                          <IoCheckmarkDoneCircle className="w-4 h-4 text-green-600 mx-auto mb-1" />
                          <p className="text-xs text-green-600 font-medium">Tasks Solved</p>
                          <h3 className="text-2xl font-bold text-green-600">{stats.solved}</h3>
                          <p className="text-xs text-green-500 mt-1">completed</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-12 bg-light-200 rounded-xl mb-8">
                <IoPerson className="w-16 h-16 text-dark-600 mx-auto mb-3" />
                <p className="text-dark-500 font-medium">No supervisors found</p>
                <p className="text-sm text-dark-600 mt-1">No supervisors available in {request.plant}</p>
              </div>
            )}

            {/* ASSIGNMENT DETAILS */}
            <div className="space-y-6 border-t border-light-200 pt-6">
              {/* Assignment Date */}
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-dark-400 mb-2">
                  <IoCalendar className="w-4 h-4 text-primary-500" />
                  Assignment Date & Time
                </label>
                <input
                  type="datetime-local"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full md:w-96 border border-light-200 rounded-lg px-4 py-2.5 text-dark-400 focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                />
              </div>

              {/* Urgency Level */}
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-dark-400 mb-2">
                  <IoFlag className="w-4 h-4 text-primary-500" />
                  Urgency Level
                </label>
                <p className="text-xs text-dark-600 mb-3">
                  Specify how urgent this request needs to be addressed
                </p>
                
                <div className="flex flex-wrap gap-3">
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
                            : "bg-light-200 border border-light-200 text-dark-600 hover:bg-gray-100"
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
                <label className="flex items-center gap-2 text-sm font-semibold text-dark-400 mb-2">
                  <IoChatbubbleEllipses className="w-4 h-4 text-primary-500" />
                  Additional Notes
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full border border-light-200 rounded-lg px-4 py-3 text-dark-400 focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all resize-none"
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
            className="px-6 py-2.5 bg-white text-dark-500 border border-light-200 rounded-lg hover:bg-light-200 transition-all font-medium"
          >
            Cancel
          </Button>

          <Button
            onClick={handleSubmit}
            disabled={!supervisorId || !urgency}
            className={`
              px-8 py-2.5 rounded-lg font-semibold transition-all flex items-center gap-2
              ${!supervisorId || !urgency 
                ? "bg-dark-600 text-dark-700 cursor-not-allowed" 
                : "bg-gradient-to-r from-primary-500 to-primary-900 text-white hover:shadow-lg hover:scale-[1.02]"
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