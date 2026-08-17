import { Document, Schema, model } from "mongoose";
import { minLength } from "zod";

interface IUser extends Document {
  name: string;
  email: string;
  password?: string;
  role: "member" | "trainer";
}

const userSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    unique: true,
    required: true,
    trim: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
    select: false,
    minLength: 8,
  },
  role: {
    type: String,
    enum: ["member", "trainer"],
    default: "member",
  },
});

const User = model<IUser>("User", userSchema);

export { type IUser, User };
