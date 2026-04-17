// src/pages/Report.tsx
import React, { useMemo, useState } from "react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import jsPDF from "jspdf";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

import { useUserContext } from "../../context/UserContext";
import { useServiceRequests } from "../../context/ServiceRequestContext";
import { useSchedule } from "../../context/ScheduleContext";

type ReportRow = {
  name: string;
  role: string;
  plant: string;
  totalTasks: number;
  completed: number;
  pending: number;
  unresolved: number;
};

type ScheduleRow = {
  title: string;
  plant: string;
  createdBy: string;
  date: string;
  start: Date;
  end: Date;
};

const Report: React.FC = () => {
  const { users } = useUserContext();
  const { requests, loading } = useServiceRequests();
  const { events } = useSchedule();

  const [search, setSearch] = useState("");
  const [reportType, setReportType] = useState<"service" | "schedule">("service");

  // ✅ FILTER STATES
  const [filterBy, setFilterBy] = useState("all");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  /* ================= SERVICE REPORT ================= */
  const reportData: ReportRow[] = useMemo(() => {
    const grouped: Record<string, ReportRow> = {};

    requests.forEach((req) => {
      if (!req.assignedToName) return;

      const role = req.assignedDate ? "supervisor" : "admin";
      const key = req.assignedToName;

      const user = users.find(
        (u) => `${u.firstName} ${u.lastName}` === req.assignedToName
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

      if (req.status === "Resolved") grouped[key].completed += 1;
      else if (req.status === "Unresolved") grouped[key].unresolved += 1;
      else grouped[key].pending += 1;
    });

    return Object.values(grouped);
  }, [requests, users]);

  /* ================= SCHEDULE REPORT ================= */
  const scheduleData: ScheduleRow[] = useMemo(() => {
    return events.map((event: any) => {
      const plant =
        typeof event.plant === "object"
          ? event.plant?.name
          : event.plant || "—";

      const createdBy =
        typeof event.user === "object"
          ? `${event.user?.firstName || ""} ${event.user?.lastName || ""}`
          : event.user;

      const start = new Date(event.start);
      const end = new Date(event.end);

      return {
        title: event.title,
        plant,
        createdBy,
        date: start.toLocaleDateString(),
        start,
        end,
      };
    });
  }, [events]);

  /* ================= FILTER ================= */
  const filteredService = reportData.filter(
    (row) =>
      row.name.toLowerCase().includes(search.toLowerCase()) ||
      row.plant.toLowerCase().includes(search.toLowerCase())
  );

  const filteredSchedule = scheduleData.filter((row) => {
    const now = new Date();

    if (filterBy === "ended" && row.end > now) return false;
    if (filterBy === "upcoming" && row.start < now) return false;

    if (startDate && row.start < new Date(startDate)) return false;
    if (endDate && row.end > new Date(endDate)) return false;

    return (
      row.title.toLowerCase().includes(search.toLowerCase()) ||
      row.plant.toLowerCase().includes(search.toLowerCase())
    );
  });

  /* ================= EXPORT ================= */
  const exportPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text(reportType === "service" ? "Service Report" : "Schedule Report", 20, 20);

    let y = 40;
    const data = reportType === "service" ? filteredService : filteredSchedule;

    data.forEach((row: any, i) => {
      doc.text(JSON.stringify(row), 20, y);
      y += 10;
    });

    doc.save("report.pdf");
  };

  const exportExcel = () => {
  let data: any[];

  if (reportType === "service") {
    data = filteredService;
  } else {
    data = filteredSchedule.map((row) => ({
      Title: row.title,
      Plant: row.plant,
      CreatedBy: row.createdBy,
      Date: row.date,

      // ✅ FORCE TIME STRING (IMPORTANT)
      Start: row.start.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),

      End: row.end.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    }));
  }

  const worksheet = XLSX.utils.json_to_sheet(data);

  // ✅ OPTIONAL: SET COLUMN WIDTH (prevents ######)
  worksheet["!cols"] = [
    { wch: 25 },
    { wch: 20 },
    { wch: 25 },
    { wch: 15 },
    { wch: 12 },
    { wch: 12 },
  ];

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Report");

  const buffer = XLSX.write(workbook, {
    bookType: "xlsx",
    type: "array",
  });

  saveAs(new Blob([buffer]), "report.xlsx");
};

  if (loading) return <div className="p-6 text-center">Loading report...</div>;

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

        {/* SWITCH */}
        <div className="flex gap-2">
          <button
            onClick={() => setReportType("service")}
            className={`px-3 py-2 rounded ${
              reportType === "service"
                ? "bg-primary-600 text-white"
                : "bg-gray-200"
            }`}
          >
            Service
          </button>

          <button
            onClick={() => setReportType("schedule")}
            className={`px-3 py-2 rounded ${
              reportType === "schedule"
                ? "bg-primary-600 text-white"
                : "bg-gray-200"
            }`}
          >
            Schedule
          </button>
        </div>

        <input
          type="text"
          placeholder="Search..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="px-4 py-2 border rounded-md text-sm w-full md:w-[250px]"
        />

        <DropdownMenu.Root>
          <DropdownMenu.Trigger asChild>
            <button className="bg-primary-600 text-white px-4 py-2 rounded-lg">
              Export ▼
            </button>
          </DropdownMenu.Trigger>

          <DropdownMenu.Content className="bg-white border rounded shadow p-2">
            <DropdownMenu.Item onClick={exportPDF} className="px-3 py-2 hover:bg-gray-100">
              📄 PDF
            </DropdownMenu.Item>
            <DropdownMenu.Item onClick={exportExcel} className="px-3 py-2 hover:bg-gray-100">
              📊 Excel
            </DropdownMenu.Item>
          </DropdownMenu.Content>
        </DropdownMenu.Root>
      </div>

      {/* ✅ IMPROVED FILTER PANEL */}
      {reportType === "schedule" && (
        <div className="bg-white shadow rounded-lg p-4 grid md:grid-cols-4 gap-4">
          <div>
            <label className="text-xs text-gray-500">Status</label>
            <select
              value={filterBy}
              onChange={(e) => setFilterBy(e.target.value)}
              className="w-full mt-1 px-3 py-2 border rounded-md text-sm"
            >
              <option value="all">All Tasks</option>
              <option value="ended">Ended Tasks</option>
              <option value="upcoming">Upcoming Tasks</option>
            </select>
          </div>

          <div>
            <label className="text-xs text-gray-500">Start Date</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full mt-1 px-3 py-2 border rounded-md text-sm"
            />
          </div>

          <div>
            <label className="text-xs text-gray-500">End Date</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full mt-1 px-3 py-2 border rounded-md text-sm"
            />
          </div>

          <div className="flex items-end">
            <button
              onClick={() => {
                setFilterBy("all");
                setStartDate("");
                setEndDate("");
              }}
              className="w-full bg-gray-200 hover:bg-gray-300 px-3 py-2 rounded-md text-sm"
            >
              Reset Filters
            </button>
          </div>
        </div>
      )}

      {/* TABLE */}
      <div className="bg-white shadow rounded-lg p-4 overflow-x-auto">
        <table className="w-full text-sm border">
          <thead>
            {reportType === "service" ? (
              <tr className="bg-gray-200">
                <th className="border px-4 py-2">Name</th>
                <th className="border px-4 py-2">Role</th>
                <th className="border px-4 py-2">Plant</th>
                <th className="border px-4 py-2">Assigned</th>
                <th className="border px-4 py-2">Completed</th>
                <th className="border px-4 py-2">Pending</th>
                <th className="border px-4 py-2">Unresolved</th>
              </tr>
            ) : (
              <tr className="bg-gray-200">
                <th className="border px-4 py-2">Title</th>
                <th className="border px-4 py-2">Plant</th>
                <th className="border px-4 py-2">Created By</th>
                <th className="border px-4 py-2">Date</th>
                <th className="border px-4 py-2">Start</th>
                <th className="border px-4 py-2">End</th>
              </tr>
            )}
          </thead>

          <tbody>
            {reportType === "service"
              ? filteredService.map((row, i) => (
                  <tr key={i} className="hover:bg-gray-100">
                    <td className="border px-4 py-2">{row.name}</td>
                    <td className="border px-4 py-2">{row.role}</td>
                    <td className="border px-4 py-2">{row.plant}</td>
                    <td className="border px-4 py-2">{row.totalTasks}</td>
                    <td className="border px-4 py-2 text-green-600">{row.completed}</td>
                    <td className="border px-4 py-2 text-yellow-600">{row.pending}</td>
                    <td className="border px-4 py-2 text-red-600">{row.unresolved}</td>
                  </tr>
                ))
              : filteredSchedule.map((row, i) => (
                  <tr key={i} className="hover:bg-gray-100">
                    <td className="border px-4 py-2">{row.title}</td>
                    <td className="border px-4 py-2">{row.plant}</td>
                    <td className="border px-4 py-2">{row.createdBy}</td>
                    <td className="border px-4 py-2">{row.date}</td>
                    <td className="border px-4 py-2">{row.start.toLocaleTimeString()}</td>
                    <td className="border px-4 py-2">{row.end.toLocaleTimeString()}</td>
                  </tr>
                ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Report;