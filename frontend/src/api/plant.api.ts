import api from "./axios";
import { PlantPayload } from "./global.types";

/* ---------- PLANTS ---------- */

export const getPlants = () =>
  api.get<{ success: boolean; data: PlantPayload[] }>("/plant/getPlants");

export const createPlant = (data: PlantPayload) =>
  api.post<{ success: boolean; data: PlantPayload }>(
    "/plant/createPlant",
    data
  );

export const updatePlant = (id: string, data: Partial<PlantPayload>) =>
  api.put<{ success: boolean; data: PlantPayload }>(
    `/plant/updatePlant/${id}`,
    data
  );

export const deletePlant = (id: string) =>
  api.delete<{ success: boolean }>(
    `/plant/deletePlant/${id}`
  );


