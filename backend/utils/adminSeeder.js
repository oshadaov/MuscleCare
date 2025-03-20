import mongoose from "mongoose"
import bcrypt from "bcryptjs"
import dotenv from "dotenv"
import Admin from "../models/Admin.js"

dotenv.config()

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Could not connect to MongoDB", err))

const createAdmin = async () => {
  try {
    // Check if admin already exists
    const adminExists = await Admin.findOne({ email: "admin@example.com" })

    if (adminExists) {
      console.log("Admin already exists")
      mongoose.disconnect()
      return
    }

    // Create salt & hash
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash("admin123", salt)

    // Create admin
    const admin = new Admin({
      name: "Admin User",
      email: "admin@example.com",
      password: hashedPassword,
      role: "super-admin",
    })

    await admin.save()

    console.log("Admin created successfully")
    mongoose.disconnect()
  } catch (error) {
    console.error("Error creating admin:", error)
    mongoose.disconnect()
  }
}

createAdmin()

