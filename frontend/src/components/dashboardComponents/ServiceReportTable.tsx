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

const ServiceReportTable: React.FC<Props> = ({
  data = [],
}) => {

  const [selectedSolution, setSelectedSolution] =
    useState<string | null>(null);

  return (
    <>
      <div className="w-full overflow-hidden rounded-lg border bg-white shadow-sm">

        {/* ONLY TABLE SCROLLS */}

        <div className="overflow-x-auto">

          <table className="w-full text-xs">

            {/* HEADER */}

            <thead className="bg-gray-100 border-b">

              <tr>

                <th className="px-3 py-2 text-left w-[50px]">
                  #
                </th>

                <th className="px-3 py-2 text-left">
                  Requested By
                </th>

                <th className="px-3 py-2 text-left">
                  Requested Date
                </th>

                <th className="px-3 py-2 text-left">
                  Plant
                </th>

                <th className="px-3 py-2 text-left">
                  Problem Category
                </th>

                <th className="px-3 py-2 text-left">
                  Device Type
                </th>

                <th className="px-3 py-2 text-left">
                  Problem Type
                </th>

                <th className="px-3 py-2 text-left">
                  Priority
                </th>

                <th className="px-3 py-2 text-left">
                  Solved By
                </th>

                {/* SMALL COLUMN */}

                <th className="px-3 py-2 text-left w-[140px]">
                  Solution
                </th>

                <th className="px-3 py-2 text-left">
                  Status
                </th>
              </tr>
            </thead>

            {/* BODY */}

            <tbody>

              {data.length > 0 ? (

                data.map((row, index) => (

                  <tr
                    key={index}
                    className="border-b hover:bg-gray-50"
                  >

                    <td className="px-3 py-2 text-gray-500">
                      {index + 1}
                    </td>

                    <td className="px-3 py-2 break-words">
                      {row.requestedBy}
                    </td>

                    <td className="px-3 py-2">
                      {row.requestedDate}
                    </td>

                    <td className="px-3 py-2 break-words">
                      {row.plant}
                    </td>

                    <td className="px-3 py-2 break-words">
                      {row.problemCategory}
                    </td>

                    <td className="px-3 py-2 break-words">
                      {row.deviceType}
                    </td>

                    <td className="px-3 py-2 break-words">
                      {row.problemType}
                    </td>

                    <td className="px-3 py-2">
                      {row.priority}
                    </td>

                    <td className="px-3 py-2 break-words">
                      {row.solvedBy}
                    </td>

                    {/* SOLUTION */}

                    <td className="px-3 py-2 max-w-[140px]">

                      <button
                        type="button"
                        onClick={() =>
                          setSelectedSolution(
                            row.solution || "—"
                          )
                        }
                        className="block w-full truncate text-left text-blue-600 hover:underline"
                      >
                        {row.solution || "—"}
                      </button>
                    </td>

                    {/* STATUS */}

                    <td className="px-3 py-2">

                      <span
                        className={`px-2 py-1 rounded-full text-[10px] text-white ${
                          row.status ===
                          "Resolved"
                            ? "bg-green-700"
                            : row.status ===
                              "Assigned"
                            ? "bg-blue-600"
                            : row.status ===
                              "Unresolved"
                            ? "bg-red-600"
                            : "bg-yellow-500"
                        }`}
                      >
                        {row.status}
                      </span>
                    </td>
                  </tr>
                ))

              ) : (

                <tr>

                  <td
                    colSpan={11}
                    className="py-8 text-center text-gray-500"
                  >
                    No report found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL */}

      {selectedSolution && (

        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">

          <div className="w-full max-w-lg rounded-lg bg-white shadow-lg">

            <div className="flex items-center justify-between border-b px-4 py-3">

              <h2 className="text-sm font-semibold">
                Solution Detail
              </h2>

              <button
                onClick={() =>
                  setSelectedSolution(null)
                }
                className="text-lg text-gray-500"
              >
                ×
              </button>
            </div>

            <div className="max-h-[400px] overflow-y-auto p-4 text-sm whitespace-pre-wrap">
              {selectedSolution}
            </div>

            <div className="flex justify-end border-t px-4 py-3">

              <button
                onClick={() =>
                  setSelectedSolution(null)
                }
                className="rounded-md bg-blue-600 px-3 py-1.5 text-xs text-white"
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