// src/pages/dashboard/Home.tsx
import React, { useState } from "react";
import DeviceCard from "../../components/dashboardComponents/DeviceCard";
import { maintenanceRequests } from "../../data/mockdata";

const Home: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"Pending" | "Assigned" | "Resolved">("Pending");
  const [search, setSearch] = useState("");
  
  // Get admin info from localStorage
  const adminName = localStorage.getItem("userId") === "admin" ? "Administrator" : "User";

  const filteredRequests = maintenanceRequests.filter(
    (request) =>
      request.device.status === activeTab &&
      (request.device.serial.includes(search) ||
        request.requester.name.toLowerCase().includes(search.toLowerCase()) ||
        request.requester.department.toLowerCase().includes(search.toLowerCase()))
  );


  return (
   <div className="px-4 space-y-6 font-sans">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 pb-1">
            Welcome, {adminName}!
          </h1>
          <p className="text-sm text-gray-400 max-w-xl">
            Select a category to view devices. You can search by serial number, username, or department.
          </p>
        </div>
        <div className="w-full md:w-[300px]">
          <input
            type="text"
            placeholder="Search devices..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md text-sm"
          />
        </div>
      </div>

     {/* Tabs */}
      <div className="flex gap-16 border-b border-gray-200">
        {["Pending", "Assigned", "Resolved"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab as any)}
            className={`relative px-4 pb-2 text-xl font-bold capitalize transition-all duration-200 ${
              activeTab === tab ? "text-primary-500" : "text-gray-600"
            }`}
          >
            {tab}
            {activeTab === tab && (
              <span className="absolute left-0 bottom-0 w-full h-[3px] bg-primary-500 rounded-full transition-all duration-200" />
            )}
          </button>
        ))}
      </div>

      {/* Cards */}
     {filteredRequests.length === 0 ? (
        <p className="text-gray-500 italic">No devices found for this status.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredRequests.map((request) => (
            <DeviceCard
              key={request.id}
              id={request.id}
              deviceType={request.device.type}
              serialNo={request.device.serial}
              department={request.requester.department}
              area={request.requester.location}
              userName={request.requester.name}
              problem={request.issue.description}
              status={request.device.status} 
            />
          ))}
        </div>
      )}
    </div>
  );
};


export default Home;
