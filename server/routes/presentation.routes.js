import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";

import authMiddleware from "../middleware/isAuth.js";

import {
  deletePresentation,
  getMyPresentations,
  getPresentation,
  getPresentationSlides,
  streamPresentationFile,
  uploadPresentation,
} from "../controller/presentation.controller.js";

const uploadPath = path.resolve("uploads");

fs.mkdirSync(uploadPath, { recursive: true });

const storage = multer.diskStorage({
  destination: uploadPath,

  filename: (_req, file, callback) => {
    callback(
      null,
      `${Date.now()}-${Math.round(Math.random() * 1e9)}${path
        .extname(file.originalname)
        .toLowerCase()}`
    );
  },
});

const upload = multer({
  storage,

  limits: {
    fileSize: 20 * 1024 * 1024,
  },

  fileFilter: (_req, file, callback) => {
    const isPpt =
      [
        "application/vnd.ms-powerpoint",
        "application/vnd.openxmlformats-officedocument.presentationml.presentation",
      ].includes(file.mimetype) || /\.pptx?$/i.test(file.originalname);

    callback(
      isPpt
        ? null
        : new Error("Only PPT and PPTX files are allowed."),
      isPpt
    );
  },
});

const router = express.Router();

router.use(authMiddleware);

// Get all presentations
router.get("/", getMyPresentations);

// Upload PPT/PPTX
router.post(
  "/upload",
  upload.single("file"),
  uploadPresentation
);

// Get single presentation
router.get("/:id", getPresentation);

// Get PPTX slides
router.get(
  "/:id/slides",
  getPresentationSlides
);

// Get original PPT/PPTX file
router.get(
  "/:id/file",
  streamPresentationFile
);

// Delete presentation
router.delete(
  "/:id",
  deletePresentation
);

export default router;
