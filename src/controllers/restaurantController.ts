import mongoose from "mongoose";
import { NextFunction, Request, Response } from "express";
import Restaurant from "../models/restaurantModel";
import { ApiError, catchAsync, filterObj, uploadImage } from "../utils";

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
    const restaurant = await Restaurant.create({
      ...req.body,
      imageUrl,
      user: req.user._id,
    });
    console.log(restaurant);
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

export const updateRestaurant = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const restaurant = await Restaurant.findOne({ user: req.user._id });
    if (!restaurant) return next(new ApiError("Restaurant not found!", 404));

    let filterBody = filterObj(
      req.body,
      "name",
      "city",
      "deliveryPrice",
      "country",
      "estimatedDeliveryTime",
      "cuisines",
      "menuItems"
    );

    if (req.file) {
      const imageUrl = await uploadImage(req.file as Express.Multer.File);
      filterBody = { ...filterBody, imageUrl };
    }
    const updatedRestaurant = await Restaurant.findOneAndUpdate(
      { user: req.user._id },
      filterBody
    );

    res.status(200).json({
      status: "success",
      message: "Restaurant updated successfully",
      data: { restaurant: updatedRestaurant },
    });
  }
);
