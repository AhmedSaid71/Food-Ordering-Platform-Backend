import express from "express";
import { createRestaurant } from "../controllers";
import { upload } from "../middlewares";

const router = express.Router();

router.post("/", upload.single("imageFile"), createRestaurant);
export default router;
