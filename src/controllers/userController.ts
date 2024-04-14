import { Request, Response } from "express";

export const updateMe = (req: Request, res: Response) => {
  try {
    const { name, addressLine1, city, country } = req.body;
  } catch (error) {
    console.log(error);
    res.status(500).json({ status: "Error", message: "Error updating user" });
  }
};
