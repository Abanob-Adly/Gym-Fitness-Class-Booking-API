import { Schema, model, Types } from "mongoose";

/**
 * @swagger
 * components:
 *   schemas:
 *     Session:
 *       type: object
 *       required:
 *         - title
 *         - trainerId
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
 *         trainerId:
 *           type: string
 *           description: ID of the trainer who owns this session
 *         startTime:
 *           type: string
 *           format: date-time
 *           description: Start time of the session
 *         endTime:
 *           type: string
 *           format: date-time
 *           description: End time of the session
 *         capacity:
 *           type: number
 *           description: Maximum number of members allowed to book the session
 *         bookedSlots:
 *           type: number
 *           description: Current number of booked slots
 *         isDeleted:
 *           type: boolean
 *           description: Soft-delete flag for the session
 *       example:
 *         title: Morning Yoga
 *         description: A relaxing yoga class to start your day
 *         trainerId: 64f1c2e5b5d6c9a1f8e4b123
 *         startTime: 2026-08-22T07:00:00.000Z
 *         endTime: 2026-08-22T08:00:00.000Z
 *         capacity: 20
 *         bookedSlots: 5
 *         isDeleted: false
 */
interface IClassSession {
  title: string;
  description: string;
  trainerId: Types.ObjectId;
  startTime: Date;
  endTime: Date;
  capacity: number;
  bookedSlots: number;
  isDeleted: Boolean;
}

const classSessionSchema = new Schema<IClassSession>({
  title: { type: String, required: true, trim: true },
  description: { type: String, trim: true },
  trainerId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  startTime: { type: Date, required: true },
  endTime: { type: Date, required: true },
  capacity: { type: Number, required: true, min: 1 },
  bookedSlots: { type: Number, required: true, default: 0, min: 0 },
  isDeleted: { type: Boolean, default: false },
});

const ClassSession = model<IClassSession>("ClassSession", classSessionSchema);

export { type IClassSession, ClassSession };
