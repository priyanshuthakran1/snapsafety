import mongoose from "mongoose";

const detectionSchema = new mongoose.Schema({
  label: String,
  confidence: Number,
  bbox: {
    x: Number,
    y: Number,
    width: Number,
    height: Number,
  },
});

const imageSchema = new mongoose.Schema({
  filename: String,
  detections: [detectionSchema],
  detections_hash: String,
  uploadedAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("Image", imageSchema);