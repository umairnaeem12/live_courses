import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

export interface JWTPayload { userId: number; role: "student" | "instructor" }
declare module "express-serve-static-core" { interface Request { user?: JWTPayload } }

export function auth(req: Request, res: Response, next: NextFunction) {
  const token = (req.headers.authorization || "").replace("Bearer ", "");
  if (!token) return res.status(401).json({ error: "Missing token" });

  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET!) as JWTPayload;
    next();
  } catch {
    return res.status(401).json({ error: "Invalid token" });
  }
}
