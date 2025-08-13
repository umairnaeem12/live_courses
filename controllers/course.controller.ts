// src/controllers/course.controller.ts
import { Request, Response, NextFunction } from "express";
import { createCourseSchema } from "../validators/course.validation";
import * as CourseService from "../services/course.service";
import { sendApiResponse } from "../utils/sendApiResponse";

export const createCourse = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = req.user!.userId;
        const parsed = createCourseSchema.parse({ ...req.body, userId });
        const result = await CourseService.createCourseService(parsed);
        return sendApiResponse(res, 201, "Course created successfully.", result);
    } catch (error) {
        next(error);
    }
};

export const getCourse = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = Number(req.params.id);
        const userId = req.user?.userId;

        const result = await CourseService.getCourseService(id, userId);

        return sendApiResponse(res, 200, "Course fetched successfully.", result);
    } catch (error) {
        next(error);
    }
};

export const getAllCourse = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const result = await CourseService.getAllCoursesService();
        return sendApiResponse(res, 200, "Courses fetched successfully.", result);
    } catch (error) {
        next(error);
    }
};

export * as CourseController from "./course.controller";