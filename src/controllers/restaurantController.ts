import { Request, Response } from "express";
import Restaurant from "../models/restaurantModel";
import { uploadImage } from "../utils";
import mongoose from "mongoose";

export const createRestaurant = async (req: Request, res: Response) => {
  try {
    const existingRestaurant = await Restaurant.findOne({ user: req.user._id });

    if (existingRestaurant) {
      return res
        .status(409)
        .json({ status: "fail", message: "User restaurant already exists" });
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
  } catch (error) {
    console.log(error);
    res.status(500).json({ status: "error", message: "Something went wrong" });
  }
};

export const getRestaurant = async (req: Request, res: Response) => {
  try {
    const id = req.user._id;
    const restaurant = await Restaurant.findOne({ user: id });

    if (!restaurant) {
      return res
        .status(404)
        .json({ status: "fail", message: "restaurant not found" });
    }
    res.status(200).json({
      status: "success",
      data: { restaurant },
    });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ status: "error", message: "Error fetching restaurant" });
  }
};
