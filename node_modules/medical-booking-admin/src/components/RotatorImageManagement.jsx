"use client"

import { useState, useEffect, useRef } from "react"
import { toast } from "react-toastify"
import {
  getAdminRotatorImages,
  createRotatorImage,
  updateRotatorImage,
  deleteRotatorImage,
} from "../utils/rotatorImage.js"
import "./RotatorImageManagement.css"

const RotatorImageManagement = () => {
  const [images, setImages] = useState([])
  const [loading, setLoading] = useState(true)
  const [formData, setFormData] = useState({
    title: "",
    image: null, // This will store the actual file object
    position: 0,
    active: true,
    description: "",
  })
  const [isEditing, setIsEditing] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const fileInputRef = useRef(null)

  useEffect(() => {
    fetchImages()
  }, [])

  const fetchImages = async () => {
    try {
      setLoading(true)
      const data = await getAdminRotatorImages()
      setImages(data)
    } catch (error) {
      toast.error("Failed to load images")
      console.error("Error fetching rotator images:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target

    if (type === "file") {
      const file = e.target.files[0]
      if (file) {
        // Update form data with the file
        setFormData({
          ...formData,
          image: file,
        })

        // Create a preview URL for the selected image
        const reader = new FileReader()
        reader.onloadend = () => {
          setImagePreview(reader.result)
        }
        reader.readAsDataURL(file)
      }
    } else {
      setFormData({
        ...formData,
        [name]: type === "checkbox" ? checked : value,
      })
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      setLoading(true)

      // Validate form
      if (!formData.title.trim()) {
        toast.error("Please enter a title")
        setLoading(false)
        return
      }

      // If creating a new image, require an image file
      if (!isEditing && !formData.image) {
        toast.error("Please select an image")
        setLoading(false)
        return
      }

      if (isEditing) {
        await updateRotatorImage(editingId, formData)
        toast.success("Image updated successfully")
      } else {
        await createRotatorImage(formData)
        toast.success("Image added successfully")
      }

      resetForm()
      fetchImages()
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to save image")
      console.error("Error saving rotator image:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (image) => {
    setFormData({
      title: image.title,
      image: null, // We don't set the file here, just keep the existing one on the server
      position: image.position,
      active: image.active,
      description: image.description || "",
    })
    setEditingId(image._id)
    setIsEditing(true)
    setImagePreview(image.image) // Use the existing image URL for preview
    window.scrollTo(0, 0)
  }

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this image?")) return

    try {
      setLoading(true)
      await deleteRotatorImage(id)
      toast.success("Image deleted successfully")
      fetchImages()
    } catch (error) {
      toast.error("Failed to delete image")
      console.error("Error deleting rotator image:", error)
    } finally {
      setLoading(false)
    }
  }

  const resetForm = () => {
    setFormData({
      title: "",
      image: null,
      position: 0,
      active: true,
      description: "",
    })
    setIsEditing(false)
    setEditingId(null)
    setImagePreview(null)

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  return (
    <div className="rotator-management">
      <h2 className="rotator-management-title">{isEditing ? "Edit Rotator Image" : "Add New Rotator Image"}</h2>

      <form onSubmit={handleSubmit} className="rotator-form" encType="multipart/form-data">
        <div className="form-group">
          <label htmlFor="title">Title</label>
          <input type="text" id="title" name="title" value={formData.title} onChange={handleInputChange} required />
        </div>

        <div className="form-group">
          <label htmlFor="image">Image</label>
          <input
            type="file"
            id="image"
            name="image"
            onChange={handleInputChange}
            accept="image/*"
            ref={fileInputRef}
            className="file-input"
            required={!isEditing} // Only required when creating a new image
          />
          <p className="form-help-text">
            {isEditing
              ? "Select a new image only if you want to replace the existing one"
              : "Select an image file (JPG, PNG, GIF, WebP)"}
          </p>
        </div>

        <div className="form-group">
          <label htmlFor="position">Position (0-3)</label>
          <select id="position" name="position" value={formData.position} onChange={handleInputChange}>
            <option value={0}>Position 1 (0)</option>
            <option value={1}>Position 2 (1)</option>
            <option value={2}>Position 3 (2)</option>
            <option value={3}>Position 4 (3)</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="description">Description (optional)</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            rows="3"
          ></textarea>
        </div>

        <div className="form-group checkbox-group">
          <label>
            <input type="checkbox" name="active" checked={formData.active} onChange={handleInputChange} />
            Active
          </label>
        </div>

        {imagePreview && (
          <div className="image-preview">
            <h3>Image Preview</h3>
            <div className="image-preview-container">
              <img
                src={imagePreview || "/placeholder.svg"}
                alt="Preview"
                onError={(e) => {
                  e.target.onerror = null
                  e.target.src = "/placeholder.svg?height=400&width=200&text=Preview+Error"
                }}
              />
            </div>
          </div>
        )}

        <div className="form-actions">
          <button type="submit" className="btn-save" disabled={loading}>
            {isEditing ? "Update Image" : "Add Image"}
          </button>
          {isEditing && (
            <button type="button" className="btn-cancel" onClick={resetForm} disabled={loading}>
              Cancel
            </button>
          )}
        </div>
      </form>

      <h2 className="rotator-management-title rotator-list-title">Manage Rotator Images</h2>

      {loading && <div className="loading">Loading...</div>}

      <div className="rotator-list">
        {images.length > 0 ? (
          images.map((image) => (
            <div key={image._id} className={`rotator-item ${!image.active ? "inactive" : ""}`}>
              <div className="rotator-item-content">
                <h3>{image.title}</h3>
                <p className="rotator-description">{image.description}</p>
                <p className="rotator-meta">
                  <span className="rotator-position">Position: {image.position}</span>
                  <span className="rotator-status">Status: {image.active ? "Active" : "Inactive"}</span>
                </p>
                <div className="rotator-thumbnail">
                  <img
                    src={image.image }
                    alt={image.title}
                    
                  />
                </div>
              </div>
              <div className="rotator-actions">
                <button className="btn-edit" onClick={() => handleEdit(image)} disabled={loading}>
                  Edit
                </button>
                <button className="btn-delete" onClick={() => handleDelete(image._id)} disabled={loading}>
                  Delete
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="no-images">No rotator images found. Add your first image above.</p>
        )}
      </div>
    </div>
  )
}

export default RotatorImageManagement

