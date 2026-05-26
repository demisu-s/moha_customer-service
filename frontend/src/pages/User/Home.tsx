import React from "react";
import DeviceCardUser from "../../components/dashboardComponents/DeviceCarduser";
import { useDeviceContext } from "../../context/DeviceContext";
import { useUserContext } from "../../context/UserContext";

const Home: React.FC = () => {
  const { getDevicesByUser } = useDeviceContext();
  const { currentUser } = useUserContext();

  const userDevices =
    currentUser ? getDevicesByUser(currentUser._id) : [];

  return (
    <div className="w-full">
      {/* Welcome Section */}
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold mb-2">
          Welcome, {currentUser?.firstName || "User"}!
        </h1>

        <p className="text-sm md:text-base text-gray-600 leading-relaxed">
          This is your dashboard. Look at your devices, see their details
          and status, and if any problem occurs ask for help — we will
          reach you with good maintenance.
        </p>
      </div>

      {/* Devices */}
      <h2 className="text-xl md:text-2xl font-bold mb-4">
        My Devices
      </h2>

      {userDevices.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-gray-500 text-base md:text-lg">
            No devices assigned to you yet.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 xl:grid-cols-3 gap-2 md:gap-2 place-items-center">
          {userDevices.map((device) => (
            <DeviceCardUser
              key={device._id}
              id={device._id}
              deviceType={device.deviceType}
              serialNo={device.serialNumber}
              department={device.department?.name || ""}
              plant={device.plant?.name || ""}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Home;