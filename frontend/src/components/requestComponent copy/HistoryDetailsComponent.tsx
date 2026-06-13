// src/components/dashboardComponents/HistoryDetailsComponent.tsx
import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@radix-ui/themes";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "../ui/carousel";
import { useServiceRequests } from "../../context/ServiceRequestContext";
import { useUserContext } from "../../context/UserContext";
import { useDeviceContext } from "../../context/DeviceContext";
import { 
  IoArrowBack, 
  IoPerson, 
  IoDesktopOutline, 
  IoCalendar, 
  IoChatbubbleEllipses,
  IoImageOutline,
  IoLocation,
  IoBusiness,
  IoTimeOutline,
  IoCheckmarkCircle,
  IoCloseCircle,
  IoDocumentTextOutline,
  IoClipboardOutline,
  IoAlertCircleOutline,
  IoWarningOutline,
  IoCheckmarkDoneCircle,
  IoQrCodeOutline
} from "react-icons/io5";

const HistoryDetailsComponent: React.FC = () => {
  const { requestId } = useParams();
  const navigate = useNavigate();

  const { getRequestById } = useServiceRequests();
  const { users } = useUserContext();
  const { devices } = useDeviceContext();

  const request = getRequestById(requestId || "");
  const [imageErrors, setImageErrors] = useState<Record<number, boolean>>({});

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

  const supervisor = users.find((u) => u._id === request.assignedTo);
  const device = devices.find((d) => d._id === request.deviceId);
  const isSupervisorFlow = !!request.assignedDate;
  const userImages = request.attachments || [];

  const getStatusStyles = (status: string) => {
    switch(status) {
      case "Resolved": return { bg: "bg-green-100", text: "text-green-700", border: "border-green-200", icon: IoCheckmarkCircle };
      case "Unresolved": return { bg: "bg-red-100", text: "text-red-700", border: "border-red-200", icon: IoCloseCircle };
      case "Assigned": return { bg: "bg-blue-100", text: "text-blue-700", border: "border-blue-200", icon: IoCheckmarkDoneCircle };
      default: return { bg: "bg-yellow-100", text: "text-yellow-700", border: "border-yellow-200", icon: IoTimeOutline };
    }
  };

  const statusStyle = getStatusStyles(request.status);
  const StatusIcon = statusStyle.icon;

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
          <div className="min-h-screen bg-gray-50 py-8 rounded-lg px-4">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
         <div className="relative overflow-hidden bg-light-200 rounded-2xl shadow-xl">
          <div className="absolute inset-0  opacity-10"></div>
          <div className="relative px-6 py-6">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-4">
                <button onClick={() => navigate(-1)} 
                                  className="p-2 hover:bg-white rounded-xl transition-colors"
>
                   <IoArrowBack className="w-6 h-6 text-dark-600"  />
                </button>
                <div>
                  <h1 className="text-3xl font-bold text-dark-400 mb-1">Request History</h1>
                  <p className="text-primary-100 text-sm">
                    {device ? device.deviceName : request.serialNumber}</p>
                </div>
              </div>
              <div className={`flex items-center gap-2 px-4 py-2 rounded-full ${statusStyle.bg} ${statusStyle.text} border ${statusStyle.border}`}>
                <StatusIcon className="w-4 h-4" />
                <span className="text-sm font-semibold">{request.status}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Images Section - Full Width */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="bg-gradient-to-r from-primary-500 to-primary-700 px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-xl text-white flex items-center gap-2">
                  <IoImageOutline className="w-5 h-5" />
                  Attached Images
                </h3>
                <p className="text-primary-100 text-sm mt-1">Screenshots and error images uploaded by user</p>
              </div>
              {userImages.length > 0 && (
                <div className="bg-white/20 backdrop-blur-sm rounded-full px-3 py-1">
                  <span className="text-white text-sm font-semibold">{userImages.length} files</span>
                </div>
              )}
            </div>
          </div>
          <div className="p-6">
            <div className="bg-gradient-to-br from-gray-50 to-light-200 rounded-xl p-6">
              {userImages.length > 0 ? (
                <Carousel className="w-full max-w-md mx-auto relative">
                  <CarouselContent>
                    {userImages.map((img, idx) => (
                      <CarouselItem key={idx}>
                        <div className="flex flex-col items-center justify-center">
                          {!imageErrors[idx] ? (
                            <img src={img} alt={`Screenshot ${idx + 1}`} className="w-full h-80 object-contain rounded-lg shadow-md" onError={() => setImageErrors(prev => ({ ...prev, [idx]: true }))} />
                          ) : (
                            <div className="text-center p-8 bg-white rounded-xl">
                              <IoImageOutline className="w-16 h-16 text-dark-600 mx-auto mb-3" />
                              <p className="text-red-500 text-sm">Failed to load image</p>
                            </div>
                          )}
                          <p className="mt-3 text-sm text-dark-600">Image {idx + 1} of {userImages.length}</p>
                        </div>
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                  {userImages.length > 1 && (
                    <>
                      <CarouselPrevious className="left-0 bg-white/90 hover:bg-white shadow-lg" />
                      <CarouselNext className="right-0 bg-white/90 hover:bg-white shadow-lg" />
                    </>
                  )}
                </Carousel>
              ) : (
                <div className="flex flex-col items-center justify-center py-12">
                  <div className="w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mb-4">
                    <IoImageOutline className="w-12 h-12 text-dark-600" />
                  </div>
                  <p className="text-dark-600 font-medium">No images available</p>
                  <p className="text-dark-600 text-sm mt-1">User didn't upload any screenshots</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Two Column Layout for Details */}
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
                <div className="flex justify-between items-center p-3 bg-orange-50 rounded-lg">
                  <span className="text-sm font-semibold text-dark-600">Problem Category</span>
                  <span className="px-2 py-1 bg-orange-100 text-orange-700 rounded-md text-sm">{request.problemCategory || "—"}</span>
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
              </div>
              <div className="p-6">
                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="text-dark-400 leading-relaxed">{request.description}</p>
                </div>
                {request.issues && (
                  <div className="mt-4 flex items-center gap-2 p-3 bg-red-50 rounded-lg">
                    <IoAlertCircleOutline className="w-4 h-4 text-red-500" />
                    <span className="text-sm font-semibold text-dark-600">Issue Type:</span>
                    <span className="text-dark-400">{request.issues}</span>
                  </div>
                )}
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
              </div>
              <div className="p-6">
                <div className="flex items-center gap-4 mb-6 p-4 bg-primary-50 rounded-xl">
                  <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center shadow-lg">
                    <span className="text-white font-bold text-2xl">{request.requestedBy?.charAt(0) || 'U'}</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-dark-400 text-lg">{request.requestedBy}</h4>
                    <p className="text-sm text-dark-600">Requestor</p>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                    <IoLocation className="w-5 h-5 text-green-600" />
                    <span className="text-sm font-semibold text-dark-600">Plant:</span>
                    <span className="text-dark-400">{request.plant}</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg">
                    <IoBusiness className="w-5 h-5 text-purple-600" />
                    <span className="text-sm font-semibold text-dark-600">Department:</span>
                    <span className="text-dark-400">{request.department}</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                    <IoPerson className="w-5 h-5 text-blue-600" />
                    <span className="text-sm font-semibold text-dark-600">Assigned To:</span>
                    <span className="text-dark-400">{supervisor ? `${supervisor.firstName} ${supervisor.lastName}` : request.assignedToName || "Not assigned"}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Resolution Details */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <div className="bg-gradient-to-r from-dark-400 to-dark-600 px-6 py-4">
                <h3 className="font-bold text-xl text-white flex items-center gap-2">
                  <IoDocumentTextOutline className="w-5 h-5" />
                  Resolution Details
                </h3>
              </div>
              <div className="p-6 space-y-4">
                {isSupervisorFlow && request.assignedDate && (
                  <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                    <span className="text-sm font-semibold text-dark-600">Assigned Date</span>
                    <span className="text-dark-400">{formatDate(request.assignedDate)}</span>
                  </div>
                )}
                {request.resolvedDate && (
                  <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                    <span className="text-sm font-semibold text-dark-600">Resolved Date</span>
                    <span className="text-dark-400">{formatDate(request.resolvedDate)}</span>
                  </div>
                )}
                {isSupervisorFlow && (
                  <div>
                    <label className="block text-sm font-semibold text-dark-600 mb-2">Admin Notes</label>
                    <div className="bg-yellow-50 rounded-xl p-4 border-l-4 border-yellow-500">
                      <p className="text-dark-600">{request.notes || "No notes provided."}</p>
                    </div>
                  </div>
                )}
                <div>
                  <label className="block text-sm font-semibold text-dark-600 mb-2">Solution</label>
                  <div className="bg-green-50 rounded-xl p-4 border-l-4 border-green-500">
                    <p className="text-dark-600">{request.solution || "No solution provided yet."}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Back Button */}
        <div className="flex justify-end">
          <Button onClick={() => navigate(-1)} 
          className="inline-flex items-center gap-2 bg-gradient-to-r from-primary-500 to-primary-900 text-white px-6 py-2.5 rounded-lg hover:shadow-lg transition-all">
            <IoArrowBack className="w-4 h-4" />
            Back to Dashboard
          </Button>
        </div>
      </div>
    </div>
  );
};

export default HistoryDetailsComponent;