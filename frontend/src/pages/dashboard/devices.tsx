import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Pencil1Icon, TrashIcon } from "@radix-ui/react-icons";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { useDeviceContext } from "../../context/DeviceContext";
import DeviceCard2 from "../../components/dashboardComponents/DeviceCard2";
import { useUserContext, } from "../../context/UserContext";


export default function Devices() {
  const { devices, deleteDevice} = useDeviceContext();
  const [search, setSearch] = useState("");
  const [department, setDepartment] = useState("");
  const [area, setArea] = useState("");
  const [showDialog, setShowDialog] = useState(false);
  const [deviceToDelete, setDeviceToDelete] = useState<string | null>(null);
  const navigate = useNavigate();

    const filteredDevices = devices.filter((d) => {
    const searchLower = search.toLowerCase();
    return (
        (
        d.user.toLowerCase().includes(searchLower) ||
        d.type.toLowerCase().includes(searchLower) ||
        d.serial.toLowerCase().includes(searchLower)
        ) &&
        (department ? d.department === department : true) &&
        (area ? d.area === area : true)
    );
    });

  return (
    <div className="max-w-6xl mx-auto">
        {/* Title */}
        <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800 pb-1">Device Management</h1>
        <p className="text-sm text-gray-400">Manage Devices based on their user, area and departments efficiently.</p>
      </div>
        {/* search */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-3 mb-4">
                <div className="flex items-center gap-2 w-full sm:max-w-md">
                  <input
                    type="text"
                    placeholder="Search"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full border rounded-md px-3 py-2 text-sm"
                  />
        
                  {/* Filter Dropdown */}
                  <DropdownMenu.Root>
                    <DropdownMenu.Trigger asChild>
                      <button className="px-3 py-2 border rounded-md text-sm hover:bg-gray-100">
                        Filter
                      </button>
                    </DropdownMenu.Trigger>
                    <DropdownMenu.Portal>
                      <DropdownMenu.Content className="bg-white shadow-lg border rounded-md p-2 w-56 space-y-2">
                        {/* Department Filter */}
                        <div>
                          <label className="text-xs text-gray-500">Department</label>
                          <select
                            className="w-full border mt-1 px-2 py-1 rounded text-sm"
                            value={department}
                            onChange={(e) => setDepartment(e.target.value)}
                          >
                            <option value="">All</option>
                            <option value="MIS">MIS</option>
                            <option value="HR">HR</option>
                            <option value="Finance">Finance</option>
                            <option value="Marketing">Marketing</option>
                            <option value="Sales">Sales</option>
                            <option value="Support">Planning</option>
                            <option value="Admin">Procrument</option>
                          </select>
                        </div>
        
                        {/* Area Filter */}
                        <div>
                          <label className="text-xs text-gray-500">Area</label>
                          <select
                            className="w-full border mt-1 px-2 py-1 rounded text-sm"
                            value={area}
                            onChange={(e) => setArea(e.target.value)}
                          >
                            <option value="">All</option>
                            <option value="HO">HO</option>
                            <option value="Mekelle">Mekelle</option>
                            <option value="Summit">Summit</option>
                            <option value="Bure">Bure</option>
                            <option value="Hawassa">Hawassa</option>
                            <option value="Nifas Silk">Nifas Silk</option>
                            <option value="Teklehaymanot">Teklehaymanot</option>

                          </select>
                        </div>
                      </DropdownMenu.Content>
                    </DropdownMenu.Portal>
                  </DropdownMenu.Root>
                </div>
        
                <button
                  className="bg-primary-600 text-white px-4 py-1 rounded-md text-lg hover:shadow-md hover:scale-105 hover:bg-gray-400 transition duration-200"
                  onClick={() => navigate("/dashboard/devices/adddevice")}
                >
                  + Add Device
                </button>
              </div>
        <div className="mt-3"></div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredDevices.length === 0 ? (
        <div className="col-span-full text-center text-gray-500 text-lg py-10">
      No devices found.
    </div>
        ):(
        filteredDevices.map((device) => (
          <DeviceCard2
            id={device.id}
            deviceType={device.type}
            serialNo={device.serial}
            userName={device.user}
            department={device.department}
            area={device.area}
            onDelete={(id) => {
            setDeviceToDelete(id);
            setShowDialog(true);
            }}
            onEdit={(id) => navigate(`/dashboard/devices/edit/${id}`)}
          />
        ))
        )}
      </div>
{/* Delete Confirmation Dialog */}
      {showDialog && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-80">
            <h2 className="text-lg font-normal mb-4">Are you sure you want to delete this device?</h2>
            <div className="flex justify-end gap-2">
              <button
                className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 font-bold"
                onClick={() => setShowDialog(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 rounded-lg bg-black text-white font-bold hover:bg-red-700"
                onClick={() => {
                  if (deviceToDelete !== null) {
                    deleteDevice(deviceToDelete);
                  }
                  setShowDialog(false);
                  setDeviceToDelete(null);
                }}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
