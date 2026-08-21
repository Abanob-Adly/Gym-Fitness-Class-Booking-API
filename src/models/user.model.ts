import { Document, Schema, model } from "mongoose";
import { minLength } from "zod";

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - name
 *         - email
 *         - password
 *       properties:
 *         name:
 *           type: string
 *           description: Full name of the user
 *         email:
 *           type: string
 *           description: Unique email address of the user
 *         password:
 *           type: string
 *           description: Hashed password of the user (not returned in responses)
 *         role:
 *           type: string
 *           enum: [member, trainer]
 *           description: Role of the user in the system
 *       example:
 *         name: John Doe
 *         email: john.doe@example.com
 *         password: hashedpassword123
 *         role: member
 */
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
