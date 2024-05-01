import express from "express";

import {
  createRestaurant,
  getRestaurant,
  getRestaurants,
  getUserRestaurant,
  updateUserRestaurant,
} from "../controllers";

import { protect, upload } from "../middlewares";
import {
  createRestaurantValidator,
  getAllUserRestaurantsValidator,
  getUserRestaurantsValidator,
} from "../utils";

const router = express.Router();

router.get("/me", upload.single("imageFile"), protect, getUserRestaurant);
router.get("/:city", getAllUserRestaurantsValidator, getRestaurants);
router.get("/:id", getUserRestaurantsValidator, getRestaurant);
router.post(
  "/",
  upload.single("imageFile"),
  createRestaurantValidator,
  protect,
  createRestaurant
);
router.patch("/", upload.single("imageFile"), protect, updateUserRestaurant);

export default router;
