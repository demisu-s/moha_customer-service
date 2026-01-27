import { useEffect, useState } from "react";
import {
  getPlants,
  getDepartmentsByPlant,
} from "../../api/plant.api";
import CreatePlantModal from "../../components/CreatePlantModal";
import CreateDepartmentModal from "../../components/CreateDepartmentModal";
import { Plant, Department } from "../../api/plant.types";

const Plants = () => {
  const [plants, setPlants] = useState<Plant[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [selectedPlant, setSelectedPlant] = useState<Plant | null>(null);

  const [showPlantModal, setShowPlantModal] = useState(false);
  const [showDeptModal, setShowDeptModal] = useState(false);

  const loadPlants = async () => {
    const res = await getPlants();
    setPlants(res.data.data); // ✅ FIX
  };

  const loadDepartments = async (plantId: string) => {
    const res = await getDepartmentsByPlant(plantId);
    setDepartments(res.data.data); // ✅ FIX
  };

  useEffect(() => {
    loadPlants();
  }, []);

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
            </tr>
          </thead>
          <tbody>
            {plants.map((p, i) => (
              <tr
                key={p._id}
                className="cursor-pointer hover:bg-gray-100"
                onClick={() => {
                  setSelectedPlant(p);
                  loadDepartments(p._id);
                }}
              >
                <td>{i + 1}</td>
                <td>{p.name}</td>
                <td>{p.area}</td>
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
              </tr>
            </thead>
            <tbody>
              {departments.map((d, i) => (
                <tr key={d._id}>
                  <td>{i + 1}</td>
                  <td>{d.name}</td>
                  <td>{d.floor}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}

      {showPlantModal && (
        <CreatePlantModal
          onClose={() => setShowPlantModal(false)}
          onCreated={loadPlants}
        />
      )}

      {showDeptModal && selectedPlant && (
        <CreateDepartmentModal
          plantId={selectedPlant._id}
          onClose={() => setShowDeptModal(false)}
          onCreated={() => loadDepartments(selectedPlant._id)}
        />
      )}
    </div>
  );
};

export default Plants;
