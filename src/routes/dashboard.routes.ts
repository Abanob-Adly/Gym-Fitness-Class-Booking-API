import { Router } from "express";
import { protect, restrictTo } from "../middlewares/auth.middleware";
import { getTrainerDashboard } from "../controllers/dashboard.controller";

/**
 * @swagger
 * tags:
 *   name: Dashboard
 *   description: Trainer dashboard statistics endpoints
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     TrainerDashboardResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *         message:
 *           type: string
 *         data:
 *           type: object
 *           properties:
 *             totalSessions:
 *               type: number
 *               description: Total number of active sessions owned by the trainer
 *             totalCapacity:
 *               type: number
 *               description: Sum of the capacity across all of the trainer's sessions
 *             totalBookedSlots:
 *               type: number
 *               description: Sum of booked slots across all of the trainer's sessions
 *             overallAttendaceRate:
 *               type: number
 *               description: Overall booked/capacity ratio as a percentage
 *             busisestClasses:
 *               type: array
 *               description: Top 5 sessions ranked by booked slots
 *               items:
 *                 type: object
 *                 properties:
 *                   title:
 *                     type: string
 *                   capacity:
 *                     type: number
 *                   bookedSlots:
 *                     type: number
 *                   startTime:
 *                     type: string
 *                     format: date-time
 *                   attendanceRate:
 *                     type: number
 *       example:
 *         success: true
 *         message: Dashboard statstics fetched successfully
 *         data:
 *           totalSessions: 4
 *           totalCapacity: 80
 *           totalBookedSlots: 45
 *           overallAttendaceRate: 56.25
 *           busisestClasses: []
 */

const router = Router();

router.use(protect);

/**
 * @swagger
 * /api/dashboard/trainer-stats:
 *   get:
 *     tags: [Dashboard]
 *     summary: Get booking statistics for the logged-in trainer's sessions
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Dashboard statistics fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TrainerDashboardResponse'
 *       401:
 *         description: Not authenticated
 *       403:
 *         description: Not permitted (trainer role required)
 *       500:
 *         description: Some server error!
 */
router.get("/trainer-stats", restrictTo("trainer"), getTrainerDashboard);

export default router;
