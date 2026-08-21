import { Schema, model, Document, Types } from "mongoose";

/**
 * @swagger
 * components:
 *   schemas:
 *     Booking:
 *       type: object
 *       required:
 *         - session
 *         - member
 *       properties:
 *         session:
 *           type: string
 *           description: ID of the booked class session
 *         member:
 *           type: string
 *           description: ID of the member who made the booking
 *         status:
 *           type: string
 *           enum: [booked, cancelled]
 *           description: Current status of the booking
 *       example:
 *         session: 64f1c2e5b5d6c9a1f8e4b123
 *         member: 64f1c2e5b5d6c9a1f8e4b456
 *         status: booked
 */
interface IBooking extends Document {
  session: Types.ObjectId;
  member: Types.ObjectId;
  status: "booked" | "cancelled";
}

const bookingSchema = new Schema<IBooking>({
  session: {
    type: Schema.Types.ObjectId,
    ref: "ClassSession",
    required: true,
  },
  member: { type: Schema.Types.ObjectId, ref: "User", required: true },
  status: { type: String, enum: ["booked", "cancelled"], default: "booked" },
});

const Booking = model<IBooking>("Booking", bookingSchema);

export { type IBooking, Booking };
