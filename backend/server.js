import express from "express"
import mongoose from "mongoose"
import cors from "cors"
import dotenv from "dotenv"
import authRoutes from "./routes/auth.js"
import bookingRoutes from "./routes/booking.js"
import feedbackRoutes from "./routes/feedback.js"
import contactroutes from "./routes/Contact.js"
import adminAuthRoutes from "./routes/admin/adminAuth.js"
import adminBookingRoutes from "./routes/admin/adminBooking.js"
import adminUserRoutes from "./routes/admin/adminUser.js"
import adminServiceRoutes from "./routes/admin/adminServiceRoute.js"
import adminDashboardRoutes from "./routes/admin/adminDashboard.js"
import adminContactRoutes from "./routes/admin/adminContact.js"
import VideRouter from "./routes/admin/adminVideoRoutes.js"
import ImageRouter from "./routes/admin/adminImageRoutes.js"

import path from "path"
import { fileURLToPath } from "url"
dotenv.config()

const app = express()

// Middleware
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }));

// Get __dirname equivalent in ES module
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Serve uploaded files
app.use("/uploads", express.static(path.join(__dirname, "uploads")))
if (!process.env.MONGODB_URI) {
  console.error("❌ MONGODB_URI is missing! Set it in environment variables.");
  process.exit(1);
}else{
  console.log("Yes")
}
// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Could not connect to MongoDB", err))

// Client Routes
app.use("/api/auth", authRoutes)
app.use("/api/booking", bookingRoutes)
app.use("/api/feedback", feedbackRoutes)
app.use("/api/services", adminServiceRoutes)
app.use("/api/contact",contactroutes)
app.use("/api/videos",VideRouter)
app.use("/api/rotator-images",ImageRouter)

// Admin Routes
app.use("/api/admin/auth", adminAuthRoutes)
app.use("/api/admin/bookings", adminBookingRoutes)
app.use("/api/admin/users", adminUserRoutes)
app.use("/api/admin/services", adminServiceRoutes)
app.use("/api/admin/dashboard", adminDashboardRoutes)
app.use("/api/admin/contacts", adminContactRoutes)

const PORT = process.env.PORT 

app.listen(PORT, () => console.log(`Server running on port ${PORT}`))

