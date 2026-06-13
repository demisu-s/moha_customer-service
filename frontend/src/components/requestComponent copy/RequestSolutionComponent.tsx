import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@radix-ui/themes";
import {
  useServiceRequests,
  Issues,
  PROBLEM_TYPES,
  PROBLEM_CATEGORY,
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
  IoClipboardOutline,
  IoPersonCircleOutline
} from "react-icons/io5";

const RequestSolutionComponent: React.FC = () => {
  const { requestId } = useParams();
  const navigate = useNavigate();
  const { getRequestById, updateRequest } = useServiceRequests();
  const { users } = useUserContext();
  const { devices } = useDeviceContext();

  const [solution, setSolution] = useState("");
  const [issues, setIssues] = useState<Issues | undefined>(undefined);
  const [problemCategory, setProblemCategory] = useState<ProblemCategory>("Software");
  const [resolvedPreviewTime] = useState(new Date().toLocaleString());

  const request = getRequestById(requestId || "");

  useEffect(() => {
    if (request?.issues) {
      setIssues(request.issues);
    }
    if (request?.problemCategory) {
      setProblemCategory(request.problemCategory);
    }
  }, [request]);

  // Get urgency styles
  const getUrgencyStyles = (urgency: string | undefined) => {
    switch(urgency) {
      case "High":
        return { bg: "bg-red-100", text: "text-red-700", border: "border-red-200", icon: IoWarning };
      case "Medium":
        return { bg: "bg-orange-100", text: "text-orange-700", border: "border-orange-200", icon: IoAlertCircleOutline };
      case "Low":
        return { bg: "bg-green-100", text: "text-green-700", border: "border-green-200", icon: IoCheckmarkCircle };
      default:
        return { bg: "bg-gray-100", text: "text-gray-700", border: "border-gray-200", icon: IoFlag };
    }
  };

  if (!request) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-light-200 to-gray-100">
        <div className="max-w-md mx-auto p-8 text-center bg-white rounded-2xl shadow-xl">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <IoWarning className="w-10 h-10 text-red-500" />
          </div>
          <h2 className="text-2xl font-bold text-dark-400 mb-2">
            Request Not Found
          </h2>
          <p className="text-dark-600 mb-6">
            The service request you're trying to solve doesn't exist or has been removed.
          </p>
          <Button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-primary-500 to-primary-700 text-white px-6 py-2.5 rounded-lg hover:shadow-lg transition-all"
          >
            <IoArrowBack className="w-4 h-4" />
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  const requester = users.find((u) => u._id === request.requestedBy);
  const supervisor = users.find((u) => u._id === request.assignedTo);
  const device = devices.find((d) => d._id === request.deviceId);
  const urgencyStyle = getUrgencyStyles(request.urgency);
  const UrgencyIcon = urgencyStyle.icon;

  const handleSolve = (status: "Resolved" | "Unresolved") => {
    const resolvedTime = new Date().toISOString();
    updateRequest(request.id, {
      status,
      solution,
      issues,
      problemCategory,
      resolvedDate: resolvedTime,
    });
    navigate("/dashboard");
  };

  const formattedRequestDate = new Date(request.createdAt).toLocaleString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });

  const formattedAssignedDate = request.assignedDate 
    ? new Date(request.assignedDate).toLocaleString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      })
    : 'Not assigned yet';

  return (
       <div className="min-h-screen bg-gray-50 py-8 rounded-lg px-4">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* HEADER with Gradient */}
        <div className="relative overflow-hidden bg-light-200 rounded-2xl shadow-xl">
          <div className="absolute inset-0  opacity-10"></div>
          <div className="relative px-6 py-6">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => navigate(-1)}
                  className="p-2 hover:bg-white rounded-xl transition-colors"
                >
                  <IoArrowBack className="w-6 h-6 text-dark-600"  />
                </button>
                <div>
                  <h1 className="text-3xl font-bold text-black mb-1">
                    Request Solution
                  </h1>
                  <p className="text-primary-100 text-sm flex items-center gap-2">
                    <IoConstructOutline className="w-4 h-4" />
                    {device ? device.deviceName : request.serialNumber}
                  </p>
                </div>
              </div>
              
              {/* Urgency Badge */}
              <div className={`flex items-center gap-2 px-4 py-2 rounded-full ${urgencyStyle.bg} ${urgencyStyle.text} border ${urgencyStyle.border} shadow-sm backdrop-blur-sm`}>
                <UrgencyIcon className="w-4 h-4" />
                <span className="text-sm font-semibold">{request.urgency || 'Normal'} Urgency</span>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Card */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Request Details Section */}
          <div className="border-b border-light-200">
            <div className="bg-gradient-to-r from-dark-400 to-dark-800 px-6 py-4">
              <h3 className="font-bold text-xl text-white flex items-center gap-2">
                <IoDocumentTextOutline className="w-5 h-5" />
                Request Details
              </h3>
              <p className="text-gray-300 text-sm mt-1">Complete information about the service request</p>
            </div>
            
            <div className="p-6">
              <div className="grid md:grid-cols-2 gap-6">
                {/* Left Column */}
                <div className="space-y-4">
                  {/* Requester */}
                  <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl border-l-4 border-blue-500">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center shadow-md">
                        <IoPerson className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="text-xs text-blue-600 uppercase tracking-wide font-semibold">Requester</p>
                        <p className="text-sm text-dark-500">Person who reported issue</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-dark-400">
                        {requester ? `${requester.firstName} ${requester.lastName}` : request.requestedBy}
                      </p>
                    </div>
                  </div>

                  {/* Device */}
                  <div className="flex items-center justify-between p-4 bg-gradient-to-r from-purple-50 to-purple-100 rounded-xl border-l-4 border-purple-500">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center shadow-md">
                        <IoDesktopOutline className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="text-xs text-purple-600 uppercase tracking-wide font-semibold">Device</p>
                        <p className="text-sm text-dark-500">Hardware information</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-dark-400">
                        {device ? `${device.deviceName} (${device.deviceType})` : "Unknown"}
                      </p>
                    </div>
                  </div>

                  {/* Requested Date */}
                  <div className="flex items-center justify-between p-4 bg-gradient-to-r from-green-50 to-green-100 rounded-xl border-l-4 border-green-500">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center shadow-md">
                        <IoCalendar className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="text-xs text-green-600 uppercase tracking-wide font-semibold">Requested Date</p>
                        <p className="text-sm text-dark-500">Submission timestamp</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-dark-400">{formattedRequestDate}</p>
                    </div>
                  </div>
                </div>

                {/* Right Column */}
                <div className="space-y-4">
                  {/* Supervisor */}
                  <div className="flex items-center justify-between p-4 bg-gradient-to-r from-indigo-50 to-indigo-100 rounded-xl border-l-4 border-indigo-500">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-lg flex items-center justify-center shadow-md">
                        <IoPersonCircleOutline className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="text-xs text-indigo-600 uppercase tracking-wide font-semibold">Supervisor</p>
                        <p className="text-sm text-dark-500">Assigned technician</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-dark-400">
                        {supervisor ? `${supervisor.firstName} ${supervisor.lastName}` : request.assignedToName || "Not assigned"}
                      </p>
                    </div>
                  </div>

                  {/* Assigned Date */}
                  <div className="flex items-center justify-between p-4 bg-gradient-to-r from-orange-50 to-orange-100 rounded-xl border-l-4 border-orange-500">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center shadow-md">
                        <IoTimeOutline className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="text-xs text-orange-600 uppercase tracking-wide font-semibold">Assigned Date</p>
                        <p className="text-sm text-dark-500">Assignment timestamp</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-dark-400">{formattedAssignedDate}</p>
                    </div>
                  </div>

                  {/* Urgency */}
                  <div className="flex items-center justify-between p-4 bg-gradient-to-r from-red-50 to-red-100 rounded-xl border-l-4 border-red-500">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-red-600 rounded-lg flex items-center justify-center shadow-md">
                        <IoFlag className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="text-xs text-red-600 uppercase tracking-wide font-semibold">Urgency Level</p>
                        <p className="text-sm text-dark-500">Priority status</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className={`px-3 py-1 rounded-lg text-sm font-semibold ${urgencyStyle.bg} ${urgencyStyle.text}`}>
                        {request.urgency || 'Normal'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Problem Description */}
              <div className="mt-6">
                <div className="relative">
                  <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-primary-500 to-primary-700 rounded-full"></div>
                  <div className="pl-4">
                    <div className="bg-gradient-to-br from-gray-50 to-light-200 rounded-xl p-5">
                      <div className="flex items-start gap-3">
                        <IoChatbubbleEllipses className="w-5 h-5 text-primary-500 mt-1 flex-shrink-0" />
                        <div className="flex-1">
                          <p className="text-xs text-dark-600 uppercase tracking-wide font-semibold mb-2">Problem Description</p>
                          <p className="text-dark-400 leading-relaxed">{request.description}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Solution Section */}
          <div className="p-6">
            <div className="space-y-6">
              {/* Problem Category */}
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-dark-400 mb-2">
                  <IoClipboardOutline className="w-4 h-4 text-primary-500" />
                  Problem Category
                </label>
                <select
                  value={problemCategory}
                  onChange={(e) => setProblemCategory(e.target.value as ProblemCategory)}
                  className="w-full md:w-96 border border-light-200 rounded-lg px-4 py-2.5 text-dark-400 focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all bg-white"
                >
                  {PROBLEM_CATEGORY.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
                <p className="text-xs text-yellow-600 mt-2 flex items-center gap-1">
                  <IoWarning className="w-3 h-3" />
                  Change this only if the user selected the wrong problem category
                </p>
              </div>

              {/* Admin Notes */}
              {request.notes && (
                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-dark-400 mb-2">
                    <IoDocumentTextOutline className="w-4 h-4 text-primary-500" />
                    Admin Notes
                  </label>
                  <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-xl p-4 border-l-4 border-yellow-500">
                    <p className="text-dark-600 leading-relaxed">{request.notes}</p>
                  </div>
                </div>
              )}

              {/* Problem Type */}
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-dark-400 mb-2">
                  <IoAlertCircleOutline className="w-4 h-4 text-primary-500" />
                  Problem Type
                </label>
                <select
                  value={issues || ""}
                  onChange={(e) => setIssues(e.target.value as Issues)}
                  className="w-full md:w-96 border border-light-200 rounded-lg px-4 py-2.5 text-dark-400 focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all bg-white"
                >
                  <option value="">Select problem type</option>
                  {PROBLEM_TYPES.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>

              {/* Solution Textarea */}
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-dark-400 mb-2">
                  <IoConstructOutline className="w-4 h-4 text-primary-500" />
                  Solution Details
                </label>
                <textarea
                  value={solution}
                  onChange={(e) => setSolution(e.target.value)}
                  rows={5}
                  className="w-full border border-light-200 rounded-lg px-4 py-3 text-dark-400 focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all resize-none"
                  placeholder="Describe the solution provided to resolve this issue..."
                />
              </div>

              {/* Resolved Date */}
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-dark-400 mb-2">
                  <IoTimeOutline className="w-4 h-4 text-primary-500" />
                  Resolved Date
                </label>
                <div className="relative">
                  <input
                    type="text"
                    readOnly
                    disabled
                    value={resolvedPreviewTime}
                    className="w-full md:w-96 border border-light-200 rounded-lg px-4 py-2.5 bg-gray-50 text-dark-500 cursor-not-allowed"
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <IoCalendar className="w-4 h-4 text-dark-600" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="border-t border-light-200 bg-gray-50 px-6 py-4">
            <div className="flex justify-end gap-4">
              <Button
                onClick={() => navigate(-1)}
                className="px-6 py-2.5 bg-white text-dark-600 border border-light-200 rounded-lg hover:bg-gray-50 transition-all font-medium"
              >
                Cancel
              </Button>

              <Button
                onClick={() => handleSolve("Unresolved")}
                className="inline-flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg hover:shadow-lg transition-all font-medium"
              >
                <IoCloseCircle className="w-4 h-4" />
                Mark Unresolved
              </Button>

              <Button
                onClick={() => handleSolve("Resolved")}
                className="inline-flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:shadow-lg transition-all font-medium"
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

export default RequestSolutionComponent;