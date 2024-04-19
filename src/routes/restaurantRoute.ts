import express from "express";
import { createRestaurant } from "../controllers";
import { protect, upload } from "../middlewares";
import { createRestaurantValidator } from "../utils";

const router = express.Router();

router.post(
  "/",
  upload.single("imageFile"),
  createRestaurantValidator,
  protect,
  createRestaurant
);
export default router;
