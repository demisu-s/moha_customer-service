import PlantModel from "../models/PlantModel";
import { IPlant } from "../interfaces/plant.interface";

class PlantService {
  // CREATE
  async createPlant(data: IPlant) {
    const { name, city, area } = data;

    const plantExists = await PlantModel.findOne({ name });
    if (plantExists) {
      throw new Error("Plant already exists");
    }

    const plant = await PlantModel.create({
      name,
      city,
      area,
    });

    return plant;
  }

  // UPDATE
  async updatePlant(id: string, data: Partial<IPlant>) {
    const plant = await PlantModel.findByIdAndUpdate(
      id,
      data,
      { new: true, runValidators: true }
    );

    if (!plant) {
      throw new Error("Plant not found");
    }

    return plant;
  }

  // GET BY ID
  async getPlantById(id: string) {
    const plant = await PlantModel.findById(id);
    if (!plant) {
      throw new Error("Plant not found");
    }
    return plant;
  }

  // GET ALL
  async getPlants() {
    const plants = await PlantModel.find().sort({ createdAt: -1 });

    return plants; // 👈 ALWAYS ARRAY
  }

  // DELETE
  async deletePlant(id: string) {
    const plant = await PlantModel.findByIdAndDelete(id);
    if (!plant) {
      throw new Error("Plant not found");
    }
    return true;
  }
}

export default new PlantService();
