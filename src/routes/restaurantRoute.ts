import express from "express";
import {
  createRestaurant,
  getRestaurant,
  updateRestaurant,
} from "../controllers";
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
router.patch(
  "/",
  upload.single("imageFile"),
  protect,
  updateRestaurant
);
export default router;
