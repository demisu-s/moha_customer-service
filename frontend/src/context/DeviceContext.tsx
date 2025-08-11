import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

export interface Device {
  id: string;
  image: string;
  type: string;
  name: string; // Added name field for better identification
  serial: string;
  user: string;
  department: string;
  area: string;
}

interface DeviceContextType {
  devices: Device[];
  addDevice: (device: Device) => void;
}

const DeviceContext = createContext<DeviceContextType | undefined>(undefined);

const initialDevices: Device[] = [
  {
    id: "1",
    image: "/device-image.png",
    type: "Laptop",
    name: "Dell XPS 15",
    serial: "CN-9576-9597",
    user: "John Doe",
    department: "Finance",
    area: "HO"
  },
  {
    id: "2",
    image: "/device-image.png",
    name: "HP EliteBook 840",
    type: "Printer",
    serial: "PR-7742",
    user: "Jane Smith",
    department: "MIS",
    area: "Summit"
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

  return (
    <DeviceContext.Provider value={{ devices, addDevice }}>
      {children}
    </DeviceContext.Provider>
  );
};

export const useDeviceContext = () => {
  const ctx = useContext(DeviceContext);
  if (!ctx) throw new Error("useDeviceContext must be used within DeviceProvider");
  return ctx;
};