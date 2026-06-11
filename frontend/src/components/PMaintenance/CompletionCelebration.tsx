import React from "react";

interface CompletionCelebrationProps {
  workOrder: any;
  onBack: () => void;
}

export const CompletionCelebration: React.FC<CompletionCelebrationProps> = ({ workOrder, onBack }) => {
  return (
    <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-8 text-center animate-fadeIn">
      <div className="text-5xl mb-3">🎉</div>
      <p className="text-2xl font-bold text-green-800 mb-2">Work Order Completed!</p>
      <p className="text-green-600 mb-4">
        All tasks have been successfully completed.
      </p>
      {workOrder.completedDate && (
        <p className="text-sm text-green-600 mb-4">
          Completed on {new Date(workOrder.completedDate).toLocaleString()}
        </p>
      )}
      <button
        onClick={onBack}
        className="mt-2 text-green-700 font-medium hover:text-green-900 underline flex items-center gap-1 mx-auto"
      >
        Return to Work Orders →
      </button>
    </div>
  );
};