import React from "react";

interface StatCardProps {
  label: string;
  value: number;
  color: string;
}

const StatCard: React.FC<StatCardProps> = ({ label, value, color }) => (
  <div className="bg-white rounded-lg shadow border p-4">
    <p className="text-gray-500 text-sm">{label}</p>
    <p className={`text-3xl font-bold mt-2 ${color}`}>{value}</p>
  </div>
);

interface WorkOrderStatsProps {
  total: number;
  planned: number;
  inProgress: number;
  completed: number;
}

export const WorkOrderStats: React.FC<WorkOrderStatsProps> = ({
  total,
  planned,
  inProgress,
  completed,
}) => {
  const stats = [
    { label: "Total", value: total, color: "text-gray-800" },
    { label: "Planned", value: planned, color: "text-yellow-600" },
    { label: "In Progress", value: inProgress, color: "text-blue-600" },
    { label: "Completed", value: completed, color: "text-green-600" },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {stats.map((stat) => (
        <StatCard key={stat.label} {...stat} />
      ))}
    </div>
  );
};