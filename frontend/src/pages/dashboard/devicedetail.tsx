import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@radix-ui/themes";
import { useDeviceContext } from "../../context/DeviceContext";
import { useUserContext } from "../../context/UserContext";

const DeviceDetail: React.FC = () => {
  const { requestId } = useParams(); // We'll use requestId as the device.id
  const navigate = useNavigate();

  const { devices } = useDeviceContext();
  const { users } = useUserContext();

  // Find the device by ID
  const device = devices.find((dev) => dev.id === requestId);

  if (!device) {
    return (
      <div className="max-w-3xl mx-auto p-6 text-center text-red-600">
        <h2 className="text-xl font-semibold">Device not found</h2>
        <Button onClick={() => navigate(-1)} className="mt-4">
          Go Back
        </Button>
      </div>
    );
  }

  // Find the user who is assigned to this device
  const requester = users.find(
    (user) =>
      `${user.firstName}`.toLowerCase() ===
      device.user.toLowerCase()
  );

  return (
    <div className="max-w-5xl mx-auto space-y-4">
      <h2 className="text-3xl font-bold text-gray-800">
        Device Details - {device.serial}
      </h2>
      <p className="text-sm text-gray-400 max-w-xl">
        Review your device Information
      </p>

      <div className="grid md:grid-cols-3 gap-4">
        {/* Device Image + Summary */}
        <div className="col-span-2 flex gap-0">
          {/* Device Image */}
          <div className="border rounded-l-lg p-4 flex items-center justify-center bg-white">
            <img
              src={device.image}
              alt="Device"
              className="w-72 h-48 object-contain"
            />
          </div>
          {/* Device Summary */}
          <div className="border-t border-b border-r rounded-r-lg p-4 flex-1 bg-white">
            <h3 className="font-bold mb-3 text-xl">Device Information</h3>
            <div className="text-sm space-y-1">
              <p>
                <strong className="text-lg font-light text-gray-500 pr-4">
                  Device Name:
                </strong>{" "}
                {device.name}
              </p>
              <p>
                <strong className="text-lg font-light text-gray-500 pr-6">
                  Device Type:
                </strong>{" "}
                {device.type}
              </p>
              <p>
                <strong className="text-lg font-light text-gray-500 pr-4">
                  Device ID/Serial:
                </strong>{" "}
                {device.serial}
              </p>
              <p>
                <strong className="text-lg font-light text-gray-500 pr-4">
                  Area:
                </strong>{" "}
                {device.area}
              </p>
              <p>
                <strong className="text-lg font-light text-gray-500 pr-4">
                  Department:
                </strong>{" "}
                {device.department}
              </p>
            </div>
          </div>
        </div>

        {/* Requester Info */}
        <div className="border rounded-lg p-4 bg-white">
          <h3 className="font-bold mb-3 text-xl">User Information</h3>
          {requester ? (
            <div className="text-sm space-y-1">
              <p>
                <strong className="text-lg font-light text-gray-500 pr-4">
                  Name:
                </strong>{" "}
                {requester.firstName} {requester.lastName}
              </p>
              <p>
                <strong className="text-lg font-light text-gray-500 pr-4">
                  Plant Location:
                </strong>{" "}
                {requester.area}
              </p>
              <p>
                <strong className="text-lg font-light text-gray-500 pr-4">
                  Department:
                </strong>{" "}
                {requester.department}
              </p>
              <p>
                <strong className="text-lg font-light text-gray-500 pr-4">
                  Role:
                </strong>{" "}
                {requester.role}
              </p>
            </div>
          ) : (
            <p className="text-gray-500 italic">
              No user details found for this device.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default DeviceDetail;
