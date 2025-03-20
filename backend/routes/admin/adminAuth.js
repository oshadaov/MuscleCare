import express from "express"
import { check } from "express-validator"
import { register, login, getAdmin, createSuperAdmin } from "../../controllers/adminAuthController.js"
import { adminAuth } from "../../middleware/adminAuth.js"

const router = express.Router()

// @route   POST api/admin/auth/register
// @desc    Register a new admin
// @access  Public
router.post(
  "/register",
  [
    check("name", "Name is required").not().isEmpty(),
    check("email", "Please include a valid email").isEmail(),
    check("password", "Please enter a password with 6 or more characters").isLength({ min: 6 }),
    check("registrationCode", "Registration code is required").not().isEmpty(),
  ],
  register,
)

// @route   POST api/admin/auth/login
// @desc    Authenticate admin & get token
// @access  Public
router.post(
  "/login",
  [check("email", "Please include a valid email").isEmail(), check("password", "Password is required").exists()],
  login,
)

// @route   GET api/admin/auth/check
// @desc    Get logged in admin
// @access  Private
router.get("/check", adminAuth, getAdmin)

// @route   POST api/admin/auth/create-super-admin
// @desc    Create the first super admin (should be called only once during setup)
// @access  Public (but should be secured or removed after initial setup)
router.post(
  "/create-super-admin",
  [
    check("name", "Name is required").not().isEmpty(),
    check("email", "Please include a valid email").isEmail(),
    check("password", "Please enter a password with 6 or more characters").isLength({ min: 6 }),
    check("setupCode", "Setup code is required").not().isEmpty(),
  ],
  createSuperAdmin,
)

export default router

