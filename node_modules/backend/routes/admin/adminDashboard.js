import express from "express"
import {
  getDashboardStats,
  getBookingTrends,
  getUserGrowth,
  getFeedbackAnalytics,
} from "../../controllers/adminDashboardController.js"
import { adminAuth } from "../../middleware/adminAuth.js"

const router = express.Router()

// Apply admin auth middleware to all routes
router.use(adminAuth)

// @route   GET /api/admin/dashboard/stats
// @desc    Get dashboard statistics
// @access  Private/Admin
router.get("/stats", getDashboardStats)

// @route   GET /api/admin/dashboard/booking-trends
// @desc    Get booking trends over time
// @access  Private/Admin
router.get("/booking-trends", getBookingTrends)

// @route   GET /api/admin/dashboard/user-growth
// @desc    Get user growth over time
// @access  Private/Admin
router.get("/user-growth", getUserGrowth)

// @route   GET /api/admin/dashboard/feedback-analytics
// @desc    Get feedback analytics
// @access  Private/Admin
router.get("/feedback-analytics", getFeedbackAnalytics)

export default router

