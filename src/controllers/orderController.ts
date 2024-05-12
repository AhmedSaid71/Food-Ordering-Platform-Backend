import { NextFunction, Request, Response } from "express";
import Stripe from "stripe";
import { ApiError, catchAsync, createLineItems, createSession } from "../utils";
import { ICheckoutSessionRequest } from "../types";
import Restaurant from "../models/restaurantModel";

const STRIPE = new Stripe(process.env.STRIPE_API_KEY as string);
const FRONTEND_URL = process.env.FRONTEND_URL as string;
const STRIPE_ENDPOINT_SECRET = process.env.STRIPE_WEBHOOK_SECRET as string;

export const createCheckoutSession = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const checkoutSessionRequest: ICheckoutSessionRequest = req.body;

    const restaurant = await Restaurant.findById(
      checkoutSessionRequest.restaurantId
    );

    if (!restaurant) {
      return next(new ApiError("Restaurant not found!", 404));
    }

    const lineItems = createLineItems(
      checkoutSessionRequest,
      restaurant.menuItems
    );
    const session = await createSession(
      lineItems,
      "newOrder._id.toString()",
      restaurant.deliveryPrice,
      restaurant._id.toString()
    );

    if (!session.url) {
      return next(new ApiError("Error creating stripe checkout session", 500));
    }
    res.status(201).json({
      status: "success",
      message: "Session created successfully",
      url: session.url,
    });
  }
);
