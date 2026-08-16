import { Schema, model, Document, Types } from "mongoose";

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
