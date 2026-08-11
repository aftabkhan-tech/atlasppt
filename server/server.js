import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import connectdb from "./config/db.js";
import router from "./routes/user.routes.js";
import cookieParser from "cookie-parser";
import userRouter from "./routes/userRoute.js";
import presentationRouter from "./routes/presentation.routes.js";
import multer from "multer";

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors({
  origin: "https://presento-eaei.onrender.com",
  credentials: true
}));




app.use('/api/auth',router)
app.use('/api/user',userRouter)
app.use('/api/ppt', presentationRouter)

app.use((error, _req, res, _next) => {
  if (error instanceof multer.MulterError && error.code === "LIMIT_FILE_SIZE") return res.status(400).json({ success: false, message: "File size must be less than 20MB." });
  if (error) return res.status(400).json({ success: false, message: error.message || "Upload failed." });
});




const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  connectdb()
});
