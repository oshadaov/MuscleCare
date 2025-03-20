import asyncHandler from "express-async-handler";
import { uploadImage, deleteImage } from "../utils/imageUploader.js";
import RotatorImage from "../models/rotatorImageModel.js";

// ✅ Get all active rotator images
export const getRotatorImages = asyncHandler(async (req, res) => {
  const images = await RotatorImage.find({ active: true }).sort("position");

  // If less than 4 images, fill with placeholders
  while (images.length < 4) {
    images.push({
      _id: `placeholder-${images.length}`,
      title: `Placeholder ${images.length + 1}`,
      image: `https://via.placeholder.com/400x200?text=Image+${images.length + 1}`,
      position: images.length,
      active: true,
      description: "Placeholder image",
    });
  }

  res.json(images.slice(0, 4)); // Return only 4 images
});

// ✅ Get all rotator images for admin
export const getAdminRotatorImages = asyncHandler(async (req, res) => {
  const images = await RotatorImage.find().sort("position");
  res.json(images);
});

// ✅ Create a new rotator image (Uploads to Cloudinary)
export const createRotatorImage = asyncHandler(async (req, res) => {
  const { title, position, active, description } = req.body;

  if (!req.file) {
    res.status(400);
    throw new Error("Please upload an image");
  }

  // Upload image to Cloudinary
  const imageUrl = await uploadImage(req.file);

  // Save in MongoDB
  const rotatorImage = await RotatorImage.create({
    title,
    image: imageUrl,
    position,
    active,
    description,
  });

  res.status(201).json(rotatorImage);
});

// ✅ Update a rotator image
export const updateRotatorImage = asyncHandler(async (req, res) => {
  const image = await RotatorImage.findById(req.params.id);
  if (!image) {
    res.status(404);
    throw new Error("Image not found");
  }

  const { title, position, active, description } = req.body;
  let newImageUrl = image.image;

  // If a new file is uploaded, delete old image and upload new one
  if (req.file) {
    await deleteImage(image.image);
    newImageUrl = await uploadImage(req.file);
  }

  image.title = title || image.title;
  image.position = position !== undefined ? position : image.position;
  image.active = active !== undefined ? active : image.active;
  image.description = description !== undefined ? description : image.description;
  image.image = newImageUrl;

  const updatedImage = await image.save();
  res.json(updatedImage);
});

// ✅ Delete a rotator image
export const deleteRotatorImage = asyncHandler(async (req, res) => {
  const image = await RotatorImage.findById(req.params.id);
  if (!image) {
    res.status(404);
    throw new Error("Image not found");
  }

  // Delete from Cloudinary
  await deleteImage(image.image);

  // Remove from MongoDB
  await image.deleteOne();
  res.json({ message: "Image removed successfully" });
});
