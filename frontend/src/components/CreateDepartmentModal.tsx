import { useState } from "react";
import { useDepartmentContext } from "../context/DepartmentContext";

import LoadingDialog from "./ui/LoadingDialog";
import SuccessDialog from "./ui/SuccessDialog";
import ErrorDialog from "./ui/ErrorDialog";

const CreateDepartmentModal = ({
  plantId,
  onClose,
  onCreated,
}: any) => {
  const { addDepartment } =
    useDepartmentContext();

  const [form, setForm] = useState({
    name: "",
    block: "",
    floor: "",
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

      await addDepartment({
        ...form,
        plant: plantId,
      });

      await onCreated();

      setSuccessOpen(true);

      setTimeout(() => {
        onClose();
      }, 1200);

    } catch (error: any) {

      setErrorMessage(
        error?.message ||
          "Failed to create department."
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
            Create Department
          </h2>

          <input
            placeholder="Department name"
            className="w-full border p-2 mb-3"
            onChange={(e) =>
              setForm({
                ...form,
                name: e.target.value,
              })
            }
          />

          <input
            placeholder="Block"
            className="w-full border p-2 mb-3"
            onChange={(e) =>
              setForm({
                ...form,
                block: e.target.value,
              })
            }
          />

          <input
            placeholder="Floor"
            className="w-full border p-2 mb-3"
            onChange={(e) =>
              setForm({
                ...form,
                floor: e.target.value,
              })
            }
          />

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
              Save
            </button>
          </div>
        </div>
      </div>

      <LoadingDialog
        open={loading}
        message="Creating department..."
      />

      <SuccessDialog
        open={successOpen}
        onOpenChange={setSuccessOpen}
        message="Department created successfully."
      />

      <ErrorDialog
        open={errorOpen}
        onOpenChange={setErrorOpen}
        message={errorMessage}
      />
    </>
  );
};

export default CreateDepartmentModal;