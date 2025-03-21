import express from "express"
import { check } from "express-validator"
import {
  submitContact,
  getContacts,
  getContactById,
  updateContact,
  deleteContact,
} from "../controllers/contactConroller.js"
import auth from "../middleware/auth.js"
import adminAuth from "../middleware/adminAuth.js"

const router = express.Router()

// @route   POST api/contact
// @desc    Submit a contact form
// @access  Public
router.post(
  "/",
  [
    check("name", "Name is required").not().isEmpty(),
    check("email", "Please include a valid email").isEmail(),
    check("subject", "Subject is required").not().isEmpty(),
    check("message", "Message is required").not().isEmpty(),
  ],
  submitContact,
)

// @route   GET api/contact
// @desc    Get all contact submissions (admin only)
// @access  Private/Admin
router.get("/", [auth, adminAuth], getContacts)

// @route   GET api/contact/:id
// @desc    Get contact by ID (admin only)
// @access  Private/Admin
router.get("/:id", [auth, adminAuth], getContactById)

// @route   PUT api/contact/:id
// @desc    Update contact status and notes (admin only)
// @access  Private/Admin
router.put("/:id", [auth, adminAuth], updateContact)

// @route   DELETE api/contact/:id
// @desc    Delete a contact submission (admin only)
// @access  Private/Admin
router.delete("/:id", [auth, adminAuth], deleteContact)

export default router

