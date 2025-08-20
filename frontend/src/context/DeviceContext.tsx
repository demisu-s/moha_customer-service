import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

export interface Device {
  id: string;
  image: string;
  type: string;
  name: string; // Added name field for better identification
  serial: string;
  user: string;
  userId?: string; // Optional userId for better association
  department: string;
  area: string;
}

interface DeviceContextType {
  devices: Device[];
  addDevice: (device: Device) => void;
  deleteDevice: (id: string) => void; 
  updateDevice: (updatedDevice: Device) => void;
  getDevicesByUser: (userId: string) => Device[];
};

const DeviceContext = createContext<DeviceContextType | undefined>(undefined);

const initialDevices: Device[] = [
  {
    id: "1",
    image: "/device-image.png",
    type: "Laptop",
    name: "Dell XPS 15",
    serial: "CN-9576-9597",
    user: "kebede",
    department: "MIS",
    area: "HO"
  },
  {
    id: "2",
    image: "/device-image.png",
    name: "HP EliteBook 840",
    type: "Printer",
    serial: "PR-7742",
    user: "abebe",
    department: "MIS",
    area: "Kality"
  },
  {
    id: "3",
    image: "/device-image.png",
    type: "Desktop",
    name: "Lenovo ThinkCentre",
    serial: "DT-1234",
    user: "alem",
    department: "Finance",
    area: "Summit"
  },
  {
    id: "4",
    image: "/device-image.png",
    type: "Tablet",
    name: "iPad Pro",
    serial: "TB-5678",
    user: "alex",
    department: "HR",
    area: "Kality"
  }
];

export const DeviceProvider = ({ children }: { children: ReactNode }) => {
  const [devices, setDevices] = useState<Device[]>(() => {
    const stored = localStorage.getItem("devices");
    return stored ? JSON.parse(stored) : initialDevices;
  });

  useEffect(() => {
    localStorage.setItem("devices", JSON.stringify(devices));
  }, [devices]);

  const addDevice = (device: Device) => {
    setDevices((prev) => [...prev, device]);
  };
  const deleteDevice = (id: string) => {
  setDevices((prev) => prev.filter((device) => device.id !== id));
  };
    const updateDevice = (updatedDevice: Device) => {
        setDevices((prev) =>
        prev.map((device) => (device.id === updatedDevice.id ? updatedDevice : device))
        );
    };

  // const getDevicesByUser = (userId: string) => {
  //   return devices.filter(device => device.user === userId);
  // };
const getDevicesByUser = (userId: string) => {
  return devices.filter(device => device.userId === userId);
};

  return (
    <DeviceContext.Provider value={{ devices, addDevice, deleteDevice, updateDevice, getDevicesByUser }}>
      {children}
    </DeviceContext.Provider>
  );
};

export const useDeviceContext = () => {
  const ctx = useContext(DeviceContext);
  if (!ctx) throw new Error("useDeviceContext must be used within DeviceProvider");
  return ctx;
};