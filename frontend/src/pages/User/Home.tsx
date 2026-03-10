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
    <div className="px-4">
      <h1 className="text-2xl font-bold mb-1">Welcome, {currentUser?.firstName || 'User'}!</h1>
      <h6 className="text-sm font-light mb-3 text-gray-600">
        This is your dashboard. Look at your devices, see their details and status,
        and if any problem occurs ask for help — we will reach you with good maintenance.
      </h6>
      <h2 className="font-bold text-2xl mb-4">My Devices</h2>

      {userDevices.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500 text-lg">
            No devices assigned to you yet.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
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
