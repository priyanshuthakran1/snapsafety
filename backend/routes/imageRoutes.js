import express from "express";
import {
  uploadImage,
  getImages,
  getImageById,
  deleteImage,
  getLabels,
  upload,
} from "../controllers/imageController.js";

const router = express.Router();

router.post("/", upload.single("image"), uploadImage);
router.get("/", getImages);
router.get("/labels", getLabels);
router.get("/:id", getImageById);
router.delete("/:id", deleteImage);

export default router;