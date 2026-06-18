// src/pages/Report.tsx

import React, { useMemo, useState } from "react";
import jsPDF from "jspdf";
import * as XLSX from "xlsx";
import {
  Search,
  FileSpreadsheet,
  FileText,
} from "lucide-react";

import { useServiceRequests } from "../../context/ServiceRequestContext";
import { usePMWO } from "../../context/PMWOContext";
import { useUserContext } from "../../context/UserContext";
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';

import ServiceReportTable from "../../components/dashboardComponents/ServiceReportTable";
import PMReportTable from "../../components/dashboardComponents/PMReportTable";
import { generateSummaryData } from "../../utils/generateSummary";
import SummaryTable from "../../components/dashboardComponents/SummaryTable";

const Report = () => {
  const { requests, loading: serviceLoading } = useServiceRequests();
  const { workOrders, loading: pmLoading } = usePMWO();
  const { currentUser } = useUserContext();

  const [search, setSearch] = useState("");

  const [reportType, setReportType] = useState<
    "service" | "pm" | "summary"
  >("service");

  const [serviceStatus, setServiceStatus] = useState("all");
  const [pmStatus, setPmStatus] = useState("all");
  const [plantFilter, setPlantFilter] = useState("all");
  const [pmPriorityFilter, setPmPriorityFilter] = useState("all");

  const [dateType, setDateType] = useState<
    "createdAt" | "assignedDate" | "resolvedDate"
  >("createdAt");

  const [pmDateType, setPmDateType] = useState<
    "scheduledDate" | "completedDate"
  >("scheduledDate");

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  /* =========================================================
      USER ROLE + PLANT
  ========================================================= */

  const isSuperAdmin = currentUser?.role === "superadmin";
  const isAdmin = currentUser?.role === "admin";

  const currentUserPlant = currentUser?.department?.plant;
  const currentPlantName = typeof currentUserPlant === "object"
    ? currentUserPlant?.name
    : currentUserPlant || "";

  /* =========================================================
      SERVICE DATA
  ========================================================= */

  // In the serviceData useMemo in Report.tsx
const serviceData = useMemo(() => {
  return requests
    .map((req: any) => ({
      requestedBy: req.requestedBy || "—",
      requestedDate: req.createdAt ? new Date(req.createdAt).toLocaleDateString() : "—",
      createdAt: req.createdAt,
      assignedDate: req.assignedDate,
      resolvedDate: req.resolvedDate,
      plant: req.plant?.name || req.plant || "—",
      problemCategory: req.problemCategory || "—",
      deviceType: req.deviceType || "—",
      problemType: req.issues || "—",
      priority: req.urgency || "—",
      // ✅ Use resolvedByName first, then assignedToName
      solvedBy: req.resolvedByName || req.assignedToName || "—",
      solution: req.solution || "—",
      status: req.status || "Pending",
    }))
    .filter((item: any) => {
      if (isSuperAdmin) return true;
      return item.plant === currentPlantName;
    });
}, [requests, isSuperAdmin, currentPlantName]);

  /* =========================================================
      PM (PREVENTIVE MAINTENANCE) DATA
  ========================================================= */

  // In the pmData useMemo, add totalActualDuration calculation:

const pmData = useMemo(() => {
  return workOrders
    .map((wo: any) => {
      // Calculate total actual duration from completed tasks
      const totalActualDuration = wo.tasks
        ?.filter((task: any) => task.isCompleted && task.actualDuration)
        .reduce((sum: number, task: any) => sum + (task.actualDuration || 0), 0) || 0;

      return {
        id: wo._id,
        title: wo.title || "—",
        description: wo.description || "—",
        plant: wo.plant?.name || wo.plant || "—",
        createdBy: typeof wo.createdBy === "object"
          ? `${wo.createdBy?.firstName || ""} ${wo.createdBy?.lastName || ""}`.trim() || wo.createdBy?.email || "—"
          : wo.createdBy || "—",
        scheduledDate: wo.scheduledDate,
        completedDate: wo.completedDate,
        priority: wo.priority || "—",
        status: wo.status || "planned",
        tasksTotal: wo.tasks?.length || 0,
        tasksCompleted: wo.tasks?.filter((t: any) => t.isCompleted).length || 0,
        recurrence: wo.recurrence || "none",
        notes: wo.notes || "—",
        totalActualDuration: totalActualDuration, // Sum of actualDuration from completed tasks
      };
    })
    .filter((item: any) => {
      if (isSuperAdmin) return true;
      return item.plant === currentPlantName;
    });
}, [workOrders, isSuperAdmin, currentPlantName]);

  /* =========================================================
      UNIQUE PLANTS
  ========================================================= */

  const plants = useMemo(() => {
    if (!isSuperAdmin) return [currentPlantName];
    return [
      "all",
      ...Array.from(new Set(serviceData.map((item: any) => item.plant))),
    ];
  }, [serviceData, isSuperAdmin, currentPlantName]);

  /* =========================================================
      FILTER SERVICE
  ========================================================= */

  const filteredService = useMemo(() => {
    return serviceData.filter((row) => {
      if (serviceStatus !== "all" && row.status !== serviceStatus) return false;
      if (isSuperAdmin && plantFilter !== "all" && row.plant !== plantFilter) return false;

      const selectedDate = row[dateType as keyof typeof row];
      if (selectedDate) {
        const rowDate = new Date(selectedDate);
        rowDate.setHours(0, 0, 0, 0);
        if (startDate) {
          const start = new Date(startDate);
          start.setHours(0, 0, 0, 0);
          if (rowDate < start) return false;
        }
        if (endDate) {
          const end = new Date(endDate);
          end.setHours(23, 59, 59, 999);
          if (rowDate > end) return false;
        }
      }

      const keyword = search.toLowerCase();
      return (
        row.requestedBy.toLowerCase().includes(keyword) ||
        row.problemCategory.toLowerCase().includes(keyword) ||
        row.deviceType.toLowerCase().includes(keyword) ||
        row.problemType.toLowerCase().includes(keyword) ||
        row.plant.toLowerCase().includes(keyword)
      );
    });
  }, [serviceData, search, serviceStatus, plantFilter, dateType, startDate, endDate, isSuperAdmin]);

  /* =========================================================
      FILTER PM (PREVENTIVE MAINTENANCE)
  ========================================================= */

  const filteredPM = useMemo(() => {
    return pmData.filter((row) => {
      if (pmStatus !== "all" && row.status !== pmStatus) return false;
      if (pmPriorityFilter !== "all" && row.priority !== pmPriorityFilter) return false;
      if (isSuperAdmin && plantFilter !== "all" && row.plant !== plantFilter) return false;

      const selectedDate = row[pmDateType];
      if (selectedDate) {
        const rowDate = new Date(selectedDate);
        rowDate.setHours(0, 0, 0, 0);
        if (startDate) {
          const start = new Date(startDate);
          start.setHours(0, 0, 0, 0);
          if (rowDate < start) return false;
        }
        if (endDate) {
          const end = new Date(endDate);
          end.setHours(23, 59, 59, 999);
          if (rowDate > end) return false;
        }
      }

      const keyword = search.toLowerCase();
      return (
        row.title.toLowerCase().includes(keyword) ||
        row.plant.toLowerCase().includes(keyword) ||
        row.createdBy.toLowerCase().includes(keyword)
      );
    });
  }, [pmData, search, pmStatus, pmPriorityFilter, plantFilter, pmDateType, startDate, endDate, isSuperAdmin]);

  /* =========================================================
      EXPORT EXCEL
  ========================================================= */

 // Add import at the top

// Replace the entire exportExcel function with this:

const exportExcel = async () => {
  const workbook = new ExcelJS.Workbook();
  const fileName = reportType === "service" 
    ? "Service-Report" 
    : reportType === "pm" 
    ? "PM-Report" 
    : "Summary-Report";

  if (reportType === "service") {
    const worksheet = workbook.addWorksheet("Service Report");
    
    // Define columns
    worksheet.columns = [
      { header: "Requested By", key: "requestedBy", width: 20 },
      { header: "Plant", key: "plant", width: 20 },
      { header: "Requested Date", key: "requestedDate", width: 15 },
      { header: "Assigned Date", key: "assignedDate", width: 15 },
      { header: "Resolved Date", key: "resolvedDate", width: 15 },
      { header: "Problem Category", key: "problemCategory", width: 20 },
      { header: "Device Type", key: "deviceType", width: 20 },
      { header: "Problem Type", key: "problemType", width: 25 },
      { header: "Priority", key: "priority", width: 12 },
      { header: "Solved By", key: "solvedBy", width: 20 },
      { header: "Solution", key: "solution", width: 40 },
      { header: "Status", key: "status", width: 12 },
    ];

    // Style header row
    const headerRow = worksheet.getRow(1);
    headerRow.font = { bold: true, color: { argb: "FFFFFFFF" }, size: 11 };
    headerRow.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FF1891C3" }
    };
    headerRow.alignment = { horizontal: "center", vertical: "middle" };
    headerRow.height = 25;

    // Add data
    filteredService.forEach((item: any) => {
      worksheet.addRow({
        requestedBy: item.requestedBy,
        plant: item.plant,
        requestedDate: item.createdAt ? new Date(item.createdAt).toLocaleDateString() : "",
        assignedDate: item.assignedDate ? new Date(item.assignedDate).toLocaleDateString() : "",
        resolvedDate: item.resolvedDate ? new Date(item.resolvedDate).toLocaleDateString() : "",
        problemCategory: item.problemCategory,
        deviceType: item.deviceType,
        problemType: item.problemType,
        priority: item.priority,
        solvedBy: item.solvedBy,
        solution: item.solution,
        status: item.status,
      });
    });

    // Style data rows
    worksheet.eachRow((row, rowNumber) => {
      if (rowNumber > 1) {
        row.alignment = { vertical: "middle", wrapText: true };
        row.height = 20;
        
        // Alternate row colors
        if (rowNumber % 2 === 0) {
          row.fill = {
            type: "pattern",
            pattern: "solid",
            fgColor: { argb: "FFF5F5F5" }
          };
        }
        
        // Style status column
        const statusCell = row.getCell(12);
        const status = statusCell.value;
        if (status === "Resolved") {
          statusCell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FF22C55E" } };
          statusCell.font = { color: { argb: "FFFFFFFF" }, bold: true };
        } else if (status === "Assigned") {
          statusCell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FF3B82F6" } };
          statusCell.font = { color: { argb: "FFFFFFFF" }, bold: true };
        } else if (status === "Unresolved") {
          statusCell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFEF4444" } };
          statusCell.font = { color: { argb: "FFFFFFFF" }, bold: true };
        } else {
          statusCell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFEAB308" } };
          statusCell.font = { color: { argb: "FFFFFFFF" }, bold: true };
        }
      }
    });

    // Freeze header row
    worksheet.views = [{ state: "frozen", ySplit: 1 }];
    
    // Add borders to all cells
    worksheet.eachRow((row) => {
      row.eachCell((cell) => {
        cell.border = {
          top: { style: "thin", color: { argb: "FFD4D4D4" } },
          left: { style: "thin", color: { argb: "FFD4D4D4" } },
          bottom: { style: "thin", color: { argb: "FFD4D4D4" } },
          right: { style: "thin", color: { argb: "FFD4D4D4" } },
        };
      });
    });

  } else if (reportType === "pm") {
    const worksheet = workbook.addWorksheet("PM Report");
    
    const formatTotalTime = (minutes: number) => {
      if (!minutes || minutes === 0) return "";
      const hours = Math.floor(minutes / 60);
      const mins = minutes % 60;
      const parts = [];
      if (hours > 0) parts.push(`${hours}h`);
      if (mins > 0) parts.push(`${mins}m`);
      return parts.join(' ');
    };

    worksheet.columns = [
      { header: "Work Order Title", key: "title", width: 35 },
      { header: "Description", key: "description", width: 30 },
      { header: "Plant", key: "plant", width: 20 },
      { header: "Created By", key: "createdBy", width: 25 },
      { header: "Scheduled Date", key: "scheduledDate", width: 15 },
      { header: "Completed Date", key: "completedDate", width: 15 },
      { header: "Total Time", key: "totalTime", width: 15 },
      { header: "Total Minutes", key: "totalMinutes", width: 15 },
      { header: "Priority", key: "priority", width: 10 },
      { header: "Status", key: "status", width: 12 },
      { header: "Tasks Completed", key: "tasksCompleted", width: 15 },
      { header: "Completion %", key: "completion", width: 12 },
      { header: "Recurrence", key: "recurrence", width: 12 },
      { header: "Notes", key: "notes", width: 40 },
    ];

    // Style header row
    const headerRow = worksheet.getRow(1);
    headerRow.font = { bold: true, color: { argb: "FFFFFFFF" }, size: 11 };
    headerRow.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FF1891C3" }
    };
    headerRow.alignment = { horizontal: "center", vertical: "middle" };
    headerRow.height = 25;

    // Add data
    filteredPM.forEach((item: any) => {
      const tasksPercentage = item.tasksTotal > 0 
        ? Math.round((item.tasksCompleted / item.tasksTotal) * 100) 
        : 0;
      
      worksheet.addRow({
        title: item.title,
        description: item.description !== "—" ? item.description : "",
        plant: item.plant,
        createdBy: item.createdBy,
        scheduledDate: item.scheduledDate ? new Date(item.scheduledDate).toLocaleDateString() : "",
        completedDate: item.completedDate ? new Date(item.completedDate).toLocaleDateString() : "",
        totalTime: formatTotalTime(item.totalActualDuration),
        totalMinutes: item.totalActualDuration || 0,
        priority: item.priority.charAt(0).toUpperCase() + item.priority.slice(1),
        status: item.status.replace("_", " ").charAt(0).toUpperCase() + item.status.slice(1),
        tasksCompleted: `${item.tasksCompleted}/${item.tasksTotal}`,
        completion: `${tasksPercentage}%`,
        recurrence: item.recurrence !== "none" ? item.recurrence.charAt(0).toUpperCase() + item.recurrence.slice(1) : "None",
        notes: item.notes !== "—" ? item.notes : "",
      });
    });

    // Style data rows
    worksheet.eachRow((row, rowNumber) => {
      if (rowNumber > 1) {
        row.alignment = { vertical: "middle", wrapText: true };
        row.height = 20;
        
        if (rowNumber % 2 === 0) {
          row.fill = {
            type: "pattern",
            pattern: "solid",
            fgColor: { argb: "FFF5F5F5" }
          };
        }
        
        // Style status column
        const statusCell = row.getCell(10);
        const status = statusCell.value;
        if (status === "Completed") {
          statusCell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FF22C55E" } };
          statusCell.font = { color: { argb: "FFFFFFFF" }, bold: true };
        } else if (status === "In Progress") {
          statusCell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FF3B82F6" } };
          statusCell.font = { color: { argb: "FFFFFFFF" }, bold: true };
        } else if (status === "Cancelled") {
          statusCell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFEF4444" } };
          statusCell.font = { color: { argb: "FFFFFFFF" }, bold: true };
        } else {
          statusCell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFEAB308" } };
          statusCell.font = { color: { argb: "FFFFFFFF" }, bold: true };
        }
        
        // Style priority column
        const priorityCell = row.getCell(9);
        const priority = priorityCell.value;
        if (priority === "Critical") {
          priorityCell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFEF4444" } };
          priorityCell.font = { color: { argb: "FFFFFFFF" }, bold: true };
        } else if (priority === "High") {
          priorityCell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFF97316" } };
          priorityCell.font = { color: { argb: "FFFFFFFF" }, bold: true };
        } else if (priority === "Medium") {
          priorityCell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FF3B82F6" } };
          priorityCell.font = { color: { argb: "FFFFFFFF" }, bold: true };
        }
      }
    });

    worksheet.views = [{ state: "frozen", ySplit: 1 }];
    
    worksheet.eachRow((row) => {
      row.eachCell((cell) => {
        cell.border = {
          top: { style: "thin", color: { argb: "FFD4D4D4" } },
          left: { style: "thin", color: { argb: "FFD4D4D4" } },
          bottom: { style: "thin", color: { argb: "FFD4D4D4" } },
          right: { style: "thin", color: { argb: "FFD4D4D4" } },
        };
      });
    });

  } else if (reportType === "summary") {
    const worksheet = workbook.addWorksheet("Summary Report");
    const summaryData = generateSummaryData(filteredService);
    
    worksheet.columns = [
      { header: "Plant", key: "plant", width: 18 },
      { header: "Desktops", key: "desktops", width: 12 },
      { header: "Laptops", key: "laptops", width: 12 },
      { header: "Servers", key: "servers", width: 12 },
      { header: "Access Points", key: "accessPoints", width: 14 },
      { header: "Cameras", key: "cameras", width: 12 },
      { header: "Camera Related", key: "cameraRelated", width: 15 },
      { header: "Biometric", key: "biometric", width: 12 },
      { header: "ERP", key: "erp", width: 12 },
      { header: "Peachtree", key: "peachtree", width: 12 },
      { header: "Canteen", key: "canteen", width: 12 },
      { header: "Overtime", key: "overtime", width: 12 },
      { header: "Other Software", key: "otherSoftware", width: 15 },
      { header: "HW Total", key: "hwTotal", width: 12 },
      { header: "SW Total", key: "swTotal", width: 12 },
      { header: "NT Total", key: "ntTotal", width: 12 },
      { header: "Network", key: "network", width: 12 },
      { header: "Network Related", key: "networkRelated", width: 15 },
      { header: "Internet Related", key: "internetRelated", width: 15 },
      { header: "Project Related", key: "projectRelated", width: 15 },
      { header: "Other Services", key: "otherServices", width: 15 },
      { header: "Total", key: "total", width: 12 },
    ];

    // Style header row
    const headerRow = worksheet.getRow(1);
    headerRow.font = { bold: true, color: { argb: "FFFFFFFF" }, size: 11 };
    headerRow.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FF1891C3" }
    };
    headerRow.alignment = { horizontal: "center", vertical: "middle" };
    headerRow.height = 25;

    // Add data rows
    summaryData.forEach((row: any) => {
      worksheet.addRow({
        plant: row.Plant,
        desktops: row.Desktops,
        laptops: row.Laptops,
        servers: row.Servers,
        accessPoints: row.AccessPoints,
        cameras: row.Cameras,
        cameraRelated: row.CameraRelated,
        biometric: row.Biometric,
        erp: row.ERP,
        peachtree: row.Peachtree,
        canteen: row.Canteen,
        overtime: row.Overtime,
        otherSoftware: row.OtherSoftware,
        hwTotal: row.HWTotal,
        swTotal: row.SWTotal,
        ntTotal: row.NTTotal,
        network: row.Network,
        networkRelated: row.NetworkRelated,
        internetRelated: row.InternetRelated,
        projectRelated: row.ProjectRelated,
        otherServices: row.OtherServices,
        total: row.Total,
      });
    });

    // Add empty row
    worksheet.addRow({});
    
    // Calculate and add grand total
    const grandTotal = summaryData.reduce(
      (acc: any, row: any) => ({
        desktops: acc.desktops + row.Desktops,
        laptops: acc.laptops + row.Laptops,
        servers: acc.servers + row.Servers,
        accessPoints: acc.accessPoints + row.AccessPoints,
        cameras: acc.cameras + row.Cameras,
        cameraRelated: acc.cameraRelated + row.CameraRelated,
        biometric: acc.biometric + row.Biometric,
        erp: acc.erp + row.ERP,
        peachtree: acc.peachtree + row.Peachtree,
        canteen: acc.canteen + row.Canteen,
        overtime: acc.overtime + row.Overtime,
        otherSoftware: acc.otherSoftware + row.OtherSoftware,
        hwTotal: acc.hwTotal + row.HWTotal,
        swTotal: acc.swTotal + row.SWTotal,
        ntTotal: acc.ntTotal + row.NTTotal,
        network: acc.network + row.Network,
        networkRelated: acc.networkRelated + row.NetworkRelated,
        internetRelated: acc.internetRelated + row.InternetRelated,
        projectRelated: acc.projectRelated + row.ProjectRelated,
        otherServices: acc.otherServices + row.OtherServices,
        total: acc.total + row.Total,
      }),
      {
        desktops: 0, laptops: 0, servers: 0, accessPoints: 0,
        cameras: 0, cameraRelated: 0, biometric: 0,
        erp: 0, peachtree: 0, canteen: 0, overtime: 0, otherSoftware: 0,
        network: 0, networkRelated: 0, internetRelated: 0,
        hwTotal: 0, swTotal: 0, ntTotal: 0,
        projectRelated: 0, otherServices: 0, total: 0,
      }
    );

    const grandTotalRow = worksheet.addRow({
      plant: "GRAND TOTAL",
      desktops: grandTotal.desktops,
      laptops: grandTotal.laptops,
      servers: grandTotal.servers,
      accessPoints: grandTotal.accessPoints,
      cameras: grandTotal.cameras,
      cameraRelated: grandTotal.cameraRelated,
      biometric: grandTotal.biometric,
      erp: grandTotal.erp,
      peachtree: grandTotal.peachtree,
      canteen: grandTotal.canteen,
      overtime: grandTotal.overtime,
      otherSoftware: grandTotal.otherSoftware,
      hwTotal: grandTotal.hwTotal,
      swTotal: grandTotal.swTotal,
      ntTotal: grandTotal.ntTotal,
      network: grandTotal.network,
      networkRelated: grandTotal.networkRelated,
      internetRelated: grandTotal.internetRelated,
      projectRelated: grandTotal.projectRelated,
      otherServices: grandTotal.otherServices,
      total: grandTotal.total,
    });

    // Style grand total row
    grandTotalRow.font = { bold: true, size: 11 };
    grandTotalRow.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FFE5E7EB" }
    };
    grandTotalRow.alignment = { horizontal: "center", vertical: "middle" };

    // Style data rows
    worksheet.eachRow((row, rowNumber) => {
      if (rowNumber > 1 && rowNumber <= summaryData.length + 1) {
        row.alignment = { horizontal: "center", vertical: "middle" };
        row.height = 20;
        
        if (rowNumber % 2 === 0) {
          row.fill = {
            type: "pattern",
            pattern: "solid",
            fgColor: { argb: "FFF5F5F5" }
          };
        }
      }
    });

    worksheet.views = [{ state: "frozen", ySplit: 1 }];
    
    worksheet.eachRow((row) => {
      row.eachCell((cell) => {
        cell.border = {
          top: { style: "thin", color: { argb: "FFD4D4D4" } },
          left: { style: "thin", color: { argb: "FFD4D4D4" } },
          bottom: { style: "thin", color: { argb: "FFD4D4D4" } },
          right: { style: "thin", color: { argb: "FFD4D4D4" } },
        };
      });
    });
  }

  // Write and save file
  const buffer = await workbook.xlsx.writeBuffer();
  saveAs(new Blob([buffer]), `${fileName}.xlsx`);
};
  /* =========================================================
      EXPORT PDF
  ========================================================= */

  const exportPDF = () => {
    const doc = new jsPDF();
    doc.text("REPORT", 20, 20);
    let y = 40;
    const data = reportType === "service"
      ? filteredService
      : reportType === "summary"
      ? generateSummaryData(filteredService)
      : filteredPM;

    data.forEach((row: any) => {
      doc.text(JSON.stringify(row).slice(0, 80), 20, y);
      y += 8;
    });

    doc.save(
      reportType === "service"
        ? "Service-Report.pdf"
        : reportType === "summary"
        ? "Summary-Report.pdf"
        : "PM-Report.pdf"
    );
  };

  const loading = serviceLoading || pmLoading;

  if (loading) {
    return <div className="p-4 text-sm">Loading...</div>;
  }

  return (
    <div className="p-4 space-y-4 overflow-hidden min-w-0">
      {/* HEADER */}
      <div className="bg-white border rounded-lg p-3 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-lg font-semibold">Reports</h1>
            <p className="text-xs text-gray-500">
              Service, PM (Preventive Maintenance) and summary reports
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 min-w-0">
            {/* SWITCH */}
            <div className="flex bg-gray-100 rounded-md p-1">
              <button
                onClick={() => setReportType("service")}
                className={`px-3 py-1 text-xs rounded ${
                  reportType === "service"
                    ? "bg-[#1891C3] text-white"
                    : "text-gray-600"
                }`}
              >
                Service
              </button>
              <button
                onClick={() => setReportType("pm")}
                className={`px-3 py-1 text-xs rounded ${
                  reportType === "pm"
                    ? "bg-[#1891C3] text-white"
                    : "text-gray-600"
                }`}
              >
                PM
              </button>
              <button
                onClick={() => setReportType("summary")}
                className={`px-3 py-1 text-xs rounded ${
                  reportType === "summary"
                    ? "bg-[#1891C3] text-white"
                    : "text-gray-600"
                }`}
              >
                Summary
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
                onChange={(e) => setSearch(e.target.value)}
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

        {/* FILTERS FOR SERVICE AND SUMMARY */}
        {(reportType === "service" || reportType === "summary") && (
          <div className="flex flex-wrap gap-2 mt-3 items-center">
            <select
              value={serviceStatus}
              onChange={(e) => setServiceStatus(e.target.value)}
              className="h-8 text-xs border rounded-md px-2"
            >
              <option value="all">All Status</option>
              <option value="Pending">Pending</option>
              <option value="Assigned">Assigned</option>
              <option value="Resolved">Resolved</option>
              <option value="Unresolved">Unresolved</option>
            </select>

            {isSuperAdmin && (
              <select
                value={plantFilter}
                onChange={(e) => setPlantFilter(e.target.value)}
                className="h-8 text-xs border rounded-md px-2"
              >
                {plants.map((plant) => (
                  <option key={plant} value={plant}>
                    {plant === "all" ? "All Plants" : plant}
                  </option>
                ))}
              </select>
            )}

            <select
              value={dateType}
              onChange={(e) => setDateType(e.target.value as any)}
              className="h-8 text-xs border rounded-md px-2"
            >
              <option value="createdAt">Requested Date</option>
              <option value="assignedDate">Assigned Date</option>
              <option value="resolvedDate">Resolved Date</option>
            </select>

            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500">From</span>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="h-8 text-xs border rounded-md px-2"
              />
              <span className="text-xs text-gray-500">To</span>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="h-8 text-xs border rounded-md px-2"
              />
            </div>
          </div>
        )}

        {/* FILTERS FOR PM (PREVENTIVE MAINTENANCE) */}
        {reportType === "pm" && (
          <div className="flex flex-wrap gap-2 mt-3 items-center">
            <select
              value={pmStatus}
              onChange={(e) => setPmStatus(e.target.value)}
              className="h-8 text-xs border rounded-md px-2"
            >
              <option value="all">All Status</option>
              <option value="planned">Planned</option>
              <option value="in_progress">In Progress</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>

            <select
              value={pmPriorityFilter}
              onChange={(e) => setPmPriorityFilter(e.target.value)}
              className="h-8 text-xs border rounded-md px-2"
            >
              <option value="all">All Priorities</option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="critical">Critical</option>
            </select>

            {isSuperAdmin && (
              <select
                value={plantFilter}
                onChange={(e) => setPlantFilter(e.target.value)}
                className="h-8 text-xs border rounded-md px-2"
              >
                {plants.map((plant) => (
                  <option key={plant} value={plant}>
                    {plant === "all" ? "All Plants" : plant}
                  </option>
                ))}
              </select>
            )}

            <select
              value={pmDateType}
              onChange={(e) => setPmDateType(e.target.value as any)}
              className="h-8 text-xs border rounded-md px-2"
            >
              <option value="scheduledDate">Scheduled Date</option>
              <option value="completedDate">Completed Date</option>
            </select>

            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500">From</span>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="h-8 text-xs border rounded-md px-2"
              />
              <span className="text-xs text-gray-500">To</span>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="h-8 text-xs border rounded-md px-2"
              />
            </div>
          </div>
        )}
      </div>

      {/* TABLE */}
      <div className="min-w-0 overflow-hidden">
        {reportType === "service" ? (
          <ServiceReportTable data={filteredService} />
        ) : reportType === "pm" ? (
          <PMReportTable data={filteredPM} />
        ) : (
          <SummaryTable data={filteredService} />
        )}
      </div>
    </div>
  );
};

export default Report;