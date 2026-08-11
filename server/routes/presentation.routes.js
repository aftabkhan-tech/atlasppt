import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import authMiddleware from "../middleware/isAuth.js";
import { deletePresentation, getMyPresentations, getPresentation, getPresentationSlides, streamPresentationFile, streamRenderedPresentation, uploadPresentation } from "../controller/presentation.controller.js";

const uploadPath = path.resolve("uploads");
fs.mkdirSync(uploadPath, { recursive: true });
const storage = multer.diskStorage({
  destination: uploadPath,
  filename: (_req, file, callback) => callback(null, `${Date.now()}-${Math.round(Math.random() * 1e9)}${path.extname(file.originalname).toLowerCase()}`),
});
const upload = multer({
  storage,
  limits: { fileSize: 20 * 1024 * 1024 },
  fileFilter: (_req, file, callback) => {
    const isPpt = ["application/vnd.ms-powerpoint", "application/vnd.openxmlformats-officedocument.presentationml.presentation"].includes(file.mimetype) || /\.pptx?$/i.test(file.originalname);
    callback(isPpt ? null : new Error("Only PPT and PPTX files are allowed."), isPpt);
  },
});

const router = express.Router();
router.use(authMiddleware);
router.get("/", getMyPresentations);
router.post("/upload", upload.single("file"), uploadPresentation);
router.get("/:id", getPresentation);
router.get("/:id/slides", getPresentationSlides);
router.get("/:id/file", streamPresentationFile);
router.get("/:id/rendered", streamRenderedPresentation);
router.delete("/:id", deletePresentation);
export default router;
