// src/components/report/PMPilters.tsx
import React from "react";

interface PMFiltersProps {
  pmStatus: string;
  onPmStatusChange: (value: string) => void;
  pmPriorityFilter: string;
  onPmPriorityFilterChange: (value: string) => void;
  plantFilter: string;
  onPlantFilterChange: (value: string) => void;
  pmDateType: "scheduledDate" | "completedDate";
  onPmDateTypeChange: (value: "scheduledDate" | "completedDate") => void;
  startDate: string;
  onStartDateChange: (value: string) => void;
  endDate: string;
  onEndDateChange: (value: string) => void;
  isSuperAdmin: boolean;
  plants: string[];
}

export const PMPilters: React.FC<PMFiltersProps> = ({
  pmStatus,
  onPmStatusChange,
  pmPriorityFilter,
  onPmPriorityFilterChange,
  plantFilter,
  onPlantFilterChange,
  pmDateType,
  onPmDateTypeChange,
  startDate,
  onStartDateChange,
  endDate,
  onEndDateChange,
  isSuperAdmin,
  plants,
}) => {
  return (
    <div className="bg-white border rounded-lg p-3 shadow-sm">
      <div className="flex flex-wrap gap-2 items-center">
        <select
          value={pmStatus}
          onChange={(e) => onPmStatusChange(e.target.value)}
          className="h-8 text-xs border rounded-md px-2"
        >
          <option value="all">All Status</option>
          <option value="planned">Planned</option>
          <option value="in_progress">In Progress</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
        </select>

        <select
          value={pmPriorityFilter}
          onChange={(e) => onPmPriorityFilterChange(e.target.value)}
          className="h-8 text-xs border rounded-md px-2"
        >
          <option value="all">All Priorities</option>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
          <option value="critical">Critical</option>
        </select>

        {isSuperAdmin && (
          <select
            value={plantFilter}
            onChange={(e) => onPlantFilterChange(e.target.value)}
            className="h-8 text-xs border rounded-md px-2"
          >
            {plants.map((plant) => (
              <option key={plant} value={plant}>
                {plant === "all" ? "All Plants" : plant}
              </option>
            ))}
          </select>
        )}

        <select
          value={pmDateType}
          onChange={(e) => onPmDateTypeChange(e.target.value as any)}
          className="h-8 text-xs border rounded-md px-2"
        >
          <option value="scheduledDate">Scheduled Date</option>
          <option value="completedDate">Completed Date</option>
        </select>

        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-500">From</span>
          <input
            type="date"
            value={startDate}
            onChange={(e) => onStartDateChange(e.target.value)}
            className="h-8 text-xs border rounded-md px-2"
          />
          <span className="text-xs text-gray-500">To</span>
          <input
            type="date"
            value={endDate}
            onChange={(e) => onEndDateChange(e.target.value)}
            className="h-8 text-xs border rounded-md px-2"
          />
        </div>
      </div>
    </div>
  );
};