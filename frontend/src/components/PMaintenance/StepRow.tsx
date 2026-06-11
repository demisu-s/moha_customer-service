import React, { useState, memo } from "react";
import { CheckCircleIcon, ClockIcon, AlertCircleIcon } from "lucide-react";

interface StepRowProps {
  step: any;
  taskId: string;
  workOrderId: string;
  onComplete: (stepNumber: number, notes?: string) => Promise<void>;
  disabled: boolean;
}

export const StepRow = memo<StepRowProps>(({ step, onComplete, disabled }) => {
  const [notes, setNotes] = useState(step.notes || "");
  const [showNotes, setShowNotes] = useState(false);
  const [saving, setSaving] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleComplete = async () => {
    setSaving(true);
    setError(null);
    try {
      await onComplete(step.stepNumber, notes || undefined);
      setShowNotes(false);
    } catch (err: any) {
      setError(err?.response?.data?.message || err.message || "Failed to complete step");
      setTimeout(() => setError(null), 3000);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div
      className={`border rounded-lg p-4 transition-all duration-200 ${
        step.isCompleted 
          ? "bg-gradient-to-r from-green-50 to-emerald-50 border-green-200" 
          : error
            ? "bg-red-50 border-red-300"
            : "bg-white border-gray-200 hover:shadow-md"
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex items-start gap-4">
        <div
          className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-sm font-bold transition-all ${
            step.isCompleted
              ? "bg-green-500 text-white shadow-lg shadow-green-200"
              : "bg-gray-100 text-gray-600 border-2 border-gray-200"
          }`}
        >
          {step.isCompleted ? <CheckCircleIcon className="w-5 h-5" /> : step.stepNumber}
        </div>

        <div className="flex-1 min-w-0">
          <p className={`text-base ${step.isCompleted ? "line-through text-gray-500" : "text-gray-800 font-medium"}`}>
            {step.description}
          </p>

          {step.isCompleted && step.completedAt && (
            <div className="flex items-center gap-2 mt-2 text-xs text-green-600">
              <ClockIcon className="w-3 h-3" />
              <span>Completed at {new Date(step.completedAt).toLocaleTimeString()}</span>
              {step.notes && (
                <>
                  <span>·</span>
                  <span className="italic">"{step.notes}"</span>
                </>
              )}
            </div>
          )}

          {error && (
            <div className="mt-2 text-xs text-red-600 flex items-center gap-1">
              <AlertCircleIcon className="w-3 h-3" />
              <span>{error}</span>
            </div>
          )}

          {!step.isCompleted && showNotes && (
            <div className="mt-3 animate-slideDown">
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Add work notes (optional)..."
                rows={2}
                className="mt-2 w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
          )}
        </div>

        {!step.isCompleted && (
          <div className="flex gap-2 flex-shrink-0">
            <button
              onClick={() => setShowNotes((v) => !v)}
              className={`text-xs px-3 py-1.5 rounded transition-all ${
                showNotes 
                  ? "bg-gray-100 text-gray-700" 
                  : "text-gray-500 hover:bg-gray-100"
              }`}
            >
              {showNotes ? "Hide Notes" : "Add Note"}
            </button>
            <button
              onClick={handleComplete}
              disabled={disabled || saving}
              className={`text-xs px-4 py-1.5 rounded transition-all ${
                isHovered && !saving && !error
                  ? "bg-primary-600 scale-105"
                  : error
                    ? "bg-gray-400"
                    : "bg-primary-500"
              } text-white shadow-sm hover:shadow disabled:opacity-40`}
            >
              {saving ? (
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Processing...</span>
                </div>
              ) : (
                "Complete ✓"
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
});

StepRow.displayName = "StepRow";