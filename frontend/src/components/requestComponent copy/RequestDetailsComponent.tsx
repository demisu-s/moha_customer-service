import React from "react";
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
import { IoArrowBack } from "react-icons/io5";

const RequestDetailsComponent: React.FC = () => {
  const { requestId } = useParams();
  const navigate = useNavigate();

  const { requests, loading } = useServiceRequests();

  const request = requests.find(
    (r) => String(r.id) === String(requestId)
  );

  if (loading) {
    return (
      <div className="p-6 text-center text-gray-500">
        Loading request...
      </div>
    );
  }

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

  const allImages = [
  ...(request.attachments || []),
].filter(
  (img): img is string =>
    typeof img === "string" && img.length > 0
);

  console.log("REQUEST:", request);
  console.log("ALL IMAGES:", allImages);

  return (
    <div className="max-w-5xl mx-auto space-y-4">
      <h2 className="text-3xl font-bold text-gray-800">
        Request Details - {request.serialNumber}
      </h2>

      <p className="text-sm text-gray-400 max-w-xl">
        Full details of the reported issue,
        requester, and device information.
      </p>

      <div className="grid md:grid-cols-3 gap-4">
        <div className="col-span-2 flex">
          <div className="border rounded-l-lg p-2 flex items-center justify-center bg-white relative">
            <Carousel className="w-72 relative">
              <CarouselContent>
                {allImages.length > 0 ? (
                  allImages.map((img, idx) => (
                    <CarouselItem key={idx}>
                      <div className="flex items-center justify-center h-60">
                        <img
                          src={img}
                          alt={`Image ${idx + 1}`}
                          className="w-full h-60 object-contain rounded"
                          onError={() =>
                            console.error(
                              "Failed to load image:",
                              img
                            )
                          }
                        />
                      </div>
                    </CarouselItem>
                  ))
                ) : (
                  <CarouselItem>
                    <div className="flex items-center justify-center h-60">
                      <p className="text-gray-400">
                        No images available
                      </p>
                    </div>
                  </CarouselItem>
                )}
              </CarouselContent>

              {allImages.length > 1 && (
                <>
                  <CarouselPrevious />
                  <CarouselNext />
                </>
              )}
            </Carousel>
          </div>

          <div className="border-t border-b border-r rounded-r-lg p-4 flex-1 bg-white">
            <h3 className="font-bold mb-3 text-xl">
              Request Device Info
            </h3>

            <div className="text-sm space-y-2">
              <p>
                <strong>Device Name:</strong>{" "}
                {request.deviceName}
              </p>

              <p>
                <strong>Device Type:</strong>{" "}
                {request.deviceType}
              </p>

              <p>
                <strong>Serial:</strong>{" "}
                {request.serialNumber}
              </p>

              <p>
                <strong>Requested Date:</strong>{" "}
                {new Date(
                  request.createdAt
                ).toLocaleString()}
              </p>

              <p>
                <strong>Status:</strong>{" "}
                {request.status}
              </p>
            </div>
          </div>
        </div>

        <div className="border rounded-lg p-4 bg-white">
          <h3 className="font-bold mb-3 text-xl">
            Requester Info
          </h3>

          <div className="text-sm space-y-2">
            <p>
              <strong>Name:</strong>{" "}
              {request.requestedBy}
            </p>

            <p>
              <strong>Plant:</strong>{" "}
              {request.plant}
            </p>

            <p>
              <strong>Department:</strong>{" "}
              {request.department}
            </p>

            <p>
              <strong>Phone:</strong>{" "}
              +25194243543
            </p>
          </div>
        </div>
      </div>

      <div className="border rounded-lg p-4 bg-white">
        {request.problemCategory && (
          <p>
            <strong>Problem Category:</strong>{" "}
            {request.problemCategory}
          </p>
        )}
      </div>

      <div className="border rounded-lg p-4 bg-white">
        <h3 className="font-bold mb-3 text-xl">
          Issue Note:
        </h3>

        <p className="mb-2">
          {request.description}
        </p>
      </div>

      <div className="flex justify-end gap-3">
        <Button onClick={() => navigate(-1)}
         className="inline-flex items-center bg-primary-600 text-white px-3 sm:px-4 py-1 text-xs sm:text-sm font-semibold rounded-lg whitespace-nowrap"
                 >
                   <IoArrowBack className="mr-1 sm:mr-2 text-sm" />
          Back
        </Button>
      </div>
    </div>
  );
};

export default RequestDetailsComponent;