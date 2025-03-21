import { v2 as cloudinary } from "cloudinary"
import streamifier from "streamifier"

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

// Upload image to Cloudinary
 const uploadImage = (file) => {
  return new Promise((resolve, reject) => {
    // Validate file
    if (!file || !file.buffer) {
      return reject(new Error("Invalid file object"))
    }

    console.log("Starting Cloudinary upload for file:", file.originalname)

    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: "medical-booking/services",
        resource_type: "image",
      },
      (error, result) => {
        if (error) {
          console.error("Cloudinary upload error:", error)
          return reject(error)
        }
        console.log("Cloudinary upload success:", result.secure_url)
        resolve(result.secure_url)
      },
    )

    // Handle potential streaming errors
    streamifier
      .createReadStream(file.buffer)
      .on("error", (error) => {
        console.error("Stream error:", error)
        reject(error)
      })
      .pipe(uploadStream)
      .on("error", (error) => {
        console.error("Upload stream error:", error)
        reject(error)
      })
  })
}

// Delete image from Cloudinary
const deleteImage = async (imageUrl) => {
  try {
    if (!imageUrl || !imageUrl.includes("cloudinary")) {
      return null
    }

    // Extract public ID from URL
    const splitUrl = imageUrl.split("/")
    const filename = splitUrl[splitUrl.length - 1]
    const folderPath = imageUrl.includes("medical-booking") ? imageUrl.split("medical-booking/")[1].split("/")[0] : ""

    // Get public ID without extension
    const publicId = filename.substring(0, filename.lastIndexOf("."))
    const fullPublicId = folderPath ? `medical-booking/${folderPath}/${publicId}` : publicId

    console.log("Deleting image with public ID:", fullPublicId)

    const result = await cloudinary.uploader.destroy(fullPublicId)
    console.log("Cloudinary delete result:", result)
    return result
  } catch (error) {
    console.error("Error deleting image from Cloudinary:", error)
    throw error
  }
}

// Upload multiple images to Cloudinary
 const uploadMultipleBuffers = async (files, folder = "medical-booking") => {
  if (!files || !Array.isArray(files) || files.length === 0) {
    throw new Error("No files to upload")
  }

  const uploadPromises = files.map((file) => uploadFromBuffer(file, folder))
  return Promise.all(uploadPromises)
}

// Upload multiple images from disk
 const uploadMultipleFromDisk = async (filePaths, folder = "medical-booking") => {
  if (!filePaths || !Array.isArray(filePaths) || filePaths.length === 0) {
    throw new Error("No file paths to upload")
  }

  const uploadPromises = filePaths.map((path) => uploadFromDisk(path, folder))
  return Promise.all(uploadPromises)
}


export  {
  uploadImage,

  uploadMultipleBuffers,
  uploadMultipleFromDisk,
  deleteImage,
}
