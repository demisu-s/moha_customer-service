// src/pages/Home.tsx
import React from "react";
import DeviceCardUser from "../../components/dashboardComponents/DeviceCarduser";

const Home: React.FC = () => {
  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">My Devices</h1>
      <DeviceCardUser />
    </div>
  );
};

export default Home;
