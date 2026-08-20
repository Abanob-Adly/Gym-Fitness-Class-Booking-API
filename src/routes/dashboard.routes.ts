import { Router } from "express";
import { protect, restrictTo } from "../middlewares/auth.middleware";
import { getTrainerDashboard } from "../controllers/dashboard.controller";

const router = Router();

router.use(protect);

router.get("/trainer-stats", restrictTo("trainer"), getTrainerDashboard);

export default router;
