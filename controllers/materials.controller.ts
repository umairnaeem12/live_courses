// src/controllers/materials.controller.ts
import { Request, Response } from "express";
import { CourseRepository, CourseMaterialRepository, PurchaseRepository } from "../repositories";
import { PurchaseStatus } from "../models/Purchase";
import { S3Service } from "../services/storage.service";
import { uploadUrlSchema, downloadUrlSchema } from "../validators/materials.validation";

const sanitize = (name: string) => name.replace(/[^a-zA-Z0-9._-]/g, "_");

export async function createUploadUrl(req: Request, res: Response) {
    try {
        const input = uploadUrlSchema.parse(req.body);

        const course = await CourseRepository.findOne({
            where: { id: input.courseId },
            relations: ["instructor", "instructor.user"],
        });
        if (!course) return res.status(404).json({ error: "Course not found" });

        // owner check via your middleware's req.user
        if (req.user!.userId !== course.instructor.user.id) {
            return res.status(403).json({ error: "Forbidden" });
        }

        const safeName = sanitize(input.fileName);
        const key = `instructors/${course.instructor.id}/courses/${course.id}/${Date.now()}-${safeName}`;

        const uploadUrl = await S3Service.getUploadUrl(key, input.contentType);

        const material = CourseMaterialRepository.create({
            course,
            s3Key: key,
            kind: input.kind,
            originalName: input.fileName,
            contentType: input.contentType,
        });
        await CourseMaterialRepository.save(material);

        return res.json({ uploadUrl, s3Key: key, materialId: material.id });
    } catch (err: any) {
        if (err?.issues) return res.status(400).json({ error: "Invalid body", details: err.issues });
        return res.status(500).json({ error: "Internal server error" });
    }
}

export async function createDownloadUrl(req: Request, res: Response) {
    try {
        const input = downloadUrlSchema.parse({
            courseId: Number(req.params.courseId),
            materialId: Number(req.params.materialId),
        });

        const material = await CourseMaterialRepository.findOne({
            where: { id: input.materialId },
            relations: ["course", "course.instructor", "course.instructor.user"],
        });
        if (!material || material.course.id !== input.courseId) {
            return res.status(404).json({ error: "Material not found" });
        }

        const userId = req.user!.userId;
        const ownerId = material.course.instructor.user.id;

        // non-owner must have paid
        if (userId !== ownerId) {
            const paid = await PurchaseRepository.findOne({
                where: { userId, courseId: material.course.id, status: PurchaseStatus.PAID },
            });
            if (!paid) return res.status(403).json({ error: "No access" });
        }

        const url = await S3Service.getDownloadUrl(material.s3Key, material.originalName ?? undefined);
        return res.json({ url });
    } catch (err: any) {
        if (err?.issues) return res.status(400).json({ error: "Invalid query", details: err.issues });
        return res.status(500).json({ error: "Internal server error" });
    }
}

export * as MaterialsController from "./materials.controller";
