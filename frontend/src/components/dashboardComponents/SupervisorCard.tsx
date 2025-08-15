import React from "react";

interface SupervisorCardProps {
  name: string;
  plant: string;
  workload: number;
  totalSolved: number;
  avatarUrl?: string;
}

const SupervisorCard: React.FC<SupervisorCardProps> = ({
  name,
  plant,
  workload,
  totalSolved,
  avatarUrl = "https://via.placeholder.com/40",
}) => {
  return (
    <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-4 flex items-center gap-4">
      <img
        src={avatarUrl}
        alt={name}
        className="w-12 h-12 rounded-full object-cover"
      />
      <div className="flex flex-col flex-grow">
        <div className="flex justify-between items-center">
        <h4 className="font-semibold text-base">{name}</h4>
        <p className="text-xs text-gray-500 text-right">{plant}</p>
       </div>
        <p className="text-sm text-red-700">Workload: {workload}</p>
        <p className="text-sm text-green-600">Solved: {totalSolved}</p>
      </div>
    </div>
  );
};

export default SupervisorCard;
