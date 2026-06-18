// src/utils/exportService.ts
import jsPDF from "jspdf";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import { generateSummaryData } from "./generateSummary";

// Helper to format time
const formatTotalTime = (minutes: number) => {
  if (!minutes || minutes === 0) return "";
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  const parts = [];
  if (hours > 0) parts.push(`${hours}h`);
  if (mins > 0) parts.push(`${mins}m`);
  return parts.join(" ");
};

// Helper to apply common Excel styling
const styleExcelHeader = (worksheet: any, columns: any[]) => {
  worksheet.columns = columns;
  
  const headerRow = worksheet.getRow(1);
  headerRow.font = { 
    bold: true, 
    color: { argb: "FFFFFFFF" }, 
    size: 11,
    name: "Arial"
  };
  headerRow.fill = {
    type: "pattern",
    pattern: "solid",
    fgColor: { argb: "FF1891C3" }
  };
  headerRow.alignment = { 
    horizontal: "center", 
    vertical: "middle",
    wrapText: true
  };
  headerRow.height = 30;
};

const styleExcelData = (worksheet: any, startRow: number, endRow: number) => {
  worksheet.eachRow((row: any, rowNumber: number) => {
    if (rowNumber >= startRow && rowNumber <= endRow) {
      row.alignment = { 
        vertical: "middle", 
        wrapText: true,
        horizontal: "center"
      };
      row.height = 22;
      
      // Set default text color to BLACK for all data cells
      row.eachCell((cell: any) => {
        if (!cell.font) cell.font = {};
        cell.font.color = { argb: "FF000000" }; // Black text
        cell.font.bold = false; // Remove bold
      });
      
      if (rowNumber % 2 === 0) {
        row.fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: "FFF5F8FA" }
        };
      }
    }
  });
};

const styleExcelBorders = (worksheet: any) => {
  worksheet.eachRow((row: any) => {
    row.eachCell((cell: any) => {
      cell.border = {
        top: { style: "thin", color: { argb: "FFD4D4D4" } },
        left: { style: "thin", color: { argb: "FFD4D4D4" } },
        bottom: { style: "thin", color: { argb: "FFD4D4D4" } },
        right: { style: "thin", color: { argb: "FFD4D4D4" } },
      };
    });
  });
};

// Helper to convert CellValue to string safely
const getStringValue = (value: ExcelJS.CellValue): string => {
  if (value === null || value === undefined) return "";
  if (typeof value === 'string') return value;
  if (typeof value === 'number') return String(value);
  if (typeof value === 'boolean') return String(value);
  if (typeof value === 'object' && value !== null) {
    if ('text' in value) return String(value.text);
    if ('richText' in value) {
      const richText = value.richText;
      if (Array.isArray(richText)) {
        return richText.map((part: any) => part.text || '').join('');
      }
      return String(richText);
    }
    return String(value);
  }
  return "";
};

// Style status cell with proper contrast - NO BOLD
const styleStatusCell = (cell: any, status: string) => {
  const statusStr = String(status || '').toLowerCase().trim();
  
  const colorMap: { [key: string]: { bg: string; text: string } } = {
    'resolved': { bg: 'FF22C55E', text: 'FFFFFFFF' },
    'completed': { bg: 'FF22C55E', text: 'FFFFFFFF' },
    'assigned': { bg: 'FF3B82F6', text: 'FFFFFFFF' },
    'in progress': { bg: 'FF3B82F6', text: 'FFFFFFFF' },
    'in_progress': { bg: 'FF3B82F6', text: 'FFFFFFFF' },
    'pending': { bg: 'FFEAB308', text: 'FF000000' },
    'planned': { bg: 'FFEAB308', text: 'FF000000' },
    'unresolved': { bg: 'FFEF4444', text: 'FFFFFFFF' },
    'cancelled': { bg: 'FFEF4444', text: 'FFFFFFFF' },
  };
  
  const defaultStyle = { bg: 'FFF3F4F6', text: 'FF000000' };
  const style = colorMap[statusStr] || defaultStyle;
  
  cell.fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: style.bg }
  };
  cell.font = {
    color: { argb: style.text },
    bold: false, // NO BOLD
    size: 11,
    name: "Arial"
  };
  cell.alignment = {
    horizontal: 'center',
    vertical: 'middle'
  };
};

