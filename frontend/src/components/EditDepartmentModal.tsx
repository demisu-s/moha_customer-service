import { useState } from "react";
import { useDepartmentContext } from "../context/DepartmentContext";

const EditDepartmentModal = ({ department, onClose, onUpdated }: any) => {
  const { updateDepartmentHandler } = useDepartmentContext();

  const [form, setForm] = useState({
    name: department.name,
    block: department.block || "",
    floor: department.floor || "",
  });

  const submit = async () => {
    await updateDepartmentHandler(department._id, form);
    onUpdated();
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
      <div className="bg-white p-6 rounded w-96">
        <h2 className="text-xl font-bold mb-4">Edit Department</h2>

        {["name", "block", "floor"].map((f) => (
          <input
            key={f}
            className="w-full border p-2 mb-3"
            value={(form as any)[f]}
            onChange={(e) =>
              setForm({ ...form, [f]: e.target.value })
            }
          />
        ))}

        <div className="flex justify-end gap-2">
          <button onClick={onClose}>Cancel</button>
          <button
            onClick={submit}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            Update
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditDepartmentModal;
