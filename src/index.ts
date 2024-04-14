import express, { Request, Response } from "express";
import cors from "cors";
import "dotenv/config";
import mongoose from "mongoose";
import userRoute from "./routes/userRoute";

mongoose
  .connect(process.env.MONGODB_CONNECTION_STRING as string)
  .then(() => {
    console.log("Connected to Database!");
  })
  .catch((err) => {
    console.log(err);
  });

const app = express();
app.use(express.json());
app.use(cors());

app.get("/health", (req: Request, res: Response) => {
  res.status(200).json({ status: "success", message: "health OK!" });
});

app.use("/api/v1/user", userRoute);

const PORT = process.env.PORT || `8000`;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
