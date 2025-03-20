import mongoose from "mongoose"

const rotatorImageSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Please provide an image title"],
      trim: true,
    },
    image: {
      type: String, // This will store the path to the uploaded image
      required: [true, "Please provide an image"],
    },
    position: {
      type: Number,
      required: true,
      min: 0,
      max: 3,
      default: 0,
    },
    active: {
      type: Boolean,
      default: true,
    },
    description: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  },
)

const RotatorImage = mongoose.model("RotatorImage", rotatorImageSchema)

export default RotatorImage

