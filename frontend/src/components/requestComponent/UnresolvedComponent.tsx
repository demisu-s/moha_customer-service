// src/components/dashboardComponents/HistoryDetailsComponent.tsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@radix-ui/themes";
import {
  useServiceRequests,
  ServiceRequest,
} from "../../context/ServiceRequestContext";
import { useUserContext } from "../../context/UserContext";
import { useDeviceContext } from "../../context/DeviceContext";
import { 
  IoArrowBack, 
  IoPerson, 
  IoDesktopOutline, 
  IoCalendar, 
  IoChatbubbleEllipses,
  IoLocation,
  IoBusiness,
  IoCall,
  IoTimeOutline,
  IoCloseCircle,
  IoDocumentTextOutline,
  IoWarningOutline,
  IoAlertCircleOutline,
  IoQrCodeOutline,
  IoConstructOutline,
  IoInformationCircleOutline
} from "react-icons/io5";

const UnresolvedComponent: React.FC = () => {
  const { requestId } = useParams();
  const navigate = useNavigate();
  const { users } = useUserContext();
  const [request, setRequest] = useState<ServiceRequest | null>(null);
  const { devices } = useDeviceContext();

  // Load request from localStorage
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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-light-200 to-gray-100">
        <div className="max-w-md mx-auto p-8 text-center bg-white rounded-2xl shadow-xl">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <IoWarningOutline className="w-10 h-10 text-red-500" />
          </div>
          <h2 className="text-2xl font-bold text-dark-400 mb-2">Request Not Found</h2>
          <p className="text-dark-600 mb-6">The service request you're looking for doesn't exist or has been removed.</p>
          <Button onClick={() => navigate(-1)} className="inline-flex items-center gap-2 bg-gradient-to-r from-primary-500 to-primary-700 text-white px-6 py-2.5 rounded-lg hover:shadow-lg transition-all">
            <IoArrowBack className="w-4 h-4" />
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  const requester = users.find((u) => u.userId === request.requestedBy);
  const supervisor = users.find((u) => u.userId === request.assignedTo);
  const device = devices.find((d) => d._id === request.deviceId);

  const formatDate = (date: string) => {
    if (!date) return "—";
    return new Date(date).toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-light-200 to-gray-100 py-8 px-4">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="relative overflow-hidden bg-gradient-to-r from-red-600 via-red-500 to-red-700 rounded-2xl shadow-xl">
          <div className="absolute inset-0 bg-black opacity-10"></div>
          <div className="relative px-6 py-6">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => navigate(-1)}
                  className="p-2 bg-white/20 backdrop-blur-sm rounded-xl hover:bg-white/30 transition-all transform hover:scale-105"
                >
                  <IoArrowBack className="w-6 h-6 text-white" />
                </button>
                <div>
                  <h1 className="text-3xl font-bold text-white mb-1">Unresolved Request</h1>
                  <p className="text-red-100 text-sm flex items-center gap-2">
                    <IoDesktopOutline className="w-4 h-4" />
                    {device ? device.serialNumber : request.serialNumber}
                  </p>
                </div>
              </div>
              
              {/* Status Badge */}
              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-red-100 text-red-700 border border-red-200 shadow-sm">
                <IoCloseCircle className="w-4 h-4" />
                <span className="text-sm font-semibold">Unresolved</span>
              </div>
            </div>
          </div>
        </div>

        {/* Two Column Layout */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Left Column - Device & Request Info */}
          <div className="space-y-6">
            {/* Device Information */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <div className="bg-gradient-to-r from-dark-400 to-dark-600 px-6 py-4">
                <h3 className="font-bold text-xl text-white flex items-center gap-2">
                  <IoDesktopOutline className="w-5 h-5" />
                  Device Information
                </h3>
                <p className="text-dark-300 text-sm mt-1">Hardware and system details</p>
              </div>
              <div className="p-6 space-y-4">
                <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                  <span className="text-sm font-semibold text-dark-600">Device Name</span>
                  <span className="text-dark-400 font-medium">{device ? device.deviceName : "Unknown"}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
                  <span className="text-sm font-semibold text-dark-600">Device Type</span>
                  <span className="text-dark-400 font-medium">{device ? device.deviceType : "Unknown"}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-indigo-50 rounded-lg">
                  <span className="text-sm font-semibold text-dark-600">Serial Number</span>
                  <span className="text-dark-400 font-medium">{request.serialNumber}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                  <span className="text-sm font-semibold text-dark-600">Requested Date</span>
                  <span className="text-dark-400 font-medium">{formatDate(request.createdAt)}</span>
                </div>
              </div>
            </div>

            {/* Issue Description */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <div className="bg-gradient-to-r from-dark-400 to-dark-600 px-6 py-4">
                <h3 className="font-bold text-xl text-white flex items-center gap-2">
                  <IoChatbubbleEllipses className="w-5 h-5" />
                  Issue Description
                </h3>
                <p className="text-dark-300 text-sm mt-1">Original problem reported by user</p>
              </div>
              <div className="p-6">
                <div className="bg-gradient-to-br from-gray-50 to-light-200 rounded-xl p-4">
                  <div className="flex items-start gap-3">
                    <IoInformationCircleOutline className="w-5 h-5 text-primary-500 mt-1 flex-shrink-0" />
                    <p className="text-dark-400 leading-relaxed">{request.description}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Dates */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <div className="bg-gradient-to-r from-dark-400 to-dark-600 px-6 py-4">
                <h3 className="font-bold text-xl text-white flex items-center gap-2">
                  <IoCalendar className="w-5 h-5" />
                  Timeline
                </h3>
                <p className="text-dark-300 text-sm mt-1">Important dates and deadlines</p>
              </div>
              <div className="p-6 space-y-4">
                <div className="flex justify-between items-center p-3 bg-orange-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <IoTimeOutline className="w-4 h-4 text-orange-600" />
                    <span className="text-sm font-semibold text-dark-600">Assigned Date</span>
                  </div>
                  <span className="text-dark-400">{formatDate(request.assignedDate)}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-red-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <IoCloseCircle className="w-4 h-4 text-red-600" />
                    <span className="text-sm font-semibold text-dark-600">Resolved Date</span>
                  </div>
                  <span className="text-dark-400">{formatDate(request.resolvedDate)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Requester & Resolution Info */}
          <div className="space-y-6">
            {/* Requester Information */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <div className="bg-gradient-to-r from-primary-500 to-primary-700 px-6 py-4">
                <h3 className="font-bold text-xl text-white flex items-center gap-2">
                  <IoPerson className="w-5 h-5" />
                  Requester Information
                </h3>
                <p className="text-primary-100 text-sm mt-1">Contact and location details</p>
              </div>
              <div className="p-6">
                <div className="flex items-center gap-4 mb-6 p-4 bg-gradient-to-br from-primary-50 to-blue-50 rounded-xl">
                  <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center shadow-lg">
                    <span className="text-white font-bold text-2xl">
                      {requester ? requester.firstName?.charAt(0) : request.requestedBy?.charAt(0) || 'U'}
                    </span>
                  </div>
                  <div>
                    <h4 className="font-bold text-dark-400 text-lg">
                      {requester ? `${requester.firstName} ${requester.lastName}` : request.requestedBy || "Unknown"}
                    </h4>
                    <p className="text-sm text-dark-600">Requestor</p>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                    <IoLocation className="w-5 h-5 text-green-600" />
                    <span className="text-sm font-semibold text-dark-600">Plant Location:</span>
                    <span className="text-dark-400">{request.plant}</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg">
                    <IoBusiness className="w-5 h-5 text-purple-600" />
                    <span className="text-sm font-semibold text-dark-600">Department:</span>
                    <span className="text-dark-400">{request.department}</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                    <IoCall className="w-5 h-5 text-blue-600" />
                  </div>
                  {supervisor && (
                    <div className="flex items-center gap-3 p-3 bg-orange-50 rounded-lg">
                      <IoPerson className="w-5 h-5 text-orange-600" />
                      <span className="text-sm font-semibold text-dark-600">Assigned Supervisor:</span>
                      <span className="text-dark-400">{supervisor.firstName} {supervisor.lastName}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Resolution Details */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <div className="bg-gradient-to-r from-red-600 to-red-700 px-6 py-4">
                <h3 className="font-bold text-xl text-white flex items-center gap-2">
                  <IoDocumentTextOutline className="w-5 h-5" />
                  Unresolved Details
                </h3>
                <p className="text-red-100 text-sm mt-1">Why this request couldn't be resolved</p>
              </div>
              <div className="p-6 space-y-4">
                {/* Recommendation */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-dark-400 mb-2">
                    <IoConstructOutline className="w-4 h-4 text-primary-500" />
                    Recommendation
                  </label>
                  <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 border-l-4 border-blue-500">
                    <p className="text-dark-600 leading-relaxed">{request.notes || "No recommendation provided."}</p>
                  </div>
                </div>

                {/* Reason of Unresolved */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-dark-400 mb-2">
                    <IoAlertCircleOutline className="w-4 h-4 text-red-500" />
                    Reason of Unresolved
                  </label>
                  <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-xl p-4 border-l-4 border-red-500">
                    <p className="text-dark-600 leading-relaxed">{request.solution || "No reason provided yet."}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Required Card */}
            <div className="bg-gradient-to-br from-red-50 to-orange-50 rounded-2xl shadow-lg p-6 border border-red-200">
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <IoWarningOutline className="w-8 h-8 text-white" />
                </div>
                <h4 className="font-bold text-dark-400 text-lg mb-2">Action Required</h4>
                <p className="text-sm text-dark-600 mb-4">
                  This request requires immediate attention. Please review the issue and provide a solution or escalate to higher management.
                </p>
                <Button
                  onClick={() => navigate(-1)}
                  className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-red-500 to-red-600 text-white px-6 py-2.5 rounded-lg hover:shadow-lg transition-all transform hover:scale-105 w-full"
                >
                  <IoArrowBack className="w-4 h-4" />
                  Back to Dashboard
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UnresolvedComponent;