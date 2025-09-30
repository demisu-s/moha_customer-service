// src/pages/Report.tsx
import React, { useEffect, useState } from "react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import jsPDF from "jspdf";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { useUserContext } from "../../context/UserContext";
import { ServiceRequest } from "../User/askforhelp";

type ReportRow = {
  supervisor: string;
  plant: string;
  tasksCompleted: number;
  pending: number;
  totalAssigned: number;
};

const Report: React.FC = () => {
  const { users } = useUserContext();
  const [reportData, setReportData] = useState<ReportRow[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const stored = localStorage.getItem("serviceRequests");
    if (!stored) return;

    const requests: ServiceRequest[] = JSON.parse(stored);
    const grouped: Record<string, ReportRow> = {};

    requests.forEach((req) => {
      if (!req.assignedTo) return;

      const supervisor = users.find((u) => u.userId === req.assignedTo) || null;

      const supervisorName = supervisor
        ? `${supervisor.firstName} ${supervisor.lastName}`
        : req.assignedToName || "Unknown Supervisor";

      const plant = supervisor?.area || "Unknown Plant";

      if (!grouped[req.assignedTo]) {
        grouped[req.assignedTo] = {
          supervisor: supervisorName,
          plant,
          tasksCompleted: 0,
          pending: 0,
          totalAssigned: 0,
        };
      }

      if (req.status === "Resolved") {
        grouped[req.assignedTo].tasksCompleted += 1;
      } else {
        grouped[req.assignedTo].pending += 1;
      }

      grouped[req.assignedTo].totalAssigned += 1;
    });

    setReportData(Object.values(grouped));
  }, [users]);

  // 🔎 Filter by search
  const filteredData = reportData.filter(
    (row) =>
      row.supervisor.toLowerCase().includes(search.toLowerCase()) ||
      row.plant.toLowerCase().includes(search.toLowerCase())
  );

  // 🔹 Export as PDF
  const exportPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text("Supervisor Report", 20, 20);

    let y = 40;
    filteredData.forEach((row, index) => {
      doc.text(
        `${index + 1}. ${row.supervisor} (${row.plant}) - Completed: ${
          row.tasksCompleted
        }, Pending: ${row.pending}, Total: ${row.totalAssigned}`,
        20,
        y
      );
      y += 10;
    });

    doc.save("supervisor-report.pdf");
  };

  // 🔹 Export as Excel
  const exportExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(filteredData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Report");
    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });
    saveAs(new Blob([excelBuffer]), "supervisor-report.xlsx");
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header with dropdown + search */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold">Reports</h1>
          <p className="text-lg text-black font-light">
            Analyze performance metrics and supervisor workloads across
            different plants.
          </p>
        </div>

        <input
          type="text"
          placeholder="Search by supervisor or plant..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-md text-sm w-full md:w-[300px]"
        />

        <DropdownMenu.Root>
          <DropdownMenu.Trigger asChild>
            <button className="bg-primary-600 text-white px-4 py-2 rounded-lg shadow hover:bg-primary-700">
              Export ▼
            </button>
          </DropdownMenu.Trigger>

          <DropdownMenu.Content
            sideOffset={8}
            className="bg-white border rounded-lg shadow-md p-2 min-w-[160px]"
          >
            <DropdownMenu.Item
              onClick={exportPDF}
              className="px-3 py-2 hover:bg-gray-100 cursor-pointer rounded"
            >
              📄 Export as PDF
            </DropdownMenu.Item>
            <DropdownMenu.Item
              onClick={exportExcel}
              className="px-3 py-2 hover:bg-gray-100 cursor-pointer rounded"
            >
              📊 Export as Excel
            </DropdownMenu.Item>
          </DropdownMenu.Content>
        </DropdownMenu.Root>
      </div>

      {/* Report Preview (Table) */}
      <div className="overflow-x-auto bg-white shadow rounded-lg p-4">
        <table className="w-full border-collapse border text-sm">
          <thead>
            <tr className="bg-gray-200 text-left">
              <th className="border px-4 py-2">Supervisor</th>
              <th className="border px-4 py-2">Plant</th>
              <th className="border px-4 py-2">Total Assigned</th>
              <th className="border px-4 py-2">Tasks Completed</th>
              <th className="border px-4 py-2">Pending</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center text-gray-500 py-4">
                  No matching results
                </td>
              </tr>
            ) : (
              filteredData.map((row, idx) => (
                <tr key={idx} className="hover:bg-gray-100">
                  <td className="border px-4 py-2">{row.supervisor}</td>
                  <td className="border px-4 py-2">{row.plant}</td>
                  <td className="border px-4 py-2">{row.totalAssigned}</td>
                  <td className="border px-4 py-2">{row.tasksCompleted}</td>
                  <td className="border px-4 py-2">{row.pending}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Report;
