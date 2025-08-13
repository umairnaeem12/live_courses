import { Router } from "express";
import { requireRole } from "../middleware/requireRole";
import { PaymentController } from "../controllers/payment.controller";
import { auth } from "../middleware/auth";

const PaymentRouter = Router();
PaymentRouter.post("/create-session", auth, requireRole("student"), PaymentController.createCheckoutSession);

export default PaymentRouter;
