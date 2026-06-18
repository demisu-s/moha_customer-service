// src/pages/Report/Report.tsx
import React, { useState, useMemo } from "react";
import { ReportHeader } from "../../../components/report/ReportHeader";
import { ServiceFilters } from "../../../components/report/ServiceFilters";
import { PMPilters } from "../../../components/report/PMPilters";
import ServiceReportTable from "../../../components/dashboardComponents/ServiceReportTable";
import PMReportTable from "../../../components/dashboardComponents/PMReportTable";
import SummaryTable from "../../../components/dashboardComponents/SummaryTable";
import { useServiceRequests } from "../../../context/ServiceRequestContext";
import { usePMWO } from "../../../context/PMWOContext";
import { useUserContext } from "../../../context/UserContext";
import { exportExcel, exportPDF } from "../../../utils/exportService";

const Report = () => {
  const { requests, loading: serviceLoading } = useServiceRequests();
  const { workOrders, loading: pmLoading } = usePMWO();
  const { currentUser } = useUserContext();

  const isSuperAdmin = currentUser?.role === "superadmin";
  const currentPlantName =
    typeof currentUser?.department?.plant === "object"
      ? currentUser?.department?.plant?.name
      : currentUser?.department?.plant || "";

  // State
  const [search, setSearch] = useState("");
  const [reportType, setReportType] = useState<"service" | "pm" | "summary">("service");
  const [serviceStatus, setServiceStatus] = useState("all");
  const [pmStatus, setPmStatus] = useState("all");
  const [plantFilter, setPlantFilter] = useState("all");
  const [pmPriorityFilter, setPmPriorityFilter] = useState("all");
  const [dateType, setDateType] = useState<"createdAt" | "assignedDate" | "resolvedDate">("createdAt");
  const [pmDateType, setPmDateType] = useState<"scheduledDate" | "completedDate">("scheduledDate");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // Prepare Service Data
  const serviceData = useMemo(() => {
    return requests
      .map((req: any) => ({
        requestedBy: req.requestedBy || "—",
        requestedDate: req.createdAt ? new Date(req.createdAt).toLocaleDateString() : "—",
        createdAt: req.createdAt,
        assignedDate: req.assignedDate,
        resolvedDate: req.resolvedDate,
        plant: req.plant || "—",
        problemCategory: req.problemCategory || "—",
        deviceType: req.deviceType || "—",
        problemType: req.issues || "—",
        priority: req.urgency || "—",
        solvedBy: req.resolvedByName || req.assignedToName || "—",
        solution: req.solution || "—",
        status: req.status || "Pending",
      }))
      .filter((item: any) => {
        if (isSuperAdmin) return true;
        return item.plant === currentPlantName;
      });
  }, [requests, isSuperAdmin, currentPlantName]);

  // Prepare PM Data
  const pmData = useMemo(() => {
    return workOrders
      .map((wo: any) => {
        const totalActualDuration =
          wo.tasks
            ?.filter((task: any) => task.isCompleted && task.actualDuration)
            .reduce((sum: number, task: any) => sum + (task.actualDuration || 0), 0) || 0;

        return {
          id: wo._id,
          title: wo.title || "—",
          description: wo.description || "—",
          plant: wo.plant?.name || wo.plant || "—",
          createdBy:
            typeof wo.createdBy === "object"
              ? `${wo.createdBy?.firstName || ""} ${wo.createdBy?.lastName || ""}`.trim() ||
                wo.createdBy?.email ||
                "—"
              : wo.createdBy || "—",
          scheduledDate: wo.scheduledDate,
          completedDate: wo.completedDate,
          priority: wo.priority || "—",
          status: wo.status || "planned",
          tasksTotal: wo.tasks?.length || 0,
          tasksCompleted: wo.tasks?.filter((t: any) => t.isCompleted).length || 0,
          recurrence: wo.recurrence || "none",
          notes: wo.notes || "—",
          totalActualDuration: totalActualDuration,
        };
      })
      .filter((item: any) => {
        if (isSuperAdmin) return true;
        return item.plant === currentPlantName;
      });
  }, [workOrders, isSuperAdmin, currentPlantName]);

  // Plants list for filter
  const plants = useMemo(() => {
    if (!isSuperAdmin) return [currentPlantName];
    return [
      "all",
      ...Array.from(new Set(serviceData.map((item: any) => item.plant))),
    ];
  }, [serviceData, isSuperAdmin, currentPlantName]);

  // Filter Service Data
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

  // Filter PM Data
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

  const loading = serviceLoading || pmLoading;

  if (loading) {
    return <div className="p-4 text-sm">Loading...</div>;
  }

  return (
    <div className="p-4 space-y-4 overflow-hidden min-w-0">
      {/* Header */}
      <ReportHeader
        reportType={reportType}
        onReportTypeChange={setReportType}
        search={search}
        onSearchChange={setSearch}
        onExportExcel={() => exportExcel(reportType, filteredService, filteredPM)}
        onExportPDF={() => exportPDF(reportType, filteredService, filteredPM)}
      />

      {/* Filters */}
      {(reportType === "service" || reportType === "summary") && (
        <ServiceFilters
          serviceStatus={serviceStatus}
          onServiceStatusChange={setServiceStatus}
          plantFilter={plantFilter}
          onPlantFilterChange={setPlantFilter}
          dateType={dateType}
          onDateTypeChange={setDateType}
          startDate={startDate}
          onStartDateChange={setStartDate}
          endDate={endDate}
          onEndDateChange={setEndDate}
          isSuperAdmin={isSuperAdmin}
          plants={plants}
        />
      )}

      {reportType === "pm" && (
        <PMPilters
          pmStatus={pmStatus}
          onPmStatusChange={setPmStatus}
          pmPriorityFilter={pmPriorityFilter}
          onPmPriorityFilterChange={setPmPriorityFilter}
          plantFilter={plantFilter}
          onPlantFilterChange={setPlantFilter}
          pmDateType={pmDateType}
          onPmDateTypeChange={setPmDateType}
          startDate={startDate}
          onStartDateChange={setStartDate}
          endDate={endDate}
          onEndDateChange={setEndDate}
          isSuperAdmin={isSuperAdmin}
          plants={plants}
        />
      )}

      {/* Table */}
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