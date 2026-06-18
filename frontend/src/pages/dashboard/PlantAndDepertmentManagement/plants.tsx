// pages/Plants.tsx
import { useEffect, useState } from "react";
import {
  Plus,
  Pencil,
  Trash2,
  ArrowLeft,
  Factory,
  Building2,
  Search,
} from "lucide-react";

import CreatePlantModal from "../../../components/Modals/CreatePlantModal";
import CreateDepartmentModal from "../../../components/Modals/CreateDepartmentModal";
import EditPlantModal from "../../../components/Modals/EditPlantModal";
import EditDepartmentModal from "../../../components/Modals/EditDepartmentModal";

import LoadingDialog from "../../../components/ui/LoadingDialog";
import SuccessDialog from "../../../components/ui/SuccessDialog";
import ErrorDialog from "../../../components/ui/ErrorDialog";

import {
  PlantPayload,
  DepartmentPayload,
} from "../../../api/global.types";

import { usePlantContext } from "../../../context/PlantContext";
import { useDepartmentContext } from "../../../context/DepartmentContext";

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
  const [searchTerm, setSearchTerm] = useState("");

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

  const filteredPlants = plants.filter((plant) =>
    plant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    plant.city?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    plant.area?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-dark-200">
            {selectedPlant
              ? `${selectedPlant.name} Departments`
              : "Plants Management"}
          </h1>

          <p className="mt-1 text-sm text-dark-600">
            {selectedPlant
              ? `Manage departments for ${selectedPlant.name}`
              : "Manage plants and departments across your organization"}
          </p>
        </div>

        {!selectedPlant ? (
          <button
            onClick={() => setShowPlantModal(true)}
            className="flex items-center gap-2 rounded-xl bg-primary-500 px-5 py-3 text-sm font-medium text-white transition hover:bg-primary-800 shadow-lg hover:shadow-xl"
          >
            <Plus size={18} />
            Create Plant
          </button>
        ) : (
          <button
            onClick={() => setShowDeptModal(true)}
            className="flex items-center gap-2 rounded-xl bg-primary-500 px-5 py-3 text-sm font-medium text-white transition hover:bg-primary-800 shadow-lg hover:shadow-xl"
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
          className="mb-5 flex items-center gap-2 text-sm font-medium text-primary-500 hover:text-primary-600 transition"
        >
          <ArrowLeft size={16} />
          Back to Plants
        </button>
      )}

      {/* Plants Table */}
      {!selectedPlant && (
        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
          <div className="border-b border-gray-100 p-5 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center gap-2">
              <Factory className="text-primary-500" size={20} />
              <h2 className="text-lg font-semibold text-dark-200">
                Plants List
              </h2>
              <span className="ml-2 rounded-full bg-primary-100 px-3 py-0.5 text-sm text-primary-600">
                {plants.length}
              </span>
            </div>

            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-dark-600" size={16} />
              <input
                type="text"
                placeholder="Search plants..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent w-full md:w-64"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-gray-100 bg-gray-50/80 text-left">
                <tr>
                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-dark-600">
                    #
                  </th>

                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-dark-600">
                    Name
                  </th>

                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-dark-600">
                    City
                  </th>

                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-dark-600">
                    Area
                  </th>

                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-dark-600">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody>
                {filteredPlants.map((plant, index) => (
                  <tr
                    key={plant._id}
                    className="border-b border-gray-100 transition duration-200 hover:bg-primary-50/50"
                  >
                    <td className="px-6 py-4 text-sm text-dark-600">
                      {index + 1}
                    </td>

                    <td
                      onClick={() =>
                        setSelectedPlant(plant)
                      }
                      className="cursor-pointer px-6 py-4 font-medium text-primary-600 hover:text-primary-700 hover:underline transition"
                    >
                      {plant.name}
                    </td>

                    <td className="px-6 py-4 text-sm text-dark-600">
                      {plant.city || "—"}
                    </td>

                    <td className="px-6 py-4 text-sm text-dark-600">
                      {plant.area || "—"}
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() =>
                            setEditPlant(plant)
                          }
                          className="rounded-lg p-2 text-dark-600 transition hover:bg-primary-100 hover:text-primary-600"
                          title="Edit Plant"
                        >
                          <Pencil size={16} />
                        </button>

                        <button disabled
                          onClick={() =>
                            handleDeletePlant(
                              plant._id
                            )
                          }
                          className="rounded-lg p-2 text-dark-600 transition hover:bg-red-50 hover:text-red-600"
                          title="Delete Plant"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}

                {filteredPlants.length === 0 && (
                  <tr>
                    <td
                      colSpan={5}
                      className="py-12 text-center text-dark-600"
                    >
                      {searchTerm ? "No plants match your search" : "No plants found. Create your first plant!"}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {filteredPlants.length > 0 && (
            <div className="border-t border-gray-100 px-6 py-3 text-xs text-dark-600">
              Showing {filteredPlants.length} of {plants.length} plants
            </div>
          )}
        </div>
      )}

      {/* Departments Table */}
      {selectedPlant && (
        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
          <div className="border-b border-gray-100 p-5 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center gap-2">
              <Building2 className="text-primary-500" size={20} />
              <h2 className="text-lg font-semibold text-dark-200">
                Departments List
              </h2>
              <span className="ml-2 rounded-full bg-primary-100 px-3 py-0.5 text-sm text-primary-600">
                {departments.length}
              </span>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-gray-100 bg-gray-50/80 text-left">
                <tr>
                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-dark-600">
                    #
                  </th>

                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-dark-600">
                    Name
                  </th>

                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-dark-600">
                    Block
                  </th>

                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-dark-600">
                    Floor
                  </th>

                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-dark-600">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody>
                {departments.map(
                  (department, index) => (
                    <tr
                      key={department._id}
                      className="border-b border-gray-100 transition duration-200 hover:bg-primary-50/50"
                    >
                      <td className="px-6 py-4 text-sm text-dark-600">
                        {index + 1}
                      </td>

                      <td className="px-6 py-4 font-medium text-dark-200">
                        {department.name}
                      </td>

                      <td className="px-6 py-4 text-sm text-dark-600">
                        {department.block || "—"}
                      </td>

                      <td className="px-6 py-4 text-sm text-dark-600">
                        {department.floor || "—"}
                      </td>

                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() =>
                              setEditDepartment(
                                department
                              )
                            }
                            className="rounded-lg p-2 text-dark-600 transition hover:bg-primary-100 hover:text-primary-600"
                            title="Edit Department"
                          >
                            <Pencil size={16} />
                          </button>

                          <button disabled
                            onClick={() =>
                              handleDeleteDepartment(
                                department._id
                              )
                            }
                            className="rounded-lg p-2 text-dark-600 transition hover:bg-red-50 hover:text-red-600"
                            title="Delete Department"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                )}

                {departments.length === 0 && (
                  <tr>
                    <td
                      colSpan={5}
                      className="py-12 text-center text-dark-600"
                    >
                      No departments found for this plant
                    </td>
                  </tr>
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