import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

export const connectDB = async () => {
  try {
    const dbUri = process.env.MONGO_URI;
    
    if (!dbUri) {
      throw new Error("MONGO_URI is missing in .env file");
    }

    await mongoose.connect(dbUri);
    console.log(" MongoDB Connected Successfully");
  } catch (error) {
    console.error(" MongoDB connection failed:", error);
    
    process.exit(1); 
  }
};