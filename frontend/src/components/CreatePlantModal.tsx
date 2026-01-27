import { useState } from "react";
import { createPlant } from "../api/plant.api";

const CreatePlantModal = ({ onClose, onCreated }: any) => {
  const [form, setForm] = useState({
    name: "",
    city: "",
    area: "",
  });

  const submit = async () => {
    await createPlant(form);
    onCreated();
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
      <div className="bg-white p-6 rounded w-96">
        <h2 className="text-xl font-bold mb-4">Create Plant</h2>

        {["name", "city", "area"].map((f) => (
          <input
            key={f}
            placeholder={f}
            className="w-full border p-2 mb-3"
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
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreatePlantModal;
