import express, { Application, Response } from "express";
import morgan from "morgan";
import dotenv from "dotenv";
import { connectDB } from "./config/db";
import { setupSwagger } from "./config/swagger";
import { errorHandler } from "./middlewares/errorHandler";
import authRouter from "./routes/auth.routes";
import dashboardRouter from "./routes/dashboard.routes";
import sessionRouter from "./routes/session.routes";

dotenv.config();

const app: Application = express();
const PORT: number = Number(process.env.PORT);
const morganFormat = process.env.NODE_ENV === "production" ? "combined" : "dev";

app.use(morgan(morganFormat));
setupSwagger(app);
app.use(express.json());
app.use("/api/auth", authRouter);
app.use("/api/dashboard", dashboardRouter);
app.use("/api/sessions", sessionRouter);
app.use(errorHandler);

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

app.get("/", (_req, res: Response): void => {
  res.send("Welcome in GYM Booking API");
});

startServer();
