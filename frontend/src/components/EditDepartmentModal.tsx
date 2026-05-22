import { useState } from "react";
import { useDepartmentContext } from "../context/DepartmentContext";

import LoadingDialog from "./ui/LoadingDialog";
import SuccessDialog from "./ui/SuccessDialog";
import ErrorDialog from "./ui/ErrorDialog";

const EditDepartmentModal = ({
  department,
  onClose,
  onUpdated,
}: any) => {
  const { updateDepartmentHandler } =
    useDepartmentContext();

  const [form, setForm] = useState({
    name: department.name,
    block: department.block || "",
    floor: department.floor || "",
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

      await updateDepartmentHandler(
        department._id,
        form
      );

      await onUpdated();

      setSuccessOpen(true);

      setTimeout(() => {
        onClose();
      }, 1200);

    } catch (error: any) {

      setErrorMessage(
        error?.message ||
          "Failed to update department."
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
            Edit Department
          </h2>

          {["name", "block", "floor"].map((f) => (
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
        message="Updating department..."
      />

      <SuccessDialog
        open={successOpen}
        onOpenChange={setSuccessOpen}
        message="Department updated successfully."
      />

      <ErrorDialog
        open={errorOpen}
        onOpenChange={setErrorOpen}
        message={errorMessage}
      />
    </>
  );
};

export default EditDepartmentModal;