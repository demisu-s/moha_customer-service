// src/pages/dashboard/Home.tsx
import React, { useState } from "react";
import DeviceCard from "../../components/dashboardComponents/DeviceCard";
import { useServiceRequests } from "../../context/ServiceRequestContext";

const Home: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"Pending" | "Assigned" | "Resolved" | "Unresolved">("Pending");
  const [search, setSearch] = useState("");

  // ✅ Use context instead of manually reading localStorage
  const { requests } = useServiceRequests();

  const userRole = localStorage.getItem("role");
  const userId = localStorage.getItem("userId");
  const userName = localStorage.getItem("userName");

  // Only Admin & Supervisor allowed here
  if (userRole !== "admin" && userRole !== "supervisor") {
    return (
      <div className="p-6 text-center text-red-600 font-semibold">
        This dashboard is only available for Admin and Supervisor.
      </div>
    );
  }

  // Tabs available
  const availableTabs: ("Pending" | "Assigned" | "Resolved" | "Unresolved")[] = [
    "Pending",
    "Assigned",
    "Resolved",
    "Unresolved",
  ];

  // ✅ Filter requests from context (no need for localStorage)
  const filteredRequests = requests.filter((request) => {
    const matchesTab = request.status === activeTab;
    const matchesSearch =
      request.deviceSerial?.toLowerCase().includes(search.toLowerCase()) ||
      request.description?.toLowerCase().includes(search.toLowerCase()) ||
      request.requestedBy?.toLowerCase().includes(search.toLowerCase()) ||
      request.urgency?.toLowerCase().includes(search.toLowerCase()) ||
      request.area?.toLowerCase().includes(search.toLowerCase()) ||
      request.department?.toLowerCase().includes(search.toLowerCase()) ||
      request.problemCategory?.toLowerCase().includes(search.toLowerCase()) ||
      request.issues?.toLowerCase().includes(search.toLowerCase()) || // ✅ Added search by issues
      request.assignedToName?.toLowerCase().includes(search.toLowerCase()) ||
      request.assignedTo?.toLowerCase().includes(search.toLowerCase())


    if (userRole === "admin") {
      return matchesTab && matchesSearch;
    }

    if (userRole === "supervisor") {
      if (activeTab === "Assigned") {
        // Supervisors see only the ones assigned to them
        return matchesTab && matchesSearch && request.assignedTo === userId;
      }
      // For Pending, Resolved, and Unresolved -> supervisors see all
      return matchesTab && matchesSearch;
    }

    return false;
  });

  return (
    <div className="px-4 space-y-6 font-sans">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 pb-1">
            Welcome, {userName || "User"}!
          </h1>
          <p className="text-sm text-gray-400 max-w-xl">
            Select a category to view devices. You can search by serial number,
            username, department, or issues.
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
        {availableTabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
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
              deviceType={request.deviceType || "Device"}
              serialNo={request.deviceSerial}
              department={request.department}
              area={request.area}
              userName={request.requestedBy}
              problemCategory={request.problemCategory}
              issues={request.issues}
              problem={request.description}
              status={request.status}
              supervisorName={request.assignedToName || request.assignedTo || ""}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Home;
