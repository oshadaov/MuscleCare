import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  name: { type: String, required: true },
  date: { type: Date, required: true },
  time: { type: String, required: true },
  telephone: { type: String, required: true},
  treatment: { type: String, required: true },
  status: { type: String, enum: ["pending", "confirmed", "cancelled","completed"], default: "pending" },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Booking", bookingSchema);
