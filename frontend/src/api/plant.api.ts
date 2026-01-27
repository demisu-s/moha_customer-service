import api from "./axios";
import { Plant, Department } from "./plant.types";

/* ---------- PLANTS ---------- */

export interface PlantPayload {
  name: string;
  city: string;
  area: string;
}

export const getPlants = () =>
  api.get<{ success: boolean; data: Plant[] }>("/plant/getPlants");

export const createPlant = (data: PlantPayload) =>
  api.post<{ success: boolean; data: Plant }>("/plant/createPlant", data);


/* ---------- DEPARTMENTS ---------- */

export interface DepartmentPayload {
  name: string;
  block?: string;
  floor?: string;
  plant: string;
}

export const getDepartmentsByPlant = (plantId: string) =>
  api.get<{ success: boolean; data: Department[] }>(
    `/department/getDepartmentsByPlant/${plantId}`
  );

export const createDepartment = (data: DepartmentPayload) =>
  api.post<{ success: boolean; data: Department }>(
    "/department/createDepartment",
    data
  );
