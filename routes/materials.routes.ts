import { Router, Request, Response, NextFunction } from "express";
import { auth } from "../middleware/auth";
import { MaterialsController } from "../controllers/materials.controller";

const router = Router();

// minimal role guard using req.user from your auth middleware
function allowRoles(...roles: Array<"student" | "instructor">) {
    return (req: Request, res: Response, next: NextFunction) => {
        const role = req.user?.role;
        if (!role || !roles.includes(role)) return res.status(403).json({ error: "Forbidden" });
        next();
    };
}

router.post("/upload-url", auth, allowRoles("instructor"), MaterialsController.createUploadUrl);
router.get(
    "/download-url/:courseId/:materialId",
    auth,
    allowRoles("student", "instructor"),
    MaterialsController.createDownloadUrl
);


export default router;
