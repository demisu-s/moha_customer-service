import { useState } from "react";
import { useDepartmentContext } from "../context/DepartmentContext";

const CreateDepartmentModal = ({ plantId, onClose, onCreated }: any) => {
  const { addDepartment } = useDepartmentContext();

  const [form, setForm] = useState({
    name: "",
    block: "",
    floor: "",
  });

  const submit = async () => {
    await addDepartment({
      ...form,
      plant: plantId,
    });
    onCreated();
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
      <div className="bg-white p-6 rounded w-96">
        <h2 className="text-xl font-bold mb-4">Create Department</h2>

        <input
          placeholder="Department name"
          className="w-full border p-2 mb-3"
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
        <input
          placeholder="Block"
          className="w-full border p-2 mb-3"
          onChange={(e) => setForm({ ...form, block: e.target.value })}
        />
        <input
          placeholder="Floor"
          className="w-full border p-2 mb-3"
          onChange={(e) => setForm({ ...form, floor: e.target.value })}
        />

        <div className="flex justify-end gap-2">
          <button onClick={onClose}>Cancel</button>
          <button
            onClick={submit}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateDepartmentModal;
