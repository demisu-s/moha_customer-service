import { useEffect, useState } from "react";
import {
  Plus,
  Pencil,
  Trash2,
  ArrowLeft,
  Factory,
  Building2,
} from "lucide-react";

import CreatePlantModal from "../../components/CreatePlantModal";
import CreateDepartmentModal from "../../components/CreateDepartmentModal";
import EditPlantModal from "../../components/EditPlantModal";
import EditDepartmentModal from "../../components/EditDepartmentModal";

import LoadingDialog from "../../components/ui/LoadingDialog";
import SuccessDialog from "../../components/ui/SuccessDialog";
import ErrorDialog from "../../components/ui/ErrorDialog";

import {
  PlantPayload,
  DepartmentPayload,
} from "../../api/global.types";

import { usePlantContext } from "../../context/PlantContext";
import { useDepartmentContext } from "../../context/DepartmentContext";

const Plants = () => {
  const {
    plants,
    refreshPlants,
    deletePlantHandler,
  } = usePlantContext();

  const {
    departments,
    refreshDepartments,
    deleteDepartmentHandler,
  } = useDepartmentContext();

  const [selectedPlant, setSelectedPlant] =
    useState<PlantPayload | null>(null);

  const [editPlant, setEditPlant] =
    useState<PlantPayload | null>(null);

  const [editDepartment, setEditDepartment] =
    useState<DepartmentPayload | null>(null);

  const [showPlantModal, setShowPlantModal] =
    useState(false);

  const [showDeptModal, setShowDeptModal] =
    useState(false);

  const [loading, setLoading] = useState(false);
  const [successOpen, setSuccessOpen] =
    useState(false);
  const [errorOpen, setErrorOpen] =
    useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    refreshPlants();
  }, [refreshPlants]);

  useEffect(() => {
    if (selectedPlant) {
      refreshDepartments(selectedPlant._id);
    }
  }, [selectedPlant, refreshDepartments]);

  const showSuccess = (msg: string) => {
    setMessage(msg);
    setSuccessOpen(true);
  };

  const showError = (msg: string) => {
    setMessage(msg);
    setErrorOpen(true);
  };

  const handleDeletePlant = async (
    id: string
  ) => {
    try {
      setLoading(true);

      await deletePlantHandler(id);
      await refreshPlants();

      showSuccess(
        "Plant deleted successfully"
      );
    } catch (err: any) {
      showError(err?.message || "Delete failed");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteDepartment = async (
    id: string
  ) => {
    if (!selectedPlant) return;

    try {
      setLoading(true);

      await deleteDepartmentHandler(id);

      await refreshDepartments(
        selectedPlant._id
      );

      showSuccess(
        "Department deleted successfully"
      );
    } catch (err: any) {
      showError(err?.message || "Delete failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">
            {selectedPlant
              ? `${selectedPlant.name} Departments`
              : "Plants Management"}
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Manage plants and departments
          </p>
        </div>

        {!selectedPlant ? (
          <button
            onClick={() => setShowPlantModal(true)}
            className="flex items-center gap-2 rounded-xl bg-black px-5 py-3 text-sm font-medium text-white transition hover:bg-gray-800"
          >
            <Plus size={18} />
            Create Plant
          </button>
        ) : (
          <button
            onClick={() => setShowDeptModal(true)}
            className="flex items-center gap-2 rounded-xl bg-black px-5 py-3 text-sm font-medium text-white transition hover:bg-gray-800"
          >
            <Plus size={18} />
            Create Department
          </button>
        )}
      </div>

      {/* Back Button */}
      {selectedPlant && (
        <button
          onClick={() => setSelectedPlant(null)}
          className="mb-5 flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-800"
        >
          <ArrowLeft size={16} />
          Back to Plants
        </button>
      )}

      {/* Plants Table */}
      {!selectedPlant && (
        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
          <div className="border-b p-5">
            <div className="flex items-center gap-2">
              <Factory className="text-gray-700" />

              <h2 className="text-lg font-semibold">
                Plants List
              </h2>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b bg-gray-50/80 text-left">
                <tr>
                  <th className="px-6 py-4 text-sm font-semibold text-gray-600">
                    #
                  </th>

                  <th className="px-6 py-4 text-sm font-semibold text-gray-600">
                    Name
                  </th>

                  <th className="px-6 py-4 text-sm font-semibold text-gray-600">
                    City
                  </th>

                  <th className="px-6 py-4 text-sm font-semibold text-gray-600">
                    Area
                  </th>

                  <th className="px-6 py-4 text-sm font-semibold text-gray-600">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody>
                {plants.map((plant, index) => (
                  <tr
                    key={plant._id}
                    className="border-b border-gray-100 transition duration-200 hover:bg-gray-50"
                  >
                    <td className="px-6 py-4">
                      {index + 1}
                    </td>

                    <td
                      onClick={() =>
                        setSelectedPlant(plant)
                      }
                      className="cursor-pointer px-6 py-4 font-medium text-blue-600 hover:underline"
                    >
                      {plant.name}
                    </td>

                    <td className="px-6 py-4">
                      {plant.city}
                    </td>

                    <td className="px-6 py-4">
                      {plant.area}
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <button
                          onClick={() =>
                            setEditPlant(plant)
                          }
                          className="text-gray-500 transition duration-200 hover:text-blue-600"
                        >
                          <Pencil size={18} />
                        </button>

                        <button
                          onClick={() =>
                            handleDeletePlant(
                              plant._id
                            )
                          }
                          className="text-gray-500 transition duration-200 hover:text-red-600"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}

                {plants.length === 0 && (
                  <tr>
                    <td
                      colSpan={5}
                      className="py-10 text-center text-gray-400"
                    >
                      No plants found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Departments Table */}
      {selectedPlant && (
        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
          <div className="border-b p-5">
            <div className="flex items-center gap-2">
              <Building2 className="text-gray-700" />

              <h2 className="text-lg font-semibold">
                Departments List
              </h2>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b bg-gray-50/80 text-left">
                <tr>
                  <th className="px-6 py-4 text-sm font-semibold text-gray-600">
                    #
                  </th>

                  <th className="px-6 py-4 text-sm font-semibold text-gray-600">
                    Name
                  </th>

                  <th className="px-6 py-4 text-sm font-semibold text-gray-600">
                    Block
                  </th>

                  <th className="px-6 py-4 text-sm font-semibold text-gray-600">
                    Floor
                  </th>

                  <th className="px-6 py-4 text-sm font-semibold text-gray-600">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody>
                {departments.map(
                  (department, index) => (
                    <tr
                      key={department._id}
                      className="border-b border-gray-100 transition duration-200 hover:bg-gray-50"
                    >
                      <td className="px-6 py-4">
                        {index + 1}
                      </td>

                      <td className="px-6 py-4 font-medium">
                        {department.name}
                      </td>

                      <td className="px-6 py-4">
                        {department.block}
                      </td>

                      <td className="px-6 py-4">
                        {department.floor}
                      </td>

                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4">
                          <button
                            onClick={() =>
                              setEditDepartment(
                                department
                              )
                            }
                            className="text-gray-500 transition duration-200 hover:text-blue-600"
                          >
                            <Pencil size={18} />
                          </button>

                          <button
                            onClick={() =>
                              handleDeleteDepartment(
                                department._id
                              )
                            }
                            className="text-gray-500 transition duration-200 hover:text-red-600"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* MODALS */}
      {showPlantModal && (
        <CreatePlantModal
          onClose={() =>
            setShowPlantModal(false)
          }
          onCreated={refreshPlants}
        />
      )}

      {showDeptModal && selectedPlant && (
        <CreateDepartmentModal
          plantId={selectedPlant._id}
          onClose={() =>
            setShowDeptModal(false)
          }
          onCreated={() =>
            refreshDepartments(
              selectedPlant._id
            )
          }
        />
      )}

      {editPlant && (
        <EditPlantModal
          plant={editPlant}
          onClose={() => setEditPlant(null)}
          onUpdated={refreshPlants}
        />
      )}

      {editDepartment && selectedPlant && (
        <EditDepartmentModal
          department={editDepartment}
          onClose={() =>
            setEditDepartment(null)
          }
          onUpdated={() =>
            refreshDepartments(
              selectedPlant._id
            )
          }
        />
      )}

      <LoadingDialog
        open={loading}
        message="Processing..."
      />

      <SuccessDialog
        open={successOpen}
        onOpenChange={setSuccessOpen}
        message={message}
      />

      <ErrorDialog
        open={errorOpen}
        onOpenChange={setErrorOpen}
        message={message}
      />
    </div>
  );
};

export default Plants;