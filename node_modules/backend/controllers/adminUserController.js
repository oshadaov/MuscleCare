import User from "../models/User.js"
import Booking from "../models/Booking.js"
import Feedback from "../models/Feedback.js"
import Admin from "../models/Admin.js"

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private/Admin
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password").sort({ createdAt: -1 })
    res.json(users)
  } catch (error) {
    console.error("Get all users error:", error.message)
    res.status(500).json({ message: "Server error" })
  }
}

// @desc    Get user by ID
// @route   GET /api/admin/users/:id
// @access  Private/Admin
export const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password")

    if (!user) {
      return res.status(404).json({ message: "User not found" })
    }

    res.json(user)
  } catch (error) {
    console.error("Get user by ID error:", error.message)

    if (error.kind === "ObjectId") {
      return res.status(404).json({ message: "User not found" })
    }

    res.status(500).json({ message: "Server error" })
  }
}

// @desc    Get bookings for a specific user
// @route   GET /api/admin/users/:id/bookings
// @access  Private/Admin
export const getUserBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.params.id }).sort({ date: -1 })

    res.json(bookings)
  } catch (error) {
    console.error("Get user bookings error:", error.message)

    if (error.kind === "ObjectId") {
      return res.status(404).json({ message: "User not found" })
    }

    res.status(500).json({ message: "Server error" })
  }
}

// @desc    Delete user
// @route   DELETE /api/admin/users/:id
// @access  Private/Admin
export const deleteUser = async (req, res) => {
  try {
    // Find user
    const user = await User.findById(req.params.id)

    if (!user) {
      return res.status(404).json({ message: "User not found" })
    }

    // Delete user's bookings
    await Booking.deleteMany({ user: req.params.id })

    // Delete user's feedback
    await Feedback.deleteMany({ user: req.params.id })

    // Delete user
    await user.deleteOne()

    res.json({ message: "User and all associated data removed successfully" })
  } catch (error) {
    console.error("Delete user error:", error.message)

    if (error.kind === "ObjectId") {
      return res.status(404).json({ message: "User not found" })
    }

    res.status(500).json({ message: "Server error" })
  }
}

