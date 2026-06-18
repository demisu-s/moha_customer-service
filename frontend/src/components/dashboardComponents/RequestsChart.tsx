// src/components/dashboardComponents/RequestsChart.tsx
import React, { useMemo } from "react";
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
import { PlantPayload } from "../../api/global.types";

type Props = {
  requests: ServiceRequest[];
  userRole?: string;
  userPlant?: string | null;
  plants?: PlantPayload[];
  selectedPlant?: string;
};

const RequestsChart: React.FC<Props> = ({ 
  requests, 
  userRole, 
  userPlant,
  plants = [],
  selectedPlant = "All"
}) => {
  /* ================= FILTER BY PLANT ================= */
  const filteredRequests = useMemo(() => {
    // For superadmin, filter by selected plant
    if (userRole === "superadmin") {
      if (selectedPlant === "All") return requests;
      return requests.filter((r) => r.plant === selectedPlant);
    }
    
    // For admin and supervisor, only show their plant
    if ((userRole === "admin" || userRole === "supervisor") && userPlant) {
      return requests.filter((r) => r.plant === userPlant);
    }
    
    return requests;
  }, [requests, selectedPlant, userRole, userPlant]);

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
    <div className="bg-white p-4 rounded-xl shadow-lg border border-gray-100">
      {/* HEADER */}
      <div className="mb-4">
        <h3 className="font-semibold text-gray-800">Plants Request Overview Chart</h3>
        <p className="text-xs text-gray-400 mt-0.5">
          {userRole === "superadmin" 
            ? selectedPlant === "All" 
              ? "Showing all plants" 
              : `Showing ${selectedPlant} plant`
            : `Showing ${userPlant || "your"} plant`}
        </p>
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