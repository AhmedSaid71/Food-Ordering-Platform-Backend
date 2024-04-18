import { Request, Response } from "express";
import { createSendToken } from "../utils";
import User from "../models/userModel";

export const signup = async (req: Request, res: Response) => {
  try {
    const { name, email, password, passwordConfirm } = req.body;

    const user = await User.findOne({ email });
    if (user) {
      return res.status(409).json({
        status: "failed",
        message: "Email already signed up!",
      });
    }

    const newUser = await User.create({
      name,
      email,
      password,
      passwordConfirm,
    });
    createSendToken(newUser, 201, res);
  } catch (error) {
    console.log(error);
    res.status(500).json({ status: "Error", message: "Error creating user" });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    console.log(req.cookies);
    if (!email || !password)
      return res
        .status(400)
        .json({ status: "error", message: "Email and password are required" });

    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return res
        .status(404)
        .json({ status: "failed", message: "User not found!" });
    }

    if (!(await user.correctPassword(password, user.password))) {
      return res
        .status(401)
        .json({ status: "error", message: "Incorrect email or password" });
    }

    createSendToken(user, 200, res);
  } catch (error) {
    console.log(error);
    res.status(500).json({ status: "Error", message: "Error creating user" });
  }
};
