import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    await mongoose.connect((process.env.MONGO_URI as string) || "");
    console.log("MongoDB Connected Successfully");
  } catch (error) {
    console.error("MongoDB connection failed:", error);
  }
};
