import express from "express";
import { login, signup } from "../controllers";
import { updateMe, getMe } from "../controllers";
import { protect } from "../middlewares";
import { updateUserValidator } from "../utils";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);

router.use(protect);

router.get("/me", getMe);
router.patch("/updateMe", updateUserValidator, updateMe);

export default router;
