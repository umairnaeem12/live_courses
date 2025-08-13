import { Router } from "express";
import { requirePaid } from "../middleware/requirePaid";
import { StreamController } from "../controllers/stream.controller";

const StreamRouter = Router();
StreamRouter.get("/courses/:courseId/stream-url", requirePaid, StreamController.getSignedPlayback);
export default StreamRouter;
