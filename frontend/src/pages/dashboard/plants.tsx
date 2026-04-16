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
  const { plants, refreshPlants, deletePlantHandler } = usePlantContext();
  const { departments, refreshDepartments, deleteDepartmentHandler } =
    useDepartmentContext();

  const [selectedPlant, setSelectedPlant] = useState<PlantPayload | null>(null);

  const [editPlant, setEditPlant] = useState<PlantPayload | null>(null);
  const [editDepartment, setEditDepartment] =
    useState<DepartmentPayload | null>(null);

  const [showPlantModal, setShowPlantModal] = useState(false);
  const [showDeptModal, setShowDeptModal] = useState(false);

  /* 🔹 Load plants */
  useEffect(() => {
    refreshPlants();
  }, []);

  /* 🔹 Load departments */
  useEffect(() => {
    if (selectedPlant) {
      refreshDepartments(selectedPlant._id);
    }
  }, [selectedPlant]);

  return (
    <div className="p-6">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">
          {selectedPlant ? `${selectedPlant.name} Departments` : "Plants"}
        </h1>

        {!selectedPlant ? (
          <button
            className="bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition"
            onClick={() => setShowPlantModal(true)}
          >
            + Create Plant
          </button>
        ) : (
          <button
            className="bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition"
            onClick={() => setShowDeptModal(true)}
          >
            + Create Department
          </button>
        )}
      </div>

      {/* PLANTS TABLE */}
      {!selectedPlant && (
        <div className="bg-white shadow-md rounded-xl overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-gray-100 text-gray-600 text-sm uppercase">
              <tr>
                <th className="px-6 py-3">No</th>
                <th className="px-6 py-3">Name</th>
                <th className="px-6 py-3">Area</th>
                <th className="px-6 py-3 text-right">Actions</th>
              </tr>
            </thead>

            <tbody className="text-gray-700">
              {plants.map((p, i) => (
                <tr
                  key={p._id}
                  className="border-t hover:bg-gray-50 transition"
                >
                  <td className="px-6 py-4">{i + 1}</td>

                  <td
                    className="px-6 py-4 text-blue-600 cursor-pointer hover:underline"
                    onClick={() => setSelectedPlant(p)}
                  >
                    {p.name}
                  </td>

                  <td className="px-6 py-4">{p.area}</td>

                  <td className="px-6 py-4 text-right space-x-3">
                    <button
                      className="text-blue-600 hover:underline"
                      onClick={() => setEditPlant(p)}
                    >
                      Edit
                    </button>

                    <button
                      className="text-red-600 hover:underline"
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

              {plants.length === 0 && (
                <tr>
                  <td
                    colSpan={4}
                    className="text-center py-6 text-gray-400"
                  >
                    No plants found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* DEPARTMENTS TABLE */}
      {selectedPlant && (
        <>
          <button
            onClick={() => setSelectedPlant(null)}
            className="mb-4 text-blue-600 hover:underline"
          >
            ← Back to Plants
          </button>

          <div className="bg-white shadow-md rounded-xl overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-gray-100 text-gray-600 text-sm uppercase">
                <tr>
                  <th className="px-6 py-3">No</th>
                  <th className="px-6 py-3">Name</th>
                  <th className="px-6 py-3">Floor</th>
                  <th className="px-6 py-3 text-right">Actions</th>
                </tr>
              </thead>

              <tbody className="text-gray-700">
                {departments.map((d, i) => (
                  <tr
                    key={d._id}
                    className="border-t hover:bg-gray-50 transition"
                  >
                    <td className="px-6 py-4">{i + 1}</td>
                    <td className="px-6 py-4">{d.name}</td>
                    <td className="px-6 py-4">{d.floor}</td>

                    <td className="px-6 py-4 text-right space-x-3">
                      <button
                        className="text-blue-600 hover:underline"
                        onClick={() => setEditDepartment(d)}
                      >
                        Edit
                      </button>

                      <button
                        className="text-red-600 hover:underline"
                        onClick={async () => {
                          await deleteDepartmentHandler(d._id);
                          refreshDepartments(selectedPlant._id);
                        }}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}

                {departments.length === 0 && (
                  <tr>
                    <td
                      colSpan={4}
                      className="text-center py-6 text-gray-400"
                    >
                      No departments found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
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
          onUpdated={() => {
            refreshDepartments(selectedPlant._id);
            setEditDepartment(null);
          }}
        />
      )}
    </div>
  );
};

export default Plants;