import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@radix-ui/themes";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "../../components/ui/carousel";
import { maintenanceRequests } from "../../data/mockdata";

const RequestDetailsPage: React.FC = () => {
  const { requestId } = useParams();
  const navigate = useNavigate();

  const request = maintenanceRequests.find((req) => req.id === requestId);

   const handleAssign = () => {
    navigate(`/dashboard/dashboard/assign/1`);
  };

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

  // Merge main device image + extra images into one array
  const allImages = [request.device.image, ...(request.device.extraImages || [])];

  return (
    <div className="max-w-5xl mx-auto space-y-4">
      <h2 className="text-3xl font-bold text-gray-800">
        Request Details - {request.device.serial}
      </h2>
      <p className="text-sm text-gray-400 max-w-xl">
        Full details of the reported issue, requester, and device information.
      </p>

      {/* Top section with device images & summary */}
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
          />
        </CarouselItem>
      ))}
    </CarouselContent>

    {/* Position arrows inside image */}
    <CarouselPrevious className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/70 hover:bg-white p-2 rounded-full shadow-md" />
    <CarouselNext className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/70 hover:bg-white p-2 rounded-full shadow-md" />
  </Carousel>
</div>


          
          <div className="border-t border-b border-r rounded-r-lg p-4 flex-1 bg-white">
            <h3 className="font-bold mb-3 text-xl">Request Summary</h3>
            <div className="text-sm space-y-1">
              <p>
                <strong className="text-lg font-light text-gray-500 pr-4">
                  Device Name:
                </strong>
                {request.device.name}
              </p>
              <p>
                <strong className="text-lg font-light text-gray-500 pr-6">
                  Device Type:
                </strong>
                {request.device.type}
              </p>
              <p>
                <strong className="text-lg font-light text-gray-500 pr-4">
                  Device ID/Serial:
                </strong>
                {request.device.serial}
              </p>
              <p>
                <strong className="text-lg font-light text-gray-500 pr-4">
                  Submission Date:
                </strong>
                {request.device.submissionDate}
              </p>
            </div>
          </div>
        </div>

        
        <div className="border rounded-lg p-4 bg-white">
          <h3 className="font-bold mb-3 text-xl">Requester Information</h3>
          <div className="text-sm space-y-1">
            <p>
              <strong className="text-lg font-light text-gray-500 pr-4">
                User Name:
              </strong>
              {request.requester.name}
            </p>
            <p>
              <strong className="text-lg font-light text-gray-500 pr-4">
                Plant Location:
              </strong>
              {request.requester.location}
            </p>
            <p>
              <strong className="text-lg font-light text-gray-500 pr-4">
                Department:
              </strong>
              {request.requester.department}
            </p>
            <p>
              <strong className="text-lg font-light text-gray-500 pr-4">
                Phone number:
              </strong>
              {request.requester.phone}
            </p>
          </div>
        </div>
      </div>

      {/* Issue Description */}
      <div className="border rounded-lg p-4 bg-white">
        <h3 className="font-bold mb-3 text-xl">Issue Description</h3>
        <p className="text-lg font-light text-gray-500 mb-2">Description</p>
        <p className="text-lg font-light mb-3">{request.issue.description}</p>
        <p className="text-lg font-light text-gray-500 mb-2">Urgency:</p>
        <p className="text-red-500 font-bold text-lg mb-3">
          {request.issue.urgency}
        </p>

        {/* Screenshot Carousel (Centered) */}
        {request.issue.attachments?.length > 0 && (
  <div className="flex justify-center">
    <Carousel className="w-full max-w-3xl relative">
      <CarouselContent>
        {request.issue.attachments.map((file, index) => (
          <CarouselItem key={index}>
            <img
              src={file}
              alt={`Attachment ${index + 1}`}
              className="w-full h-96 object-contain border rounded-md"
              onError={(e) => {
                (e.target as HTMLImageElement).src = "/placeholder-image.png";
              }}
            />
          </CarouselItem>
        ))}
      </CarouselContent>

      {/* Arrows inside the image */}
      <CarouselPrevious className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/70 hover:bg-white p-2 rounded-full shadow-md" />
      <CarouselNext className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/70 hover:bg-white p-2 rounded-full shadow-md" />
    </Carousel>
  </div>
)}

      </div>

      {/* Buttons */}
      <div className="flex justify-end gap-3">
        <Button
          onClick={() => navigate(-1)}
          className="bg-white text-black px-4 py-1 border border-gray-300 rounded-md hover:bg-gray-100 duration-200 hover:shadow-md hover:scale-105"
        >
          Back
        </Button>
        <button
      onClick={handleAssign}
      className="bg-primary-600 text-white px-4 py-1 border border-gray-300 rounded-md hover:bg-primary-900 duration-200 hover:shadow-md hover:scale-105"
    >
      Assign
    </button>
      </div>
    </div>
  );
};

export default RequestDetailsPage;
