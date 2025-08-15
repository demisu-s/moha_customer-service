// src/pages/Home.tsx
import React from "react";
import DeviceCardUser from "../../components/dashboardComponents/DeviceCarduser";
import { useDeviceContext } from "../../context/DeviceContext";

const Home: React.FC = () => {
  const { getDevicesByUser } = useDeviceContext();
  const currentUserId = localStorage.getItem("userId");
  const currentUserName = localStorage.getItem("userName");
  
  // Get devices for the current user
  const userDevices = currentUserId ? getDevicesByUser(currentUserId) : [];

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Welcome, {currentUserName || 'User'}!</h1>
      <h2 className="text-lg font-semibold mb-4 text-gray-600">My Devices</h2>
      
      {userDevices.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500 text-lg">No devices assigned to you yet.</p>
          <p className="text-gray-400 text-sm">Contact your administrator to get devices assigned.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {userDevices.map((device) => (
            <DeviceCardUser
              key={device.id}
              id={device.id}
              deviceType={device.type}
              serialNo={device.serial}
              department={device.department}
              area={device.area}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Home;
