import { useState } from "react";
import { usePlantContext } from "../context/PlantContext";

const EditPlantModal = ({ plant, onClose }: any) => {
  const { updatePlantHandler } = usePlantContext();

  const [form, setForm] = useState({
    name: plant.name,
    city: plant.city,
    area: plant.area,
  });

  const submit = async () => {
    await updatePlantHandler(plant._id, form);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
      <div className="bg-white p-6 rounded w-96">
        <h2 className="text-xl font-bold mb-4">Edit Plant</h2>

        {["name", "city", "area"].map((f) => (
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

export default EditPlantModal;
