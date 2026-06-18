// components/EditPlantModal.tsx
import { useState } from "react";
import { X } from "lucide-react";
import { usePlantContext } from "../context/PlantContext";

import LoadingDialog from "./ui/LoadingDialog";
import SuccessDialog from "./ui/SuccessDialog";
import ErrorDialog from "./ui/ErrorDialog";

const EditPlantModal = ({
  plant,
  onClose,
  onUpdated,
}: any) => {
  const { updatePlantHandler } =
    usePlantContext();

  const [form, setForm] = useState({
    name: plant.name,
    city: plant.city || "",
    area: plant.area || "",
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

      if (onUpdated) await onUpdated();

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
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 relative animate-in fade-in zoom-in duration-200">
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute right-4 top-4 rounded-lg p-1 text-dark-600 hover:bg-gray-100 transition"
          >
            <X size={20} />
          </button>

          <h2 className="text-2xl font-bold text-dark-200 mb-2">
            Edit Plant
          </h2>
          <p className="text-sm text-dark-600 mb-6">
            Update plant information
          </p>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-dark-200 mb-1">
                Plant Name *
              </label>
              <input
                className="w-full border border-gray-200 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition"
                value={form.name}
                onChange={(e) =>
                  setForm({
                    ...form,
                    name: e.target.value,
                  })
                }
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-dark-200 mb-1">
                City
              </label>
              <input
                className="w-full border border-gray-200 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition"
                value={form.city}
                onChange={(e) =>
                  setForm({
                    ...form,
                    city: e.target.value,
                  })
                }
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-dark-200 mb-1">
                Area
              </label>
              <input
                className="w-full border border-gray-200 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition"
                value={form.area}
                onChange={(e) =>
                  setForm({
                    ...form,
                    area: e.target.value,
                  })
                }
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 mt-6">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-dark-600 hover:bg-gray-100 rounded-lg transition"
            >
              Cancel
            </button>

            <button
              onClick={submit}
              disabled={!form.name.trim()}
              className="bg-primary-700 text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-primary-800 transition shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Update Plant
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