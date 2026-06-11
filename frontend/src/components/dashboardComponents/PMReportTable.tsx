// src/components/dashboardComponents/PMReportTable.tsx

import React, { useState } from "react";

export type PMReportRow = {
  id: string;
  title: string;
  description: string;
  plant: string;
  createdBy: string;
  scheduledDate: string;
  completedDate: string;
  priority: string;
  status: string;
  tasksTotal: number;
  tasksCompleted: number;
  recurrence: string;
  notes: string;
  totalActualDuration?: number;
};

type Props = {
  data?: PMReportRow[];
};

const PMReportTable: React.FC<Props> = ({ data = [] }) => {
  const [selectedNotes, setSelectedNotes] = useState<string | null>(null);

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case "planned":
        return "bg-yellow-500";
      case "in_progress":
        return "bg-blue-600";
      case "completed":
        return "bg-green-700";
      case "cancelled":
        return "bg-red-600";
      default:
        return "bg-gray-500";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "planned":
        return "Planned";
      case "in_progress":
        return "In Progress";
      case "completed":
        return "Completed";
      case "cancelled":
        return "Cancelled";
      default:
        return status;
    }
  };

  const getPriorityBadgeClass = (priority: string) => {
    switch (priority) {
      case "low":
        return "bg-gray-100 text-gray-600";
      case "medium":
        return "bg-blue-100 text-blue-700";
      case "high":
        return "bg-orange-100 text-orange-700";
      case "critical":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  const getPriorityLabel = (priority: string) => {
    return priority.charAt(0).toUpperCase() + priority.slice(1);
  };

  // Format minutes to readable format (X hours, X minutes)
  const formatTotalTime = (minutes: number | null | undefined) => {
    if (!minutes || minutes === 0) return "-";
    
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    
    const parts = [];
    if (hours > 0) parts.push(`${hours}h`);
    if (mins > 0) parts.push(`${mins}m`);
    
    return parts.join(' ');
  };

  return (
    <>
      <div className="w-full overflow-hidden rounded-lg border bg-white shadow-sm">
        {/* ONLY TABLE SCROLLS */}
        <div className="overflow-x-auto">
          <table className="w-full text-[11px]">
            {/* HEADER - smaller font */}
            <thead className="bg-gray-100 border-b">
              <tr>
                <th className="px-3 py-2 text-left w-[40px] text-[10px] font-semibold">#</th>
                <th className="px-3 py-2 text-left text-[10px] font-semibold">Work Order Title</th>
                <th className="px-3 py-2 text-left text-[10px] font-semibold">Plant</th>
                <th className="px-3 py-2 text-left text-[10px] font-semibold">Created By</th>
                <th className="px-3 py-2 text-left text-[10px] font-semibold">Scheduled Date</th>
                <th className="px-3 py-2 text-left text-[10px] font-semibold">Completed Date</th>
                <th className="px-3 py-2 text-left text-[10px] font-semibold">Total Time</th>
                <th className="px-3 py-2 text-left text-[10px] font-semibold">Priority</th>
                <th className="px-3 py-2 text-left text-[10px] font-semibold">Status</th>
                <th className="px-3 py-2 text-left text-[10px] font-semibold">Tasks Progress</th>
                <th className="px-3 py-2 text-left w-[140px] text-[10px] font-semibold">Notes</th>
                <th className="px-3 py-2 text-left text-[10px] font-semibold">Recurrence</th>
              </tr>
            </thead>

            {/* BODY */}
            <tbody>
              {data.length > 0 ? (
                data.map((row, index) => {
                  const tasksPercentage = row.tasksTotal > 0
                    ? Math.round((row.tasksCompleted / row.tasksTotal) * 100)
                    : 0;

                  return (
                    <tr key={row.id || index} className="border-b hover:bg-gray-50">
                      <td className="px-3 py-2 text-gray-500">{index + 1}</td>
                      <td className="px-3 py-2 break-words">
                        <div className="font-medium text-gray-900 text-[11px]">{row.title}</div>
                        {row.description && row.description !== "—" && (
                          <div className="text-[10px] text-gray-400 mt-0.5 truncate max-w-[200px]">
                            {row.description}
                          </div>
                        )}
                      </td>
                      <td className="px-3 py-2 break-words text-[11px]">{row.plant}</td>
                      <td className="px-3 py-2 break-words text-[11px]">{row.createdBy}</td>
                      <td className="px-3 py-2 whitespace-nowrap text-[11px]">
                        {row.scheduledDate ? new Date(row.scheduledDate).toLocaleDateString() : "-"}
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap text-[11px]">
                        {row.completedDate ? new Date(row.completedDate).toLocaleDateString() : "-"}
                      </td>
                      <td className="px-3 py-2 text-[11px]">
                        {row.totalActualDuration && row.totalActualDuration > 0 ? (
                          <span className="font-medium text-blue-600">
                            {formatTotalTime(row.totalActualDuration)}
                          </span>
                        ) : (
                          "-"
                        )}
                      </td>
                      <td className="px-3 py-2">
                        <span className={`px-1.5 py-0.5 rounded-full text-[9px] font-medium ${getPriorityBadgeClass(row.priority)}`}>
                          {getPriorityLabel(row.priority)}
                        </span>
                      </td>
                      <td className="px-3 py-2">
                        <span className={`px-1.5 py-0.5 rounded-full text-[9px] text-white ${getStatusBadgeClass(row.status)}`}>
                          {getStatusLabel(row.status)}
                        </span>
                      </td>
                      <td className="px-3 py-2">
                        <div className="flex items-center gap-2 min-w-[100px]">
                          <span className="text-[9px] font-medium text-gray-600 min-w-[35px]">
                            {row.tasksCompleted}/{row.tasksTotal}
                          </span>
                          <div className="flex-1 bg-gray-200 rounded-full h-1.5 max-w-[60px]">
                            <div
                              className="bg-primary-500 h-1.5 rounded-full transition-all"
                              style={{ width: `${tasksPercentage}%` }}
                            />
                          </div>
                          <span className="text-[9px] text-gray-400 min-w-[30px]">
                            {tasksPercentage}%
                          </span>
                        </div>
                      </td>
                      <td className="px-3 py-2 max-w-[140px]">
                        <button
                          type="button"
                          onClick={() => setSelectedNotes(row.notes || "—")}
                          className="block w-full truncate text-left text-blue-600 hover:underline text-[10px]"
                        >
                          {row.notes && row.notes !== "—" ? "View Notes" : "—"}
                        </button>
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap">
                        {row.recurrence !== "none" ? (
                          <span className="inline-flex items-center gap-1 px-1.5 py-0.5 text-[9px] rounded-full bg-blue-50 text-blue-700">
                            <span>🔄</span>
                            {row.recurrence.charAt(0).toUpperCase() + row.recurrence.slice(1)}
                          </span>
                        ) : (
                          <span className="text-[10px]">None</span>
                        )}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={12} className="py-8 text-center text-gray-500 text-[11px]">
                    No PM work orders found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* NOTES MODAL */}
      {selectedNotes && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-lg rounded-lg bg-white shadow-lg">
            <div className="flex items-center justify-between border-b px-4 py-3">
              <h2 className="text-sm font-semibold">Work Order Notes</h2>
              <button
                onClick={() => setSelectedNotes(null)}
                className="text-lg text-gray-500 hover:text-gray-700"
              >
                ×
              </button>
            </div>
            <div className="max-h-[400px] overflow-y-auto p-4 text-sm whitespace-pre-wrap">
              {selectedNotes}
            </div>
            <div className="flex justify-end border-t px-4 py-3">
              <button
                onClick={() => setSelectedNotes(null)}
                className="rounded-md bg-blue-600 px-3 py-1.5 text-xs text-white hover:bg-blue-700"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default PMReportTable;