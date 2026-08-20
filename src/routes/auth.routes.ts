import { Router } from "express";
import { register, login } from "../controllers/auth.controller";
import { validateLogin, validateRegister } from "../middlewares/validateAuth";

const router = Router();

router.post("/register", validateRegister, register);
router.post("/login", validateLogin, login);


export default router;