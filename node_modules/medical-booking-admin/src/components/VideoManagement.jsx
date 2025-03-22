"use client"

import { useState, useEffect } from "react"
import api from "../utils/api"
import { toast } from "react-toastify"
import "./VideoManagement.css"

const VideoManagement = () => {
  const [videos, setVideos] = useState([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    url: "",
    position: 0,
    active: true,
  })
  const [editingId, setEditingId] = useState(null)

  useEffect(() => {
    fetchVideos()
  }, [])

  const fetchVideos = async () => {
    try {
      setLoading(true)
      const response = await api.get("/videos/admin")
      setVideos(response.data)
    } catch (err) {
      toast.error("Failed to load videos")
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      setSubmitting(true)
      if (editingId) {
        await api.put(`/videos/admin/${editingId}`, formData)
        toast.success("Video updated successfully")
      } else {
        await api.post("/videos/admin", formData)
        toast.success("Video added successfully")
      }
      resetForm()
      fetchVideos()
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to save video")
    } finally {
      setSubmitting(false)
    }
  }

  const handleEdit = (video) => {
    setFormData({
      title: video.title,
      description: video.description,
      url: video.url,
      position: video.position,
      active: video.active,
    })
    setEditingId(video._id)
    window.scrollTo(0, 0)
  }

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this video?")) return

    try {
      await api.delete(`/videos/admin/${id}`)
      toast.success("Video deleted successfully")
      fetchVideos()
    } catch (err) {
      toast.error("Failed to delete video")
    }
  }

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      url: "",
      position: 0,
      active: true,
    })
    setEditingId(null)
  }

  const getYouTubeId = (url) => {
    if (!url) return null
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/
    const match = url.match(regExp)
    return match && match[2].length === 11 ? match[2] : null
  }

  if (loading) {
    return (
      <div className="video-loading">
        <div className="video-spinner"></div>
      </div>
    )
  }

  return (
    <div className="video-management">
      <div className="video-form-section">
        <h2 className="video-form-title">{editingId ? "Edit Video" : "Add New Video"}</h2>

        <form onSubmit={handleSubmit} className="video-form">
          <div className="video-form-group">
            <label className="video-form-label">Title</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="video-form-input"
              required
            />
          </div>

          <div className="video-form-group">
            <label className="video-form-label">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="video-form-textarea"
              rows="4"
              required
            />
          </div>

          <div className="video-form-group">
            <label className="video-form-label">YouTube URL</label>
            <input
              type="url"
              value={formData.url}
              onChange={(e) => setFormData({ ...formData, url: e.target.value })}
              className="video-form-input"
              required
            />
          </div>

          <div className="video-form-group">
            <label className="video-form-label">Position</label>
            <select
              value={formData.position}
              onChange={(e) => setFormData({ ...formData, position: Number(e.target.value) })}
              className="video-form-select"
            >
              <option value={0}>First Video (0)</option>
              <option value={1}>Second Video (1)</option>
            </select>
          </div>

          <div className="video-form-checkbox">
            <input
              type="checkbox"
              id="active"
              checked={formData.active}
              onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
              className="video-checkbox-input"
            />
            <label htmlFor="active" className="video-checkbox-label">
              Active
            </label>
          </div>

          {formData.url && getYouTubeId(formData.url) && (
            <div className="video-preview-container">
              <label className="video-preview-label">Preview</label>
              <div className="video-preview">
                <iframe
                  src={`https://www.youtube.com/embed/${getYouTubeId(formData.url)}`}
                  title="Video Preview"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            </div>
          )}

          <div className="video-form-buttons">
            <button type="submit" disabled={submitting} className="video-submit-button">
              {submitting ? "Saving..." : editingId ? "Update Video" : "Add Video"}
            </button>

            {editingId && (
              <button type="button" onClick={resetForm} className="video-cancel-button">
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      <div className="video-list-section">
        <h2 className="video-list-title">Manage Videos</h2>

        <div className="video-list-grid">
          {videos.length === 0 ? (
            <p className="video-empty-message">No videos found. Add your first video above.</p>
          ) : (
            videos.map((video) => (
              <div key={video._id} className={`video-list-card ${video.active ? "" : "video-inactive"}`}>
                <h3 className="video-card-title">{video.title}</h3>
                <p className="video-card-description">{video.description}</p>

                <div className="video-card-meta">
                  <p>Position: {video.position}</p>
                  <p>Status: {video.active ? "Active" : "Inactive"}</p>
                </div>

                {getYouTubeId(video.url) && (
                  <div className="video-card-preview">
                    <iframe
                      src={`https://www.youtube.com/embed/${getYouTubeId(video.url)}`}
                      title={video.title}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                )}

                <div className="video-card-actions">
                  <button onClick={() => handleEdit(video)} className="video-edit-button">
                    Edit
                  </button>
                  <button onClick={() => handleDelete(video._id)} className="video-delete-button">
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}

export default VideoManagement

