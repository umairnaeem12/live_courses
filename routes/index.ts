import { Router } from "express";
import AuthRouter from "./auth.routes";
import CourseRouter from "./course.routes";
import CourseMaterialRouter from "./materials.routes";
import PaymentRouter from "./payment.routes";
import StreamRouter from "./stream.routes";

const router = Router();
router.use("/auth", AuthRouter);
router.use("/courses", CourseRouter);
router.use("/material", CourseMaterialRouter);
router.use("/payments", PaymentRouter);
router.use("/streams", StreamRouter);
export default router;
