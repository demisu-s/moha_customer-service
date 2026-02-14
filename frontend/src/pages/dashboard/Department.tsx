import { useEffect, useState } from "react";

import CreateDepartmentModal from "../../components/CreateDepartmentModal";
import EditDepartmentModal from "../../components/EditDepartmentModal";

import { PlantPayload, DepartmentPayload } from "../../api/global.types";
import { usePlantContext } from "../../context/PlantContext";
import { useDepartmentContext } from "../../context/DepartmentContext";
import { useUserContext } from "../../context/UserContext";

const Department = () => {
  const { plants, refreshPlants } = usePlantContext();
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
  const [showDeptModal, setShowDeptModal] = useState(false);

  /* 🔹 Load plants */
  useEffect(() => {
    refreshPlants();
  }, [refreshPlants]);

  /* 🔹 Auto-select plant based on logged-in user's department */
  useEffect(() => {
    if (!currentUser?.department?.plant || plants.length === 0) return;

    const userPlant = plants.find(
      (p) =>
        typeof currentUser.department?.plant !== "string" &&
        p._id === currentUser.department?.plant?._id
    );

    if (userPlant) {
      setSelectedPlant(userPlant);
      refreshDepartments(userPlant._id);
    }
  }, [currentUser, plants, refreshDepartments]);

  return (
    <div className="p-6">
      <div className="flex justify-between mb-4">
        <h1 className="text-3xl font-bold">
          {selectedPlant
            ? `${selectedPlant.name} Departments`
            : "Departments"}
        </h1>

        {selectedPlant && (
          <button
            className="bg-black text-white px-4 py-2 rounded"
            onClick={() => setShowDeptModal(true)}
          >
            + Create Department
          </button>
        )}
      </div>

      {/* 🔹 Departments Table */}
      {selectedPlant && (
        <table className="w-full border">
          <thead>
            <tr className="bg-gray-200">
              <th>No</th>
              <th>Name</th>
              <th>Floor</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {departments.length > 0 ? (
              departments.map((d, i) => (
                <tr key={d._id}>
                  <td>{i + 1}</td>
                  <td>{d.name}</td>
                  <td>{d.floor}</td>
                  <td className="flex gap-2">
                    <button
                      className="text-blue-600"
                      onClick={() => setEditDepartment(d)}
                    >
                      Edit
                    </button>
                    <button
                      className="text-red-600"
                      onClick={async () => {
                        await deleteDepartmentHandler(d._id);
                        refreshDepartments(selectedPlant._id);
                      }}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="text-center py-4 text-gray-500">
                  No departments found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}

      {/* 🔹 Create Department */}
      {showDeptModal && selectedPlant && (
        <CreateDepartmentModal
          plantId={selectedPlant._id}
          onClose={() => setShowDeptModal(false)}
          onCreated={() => refreshDepartments(selectedPlant._id)}
        />
      )}

      {/* 🔹 Edit Department */}
      {editDepartment && selectedPlant && (
        <EditDepartmentModal
          department={editDepartment}
          onClose={() => setEditDepartment(null)}
          onUpdated={() => {
            refreshDepartments(selectedPlant._id);
            setEditDepartment(null);
          }}
        />
      )}
    </div>
  );
};

export default Department;
