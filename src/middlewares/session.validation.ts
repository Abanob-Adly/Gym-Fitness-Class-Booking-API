import { z } from 'zod';

export const createSessionSchema = z.object({
  body: z.object({
    title: z.string().min(3, "Title must be at least 3 characters").max(100),
    description: z.string().min(10, "Description must be at least 10 characters"),
startTime: z.string().datetime({ message: "Invalid ISO datetime for startTime" }).refine((val) => {
      return new Date(val) > new Date();
    }, {
      message: "Start time cannot be in the past",
    }),
    endTime: z.string().datetime({ message: "Invalid ISO datetime for endTime" }),
    capacity: z.number().int().min(1, "Capacity must be at least 1"),
    price: z.number().min(0, "Price cannot be negative"),
  }).refine((data) => new Date(data.endTime) > new Date(data.startTime), {
    message: "End time must be later than start time",
    path: ["endTime"],
  }),
});

export const updateSessionSchema = z.object({
  body: z.object({
    title: z.string().min(3).max(100).optional(),
    description: z.string().min(10).optional(),
    startTime: z.string().datetime().optional(),
    endTime: z.string().datetime().optional(),
    capacity: z.number().int().min(1).optional(),
    price: z.number().min(0).optional(),
  }).refine((data) => {
    if (data.startTime && data.endTime) {
      return new Date(data.endTime) > new Date(data.startTime);
    }
    return true;
  }, {
    message: "End time must be later than start time",
    path: ["endTime"],
  }).refine((data) => Object.keys(data).length > 0, {
    message: "Request body cannot be empty",
  }),
});