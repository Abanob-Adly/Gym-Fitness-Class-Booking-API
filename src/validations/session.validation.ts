import { z } from "zod";

const sessionFields = z.object({
  title: z
    .string({ message: "Title must be a valid string" })
    .trim()
    .min(1, "Title is required and cannot be empty"),
  description: z
    .string({ message: "Description must be a valid string" })
    .trim()
    .optional(),
  startTime: z.coerce.date({ message: "Start time must be a valid date" }),
  endTime: z.coerce.date({ message: "End time must be a valid date" }),
  capacity: z
    .number({ message: "Capacity must be a number" })
    .int({ message: "Capacity must be an integer" })
    .positive({ message: "Capacity must be a positive number" }),
});

const createSessionSchema = z.object({
  body: sessionFields
    .refine((data) => data.startTime > new Date(), {
      message: "Sessions can only be created for future time slots",
      path: ["startTime"],
    })
    .refine((data) => data.endTime > data.startTime, {
      message: "End time must be strictly after start time",
      path: ["endTime"],
    }),
});

const updateSessionSchema = z.object({
  body: sessionFields
    .partial()
    .refine(
      (data) => {
        if (!data.startTime) return true;
        return data.startTime > new Date();
      },
      {
        message: "Sessions can only be updated for future time slots",
        path: ["startTime"],
      },
    )
    .refine(
      (data) => {
        if (data.startTime && data.endTime) {
          return data.endTime > data.startTime;
        }
        return true;
      },
      {
        message: "End time must be strictly after start time",
        path: ["endTime"],
      },
    ),
});

export { createSessionSchema, updateSessionSchema };
