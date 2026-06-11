import React from "react";

interface StatusBadgeProps {
  status: string;
}

const statusMap: Record<string, string> = {
  planned: "bg-yellow-100 text-yellow-700",
  in_progress: "bg-blue-100 text-blue-700",
  completed: "bg-green-100 text-green-700",
  cancelled: "bg-red-100 text-red-700",
};

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const color = statusMap[status] || statusMap.planned;
  return (
    <span className={`px-2 py-0.5 rounded text-xs font-medium ${color}`}>
      {status.replace("_", " ")}
    </span>
  );
};