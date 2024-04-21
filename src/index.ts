import express, { Request, Response } from "express";
import cors from "cors";
import "dotenv/config";
import mongoose from "mongoose";
import userRoute from "./routes/userRoute";
import authRoute from "./routes/authRoute";
import restaurantRoute from "./routes/restaurantRoute";
import cookieParser from "cookie-parser";
import { v2 as cloudinary } from "cloudinary";
mongoose
  .connect(process.env.MONGODB_CONNECTION_STRING as string)
  .then(() => {
    console.log("Connected to Database!");
  })
  .catch((err) => {
    console.log(err);
  });

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const app = express();
app.use(express.json());
app.use(cookieParser());
const corsOptions = {
  origin: "http://localhost:5173",
  credentials: true,
  optionSuccessStatus: 200,
};
app.use(cors(corsOptions));

app.get("/health", (req: Request, res: Response) => {
  res.status(200).json({ status: "success", message: "health OK!" });
});

app.use("/api/v1/auth", authRoute);
app.use("/api/v1/user", userRoute);
app.use("/api/v1/restaurant", restaurantRoute);

const PORT = process.env.PORT || `8000`;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
