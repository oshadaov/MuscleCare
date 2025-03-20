import express from "express"
import { getAllUsers, getUserById, deleteUser, getUserBookings } from "../../controllers/adminUserController.js"
import { adminAuth } from "../../middleware/adminAuth.js"

const router = express.Router()

// Apply admin auth middleware to all routes
router.use(adminAuth)

// @route   GET /api/admin/users
// @desc    Get all users
// @access  Private/Admin
router.get("/", getAllUsers)

// @route   GET /api/admin/users/:id
// @desc    Get user by ID
// @access  Private/Admin
router.get("/:id", getUserById)

// @route   GET /api/admin/users/:id/bookings
// @desc    Get bookings for a specific user
// @access  Private/Admin
router.get("/:id/bookings", getUserBookings)

// @route   DELETE /api/admin/users/:id
// @desc    Delete user
// @access  Private/Admin
router.delete("/:id", deleteUser)

export default router

