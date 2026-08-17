import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User, IUser } from "../models/user.model";
import { ApiError } from "../utils/ApiError";

const generateToken = (id: string, role: string): string => {
  const secret: string = process.env.JWT_SECRET as string;
  const expiresIn: any = process.env.JWT_EXPIRES_IN || "7d";
  if (!secret) {
    throw new Error("JWT_SECRET is not defined in environment wariables");
  }
  const token = jwt.sign({ id, role }, secret, { expiresIn });
  return token;
};

const registerUser = async (userData: IUser) => {
  const { name, email, password, role } = userData;
  const existingUSer = await User.findOne({ email });

  if (existingUSer) {
    throw new ApiError(400, "Email is already exists");
  }

  const hashedPassword = await bcrypt.hash(password as string, 10);
  const newUSer: IUser = await User.create({
    name,
    email,
    password: hashedPassword,
    role: role || "member",
  });
  const token = generateToken(newUSer._id.toString(), role);

  return {
    user: {
      id: newUSer._id,
      name: newUSer.name,
      email: newUSer.email,
      role: newUSer.role,
    },
    token,
  };
};

const loginUser = async (loginData: { email: string; password: string }) => {
  const { email, password } = loginData;

  const user = await User.findOne({ email });

  const DUMMY_HASH =
    "$2a$10$abcdefghijklmnopqrstuvwxyz12345678901234567890123456";
  const hashToCompare = user ? user.password : DUMMY_HASH;

  const isMatch = await bcrypt.compare(password, hashToCompare);

  if (!user || !isMatch) {
    throw new ApiError(401, "Invalid email or password");
  }

  const token = generateToken(user._id.toString(), user.role);

  return {
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
    token,
  };
};

export { generateToken, registerUser, loginUser };
