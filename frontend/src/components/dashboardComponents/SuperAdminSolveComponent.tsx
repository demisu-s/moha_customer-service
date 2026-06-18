// src/components/dashboardComponents/SuperAdminSolveComponent.tsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@radix-ui/themes";
import {
  useServiceRequests,
  Issues,
  PROBLEM_TYPES,
  PROBLEM_CATEGORY,
  Urgency,
  ProblemCategory,
} from "../../context/ServiceRequestContext";
import { useUserContext } from "../../context/UserContext";
import { useDeviceContext } from "../../context/DeviceContext";
import { 
  IoArrowBack, 
  IoPerson, 
  IoDesktopOutline, 
  IoCalendar, 
  IoChatbubbleEllipses,
  IoFlag,
  IoWarning,
  IoCheckmarkCircle,
  IoCloseCircle,
  IoDocumentTextOutline,
  IoConstructOutline,
  IoTimeOutline,
  IoAlertCircleOutline,
  IoCheckmarkDoneCircle,
  IoClipboardOutline
} from "react-icons/io5";

const SuperAdminSolveComponent: React.FC = () => {
  const { requestId } = useParams();
  const navigate = useNavigate();
  const { getRequestById, updateRequest } = useServiceRequests();
  const { users, currentUser } = useUserContext();
  const { devices } = useDeviceContext();
  const [urgency, setUrgency] = useState<Urgency>("Low");
  const urgencyOptions: Urgency[] = ["Low", "Medium", "High"];

  const [solution, setSolution] = useState("");
  const [issues, setIssues] = useState<Issues | "">("");

  const request = getRequestById(requestId || "");
  const [problemCategory, setProblemCategory] = useState<ProblemCategory>("Software");
  const categories = PROBLEM_CATEGORY;

  useEffect(() => {
    if (request) {
      setProblemCategory(request.problemCategory || "Software");
      if (request.issues) {
        setIssues(request.issues);
      }
      // ✅ Set urgency from request or default to "Low"
      setUrgency(request.urgency || "Low");
    }
  }, [request]);

  const getUrgencyStyles = (level: Urgency) => {
    switch(level) {
      case "High":
        return { bg: "bg-red-50", border: "border-red-200", text: "text-red-700", icon: IoWarning, buttonBg: "bg-red-500 hover:bg-red-600" };
      case "Medium":
        return { bg: "bg-orange-50", border: "border-orange-200", text: "text-orange-700", icon: IoAlertCircleOutline, buttonBg: "bg-orange-500 hover:bg-orange-600" };
      case "Low":
        return { bg: "bg-green-50", border: "border-green-200", text: "text-green-700", icon: IoCheckmarkCircle, buttonBg: "bg-green-500 hover:bg-green-600" };
      default:
        return { bg: "bg-gray-50", border: "border-gray-200", text: "text-gray-700", icon: IoFlag, buttonBg: "bg-gray-500 hover:bg-gray-600" };
    }
  };

  if (!request) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-light-200 to-gray-100 px-4">
        <div className="max-w-md w-full mx-auto p-6 sm:p-8 text-center bg-white rounded-2xl shadow-xl">
          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <IoWarning className="w-8 h-8 sm:w-10 sm:h-10 text-red-500" />
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-dark-400 mb-2">
            Request Not Found
          </h2>
          <p className="text-sm sm:text-base text-dark-600 mb-6">
            The service request you're trying to solve doesn't exist or has been removed.
          </p>
          <Button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-primary-500 to-primary-700 text-white px-4 sm:px-6 py-2 sm:py-2.5 rounded-lg hover:shadow-lg transition-all text-sm sm:text-base"
          >
            <IoArrowBack className="w-4 h-4" />
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  const requester = users.find((u) => u._id === request.requestedBy);
  const device = devices.find((d) => d._id === request.deviceId);
  const urgencyStyle = getUrgencyStyles(urgency as Urgency);
  const UrgencyIcon = urgencyStyle.icon;

  const solver = currentUser;
  const solverName = solver ? `${solver.firstName} ${solver.lastName}` : "Unknown";
  const solverId = solver?._id || "";
  const solverDisplayRole = "admin";

  const handleSolve = async (status: "Resolved" | "Unresolved") => {
    const now = new Date().toISOString();
    
    const updateData = {
      status,
      solution: solution || request.solution || "",
      issues: (issues || request.issues) as Issues | undefined,
      problemCategory: problemCategory || request.problemCategory || "Software",
      resolvedDate: now,
      urgency: urgency || request.urgency || "Low",
      resolvedBy: solverId,
      assignedTo: solverId,
      assignedToName: solverName,
    };
    
    console.log("📝 SuperAdmin solving with data:", updateData);
    
    try {
      await updateRequest(request.id || request._id, updateData);
      navigate("/dashboard");
    } catch (error) {
      console.error("Failed to update request:", error);
    }
  };

  const formattedDate = new Date(request.createdAt).toLocaleString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });

  return (
    <div className="min-h-screen bg-gray-50 py-4 sm:py-8 px-3 sm:px-4">
      <div className="max-w-6xl mx-auto space-y-4 sm:space-y-6">
        {/* Header */}
        <div className="relative overflow-hidden bg-light-200 rounded-xl sm:rounded-2xl shadow-xl">
          <div className="absolute inset-0 opacity-10"></div>
          <div className="relative px-4 sm:px-6 py-4 sm:py-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
              <div className="flex items-center gap-3 sm:gap-4 w-full sm:w-auto">
                <button
                  onClick={() => navigate(-1)}
                  className="p-1.5 sm:p-2 hover:bg-white rounded-xl transition-colors flex-shrink-0"
                >
                  <IoArrowBack className="w-5 h-5 sm:w-6 sm:h-6 text-dark-600" />
                </button>
                <div className="min-w-0 flex-1">
                  <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-black mb-0.5 sm:mb-1 truncate">
                    Solve Service Request
                  </h1>
                  <p className="text-xs sm:text-sm text-primary-100 flex items-center gap-1 sm:gap-2 truncate">
                    <IoConstructOutline className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                    <span className="truncate">{device ? device.deviceName : request.serialNumber}</span>
                  </p>
                </div>
              </div>
              
              <div className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full ${urgencyStyle.bg} ${urgencyStyle.text} border ${urgencyStyle.border} shadow-sm backdrop-blur-sm flex-shrink-0`}>
                <UrgencyIcon className="w-3 h-3 sm:w-4 sm:h-4" />
                <span className="text-xs sm:text-sm font-semibold whitespace-nowrap">{urgency || request.urgency || 'Normal'} Urgency</span>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-xl overflow-hidden">
          {/* Request Details */}
          <div className="border-b border-light-200">
            <div className="bg-gradient-to-r from-dark-400 to-dark-800 px-4 sm:px-6 py-3 sm:py-4">
              <h3 className="font-bold text-lg sm:text-xl text-white flex items-center gap-2">
                <IoDocumentTextOutline className="w-4 h-4 sm:w-5 sm:h-5" />
                Request Details
              </h3>
              <p className="text-xs sm:text-sm text-gray-300 mt-0.5 sm:mt-1">Complete information about the service request</p>
            </div>
            
            <div className="p-4 sm:p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                {/* Left Column */}
                <div className="space-y-3 sm:space-y-4">
                  {/* Requester */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between p-3 sm:p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl border-l-4 border-blue-500 gap-2 sm:gap-0">
                    <div className="flex items-center gap-2 sm:gap-3">
                      <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center shadow-md flex-shrink-0">
                        <IoPerson className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                      </div>
                      <div>
                        <p className="text-[10px] sm:text-xs text-blue-600 uppercase tracking-wide font-semibold">Requester</p>
                        <p className="text-xs sm:text-sm text-dark-500 hidden sm:block">Person who reported issue</p>
                      </div>
                    </div>
                    <div className="text-left sm:text-right">
                      <p className="font-bold text-dark-400 text-sm sm:text-base break-words">
                        {requester ? `${requester.firstName} ${requester.lastName}` : request.requestedBy}
                      </p>
                    </div>
                  </div>

                  {/* Device */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between p-3 sm:p-4 bg-gradient-to-r from-purple-50 to-purple-100 rounded-xl border-l-4 border-purple-500 gap-2 sm:gap-0">
                    <div className="flex items-center gap-2 sm:gap-3">
                      <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center shadow-md flex-shrink-0">
                        <IoDesktopOutline className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                      </div>
                      <div>
                        <p className="text-[10px] sm:text-xs text-purple-600 uppercase tracking-wide font-semibold">Device</p>
                        <p className="text-xs sm:text-sm text-dark-500 hidden sm:block">Hardware information</p>
                      </div>
                    </div>
                    <div className="text-left sm:text-right">
                      <p className="font-bold text-dark-400 text-sm sm:text-base break-words">
                        {device ? `${device.deviceName} (${device.deviceType})` : "Unknown"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Right Column */}
                <div className="space-y-3 sm:space-y-4">
                  {/* Solved By */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between p-3 sm:p-4 bg-gradient-to-r from-green-50 to-green-100 rounded-xl border-l-4 border-green-500 gap-2 sm:gap-0">
                    <div className="flex items-center gap-2 sm:gap-3">
                      <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center shadow-md flex-shrink-0">
                        <IoCheckmarkDoneCircle className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                      </div>
                      <div>
                        <p className="text-[10px] sm:text-xs text-green-600 uppercase tracking-wide font-semibold">Solved By</p>
                        <p className="text-xs sm:text-sm text-dark-500 hidden sm:block">Admin who will solve</p>
                      </div>
                    </div>
                    <div className="text-left sm:text-right">
                      <p className="font-bold text-dark-400 text-sm sm:text-base break-words">
                        {solverName}
                      </p>
                      <span className="text-xs text-gray-500">
                        ({solverDisplayRole})
                      </span>
                    </div>
                  </div>

                  {/* Requested Date */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between p-3 sm:p-4 bg-gradient-to-r from-orange-50 to-orange-100 rounded-xl border-l-4 border-orange-500 gap-2 sm:gap-0">
                    <div className="flex items-center gap-2 sm:gap-3">
                      <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center shadow-md flex-shrink-0">
                        <IoCalendar className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                      </div>
                      <div>
                        <p className="text-[10px] sm:text-xs text-orange-600 uppercase tracking-wide font-semibold">Requested Date</p>
                        <p className="text-xs sm:text-sm text-dark-500 hidden sm:block">Submission timestamp</p>
                      </div>
                    </div>
                    <div className="text-left sm:text-right">
                      <p className="font-bold text-dark-400 text-sm sm:text-base break-words">{formattedDate}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Problem Description */}
              <div className="mt-4 sm:mt-6">
                <div className="relative">
                  <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-primary-500 to-primary-700 rounded-full"></div>
                  <div className="pl-3 sm:pl-4">
                    <div className="bg-gradient-to-br from-gray-50 to-light-200 rounded-xl p-3 sm:p-5">
                      <div className="flex items-start gap-2 sm:gap-3">
                        <IoChatbubbleEllipses className="w-4 h-4 sm:w-5 sm:h-5 text-primary-500 mt-0.5 sm:mt-1 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="text-[10px] sm:text-xs text-dark-600 uppercase tracking-wide font-semibold mb-1 sm:mb-2">Problem Description</p>
                          <p className="text-sm sm:text-base text-dark-400 leading-relaxed break-words">{request.description}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Solution Section */}
          <div className="p-4 sm:p-6">
            <div className="space-y-4 sm:space-y-6">
              {/* Problem Category */}
              <div>
                <label className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-dark-400 mb-1.5 sm:mb-2">
                  <IoClipboardOutline className="w-4 h-4 text-primary-500" />
                  Problem Category
                </label>
                <select
                  value={problemCategory}
                  onChange={(e) => setProblemCategory(e.target.value as ProblemCategory)}
                  className="w-full border border-light-200 rounded-lg px-3 sm:px-4 py-2 sm:py-2.5 text-sm sm:text-base text-dark-400 focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all bg-white"
                >
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
                <p className="text-[10px] sm:text-xs text-yellow-600 mt-1.5 sm:mt-2 flex items-center gap-1">
                  <IoWarning className="w-3 h-3" />
                  Change this only if the user selected the wrong problem category
                </p>
              </div>

              {/* ✅ GRID: Problem Type + Urgency Level */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                {/* Problem Type */}
                <div>
                  <label className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-dark-400 mb-1.5 sm:mb-2">
                    <IoAlertCircleOutline className="w-4 h-4 text-primary-500" />
                    Problem Type
                  </label>
                  <select
                    value={issues}
                    onChange={(e) => setIssues(e.target.value as Issues)}
                    className="w-full border border-light-200 rounded-lg px-3 sm:px-4 py-2 sm:py-2.5 text-sm sm:text-base text-dark-400 focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all bg-white"
                  >
                    <option value="">Select problem type</option>
                    {PROBLEM_TYPES.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </div>

                {/* ✅ URGENCY LEVEL - THIS WAS MISSING! */}
                <div>
                  <label className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-dark-400 mb-1.5 sm:mb-2">
                    <IoFlag className="w-4 h-4 text-primary-500" />
                    Urgency Level
                  </label>
                  <div className="flex flex-wrap gap-2 sm:gap-3">
                    {urgencyOptions.map((level) => {
                      const styles = getUrgencyStyles(level);
                      const Icon = styles.icon;
                      const isActive = urgency === level;
                      
                      return (
                        <button
                          key={level}
                          onClick={() => setUrgency(level)}
                          className={`
                            flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg font-medium transition-all text-xs sm:text-sm
                            ${isActive 
                              ? `${styles.bg} ${styles.border} border-2 ${styles.text} shadow-md` 
                              : "bg-light-200 border border-light-200 text-dark-600 hover:bg-gray-100"
                            }
                          `}
                        >
                          <Icon className="w-3 h-3 sm:w-4 sm:h-4" />
                          {level}
                        </button>
                      );
                    })}
                  </div>
                  {/* ✅ Show current urgency for debugging */}
                  <p className="text-xs text-gray-400 mt-1">
                    Selected: {urgency || "Low"}
                  </p>
                </div>
              </div>

              {/* Solution Details */}
              <div>
                <label className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-dark-400 mb-1.5 sm:mb-2">
                  <IoConstructOutline className="w-4 h-4 text-primary-500" />
                  Solution Details
                </label>
                <textarea
                  value={solution}
                  onChange={(e) => setSolution(e.target.value)}
                  rows={4}
                  className="w-full border border-light-200 rounded-lg px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base text-dark-400 focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all resize-none"
                  placeholder="Describe the solution provided to resolve this issue..."
                />
              </div>

              {/* Resolved Date */}
              <div>
                <label className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-dark-400 mb-1.5 sm:mb-2">
                  <IoTimeOutline className="w-4 h-4 text-primary-500" />
                  Resolved Date
                </label>
                <div className="relative">
                  <input
                    type="text"
                    readOnly
                    disabled
                    value={new Date().toLocaleString()}
                    className="w-full border border-light-200 rounded-lg px-3 sm:px-4 py-2 sm:py-2.5 bg-gray-50 text-dark-500 cursor-not-allowed text-sm sm:text-base"
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <IoCalendar className="w-4 h-4 text-dark-600" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="border-t border-light-200 bg-gray-50 px-4 sm:px-6 py-3 sm:py-4">
            <div className="flex flex-col sm:flex-row justify-end gap-2 sm:gap-4">
              <Button
                onClick={() => navigate(-1)}
                className="w-full sm:w-auto px-4 sm:px-6 py-2 sm:py-2.5 bg-white text-dark-600 border border-light-200 rounded-lg hover:bg-gray-50 transition-all font-medium text-sm sm:text-base order-2 sm:order-1"
              >
                Cancel
              </Button>

              <Button
                onClick={() => handleSolve("Unresolved")}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 sm:px-6 py-2 sm:py-2.5 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg hover:shadow-lg transition-all font-medium text-sm sm:text-base order-1 sm:order-2"
              >
                <IoCloseCircle className="w-4 h-4" />
                Mark Unresolved
              </Button>

              <Button
                onClick={() => handleSolve("Resolved")}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 sm:px-6 py-2 sm:py-2.5 bg-gradient-to-r from-green-500 to-green-900 text-white rounded-lg hover:shadow-lg transition-all font-medium text-sm sm:text-base order-3"
              >
                <IoCheckmarkCircle className="w-4 h-4" />
                Mark Resolved
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuperAdminSolveComponent;