import { useState } from 'react';

const Plants = () => {
  const [selectedPlant, setSelectedPlant] = useState(null);

  // Sample data
  const plants = [
    { name: 'Head Office', area: 'Kality' },
    { name: 'Summit', area: 'Summit' },
    { name: 'Nifas Silk', area: 'Nifas Silk' },
    { name: 'Teklehaymanot', area: 'Teklehaymanot' },
    { name: 'Bure', area: 'Bure' },
    { name: 'Gondar', area: 'Gondar' },
    { name: 'Mekelle', area: 'Mekelle' },
    { name: 'Arba Minch', area: 'Arba Minch' },
  ];

  const departments = {
    'Head Office': [
      { id: 1, name: 'Human Resources', location: '3rd floor' },
      { id: 2, name: 'IT', location: '4th floor' },
      { id: 3, name: 'Sales', location: '4th floor' },
      { id: 4, name: 'Marketing', location: '4th floor' },
      { id: 5, name: 'Finance', location: '5th floor' },
      { id: 6, name: 'Store', location: 'Ground floor' },
      { id: 7, name: 'Law', location: '4th floor' },
    ],
    'Summit': [
      { id: 1, name: 'Production', location: '1st floor' },
      { id: 2, name: 'Quality Control', location: '2nd floor' },
      { id: 3, name: 'Logistics', location: '3rd floor' },
      { id: 4, name: 'Maintenance', location: 'Ground floor' },
    ],
    // Add departments for other plants if needed
  };

  const handlePlantClick = (plantName) => {
    setSelectedPlant(plantName);
  };

  const handleBackClick = () => {
    setSelectedPlant(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-50 p-4 rounded-lg">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-black mb-8 text-center">
          {selectedPlant ? `${selectedPlant} Departments` : 'Plant Locations'}
        </h1>

        {!selectedPlant ? (
            <div className="p-6">
             <div className="overflow-x-auto">
                <table className="min-w-full divide-y-4 divide-white">
                  <thead>
                    <tr className='bg-gray-200 font-semibold text-lg'>
                      <th className="px-6 py-2 text-left text-black uppercase tracking-wider">
                        No.
                      </th>
                      <th className="px-6 py-2 text-left text-black uppercase tracking-wider">
                        Plant Name
                      </th>
                      <th className="px-6 py-2 text-left text-black uppercase tracking-wider">
                        Area
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-primary-400 divide-y-4 divide-white text-white">
                    {plants.map((plant, index) => (
                      <tr
                        key={index}
                        className="hover:bg-gray-200 hover:text-black cursor-pointer"
                        onClick={() => handlePlantClick(plant.name)}
                      >
                        <td className="px-6 py-2 whitespace-nowrap text-lg text-white">
                          {index + 1}
                        </td>
                        <td className="px-6 py-2 whitespace-nowrap text-lg ">
                          {plant.name}
                        </td>
                        <td className="px-6 py-2 whitespace-nowrap text-lg ">
                          {plant.area}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="mt-4 text-sm text-primary-800 font-medium text-center">
                Click a plant row for details →
              </div>
            </div>
        ) : (
            <div className="p-2">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-black">
                  Departments at {selectedPlant}
                </h2>
                <button
                  onClick={handleBackClick}
                  className="px-4 py-1 bg-primary-600 hover:bg-gray-200 text-white rounded-lg transition-colors duration-200 flex items-center"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-1"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Back to Plants
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y-4 divide-white">
                  <thead >
                    <tr className='bg-gray-200 font-semibold text-lg'>
                      <th className="px-6 py-2 text-left text-black uppercase tracking-wider">
                        No.
                      </th>
                      <th className="px-6 py-2 text-left text-black uppercase tracking-wider">
                        Department
                      </th>
                      <th className="px-6 py-2 text-left text-black uppercase tracking-wider">
                        Location
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-primary-400 divide-y-4 divide-white text-white">
                    {departments[selectedPlant]?.map((dept) => (
                      <tr key={dept.id}>
                        <td className="px-6 py-2 whitespace-nowrap text-lg text-white">
                          {dept.id}
                        </td>
                        <td className="px-6 py-2 whitespace-nowrap text-lg text-white">
                          {dept.name}
                        </td>
                        <td className="px-6 py-2 whitespace-nowrap text-lg text-white">
                          {dept.location}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
        )}
      </div>
    </div>
  );
};

export default Plants;