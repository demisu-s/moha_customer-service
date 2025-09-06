import { useState } from "react";
import { useUserContext } from "../../context/UserContext";

type PlantName =
  | "HO"| "Summit"| "NifasSilk"| "Teklehaymanot"| "Bure"| "Gonder"| "Mekelle"| "Dessie"| "Hawassa";

interface Department {
  id: number;
  name: string;
  location: string;
}

const Plants = () => {
  const [selectedPlant, setSelectedPlant] = useState<PlantName | null>(null);
  const [selectedDept, setSelectedDept] = useState<string | null>(null);
  const { users } = useUserContext();

  const plants: { name: PlantName; area: string }[] = [
    { name: "HO", area: "Head Office" },
    { name: "Summit", area: "Summit" },
    { name: "NifasSilk", area: "Nifas Silk" },
    { name: "Teklehaymanot", area: "Teklehaymanot" },
    { name: "Bure", area: "Bure" },
    { name: "Gonder", area: "Gonder" },
    { name: "Mekelle", area: "Mekelle" },
    { name: "Dessie", area: "Dessie" },
    { name: "Hawassa", area: "Hawassa" },
  ];

  const departments: Record<PlantName, Department[]> = {
    HO: [
      { id: 1, name: "HR", location: "2rd floor" },
      { id: 2, name: "MIS", location: "3th floor" },
      { id: 3, name: "Sales", location: "3th floor" },
      { id: 4, name: "Planning", location: "4th floor" },
      { id: 5, name: "Marketing", location: "3th floor" },
      { id: 6, name: "Finance", location: "4th floor" },
      { id: 7, name: "Law", location: "3th floor" },
      { id: 8, name: "Property", location: "3st floor" },
      { id: 9, name: "Audit", location: "4th floor" },
      { id: 10, name: "Project", location: "4th floor" },
      { id: 11, name: "Procurement", location: "3th floor" },
      { id: 12, name: "Quality", location: "3st floor" },
    ],
    Summit: [
      { id: 1, name: "Production", location: "1st floor" },
      { id: 2, name: "Quality Control", location: "2nd floor" },
      { id: 3, name: "Logistics", location: "1st floor" },
      { id: 4, name: "Maintenance", location: "2nd floor" },
      { id: 5, name: "Technitian", location: "2nd floor" },
      { id: 6, name: "HR", location: "2nd floor" },
      { id: 7, name: "Sales", location: "2nd floor" },
    ],
    Dessie: [
      { id: 1, name: "Production", location: "1st floor" },
      { id: 2, name: "Quality Control", location: "2nd floor" },
      { id: 3, name: "Logistics", location: "1st floor" },
      { id: 4, name: "Maintenance", location: "2nd floor" },
      { id: 5, name: "Technitian", location: "2nd floor" },
      { id: 6, name: "HR", location: "2nd floor" },
      { id: 7, name: "Sales", location: "2nd floor" },
    ],
    Teklehaymanot: [
      { id: 1, name: "Production", location: "1st floor" },
      { id: 2, name: "Quality Control", location: "2nd floor" },
      { id: 3, name: "Logistics", location: "1st floor" },
      { id: 4, name: "Maintenance", location: "2nd floor" },
      { id: 5, name: "Technitian", location: "2nd floor" },
      { id: 6, name: "HR", location: "2nd floor" },
      { id: 7, name: "Sales", location: "2nd floor" },
    ],
    Mekelle: [
      { id: 1, name: "Production", location: "1st floor" },
      { id: 2, name: "Quality Control", location: "2nd floor" },
      { id: 3, name: "Logistics", location: "1st floor" },
      { id: 4, name: "Maintenance", location: "2nd floor" },
      { id: 5, name: "Technitian", location: "2nd floor" },
      { id: 6, name: "HR", location: "2nd floor" },
      { id: 7, name: "Sales", location: "2nd floor" },
    ],
    Bure: [
      { id: 1, name: "Production", location: "1st floor" },
      { id: 2, name: "Quality Control", location: "2nd floor" },
      { id: 3, name: "Logistics", location: "1st floor" },
      { id: 4, name: "Maintenance", location: "2nd floor" },
      { id: 5, name: "Technitian", location: "2nd floor" },
      { id: 6, name: "HR", location: "2nd floor" },
      { id: 7, name: "Sales", location: "2nd floor" },
    ],
    NifasSilk: [
      { id: 1, name: "Production", location: "1st floor" },
      { id: 2, name: "Quality Control", location: "2nd floor" },
      { id: 3, name: "Logistics", location: "1st floor" },
      { id: 4, name: "Maintenance", location: "2nd floor" },
      { id: 5, name: "Technitian", location: "2nd floor" },
      { id: 6, name: "HR", location: "2nd floor" },
      { id: 7, name: "Sales", location: "2nd floor" },
    ],
    Hawassa: [
      { id: 1, name: "Production", location: "1st floor" },
      { id: 2, name: "Quality Control", location: "2nd floor" },
      { id: 3, name: "Logistics", location: "1st floor" },
      { id: 4, name: "Maintenance", location: "2nd floor" },
      { id: 5, name: "Technitian", location: "2nd floor" },
      { id: 6, name: "HR", location: "2nd floor" },
      { id: 7, name: "Sales", location: "2nd floor" },
    ],
    Gonder: [
      { id: 1, name: "Production", location: "1st floor" },
      { id: 2, name: "Quality Control", location: "2nd floor" },
      { id: 3, name: "Logistics", location: "1st floor" },
      { id: 4, name: "Maintenance", location: "2nd floor" },
      { id: 5, name: "Technitian", location: "2nd floor" },
      { id: 6, name: "HR", location: "2nd floor" },
      { id: 7, name: "Sales", location: "2nd floor" },
    ],
  };

  const handlePlantClick = (plant: PlantName) => {
    setSelectedPlant(plant);
    setSelectedDept(null);
  };

  const handleDeptClick = (dept: string) => {
    setSelectedDept(dept);
  };

  const handleBack = () => {
    if (selectedDept) {
      setSelectedDept(null);
    } else if (selectedPlant) {
      setSelectedPlant(null);
    }
  };

  const deptUsers =
    selectedPlant && selectedDept
      ? users.filter(
          (u) => u.area === selectedPlant && u.department === selectedDept
        )
      : [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-50 p-4 rounded-lg">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold text-black mb-8 text-center">
          {!selectedPlant
            ? "Plant Locations"
            : !selectedDept
            ? `${selectedPlant} Departments`
            : `${selectedDept} Users`}
        </h1>

        {(selectedPlant || selectedDept) && (
          <button
            className="mb-4 px-4 py-2 bg-black text-white rounded hover:bg-gray-700"
            onClick={handleBack}
          >
            ← Back
          </button>
        )}

        {/* PLANT LIST */}
        {!selectedPlant && (
          <table className="min-w-full divide-y-4 divide-white">
            <thead>
              <tr className="bg-gray-200 font-semibold text-lg">
                <th className="px-6 py-2">No</th>
                <th className="px-6 py-2">Plant Name</th>
                <th className="px-6 py-2">Area</th>
              </tr>
            </thead>
            <tbody className="bg-primary-400 divide-y-4 divide-white text-white">
              {plants.map((plant, idx) => (
                <tr
                  key={idx}
                  className="hover:bg-gray-200 hover:text-black cursor-pointer"
                  onClick={() => handlePlantClick(plant.name)}
                >
                  <td className="px-6 py-2">{idx + 1}</td>
                  <td className="px-6 py-2">{plant.name}</td>
                  <td className="px-6 py-2">{plant.area}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {/* DEPARTMENTS LIST */}
        {selectedPlant && !selectedDept && (
          <table className="min-w-full divide-y-4 divide-white">
            <thead>
              <tr className="bg-gray-200 font-semibold text-lg">
                <th className="px-6 py-2">No</th>
                <th className="px-6 py-2">Department</th>
                <th className="px-6 py-2">Location</th>
              </tr>
            </thead>
            <tbody className="bg-primary-400 divide-y-4 divide-white text-white">
              {departments[selectedPlant]?.map((dept) => (
                <tr
                  key={dept.id}
                  className="hover:bg-gray-200 hover:text-black cursor-pointer"
                  onClick={() => handleDeptClick(dept.name)}
                >
                  <td className="px-6 py-2">{dept.id}</td>
                  <td className="px-6 py-2">{dept.name}</td>
                  <td className="px-6 py-2">{dept.location}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {/* USERS LIST */}
        {selectedDept && (
          <table className="min-w-full divide-y-4 divide-white">
            <thead>
              <tr className="bg-gray-200 font-semibold text-lg">
                <th className="px-6 py-2">No</th>
                <th className="px-6 py-2">First Name</th>
                <th className="px-6 py-2">Last Name</th>
                <th className="px-6 py-2">Role</th>
                <th className="px-6 py-2">Gender</th>
                <th className="px-6 py-2">User ID</th>
              </tr>
            </thead>
            <tbody className="bg-primary-400 divide-y-4 divide-white text-white">
              {deptUsers.length > 0 ? (
                deptUsers.map((u, idx) => (
                  <tr key={u.userId}>
                    <td className="px-6 py-2">{idx + 1}</td>
                    <td className="px-6 py-2">{u.firstName}</td>
                    <td className="px-6 py-2">{u.lastName}</td>
                    <td className="px-6 py-2">{u.role}</td>
                    <td className="px-6 py-2">{u.gender}</td>
                    <td className="px-6 py-2">{u.userId}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={6}
                    className="text-center px-6 py-4 text-gray-200"
                  >
                    No users found in this department.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default Plants;
