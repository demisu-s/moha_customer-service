// src/components/dashboardComponents/SummaryTable.tsx

import React, { useMemo } from "react";
import { generateSummaryData } from "../../utils/generateSummary";

type Props = {
  data: any[];
};

const SummaryTable = ({ data }: Props) => {
  const summary = useMemo(() => {
    return generateSummaryData(data).sort(
      (a: any, b: any) => b.Total - a.Total
    );
  }, [data]);

  const grandTotal = useMemo(() => {
    return summary.reduce(
      (acc: any, row: any) => ({
        HWTotal:
          acc.HWTotal + row.HWTotal,

        SWTotal:
          acc.SWTotal + row.SWTotal,

        NetworkRelated:
          acc.NetworkRelated +
          row.NetworkRelated,

        InternetRelated:
          acc.InternetRelated +
          row.InternetRelated,

        ProjectRelated:
          acc.ProjectRelated +
          row.ProjectRelated,

        OtherServices:
          acc.OtherServices +
          row.OtherServices,

        Total:
          acc.Total + row.Total,
      }),
      {
        HWTotal: 0,
        SWTotal: 0,
        NetworkRelated: 0,
        InternetRelated: 0,
        ProjectRelated: 0,
        OtherServices: 0,
        Total: 0,
      }
    );
  }, [summary]);

  return (
    // <div className="w-full overflow-hidden rounded-lg border bg-white shadow-sm">
      <div className="overflow-x-auto">

          <table className="w-full text-xs">

            {/* HEADER */}

            <thead className="bg-gray-100 border-b">
          <tr>
            <th className="px-3 py-2 text-left w-[50px]">#</th>

            <th className="px-3 py-2 text-left">
              Plant
            </th>

            <th className="px-3 py-2 text-left">
              Hardware
            </th>

            <th className="px-3 py-2 text-left">
              Software
            </th>

            <th className="px-3 py-2 text-left">
              Network
            </th>

            <th className="px-3 py-2 text-left">
              Internet
            </th>

            <th className="px-3 py-2 text-left">
              Project
            </th>

            <th className="px-3 py-2 text-left">
              Other Services
            </th>

            <th className="px-3 py-2 text-left">
              Total
            </th>
          </tr>
        </thead>

        <tbody>
          {summary.map(
            (row: any, index: number) => (
              <tr
                key={index}
                className="hover:bg-blue-50 transition-colors"
              >
                <td className="border p-2 text-center">
                  {index + 1}
                </td>

                <td className="border p-2 font-medium">
                  {row.Plant}
                </td>

                <td className="border p-2 text-center">
                  {row.HWTotal}
                </td>

                <td className="border p-2 text-center">
                  {row.SWTotal}
                </td>

                <td className="border p-2 text-center">
                  {row.NetworkRelated}
                </td>

                <td className="border p-2 text-center">
                  {row.InternetRelated}
                </td>

                <td className="border p-2 text-center">
                  {row.ProjectRelated}
                </td>

                <td className="border p-2 text-center">
                  {row.OtherServices}
                </td>

                <td className="border p-2 text-center font-bold">
                  {row.Total}
                </td>
              </tr>
            )
          )}

          <tr className="bg-gray-100 font-bold">
            <td
              colSpan={2}
              className="border p-3"
            >
              Grand Total
            </td>

            <td className="border p-3 text-center">
              {grandTotal.HWTotal}
            </td>

            <td className="border p-3 text-center">
              {grandTotal.SWTotal}
            </td>

            <td className="border p-3 text-center">
              {grandTotal.NetworkRelated}
            </td>

            <td className="border p-3 text-center">
              {grandTotal.InternetRelated}
            </td>

            <td className="border p-3 text-center">
              {grandTotal.ProjectRelated}
            </td>

            <td className="border p-3 text-center">
              {grandTotal.OtherServices}
            </td>

            <td className="border p-3 text-center text-lg">
              {grandTotal.Total}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default SummaryTable;