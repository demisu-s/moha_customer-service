import React from "react";
import { PriorityBadge } from "./PriorityBadge";
import { StatusBadge } from "./StatusBadge";

interface WorkOrderTableProps {
  workOrders: any[];
  loading: boolean;
  isSuperAdmin: boolean;
  executeRouteBase: string;
  onNavigate: (path: string) => void;
  onDelete: (id: string) => void;
  canDelete: boolean;
  getPlantName: (plant: any) => string;
}

export const WorkOrderTable: React.FC<WorkOrderTableProps> = ({
  workOrders,
  loading,
  isSuperAdmin,
  executeRouteBase,
  onNavigate,
  onDelete,
  canDelete,
  getPlantName,
}) => {
  const headers = [
    "#",
    "Title",
    ...(isSuperAdmin ? ["Plant"] : []),
    "Scheduled Date",
    "Priority",
    "Status",
    "Tasks",
    "Action",
  ];

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow border overflow-hidden">
        <div className="text-center py-10 text-gray-400">Loading...</div>
      </div>
    );
  }

  if (workOrders.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow border overflow-hidden">
        <div className="text-center py-10 text-gray-400">
          No work orders yet.
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow border overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              {headers.map((h) => (
                <th
                  key={h}
                  className="px-4 py-3 text-left text-sm font-semibold text-gray-600"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {workOrders.map((wo, i) => (
              <tr key={wo._id} className="border-t hover:bg-gray-50">
                <td className="px-4 py-3 text-gray-500 text-sm">
                  WO-{String(i + 1).padStart(4, "0")}
                </td>
                <td className="px-4 py-3 font-medium">{wo.title}</td>
                {isSuperAdmin && (
                  <td className="px-4 py-3 text-sm text-gray-600">
                    {getPlantName(wo.plant)}
                  </td>
                )}
                <td className="px-4 py-3 text-sm">
                  {new Date(wo.scheduledDate).toLocaleDateString()}
                </td>
                <td className="px-4 py-3">
                  <PriorityBadge priority={wo.priority} />
                </td>
                <td className="px-4 py-3">
                  <StatusBadge status={wo.status} />
                </td>
                <td className="px-4 py-3 text-sm text-gray-600">
                  {wo.tasks.filter((t: any) => t.isCompleted).length}/{wo.tasks.length} done
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    <button
                      onClick={() => onNavigate(`${executeRouteBase}/${wo._id}`)}
                      className="bg-primary-500 text-white px-3 py-1 rounded text-sm hover:bg-primary-700"
                    >
                      {wo.status === "planned" ? "Start" : "View"}
                    </button>
                    {canDelete && (
                      <button
                        onClick={() => onDelete(wo._id)}
                        className="border border-red-300 text-red-500 px-3 py-1 rounded text-sm hover:bg-red-50"
                      >
                        Delete
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {workOrders.length > 0 && (
        <div className="px-4 py-2 border-t text-xs text-gray-400">
          Showing {workOrders.length} work orders
        </div>
      )}
    </div>
  );
};