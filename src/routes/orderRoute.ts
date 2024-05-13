import express from "express";
import { protect } from "../middlewares";
import { createCheckoutSession, stripeWebhookHandler } from "../controllers";

const router = express.Router();

router.post(
  "/checkout/create-checkout-session",
  protect,
  createCheckoutSession
);
router.post("/checkout/webhook", stripeWebhookHandler);
export default router;
