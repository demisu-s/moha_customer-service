import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@radix-ui/themes";
import { useDeviceContext } from "../../context/DeviceContext";
import { IoArrowBack } from "react-icons/io5";

const DeviceDetail: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { devices } = useDeviceContext();
  const device = devices.find((dev) => dev.id === id);

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

  // Mocked repair history
  const repairHistory = [
    { date: "2025-05-12", problem: "The laptop screen is flickering frequently. If you want, I can also give you a system architecture diagram",repairedBy: "Technician A" },
    { date: "2025-07-01", problem: "The laptop screen is flickering frequently. If you want, I can also give you a system architecture diagram", repairedBy: "Technician B" },
  ];

  return (
    <div className="space-y-6 p-6 rounded-lg">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-gray-900">
          Device Details - {device.serial}
        </h2>
        <Button
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md inline-flex items-center shadow-md"
          onClick={() => navigate(-1)}
        >
          <IoArrowBack className="mr-2" /> Go Back
        </Button>
      </div>

      <p className="text-gray-500 text-lg font-light">
        Review the full device information and repair history.
      </p>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Device Image */}
        <div className="col-span-1 bg-white rounded-xl p-5 flex items-center justify-center transition-transform transform hover:scale-105">
          <img
            src={device.image}
            alt={device.name}
            className="w-full h-64 object-contain rounded-lg"
          />
        </div>

        {/* Device Information */}
        <div className="col-span-2 bg-white border border-gray-200 rounded-xl p-6 space-y-6">
          <h3 className="text-2xl font-semibold border-b border-gray-200 pb-2">
            Device Information
          </h3>
          <div className="grid grid-cols-2 gap-4 text-gray-700">
            {[
              ["Device Name", device.name],
              ["Device Type", device.type],
              ["Serial Number", device.serial],
              ["Working Area", device.area],
              ["Department", device.department],
              ["User Person", device.user],
            ].map(([label, value], idx) => (
              <div key={idx} className="flex flex-col">
                <span className="text-gray-500 text-lg font-medium">{label}</span>
                <span className="text-gray-900 font-semibold">{value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

            {/* Repair History */}
        <div className="bg-blue-50 shadow-lg rounded-xl p-6">
        <h3 className="text-2xl font-semibold border-b border-gray-200 pb-2 mb-4">
            Repair History
        </h3>
        {repairHistory.length > 0 ? (
            <div className="overflow-x-auto">
            <div className="grid grid-cols-12 font-semibold text-black border-b border-gray-200 pb-2 mb-2 text-lg">
                <div className="col-span-7 pl-2">Problem Description</div>
                <div className="col-span-3 pl-4">Technician</div>
                <div className="col-span-2">Date</div>
            </div>

            {repairHistory.map((history, idx) => (
                <div
                key={idx}
                className="text-gray-500 grid grid-cols-12 items-center bg-gray-50 rounded-lg p-3 mb-2 shadow-sm hover:bg-gray-100 transition-colors"
                >
                <div className="col-span-7 text-gray-700">{history.problem}</div>
                <div className="col-span-3 text-gray-600 pl-4">{history.repairedBy}</div>
                <div className="col-span-2 text-gray-500">{history.date}</div>
                </div>
            ))}
            </div>
        ) : (
            <p className="text-gray-500">No repair history available.</p>
        )}
        </div>
    </div>
  );
};

export default DeviceDetail;
