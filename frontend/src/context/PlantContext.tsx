import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
  useCallback,
} from "react";
import {
  getPlants,
  createPlant,
  updatePlant,
  deletePlant,
} from "../api/plant.api";
import { PlantPayload } from "../api/global.types";

/* ------------------ Context Type ------------------ */
interface PlantContextType {
  plants: PlantPayload[];
  refreshPlants: () => Promise<void>;
  addPlant: (payload: PlantPayload) => Promise<void>;
  updatePlantHandler: (id: string, data: Partial<PlantPayload>) => Promise<void>;
  deletePlantHandler: (id: string) => Promise<void>;
}

const PlantContext = createContext<PlantContextType | undefined>(undefined);

/* ------------------ Provider ------------------ */
export const PlantProvider = ({ children }: { children: ReactNode }) => {
  const [plants, setPlants] = useState<PlantPayload[]>([]);

  /* -------- Load Plants -------- */
  const refreshPlants = useCallback(async () => {
    try {
      const res = await getPlants();
      setPlants(Array.isArray(res.data.data) ? res.data.data : []);
    } catch (err) {
      console.error("Failed to load plants", err);
      setPlants([]);
    }
  }, []);

  useEffect(() => {
    refreshPlants();
  }, [refreshPlants]);

  /* -------- Create -------- */
  const addPlant = async (payload: PlantPayload) => {
    const res = await createPlant(payload);
    setPlants((prev) => [...prev, res.data.data]);
  };

  /* -------- Update -------- */
  const updatePlantHandler = async (
    id: string,
    data: Partial<PlantPayload>
  ) => {
    const res = await updatePlant(id, data);
    setPlants((prev) =>
      prev.map((p) => (p._id === id ? res.data.data : p))
    );
  };

  /* -------- Delete -------- */
  const deletePlantHandler = async (id: string) => {
    await deletePlant(id);
    setPlants((prev) => prev.filter((p) => p._id !== id));
  };

  return (
    <PlantContext.Provider
      value={{
        plants,
        refreshPlants,
        addPlant,
        updatePlantHandler,
        deletePlantHandler,
      }}
    >
      {children}
    </PlantContext.Provider>
  );
};

/* ------------------ Hook ------------------ */
export const usePlantContext = () => {
  const ctx = useContext(PlantContext);
  if (!ctx) {
    throw new Error("usePlantContext must be used inside PlantProvider");
  }
  return ctx;
};
