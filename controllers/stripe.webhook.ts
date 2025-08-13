import type Stripe from "stripe";
import { Request, Response } from "express";
import { stripe } from "../utils/stripe";
import { must } from "../utils/env";
import { PurchaseRepository } from "../repositories";
import { PurchaseStatus } from "../models/Purchase";

async function markPaid(purchaseId?: number, paymentIntentId?: string, sessionId?: string) {
    if (!purchaseId && sessionId) {
        const bySession = await PurchaseRepository.findOne({ where: { providerSessionId: sessionId } });
        if (bySession) purchaseId = bySession.id;
    }
    if (!purchaseId) return;

    const p = await PurchaseRepository.findOneBy({ id: purchaseId });
    if (!p) return;
    if (p.status === PurchaseStatus.PAID) return;

    p.status = PurchaseStatus.PAID;
    if (paymentIntentId) p.providerChargeId = paymentIntentId;
    await PurchaseRepository.save(p);
}

export async function stripeWebhook(req: Request, res: Response) {

    console.log("📩 Webhook endpoint hit");
    if (!req.body || !req.headers["stripe-signature"]) {
        return res.status(400).send("Webhook Error: No body or signature");
    }
    const sig = req.headers["stripe-signature"] as string;
    let event: Stripe.Event;

    try {
        event = stripe.webhooks.constructEvent(req.body, sig, must("STRIPE_WEBHOOK_SECRET"));
    } catch (err: any) {
        console.error("❌ Webhook signature error:", err.message);
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    try {
        console.log(`[Stripe] ${event.type} id=${event.id}`);

        switch (event.type) {
            case "checkout.session.completed": {
                const s = event.data.object as Stripe.Checkout.Session;
                await markPaid(Number(s.metadata?.purchaseId), s.payment_intent as string, s.id);
                break;
            }
            case "payment_intent.succeeded": {
                const pi = event.data.object as Stripe.PaymentIntent;
                await markPaid(Number(pi.metadata?.purchaseId), pi.id, pi.metadata?.providerSessionId as string | undefined);
                break;
            }
            // (optional) handle refunds/cancellations here
            default:
                break;
        }

        return res.json({ received: true });
    } catch (e: any) {
        console.error("❌ Webhook handler error:", e);
        return res.status(500).send(e.message);
    }
}
