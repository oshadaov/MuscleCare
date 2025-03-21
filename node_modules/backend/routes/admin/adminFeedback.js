import express from "express"
import {
  getAllFeedback,
  getFeedbackById,
  deleteFeedback,
  getFeedbackByRating,
} from "../../controllers/adminFeedbackController.js"
import { adminAuth } from "../../middleware/adminAuth.js"

const router = express.Router()

// Apply admin auth middleware to all routes
router.use(adminAuth)

// @route   GET /api/admin/feedback
// @desc    Get all feedback
// @access  Private/Admin
router.get("/", getAllFeedback)

// @route   GET /api/admin/feedback/:id
// @desc    Get feedback by ID
// @access  Private/Admin
router.get("/:id", getFeedbackById)

// @route   GET /api/admin/feedback/rating/:rating
// @desc    Get feedback by rating
// @access  Private/Admin
router.get("/rating/:rating", getFeedbackByRating)

// @route   DELETE /api/admin/feedback/:id
// @desc    Delete feedback
// @access  Private/Admin
router.delete("/:id", deleteFeedback)

export default router