// Style priority with proper contrast - NO BOLD
const stylePriorityCell = (cell: any, priority: string) => {
  const priorityStr = String(priority || '').toLowerCase().trim();
  
  const colorMap: { [key: string]: { bg: string; text: string } } = {
    'critical': { bg: 'FFEF4444', text: 'FFFFFFFF' },
    'high': { bg: 'FFF97316', text: 'FFFFFFFF' },
    'medium': { bg: 'FF3B82F6', text: 'FFFFFFFF' },
    'low': { bg: 'FF22C55E', text: 'FFFFFFFF' },
  };
  
  const defaultStyle = { bg: 'FFF3F4F6', text: 'FF000000' };
  const style = colorMap[priorityStr] || defaultStyle;
  
  cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: style.bg } };
  cell.font = { color: { argb: style.text }, bold: false }; // NO BOLD
};

// Style completion cell - NO BOLD
const styleCompletionCell = (cell: any, value: string) => {
  const completionNum = parseInt(value.replace('%', ''));
  
  if (!isNaN(completionNum)) {
    if (completionNum === 100) {
      cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FF22C55E" } };
      cell.font = { color: { argb: "FFFFFFFF" }, bold: false };
    } else if (completionNum > 0) {
      cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FF3B82F6" } };
      cell.font = { color: { argb: "FFFFFFFF" }, bold: false };
    } else {
      cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFF3F4F6" } };
      cell.font = { color: { argb: "FF000000" }, bold: false };
    }
  }
};

