import { Router } from "express";
import {
  createSession,
  getAllSessions,
  updateSession,
  deleteSession,
  getSessionById,
} from "../controllers/session.controller";
import { protect, restrictTo } from "../middlewares/auth.middleware";
import { validate } from "../middlewares/validate.middleware";
import {
  createSessionSchema,
  updateSessionSchema,
} from "../middlewares/session.validation";
const router = Router();

router
  .route("/")
  .get(getAllSessions)
  .post(
    protect,
    restrictTo("trainer"),
    validate(createSessionSchema),
    createSession,
  );

router
  .route("/:id")
  .patch(
    protect,
    restrictTo("trainer"),
    validate(updateSessionSchema),
    updateSession,
  )
  .delete(
    protect,
    restrictTo("trainer"),
    deleteSession,
    validate(updateSessionSchema),
  );
router.get("/:id", getSessionById);
export default router;
