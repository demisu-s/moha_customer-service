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
import { 
  IoArrowBack, 
  IoCalendar, 
  IoPerson, 
  IoDesktopOutline,
  IoCodeWorking,
  IoAlertCircle,
  IoChatbubbleEllipses,
  IoImageOutline,
  IoLocation,
  IoBusiness,
  IoCall
} from "react-icons/io5";

const RequestDetailsComponent: React.FC = () => {
  const { requestId } = useParams();
  const navigate = useNavigate();
  const [imageErrors, setImageErrors] = useState<Record<number, boolean>>({});

  const { requests, loading } = useServiceRequests();

  const request = requests.find(
    (r) => String(r.id) === String(requestId)
  );

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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-light-200">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-dark-600 font-medium">Loading request details...</p>
        </div>
      </div>
    );
  }

  if (!request) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-light-200">
        <div className="max-w-md mx-auto p-8 text-center bg-white rounded-2xl shadow-lg">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <IoAlertCircle className="w-10 h-10 text-red-500" />
          </div>
          <h2 className="text-2xl font-bold text-dark-400 mb-2">
            Request Not Found
          </h2>
          <p className="text-dark-600 mb-6">
            The service request you're looking for doesn't exist or has been removed.
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

  const allImages = (request.attachments || []).filter(
    (img): img is string => typeof img === "string" && img.length > 0
  );

  console.log("REQUEST:", request);
  console.log("ALL IMAGES:", allImages);

  return (
             <div className="min-h-screen bg-gray-50 py-8 rounded-lg px-4">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* HEADER */}
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
                Request Details
              </h1>
              <p className="text-sm text-dark-600 mt-1">
                Serial Number: {request.serialNumber}
              </p>
            </div>
          </div>
          
          {/* Status Badge */}
          <div className={`px-4 py-2 rounded-full text-sm font-semibold ${getStatusStyles(request.status)}`}>
            {request.status}
          </div>
        </div>

        {/* MAIN CONTENT GRID */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* LEFT COLUMN - Images and Device Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Images Carousel Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-light-200 overflow-hidden">
              <div className="bg-gradient-to-r from-primary-500 to-primary-900 px-6 py-4">
                <h3 className="font-bold text-xl text-white flex items-center gap-2">
                  <IoImageOutline className="w-5 h-5" />
                  Attached Images
                </h3>
                <p className="text-primary-100 text-sm mt-1">
                  Screenshots and error images uploaded by user
                </p>
              </div>
              
              <div className="p-6">
                <div className="flex items-center justify-center bg-light-200 rounded-xl min-h-[320px]">
                  <Carousel className="w-full max-w-md relative">
                    <CarouselContent>
                      {allImages.length > 0 ? (
                        allImages.map((img, idx) => (
                          <CarouselItem key={idx}>
                            <div className="flex items-center justify-center h-80">
                              {!imageErrors[idx] ? (
                                <img
                                  src={img}
                                  alt={`Screenshot ${idx + 1}`}
                                  className="w-full h-80 object-contain rounded-lg"
                                  onError={() => {
                                    console.error("Failed to load image:", img);
                                    setImageErrors(prev => ({ ...prev, [idx]: true }));
                                  }}
                                  onLoad={() => console.log(`Image ${idx + 1} loaded successfully`)}
                                />
                              ) : (
                                <div className="text-center p-6">
                                  <IoImageOutline className="w-16 h-16 text-dark-600 mx-auto mb-3" />
                                  <p className="text-red-500 text-sm">Failed to load image</p>
                                  <p className="text-dark-600 text-xs mt-2 break-all">{img}</p>
                                </div>
                              )}
                            </div>
                          </CarouselItem>
                        ))
                      ) : (
                        <CarouselItem>
                          <div className="flex flex-col items-center justify-center h-80">
                            <IoImageOutline className="w-20 h-20 text-dark-600 mb-4" />
                            <p className="text-dark-600 font-medium">No images available</p>
                            <p className="text-dark-600 text-sm mt-1">User didn't upload any screenshots</p>
                          </div>
                        </CarouselItem>
                      )}
                    </CarouselContent>

                    {allImages.length > 1 && (
                      <>
                        <CarouselPrevious className="left-2" />
                        <CarouselNext className="right-2" />
                      </>
                    )}
                  </Carousel>
                </div>
                
                {/* Image Counter */}
                {allImages.length > 0 && (
                  <div className="text-center mt-4">
                    <p className="text-sm text-dark-600">
                      {allImages.length} image{allImages.length !== 1 ? 's' : ''} attached
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Device Information Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-light-200 overflow-hidden">
              <div className="bg-gradient-to-r from-dark-400 to-dark-700 px-6 py-4">
                <h3 className="font-bold text-xl text-white flex items-center gap-2">
                  <IoDesktopOutline className="w-5 h-5" />
                  Device Information
                </h3>
              </div>
              
              <div className="p-6">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 p-3 bg-light-200 rounded-lg">
                      <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                        <span className="text-primary-600 font-bold text-sm">💻</span>
                      </div>
                      <div>
                        <p className="text-xs text-dark-600 uppercase tracking-wide">Device Name</p>
                        <p className="font-semibold text-dark-400">{request.deviceName || 'N/A'}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3 p-3 bg-light-200 rounded-lg">
                      <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                        <IoCodeWorking className="w-5 h-5 text-purple-600" />
                      </div>
                      <div>
                        <p className="text-xs text-dark-600 uppercase tracking-wide">Device Type</p>
                        <p className="font-semibold text-dark-400">{request.deviceType || 'N/A'}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3 p-3 bg-light-200 rounded-lg">
                      <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                        <span className="text-orange-600 font-bold text-sm">🔢</span>
                      </div>
                      <div>
                        <p className="text-xs text-dark-600 uppercase tracking-wide">Serial Number</p>
                        <p className="font-semibold text-dark-400">{request.serialNumber}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 p-3 bg-light-200 rounded-lg">
                      <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                        <IoCalendar className="w-5 h-5 text-green-600" />
                      </div>
                      <div>
                        <p className="text-xs text-dark-600 uppercase tracking-wide">Requested Date</p>
                        <p className="font-semibold text-dark-400">
                          {new Date(request.createdAt).toLocaleString()}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3 p-3 bg-light-200 rounded-lg">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        <span className="text-blue-600 font-bold text-sm">📊</span>
                      </div>
                      <div>
                        <p className="text-xs text-dark-600 uppercase tracking-wide">Problem Category</p>
                        <p className="font-semibold text-dark-400">{request.problemCategory || 'N/A'}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN - Requester Info and Issue Details */}
          <div className="space-y-6">
            {/* Requester Information Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-light-200 overflow-hidden">
              <div className="bg-gradient-to-r from-primary-500 to-primary-900 px-6 py-4">
                <h3 className="font-bold text-xl text-white flex items-center gap-2">
                  <IoPerson className="w-5 h-5" />
                  Requester Information
                </h3>
              </div>
              
              <div className="p-6 space-y-4">
                <div className="flex items-center gap-3 p-3 bg-light-200 rounded-lg">
                  <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                    <IoPerson className="w-5 h-5 text-primary-600" />
                  </div>
                  <div>
                    <p className="text-xs text-dark-600 uppercase tracking-wide">Name</p>
                    <p className="font-semibold text-dark-400">{request.requestedBy}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 p-3 bg-light-200 rounded-lg">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <IoLocation className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-xs text-dark-600 uppercase tracking-wide">Plant</p>
                    <p className="font-semibold text-dark-400">{request.plant}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 p-3 bg-light-200 rounded-lg">
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                    <IoBusiness className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-xs text-dark-600 uppercase tracking-wide">Department</p>
                    <p className="font-semibold text-dark-400">{request.department}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 p-3 bg-light-200 rounded-lg">
                  <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                    <IoCall className="w-5 h-5 text-orange-600" />
                  </div>
                  <div>
                    <p className="text-xs text-dark-600 uppercase tracking-wide">Phone</p>
                    <p className="font-semibold text-dark-400">+25194243543</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Issue Description Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-light-200 overflow-hidden">
              <div className="bg-gradient-to-r from-dark-400 to-dark-700 px-6 py-4">
                <h3 className="font-bold text-xl text-white flex items-center gap-2">
                  <IoChatbubbleEllipses className="w-5 h-5" />
                  Issue Description
                </h3>
              </div>
              
              <div className="p-6">
                <div className="bg-light-200 rounded-lg p-4">
                  <p className="text-dark-400 leading-relaxed">
                    {request.description}
                  </p>
                </div>
                
                {request.problemCategory && (
                  <div className="mt-4 pt-4 border-t border-light-200">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-dark-600 uppercase tracking-wide">Category:</span>
                      <span className="px-2 py-1 bg-primary-100 text-primary-700 rounded-md text-xs font-medium">
                        {request.problemCategory}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* BACK BUTTON */}
        <div className="flex justify-end">
          <Button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-primary-500 to-primary-900 text-white px-6 py-2.5 rounded-lg hover:bg-primary-800 transition-all font-medium shadow-sm hover:shadow-md"
          >
            <IoArrowBack className="w-4 h-4" />
            Back to Dashboard
          </Button>
        </div>
      </div>
    </div>
  );
};

export default RequestDetailsComponent;