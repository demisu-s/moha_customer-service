// pages/PMaintenance/CreateWorkOrder.tsx
import React, { useState, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { usePMWO } from "../../../context/PMWOContext";
import { useUserContext } from "../../../context/UserContext";
import { usePlantContext } from "../../../context/PlantContext";
import { WorkOrderStats } from "../../../components/PMaintenance/WorkOrderStats";
import { WorkOrderFilters } from "../../../components/PMaintenance/WorkOrderFilters";
import { WorkOrderTable } from "../../../components/PMaintenance/WorkOrderTable";
import { CreateWorkOrderForm } from "../../../components/PMaintenance/CreateWorkOrderForm";
import { EditWorkOrderForm } from "../../../components/PMaintenance/EditWorkOrderForm";

const CreateWorkOrder: React.FC = () => {
  const { addWorkOrder, workOrders, removeWorkOrder, updateWorkOrder, loading } = usePMWO();
  const { currentUser } = useUserContext();
  const { plants } = usePlantContext();
  const navigate = useNavigate();

  const isSuperAdmin = currentUser?.role === "superadmin";
  const isAdmin = currentUser?.role === "admin";
  const isSupervisor = currentUser?.role === "supervisor";
  
  // Permissions
  const canCreateWorkOrder = isSuperAdmin || isAdmin;
  const canDelete = isSuperAdmin || isAdmin;
  const canEdit = isSuperAdmin || isAdmin;

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

  // Get admin's plant name
  const getPlantName = (plant: any): string => {
    if (!plant) return "—";
    if (typeof plant === "object" && plant.name) return plant.name;
    const found = plants.find((p) => p._id === plant);
    return found?.name ?? String(plant).slice(-6);
  };

  const adminPlantName = adminPlantId ? getPlantName(adminPlantId) : "";

  // Filter state
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterPlant, setFilterPlant] = useState("all");
  const [filterDateFrom, setFilterDateFrom] = useState("");
  const [filterDateTo, setFilterDateTo] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [editFormOpen, setEditFormOpen] = useState(false);
  const [editingWorkOrder, setEditingWorkOrder] = useState<any>(null);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState(false);

  // Get the current plant name for display in stats
  const getCurrentPlantNameForStats = useMemo(() => {
    if (isSuperAdmin) {
      if (filterPlant !== "all") {
        const plant = plants.find(p => p._id === filterPlant);
        return plant?.name || "All Plants";
      }
      return "All Plants";
    }
    return adminPlantName || "Your Plant";
  }, [isSuperAdmin, filterPlant, plants, adminPlantName]);

  // Filter work orders by plant
  const visibleWorkOrders = useMemo(() => {
    if (isSuperAdmin) {
      if (filterPlant !== "all") {
        return workOrders.filter((wo) => {
          const woPlant = typeof wo.plant === "string" ? wo.plant : wo.plant?._id;
          return woPlant === filterPlant;
        });
      }
      return workOrders;
    }
    // For admin/supervisor, only their plant
    return workOrders.filter((wo) => {
      const woPlant = typeof wo.plant === "string" ? wo.plant : wo.plant?._id;
      return woPlant === adminPlantId;
    });
  }, [workOrders, isSuperAdmin, adminPlantId, filterPlant]);

  // Filtered rows with search, status, and date range
  const filteredOrders = useMemo(() => {
    return visibleWorkOrders.filter((wo) => {
      const woPlantName = typeof wo.plant === "object" ? wo.plant?.name ?? "" : "";

      const matchSearch =
        !search.trim() ||
        wo.title.toLowerCase().includes(search.toLowerCase()) ||
        woPlantName.toLowerCase().includes(search.toLowerCase());

      const matchStatus = filterStatus === "all" || wo.status === filterStatus;
      
      // Date range filtering
      let matchDate = true;
      const woDate = new Date(wo.scheduledDate);
      woDate.setHours(0, 0, 0, 0);
      
      if (filterDateFrom) {
        const fromDate = new Date(filterDateFrom);
        fromDate.setHours(0, 0, 0, 0);
        if (woDate < fromDate) matchDate = false;
      }
      
      if (filterDateTo) {
        const toDate = new Date(filterDateTo);
        toDate.setHours(23, 59, 59, 999);
        if (woDate > toDate) matchDate = false;
      }

      return matchSearch && matchStatus && matchDate;
    });
  }, [visibleWorkOrders, search, filterStatus, filterDateFrom, filterDateTo]);

  // Stats - computed from visibleWorkOrders
  const total = visibleWorkOrders.length;
  const planned = visibleWorkOrders.filter((w) => w.status === "planned").length;
  const inProgress = visibleWorkOrders.filter((w) => w.status === "in_progress").length;
  const completed = visibleWorkOrders.filter((w) => w.status === "completed").length;
  const cancelled = visibleWorkOrders.filter((w) => w.status === "cancelled").length;

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

  const handleEdit = (workOrder: any) => {
    setEditingWorkOrder(workOrder);
    setEditFormOpen(true);
  };

  const handleUpdate = async (id: string, payload: any) => {
    setEditing(true);
    try {
      await updateWorkOrder(id, payload);
      setEditFormOpen(false);
      setEditingWorkOrder(null);
    } catch (err: any) {
      console.error("Update work order error:", err);
      alert(err?.response?.data?.message || "Failed to update work order");
    } finally {
      setEditing(false);
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
    setFilterDateFrom("");
    setFilterDateTo("");
  };

  const hasActiveFilters = 
    search !== "" || 
    filterStatus !== "all" || 
    filterPlant !== "all" || 
    filterDateFrom !== "" || 
    filterDateTo !== "";

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

      {/* Stats - No plant filter here, just shows the current data */}
      <WorkOrderStats
        total={total}
        planned={planned}
        inProgress={inProgress}
        completed={completed}
        cancelled={cancelled}
        isLoading={loading}
        currentPlantName={getCurrentPlantNameForStats}
      />

      {/* Filters - With date range */}
      <WorkOrderFilters
        search={search}
        onSearchChange={setSearch}
        filterStatus={filterStatus}
        onStatusChange={setFilterStatus}
        filterPlant={filterPlant}
        onPlantChange={setFilterPlant}
        filterDateFrom={filterDateFrom}
        onDateFromChange={setFilterDateFrom}
        filterDateTo={filterDateTo}
        onDateToChange={setFilterDateTo}
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
        isAdmin={isAdmin}
        isSupervisor={isSupervisor}
        executeRouteBase={executeRouteBase}
        onNavigate={navigate}
        onEdit={handleEdit}
        onDelete={handleDelete}
        canDelete={canDelete}
        canEdit={canEdit}
        getPlantName={getPlantName}
      />

      {/* Edit Work Order Modal */}
      {editingWorkOrder && (
        <EditWorkOrderForm
          isOpen={editFormOpen}
          onOpenChange={setEditFormOpen}
          workOrder={editingWorkOrder}
          onSubmit={handleUpdate}
          saving={editing}
          isSuperAdmin={isSuperAdmin}
          isAdmin={isAdmin}
          plants={plants}
          adminPlantName={adminPlantName}
          getPlantName={getPlantName}
        />
      )}
    </div>
  );
};

export default CreateWorkOrder;