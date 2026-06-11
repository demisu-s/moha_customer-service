import React, { useEffect, useState, useCallback, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeftIcon } from "lucide-react";
import { usePMWO } from "../../../context/PMWOContext";
import { useUserContext } from "../../../context/UserContext";
import { getPMWorkOrderById } from "../../../api/preventiveMaintenance.api";
import { TaskCard } from "../../../components/PMaintenance/TaskCard";
import { ConfirmDialog } from "../../../components/PMaintenance/ConfirmDialog";
import { WorkOrderHeader } from "../../../components/PMaintenance/WorkOrderHeader";
import { CompletionCelebration } from "../../../components/PMaintenance/CompletionCelebration";

const ExecuteWorkOrder: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { workOrders, markStepComplete, markTaskComplete, changeStatus, refreshWorkOrders, loading } = usePMWO();
  const { currentUser } = useUserContext();

  const [workOrder, setWorkOrder] = useState<any>(null);
  const [statusSaving, setStatusSaving] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [pendingStatus, setPendingStatus] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const isMounted = useRef(true);
  const initialLoadDone = useRef(false);

  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

  const getPlanPmRoute = useCallback(() => {
    if (currentUser?.role === "admin") return "/admin-dashboard/work-orders";
    if (currentUser?.role === "supervisor") return "/supervisor-dashboard/work-orders";
    return "/dashboard/work-orders";
  }, [currentUser?.role]);

  // Initial load - find work order from context or fetch directly
  useEffect(() => {
    if (initialLoadDone.current) return;
    
    const loadWorkOrder = async () => {
      setIsLoading(true);
      try {
        // First try to find in existing workOrders from context
        let found = workOrders.find((wo) => wo._id === id);
        
        if (found && isMounted.current) {
          setWorkOrder(found);
          initialLoadDone.current = true;
          setIsLoading(false);
          return;
        }
        
        // If not found in context, fetch directly from API
        if (id && isMounted.current) {
          const response = await getPMWorkOrderById(id);
          if (isMounted.current && response) {
            setWorkOrder(response);
            initialLoadDone.current = true;
          }
        }
      } catch (error) {
        console.error("Failed to load work order:", error);
      } finally {
        if (isMounted.current) {
          setIsLoading(false);
        }
      }
    };

    if (id) {
      loadWorkOrder();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]); // Only depend on id, not workOrders

  // Update local workOrder when workOrders array changes (from context updates)
  useEffect(() => {
    if (id && workOrders.length > 0 && initialLoadDone.current) {
      const updated = workOrders.find((wo) => wo._id === id);
      if (updated && JSON.stringify(updated) !== JSON.stringify(workOrder)) {
        setWorkOrder(updated);
      }
    }
  }, [workOrders, id, workOrder]);

  const updateLocalWorkOrder = useCallback((updater: (prev: any) => any) => {
    if (isMounted.current) {
      setWorkOrder(updater);
    }
  }, []);

  const handleCompleteStep = useCallback(async (taskId: string, stepNumber: number, notes?: string) => {
    if (!workOrder) return;
    
    const previousState = { ...workOrder };
    
    // Optimistically update local state
    updateLocalWorkOrder((prev) => {
      const updated = { ...prev };
      const task = updated.tasks?.find((t: any) => t._id === taskId);
      if (task) {
        const step = task.procedures?.find((s: any) => s.stepNumber === stepNumber);
        if (step && !step.isCompleted) {
          step.isCompleted = true;
          step.completedAt = new Date().toISOString();
          if (notes) step.notes = notes;
        }
        
        const allStepsCompleted = task.procedures?.every((s: any) => s.isCompleted);
        if (allStepsCompleted && !task.isCompleted) {
          task.isCompleted = true;
          task.completedAt = new Date().toISOString();
        }
      }
      return updated;
    });
    
    try {
      await markStepComplete(workOrder._id, taskId, stepNumber, notes);
      // Refresh context to get latest data
      await refreshWorkOrders();
    } catch (error) {
      console.error("Failed to complete step:", error);
      updateLocalWorkOrder(() => previousState);
      alert("Failed to complete step. Please try again.");
    }
  }, [workOrder, markStepComplete, refreshWorkOrders, updateLocalWorkOrder]);

  const handleCompleteTask = useCallback(async (taskId: string, duration?: number) => {
    if (!workOrder) return;
    
    const previousState = { ...workOrder };
    
    updateLocalWorkOrder((prev) => {
      const updated = { ...prev };
      const task = updated.tasks?.find((t: any) => t._id === taskId);
      if (task && !task.isCompleted) {
        task.isCompleted = true;
        task.completedAt = new Date().toISOString();
        if (duration) task.actualDuration = duration;
        
        task.procedures?.forEach((step: any) => {
          if (!step.isCompleted) {
            step.isCompleted = true;
            step.completedAt = new Date().toISOString();
            step.notes = "Auto-completed due to task completion";
          }
        });
      }
      
      const allTasksCompleted = updated.tasks?.every((t: any) => t.isCompleted);
      if (allTasksCompleted && updated.status !== "completed") {
        updated.status = "completed";
        updated.completedDate = new Date().toISOString();
      } else if (updated.status === "planned") {
        updated.status = "in_progress";
      }
      
      return updated;
    });
    
    try {
      await markTaskComplete(workOrder._id, taskId, duration);
      await refreshWorkOrders();
    } catch (error) {
      console.error("Failed to complete task:", error);
      updateLocalWorkOrder(() => previousState);
      alert("Failed to complete task. Please try again.");
    }
  }, [workOrder, markTaskComplete, refreshWorkOrders, updateLocalWorkOrder]);

  const handleStatusChange = useCallback(async (newStatus: string) => {
    if (!workOrder) return;
    
    const completedTasks = workOrder.tasks?.filter((t: any) => t.isCompleted).length || 0;
    const totalTasks = workOrder.tasks?.length || 0;
    const overallProgress = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

    if (newStatus === "completed" && overallProgress < 100) {
      setPendingStatus(newStatus);
      setShowConfirmDialog(true);
      return;
    }
    
    const previousStatus = workOrder.status;
    updateLocalWorkOrder((prev) => ({ ...prev, status: newStatus }));
    setStatusSaving(true);
    
    try {
      await changeStatus(workOrder._id, newStatus);
      await refreshWorkOrders();
    } catch (error) {
      console.error("Failed to change status:", error);
      updateLocalWorkOrder((prev) => ({ ...prev, status: previousStatus }));
      alert("Failed to change status. Please try again.");
    } finally {
      setStatusSaving(false);
    }
  }, [workOrder, changeStatus, refreshWorkOrders, updateLocalWorkOrder]);

  const confirmStatusChange = useCallback(async () => {
    if (!workOrder) return;
    
    setShowConfirmDialog(false);
    setStatusSaving(true);
    try {
      await changeStatus(workOrder._id, pendingStatus);
      await refreshWorkOrders();
    } catch (error) {
      console.error("Failed to change status:", error);
      alert("Failed to change status. Please try again.");
    } finally {
      setStatusSaving(false);
    }
  }, [workOrder, changeStatus, refreshWorkOrders, pendingStatus]);

  const handleBackToPlanPM = useCallback(() => {
    navigate(getPlanPmRoute());
  }, [navigate, getPlanPmRoute]);

  // Show loading only during initial load
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mb-4"></div>
        <p className="text-gray-500">Loading work order details...</p>
      </div>
    );
  }

  if (!workOrder) {
    return (
      <div className="flex flex-col items-center justify-center h-96">
        <p className="text-gray-500">Work order not found</p>
        <button onClick={handleBackToPlanPM} className="mt-4 text-primary-500 hover:underline">
          Return to Work Orders
        </button>
      </div>
    );
  }

  const completedTasks = workOrder.tasks?.filter((t: any) => t.isCompleted).length || 0;
  const totalTasks = workOrder.tasks?.length || 0;
  const incompleteTasks = totalTasks - completedTasks;

  return (
    <div className="max-w-4xl mx-auto space-y-6 px-4 pb-20">
      <ConfirmDialog
        isOpen={showConfirmDialog}
        onClose={() => setShowConfirmDialog(false)}
        onConfirm={confirmStatusChange}
        incompleteTasksCount={incompleteTasks}
      />

      <button
        onClick={handleBackToPlanPM}
        className="group text-sm text-gray-500 hover:text-gray-800 flex items-center gap-2 transition-all hover:translate-x-[-2px]"
      >
        <ArrowLeftIcon className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        Back to Work Orders
      </button>

      <WorkOrderHeader
        workOrder={workOrder}
        statusSaving={statusSaving}
        onStatusChange={handleStatusChange}
      />

      {workOrder.notes && (
        <div className="bg-amber-50 border-l-4 border-amber-400 rounded-lg p-4">
          <div className="flex items-start gap-2">
            <span className="text-amber-600">📝</span>
            <div>
              <p className="text-xs font-semibold text-amber-700 uppercase tracking-wide">Work Order Notes</p>
              <p className="text-sm text-amber-800 mt-1">{workOrder.notes}</p>
            </div>
          </div>
        </div>
      )}

      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-800">Tasks to Complete</h2>
          {completedTasks === totalTasks && totalTasks > 0 && workOrder.status !== "completed" && (
            <div className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1">
              <span>✓</span>
              All Tasks Complete!
            </div>
          )}
        </div>

        {!workOrder.tasks || workOrder.tasks.length === 0 ? (
          <div className="text-center py-16 text-gray-400 border-2 border-dashed rounded-xl">
            <div className="text-4xl mb-2">📋</div>
            <p>No tasks defined for this work order.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {workOrder.tasks.map((task: any) => (
              <TaskCard
                key={task._id}
                task={task}
                workOrderId={workOrder._id}
                onCompleteStep={handleCompleteStep}
                onCompleteTask={handleCompleteTask}
              />
            ))}
          </div>
        )}
      </div>

      {workOrder.status === "completed" && (
        <CompletionCelebration workOrder={workOrder} onBack={handleBackToPlanPM} />
      )}

      <style>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-slideDown {
          animation: slideDown 0.2s ease-out;
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out;
        }
      `}</style>
    </div>
  );
};

export default ExecuteWorkOrder;