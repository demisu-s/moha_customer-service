import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@radix-ui/themes";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "../../components/ui/carousel";
import { ServiceRequest } from "../../pages/User/askforhelp";

const RequestDetailsComponent: React.FC = () => {
  const { requestId } = useParams();
  const navigate = useNavigate();

  const [request, setRequest] = useState<ServiceRequest | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem("serviceRequests");
    if (stored) {
      const requests: ServiceRequest[] = JSON.parse(stored);
      const found = requests.find((req) => req.id === requestId);
      if (found) setRequest(found);
    }
  }, [requestId]);

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

  // Merge device images into carousel (deviceImage + attachments)
  const allImages = [request.deviceImage, ...(request.attachments || [])];

  return (
    <div className="max-w-5xl mx-auto space-y-4">
      <h2 className="text-3xl font-bold text-gray-800">
        Request Details - {request.deviceSerial}
      </h2>
      <p className="text-sm text-gray-400 max-w-xl">
        Full details of the reported issue, requester, and device information.
      </p>

      {/* Top section with images & summary */}
      <div className="grid md:grid-cols-3 gap-4">
        <div className="col-span-2 flex">
          {/* Device Image Carousel */}
          <div className="border rounded-l-lg p-2 flex items-center justify-center bg-white relative">
            <Carousel className="w-72 relative">
              <CarouselContent>
                {allImages.map((img, idx) => (
                  <CarouselItem key={idx}>
                    <img
                      src={img}
                      alt={`Device ${idx + 1}`}
                      className="w-full h-60 object-contain rounded"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = "/placeholder-image.png";
                      }}
                    />
                  </CarouselItem>
                ))}
              </CarouselContent>

              <CarouselPrevious className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/70 hover:bg-white p-2 rounded-full shadow-md" />
              <CarouselNext className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/70 hover:bg-white p-2 rounded-full shadow-md" />
            </Carousel>
          </div>

          {/* Request Summary */}
          <div className="border-t border-b border-r rounded-r-lg p-4 flex-1 bg-white">
            <h3 className="font-bold mb-3 text-xl">Request Summary</h3>
            <div className="text-sm space-y-1">
              <p>
                <strong className="text-lg font-light text-gray-500 pr-4">
                  Device Serial:
                </strong>
                {request.deviceSerial}
              </p>
              <p>
                <strong className="text-lg font-light text-gray-500 pr-6">
                  Submission Date:
                </strong>
                {request.submissionDate
                  ? (request.submissionDate instanceof Date
                      ? request.submissionDate.toLocaleString()
                      : request.submissionDate.toString())
                  : "N/A"}
              </p>
              <p>
                <strong className="text-lg font-light text-gray-500 pr-4">
                  Status:
                </strong>
                {request.status}
              </p>
              {request.assignedTo && (
                <p>
                  <strong className="text-lg font-light text-gray-500 pr-4">
                    Assigned To:
                  </strong>
                  {request.assignedTo}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Requester Information */}
        <div className="border rounded-lg p-4 bg-white">
          <h3 className="font-bold mb-3 text-xl">Requester Information</h3>
          <div className="text-sm space-y-1">
            <p>
              <strong className="text-lg font-light text-gray-500 pr-4">
                Requested By:
              </strong>
              {request.requestedBy}
            </p>
            <p>
              <strong className="text-lg font-light text-gray-500 pr-4">
                Department:
              </strong>
              {request.department}
            </p>
            <p>
              <strong className="text-lg font-light text-gray-500 pr-4">
                Area:
              </strong>
              {request.area}
            </p>
          </div>
        </div>
      </div>

      {/* Issue Description */}
      <div className="border rounded-lg p-4 bg-white">
        <h3 className="font-bold mb-3 text-xl">Issue Description</h3>
        <p className="text-lg font-light mb-3">{request.description}</p>
        <p className="text-lg font-light text-gray-500 mb-2">Urgency:</p>
        <p className="text-red-500 font-bold text-lg mb-3">{request.urgency}</p>
      </div>

      {/* Buttons */}
      <div className="flex justify-end gap-3">
        <Button
          onClick={() => navigate(-1)}
          className="bg-white text-black px-4 py-1 border border-gray-300 rounded-md hover:bg-gray-100 duration-200 hover:shadow-md hover:scale-105"
        >
          Back
        </Button>
      </div>
    </div>
  );
};

export default RequestDetailsComponent;
