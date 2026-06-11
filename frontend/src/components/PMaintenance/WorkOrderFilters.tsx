import React from "react";

interface WorkOrderFiltersProps {
  search: string;
  onSearchChange: (value: string) => void;
  filterStatus: string;
  onStatusChange: (value: string) => void;
  filterPlant: string;
  onPlantChange: (value: string) => void;
  filterDate: string;
  onDateChange: (value: string) => void;
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
  filterDate,
  onDateChange,
  showPlantFilter,
  plants,
  onClearFilters,
  hasActiveFilters,
}) => {
  return (
    <div className="bg-white rounded-lg shadow border p-4 flex flex-col md:flex-row gap-3 flex-wrap">
      {/* Search */}
      <input
        type="text"
        placeholder="Search by title or plant..."
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
        className="border rounded-lg px-3 py-2 flex-1 min-w-[200px] focus:outline-none focus:ring-2 focus:ring-primary-500"
      />

      {/* Status filter */}
      <select
        value={filterStatus}
        onChange={(e) => onStatusChange(e.target.value)}
        className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
      >
        <option value="all">All Status</option>
        <option value="planned">Planned</option>
        <option value="in_progress">In Progress</option>
        <option value="completed">Completed</option>
        <option value="cancelled">Cancelled</option>
      </select>

      {/* Plant filter — SuperAdmin only */}
      {showPlantFilter && (
        <select
          value={filterPlant}
          onChange={(e) => onPlantChange(e.target.value)}
          className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
        >
          <option value="all">All Plants</option>
          {plants.map((p: any) => (
            <option key={p._id} value={p._id}>
              {p.name}
            </option>
          ))}
        </select>
      )}

      {/* Date filter */}
      <input
        type="date"
        value={filterDate}
        onChange={(e) => onDateChange(e.target.value)}
        className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
        title="Filter by scheduled date"
      />

      {/* Clear filters */}
      {hasActiveFilters && (
        <button
          onClick={onClearFilters}
          className="text-sm text-gray-500 hover:text-red-500 px-3 py-2 border rounded-lg"
        >
          Clear
        </button>
      )}
    </div>
  );
};