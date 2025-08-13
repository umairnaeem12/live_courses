import Stripe from "stripe";
import { Request, Response, NextFunction } from "express";
import { CourseRepository, PurchaseRepository, UserRepository } from "../repositories";
import { PurchaseStatus } from "../models/Purchase";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: "2025-07-30.basil"
});

export const createCheckoutSession = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = req.user!.userId;
        const { courseId } = req.body as { courseId: number };

        const [user, course] = await Promise.all([
            UserRepository.findOneByOrFail({ id: userId }),
            CourseRepository.findOneByOrFail({ id: courseId }),
        ]);

        // already paid?
        const alreadyPaid = await PurchaseRepository.findOne({
            where: { userId, courseId, status: PurchaseStatus.PAID },
        });
        if (alreadyPaid) return res.status(200).json({ alreadyPaid: true });

        // create PENDING purchase
        let purchase = PurchaseRepository.create({
            userId,
            courseId,
            status: PurchaseStatus.PENDING,
            providerSessionId: null,
            providerChargeId: null,
        });
        purchase = await PurchaseRepository.save(purchase);

        // build absolute URLs
        const BASE = process.env.APP_BASE_URL || "http://localhost:3001";
        const success_url = new URL(`/courses/${courseId}?paid=1`, BASE).toString();
        const cancel_url = new URL(`/courses/${courseId}?canceled=1`, BASE).toString();

        const session = await stripe.checkout.sessions.create({
            mode: "payment",
            customer_email: user.email,
            line_items: [
                {
                    quantity: 1,
                    price_data: {
                        currency: "usd",
                        unit_amount: course.priceCents,
                        product_data: { name: course.title },
                    },
                },
            ],
            metadata: {
                courseId: String(courseId),
                userId: String(userId),
                purchaseId: String(purchase.id),
            },
            payment_intent_data: {
                metadata: {
                    courseId: String(courseId),
                    userId: String(userId),
                    purchaseId: String(purchase.id),
                },
            },
            success_url,
            cancel_url,
        });

        purchase.providerSessionId = session.id;
        await PurchaseRepository.save(purchase);

        return res.status(200).json({ url: session.url });
    } catch (err) {
        next(err);
    }
};

export * as PaymentController from "./payment.controller";