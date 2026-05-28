// src/components/dashboardComponents/ScheduleReportTable.tsx

import React from "react";

export type ScheduleRow = {
  title: string;
  plant: string;
  createdBy: string;
  date: string;
  start: Date;
  end: Date;
};

type Props = {
  data: ScheduleRow[];
};

const ScheduleReportTable: React.FC<Props> = ({
  data,
}) => {
  return (
    <div className="bg-white border rounded-2xl shadow-sm">

      <div className="overflow-x-auto">

        <table className="w-full min-w-[800px] text-sm">

          <thead className="bg-gray-100">

            <tr className="text-left text-gray-700">

              <th className="px-4 py-3 font-semibold">
                Title
              </th>

              <th className="px-4 py-3 font-semibold">
                Plant
              </th>

              <th className="px-4 py-3 font-semibold">
                Created By
              </th>

              <th className="px-4 py-3 font-semibold">
                Date
              </th>

              <th className="px-4 py-3 font-semibold">
                Start
              </th>

              <th className="px-4 py-3 font-semibold">
                End
              </th>
            </tr>
          </thead>

          <tbody>
            {data.length > 0 ? (
              data.map((row, i) => (
                <tr
                  key={i}
                  className="border-t hover:bg-gray-50"
                >
                  <td className="px-4 py-3">
                    {row.title}
                  </td>

                  <td className="px-4 py-3">
                    {row.plant}
                  </td>

                  <td className="px-4 py-3">
                    {row.createdBy}
                  </td>

                  <td className="px-4 py-3 whitespace-nowrap">
                    {row.date}
                  </td>

                  <td className="px-4 py-3 whitespace-nowrap">
                    {row.start.toLocaleTimeString(
                      [],
                      {
                        hour: "2-digit",
                        minute: "2-digit",
                      }
                    )}
                  </td>

                  <td className="px-4 py-3 whitespace-nowrap">
                    {row.end.toLocaleTimeString(
                      [],
                      {
                        hour: "2-digit",
                        minute: "2-digit",
                      }
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={6}
                  className="text-center py-10 text-gray-500"
                >
                  No schedule report found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ScheduleReportTable;