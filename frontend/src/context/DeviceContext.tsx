import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import axios from "axios";

export type DeviceType =
  | "Printer"
  | "Scanner"
  | "Laptop"
  | "Desktop"
  | "Tablet"
  | "Smartphone"
  | "Switch"
  | "Router"
  | "Firewall"
  | "Access Point"
  | "Server"
  | "Storage"
  | "Network Cable"
  | "Projector"
  | "Monitor"
  | "TV"
  | "Camera"
  | "Copy Machine"
  | "UPS"
  | "Fax Machine";

export const DEVICE_TYPE: DeviceType[] = [
  "Printer",
  "Scanner",
  "Laptop",
  "Desktop",
  "Tablet",
  "Smartphone",
  "Switch",
  "Router",
  "Firewall",
  "Access Point",
  "Server",
  "Storage",
  "Network Cable",
  "Projector",
  "Monitor",
  "TV",
  "Camera",
  "Copy Machine",
  "UPS",
  "Fax Machine",
];

export interface Device {
  id: string;
  image: string;
  type: DeviceType;
  name: string;
  serial: string;
  user: string;
  userId?: string;
  department: string;
  area: string;
}

type DeviceContextType = {
  devices: Device[];
  addDevice: (device: Device) => void;
  deleteDevice: (id: string) => void;
  updateDevice: (updatedDevice: Device) => void;
  getDevicesByUser: (userId: string) => Device[];
  deviceTypes: DeviceType[];
};

const DeviceContext = createContext<DeviceContextType | undefined>(undefined);

const initialDevices: Device[] = [
  {
    id: "1",
    image: "/device-image.png",
    type: "Laptop",
    name: "Dell XPS 15",
    serial: "CN-9576-9597",
    user: "Kebede",
    department: "MIS",
    area: "HO",
  },
];

export const DeviceProvider = ({ children }: { children: ReactNode }) => {
  const [devices, setDevices] = useState<Device[]>(() => {
    const stored = localStorage.getItem("devices");
    return stored ? JSON.parse(stored) : initialDevices;
  });

  const deviceTypes = DEVICE_TYPE; // ✅ define here

  useEffect(() => {
    localStorage.setItem("devices", JSON.stringify(devices));
  }, [devices]);

  // const addDevice = async (device: Device) => {
  //   try {
  //     const response = await axios.post("http://localhost:5000/api/device/createDevice", device);
  //       setDevices((prev) => [...prev, device]);
  //   } catch (error) {
  //     console.error("Failed to add device:", error);
  //   }
  // }


  const addDevice = async (device: Device) => {
  try {
    const response = await axios.post<{ device: Device }>(
      "http://localhost:5000/api/device/createDevice",
      device
    );

    const savedDevice = response.data.device;

    setDevices((prev) => [...prev, savedDevice]);
  } catch (error) {
    console.error("Failed to add device:", error);
  }
};


// const deleteDevice = async (id: string) => {
//   try {
//     await axios.delete(`http://localhost:5000/api/device/${id}`);
//     setDevices((prev) => prev.filter((d) => d.id !== id));
//   } catch (error) {
//     console.error("Failed to delete:", error);
//   }
// };

// const updateDevice = async (updatedDevice: Device) => {
//   try {
//     const response = await axios.put(
//       `http://localhost:5000/api/device/${updatedDevice.id}`,
//       updatedDevice
//     );

//     const saved = response.data.device;

//     setDevices((prev) =>
//       prev.map((d) => (d.id === saved.id ? saved : d))
//     );
//   } catch (error) {
//     console.error("Failed to update:", error);
//   }
// };


  
  const deleteDevice = (id: string) =>
    setDevices((prev) => prev.filter((d) => d.id !== id));
  const updateDevice = (updatedDevice: Device) =>
    setDevices((prev) =>
      prev.map((d) => (d.id === updatedDevice.id ? updatedDevice : d))
    );
  const getDevicesByUser = (userId: string) =>
    devices.filter((d) => d.userId === userId);

  return (
    <DeviceContext.Provider
      value={{
        devices,
        addDevice,
        deleteDevice,
        updateDevice,
        getDevicesByUser,
        deviceTypes, // ✅ now provided
      }}
    >
      {children}
    </DeviceContext.Provider>
  );
};

export const useDeviceContext = () => {
  const ctx = useContext(DeviceContext);
  if (!ctx)
    throw new Error("useDeviceContext must be used within DeviceProvider");
  return ctx;
};
