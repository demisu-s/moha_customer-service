import { IUser } from "../interfaces/user.interface";
import User from "../models/User";
import Department from "../models/DepartmentModel";
import bcrypt from "bcryptjs";
import { generateToken } from "../utils/generateToken";

class AuthService {
  async register(data: IUser) {
    const { userId, password, department } = data;

    const exists = await User.findOne({ userId });
    if (exists) throw new Error("User already exists");

    const departmentExists = await Department.findById(department);
    if (!departmentExists) throw new Error("Invalid department");

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({ ...data, password: hashedPassword }) as any;

    return {
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      userId: user.userId,
      role: user.role,
      gender: user.gender,
      phone: user.phone,
      photo: user.photo,
      department: departmentExists,
      token: generateToken(user._id.toString()),
    };
  }
  async getUsers() {
    const users = await User.find().populate({  
      path: "department",
      populate: { path: "plant" },
    });
    return users;
  }

  async deleteUser(id: string) {
    await User.findByIdAndDelete(id);
  }
  async updateUser(id: string, data: Partial<IUser>) {
    const updatedUser = await User.findByIdAndUpdate(id, data, { new: true }).populate({  
      path: "department",
      populate: { path: "plant" },
    });
    return updatedUser;
  }

  async login(userId: string, password: string) {
    const user = await User.findOne({ userId }).populate({
      path: "department",
      populate: { path: "plant" },
    }) as any;

    if (!user) throw new Error("Invalid credentials");

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new Error("Invalid credentials");

    return {
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      userId: user.userId,
      role: user.role,
      gender: user.gender,
      department: user.department,
      token: generateToken(user._id.toString()),
    };
  }
}
  

export default new AuthService();
