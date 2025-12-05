import bcrypt from "bcryptjs";
import User from "../models/User";
import { IUser } from "../interfaces/User";
import { generateToken } from "../utils/generateToken";

class AuthService {
  // Register user
  async register(data: IUser) {
    const { firstName,lastName, userId, password } = data;

    const userExists = await User.findOne({ userId });
    if (userExists) throw new Error("User already exists");

    const hashedPassword = await bcrypt.hash(password, 10);
console.log("",data)
    const user = await User.create({
      firstName,
      lastName,
      userId,
      password: hashedPassword,
    }) as IUser & { _id: any };

    return {
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      userId: user.userId,
      token: generateToken(user._id.toString()),
    };
  }

  // Login user
  async login(userId: string, password: string) {
    const user = await User.findOne({ userId }) as (IUser & { _id: any }) | null;
    if (!user) throw new Error("Invalid credentials");

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new Error("Invalid credentials");

    return {
      _id: user._id,
      firstName: user.firstName,
      userId: user.userId,
      token: generateToken(user._id.toString()),
    };
  }
}

export default new AuthService();
