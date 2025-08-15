import React, { useState } from "react";
import StatCard from "../../components/dashboardComponents/StatCard";
import RequestsChart from "../../components/dashboardComponents/RequestsChart";
import SupervisorCard from "../../components/dashboardComponents/SupervisorCard";

const mockSupervisors = [
  {
    name: "John Doe",
    plant: "Head Office",
    workload: 12,
    totalSolved: 50,
    avatarUrl: "https://i.pravatar.cc/100?img=1",
  },
  {
    name: "Jane Smith",
    plant: "Summit",
    workload: 8,
    totalSolved: 42,
    avatarUrl: "https://i.pravatar.cc/100?img=2",
  },
  {
    name: "Michael Lee",
    plant: "Nifas Silk",
    workload: 15,
    totalSolved: 60,
    avatarUrl: "https://i.pravatar.cc/100?img=3",
  },
  {
    name: "Sarah Brown",
    plant: "Head Office",
    workload: 10,
    totalSolved: 38,
    avatarUrl: "https://i.pravatar.cc/100?img=4",
  },
  {
    name: "Sarah Brown",
    plant: "Head Office",
    workload: 10,
    totalSolved: 38,
    avatarUrl: "https://i.pravatar.cc/100?img=4",
  },
  {
    name: "Sarah Brown",
    plant: "Head Office",
    workload: 10,
    totalSolved: 38,
    avatarUrl: "https://i.pravatar.cc/100?img=4",
  },
];

const Overview: React.FC = () => {
    const [selectedPlant, setSelectedPlant] = useState("All");

  const filteredSupervisors =
    selectedPlant === "All"
      ? mockSupervisors
      : mockSupervisors.filter((sup) => sup.plant === selectedPlant);

  return (
    <div className="px-6 space-y-6">
      <h1 className="text-2xl font-bold">Task Overview</h1>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Assigned Tasks" value={29} subtitle="Last week" />
        <StatCard title="Pending Tasks" value={29} subtitle="Last week" />
        <StatCard title="Resolved Tasks" value={29} subtitle="Last week" />
        <StatCard title="Total Users" value={590} />
      </div>

      {/* Chart */}
      <RequestsChart />

     {/* Supervisors Section */}
      <div className="rounded-lg p-4 border border-gray-200 bg-white">
        <div className="flex justify-between items-center mb-3">
            <div>
            <h3 className="font-semibold text-2xl mb-2">Supervisors Overview</h3>
            <p className="text-sm text-gray-600 mb-1">
  View and filter supervisors by plant location. Check each supervisor's workload and total solved requests.
</p></div>
          <select
            value={selectedPlant}
            onChange={(e) => setSelectedPlant(e.target.value)}
            className="border rounded px-2 py-1 text-sm"
          >
            <option value="All">All Plants</option>
            <option value="Head Office">Head Office</option>
            <option value="Summit">Summit</option>
            <option value="Nifas Silk">Nifas Silk</option>
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          {filteredSupervisors.map((sup, idx) => (
            <SupervisorCard key={idx} {...sup} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Overview;
