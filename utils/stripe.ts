
import Stripe from "stripe";
import { must } from "./env";

export const stripe = new Stripe(must("STRIPE_SECRET_KEY"), {
    // apiVersion: "2024-06-20", // optional; remove to use account default
});
