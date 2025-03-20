import Feedback from "../models/Feedback.js"

// @desc    Get all feedback
// @route   GET /api/admin/feedback
// @access  Private/Admin
export const getAllFeedback = async (req, res) => {
  try {
    const feedback = await Feedback.find().populate("user", "name email").sort({ createdAt: -1 })

    res.json(feedback)
  } catch (error) {
    console.error("Get all feedback error:", error.message)
    res.status(500).json({ message: "Server error" })
  }
}

// @desc    Get feedback by ID
// @route   GET /api/admin/feedback/:id
// @access  Private/Admin
export const getFeedbackById = async (req, res) => {
  try {
    const feedback = await Feedback.findById(req.params.id).populate("user", "name email")

    if (!feedback) {
      return res.status(404).json({ message: "Feedback not found" })
    }

    res.json(feedback)
  } catch (error) {
    console.error("Get feedback by ID error:", error.message)

    if (error.kind === "ObjectId") {
      return res.status(404).json({ message: "Feedback not found" })
    }

    res.status(500).json({ message: "Server error" })
  }
}

// @desc    Get feedback by rating
// @route   GET /api/admin/feedback/rating/:rating
// @access  Private/Admin
export const getFeedbackByRating = async (req, res) => {
  try {
    const rating = Number.parseInt(req.params.rating)

    if (isNaN(rating) || rating < 1 || rating > 5) {
      return res.status(400).json({ message: "Rating must be between 1 and 5" })
    }

    const feedback = await Feedback.find({ rating }).populate("user", "name email").sort({ createdAt: -1 })

    res.json(feedback)
  } catch (error) {
    console.error("Get feedback by rating error:", error.message)
    res.status(500).json({ message: "Server error" })
  }
}

// @desc    Delete feedback
// @route   DELETE /api/admin/feedback/:id
// @access  Private/Admin
export const deleteFeedback = async (req, res) => {
  try {
    const feedback = await Feedback.findById(req.params.id)

    if (!feedback) {
      return res.status(404).json({ message: "Feedback not found" })
    }

    await feedback.remove()

    res.json({ message: "Feedback removed successfully" })
  } catch (error) {
    console.error("Delete feedback error:", error.message)

    if (error.kind === "ObjectId") {
      return res.status(404).json({ message: "Feedback not found" })
    }

    res.status(500).json({ message: "Server error" })
  }
}

