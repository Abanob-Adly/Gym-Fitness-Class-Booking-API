import { Schema, model, Types } from "mongoose";

interface IClassSession {
  title: string;
  trainer: Types.ObjectId;
  timeSlot: Date;
  capacity: number;
}

const classSessionSchema = new Schema<IClassSession>({
  title: { type: String, required: true, trim: true },
  trainer: { type: Schema.Types.ObjectId, ref: "User", required: true },
  timeSlot: { type: Date, required: true },
  capacity: { type: Number, required: true, min: 1 },
});

const ClassSession = model<IClassSession>("ClassSession", classSessionSchema);

export { type IClassSession, ClassSession };
