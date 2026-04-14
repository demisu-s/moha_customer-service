import React, { useMemo, useState } from "react";
import {
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { ServiceRequest } from "../../context/ServiceRequestContext";

type Props = {
  requests: ServiceRequest[];
};

const RequestsChart: React.FC<Props> = ({ requests }) => {
  const [selectedPlant, setSelectedPlant] = useState("All");

  /* ================= FILTER BY PLANT ================= */
  const filteredRequests = useMemo(() => {
    if (selectedPlant === "All") return requests;
    return requests.filter((r) => r.plant === selectedPlant);
  }, [requests, selectedPlant]);

  /* ================= PLANT OPTIONS ================= */
  const plantOptions = useMemo(() => {
    const set = new Set<string>();
    requests.forEach((r) => {
      if (r.plant) set.add(r.plant);
    });
    return ["All", ...Array.from(set)];
  }, [requests]);

  /* ================= CHART DATA ================= */
  const data = useMemo(() => {
    const months = [
      "Jan","Feb","Mar","Apr","May","Jun",
      "Jul","Aug","Sep","Oct","Nov","Dec"
    ];

    return months.map((m, index) => {
      const monthRequests = filteredRequests.filter((r) => {
        const d = new Date(r.createdAt);
        return d.getMonth() === index;
      });

      return {
        month: m,
        solved: monthRequests.filter((r) => r.status === "Resolved").length,
        pending: monthRequests.filter((r) => r.status === "Pending").length,
        assigned: monthRequests.filter((r) => r.status === "Assigned").length,
        unresolved: monthRequests.filter((r) => r.status === "Unresolved").length,
      };
    });
  }, [filteredRequests]);

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-semibold">Plants Request Overview Chart</h3>

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

      {/* CHART */}
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Legend />

          <Bar dataKey="solved" name="Resolved" fill="#22c55e" />
          <Bar dataKey="pending" name="Pending" fill="#f59e0b" />
          <Bar dataKey="assigned" name="Assigned" fill="#3b82f6" />
          <Bar dataKey="unresolved" name="Unresolved" fill="#ef4444" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default RequestsChart;