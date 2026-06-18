// pages/Department.tsx
import { useEffect, useState } from "react";
import {
  Plus,
  Pencil,
  Trash2,
  Building2,
  Search,
} from "lucide-react";

import CreateDepartmentModal from "../../components/CreateDepartmentModal";
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
import { useUserContext } from "../../context/UserContext";

const Department = () => {
  const { plants, refreshPlants } =
    usePlantContext();

  const {
    departments,
    refreshDepartments,
    deleteDepartmentHandler,
  } = useDepartmentContext();

  const { currentUser } = useUserContext();

  const [selectedPlant, setSelectedPlant] =
    useState<PlantPayload | null>(null);

  const [editDepartment, setEditDepartment] =
    useState<DepartmentPayload | null>(null);

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
    if (
      !currentUser?.department?.plant ||
      plants.length === 0
    )
      return;

    const userPlant = plants.find(
      (p) =>
        typeof currentUser.department
          ?.plant !== "string" &&
        p._id ===
          currentUser.department?.plant?._id
    );

    if (userPlant) {
      setSelectedPlant(userPlant);

      refreshDepartments(userPlant._id);
    }
  }, [
    currentUser,
    plants,
    refreshDepartments,
  ]);

  const showSuccess = (msg: string) => {
    setMessage(msg);
    setSuccessOpen(true);
  };

  const showError = (msg: string) => {
    setMessage(msg);
    setErrorOpen(true);
  };

  const handleDelete = async (
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

  const filteredDepartments = departments.filter((dept) =>
    dept.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    dept.block?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    dept.floor?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-dark-200">
            {selectedPlant
              ? `${selectedPlant.name} Departments`
              : "Departments"}
          </h1>

          <p className="mt-1 text-sm text-dark-600">
            {selectedPlant
              ? `Manage departments for ${selectedPlant.name}`
              : "Manage plant departments"}
          </p>
        </div>

        {selectedPlant && (
          <button
            onClick={() => setShowDeptModal(true)}
            className="flex items-center gap-2 rounded-xl bg-primary-500 px-5 py-3 text-sm font-medium text-white transition hover:bg-primary-800 shadow-lg hover:shadow-xl"
          >
            <Plus size={18} />
            Create Department
          </button>
        )}
      </div>

      {/* TABLE */}
      {selectedPlant && (
        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
          <div className="border-b border-gray-100 p-5 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center gap-2">
              <Building2 className="text-primary-500" size={20} />
              <h2 className="text-lg font-semibold text-dark-200">
                Department List
              </h2>
              <span className="ml-2 rounded-full bg-primary-100 px-3 py-0.5 text-sm text-primary-600">
                {departments.length}
              </span>
            </div>

            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-dark-600" size={16} />
              <input
                type="text"
                placeholder="Search departments..."
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
                {filteredDepartments.map(
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
                              handleDelete(
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

                {filteredDepartments.length === 0 && (
                  <tr>
                    <td
                      colSpan={5}
                      className="py-12 text-center text-dark-600"
                    >
                      {searchTerm ? "No departments match your search" : "No departments found for this plant"}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {filteredDepartments.length > 0 && (
            <div className="border-t border-gray-100 px-6 py-3 text-xs text-dark-600">
              Showing {filteredDepartments.length} of {departments.length} departments
            </div>
          )}
        </div>
      )}

      {/* MODALS */}
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

export default Department;