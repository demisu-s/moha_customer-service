// src/pages/Report.tsx

import React, { useMemo, useState } from "react";
import jsPDF from "jspdf";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import {
  Search,
  FileSpreadsheet,
  FileText,
} from "lucide-react";

import { useServiceRequests } from "../../context/ServiceRequestContext";
import { useSchedule } from "../../context/ScheduleContext";
import { useUserContext } from "../../context/UserContext";

import ServiceReportTable from "../../components/dashboardComponents/ServiceReportTable";
import ScheduleReportTable from "../../components/dashboardComponents/ScheduleReportTable";
import { generateSummaryData } from "../../utils/generateSummary";
import SummaryTable from "../../components/dashboardComponents/SummaryTable";
const Report = () => {
  const { requests, loading } = useServiceRequests();

  const { events } = useSchedule();

  const { currentUser } = useUserContext();

  const [search, setSearch] = useState("");

  const [reportType, setReportType] =
  useState<
    "service" |
    "schedule" |
    "summary"
  >("service");

  const [serviceStatus, setServiceStatus] =
    useState("all");

  const [plantFilter, setPlantFilter] =
    useState("all");

  const [dateType, setDateType] = useState<
    "createdAt" | "assignedDate" | "resolvedDate"
  >("createdAt");

  const [startDate, setStartDate] =
    useState("");

  const [endDate, setEndDate] =
    useState("");

  /* =========================================================
      USER ROLE + PLANT
  ========================================================= */

  const isSuperAdmin =
    currentUser?.role === "superadmin";

  const currentUserPlant =
    currentUser?.department?.plant;

  const currentPlantName =
    typeof currentUserPlant === "object"
      ? currentUserPlant?.name
      : currentUserPlant || "";

  /* =========================================================
      SERVICE DATA
  ========================================================= */

  const serviceData = useMemo(() => {
    return requests
      .map((req: any) => ({
        requestedBy:
          req.requestedBy || "—",

        requestedDate: req.createdAt
          ? new Date(
              req.createdAt
            ).toLocaleDateString()
          : "—",

        createdAt: req.createdAt,

        assignedDate:
          req.assignedDate,

        resolvedDate:
          req.resolvedDate,

        plant:
          req.plant?.name ||
          req.plant ||
          "—",

        problemCategory:
          req.problemCategory || "—",

        deviceType:
          req.deviceType || "—",

        problemType:
          req.issues || "—",

        priority:
          req.urgency || "—",

        solvedBy:
          req.assignedToName || "—",

        solution:
          req.solution || "—",

        status:
          req.status || "Pending",
      }))

      /* ROLE-BASED FILTER */

      .filter((item: any) => {
        if (isSuperAdmin) {
          return true;
        }

        return item.plant === currentPlantName;
      });
  }, [
    requests,
    isSuperAdmin,
    currentPlantName,
  ]);

  /* =========================================================
      UNIQUE PLANTS
  ========================================================= */

  const plants = useMemo(() => {
    if (!isSuperAdmin) {
      return [currentPlantName];
    }

    return [
      "all",
      ...Array.from(
        new Set(
          serviceData.map(
            (item: any) => item.plant
          )
        )
      ),
    ];
  }, [
    serviceData,
    isSuperAdmin,
    currentPlantName,
  ]);

  /* =========================================================
      FILTER SERVICE
  ========================================================= */

  const filteredService = useMemo(() => {
    return serviceData.filter((row) => {

      /* STATUS */

      if (
        serviceStatus !== "all" &&
        row.status !== serviceStatus
      ) {
        return false;
      }

      /* PLANT */

      if (
        isSuperAdmin &&
        plantFilter !== "all" &&
        row.plant !== plantFilter
      ) {
        return false;
      }

      /* DATE RANGE */

      const selectedDate =
        row[
          dateType as keyof typeof row
        ];

      if (selectedDate) {

        const rowDate = new Date(
          selectedDate
        );

        rowDate.setHours(0, 0, 0, 0);

        if (startDate) {

          const start = new Date(
            startDate
          );

          start.setHours(
            0,
            0,
            0,
            0
          );

          if (rowDate < start) {
            return false;
          }
        }

        if (endDate) {

          const end = new Date(
            endDate
          );

          end.setHours(
            23,
            59,
            59,
            999
          );

          if (rowDate > end) {
            return false;
          }
        }
      }

      /* SEARCH */

      const keyword =
        search.toLowerCase();

      return (
        row.requestedBy
          .toLowerCase()
          .includes(keyword) ||

        row.problemCategory
          .toLowerCase()
          .includes(keyword) ||

        row.deviceType
          .toLowerCase()
          .includes(keyword) ||

        row.problemType
          .toLowerCase()
          .includes(keyword) ||

        row.plant
          .toLowerCase()
          .includes(keyword)
      );
    });
  }, [
    serviceData,
    search,
    serviceStatus,
    plantFilter,
    dateType,
    startDate,
    endDate,
    isSuperAdmin,
  ]);

  /* =========================================================
      SCHEDULE DATA
  ========================================================= */

  const scheduleData = useMemo(() => {
    return events
      .map((event: any) => ({
        title:
          event.title || "—",

        plant:
          event.plant?.name ||
          event.plant ||
          "—",

        createdBy:
          typeof event.user === "object"
            ? `${event.user?.firstName || ""} ${
                event.user?.lastName || ""
              }`
            : event.user || "—",

        date: new Date(
          event.start
        ).toLocaleDateString(),

        start: new Date(event.start),

        end: new Date(event.end),
      }))

      /* ROLE-BASED FILTER */

      .filter((item: any) => {
        if (isSuperAdmin) {
          return true;
        }

        return item.plant === currentPlantName;
      });
  }, [
    events,
    isSuperAdmin,
    currentPlantName,
  ]);

  /* =========================================================
      FILTER SCHEDULE
  ========================================================= */

  const filteredSchedule =
    useMemo(() => {
      return scheduleData.filter(
        (row) => {

          if (
            isSuperAdmin &&
            plantFilter !== "all" &&
            row.plant !== plantFilter
          ) {
            return false;
          }

          const keyword =
            search.toLowerCase();

          return (
            row.title
              .toLowerCase()
              .includes(keyword) ||

            row.plant
              .toLowerCase()
              .includes(keyword)
          );
        }
      );
    }, [
      scheduleData,
      search,
      plantFilter,
      isSuperAdmin,
    ]);

  /* =========================================================
      EXPORT EXCEL
  ========================================================= */

 const exportExcel = () => {
  const wb = XLSX.utils.book_new();

  // =====================================
  // SERVICE REPORT SHEET
  // =====================================

  const serviceSheet =
    XLSX.utils.json_to_sheet(
      filteredService
    );

  XLSX.utils.book_append_sheet(
    wb,
    serviceSheet,
    "Service Report"
  );

  // =====================================
  // SCHEDULE REPORT SHEET
  // =====================================

  const scheduleSheet =
    XLSX.utils.json_to_sheet(
      filteredSchedule
    );

  XLSX.utils.book_append_sheet(
    wb,
    scheduleSheet,
    "Schedule Report"
  );

  // =====================================
  // SUMMARY SHEET
  // =====================================

  const summaryData =
    generateSummaryData(
      filteredService
    );

  const summarySheet =
    XLSX.utils.json_to_sheet(
      summaryData
    );

  XLSX.utils.book_append_sheet(
    wb,
    summarySheet,
    "Summary"
  );

  const excelBuffer =
    XLSX.write(wb, {
      bookType: "xlsx",
      type: "array",
    });

  saveAs(
    new Blob([excelBuffer]),
    `Monthly-Report.xlsx`
  );
};

  /* =========================================================
      EXPORT PDF
  ========================================================= */

  const exportPDF = () => {

    const doc = new jsPDF();

    doc.text("REPORT", 20, 20);

    let y = 40;

    const data =
  reportType === "service"
    ? filteredService
    : reportType === "summary"
    ? generateSummaryData(filteredService)
    : filteredSchedule;

    data.forEach((row: any) => {

      doc.text(
        JSON.stringify(row).slice(
          0,
          80
        ),
        20,
        y
      );

      y += 8;
    });

    doc.save("report.pdf");
  };

  if (loading) {
    return (
      <div className="p-4 text-sm">
        Loading...
      </div>
    );
  }

  return (
    <div className="p-4 space-y-4 overflow-hidden min-w-0">

      {/* HEADER */}

      <div className="bg-white border rounded-lg p-3 shadow-sm">

        <div className="flex flex-wrap items-center justify-between gap-3">

          <div>
            <h1 className="text-lg font-semibold">
              Reports
            </h1>

            <p className="text-xs text-gray-500">
              Service, summary and schedule reports
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 min-w-0">

            {/* SWITCH */}

            <div className="flex bg-gray-100 rounded-md p-1">

              <button
                onClick={() =>
                  setReportType(
                    "service"
                  )
                }
                className={`px-3 py-1 text-xs rounded ${
                  reportType ===
                  "service"
                    ? "bg-blue-600 text-white"
                    : "text-gray-600"
                }`}
              >
                Service
              </button>
    <button
                onClick={() =>
                  setReportType(
                    "summary"
                  )
                }
                className={`px-3 py-1 text-xs rounded ${
                  reportType ===
                  "summary"
                    ? "bg-blue-600 text-white"
                    : "text-gray-600"
                }`}
              >
                Summary
              </button>

              <button
                onClick={() =>
                  setReportType(
                    "schedule"
                  )
                }
                className={`px-3 py-1 text-xs rounded ${
                  reportType ===
                  "schedule"
                    ? "bg-blue-600 text-white"
                    : "text-gray-600"
                }`}
              >
                Schedule
              </button>
            </div>

            {/* SEARCH */}

            <div className="relative">

              <Search
                size={14}
                className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400"
              />

              <input
                value={search}
                onChange={(e) =>
                  setSearch(
                    e.target.value
                  )
                }
                placeholder="Search..."
                className="h-8 pl-7 pr-2 text-xs border rounded-md outline-none w-[180px]"
              />
            </div>

            {/* EXPORT */}

            <button
              onClick={exportExcel}
              className="h-8 px-3 text-xs bg-green-700 text-white rounded-md flex items-center gap-1"
            >
              <FileSpreadsheet size={14} />
              Excel
            </button>

            <button
              onClick={exportPDF}
              className="h-8 px-3 text-xs bg-red-600 text-white rounded-md flex items-center gap-1"
            >
              <FileText size={14} />
              PDF
            </button>
          </div>
        </div>

        {/* FILTERS */}

        {(reportType === "service" ||
  reportType === "summary") && (
          <div className="flex flex-wrap gap-2 mt-3 items-center">

            {/* STATUS */}

            <select
              value={serviceStatus}
              onChange={(e) =>
                setServiceStatus(
                  e.target.value
                )
              }
              className="h-8 text-xs border rounded-md px-2"
            >
              <option value="all">
                All Status
              </option>

              <option value="Pending">
                Pending
              </option>

              <option value="Assigned">
                Assigned
              </option>

              <option value="Resolved">
                Resolved
              </option>

              <option value="Unresolved">
                Unresolved
              </option>
            </select>

            {/* PLANT FILTER ONLY FOR SUPERADMIN */}

            {isSuperAdmin && (
              <select
                value={plantFilter}
                onChange={(e) =>
                  setPlantFilter(
                    e.target.value
                  )
                }
                className="h-8 text-xs border rounded-md px-2"
              >
                {plants.map((plant) => (
                  <option
                    key={plant}
                    value={plant}
                  >
                    {plant === "all"
                      ? "All Plants"
                      : plant}
                  </option>
                ))}
              </select>
            )}

            {/* DATE TYPE */}

            <select
              value={dateType}
              onChange={(e) =>
                setDateType(
                  e.target.value as any
                )
              }
              className="h-8 text-xs border rounded-md px-2"
            >
              <option value="createdAt">
                Requested Date
              </option>

              <option value="assignedDate">
                Assigned Date
              </option>

              <option value="resolvedDate">
                Resolved Date
              </option>
            </select>

            {/* DATE RANGE */}

            <div className="flex items-center gap-2">

              <span className="text-xs text-gray-500">
                From
              </span>

              <input
                type="date"
                value={startDate}
                onChange={(e) =>
                  setStartDate(
                    e.target.value
                  )
                }
                className="h-8 text-xs border rounded-md px-2"
              />

              <span className="text-xs text-gray-500">
                To
              </span>

              <input
                type="date"
                value={endDate}
                onChange={(e) =>
                  setEndDate(
                    e.target.value
                  )
                }
                className="h-8 text-xs border rounded-md px-2"
              />
            </div>
          </div>
        )}
      </div>

      {/* TABLE */}

      <div className="min-w-0 overflow-hidden">

        {reportType === "service" ? (
  <ServiceReportTable
    data={filteredService}
  />
) : reportType ===
  "schedule" ? (
  <ScheduleReportTable
    data={filteredSchedule}
  />
) : (
  <SummaryTable
    data={filteredService}
  />
)}
      </div>
    </div>
  );
};

export default Report;