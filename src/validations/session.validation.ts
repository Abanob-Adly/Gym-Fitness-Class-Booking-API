import { z } from "zod";

const sessionSchema = z.object({
  body: z
    .object({
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
    })
    .refine((data) => data.startTime > new Date(), {
      message: "Sessions can only be created for future time slots",
      path: ["startTime"],
    })
    .refine((data) => data.endTime > data.startTime, {
      message: "End time must be strictly after start time",
      path: ["endTime"],
    }),
});

export { sessionSchema };
