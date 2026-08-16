import express, { Application, Response } from "express";
import dotenv from "dotenv";
import { connectDB } from "./config/db";

dotenv.config();

const app: Application = express();
const PORT: number = Number(process.env.PORT);

app.use(express.json());

const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log("Server is listening on PORT: ", PORT);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
  }
};

app.get("/", (_, res: Response): void => {
  res.send("Welcome in GYM Booking API");
});

startServer();
