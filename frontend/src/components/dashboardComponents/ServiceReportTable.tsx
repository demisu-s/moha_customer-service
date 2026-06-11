// src/components/dashboardComponents/ServiceReportTable.tsx

import React, { useState } from "react";

export type ReportRow = {
  requestedBy: string;
  requestedDate: string;
  plant: string;
  problemCategory: string;
  deviceType: string;
  problemType: string;
  priority: string;
  solvedBy: string;
  solution: string;
  status: string;
};

type Props = {
  data?: ReportRow[];
};

const ServiceReportTable: React.FC<Props> = ({ data = [] }) => {
  const [selectedSolution, setSelectedSolution] = useState<string | null>(null);

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case "Resolved":
        return "bg-green-700";
      case "Assigned":
        return "bg-blue-600";
      case "Unresolved":
        return "bg-red-600";
      default:
        return "bg-yellow-500";
    }
  };

  return (
    <>
      <div className="w-full overflow-hidden rounded-lg border bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-[11px]">
            {/* HEADER - smaller font like PM table */}
            <thead className="bg-gray-100 border-b">
              <tr>
                <th className="px-3 py-2 text-left w-[40px] text-[10px] font-semibold">#</th>
                <th className="px-3 py-2 text-left text-[10px] font-semibold">Requested By</th>
                <th className="px-3 py-2 text-left text-[10px] font-semibold">Requested Date</th>
                <th className="px-3 py-2 text-left text-[10px] font-semibold">Plant</th>
                <th className="px-3 py-2 text-left text-[10px] font-semibold">Problem Category</th>
                <th className="px-3 py-2 text-left text-[10px] font-semibold">Device Type</th>
                <th className="px-3 py-2 text-left text-[10px] font-semibold">Problem Type</th>
                <th className="px-3 py-2 text-left text-[10px] font-semibold">Priority</th>
                <th className="px-3 py-2 text-left text-[10px] font-semibold">Solved By</th>
                <th className="px-3 py-2 text-left w-[140px] text-[10px] font-semibold">Solution</th>
                <th className="px-3 py-2 text-left text-[10px] font-semibold">Status</th>
              </tr>
            </thead>

            <tbody>
              {data.length > 0 ? (
                data.map((row, index) => (
                  <tr key={index} className="border-b hover:bg-gray-50">
                    <td className="px-3 py-2 text-gray-500 text-[11px]">{index + 1}</td>
                    <td className="px-3 py-2 break-words text-[11px]">{row.requestedBy}</td>
                    <td className="px-3 py-2 text-[11px]">{row.requestedDate}</td>
                    <td className="px-3 py-2 break-words text-[11px]">{row.plant}</td>
                    <td className="px-3 py-2 break-words text-[11px]">{row.problemCategory}</td>
                    <td className="px-3 py-2 break-words text-[11px]">{row.deviceType}</td>
                    <td className="px-3 py-2 break-words text-[11px]">{row.problemType}</td>
                    <td className="px-3 py-2 text-[11px]">{row.priority}</td>
                    <td className="px-3 py-2 break-words text-[11px]">{row.solvedBy}</td>
                    <td className="px-3 py-2 max-w-[140px]">
                      <button
                        type="button"
                        onClick={() => setSelectedSolution(row.solution || "—")}
                        className="block w-full truncate text-left text-blue-600 hover:underline text-[10px]"
                      >
                        {row.solution || "—"}
                      </button>
                    </td>
                    <td className="px-3 py-2">
                      <span className={`px-1.5 py-0.5 rounded-full text-[9px] text-white ${getStatusBadgeClass(row.status)}`}>
                        {row.status}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={11} className="py-8 text-center text-gray-500 text-[11px]">
                    No report found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* SOLUTION MODAL */}
      {selectedSolution && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-lg rounded-lg bg-white shadow-lg">
            <div className="flex items-center justify-between border-b px-4 py-3">
              <h2 className="text-sm font-semibold">Solution Detail</h2>
              <button
                onClick={() => setSelectedSolution(null)}
                className="text-lg text-gray-500 hover:text-gray-700"
              >
                ×
              </button>
            </div>
            <div className="max-h-[400px] overflow-y-auto p-4 text-sm whitespace-pre-wrap">
              {selectedSolution}
            </div>
            <div className="flex justify-end border-t px-4 py-3">
              <button
                onClick={() => setSelectedSolution(null)}
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

export default ServiceReportTable;