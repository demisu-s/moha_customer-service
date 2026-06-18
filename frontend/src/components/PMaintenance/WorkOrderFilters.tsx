// components/PMaintenance/WorkOrderFilters.tsx
import React from "react";
import { Search, X, Calendar } from "lucide-react";

interface WorkOrderFiltersProps {
  search: string;
  onSearchChange: (value: string) => void;
  filterStatus: string;
  onStatusChange: (value: string) => void;
  filterPlant: string;
  onPlantChange: (value: string) => void;
  filterDateFrom: string;
  onDateFromChange: (value: string) => void;
  filterDateTo: string;
  onDateToChange: (value: string) => void;
  showPlantFilter: boolean;
  plants: any[];
  onClearFilters: () => void;
  hasActiveFilters: boolean;
}

export const WorkOrderFilters: React.FC<WorkOrderFiltersProps> = ({
  search,
  onSearchChange,
  filterStatus,
  onStatusChange,
  filterPlant,
  onPlantChange,
  filterDateFrom,
  onDateFromChange,
  filterDateTo,
  onDateToChange,
  showPlantFilter,
  plants,
  onClearFilters,
  hasActiveFilters,
}) => {
  const statusOptions = [
    { value: "all", label: "All Status" },
    { value: "planned", label: "Planned" },
    { value: "in_progress", label: "In Progress" },
    { value: "completed", label: "Completed" },
    { value: "cancelled", label: "Cancelled" },
  ];

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-4 space-y-4">
      {/* First Row: Search + Status + Clear */}
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search by title or plant..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition"
          />
        </div>

        {/* Status Filter */}
        <select
          value={filterStatus}
          onChange={(e) => onStatusChange(e.target.value)}
          className="px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition bg-white min-w-[140px]"
        >
          {statusOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        {/* Clear Filters Button */}
        {hasActiveFilters && (
          <button
            onClick={onClearFilters}
            className="flex items-center gap-1 px-4 py-2 text-sm text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition"
          >
            <X size={16} />
            Clear Filters
          </button>
        )}
      </div>

      {/* Second Row: Plant Filter + Date Range */}
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Plant Filter - Only for SuperAdmin */}
        {showPlantFilter && (
          <div className="flex-1 sm:flex-none">
            <select
              value={filterPlant}
              onChange={(e) => onPlantChange(e.target.value)}
              className="w-full sm:w-auto px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition bg-white min-w-[160px]"
            >
              <option value="all">All Plants</option>
              {plants.map((plant) => (
                <option key={plant._id} value={plant._id}>
                  {plant.name}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Date Range */}
        <div className="flex flex-1 flex-wrap items-center gap-2">
          <div className="flex items-center gap-2 flex-1 min-w-[140px]">
            <Calendar size={16} className="text-gray-400" />
            <label className="text-xs font-medium text-gray-500 whitespace-nowrap">From:</label>
            <input
              type="date"
              value={filterDateFrom}
              onChange={(e) => onDateFromChange(e.target.value)}
              className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition"
            />
          </div>

          <div className="flex items-center gap-2 flex-1 min-w-[140px]">
            <Calendar size={16} className="text-gray-400" />
            <label className="text-xs font-medium text-gray-500 whitespace-nowrap">To:</label>
            <input
              type="date"
              value={filterDateTo}
              onChange={(e) => onDateToChange(e.target.value)}
              className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition"
            />
          </div>

          {/* Date Range Quick Actions */}
          {(filterDateFrom || filterDateTo) && (
            <button
              onClick={() => {
                onDateFromChange("");
                onDateToChange("");
              }}
              className="text-xs text-red-500 hover:text-red-600 font-medium whitespace-nowrap"
            >
              Clear Dates
            </button>
          )}
        </div>
      </div>

      {/* Active Filters Display */}
      {hasActiveFilters && (
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-gray-100">
          <span className="text-xs text-gray-500">Active filters:</span>
          
          {search && (
            <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-full">
              Search: {search}
              <button
                onClick={() => onSearchChange("")}
                className="hover:text-blue-900"
              >
                <X size={12} />
              </button>
            </span>
          )}

          {filterStatus !== "all" && (
            <span className="inline-flex items-center gap-1 px-2 py-1 bg-purple-50 text-purple-700 text-xs rounded-full">
              Status: {filterStatus.replace("_", " ")}
              <button
                onClick={() => onStatusChange("all")}
                className="hover:text-purple-900"
              >
                <X size={12} />
              </button>
            </span>
          )}

          {showPlantFilter && filterPlant !== "all" && (
            <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-50 text-green-700 text-xs rounded-full">
              Plant: {plants.find(p => p._id === filterPlant)?.name || filterPlant}
              <button
                onClick={() => onPlantChange("all")}
                className="hover:text-green-900"
              >
                <X size={12} />
              </button>
            </span>
          )}

          {filterDateFrom && (
            <span className="inline-flex items-center gap-1 px-2 py-1 bg-orange-50 text-orange-700 text-xs rounded-full">
              From: {new Date(filterDateFrom).toLocaleDateString()}
            </span>
          )}

          {filterDateTo && (
            <span className="inline-flex items-center gap-1 px-2 py-1 bg-orange-50 text-orange-700 text-xs rounded-full">
              To: {new Date(filterDateTo).toLocaleDateString()}
            </span>
          )}

          {hasActiveFilters && (
            <button
              onClick={onClearFilters}
              className="text-xs text-gray-400 hover:text-gray-600 ml-1"
            >
              Clear all
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default WorkOrderFilters;