import { Schema, model, Types } from "mongoose";

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
