import mongoose from "mongoose"

const videoSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Please provide a title for the video"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Please provide a description for the video"],
      trim: true,
    },
    url: {
      type: String,
      required: [true, "Please provide a YouTube URL"],
      trim: true,
      validate: {
        validator: (v) => /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.?be)\/.+$/.test(v),
        message: (props) => `${props.value} is not a valid YouTube URL!`,
      },
    },
    position: {
      type: Number,
      required: true,
      default: 0,
      validate: {
        validator: (v) => v === 0 || v === 1,
        message: "Position must be either 0 or 1",
      },
    },
    active: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  },
)

const Video = mongoose.model("Video", videoSchema)

export default Video

