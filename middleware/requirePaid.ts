import { Request, Response, NextFunction } from "express";
import { CourseRepository, PurchaseRepository } from "../repositories";
import { PurchaseStatus } from "../models/Purchase";

export async function requirePaid(req: Request, res: Response, next: NextFunction) {
    try {
        const userId = req.user?.userId;
        console.log("🚀 ~ requirePaid ~ userId:", userId)
        const courseId = Number(req.params.id ?? req.params.courseId);

        if (!userId) return res.status(401).json({ error: "Unauthorized" });
        // if (!courseId) return res.status(400).json({ error: "Missing courseId" });

        const course = await CourseRepository.findOne({ where: { id: courseId } });
        if (!course) return res.status(404).json({ error: "Course not found" });

        const purchase = await PurchaseRepository.findOne({
            where: {
                userId,
                courseId,
                status: PurchaseStatus.PAID,
            },
        });

        if (!purchase) return res.status(403).json({ error: "Not purchased" });

        return next();
    } catch (err) {
        console.error("requirePaid error:", err);
        return res.status(500).json({ error: "Internal Server Error" });
    }
}
