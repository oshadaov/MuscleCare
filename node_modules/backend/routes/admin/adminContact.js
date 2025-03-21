import express from "express"
import { getContacts, getContactById, updateContact, deleteContact } from "../../controllers/adminContactController.js"
import auth from "../../middleware/auth.js"
import adminAuth from "../../middleware/adminAuth.js"

const router = express.Router()

// All routes require authentication and admin privileges

router.use(adminAuth)

// @route   GET api/admin/contacts
// @desc    Get all contact submissions
// @access  Private/Admin
router.get("/", getContacts)

// @route   GET api/admin/contacts/:id
// @desc    Get contact by ID
// @access  Private/Admin
router.get("/:id", getContactById)

// @route   PUT api/admin/contacts/:id
// @desc    Update contact status and notes
// @access  Private/Admin
router.put("/:id", updateContact)

// @route   DELETE api/admin/contacts/:id
// @desc    Delete a contact submission
// @access  Private/Admin
router.delete("/:id", deleteContact)

export default router

