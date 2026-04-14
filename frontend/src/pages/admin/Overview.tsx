// src/pages/Overview.tsx
import React, { useMemo, useState } from "react";
import StatCard from "../../components/dashboardComponents/StatCard";
import RequestsChart from "../../components/dashboardComponents/RequestsChart";
import SupervisorCard from "../../components/dashboardComponents/SupervisorCard";

import { useServiceRequests } from "../../context/ServiceRequestContext";
import { useUserContext } from "../../context/UserContext";

const Overview: React.FC = () => {
  const { requests } = useServiceRequests();
  const { users } = useUserContext();

  const [selectedPlant, setSelectedPlant] = useState("All");

  /* =========================
     📊 STATS (REAL DATA)
  ========================== */
  const stats = useMemo(() => {
    let assigned = 0;
    let pending = 0;
    let resolved = 0;
    let unresolved = 0;

    requests.forEach((req) => {
      if (req.status === "Assigned") assigned++;
      else if (req.status === "Pending") pending++;
      else if (req.status === "Resolved") resolved++;
      else if (req.status === "Unresolved") unresolved++;
    });

    return {
      assigned,
      pending,
      resolved,
      unresolved,
      totalTasks: requests.length,
    };
  }, [requests]);

  /* =========================
     👨‍🔧 SUPERVISORS (REAL DATA)
  ========================== */
  const supervisorsData = useMemo(() => {
    const grouped: Record<
      string,
      {
        name: string;
        plant: string;
        workload: number;
        totalSolved: number;
        avatarUrl?: "https://i.pravatar.cc/100?img=1";
      }
    > = {};

    requests.forEach((req) => {
      if (!req.assignedTo) return;

      const user = users.find((u) => u._id === req.assignedTo);

      const key = req.assignedTo;

      const name = user
        ? `${user.firstName} ${user.lastName}`
        : req.assignedToName || "Unknown";

      // ✅ FIXED: Plant logic (IMPORTANT)
      const plant =
        req.plant ||
        (user as any)?.plant?.name ||
        user?.department?.name ||
        "Unknown";

      if (!grouped[key]) {
        grouped[key] = {
          name,
          plant,
          workload: 0,
          totalSolved: 0,
        };
      }

      // workload = assigned + pending
      if (req.status === "Assigned" || req.status === "Pending") {
        grouped[key].workload += 1;
      }

      // solved count
      if (req.status === "Resolved") {
        grouped[key].totalSolved += 1;
      }
    });

    return Object.values(grouped);
  }, [requests, users]);

  /* =========================
     🌍 PLANT FILTER OPTIONS (DYNAMIC)
  ========================== */
  const plantOptions = useMemo(() => {
    const set = new Set<string>();

    supervisorsData.forEach((s) => {
      if (s.plant) set.add(s.plant);
    });

    return ["All", ...Array.from(set)];
  }, [supervisorsData]);

  /* =========================
     🔎 FILTER SUPERVISORS
  ========================== */
  const filteredSupervisors =
    selectedPlant === "All"
      ? supervisorsData
      : supervisorsData.filter((s) => s.plant === selectedPlant);

  return (
    <div className="px-6 space-y-6">
      <h1 className="text-2xl font-bold">Total Task Overview</h1>

      {/* =========================
          📊 STAT CARDS
      ========================== */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard title="Total Tasks" value={stats.totalTasks} />
        <StatCard title="Assigned Tasks" value={stats.assigned} />
        <StatCard title="Pending Tasks" value={stats.pending} />
        <StatCard title="Resolved Tasks" value={stats.resolved} />
        <StatCard title="Unresolved Tasks" value={stats.unresolved} />
      </div>

      {/* =========================
          📈 CHART (REAL DATA)
      ========================== */}
      <RequestsChart requests={requests} />

      {/* =========================
          👨‍🔧 SUPERVISORS SECTION
      ========================== */}
      <div className="rounded-lg p-4 border border-gray-200 bg-white">
        <div className="flex justify-between items-center mb-3">
          <div>
            <h3 className="font-semibold text-2xl mb-2">
              Supervisors Overview
            </h3>
            <p className="text-sm text-gray-600">
              View and filter supervisors by plant location.
            </p>
          </div>

          {/* PLANT FILTER */}
          <select
            value={selectedPlant}
            onChange={(e) => setSelectedPlant(e.target.value)}
            className="border rounded px-2 py-1 text-sm"
          >
            {plantOptions.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
        </div>

        {/* SUPERVISOR CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          {filteredSupervisors.length === 0 ? (
            <p className="text-gray-500 text-sm">No supervisors found</p>
          ) : (
            filteredSupervisors.map((sup, idx) => (
              <SupervisorCard key={idx} {...sup} />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Overview;