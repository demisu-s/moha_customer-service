import api from "./axios";
import { Device } from "./global.types";

/* ================= GET ALL DEVICES ================= */

export const getDevices = async (): Promise<Device[]> => {
  try {
    const response = await api.get<{
      success: boolean;
      devices: Device[];
    }>("/device/getDevice");

    // backend returns { success: true, devices: [] }
    return response.data.devices ?? [];
  } catch (error) {
    console.error("Error fetching devices:", error);
    return []; // prevent undefined crashes
  }
};

/* ================= CREATE DEVICE ================= */

export const createDevice = async (
  deviceData: Omit<Device, "_id" | "user">
): Promise<Device> => {
  try {
    const response = await api.post<{
      success: boolean;
      device: Device;
    }>("/device/createDevice", deviceData);

    return response.data.device;
  } catch (error) {
    console.error("Error creating device:", error);
    throw error;
  }
};



/* ================= UPDATE DEVICE ================= */

export const updateDevice = async (
  deviceId: string,
  deviceData: Omit<Device, "_id" | "user">
): Promise<Device> => {
  try {
    const response = await api.put<{
      success: boolean;
      device: Device;
    }>(`/device/updateDevice/${deviceId}`, {
      _id: deviceId,
      ...Object.fromEntries(
        Object.entries(deviceData).filter(([key]) => key !== "_id")
      ),
    });

    return response.data.device;
  } catch (error) {
    console.error("Error updating device:", error);
    throw error;
  }
};

/* ================= DELETE DEVICE ================= */

export const deleteDevice = async (deviceId: string): Promise<void> => {
  try {
    await api.delete(`/device/deleteDevice/${deviceId}`);
  } catch (error) {
    console.error("Error deleting device:", error);
    throw error;
  }
};