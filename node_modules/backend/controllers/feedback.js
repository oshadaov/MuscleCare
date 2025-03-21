import Feedback from "../models/Feedback.js"
import User from "../models/User.js"

export const submitFeedback = async (req, res) => {
  try {
    const { rating, comment } = req.body
    const user = await User.findById(req.userId)
    if (!user) {
      return res.status(404).json({ message: "User not found" })
    }
    const feedback = new Feedback({
      user: req.userId,
      username: user.name,
      rating,
      comment,
    })
    await feedback.save()
    res.status(201).json({ message: "Feedback submitted successfully" })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Server error" })
  }
}

export const getFeedback = async (req, res) => {
  try {
    const feedback = await Feedback.find().sort({ createdAt: -1 })
    res.json(feedback)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Server error" })
  }
}

