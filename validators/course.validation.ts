import { z } from "zod";

export const createCourseSchema = z.object({
    title: z.string().min(2),
    priceCents: z.number().int().positive(),
    userId: z.number().int().positive(),
});

export type CreateCourseInput = z.infer<typeof createCourseSchema>;
