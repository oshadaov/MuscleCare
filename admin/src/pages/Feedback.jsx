"use client"

import { useState, useEffect } from "react"
import { Search, Star, Trash2, User, Calendar } from "lucide-react"
import api from "../utils/api"
import ConfirmationModal from "../components/ConfirmationModal"

function Feedback() {
  const [feedback, setFeedback] = useState([])
  const [filteredFeedback, setFilteredFeedback] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [ratingFilter, setRatingFilter] = useState("all")
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [feedbackToDelete, setFeedbackToDelete] = useState(null)

  useEffect(() => {
    fetchFeedback()
  }, [])

  useEffect(() => {
    filterFeedback()
  }, [searchTerm, ratingFilter, feedback])

  const fetchFeedback = async () => {
    try {
      setLoading(true)
      const response = await api.get("/feedback")
      setFeedback(response.data)
    } catch (err) {
      console.error("Error fetching feedback:", err)
      setError("Failed to load feedback")
    } finally {
      setLoading(false)
    }
  }

  const filterFeedback = () => {
    let filtered = [...feedback]

    // Apply rating filter
    if (ratingFilter !== "all") {
      const rating = Number.parseInt(ratingFilter)
      filtered = filtered.filter((item) => item.rating === rating)
    }

    // Apply search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase()
      filtered = filtered.filter(
        (item) =>
          item.comment.toLowerCase().includes(term) ||
          (item.username && item.username.toLowerCase().includes(term)) ||
          (item.user?.name && item.user.name.toLowerCase().includes(term)),
      )
    }

    setFilteredFeedback(filtered)
  }

  const handleDeleteClick = (item) => {
    setFeedbackToDelete(item)
    setShowDeleteModal(true)
  }

  const handleDeleteConfirm = async () => {
    try {
      await api.delete(`/admin/feedback/${feedbackToDelete._id}`)
      setFeedback(feedback.filter((item) => item._id !== feedbackToDelete._id))
    } catch (err) {
      console.error("Error deleting feedback:", err)
      alert("Failed to delete feedback")
    }
  }

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" }
    return new Date(dateString).toLocaleDateString(undefined, options)
  }

  const renderStars = (rating) => {
    return Array(5)
      .fill(0)
      .map((_, i) => (
        <Star key={i} className={`h-4 w-4 ${i < rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`} />
      ))
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (error) {
    return <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">{error}</div>
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Manage Feedback</h1>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow-md mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search feedback..."
                className="pl-10 pr-4 py-2 border rounded-md w-full"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Rating</label>
            <select
              value={ratingFilter}
              onChange={(e) => setRatingFilter(e.target.value)}
              className="pl-3 pr-10 py-2 border rounded-md w-full bg-white"
            >
              <option value="all">All Ratings</option>
              <option value="5">5 Stars</option>
              <option value="4">4 Stars</option>
              <option value="3">3 Stars</option>
              <option value="2">2 Stars</option>
              <option value="1">1 Star</option>
            </select>
          </div>
        </div>
      </div>

      {/* Feedback List */}
      {filteredFeedback.length === 0 ? (
        <div className="bg-white p-6 rounded-lg shadow-md text-center">
          <p className="text-gray-500">No feedback found matching your filters.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredFeedback.map((item) => (
            <div key={item._id} className="bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-between items-start">
                <div className="flex items-center">
                  <div className="flex">{renderStars(item.rating)}</div>
                  <span className="ml-2 text-sm text-gray-600">({item.rating}/5)</span>
                </div>
                <button
                  onClick={() => handleDeleteClick(item)}
                  className="text-red-500 hover:text-red-700"
                  title="Delete feedback"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              </div>

              <div className="mt-4">
                <p className="text-gray-700">{item.comment}</p>
              </div>

              <div className="mt-4 pt-4 border-t border-gray-200 flex justify-between items-center">
                <div className="flex items-center text-gray-600">
                  <User className="h-4 w-4 mr-1" />
                  <span className="text-sm font-medium">{item.username || item.user?.name || "Anonymous"}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <Calendar className="h-4 w-4 mr-1" />
                  <span className="text-sm">{formatDate(item.createdAt)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDeleteConfirm}
        title="Delete Feedback"
        message="Are you sure you want to delete this feedback? This action cannot be undone."
      />
    </div>
  )
}

export default Feedback

