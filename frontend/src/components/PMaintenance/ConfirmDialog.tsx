import React from "react";
import { AlertCircleIcon } from "lucide-react";

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  incompleteTasksCount: number;
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  incompleteTasksCount,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 max-w-md mx-4 shadow-2xl">
        <div className="flex items-center gap-3 mb-4">
          <AlertCircleIcon className="w-6 h-6 text-yellow-600" />
          <h3 className="text-lg font-semibold">Incomplete Tasks</h3>
        </div>
        <p className="text-gray-600 mb-6">
          This work order has {incompleteTasksCount} incomplete task{incompleteTasksCount !== 1 ? 's' : ''}. 
          Marking it as completed now will close it with pending tasks. Are you sure?
        </p>
        <div className="flex gap-3 justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 border rounded-lg hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            Complete Anyway
          </button>
        </div>
      </div>
    </div>
  );
};