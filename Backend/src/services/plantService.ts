
import PlantModel from "../models/PlantModel";
import { IPlant } from "../interfaces/Plant";
import { Request, Response } from "express";

class plantService {
  // Create plant
  async createPlant(req:Request,res:Response) {
     //console.log("In service",req.body)

    const { City,Name,  Area} = req.body;
   
    const plantExists = await PlantModel.findOne({ Name:Name });
    if (plantExists) throw new Error("Plant already exists");
console.log("",req.body)
    const plant = await PlantModel.create({
     Name,  
     City,  
     Area
    }) as IPlant & { _id: any };

    return {
      plant
    };
  }

// update plant
async updatePlant(req: Request, res: Response) {
    const { _id,Name, City, Area } = req.body;
  
    if (!_id) throw new Error("Plant id is required");

    const plant = await PlantModel.findByIdAndUpdate(
        _id,
        { Name, City, Area },
        { new: true, runValidators: true }
    ) as (IPlant & { _id: any }) | null;

    if (!plant) throw new Error("Plant not found");

    return res.status(200).json({ plant });
}

// Get plant by ID
 async getPlantById(req:Request,res:Response) {
      const plant = await PlantModel.findOne({_id:req.params.id}); 
      try{

        if (!plant) {
            throw new Error("Plant not found");
        }
        return res.status(200).json({plant});
      }
      catch(error){
            console.error("Error fetching plant:", error);
            throw new Error("Error fetching plant");
      }
  }
  

// Get all plants
 async getPlants(req: Request, res: Response) {
     try{
        const plants = await PlantModel.find()
       return res.status(200).json({ plants})
     }
        catch(error){
            console.error("Error fetching plants:", error);
            return res.status(500).json({ error: "Error fetching plants" });
  }
 }

    // Delete plant
 async deletePlant(req:Request,res:Response) {
    console.log("Deleting plant with id:", req.params.id);
      const plant = await PlantModel.findByIdAndDelete(req.params.id);
        try{
        if (!plant) {
            throw new Error("Plant not found");
        }
        return res.status(200).json({ message: "Plant deleted successfully" });
      }
        catch(error){
            console.error("Error deleting plant:", error);
            throw new Error("Error deleting plant");
      }
      
  
}

}

export default new plantService();
