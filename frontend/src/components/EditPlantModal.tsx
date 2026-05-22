import { useState } from "react";
import { usePlantContext } from "../context/PlantContext";

import LoadingDialog from "./ui/LoadingDialog";
import SuccessDialog from "./ui/SuccessDialog";
import ErrorDialog from "./ui/ErrorDialog";

const EditPlantModal = ({
  plant,
  onClose,
}: any) => {
  const { updatePlantHandler } =
    usePlantContext();

  const [form, setForm] = useState({
    name: plant.name,
    city: plant.city,
    area: plant.area,
  });

  const [loading, setLoading] =
    useState(false);

  const [successOpen, setSuccessOpen] =
    useState(false);

  const [errorOpen, setErrorOpen] =
    useState(false);

  const [errorMessage, setErrorMessage] =
    useState("");

  const submit = async () => {
    try {
      setLoading(true);

      await updatePlantHandler(
        plant._id,
        form
      );

      setSuccessOpen(true);

      setTimeout(() => {
        onClose();
      }, 1200);

    } catch (error: any) {

      setErrorMessage(
        error?.message ||
          "Failed to update plant."
      );

      setErrorOpen(true);

    } finally {

      setLoading(false);
    }
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
        <div className="bg-white p-6 rounded w-96">
          <h2 className="text-xl font-bold mb-4">
            Edit Plant
          </h2>

          {["name", "city", "area"].map((f) => (
            <input
              key={f}
              className="w-full border p-2 mb-3"
              value={(form as any)[f]}
              onChange={(e) =>
                setForm({
                  ...form,
                  [f]: e.target.value,
                })
              }
            />
          ))}

          <div className="flex justify-end gap-2">
            <button onClick={onClose}>
              Cancel
            </button>

            <button
              onClick={submit}
              className="
                bg-blue-600 text-white
                px-4 py-2 rounded
              "
            >
              Update
            </button>
          </div>
        </div>
      </div>

      <LoadingDialog
        open={loading}
        message="Updating plant..."
      />

      <SuccessDialog
        open={successOpen}
        onOpenChange={setSuccessOpen}
        message="Plant updated successfully."
      />

      <ErrorDialog
        open={errorOpen}
        onOpenChange={setErrorOpen}
        message={errorMessage}
      />
    </>
  );
};

export default EditPlantModal;