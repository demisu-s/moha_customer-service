import DepartmentModel from "../models/DepartmentModel";
import { IDepartment } from "../interfaces/department.interface";

class DepartmentService {
  // CREATE
  async createDepartment(data: IDepartment) {
    const { name, block, floor, plant } = data;

    const departmentExists = await DepartmentModel.findOne({
      name,
      plant,
    });

    if (departmentExists) {
      throw new Error("Department already exists for this plant");
    }

    const department = await DepartmentModel.create({
      name,
      block,
      floor,
      plant,
    });

    return department;
  }

  // UPDATE
  async updateDepartment(id: string, data: Partial<IDepartment>) {
    const department = await DepartmentModel.findByIdAndUpdate(
      id,
      data,
      { new: true, runValidators: true }
    );

    if (!department) {
      throw new Error("Department not found");
    }

    return department;
  }

  // GET BY ID
  async getDepartmentById(id: string) {
    const department = await DepartmentModel.findById(id).populate("plant");

    if (!department) {
      throw new Error("Department not found");
    }

    return department;
  }

  // GET BY PLANT
  async getDepartmentsByPlant(plantId: string) {
    const departments = await DepartmentModel.find({ plant: plantId })
      .sort({ createdAt: -1 });

    return departments; // 👈 ARRAY
  }

  // GET ALL
  async getDepartments() {
    const departments = await DepartmentModel.find().populate("plant");
    return departments;
  }

  // DELETE
  async deleteDepartment(id: string) {
    const department = await DepartmentModel.findByIdAndDelete(id);
    if (!department) {
      throw new Error("Department not found");
    }
    return true;
  }
}

export default new DepartmentService();
