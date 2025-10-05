// import Image from "../models/Image.js";
import Image from "../models/imageModel.js";
import crypto from "crypto";
import multer from "multer";
import path from "path";

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

export const upload = multer({ storage });

// Fake PPE detection function
function detectPPE() {
  const detections = [];
  const hasHelmet = Math.random() > 0.3;
  const hasVest = Math.random() > 0.4;

  if (hasHelmet) {
    detections.push({
      label: "helmet",
      confidence: 0.85 + Math.random() * 0.14,
      bbox: {
        x: 0.2 + Math.random() * 0.3,
        y: 0.1 + Math.random() * 0.2,
        width: 0.15 + Math.random() * 0.1,
        height: 0.15 + Math.random() * 0.1,
      },
    });
  }

  if (hasVest) {
    detections.push({
      label: "vest",
      confidence: 0.8 + Math.random() * 0.19,
      bbox: {
        x: 0.25 + Math.random() * 0.3,
        y: 0.3 + Math.random() * 0.2,
        width: 0.2 + Math.random() * 0.15,
        height: 0.25 + Math.random() * 0.15,
      },
    });
  }

  return detections;
}

// Generate hash from detections
function generateHash(detections) {
  const str = JSON.stringify(detections);
  return crypto.createHash("md5").update(str).digest("hex");
}

// Upload image
export const uploadImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const detections = detectPPE();
    const detections_hash = generateHash(detections);

    const image = new Image({
      filename: req.file.filename,
      detections,
      detections_hash,
    });

    await image.save();
    res.status(201).json(image);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all images with filters
export const getImages = async (req, res) => {
  try {
    const { limit = 10, offset = 0, label, from, to } = req.query;

    let query = {};

    if (label) {
      query["detections.label"] = label;
    }

    if (from || to) {
      query.uploadedAt = {};
      if (from) query.uploadedAt.$gte = new Date(from);
      if (to) query.uploadedAt.$lte = new Date(to);
    }

    const images = await Image.find(query)
      .sort({ uploadedAt: -1 })
      .skip(parseInt(offset))
      .limit(parseInt(limit));

    const total = await Image.countDocuments(query);

    res.json({ images, total });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get single image
export const getImageById = async (req, res) => {
  try {
    const image = await Image.findById(req.params.id);
    if (!image) {
      return res.status(404).json({ error: "Image not found" });
    }
    res.json(image);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete image
export const deleteImage = async (req, res) => {
  try {
    const image = await Image.findByIdAndDelete(req.params.id);
    if (!image) {
      return res.status(404).json({ error: "Image not found" });
    }
    res.json({ message: "Image deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all labels
export const getLabels = async (req, res) => {
  try {
    const labels = await Image.distinct("detections.label");
    res.json(labels);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};