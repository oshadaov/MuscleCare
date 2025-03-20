import express from "express";
import { upload } from "../../middleware/uploadMiddleware.js";
import { adminAuth } from "../../middleware/adminAuth.js";
import {
  getRotatorImages,
  getAdminRotatorImages,
  createRotatorImage,
  updateRotatorImage,
  deleteRotatorImage,
} from "../../controllers/adminImageController.js";

const router = express.Router();

// Public Route
router.get("/", getRotatorImages);

// Admin Routes
router.get("/admin", adminAuth, getAdminRotatorImages);
router.post("/admin", adminAuth, upload.single("image"), createRotatorImage);
router.put("/admin/:id", adminAuth, upload.single("image"), updateRotatorImage);
router.delete("/admin/:id", adminAuth, deleteRotatorImage);

export default router;
