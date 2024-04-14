import express from "express";
import { login, signup } from "../controllers/authController";
import { updateMe } from "../controllers/userController";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);

router.patch("/updateMe", updateMe);

export default router;
