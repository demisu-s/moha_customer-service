// src/components/report/ServiceFilters.tsx
import React from "react";

interface ServiceFiltersProps {
  serviceStatus: string;
  onServiceStatusChange: (value: string) => void;
  plantFilter: string;
  onPlantFilterChange: (value: string) => void;
  dateType: "createdAt" | "assignedDate" | "resolvedDate";
  onDateTypeChange: (value: "createdAt" | "assignedDate" | "resolvedDate") => void;
  startDate: string;
  onStartDateChange: (value: string) => void;
  endDate: string;
  onEndDateChange: (value: string) => void;
  isSuperAdmin: boolean;
  plants: string[];
}

export const ServiceFilters: React.FC<ServiceFiltersProps> = ({
  serviceStatus,
  onServiceStatusChange,
  plantFilter,
  onPlantFilterChange,
  dateType,
  onDateTypeChange,
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
          value={serviceStatus}
          onChange={(e) => onServiceStatusChange(e.target.value)}
          className="h-8 text-xs border rounded-md px-2"
        >
          <option value="all">All Status</option>
          <option value="Pending">Pending</option>
          <option value="Assigned">Assigned</option>
          <option value="Resolved">Resolved</option>
          <option value="Unresolved">Unresolved</option>
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
          value={dateType}
          onChange={(e) => onDateTypeChange(e.target.value as any)}
          className="h-8 text-xs border rounded-md px-2"
        >
          <option value="createdAt">Requested Date</option>
          <option value="assignedDate">Assigned Date</option>
          <option value="resolvedDate">Resolved Date</option>
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