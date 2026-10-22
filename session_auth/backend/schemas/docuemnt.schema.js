import z from "zod";

export const documentSchema = z.object({
  body: z.object({
    title: z.string().min(10),
  }),
});
