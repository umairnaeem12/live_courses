import { Request, Response, NextFunction } from "express";
export const requireRole = (role: "student" | "instructor") =>
    (req: Request, res: Response, next: NextFunction) => {
    return req.user?.role === role ? next() : res.status(403).json({ error: "Forbidden" });
};
