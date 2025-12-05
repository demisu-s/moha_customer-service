
import { IDepartment } from "../interfaces/types";
import { Request, Response } from "express";
import DepartmentModel from "../models/DepartmentModel";

class departmentService {
  // Create department
  async createDepartment(req:Request,res:Response) {

    const { name,block,  floor} = req.body;
   
    const departmentExists = await DepartmentModel.findOne({ Name:name });
    if (departmentExists) throw new Error("department already exists");
    const department = await DepartmentModel.create({
     name,  
     block,  
    floor
    }) as IDepartment & { _id: any };

    return {
      department
    };
  }

// update department
async updateDepartment(req: Request, res: Response) {
    const { _id,name, block, floor } = req.body;
  
    if (!_id) throw new Error("Plant id is required");

    const department = await DepartmentModel.findByIdAndUpdate(
        _id,
        { name, block, floor },
        { new: true, runValidators: true }
    ) as (IDepartment & { _id: any }) | null;

    if (!department) throw new Error("department not found");

    return res.status(200).json({ department });
}

// Get department by ID
 async getDepartmentById(req:Request,res:Response) {
      const department = await DepartmentModel.findOne({_id:req.params.id}); 
      try{

        if (!department) {
            throw new Error("department not found");
        }
        return res.status(200).json({department});
      }
      catch(error){
            console.error("Error fetching department:", error);
            throw new Error("Error fetching department");
      }
  }
  

// Get all departments
 async getDepartment(req: Request, res: Response) {
     try{
        const department = await DepartmentModel.find()
       return res.status(200).json({ department})
     }
        catch(error){
            console.error("Error fetching department:", error);
            return res.status(500).json({ error: "Error fetching department" });
  }
 }

    // Delete department
 async deleteDepartment(req:Request,res:Response) {
    console.log("Deleting depatment with id:", req.params.id);
      const department = await DepartmentModel.findByIdAndDelete(req.params.id);
        try{
        if (!department) {
            throw new Error("department not found");
        }
        return res.status(200).json({ message: "department deleted successfully" });
      }
        catch(error){
            console.error("Error deleting department:", error);
            throw new Error("Error deleting department");
      }
      
  
}

}

export default new departmentService();
