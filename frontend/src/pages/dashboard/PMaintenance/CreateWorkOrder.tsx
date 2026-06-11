import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { usePMWO } from "../../../context/PMWOContext";
import { useUserContext } from "../../../context/UserContext";
import { usePlantContext } from "../../../context/PlantContext";
import { WorkOrderStats } from "../../../components/PMaintenance/WorkOrderStats";
import { WorkOrderFilters } from "../../../components/PMaintenance/WorkOrderFilters";
import { WorkOrderTable } from "../../../components/PMaintenance/WorkOrderTable";
import { CreateWorkOrderForm } from "../../../components/PMaintenance/CreateWorkOrderForm";

const CreateWorkOrder: React.FC = () => {
  const { addWorkOrder, workOrders, removeWorkOrder, loading } = usePMWO();
  const { currentUser } = useUserContext();
  const { plants } = usePlantContext();
  const navigate = useNavigate();

  const isSuperAdmin = currentUser?.role === "superadmin";
  const isAdmin = currentUser?.role === "admin";
  const isSupervisor = currentUser?.role === "supervisor";
  const canCreateWorkOrder = isSuperAdmin || isAdmin;
  const canDelete = isSuperAdmin || isAdmin;

  // Role-aware execute route prefix
  const executeRouteBase = React.useMemo(() => {
    if (currentUser?.role === "admin") return "/admin-dashboard/work-orders/execute";
    if (currentUser?.role === "supervisor") return "/supervisor-dashboard/work-orders/execute";
    return "/dashboard/work-orders/execute";
  }, [currentUser?.role]);

  // Get admin's own plant ID
  const adminPlantId: string | undefined = useMemo(() => {
    if (isSuperAdmin) return undefined;
    const p = currentUser?.department?.plant;
    return typeof p === "string" ? p : (p as any)?._id;
  }, [currentUser, isSuperAdmin]);

  // Filter work orders by plant for admin/supervisor
  const visibleWorkOrders = useMemo(() => {
    if (isSuperAdmin) return workOrders;
    return workOrders.filter((wo) => {
      const woPlant = typeof wo.plant === "string" ? wo.plant : wo.plant?._id;
      return woPlant === adminPlantId;
    });
  }, [workOrders, isSuperAdmin, adminPlantId]);

  // Filter state
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterPlant, setFilterPlant] = useState("all");
  const [filterDate, setFilterDate] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  // Filtered rows
  const filteredOrders = useMemo(() => {
    return visibleWorkOrders.filter((wo) => {
      const woPlantId = typeof wo.plant === "string" ? wo.plant : wo.plant?._id;
      const woPlantName = typeof wo.plant === "object" ? wo.plant?.name ?? "" : "";

      const matchSearch =
        !search.trim() ||
        wo.title.toLowerCase().includes(search.toLowerCase()) ||
        woPlantName.toLowerCase().includes(search.toLowerCase());

      const matchStatus = filterStatus === "all" || wo.status === filterStatus;
      const matchPlant = !isSuperAdmin || filterPlant === "all" || woPlantId === filterPlant;
      const matchDate =
        !filterDate ||
        new Date(wo.scheduledDate).toISOString().slice(0, 10) === filterDate;

      return matchSearch && matchStatus && matchPlant && matchDate;
    });
  }, [visibleWorkOrders, search, filterStatus, filterPlant, filterDate, isSuperAdmin]);

  // Stats
  const planned = visibleWorkOrders.filter((w) => w.status === "planned").length;
  const inProgress = visibleWorkOrders.filter((w) => w.status === "in_progress").length;
  const completed = visibleWorkOrders.filter((w) => w.status === "completed").length;

  // Plant name lookup
  const getPlantName = (plant: any): string => {
    if (!plant) return "—";
    if (typeof plant === "object" && plant.name) return plant.name;
    const found = plants.find((p) => p._id === plant);
    return found?.name ?? String(plant).slice(-6);
  };

  const adminPlantName = adminPlantId ? getPlantName(adminPlantId) : "";

  const handleSubmit = async (payload: any) => {
    setSaving(true);
    try {
      await addWorkOrder(payload);
    } catch (err: any) {
      console.error("Create work order error:", err);
      alert(err?.response?.data?.message || "Failed to create work order");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this work order?")) {
      await removeWorkOrder(id);
    }
  };

  const handleClearFilters = () => {
    setSearch("");
    setFilterStatus("all");
    setFilterPlant("all");
    setFilterDate("");
  };

  const hasActiveFilters = search !== "" || filterStatus !== "all" || filterPlant !== "all" || filterDate !== "";

  return (
    <div className="space-y-6 px-2">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-3xl font-bold">Preventive Maintenance</h1>
          <p className="text-gray-500 mt-1">
            {isSupervisor 
              ? "View and execute maintenance work orders"
              : isAdmin
              ? "Manage and execute maintenance work orders for your plant"
              : "Plan, schedule, and manage maintenance work orders"}
            {!isSuperAdmin && adminPlantId && (
              <span className="ml-2 text-primary-600 font-medium text-xs">
                · {adminPlantName} plant
              </span>
            )}
          </p>
        </div>

        {canCreateWorkOrder && (
          <CreateWorkOrderForm
            isOpen={formOpen}
            onOpenChange={setFormOpen}
            onSubmit={handleSubmit}
            saving={saving}
            isSuperAdmin={isSuperAdmin}
            isAdmin={isAdmin}
            plants={plants}
            adminPlantName={adminPlantName}
            getPlantName={getPlantName}
          />
        )}
      </div>

      {/* Stats */}
      <WorkOrderStats
        total={visibleWorkOrders.length}
        planned={planned}
        inProgress={inProgress}
        completed={completed}
      />

      {/* Filters */}
      <WorkOrderFilters
        search={search}
        onSearchChange={setSearch}
        filterStatus={filterStatus}
        onStatusChange={setFilterStatus}
        filterPlant={filterPlant}
        onPlantChange={setFilterPlant}
        filterDate={filterDate}
        onDateChange={setFilterDate}
        showPlantFilter={isSuperAdmin}
        plants={plants}
        onClearFilters={handleClearFilters}
        hasActiveFilters={hasActiveFilters}
      />

      {/* Table */}
      <WorkOrderTable
        workOrders={filteredOrders}
        loading={loading}
        isSuperAdmin={isSuperAdmin}
        executeRouteBase={executeRouteBase}
        onNavigate={navigate}
        onDelete={handleDelete}
        canDelete={canDelete}
        getPlantName={getPlantName}
      />
    </div>
  );
};

export default CreateWorkOrder;