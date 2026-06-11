import React, { useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";

interface ProcedureStep {
  stepNumber: number;
  description: string;
}

interface TaskForm {
  id: string;
  taskName: string;
  description: string;
  estimatedDuration: number | "";
  procedures: ProcedureStep[];
}

interface CreateWorkOrderFormProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: any) => Promise<void>;
  saving: boolean;
  isSuperAdmin: boolean;
  isAdmin: boolean;
  plants: any[];
  adminPlantName: string;
  getPlantName: (plant: any) => string;
}

const emptyTask = (): TaskForm => ({
  id: crypto.randomUUID(),
  taskName: "",
  description: "",
  estimatedDuration: "",
  procedures: [{ stepNumber: 1, description: "" }],
});

export const CreateWorkOrderForm: React.FC<CreateWorkOrderFormProps> = ({
  isOpen,
  onOpenChange,
  onSubmit,
  saving,
  isSuperAdmin,
  isAdmin,
  plants,
  adminPlantName,
  getPlantName,
}) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [selectedPlant, setSelectedPlant] = useState("");
  const [scheduledDate, setScheduledDate] = useState("");
  const [priority, setPriority] = useState("medium");
  const [recurrence, setRecurrence] = useState("none");
  const [cycles, setCycles] = useState(1);
  const [notes, setNotes] = useState("");
  const [tasks, setTasks] = useState<TaskForm[]>([emptyTask()]);

  const addTask = () => setTasks((p) => [...p, emptyTask()]);
  const removeTask = (id: string) => setTasks((p) => p.filter((t) => t.id !== id));
  const updateTask = (id: string, field: keyof TaskForm, value: any) =>
    setTasks((p) => p.map((t) => (t.id === id ? { ...t, [field]: value } : t)));

  const addStep = (taskId: string) =>
    setTasks((p) =>
      p.map((t) =>
        t.id === taskId
          ? {
              ...t,
              procedures: [
                ...t.procedures,
                { stepNumber: t.procedures.length + 1, description: "" },
              ],
            }
          : t
      )
    );

  const removeStep = (taskId: string, stepNumber: number) =>
    setTasks((p) =>
      p.map((t) =>
        t.id === taskId
          ? {
              ...t,
              procedures: t.procedures
                .filter((s) => s.stepNumber !== stepNumber)
                .map((s, i) => ({ ...s, stepNumber: i + 1 })),
            }
          : t
      )
    );

  const updateStep = (taskId: string, stepNumber: number, value: string) =>
    setTasks((p) =>
      p.map((t) =>
        t.id === taskId
          ? {
              ...t,
              procedures: t.procedures.map((s) =>
                s.stepNumber === stepNumber ? { ...s, description: value } : s
              ),
            }
          : t
      )
    );

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setSelectedPlant("");
    setScheduledDate("");
    setPriority("medium");
    setRecurrence("none");
    setCycles(1);
    setNotes("");
    setTasks([emptyTask()]);
  };

  const handleSubmit = async () => {
    if (!title.trim()) return alert("Title is required");
    if (!scheduledDate) return alert("Scheduled date is required");
    if (isSuperAdmin && !selectedPlant) return alert("Please select a plant");

    const payload: any = {
      title: title.trim(),
      description,
      scheduledDate,
      priority,
      recurrence,
      cycles,
      notes,
      tasks: tasks.map(({ taskName, description, estimatedDuration, procedures }) => ({
        taskName,
        description,
        estimatedDuration: estimatedDuration || undefined,
        procedures: procedures.filter((s) => s.description.trim()),
      })),
    };

    if (isSuperAdmin) {
      payload.plant = selectedPlant;
    }

    await onSubmit(payload);
    resetForm();
    onOpenChange(false);
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={onOpenChange}>
      <Dialog.Trigger asChild>
        <button className="bg-primary-500 text-white px-5 py-2 rounded-lg hover:bg-primary-700 font-medium">
          + New Work Order
        </button>
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50 z-40" />
        <Dialog.Content className="fixed top-1/2 left-1/2 w-full max-w-3xl -translate-x-1/2 -translate-y-1/2 bg-white rounded-xl p-6 z-50 max-h-[90vh] overflow-y-auto shadow-xl">
          <Dialog.Close asChild>
            <button className="absolute top-4 right-5 text-2xl text-gray-400 hover:text-gray-700">×</button>
          </Dialog.Close>

          <h2 className="text-2xl font-bold mb-1">Plan Work Order</h2>
          <p className="text-gray-500 text-sm mb-6">Define what will be done and when</p>

          <div className="space-y-5">
            {/* Basic Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-1">Work Order Title *</label>
                <input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Server Room Cleaning"
                  className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-1">Description</label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>

              {/* SuperAdmin: plant dropdown */}
              {isSuperAdmin && (
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-1">Plant *</label>
                  <select
                    value={selectedPlant}
                    onChange={(e) => setSelectedPlant(e.target.value)}
                    className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="">— Select a plant —</option>
                    {plants.map((p: any) => (
                      <option key={p._id} value={p._id}>
                        {p.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Admin: show their plant as read-only */}
              {!isSuperAdmin && (
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-1">Plant</label>
                  <input
                    disabled
                    value={adminPlantName}
                    className="w-full border rounded-lg px-3 py-2 bg-gray-100 text-gray-500"
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-medium mb-1">Scheduled Date *</label>
                <input
                  type="date"
                  value={scheduledDate}
                  onChange={(e) => setScheduledDate(e.target.value)}
                  className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Priority</label>
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)}
                  className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="critical">Critical</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Recurrence</label>
                <select
                  value={recurrence}
                  onChange={(e) => setRecurrence(e.target.value)}
                  className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="none">None</option>
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                </select>
              </div>

              {recurrence !== "none" && (
                <div>
                  <label className="block text-sm font-medium mb-1">Cycles</label>
                  <input
                    type="number"
                    min={1}
                    value={cycles}
                    onChange={(e) => setCycles(Number(e.target.value))}
                    className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
              )}

              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-1">Notes</label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
            </div>

            {/* Tasks */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-semibold">Tasks & Procedures</h3>
                <button
                  onClick={addTask}
                  className="text-sm text-primary-600 hover:underline font-medium"
                >
                  + Add Task
                </button>
              </div>

              <div className="space-y-4">
                {tasks.map((task, tIdx) => (
                  <div key={task.id} className="border rounded-lg p-4 bg-gray-50">
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide mt-2">
                        Task {tIdx + 1}
                      </span>
                      {tasks.length > 1 && (
                        <button
                          onClick={() => removeTask(task.id)}
                          className="text-red-400 hover:text-red-600 text-sm"
                        >
                          Remove
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
                      <div className="md:col-span-2">
                        <label className="block text-xs font-medium mb-1">Task Name *</label>
                        <input
                          value={task.taskName}
                          onChange={(e) => updateTask(task.id, "taskName", e.target.value)}
                          placeholder="e.g. Clean server room"
                          className="w-full border rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-medium mb-1">Description</label>
                        <input
                          value={task.description}
                          onChange={(e) => updateTask(task.id, "description", e.target.value)}
                          className="w-full border rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-medium mb-1">Est. Duration (min)</label>
                        <input
                          type="number"
                          min={1}
                          value={task.estimatedDuration}
                          onChange={(e) =>
                            updateTask(
                              task.id,
                              "estimatedDuration",
                              e.target.value ? Number(e.target.value) : ""
                            )
                          }
                          placeholder="e.g. 30"
                          className="w-full border rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                        />
                      </div>
                    </div>

                    {/* Steps */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                          Procedure Steps
                        </label>
                        <button
                          onClick={() => addStep(task.id)}
                          className="text-xs text-primary-600 hover:underline"
                        >
                          + Add Step
                        </button>
                      </div>

                      <div className="space-y-2">
                        {task.procedures.map((step) => (
                          <div key={step.stepNumber} className="flex items-center gap-2">
                            <span className="w-6 h-6 flex items-center justify-center rounded-full bg-primary-100 text-primary-700 text-xs font-bold flex-shrink-0">
                              {step.stepNumber}
                            </span>
                            <input
                              value={step.description}
                              onChange={(e) =>
                                updateStep(task.id, step.stepNumber, e.target.value)
                              }
                              placeholder={`Step ${step.stepNumber} description`}
                              className="flex-1 border rounded-lg px-3 py-1.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                            />
                            {task.procedures.length > 1 && (
                              <button
                                onClick={() => removeStep(task.id, step.stepNumber)}
                                className="text-red-400 hover:text-red-600 text-xs px-1"
                              >
                                ✕
                              </button>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <Dialog.Close asChild>
                <button className="border px-5 py-2 rounded-lg text-gray-600 hover:bg-gray-50">
                  Cancel
                </button>
              </Dialog.Close>
              <button
                onClick={handleSubmit}
                disabled={saving}
                className="bg-primary-500 text-white px-6 py-2 rounded-lg hover:bg-primary-700 disabled:opacity-50 font-medium"
              >
                {saving ? "Saving..." : "Create Work Order"}
              </button>
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};