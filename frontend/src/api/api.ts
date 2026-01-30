import api from "./axios";

export const getPlants = async (): Promise<any> => {
  const res = await api.get<any>("/plants/getPlants");
  return res.data.data;
};

export const getDepartmentsByPlant = async (plantId: string) => {
  const res = await api.get<any>(
    `/departments/getDepartmentsByPlant/${plantId}`
  );
  return res.data.data;
};
