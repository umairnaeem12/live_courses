import { Request, Response } from "express";
import { loginSchema, registerSchema } from "../validators/auth.validation";
import { AuthService } from "../services/auth.service";
import { sendApiResponse } from "../utils/sendApiResponse";

export async function register(req: Request, res: Response) {
    try {
        const input = registerSchema.parse(req.body);
        const result = await AuthService.registerService(input);
        return sendApiResponse(res, 200, "User Created successfully.", result);
    } catch (err: any) {
        res.status(400).json({ error: err.message ?? "Registration failed" });
    }
}

export async function login(req: Request, res: Response) {
    try {
        const input = loginSchema.parse(req.body);
        const result = await AuthService.loginService(input);
        return sendApiResponse(res, 200, "User Login successfully.", result);
    } catch (err: any) {
        res.status(400).json({ error: err.message ?? "Login failed" });
    }
}

export * as AuthController from "./auth.controller";
