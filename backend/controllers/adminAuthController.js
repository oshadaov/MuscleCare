import Admin from "../models/Admin.js"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import { validationResult } from "express-validator"

// Registration code that will be required to register new admins
// In a production app, this would be stored in environment variables or a database
const VALID_REGISTRATION_CODE = process.env.ADMIN_REGISTRATION_CODE || "ADMIN123"

// @route   POST api/admin/auth/register
// @desc    Register a new admin
// @access  Public
export const register = async (req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() })
  }

  const { name, email, password, registrationCode } = req.body

  try {
    // Verify registration code
    if (registrationCode !== VALID_REGISTRATION_CODE) {
      return res.status(400).json({ message: "Invalid registration code" })
    }

    // Check if admin already exists
    let admin = await Admin.findOne({ email })
    if (admin) {
      return res.status(400).json({ message: "Admin already exists" })
    }

    // Create new admin
    admin = new Admin({
      name,
      email,
      password,
      role: "admin", // Default role
    })

    // Hash password
    const salt = await bcrypt.genSalt(10)
    admin.password = await bcrypt.hash(password, salt)

    await admin.save()

    res.status(201).json({ message: "Admin registered successfully" })
  } catch (err) {
    console.error("Error in admin registration:", err.message)
    res.status(500).json({ message: "Server error" })
  }
}

// @route   POST api/admin/auth/login
// @desc    Authenticate admin & get token
// @access  Public
export const login = async (req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() })
  }

  const { email, password } = req.body

  try {
    // Check if admin exists
    const admin = await Admin.findOne({ email })
    if (!admin) {
      return res.status(400).json({ message: "Invalid credentials" })
    }

    // Check password
    const isMatch = await bcrypt.compare(password, admin.password)
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" })
    }

    // Create and return JWT token
    const payload = {
      admin: {
        id: admin.id,
        role: admin.role,
      },
    }

    jwt.sign(payload, process.env.ADMIN_JWT_SECRET || "adminSecret", { expiresIn: "24h" }, (err, token) => {
      if (err) throw err
      res.json({
        token,
        admin: {
          id: admin.id,
          name: admin.name,
          email: admin.email,
          role: admin.role,
        },
      })
    })
  } catch (err) {
    console.error("Error in admin login:", err.message)
    res.status(500).json({ message: "Server error" })
  }
}

// @route   GET api/admin/auth/check
// @desc    Get logged in admin
// @access  Private
export const getAdmin = async (req, res) => {
  try {
    const admin = await Admin.findById(req.admin.id).select("-password")
    res.json({ admin })
  } catch (err) {
    console.error("Error in getting admin:", err.message)
    res.status(500).json({ message: "Server error" })
  }
}

// @route   POST api/admin/auth/create-super-admin
// @desc    Create the first super admin (should be called only once during setup)
// @access  Public (but should be secured or removed after initial setup)
export const createSuperAdmin = async (req, res) => {
  const { name, email, password, setupCode } = req.body

  // Verify setup code (this is a one-time use code for initial setup)
  const validSetupCode = process.env.ADMIN_SETUP_CODE || "SETUP123"
  if (setupCode !== validSetupCode) {
    return res.status(400).json({ message: "Invalid setup code" })
  }

  try {
    // Check if any admin already exists
    const adminCount = await Admin.countDocuments()
    if (adminCount > 0) {
      return res.status(400).json({ message: "Super admin already exists. This endpoint can only be used once." })
    }

    // Create super admin
    const admin = new Admin({
      name,
      email,
      password,
      role: "super_admin",
    })

    // Hash password
    const salt = await bcrypt.genSalt(10)
    admin.password = await bcrypt.hash(password, salt)

    await admin.save()

    res.status(201).json({ message: "Super admin created successfully" })
  } catch (err) {
    console.error("Error in creating super admin:", err.message)
    res.status(500).json({ message: "Server error" })
  }
}

