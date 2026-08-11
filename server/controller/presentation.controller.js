import fs from "fs";
import path from "path";
import Presentation from "../models/presentation.model.js";
import JSZip from "jszip";
import { XMLParser } from "fast-xml-parser";
import { execFile } from "child_process";
import { promisify } from "util";

const uploadDirectory = path.resolve("uploads");
const renderedDirectory = path.resolve("rendered");
const execFileAsync = promisify(execFile);

export const uploadPresentation = async (req, res) => {
  if (!req.file) return res.status(400).json({ success: false, message: "Please choose a PPT or PPTX file." });
  try {
    const rendered = await renderPresentation(req.file.path, req.file.filename);
    const presentation = await Presentation.create({
      owner: req.userId,
      originalName: req.file.originalname,
      storedName: req.file.filename,
      mimeType: req.file.mimetype,
      size: req.file.size,
      renderedName: rendered.fileName,
      slideCount: rendered.slideCount,
    });
    res.status(201).json({ success: true, message: "Presentation uploaded successfully", presentation: serialize(presentation) });
  } catch (error) {
    fs.unlink(req.file.path, () => {});
    console.error("Upload presentation error:", error);
    res.status(500).json({ success: false, message: "Could not save presentation." });
  }
};

export const streamRenderedPresentation = async (req, res) => {
  const presentation = await Presentation.findOne({ _id: req.params.id, owner: req.userId });
  if (!presentation) return res.status(404).json({ success: false, message: "Presentation not found." });
  try {
    if (!presentation.renderedName || !fs.existsSync(path.join(renderedDirectory, presentation.renderedName))) {
      const rendered = await renderPresentation(path.join(uploadDirectory, presentation.storedName), presentation.storedName);
      presentation.renderedName = rendered.fileName;
      presentation.slideCount = rendered.slideCount;
      await presentation.save();
    }
    res.type("application/pdf");
    res.setHeader("X-Slide-Count", String(presentation.slideCount));
    res.sendFile(path.join(renderedDirectory, presentation.renderedName));
  } catch (error) {
    console.error("Presentation render error:", error);
    res.status(500).json({ success: false, message: "Could not render this PowerPoint file." });
  }
};

export const getMyPresentations = async (req, res) => {
  const presentations = await Presentation.find({ owner: req.userId }).sort({ createdAt: -1 });
  res.json({ success: true, presentations: presentations.map(serialize) });
};

export const getPresentation = async (req, res) => {
  const presentation = await Presentation.findOne({ _id: req.params.id, owner: req.userId });
  if (!presentation) return res.status(404).json({ success: false, message: "Presentation not found." });
  res.json({ success: true, presentation: serialize(presentation) });
};

export const streamPresentationFile = async (req, res) => {
  const presentation = await Presentation.findOne({ _id: req.params.id, owner: req.userId });
  if (!presentation) return res.status(404).json({ success: false, message: "Presentation not found." });
  const filePath = path.join(uploadDirectory, presentation.storedName);
  if (!fs.existsSync(filePath)) return res.status(404).json({ success: false, message: "Stored file not found." });
  res.type(presentation.mimeType);
  res.setHeader("Content-Disposition", `inline; filename="${encodeURIComponent(presentation.originalName)}"`);
  res.sendFile(filePath);
};

export const getPresentationSlides = async (req, res) => {
  const presentation = await Presentation.findOne({ _id: req.params.id, owner: req.userId });
  if (!presentation) return res.status(404).json({ success: false, message: "Presentation not found." });
  if (!/\.pptx$/i.test(presentation.originalName)) {
    return res.status(422).json({ success: false, message: "Browser presentation is available for PPTX files. Please upload a PPTX presentation." });
  }
  try {
    const filePath = path.join(uploadDirectory, presentation.storedName);
    const zip = await JSZip.loadAsync(await fs.promises.readFile(filePath));
    const parser = new XMLParser();
    const slideFiles = Object.keys(zip.files)
      .filter((name) => /^ppt\/slides\/slide\d+\.xml$/.test(name))
      .sort((a, b) => Number(a.match(/slide(\d+)/)[1]) - Number(b.match(/slide(\d+)/)[1]));
    const slides = await Promise.all(slideFiles.map(async (slideFile, index) => {
      const xml = await zip.files[slideFile].async("string");
      const text = collectText(parser.parse(xml)).join(" ").replace(/\s+/g, " ").trim();
      return { id: index + 1, text: text || "This slide has no readable text content." };
    }));
    res.json({ success: true, presentation: serialize(presentation), slides });
  } catch (error) {
    console.error("PPTX parse error:", error);
    res.status(500).json({ success: false, message: "Could not read this PPTX presentation." });
  }
};

export const deletePresentation = async (req, res) => {
  const presentation = await Presentation.findOneAndDelete({ _id: req.params.id, owner: req.userId });
  if (!presentation) return res.status(404).json({ success: false, message: "Presentation not found." });
  fs.unlink(path.join(uploadDirectory, presentation.storedName), () => {});
  if (presentation.renderedName) fs.unlink(path.join(renderedDirectory, presentation.renderedName), () => {});
  res.json({ success: true, message: "Presentation deleted successfully." });
};

function serialize(presentation) {
  return {
    id: presentation._id,
    name: presentation.originalName,
    type: presentation.originalName.split(".").pop()?.toUpperCase() || "PPTX",
    size: presentation.size,
    createdAt: presentation.createdAt,
    slideCount: presentation.slideCount,
  };
}

async function renderPresentation(sourcePath, storedName) {
  await fs.promises.mkdir(renderedDirectory, { recursive: true });
  const fileName = `${path.parse(storedName).name}.pdf`;
  const outputPath = path.join(renderedDirectory, fileName);
  const encode = (value) => Buffer.from(value, "utf8").toString("base64");
  const script = `$inputFile = [Text.Encoding]::UTF8.GetString([Convert]::FromBase64String('${encode(sourcePath)}'))
$outputFile = [Text.Encoding]::UTF8.GetString([Convert]::FromBase64String('${encode(outputPath)}'))
$app = $null
$deck = $null
try {
  $app = New-Object -ComObject PowerPoint.Application
  $deck = $app.Presentations.Open($inputFile, $false, $true, $false)
  $count = $deck.Slides.Count
  $deck.SaveAs($outputFile, 32)
  Write-Output $count
} finally {
  if ($deck) { $deck.Close() }
  if ($app) { $app.Quit() }
}`;
  const encodedScript = Buffer.from(script, "utf16le").toString("base64");
  const { stdout } = await execFileAsync("powershell.exe", ["-NoProfile", "-NonInteractive", "-ExecutionPolicy", "Bypass", "-EncodedCommand", encodedScript], { timeout: 120000 });
  const slideCount = Number.parseInt(stdout.trim().match(/\d+/)?.[0] || "0", 10);
  if (!fs.existsSync(outputPath)) throw new Error("PowerPoint did not generate a PDF.");
  return { fileName, slideCount };
}

function collectText(value) {
  if (typeof value === "string") return [value];
  if (Array.isArray(value)) return value.flatMap(collectText);
  if (!value || typeof value !== "object") return [];
  return Object.entries(value).flatMap(([key, item]) => key === "a:t" ? collectText(item) : collectText(item));
}
