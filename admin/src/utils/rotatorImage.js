import api from "./api"

// Rotator Image related API endpoints
export const getRotatorImages = async () => {
  const response = await api.get("/rotator-images")
  return response.data
}

export const getAdminRotatorImages = async () => {
  const response = await api.get("/rotator-images/admin")
  return response.data
}

export const createRotatorImage = async (imageData) => {
  // Create FormData object to send the file
  const formData = new FormData()

  // Append text fields
  formData.append("title", imageData.title)
  formData.append("position", imageData.position)
  formData.append("active", imageData.active)

  if (imageData.description) {
    formData.append("description", imageData.description)
  }

  // Append image file
  if (imageData.image) {
    formData.append("image", imageData.image)
  }

  // Set the correct headers for multipart/form-data
  const response = await api.post("/rotator-images/admin", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  })

  return response.data
}

export const updateRotatorImage = async (id, imageData) => {
  // Create FormData object to send the file
  const formData = new FormData()

  // Append text fields
  formData.append("title", imageData.title)
  formData.append("position", imageData.position)
  formData.append("active", imageData.active)

  if (imageData.description) {
    formData.append("description", imageData.description)
  }

  // Append image file only if a new one is selected
  if (imageData.image && imageData.image instanceof File) {
    formData.append("image", imageData.image)
  }

  // Set the correct headers for multipart/form-data
  const response = await api.put(`/rotator-images/admin/${id}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  })

  return response.data
}

export const deleteRotatorImage = async (id) => {
  const response = await api.delete(`/rotator-images/admin/${id}`)
  return response.data
}

