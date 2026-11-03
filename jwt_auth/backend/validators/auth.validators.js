import z from "zod";

export const registerUserdata = z.object({
  body: z.object({
    email: z.email(),
    fullName: z.string().min(3),
    password: z.string().min(8),
  }),
});
export const LoginUserdata = z.object({
  body: z.object({
    email: z.email(),
    password: z.string().min(8),
  }),
});
