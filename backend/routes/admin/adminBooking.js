import express from "express"
import {
  getAllBookings,
  getBookingById,
  updateBookingStatus,
  deleteBooking,
} from "../../controllers/adminBookingController.js"
import { adminAuth } from "../../middleware/adminAuth.js"

const router = express.Router()

// Apply admin auth middleware to all routes
router.use(adminAuth)

// @route   GET /api/admin/bookings
// @desc    Get all bookings
// @access  Private/Admin
router.get("/", getAllBookings)

// @route   GET /api/admin/bookings/:id
// @desc    Get booking by ID
// @access  Private/Admin
router.get("/:id", getBookingById)

// @route   PUT /api/admin/bookings/:id
// @desc    Update booking status
// @access  Private/Admin
router.put("/:id", updateBookingStatus)

// @route   DELETE /api/admin/bookings/:id
// @desc    Delete booking
// @access  Private/Admin
router.delete("/:id", deleteBooking)

export default router

