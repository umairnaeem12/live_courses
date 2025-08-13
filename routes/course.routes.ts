import { Router } from "express";
import * as CourseController from "../controllers/course.controller";
import { requirePaid } from "../middleware/requirePaid";
import { requireRole } from "../middleware/requireRole";
import { auth } from "../middleware/auth";

const CourseRouter = Router();

CourseRouter.post(
  "/create",
  auth,
  requireRole("instructor"),
  CourseController.createCourse
);
CourseRouter.get("/getAllCourses",
  auth,
  CourseController.getAllCourse);
CourseRouter.get("/:id", auth, CourseController.getCourse);

export default CourseRouter;
