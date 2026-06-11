import React from "react";

interface PriorityBadgeProps {
  priority: string;
}

const priorityMap: Record<string, string> = {
  low: "bg-gray-100 text-gray-600",
  medium: "bg-blue-100 text-blue-700",
  high: "bg-orange-100 text-orange-700",
  critical: "bg-red-100 text-red-700",
};

export const PriorityBadge: React.FC<PriorityBadgeProps> = ({ priority }) => {
  const color = priorityMap[priority] || priorityMap.medium;
  return (
    <span className={`px-2 py-0.5 rounded text-xs font-medium ${color}`}>
      {priority.charAt(0).toUpperCase() + priority.slice(1)}
    </span>
  );
};