import { Request, Response } from "express";
import User from "../models/userModel";
import { filterObj } from "../utils";

export const getMe = async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.user._id);
    res.status(200).json({ status: "success", data: user });
  } catch (error) {
    res.status(500).json({ status: "Error", message: "Error getting user" });
  }
};

export const updateMe = async (req: Request, res: Response) => {
  try {
    const filterBody = filterObj(
      req.body,
      "name",
      "addressLine1",
      "city",
      "country"
    );

    const updatedUser = await User.findByIdAndUpdate(req.user._id, filterBody, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      status: "success",
      data: {
        user: updatedUser,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      status: "Error",
      message: "Error updating user",
    });
  }
};
