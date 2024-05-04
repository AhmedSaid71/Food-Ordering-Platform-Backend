import mongoose from "mongoose";
import { NextFunction, Request, Response } from "express";
import Restaurant from "../models/restaurantModel";
import { ApiError, catchAsync, filterObj, uploadImage } from "../utils";

export const getRestaurants = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { city } = req.params;

    const searchQuery = (req.query.searchQuery as string) || "";
    const selectedCuisines = (req.query.selectedCuisines as string) || "";
    const sortOption = (req.query.sortOption as string) || "lastUpdated";
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;

    const skip = (page - 1) * limit;
    let query: any = {};

    query["city"] = new RegExp(city, "i");

    const check = await Restaurant.countDocuments(query);
    if (!check) {
      return res.status(200).json({
        status: "success",
        results: 0,
        data: {
          restaurants: [],
        },
      });
    }

    if (selectedCuisines) {
      const cuisinesArray = selectedCuisines
        .split(",")
        .map((cuisine) => new RegExp(cuisine, "i"));
      query["cuisines"] = { $all: cuisinesArray };
    }

    if (searchQuery) {
      const searchRegex = new RegExp(searchQuery, "i");
      query["$or"] = [
        { name: searchRegex },
        { cuisines: { $in: [searchRegex] } },
      ];
    }
    const restaurants = await Restaurant.find(query)
      .sort({ [sortOption]: 1 })
      .skip(skip)
      .limit(limit)
      .lean();

    const total = await Restaurant.countDocuments(query);

    res.status(200).json({
      status: "success",
      total,
      page,
      pages: Math.ceil(total / limit),
      data: {
        restaurants,
      },
    });
  }
);

export const getRestaurant = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {}
);

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
    res.status(201).json({
      status: "success",
      message: "Restaurant created successfully",
      data: { restaurant },
    });
  }
);

export const getUserRestaurant = catchAsync(
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

export const updateUserRestaurant = catchAsync(
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
      filterBody,
      {
        new: true,
      }
    );

    res.status(200).json({
      status: "success",
      message: "Restaurant updated successfully",
      data: { restaurant: updatedRestaurant },
    });
  }
);
