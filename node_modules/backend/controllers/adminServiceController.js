import Service from "../models/Service.js"
import { uploadImage } from "../utils/imageUploader.js"

// @desc    Get all services
// @route   GET /api/admin/services
// @access  Private/Admin
export const getAllServices = async (req, res) => {
  try {
    const services = await Service.find().sort({ createdAt: 1 })
    res.json(services)
  } catch (error) {
    console.error("Get all services error:", error.message)
    res.status(500).json({ message: "Server error" })
  }
}

// @desc    Get service by ID
// @route   GET /api/admin/services/:id
// @access  Private/Admin
export const getServiceById = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id)

    if (!service) {
      return res.status(404).json({ message: "Service not found" })
    }

    res.json(service)
  } catch (error) {
    console.error("Get service by ID error:", error.message)

    if (error.kind === "ObjectId") {
      return res.status(404).json({ message: "Service not found" })
    }

    res.status(500).json({ message: "Server error" })
  }
}

// @desc    Create a new service
// @route   POST /api/admin/services
// @access  Private/Admin
export const createService = async (req, res) => {
  try {
    const { name, extra,description, fullDescription, duration, price, benefits, rating } = req.body

    console.log("Request body:", req.body)
    console.log("Received file:", req.file)

    // Validate required fields
    if (!name || !description || !fullDescription || !duration || !price) {
      return res.status(400).json({ message: "Please provide all required fields" })
    }

    // Handle image upload
    let imageUrl = null
    if (req.file) {
      console.log("Processing image file:", req.file.originalname, req.file.mimetype, req.file.size)
      try {
        imageUrl = await uploadImage(req.file)
        console.log("Image uploaded successfully:", imageUrl)
      } catch (uploadError) {
        console.error("Image upload error:", uploadError)
        return res.status(500).json({ message: "Image upload failed", error: uploadError.message })
      }
    } else {
      console.log("No image file received in backend.")
    }

    // Create service ID from name (slug)
    const id = name.toLowerCase().replace(/[^a-z0-9]+/g, "-")

    // Parse benefits if it's a string
    let parsedBenefits = []
    if (benefits) {
      try {
        parsedBenefits = typeof benefits === "string" ? JSON.parse(benefits) : benefits
      } catch (e) {
        console.error("Error parsing benefits:", e)
      }
    }

    // Create new service
    const service = new Service({
      id,
      name,
      extra,
      description,
      fullDescription,
      duration,
      price,
      benefits: parsedBenefits,
      rating: rating || 0,
      imageUrl,
    })

    await service.save()
    console.log("Service created successfully:", service)

    res.status(201).json({
      message: "Service created successfully",
      service,
    })
  } catch (error) {
    console.error("Create service error:", error)
    res.status(500).json({ message: "Server error", error: error.message })
  }
}

// @desc    Update service
// @route   PUT /api/admin/services/:id
// @access  Private/Admin
export const updateService = async (req, res) => {
  try {
    const { name, description, extra,fullDescription, duration, price, benefits, rating } = req.body

    console.log("Update request body:", req.body)
    console.log("Update received file:", req.file)

    // Find service
    let service = await Service.findById(req.params.id)

    if (!service) {
      return res.status(404).json({ message: "Service not found" })
    }

    // Handle image upload if present
    let imageUrl = service.imageUrl
    if (req.file) {
      console.log("Processing update image file:", req.file.originalname, req.file.mimetype, req.file.size)
      try {
        imageUrl = await uploadImage(req.file)
        console.log("Image updated successfully:", imageUrl)
      } catch (uploadError) {
        console.error("Image update error:", uploadError)
        return res.status(500).json({ message: "Image upload failed", error: uploadError.message })
      }
    }

    // Update service ID if name changed
    let id = service.id
    if (name && name !== service.name) {
      id = name.toLowerCase().replace(/[^a-z0-9]+/g, "-")
    }

    // Parse benefits if it's a string
    let parsedBenefits = service.benefits
    if (benefits) {
      try {
        parsedBenefits = typeof benefits === "string" ? JSON.parse(benefits) : benefits
      } catch (e) {
        console.error("Error parsing benefits during update:", e)
      }
    }

    // Update service
    service = await Service.findByIdAndUpdate(
      req.params.id,
      {
        id,
        name: name || service.name,
        description: description || service.description,
        extra: extra || service.extra,
        fullDescription: fullDescription || service.fullDescription,
        duration: duration || service.duration,
        price: price || service.price,
        benefits: parsedBenefits,
        rating: rating || service.rating,
        imageUrl,
      },
      { new: true },
    )

    console.log("Service updated successfully:", service)

    res.json({
      message: "Service updated successfully",
      service,
    })
  } catch (error) {
    console.error("Update service error:", error)

    if (error.kind === "ObjectId") {
      return res.status(404).json({ message: "Service not found" })
    }

    res.status(500).json({ message: "Server error", error: error.message })
  }
}

// @desc    Delete service
// @route   DELETE /api/admin/services/:id
// @access  Private/Admin
export const deleteService = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id)

    if (!service) {
      return res.status(404).json({ message: "Service not found" })
    }

    await service.deleteOne()

    res.json({ message: "Service removed successfully" })
  } catch (error) {
    console.error("Delete service error:", error.message)

    if (error.kind === "ObjectId") {
      return res.status(404).json({ message: "Service not found" })
    }

    res.status(500).json({ message: "Server error" })
  }
}

