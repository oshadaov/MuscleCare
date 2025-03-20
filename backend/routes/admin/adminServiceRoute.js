import express from "express"
import {
  getAllServices,
  getServiceById,
  createService,
  updateService,
  deleteService,
} from "../../controllers/adminServiceController.js"
import { adminAuth } from "../../middleware/adminAuth.js"
import { upload } from "../../middleware/uploadMiddleware.js"
const router = express.Router()

// Configure multer for file uploads

router.get("/", getAllServices)
// Apply admin auth middleware to all routes


// @route   GET /api/admin/services
// @desc    Get all services
// @access  Private/Admin

// @route   GET /api/admin/services/:id
// @desc    Get service by ID
// @access  Private/Admin
router.get("/:id", getServiceById)

// @route   POST /api/admin/services
// @desc    Create a new service
// @access  Private/Admin
router.post("/",adminAuth, upload.single("image"), createService)

// @route   PUT /api/admin/services/:id
// @desc    Update service
// @access  Private/Admin
router.put("/:id",adminAuth, upload.single("image"), updateService)

// @route   DELETE /api/admin/services/:id
// @desc    Delete service
// @access  Private/Admin
router.delete("/:id",adminAuth, deleteService)

export default router

