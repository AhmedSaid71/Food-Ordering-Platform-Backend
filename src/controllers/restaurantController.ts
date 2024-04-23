import mongoose from "mongoose";
import { NextFunction, Request, Response } from "express";
import Restaurant from "../models/restaurantModel";
import { ApiError, catchAsync, uploadImage } from "../utils";

export const createRestaurant = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const existingRestaurant = await Restaurant.findOne({
      user: req.user._id,
    });

    if (existingRestaurant) {
      return next(
        new ApiError("You have already created your restaurant!", 409)
      );
    }

    const imageUrl = await uploadImage(req.file as Express.Multer.File);
    const restaurant = new Restaurant(req.body);
    restaurant.imageUrl = imageUrl;
    restaurant.user = new mongoose.Types.ObjectId(req.user._id);

    await restaurant.save();

    res.status(201).json({
      status: "success",
      message: "Restaurant created successfully",
      data: { restaurant },
    });
  }
);

export const getRestaurant = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = req.user._id;
    const restaurant = await Restaurant.findOne({ user: id });

    if (!restaurant) {
      return next(new ApiError("Restaurant not found!", 404));
    }

    res.status(200).json({
      status: "success",
      data: { restaurant },
    });
  }
);
