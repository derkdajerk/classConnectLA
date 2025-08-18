// src/lib/validation-schemas.ts
import { z } from "zod";

export const contactSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  subject: z.string().optional(),
  message: z.string().min(5, "Message should be at least 5 characters"),
  captcha: z.boolean().refine((val) => val === true, {
    message: "Captcha must be checked",
  }),
});

// Handy inferred type
export type contactFormSchema = z.infer<typeof contactSchema>;
