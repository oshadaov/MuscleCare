import asyncHandler from "express-async-handler"
import Video from "../models/Video.js"

// @desc    Get all active videos
// @route   GET /api/videos
// @access  Public
export const getVideos = async (req, res) => {
    try {
      const videos = await Video.find()
      res.status(200).json({ success: true, videos })
    } catch (error) {
      res.status(500).json({ success: false, error: error.message })
    }
  }

// @desc    Get all videos for admin
// @route   GET /api/videos/admin
// @access  Private/Admin
export const getAdminVideos = asyncHandler(async (req, res) => {
  const videos = await Video.find().sort("position")
  res.json(videos)
})

// @desc    Create a new video
// @route   POST /api/videos/admin
// @access  Private/Admin
export const createVideo = asyncHandler(async (req, res) => {
  const { title, description, url, position, active } = req.body

  // Check if we already have 2 active videos
  if (active) {
    const activeVideosCount = await Video.countDocuments({ active: true })
    if (activeVideosCount >= 2) {
      res.status(400)
      throw new Error("Maximum of 2 active videos allowed. Please deactivate one first.")
    }
  }

  const video = await Video.create({
    title,
    description,
    url,
    position,
    active,
  })

  res.status(201).json(video)
})

// @desc    Update a video
// @route   PUT /api/videos/admin/:id
// @access  Private/Admin
export const updateVideo = asyncHandler(async (req, res) => {
  const video = await Video.findById(req.params.id)

  if (!video) {
    res.status(404)
    throw new Error("Video not found")
  }

  const { title, description, url, position, active } = req.body

  // Check if we already have 2 active videos and this one is being activated
  if (active && !video.active) {
    const activeVideosCount = await Video.countDocuments({ active: true })
    if (activeVideosCount >= 2) {
      res.status(400)
      throw new Error("Maximum of 2 active videos allowed. Please deactivate one first.")
    }
  }

  video.title = title || video.title
  video.description = description || video.description
  video.url = url || video.url
  video.position = position !== undefined ? position : video.position
  video.active = active !== undefined ? active : video.active

  const updatedVideo = await video.save()
  res.json(updatedVideo)
})

// @desc    Delete a video
// @route   DELETE /api/videos/admin/:id
// @access  Private/Admin
export const deleteVideo = asyncHandler(async (req, res) => {
  const video = await Video.findById(req.params.id)

  if (!video) {
    res.status(404)
    throw new Error("Video not found")
  }

  await video.deleteOne()
  res.json({ message: "Video removed" })
})


