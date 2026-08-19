import { z } from "zod";

const createBookingSchema = z.object({
  body: z.object({
    sessionId: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid Session ID"),
  }),
});

export { createBookingSchema };