export const exportExcel = async (
  reportType: "service" | "pm" | "summary",
  filteredService: any[],
  filteredPM: any[]
) => {
  const workbook = new ExcelJS.Workbook();
  const fileName =
    reportType === "service"
      ? "Service-Report"
      : reportType === "pm"
      ? "PM-Report"
      : "Summary-Report";

  // ─── SERVICE REPORT ─────────────────────────────────────────────────────────
  if (reportType === "service") {
    const worksheet = workbook.addWorksheet("Service Report");

    const columns = [
      { header: "Requested By", key: "requestedBy", width: 22 },
      { header: "Plant", key: "plant", width: 20 },
      { header: "Requested Date", key: "requestedDate", width: 15 },
      { header: "Assigned Date", key: "assignedDate", width: 15 },
      { header: "Resolved Date", key: "resolvedDate", width: 15 },
      { header: "Problem Category", key: "problemCategory", width: 22 },
      { header: "Device Type", key: "deviceType", width: 18 },
      { header: "Problem Type", key: "problemType", width: 25 },
      { header: "Priority", key: "priority", width: 12 },
      { header: "Solved By", key: "solvedBy", width: 20 },
      { header: "Solution", key: "solution", width: 40 },
      { header: "Status", key: "status", width: 14 },
    ];

    styleExcelHeader(worksheet, columns);

    filteredService.forEach((item: any) => {
      const row = worksheet.addRow({
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
        solution: item.solution || "",
        status: item.status,
      });

      styleStatusCell(row.getCell(12), item.status);
      stylePriorityCell(row.getCell(9), item.priority);
      
      // Ensure ALL other cells have BLACK text and NO BOLD
      row.eachCell((cell: any, colNumber: number) => {
        if (colNumber !== 9 && colNumber !== 12) {
          if (!cell.font) cell.font = {};
          cell.font.color = { argb: "FF000000" };
          cell.font.bold = false;
        }
      });
    });

    styleExcelData(worksheet, 2, filteredService.length + 1);
    styleExcelBorders(worksheet);
    worksheet.views = [{ state: "frozen", ySplit: 1 }];

  // ─── PM REPORT ────────────────────────────────────────────────────────────
  } else if (reportType === "pm") {
    const worksheet = workbook.addWorksheet("PM Report");

    const columns = [
      { header: "Work Order", key: "title", width: 35 },
      { header: "Description", key: "description", width: 30 },
      { header: "Plant", key: "plant", width: 20 },
      { header: "Created By", key: "createdBy", width: 22 },
      { header: "Scheduled Date", key: "scheduledDate", width: 16 },
      { header: "Completed Date", key: "completedDate", width: 16 },
      { header: "Total Time", key: "totalTime", width: 14 },
      { header: "Total Minutes", key: "totalMinutes", width: 14 },
      { header: "Priority", key: "priority", width: 12 },
      { header: "Status", key: "status", width: 14 },
      { header: "Tasks", key: "tasksCompleted", width: 14 },
      { header: "Completion", key: "completion", width: 14 },
      { header: "Recurrence", key: "recurrence", width: 14 },
      { header: "Notes", key: "notes", width: 35 },
    ];

    styleExcelHeader(worksheet, columns);

    filteredPM.forEach((item: any) => {
      const tasksPercentage =
        item.tasksTotal > 0 ? Math.round((item.tasksCompleted / item.tasksTotal) * 100) : 0;

      let status = item.status || '';
      status = status.replace(/_/g, ' ');
      status = status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();

      const row = worksheet.addRow({
        title: item.title,
        description: item.description !== "—" ? item.description : "",
        plant: item.plant,
        createdBy: item.createdBy,
        scheduledDate: item.scheduledDate ? new Date(item.scheduledDate).toLocaleDateString() : "",
        completedDate: item.completedDate ? new Date(item.completedDate).toLocaleDateString() : "",
        totalTime: formatTotalTime(item.totalActualDuration),
        totalMinutes: item.totalActualDuration || 0,
        priority: item.priority.charAt(0).toUpperCase() + item.priority.slice(1),
        status: status,
        tasksCompleted: `${item.tasksCompleted}/${item.tasksTotal}`,
        completion: `${tasksPercentage}%`,
        recurrence: item.recurrence !== "none" ? item.recurrence.charAt(0).toUpperCase() + item.recurrence.slice(1) : "None",
        notes: item.notes !== "—" ? item.notes : "",
      });

      styleStatusCell(row.getCell(10), status);
      stylePriorityCell(row.getCell(9), item.priority);
      
      const completionCell = row.getCell(12);
      const completionValue = getStringValue(completionCell.value);
      styleCompletionCell(completionCell, completionValue);
      
      // Ensure ALL other cells have BLACK text and NO BOLD
      row.eachCell((cell: any, colNumber: number) => {
        if (colNumber !== 9 && colNumber !== 10 && colNumber !== 12) {
          if (!cell.font) cell.font = {};
          cell.font.color = { argb: "FF000000" };
          cell.font.bold = false;
        }
      });
    });

    styleExcelData(worksheet, 2, filteredPM.length + 1);
    styleExcelBorders(worksheet);
    worksheet.views = [{ state: "frozen", ySplit: 1 }];

  // ─── SUMMARY REPORT ──────────────────────────────────────────────────────
  } else if (reportType === "summary") {
    const worksheet = workbook.addWorksheet("Summary Report");
    const summaryData = generateSummaryData(filteredService);

    const columns = [
      { header: "Plant", key: "plant", width: 18 },
      { header: "Desktops", key: "desktops", width: 12 },
      { header: "Laptops", key: "laptops", width: 12 },
      { header: "Servers", key: "servers", width: 12 },
      { header: "Switches", key: "switches", width: 12 },
      { header: "Access Points", key: "accessPoints", width: 14 },
      { header: "Cameras", key: "cameras", width: 12 },
      { header: "Camera Related", key: "cameraRelated", width: 15 },
      { header: "Biometric", key: "biometric", width: 12 },
      { header: "Printer", key: "printer", width: 12 },
      { header: "UPS", key: "ups", width: 12 },
      { header: "TV", key: "tv", width: 12 },
      { header: "HW Total", key: "hwTotal", width: 12 },
      { header: "ERP", key: "erp", width: 12 },
      { header: "Peachtree", key: "peachtree", width: 12 },
      { header: "Canteen", key: "canteen", width: 12 },
      { header: "Overtime", key: "overtime", width: 12 },
      { header: "Other Software", key: "otherSoftware", width: 15 },
      { header: "SW Total", key: "swTotal", width: 12 },
      { header: "Network", key: "network", width: 12 },
      { header: "Network Related", key: "networkRelated", width: 15 },
      { header: "Internet Related", key: "internetRelated", width: 15 },
      { header: "NT Total", key: "ntTotal", width: 12 },
      { header: "Project Related", key: "projectRelated", width: 15 },
      { header: "Other Services", key: "otherServices", width: 15 },
      { header: "Total", key: "total", width: 12 },
    ];

    styleExcelHeader(worksheet, columns);

    summaryData.forEach((row: any) => {
      const ntTotal = (row.Network || 0) + (row.NetworkRelated || 0) + (row.InternetRelated || 0);

      const rowData = {
        plant: row.Plant,
        desktops: row.Desktops || 0,
        laptops: row.Laptops || 0,
        servers: row.Servers || 0,
        switches: row.Switches || 0,
        accessPoints: row.AccessPoints || 0,
        cameras: row.Cameras || 0,
        cameraRelated: row.CameraRelated || 0,
        biometric: row.Biometric || 0,
        printer: row.Printer || 0,
        ups: row.UPS || 0,
        tv: row.TV || 0,
        hwTotal: row.HWTotal || 0,
        erp: row.ERP || 0,
        peachtree: row.Peachtree || 0,
        canteen: row.Canteen || 0,
        overtime: row.Overtime || 0,
        otherSoftware: row.OtherSoftware || 0,
        swTotal: row.SWTotal || 0,
        network: row.Network || 0,
        networkRelated: row.NetworkRelated || 0,
        internetRelated: row.InternetRelated || 0,
        ntTotal: ntTotal,
        projectRelated: row.ProjectRelated || 0,
        otherServices: row.OtherServices || 0,
        total: row.Total || 0,
      };

      const addedRow = worksheet.addRow(rowData);

      // Style all cells with BLACK text and NO BOLD by default
      addedRow.eachCell((cell: any) => {
        if (!cell.font) cell.font = {};
        cell.font.color = { argb: "FF000000" };
        cell.font.bold = false;
      });

      // Style HW columns with light blue background
      const hwColumns = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
      hwColumns.forEach(colIndex => {
        const cell = addedRow.getCell(colIndex);
        cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFF5F9FF" } };
        cell.font = { color: { argb: "FF000000" }, bold: false };
      });

      const hwTotalCell = addedRow.getCell(13);
      hwTotalCell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFE3F2FD" } };
      hwTotalCell.font = { color: { argb: "FF000000" }, bold: false };

      const swColumns = [14, 15, 16, 17, 18];
      swColumns.forEach(colIndex => {
        const cell = addedRow.getCell(colIndex);
        cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFF5FFF5" } };
        cell.font = { color: { argb: "FF000000" }, bold: false };
      });

      const swTotalCell = addedRow.getCell(19);
      swTotalCell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFE8F5E9" } };
      swTotalCell.font = { color: { argb: "FF000000" }, bold: false };

      const ntColumns = [20, 21, 22];
      ntColumns.forEach(colIndex => {
        const cell = addedRow.getCell(colIndex);
        cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFF5F0FF" } };
        cell.font = { color: { argb: "FF000000" }, bold: false };
      });

      const ntTotalCell = addedRow.getCell(23);
      ntTotalCell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFF3E5F5" } };
      ntTotalCell.font = { color: { argb: "FF000000" }, bold: false };

      const totalCell = addedRow.getCell(26);
      totalCell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFFFF3E0" } };
      totalCell.font = { color: { argb: "FF000000" }, bold: false, size: 12 };
    });

    // Grand Total
    const grandTotal = summaryData.reduce(
      (acc: any, row: any) => ({
        Desktops: acc.Desktops + (row.Desktops || 0),
        Laptops: acc.Laptops + (row.Laptops || 0),
        Servers: acc.Servers + (row.Servers || 0),
        Switches: acc.Switches + (row.Switches || 0),
        AccessPoints: acc.AccessPoints + (row.AccessPoints || 0),
        Cameras: acc.Cameras + (row.Cameras || 0),
        CameraRelated: acc.CameraRelated + (row.CameraRelated || 0),
        Biometric: acc.Biometric + (row.Biometric || 0),
        Printer: acc.Printer + (row.Printer || 0),
        UPS: acc.UPS + (row.UPS || 0),
        TV: acc.TV + (row.TV || 0),
        HWTotal: acc.HWTotal + (row.HWTotal || 0),
        ERP: acc.ERP + (row.ERP || 0),
        Peachtree: acc.Peachtree + (row.Peachtree || 0),
        Canteen: acc.Canteen + (row.Canteen || 0),
        Overtime: acc.Overtime + (row.Overtime || 0),
        OtherSoftware: acc.OtherSoftware + (row.OtherSoftware || 0),
        SWTotal: acc.SWTotal + (row.SWTotal || 0),
        Network: acc.Network + (row.Network || 0),
        NetworkRelated: acc.NetworkRelated + (row.NetworkRelated || 0),
        InternetRelated: acc.InternetRelated + (row.InternetRelated || 0),
        NTTotal: acc.NTTotal + (row.Network || 0) + (row.NetworkRelated || 0) + (row.InternetRelated || 0),
        ProjectRelated: acc.ProjectRelated + (row.ProjectRelated || 0),
        OtherServices: acc.OtherServices + (row.OtherServices || 0),
        Total: acc.Total + (row.Total || 0),
      }),
      {
        Desktops: 0,
        Laptops: 0,
        Servers: 0,
        Switches: 0,
        AccessPoints: 0,
        Cameras: 0,
        CameraRelated: 0,
        Biometric: 0,
        Printer: 0,
        UPS: 0,
        TV: 0,
        HWTotal: 0,
        ERP: 0,
        Peachtree: 0,
        Canteen: 0,
        Overtime: 0,
        OtherSoftware: 0,
        SWTotal: 0,
        Network: 0,
        NetworkRelated: 0,
        InternetRelated: 0,
        NTTotal: 0,
        ProjectRelated: 0,
        OtherServices: 0,
        Total: 0,
      }
    );

    const grandTotalRow = worksheet.addRow({
      plant: "GRAND TOTAL",
      desktops: grandTotal.Desktops,
      laptops: grandTotal.Laptops,
      servers: grandTotal.Servers,
      switches: grandTotal.Switches,
      accessPoints: grandTotal.AccessPoints,
      cameras: grandTotal.Cameras,
      cameraRelated: grandTotal.CameraRelated,
      biometric: grandTotal.Biometric,
      printer: grandTotal.Printer,
      ups: grandTotal.UPS,
      tv: grandTotal.TV,
      hwTotal: grandTotal.HWTotal,
      erp: grandTotal.ERP,
      peachtree: grandTotal.Peachtree,
      canteen: grandTotal.Canteen,
      overtime: grandTotal.Overtime,
      otherSoftware: grandTotal.OtherSoftware,
      swTotal: grandTotal.SWTotal,
      network: grandTotal.Network,
      networkRelated: grandTotal.NetworkRelated,
      internetRelated: grandTotal.InternetRelated,
      ntTotal: grandTotal.NTTotal,
      projectRelated: grandTotal.ProjectRelated,
      otherServices: grandTotal.OtherServices,
      total: grandTotal.Total,
    });

    grandTotalRow.font = { bold: false, size: 11, color: { argb: "FF000000" } };
    grandTotalRow.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FFE8EAF6" }
    };
    grandTotalRow.alignment = { horizontal: "center", vertical: "middle" };
    grandTotalRow.height = 28;

    const grandTotalCell = grandTotalRow.getCell(26);
    grandTotalCell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFFFF3E0" } };
    grandTotalCell.font = { bold: false, size: 14, color: { argb: "FFE65100" } };

    styleExcelData(worksheet, 2, summaryData.length + 1);
    styleExcelBorders(worksheet);
    worksheet.views = [{ state: "frozen", ySplit: 1 }];
  }

  const buffer = await workbook.xlsx.writeBuffer();
  saveAs(new Blob([buffer]), `${fileName}.xlsx`);
};

// ─── PDF EXPORT ────────────────────────────────────────────────────────────────
export const exportPDF = (
  reportType: "service" | "pm" | "summary",
  filteredService: any[],
  filteredPM: any[]
) => {
  const doc = new jsPDF();
  doc.text("REPORT", 20, 20);
  let y = 40;
  const data =
    reportType === "service"
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