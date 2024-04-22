import express from "express";
import { createRestaurant, getRestaurant } from "../controllers";
import { protect, upload } from "../middlewares";
import { createRestaurantValidator } from "../utils";

const router = express.Router();

router.get("/", upload.single("imageFile"), protect, getRestaurant);
router.post(
  "/",
  upload.single("imageFile"),
  createRestaurantValidator,
  protect,
  createRestaurant
);
export default router;
