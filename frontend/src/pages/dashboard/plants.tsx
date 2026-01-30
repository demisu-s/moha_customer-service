import { useEffect, useState } from "react";

import CreatePlantModal from "../../components/CreatePlantModal";
import CreateDepartmentModal from "../../components/CreateDepartmentModal";
import EditPlantModal from "../../components/EditPlantModal";
import EditDepartmentModal from "../../components/EditDepartmentModal";

import { PlantPayload, DepartmentPayload } from "../../api/global.types";
import { usePlantContext } from "../../context/PlantContext";
import { useDepartmentContext } from "../../context/DepartmentContext";

const Plants = () => {
  /* 🔹 CONTEXTS */
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

  const [selectedPlant, setSelectedPlant] = useState<PlantPayload | null>(null);

  const [editPlant, setEditPlant] = useState<PlantPayload | null>(null);
  const [editDepartment, setEditDepartment] =
    useState<DepartmentPayload | null>(null);

  const [showPlantModal, setShowPlantModal] = useState(false);
  const [showDeptModal, setShowDeptModal] = useState(false);

  /* 🔹 Load plants on mount */
  useEffect(() => {
    refreshPlants();
  }, [refreshPlants]);

  /* 🔹 Load departments when plant changes */
  useEffect(() => {
    if (selectedPlant) {
      refreshDepartments(selectedPlant._id);
    }
  }, [selectedPlant, refreshDepartments]);

  return (
    <div className="p-6">
      <div className="flex justify-between mb-4">
        <h1 className="text-3xl font-bold">
          {selectedPlant ? `${selectedPlant.name} Departments` : "Plants"}
        </h1>

        {!selectedPlant && (
          <button
            className="bg-black text-white px-4 py-2 rounded"
            onClick={() => setShowPlantModal(true)}
          >
            + Create Plant
          </button>
        )}

        {selectedPlant && (
          <button
            className="bg-black text-white px-4 py-2 rounded"
            onClick={() => setShowDeptModal(true)}
          >
            + Create Department
          </button>
        )}
      </div>

      {/* PLANTS TABLE */}
      {!selectedPlant && (
        <table className="w-full border">
          <thead>
            <tr className="bg-gray-200">
              <th>No</th>
              <th>Name</th>
              <th>Area</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {plants.map((p, i) => (
              <tr key={p._id}>
                <td>{i + 1}</td>
                <td
                  className="cursor-pointer text-blue-600"
                  onClick={() => setSelectedPlant(p)}
                >
                  {p.name}
                </td>
                <td>{p.area}</td>
                <td className="flex gap-2">
                  <button
                    className="text-blue-600"
                    onClick={() => setEditPlant(p)}
                  >
                    Edit
                  </button>
                  <button
                    className="text-red-600"
                    onClick={async () => {
                      await deletePlantHandler(p._id);
                      refreshPlants();
                    }}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* DEPARTMENTS TABLE */}
      {selectedPlant && (
        <>
          <button
            onClick={() => setSelectedPlant(null)}
            className="mb-4 text-blue-600"
          >
            ← Back
          </button>

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
              {departments.map((d, i) => (
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
                        if (selectedPlant) {
                          refreshDepartments(selectedPlant._id);
                        }
                      }}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}

      {/* MODALS */}
      {showPlantModal && (
        <CreatePlantModal
          onClose={() => setShowPlantModal(false)}
          onCreated={refreshPlants}
        />
      )}

      {showDeptModal && selectedPlant && (
        <CreateDepartmentModal
          plantId={selectedPlant._id}
          onClose={() => setShowDeptModal(false)}
          onCreated={() => refreshDepartments(selectedPlant._id)}
        />
      )}

      {editPlant && (
        <EditPlantModal
          plant={editPlant}
          onClose={() => setEditPlant(null)}
          onUpdated={async () => {
            await refreshPlants();
            setSelectedPlant(null);
            setEditPlant(null);
          }}
        />
      )}

      {editDepartment && selectedPlant && (
        <EditDepartmentModal
          department={editDepartment}
          onClose={() => setEditDepartment(null)}
          onUpdated={async () => {
            refreshDepartments(selectedPlant._id);
            setEditDepartment(null);
          }}
        />
      )}
    </div>
  );
};

export default Plants;
