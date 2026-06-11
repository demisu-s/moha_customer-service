import React, { memo } from "react";
import { BuildingIcon, UserIcon, CalendarIcon, ClockIcon, PlayIcon, XCircleIcon, CheckCircleIcon, AlertCircleIcon } from "lucide-react";

interface WorkOrderHeaderProps {
  workOrder: any;
  statusSaving: boolean;
  onStatusChange: (status: string) => Promise<void>;
}

const statusConfig: Record<string, { color: string; icon: React.ComponentType<{ className?: string }>; label: string }> = {
  planned: { color: "bg-yellow-100 text-yellow-800", icon: ClockIcon, label: "Planned" },
  in_progress: { color: "bg-blue-100 text-blue-800", icon: PlayIcon, label: "In Progress" },
  completed: { color: "bg-green-100 text-green-800", icon: CheckCircleIcon, label: "Completed" },
  cancelled: { color: "bg-red-100 text-red-800", icon: XCircleIcon, label: "Cancelled" },
};

const priorityConfig: Record<string, { color: string; icon: React.ComponentType<{ className?: string }> | null; label: string }> = {
  low: { color: "bg-gray-100 text-gray-600", icon: null, label: "Low" },
  medium: { color: "bg-blue-100 text-blue-700", icon: null, label: "Medium" },
  high: { color: "bg-orange-100 text-orange-700", icon: AlertCircleIcon, label: "High" },
  critical: { color: "bg-red-100 text-red-700", icon: AlertCircleIcon, label: "Critical" },
};

export const WorkOrderHeader = memo<WorkOrderHeaderProps>(({
  workOrder,
  statusSaving,
  onStatusChange,
}) => {
  const CurrentStatusIcon = statusConfig[workOrder.status]?.icon || ClockIcon;
  const PriorityIcon = priorityConfig[workOrder.priority]?.icon;

  const getPlantDisplayName = () => {
    if (!workOrder.plant) return "N/A";
    if (typeof workOrder.plant === 'object' && workOrder.plant !== null) {
      return workOrder.plant.name || "N/A";
    }
    return workOrder.plant;
  };

  const getCreatedByName = () => {
    if (!workOrder.createdBy) return "Unknown";
    if (typeof workOrder.createdBy === 'object' && workOrder.createdBy !== null) {
      return `${workOrder.createdBy.firstName || ''} ${workOrder.createdBy.lastName || ''}`.trim() || "Unknown";
    }
    return workOrder.createdBy;
  };

  const completedTasks = workOrder.tasks?.filter((t: any) => t.isCompleted).length || 0;
  const totalTasks = workOrder.tasks?.length || 0;
  const overallProgress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  return (
    <div className="bg-white border rounded-xl shadow-lg overflow-hidden">
      <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 border-b">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-3xl font-bold text-gray-800">{workOrder.title}</h1>
              <div className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${statusConfig[workOrder.status]?.color}`}>
                <CurrentStatusIcon className="w-3 h-3" />
                {statusConfig[workOrder.status]?.label}
              </div>
            </div>
            {workOrder.description && (
              <p className="text-gray-600 mt-1">{workOrder.description}</p>
            )}
          </div>

          {workOrder.status !== "completed" && workOrder.status !== "cancelled" && (
            <select
              value={workOrder.status}
              onChange={(e) => onStatusChange(e.target.value)}
              disabled={statusSaving}
              className="border rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white"
            >
              <option value="planned">📋 Planned</option>
              <option value="in_progress">▶️ In Progress</option>
              <option value="completed">✅ Completed</option>
              <option value="cancelled">❌ Cancelled</option>
            </select>
          )}
        </div>
      </div>

      <div className="px-6 py-4 grid grid-cols-2 md:grid-cols-4 gap-4 bg-white">
        <div className="flex items-center gap-2">
          <BuildingIcon className="w-4 h-4 text-gray-400" />
          <div>
            <p className="text-xs text-gray-500">Plant</p>
            <p className="text-sm font-medium">{getPlantDisplayName()}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <UserIcon className="w-4 h-4 text-gray-400" />
          <div>
            <p className="text-xs text-gray-500">Created By</p>
            <p className="text-sm font-medium">{getCreatedByName()}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <CalendarIcon className="w-4 h-4 text-gray-400" />
          <div>
            <p className="text-xs text-gray-500">Scheduled Date</p>
            <p className="text-sm font-medium">
              {workOrder.scheduledDate ? new Date(workOrder.scheduledDate).toLocaleDateString() : "N/A"}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {PriorityIcon && <PriorityIcon className="w-4 h-4 text-gray-400" />}
          <div>
            <p className="text-xs text-gray-500">Priority</p>
            <p className={`text-sm font-medium ${priorityConfig[workOrder.priority]?.color || "text-gray-600"}`}>
              {priorityConfig[workOrder.priority]?.label || workOrder.priority || "Medium"}
            </p>
          </div>
        </div>
      </div>

      {workOrder.recurrence && workOrder.recurrence !== "none" && (
        <div className="px-6 py-3 bg-blue-50 border-t border-blue-100">
          <div className="flex items-center gap-2 text-sm text-blue-700">
            <span>🔄</span>
            <span>Recurring: {workOrder.recurrence}</span>
            {workOrder.cycles && workOrder.cycles > 0 && (
              <span>· {workOrder.cycles} cycle{workOrder.cycles !== 1 ? 's' : ''}</span>
            )}
          </div>
        </div>
      )}

      <div className="px-6 py-4 border-t">
        <div className="flex justify-between text-sm text-gray-600 mb-2">
          <span className="font-medium">Overall Progress</span>
          <div className="flex items-center gap-2">
            <span>{completedTasks}/{totalTasks} tasks completed</span>
            <span className="font-bold text-primary-600">{overallProgress}%</span>
          </div>
        </div>
        <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-3 bg-gradient-to-r from-primary-500 to-primary-600 rounded-full transition-all duration-500 relative"
            style={{ width: `${overallProgress}%` }}
          >
            {overallProgress > 0 && (
              <div className="absolute inset-0 bg-white opacity-20 animate-pulse" />
            )}
          </div>
        </div>
      </div>
    </div>
  );
});

WorkOrderHeader.displayName = "WorkOrderHeader";