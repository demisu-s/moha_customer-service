// src/components/report/ReportHeader.tsx
import React from "react";
import { Search, FileSpreadsheet, FileText } from "lucide-react";

interface ReportHeaderProps {
  reportType: "service" | "pm" | "summary";
  onReportTypeChange: (type: "service" | "pm" | "summary") => void;
  search: string;
  onSearchChange: (value: string) => void;
  onExportExcel: () => void;
  onExportPDF: () => void;
}

export const ReportHeader: React.FC<ReportHeaderProps> = ({
  reportType,
  onReportTypeChange,
  search,
  onSearchChange,
  onExportExcel,
  onExportPDF,
}) => {
  return (
    <div className="bg-white border rounded-lg p-3 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-lg font-semibold">Reports</h1>
          <p className="text-xs text-gray-500">
            Service, PM (Preventive Maintenance) and summary reports
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 min-w-0">
          {/* Report Type Switch */}
          <div className="flex bg-gray-100 rounded-md p-1">
            {(["service", "pm", "summary"] as const).map((type) => (
              <button
                key={type}
                onClick={() => onReportTypeChange(type)}
                className={`px-3 py-1 text-xs rounded capitalize ${
                  reportType === type
                    ? "bg-[#1891C3] text-white"
                    : "text-gray-600"
                }`}
              >
                {type}
              </button>
            ))}
          </div>

          {/* Search */}
          <div className="relative">
            <Search
              size={14}
              className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search..."
              className="h-8 pl-7 pr-2 text-xs border rounded-md outline-none w-[180px]"
            />
          </div>

          {/* Export Buttons */}
          <button
            onClick={onExportExcel}
            className="h-8 px-3 text-xs bg-green-700 text-white rounded-md flex items-center gap-1"
          >
            <FileSpreadsheet size={14} />
            Excel
          </button>
          <button
            onClick={onExportPDF}
            className="h-8 px-3 text-xs bg-red-600 text-white rounded-md flex items-center gap-1"
          >
            <FileText size={14} />
            PDF
          </button>
        </div>
      </div>
    </div>
  );
};