import fs from "fs";
import path from "path";
import Presentation from "../models/presentation.model.js";
import JSZip from "jszip";
import { XMLParser } from "fast-xml-parser";
import { fileURLToPath } from "url";

// Keep uploads in the server directory even if Node is started from the repo root.
const serverDirectory = path.dirname(fileURLToPath(import.meta.url));
const uploadDirectory = path.resolve(serverDirectory, "../uploads");


// ===============================
// UPLOAD PRESENTATION
// ===============================
export const uploadPresentation = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({
      success: false,
      message: "Please choose a PPT or PPTX file.",
    });
  }

  try {
    let slideCount = 0;

    // PPTX is a ZIP file, so we can count slides directly
    if (/\.pptx$/i.test(req.file.originalname)) {
      const zip = await JSZip.loadAsync(
        await fs.promises.readFile(req.file.path)
      );

      slideCount = Object.keys(zip.files).filter(
        (name) => /^ppt\/slides\/slide\d+\.xml$/.test(name)
      ).length;
    }

    const presentation = await Presentation.create({
      owner: req.userId,
      originalName: req.file.originalname,
      storedName: req.file.filename,
      mimeType: req.file.mimetype,
      size: req.file.size,
      renderedName: null,
      slideCount,
    });

    return res.status(201).json({
      success: true,
      message: "Presentation uploaded successfully",
      presentation: serialize(presentation),
    });

  } catch (error) {
    // Delete uploaded file if something fails
    fs.unlink(req.file.path, () => {});

    console.error("Upload presentation error:", error);

    return res.status(500).json({
      success: false,
      message: "Could not save presentation.",
    });
  }
};


// ===============================
// GET MY PRESENTATIONS
// ===============================
export const getMyPresentations = async (req, res) => {
  try {
    const presentations = await Presentation.find({
      owner: req.userId,
    }).sort({ createdAt: -1 });

    return res.json({
      success: true,
      presentations: presentations.map(serialize),
    });

  } catch (error) {
    console.error("Get presentations error:", error);

    return res.status(500).json({
      success: false,
      message: "Could not fetch presentations.",
    });
  }
};


// ===============================
// GET SINGLE PRESENTATION
// ===============================
export const getPresentation = async (req, res) => {
  try {
    const presentation = await Presentation.findOne({
      _id: req.params.id,
      owner: req.userId,
    });

    if (!presentation) {
      return res.status(404).json({
        success: false,
        message: "Presentation not found.",
      });
    }

    return res.json({
      success: true,
      presentation: serialize(presentation),
    });

  } catch (error) {
    console.error("Get presentation error:", error);

    return res.status(500).json({
      success: false,
      message: "Could not fetch presentation.",
    });
  }
};


// ===============================
// STREAM ORIGINAL PPT/PPTX FILE
// ===============================
export const streamPresentationFile = async (req, res) => {
  try {
    const presentation = await Presentation.findOne({
      _id: req.params.id,
      owner: req.userId,
    });

    if (!presentation) {
      return res.status(404).json({
        success: false,
        message: "Presentation not found.",
      });
    }

    const filePath = path.join(
      uploadDirectory,
      presentation.storedName
    );

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({
        success: false,
        message: "Stored file not found.",
      });
    }

    res.type(presentation.mimeType);

    res.setHeader(
      "Content-Disposition",
      `inline; filename="${encodeURIComponent(
        presentation.originalName
      )}"`
    );

    return res.sendFile(filePath);

  } catch (error) {
    console.error("Stream presentation error:", error);

    return res.status(500).json({
      success: false,
      message: "Could not open presentation.",
    });
  }
};


// ===============================
// GET PPTX SLIDES
// ===============================
export const getPresentationSlides = async (req, res) => {
  try {
    const presentation = await Presentation.findOne({
      _id: req.params.id,
      owner: req.userId,
    });

    if (!presentation) {
      return res.status(404).json({
        success: false,
        message: "Presentation not found.",
      });
    }

    // Browser slide parser supports PPTX only
    if (!/\.pptx$/i.test(presentation.originalName)) {
      return res.status(422).json({
        success: false,
        message:
          "Browser presentation is available for PPTX files. Please upload a PPTX presentation.",
      });
    }

    const filePath = path.join(
      uploadDirectory,
      presentation.storedName
    );

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({
        success: false,
        message: "Presentation file not found.",
      });
    }

    // Read PPTX as ZIP
    const zip = await JSZip.loadAsync(
      await fs.promises.readFile(filePath)
    );

    const parser = new XMLParser();

    // Find all slide XML files
    const slideFiles = Object.keys(zip.files)
      .filter((name) =>
        /^ppt\/slides\/slide\d+\.xml$/.test(name)
      )
      .sort(
        (a, b) =>
          Number(a.match(/slide(\d+)/)[1]) -
          Number(b.match(/slide(\d+)/)[1])
      );

    // Read every slide
    const slides = await Promise.all(
      slideFiles.map(async (slideFile, index) => {
        const xml = await zip.files[slideFile].async("string");

        const parsedXML = parser.parse(xml);

        const text = collectText(parsedXML)
          .join(" ")
          .replace(/\s+/g, " ")
          .trim();

        return {
          id: index + 1,
          text:
            text ||
            "This slide has no readable text content.",
        };
      })
    );

    return res.json({
      success: true,
      presentation: serialize(presentation),
      slides,
    });

  } catch (error) {
    console.error("PPTX parse error:", error);

    return res.status(500).json({
      success: false,
      message: "Could not read this PPTX presentation.",
    });
  }
};


// ===============================
// DELETE PRESENTATION
// ===============================
export const deletePresentation = async (req, res) => {
  try {
    const presentation = await Presentation.findOneAndDelete({
      _id: req.params.id,
      owner: req.userId,
    });

    if (!presentation) {
      return res.status(404).json({
        success: false,
        message: "Presentation not found.",
      });
    }

    // Delete original PPT/PPTX
    const filePath = path.join(
      uploadDirectory,
      presentation.storedName
    );

    fs.unlink(filePath, () => {});

    return res.json({
      success: true,
      message: "Presentation deleted successfully.",
    });

  } catch (error) {
    console.error("Delete presentation error:", error);

    return res.status(500).json({
      success: false,
      message: "Could not delete presentation.",
    });
  }
};


// ===============================
// SERIALIZE
// ===============================
function serialize(presentation) {
  return {
    id: presentation._id,
    name: presentation.originalName,
    type:
      presentation.originalName
        .split(".")
        .pop()
        ?.toUpperCase() || "PPTX",
    size: presentation.size,
    createdAt: presentation.createdAt,
    slideCount: presentation.slideCount,
  };
}


// ===============================
// COLLECT TEXT FROM XML
// ===============================
function collectText(value) {
  if (typeof value === "string") {
    return [value];
  }

  if (Array.isArray(value)) {
    return value.flatMap(collectText);
  }

  if (!value || typeof value !== "object") {
    return [];
  }

  return Object.entries(value).flatMap(
    ([key, item]) => {
      if (key === "a:t") {
        return collectText(item);
      }

      return collectText(item);
    }
  );
}
