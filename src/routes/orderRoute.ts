import express from "express";
import { protect } from "../middlewares";
import { createCheckoutSession } from "../controllers";

const router = express.Router();

router.post(
  "/checkout/create-checkout-session",
  protect,
  createCheckoutSession
);
export default router;
