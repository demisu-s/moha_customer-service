import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { getDevices, createDevice, deleteDevice,updateDevice } from "../api/device.api";
import { Device } from "../api/global.types";
import { useUserContext } from "./UserContext";

interface DeviceContextType {
  devices: Device[];
  addDevice: (data: Omit<Device, "_id">) => Promise<void>;
  deleteDevice: (id: string) => Promise<void>;
  updateDevice: (id: string, data: Omit<Device, "_id">) => Promise<void>;
  
  // ✅ ADD THIS
  getDevicesByUser: (userId: string) => Device[];
}

const DeviceContext = createContext<DeviceContextType | undefined>(undefined);

export const DeviceProvider = ({ children }: { children: ReactNode }) => {
  const [devices, setDevices] = useState<Device[]>([]);
  const { currentUser } = useUserContext();

  /* ================= FETCH DEVICES ================= */

  const fetchDevices = async () => {
    try {
      const data = await getDevices(); // data is Device[]
      setDevices(data ?? []); // ✅ NOT data.devices
    } catch (error) {
      console.error("Failed to fetch devices:", error);
      setDevices([]);
    }
  };

  useEffect(() => {
    if (currentUser) {
      fetchDevices();
    } else {
      setDevices([]);
    }
  }, [currentUser]);


  /* ================= ADD DEVICE ================= */

  const addDevice = async (data: Omit<Device, "_id">) => {
    try {
      const saved = await createDevice(data);
      setDevices((prev) => [...prev, saved]);
    } catch (error) {
      console.error("Failed to add device:", error);
    }
  };

  /* ================= UPDATE DEVICE ================= */
  
  const updateDeviceHandler = async (id: string, data: Omit<Device, "_id">) => {
    try {
      const updated = await updateDevice(id, data);
      setDevices((prev) =>
        prev.map((d) => (d._id === id ? updated : d))
      );
    } catch (error) {
      console.error("Failed to update device:", error);
    }
  };

  /* ================= DELETE DEVICE ================= */

  const deleteDeviceHandler = async (id: string) => {
    try {
      await deleteDevice(id);
      setDevices((prev) => prev.filter((d) => d._id !== id));
    } catch (error) {
      console.error("Failed to delete device:", error);
    }
  };

  /* ================= DEVICES BY USER ================= */

const getDevicesByUser = (userId: string) => {
  return devices.filter(
    (device) =>
      device.user?._id === userId
  );
};

  return (
    <DeviceContext.Provider
      value={{
        devices,
        addDevice,
        getDevicesByUser,
        deleteDevice: deleteDeviceHandler,
        updateDevice: updateDeviceHandler

        
      }}
    >
      {children}
    </DeviceContext.Provider>
  );
};

export const useDeviceContext = () => {
  const context = useContext(DeviceContext);
  if (!context) {
    throw new Error("useDeviceContext must be used within DeviceProvider");
  }
  return context;
};