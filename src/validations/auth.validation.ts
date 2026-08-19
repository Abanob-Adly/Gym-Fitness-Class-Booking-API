import { email, z } from "zod";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const registerSchema = z.object({
  body: z.object({
    name: z
      .string({ message: "Name must be a valid string" })
      .trim()
      .min(1, "Name is required and cannot be empty"),
    email: z
      .string({ message: "Email must be a valid string" })
      .trim()
      .toLowerCase()
      .regex(emailRegex, "Please provide a valid email address"),
    password: z
      .string({ message: "Password must be a valid string" })
      .trim()
      .min(8, "Password must be at least 8 characters long"),
    role: z.preprocess(
      (val) => (val === "" ? undefined : val),
      z
        .enum(["trainer", "member"], {
          message: "Invalid role. Allowed roles are: trainer, member",
        })
        .default("member"),
    ),
  }),
});

const loginSchema = z.object({
  body: z.object({
    email: z
      .string({ message: "Email must be a valid string" })
      .trim()
      .toLowerCase()
      .regex(emailRegex, "Please provide a valid email address"),
    password: z
      .string({ message: "Password must be a valid string" })
      .trim()
      .min(1, { message: "Password is required" }),
  }),
});

export { registerSchema, loginSchema };
