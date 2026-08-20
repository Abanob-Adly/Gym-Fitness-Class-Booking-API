// import { Router } from "express";
// import {
//   createSession,
//   getAllSessions,
//   updateSession,
//   deleteSession,
//   getSessionById,
// } from "../controllers/session.controller";
// import { protect, restrictTo } from "../middlewares/auth.middleware";
// import { validate } from "../middlewares/validate.middleware";
// import {
//   createSessionSchema,
//   updateSessionSchema,
// } from "../middlewares/session.validation";
// const router = Router();

// router
//   .route("/")
//   .get(getAllSessions)
//   .post(
//     protect,
//     restrictTo("trainer"),
//     validate(createSessionSchema),
//     createSession,
//   );

// router
//   .route("/:id")
//   .patch(
//     protect,
//     restrictTo("trainer"),
//     validate(updateSessionSchema),
//     updateSession,
//   )
//   .delete(
//     protect,
//     restrictTo("trainer"),
//     deleteSession,
//     validate(updateSessionSchema),
//   );
// router.get("/:id", getSessionById);
// export default router;
import { Router } from "express";
import * as sessionController from "../controllers/session.controller";
import { protect, restrictTo } from "../middlewares/auth.middleware";
import { validate } from "../middlewares/validate.middleware";
import { createSessionSchema, updateSessionSchema } from "../validations/session.validation";

const router = Router();
router.use(protect, restrictTo("trainer"));

router.post("/", validate(createSessionSchema), sessionController.createSession);
router.get("/", sessionController.getAllSessions);
router.get("/:id", sessionController.getSessionById);
router.patch("/:id", validate(updateSessionSchema),sessionController.updateSession);
router.delete("/:id", sessionController.deleteSession);

export default router;