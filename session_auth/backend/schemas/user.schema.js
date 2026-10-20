import { z } from "zod";

export const registerUserSchema = z.object({
  body: z.object({
    fullName: z.string().min(3),
    email: z.email(),
    password: z.string().min(8),
  }),
});

export const loginUserSchema = z.object({
  body: z.object({
    email: z.email(),
    password: z.string().min(8),
  }),
});
