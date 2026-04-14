// src/pages/Report.tsx
import React, { useMemo, useState } from "react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import jsPDF from "jspdf";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

import { useUserContext } from "../../context/UserContext";
import { useServiceRequests } from "../../context/ServiceRequestContext";

type ReportRow = {
  name: string;
  role: string;
  plant: string;
  totalTasks: number;
  completed: number;
  pending: number;
  unresolved: number;
};

const Report: React.FC = () => {
  const { users } = useUserContext();
  const { requests, loading } = useServiceRequests();

  const [search, setSearch] = useState("");

  /* =========================
     ✅ BUILD REPORT DATA
  ========================== */
  const reportData: ReportRow[] = useMemo(() => {
    const grouped: Record<string, ReportRow> = {};

    requests.forEach((req) => {
      if (!req.assignedToName) return;

      // 🔥 detect role
      const role = req.assignedDate ? "supervisor" : "admin";

      const key = req.assignedToName;

      const user = users.find(
        (u) =>
          `${u.firstName} ${u.lastName}` === req.assignedToName
      );

      const plant =
        typeof user?.department?.plant === "string"
          ? user?.department?.plant
          : user?.department?.plant?.name || req.plant || "—";

      if (!grouped[key]) {
        grouped[key] = {
          name: req.assignedToName,
          role,
          plant,
          totalTasks: 0,
          completed: 0,
          pending: 0,
          unresolved: 0,
        };
      }

      grouped[key].totalTasks += 1;

      if (req.status === "Resolved") {
        grouped[key].completed += 1;
      } else if (req.status === "Unresolved") {
        grouped[key].unresolved += 1;
      } else {
        grouped[key].pending += 1;
      }
    });

    return Object.values(grouped);
  }, [requests, users]);

  /* =========================
     🔍 FILTER
  ========================== */
  const filteredData = reportData.filter(
    (row) =>
      row.name.toLowerCase().includes(search.toLowerCase()) ||
      row.plant.toLowerCase().includes(search.toLowerCase())
  );

  /* =========================
     📄 EXPORT PDF
  ========================== */
  const exportPDF = () => {
    const doc = new jsPDF();

    doc.setFontSize(16);
    doc.text("Service Report", 20, 20);

    let y = 40;

    filteredData.forEach((row, i) => {
      doc.text(
        `${i + 1}. ${row.name} (${row.role}) - Plant: ${
          row.plant
        } | Total: ${row.totalTasks}, Completed: ${
          row.completed
        }, Pending: ${row.pending}, Unresolved: ${
          row.unresolved
        }`,
        20,
        y
      );
      y += 10;
    });

    doc.save("service-report.pdf");
  };

  /* =========================
     📊 EXPORT EXCEL
  ========================== */
  const exportExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(filteredData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Report");

    const buffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });

    saveAs(new Blob([buffer]), "service-report.xlsx");
  };

  /* =========================
     UI
  ========================== */
  if (loading) {
    return <div className="p-6 text-center">Loading report...</div>;
  }

  return (
    <div className="space-y-6 p-6">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Reports</h1>
          <p className="text-gray-500 text-sm">
            Admin & Supervisor performance overview
          </p>
        </div>

        <input
          type="text"
          placeholder="Search by name or plant..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="px-4 py-2 border rounded-md text-sm w-full md:w-[300px]"
        />

        <DropdownMenu.Root>
          <DropdownMenu.Trigger asChild>
            <button className="bg-primary-600 text-white px-4 py-2 rounded-lg">
              Export ▼
            </button>
          </DropdownMenu.Trigger>

          <DropdownMenu.Content className="bg-white border rounded shadow p-2">
            <DropdownMenu.Item
              onClick={exportPDF}
              className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
            >
              📄 PDF
            </DropdownMenu.Item>

            <DropdownMenu.Item
              onClick={exportExcel}
              className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
            >
              📊 Excel
            </DropdownMenu.Item>
          </DropdownMenu.Content>
        </DropdownMenu.Root>
      </div>

      {/* TABLE */}
      <div className="bg-white shadow rounded-lg p-4 overflow-x-auto">
        <table className="w-full text-sm border">
          <thead>
            <tr className="bg-gray-200">
              <th className="border px-4 py-2">Name</th>
              <th className="border px-4 py-2">Role</th>
              <th className="border px-4 py-2">Plant</th>
              <th className="border px-4 py-2">Assigned</th>
              <th className="border px-4 py-2">Completed</th>
              <th className="border px-4 py-2">Pending</th>
              <th className="border px-4 py-2">Unresolved</th>
            </tr>
          </thead>

          <tbody>
            {filteredData.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center py-4 text-gray-500">
                  No data found
                </td>
              </tr>
            ) : (
              filteredData.map((row, i) => (
                <tr key={i} className="hover:bg-gray-100">
                  <td className="border px-4 py-2">
                    {row.name}
                  </td>

                  <td className="border px-4 py-2">
                    <span className="text-[11px] px-2 py-1 bg-gray-200 rounded">
                      {row.role}
                    </span>
                  </td>

                  <td className="border px-4 py-2">{row.plant}</td>
                  <td className="border px-4 py-2">{row.totalTasks}</td>
                  <td className="border px-4 py-2 text-green-600">
                    {row.completed}
                  </td>
                  <td className="border px-4 py-2 text-yellow-600">
                    {row.pending}
                  </td>
                  <td className="border px-4 py-2 text-red-600">
                    {row.unresolved}
                  </td>
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