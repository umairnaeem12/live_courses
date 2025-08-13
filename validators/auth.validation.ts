import { z } from "zod";
import { UserRole } from "../enums/UserRole.enum";

export const registerSchema = z.object({
    name: z.string().min(2),
    email: z.string().email(),
    password: z.string().min(6),
    role: z.enum(UserRole),
});

export type RegisterInput = z.infer<typeof registerSchema>;

export const loginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
    role: z.enum(UserRole),
});
export type LoginInput = z.infer<typeof loginSchema>;
