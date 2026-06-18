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
        HWTotal: acc.HWTotal + row.HWTotal,
        SWTotal: acc.SWTotal + row.SWTotal,
        NetworkRelated: acc.NetworkRelated + row.NetworkRelated,
        InternetRelated: acc.InternetRelated + row.InternetRelated,
        ProjectRelated: acc.ProjectRelated + row.ProjectRelated,
        OtherServices: acc.OtherServices + row.OtherServices,
        Total: acc.Total + row.Total,
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
    <div className="w-full overflow-hidden rounded-lg border bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead className="bg-gray-100 border-b">
            <tr>
              <th className="px-3 py-2 text-left w-[50px] text-[10px] font-semibold">#</th>
              <th className="px-3 py-2 text-left text-[10px] font-semibold">Plant</th>
              <th className="px-3 py-2 text-left text-[10px] font-semibold">Hardware</th>
              <th className="px-3 py-2 text-left text-[10px] font-semibold">Software</th>
              <th className="px-3 py-2 text-left text-[10px] font-semibold">Network</th>
              <th className="px-3 py-2 text-left text-[10px] font-semibold">Internet</th>
              <th className="px-3 py-2 text-left text-[10px] font-semibold">Project</th>
              <th className="px-3 py-2 text-left text-[10px] font-semibold">Other Services</th>
              <th className="px-3 py-2 text-left text-[10px] font-semibold">Total</th>
            </tr>
          </thead>

          <tbody>
            {summary.map((row: any, index: number) => (
              <tr key={index} className="border-b hover:bg-blue-50 transition-colors">
                <td className="border p-2 text-center">{index + 1}</td>
                <td className="border p-2 font-medium">{row.Plant}</td>
                <td className="border p-2 text-center">{row.HWTotal}</td>
                <td className="border p-2 text-center">{row.SWTotal}</td>
                <td className="border p-2 text-center">{row.NetworkRelated}</td>
                <td className="border p-2 text-center">{row.InternetRelated}</td>
                <td className="border p-2 text-center">{row.ProjectRelated}</td>
                <td className="border p-2 text-center">{row.OtherServices}</td>
                <td className="border p-2 text-center font-bold text-primary-600">{row.Total}</td>
              </tr>
            ))}

            {/* Grand Total Row */}
            <tr className="bg-gray-100 font-bold">
              <td colSpan={2} className="border p-3 text-center">Grand Total</td>
              <td className="border p-3 text-center">{grandTotal.HWTotal}</td>
              <td className="border p-3 text-center">{grandTotal.SWTotal}</td>
              <td className="border p-3 text-center">{grandTotal.NetworkRelated}</td>
              <td className="border p-3 text-center">{grandTotal.InternetRelated}</td>
              <td className="border p-3 text-center">{grandTotal.ProjectRelated}</td>
              <td className="border p-3 text-center">{grandTotal.OtherServices}</td>
              <td className="border p-3 text-center text-lg text-primary-700">{grandTotal.Total}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SummaryTable;