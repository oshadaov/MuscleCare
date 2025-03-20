"use client"

import { useState } from "react"
import { Link } from "react-router-dom"
import api from "../../utils/api"


function FeedbackForm({ isLoggedIn, onFeedbackSubmitted }) {
  const [newFeedback, setNewFeedback] = useState({ rating: "", comment: "" })
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState("")
  const [submitSuccess, setSubmitSuccess] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setNewFeedback((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    setSubmitError("")
    setSubmitSuccess(false)

    try {
      await api.post("/feedback", newFeedback)
      setSubmitSuccess(true)
      setNewFeedback({ rating: "", comment: "" })
      onFeedbackSubmitted()
    } catch (err) {
      setSubmitError(err.response?.data?.message || "An error occurred while submitting feedback")
    } finally {
      setSubmitting(false)
    }
  }

  if (!isLoggedIn) {
    return (
      <p className="feedback-login-prompt">
        Please{" "}
        <Link to="/login" className="login-link">
          log in
        </Link>{" "}
        to leave feedback.
      </p>
    )
  }

  return (
    <div className="feedback-form-container">
      <h3 className="feedback-form-title">Leave Your Feedback</h3>

      {submitSuccess && <div className="feedback-success">Thank you for your feedback!</div>}
      

      <form onSubmit={handleSubmit} className="feedback-form">
        <div className="form-group">
          <label htmlFor="rating">Rating</label>
          <select id="rating" name="rating" value={newFeedback.rating} onChange={handleChange} required>
            <option value="">Select a rating</option>
            <option value="5">5 - Excellent</option>
            <option value="4">4 - Very Good</option>
            <option value="3">3 - Good</option>
            <option value="2">2 - Fair</option>
            <option value="1">1 - Poor</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="comment">Comment</label>
          <textarea id="comment" name="comment" value={newFeedback.comment} onChange={handleChange} required></textarea>
        </div>

        <button type="submit" className="submit-button btn btn-primary" disabled={submitting}>
          {submitting ? "Submitting..." : "Submit Feedback"}
        </button>
      </form>
    </div>
  )
}

export default FeedbackForm
