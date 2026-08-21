import { Router } from "express";
import * as sessionController from "../controllers/session.controller";
import { protect, restrictTo } from "../middlewares/auth.middleware";
import { validate } from "../middlewares/validate.middleware";
import { createSessionSchema, updateSessionSchema } from "../validations/session.validation";

/**
 * @swagger
 * tags:
 *   name: Sessions
 *   description: Fitness class session management endpoints
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     CreateSessionInput:
 *       type: object
 *       required:
 *         - title
 *         - startTime
 *         - endTime
 *         - capacity
 *       properties:
 *         title:
 *           type: string
 *           description: Title of the fitness class session
 *         description:
 *           type: string
 *           description: Description of the fitness class session
 *         startTime:
 *           type: string
 *           format: date-time
 *           description: Start time of the session (must be in the future)
 *         endTime:
 *           type: string
 *           format: date-time
 *           description: End time of the session (must be after startTime)
 *         capacity:
 *           type: number
 *           description: Maximum number of members allowed to book the session
 *       example:
 *         title: Morning Yoga
 *         description: A relaxing yoga class to start your day
 *         startTime: 2026-08-22T07:00:00.000Z
 *         endTime: 2026-08-22T08:00:00.000Z
 *         capacity: 20
 *     UpdateSessionInput:
 *       type: object
 *       properties:
 *         title:
 *           type: string
 *           description: Title of the fitness class session
 *         description:
 *           type: string
 *           description: Description of the fitness class session
 *         startTime:
 *           type: string
 *           format: date-time
 *           description: Start time of the session (must be in the future)
 *         endTime:
 *           type: string
 *           format: date-time
 *           description: End time of the session (must be after startTime)
 *         capacity:
 *           type: number
 *           description: Maximum number of members allowed to book the session
 *       example:
 *         title: Evening Yoga
 *         capacity: 25
 *     SessionResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *         message:
 *           type: string
 *         data:
 *           $ref: '#/components/schemas/Session'
 *     SessionListResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *         message:
 *           type: string
 *         data:
 *           type: object
 *           properties:
 *             sessions:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Session'
 *             pagination:
 *               type: object
 *               properties:
 *                 page:
 *                   type: number
 *                 limit:
 *                   type: number
 *                 totalPages:
 *                   type: number
 *                 totalItems:
 *                   type: number
 */

const router = Router();
router.use(protect, restrictTo("trainer"));

/**
 * @swagger
 * /api/sessions:
 *   post:
 *     tags: [Sessions]
 *     summary: Create a new fitness class session (trainer only)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateSessionInput'
 *     responses:
 *       201:
 *         description: Session created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SessionResponse'
 *       404:
 *         description: Not found
 *       500:
 *         description: Some server error!
 */
router.post("/", validate(createSessionSchema), sessionController.createSession);

/**
 * @swagger
 * /api/sessions:
 *   get:
 *     tags: [Sessions]
 *     summary: Get all fitness class sessions
 *     parameters:
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         required: false
 *         description: Search sessions by title
 *       - in: query
 *         name: trainerId
 *         schema:
 *           type: string
 *         required: false
 *         description: Filter sessions by trainer ID
 *       - in: query
 *         name: date
 *         schema:
 *           type: string
 *         required: false
 *         description: Filter sessions by date (YYYY-MM-DD)
 *       - in: query
 *         name: availableOnly
 *         schema:
 *           type: string
 *         required: false
 *         description: Filter sessions with available slots only
 *       - in: query
 *         name: page
 *         schema:
 *           type: number
 *         required: false
 *         description: Page number for pagination
 *       - in: query
 *         name: limit
 *         schema:
 *           type: number
 *         required: false
 *         description: Number of items per page
 *     responses:
 *       200:
 *         description: Sessions fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SessionListResponse'
 *       404:
 *         description: Not found
 *       500:
 *         description: Some server error!
 */
router.get("/", sessionController.getAllSessions);

/**
 * @swagger
 * /api/sessions/{id}:
 *   get:
 *     tags: [Sessions]
 *     summary: Get a single fitness class session by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the session to retrieve
 *     responses:
 *       200:
 *         description: Session fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SessionResponse'
 *       404:
 *         description: Session not found
 *       500:
 *         description: Some server error!
 */
router.get("/:id", sessionController.getSessionById);

/**
 * @swagger
 * /api/sessions/{id}:
 *   patch:
 *     tags: [Sessions]
 *     summary: Update a fitness class session (trainer only)
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the session to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateSessionInput'
 *     responses:
 *       200:
 *         description: Session updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SessionResponse'
 *       404:
 *         description: Session not found
 *       500:
 *         description: Some server error!
 */
router.patch("/:id", validate(updateSessionSchema),sessionController.updateSession);

/**
 * @swagger
 * /api/sessions/{id}:
 *   delete:
 *     tags: [Sessions]
 *     summary: Delete (soft-delete) a fitness class session (trainer only)
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the session to delete
 *     responses:
 *       200:
 *         description: Session deleted successfully
 *       404:
 *         description: Session not found
 *       500:
 *         description: Some server error!
 */
router.delete("/:id", sessionController.deleteSession);

export default router;