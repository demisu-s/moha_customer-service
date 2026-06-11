import React, { useState, memo } from "react";
import { CheckCircleIcon, ClockIcon, AlertCircleIcon } from "lucide-react";
import { StepRow } from "./StepRow";

interface TaskCardProps {
  task: any;
  workOrderId: string;
  onCompleteStep: (taskId: string, stepNumber: number, notes?: string) => Promise<void>;
  onCompleteTask: (taskId: string, duration?: number) => Promise<void>;
}

export const TaskCard = memo<TaskCardProps>(({
  task,
  workOrderId,
  onCompleteStep,
  onCompleteTask,
}) => {
  const [actualDuration, setActualDuration] = useState<number | "">(
    task.actualDuration || ""
  );
  const [saving, setSaving] = useState(false);
  const [expanded, setExpanded] = useState(!task.isCompleted);
  const [error, setError] = useState<string | null>(null);

  const completedSteps = task.procedures.filter((s: any) => s.isCompleted).length;
  const totalSteps = task.procedures.length;
  const progress = totalSteps > 0 ? Math.round((completedSteps / totalSteps) * 100) : 0;

  const handleCompleteTask = async () => {
    if (!actualDuration && task.estimatedDuration) {
      if (!confirm("No duration entered. Use estimated duration?")) {
        return;
      }
    }
    setSaving(true);
    setError(null);
    try {
      await onCompleteTask(task._id, actualDuration || task.estimatedDuration || undefined);
    } catch (err: any) {
      setError(err?.response?.data?.message || err.message || "Failed to complete task");
      setTimeout(() => setError(null), 3000);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div
      className={`border rounded-xl overflow-hidden transition-all duration-300 ${
        task.isCompleted 
          ? "border-green-300 shadow-sm" 
          : error
            ? "border-red-300"
            : "border-gray-200 hover:shadow-lg"
      }`}
    >
      <button
        onClick={() => setExpanded((v) => !v)}
        className={`w-full flex items-center justify-between px-6 py-4 text-left transition-colors ${
          task.isCompleted 
            ? "bg-gradient-to-r from-green-50 to-emerald-50 hover:from-green-100" 
            : error
              ? "bg-red-50 hover:bg-red-100"
              : "bg-gray-50 hover:bg-gray-100"
        }`}
      >
        <div className="flex items-center gap-3">
          <div
            className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 transition-all ${
              task.isCompleted 
                ? "bg-green-500 text-white shadow-md" 
                : "border-2 border-gray-300"
            }`}
          >
            {task.isCompleted && <CheckCircleIcon className="w-4 h-4" />}
          </div>
          <div className="text-left">
            <p className={`font-semibold text-lg ${task.isCompleted ? "text-gray-500 line-through" : "text-gray-800"}`}>
              {task.taskName}
            </p>
            {task.description && (
              <p className="text-sm text-gray-500 mt-0.5">{task.description}</p>
            )}
          </div>
        </div>
        <div className="flex items-center gap-6 text-right">
          {task.estimatedDuration && (
            <div className="flex items-center gap-1 text-xs text-gray-500">
              <ClockIcon className="w-3 h-3" />
              <span>Est. {task.estimatedDuration} min</span>
            </div>
          )}
          <div className="flex items-center gap-2">
            <div className="text-sm font-medium text-gray-600">
              {completedSteps}/{totalSteps} steps
            </div>
            <div className="text-gray-400 text-sm transition-transform duration-200">
              {expanded ? "▼" : "▲"}
            </div>
          </div>
        </div>
      </button>

      {totalSteps > 0 && (
        <div className="h-1.5 bg-gray-100">
          <div
            className="h-1.5 bg-gradient-to-r from-green-400 to-green-500 transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}

      {error && (
        <div className="px-6 pt-3">
          <div className="bg-red-50 rounded-lg p-2 flex items-center gap-2 text-sm text-red-700">
            <AlertCircleIcon className="w-4 h-4" />
            <span>{error}</span>
          </div>
        </div>
      )}

      {expanded && (
        <div className="px-6 py-5 space-y-4 bg-white">
          {task.procedures.length === 0 ? (
            <div className="text-center py-8 text-gray-400 italic">
              No procedure steps defined for this task.
            </div>
          ) : (
            task.procedures.map((step: any) => (
              <StepRow
                key={step.stepNumber}
                step={step}
                taskId={task._id}
                workOrderId={workOrderId}
                disabled={task.isCompleted}
                onComplete={(stepNum, notes) =>
                  onCompleteStep(task._id, stepNum, notes)
                }
              />
            ))
          )}

          {!task.isCompleted && (
            <div className="border-t pt-5 mt-4">
              <div className="flex items-center gap-4 flex-wrap">
                <div className="flex items-center gap-3">
                  <label className="text-sm font-medium text-gray-700">
                    Actual Duration:
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      min={1}
                      value={actualDuration}
                      onChange={(e) =>
                        setActualDuration(e.target.value ? Number(e.target.value) : "")
                      }
                      placeholder={task.estimatedDuration ? String(task.estimatedDuration) : "Enter minutes"}
                      className="w-32 border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 pl-7"
                    />
                    <span className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400 text-sm">
                      ⏱️
                    </span>
                  </div>
                  <span className="text-xs text-gray-500">minutes</span>
                </div>
                <button
                  onClick={handleCompleteTask}
                  disabled={saving}
                  className="ml-auto bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-2 rounded-lg text-sm font-medium hover:from-green-700 hover:to-emerald-700 transition-all shadow-md hover:shadow-lg disabled:opacity-50 flex items-center gap-2"
                >
                  {saving ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Completing Task...
                    </>
                  ) : (
                    <>
                      <CheckCircleIcon className="w-4 h-4" />
                      Mark Task Complete
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {task.isCompleted && task.completedAt && (
            <div className="bg-green-50 rounded-lg p-3 mt-3 flex items-center gap-2 text-sm text-green-700">
              <CheckCircleIcon className="w-4 h-4" />
              <span>
                Completed at {new Date(task.completedAt).toLocaleString()}
                {task.actualDuration && ` · Took ${task.actualDuration} minutes`}
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
});

TaskCard.displayName = "TaskCard";