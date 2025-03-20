import Contact from "../models/Contact.js"
import * as emailService from "../utils/emailService.js"
import { validationResult } from "express-validator"

// @route   POST api/contact
// @desc    Submit a contact form
// @access  Public
export const submitContact = async (req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() })
  }

  try {
    const { name, email, phone, subject, message } = req.body

    // Create new contact submission
    const contact = new Contact({
      name,
      email,
      phone: phone || "",
      subject,
      message,
    })

    await contact.save()

    // Send confirmation email to user
    await emailService.sendContactConfirmation(email, name)

    // Send notification to admin
    await emailService.sendAdminNotification(process.env.ADMIN_EMAIL, "New Contact Form Submission", {
      name,
      email,
      subject,
      message,
      id: contact._id,
    })

    res.status(201).json({
      success: true,
      message: "Your message has been sent successfully. We will get back to you soon.",
      contact,
    })
  } catch (err) {
    console.error("Contact submission error:", err)
    res.status(500).json({
      success: false,
      message: "Server error. Please try again later.",
    })
  }
}

// @route   GET api/contact
// @desc    Get all contact submissions (admin only)
// @access  Private/Admin
export const getContacts = async (req, res) => {
  try {
    const page = Number.parseInt(req.query.page) || 1
    const limit = Number.parseInt(req.query.limit) || 10
    const skip = (page - 1) * limit
    const status = req.query.status || null
    const search = req.query.search || ""

    let query = {}

    // Filter by status if provided
    if (status) {
      query.status = status
    }

    // Search functionality
    if (search) {
      query = {
        ...query,
        $or: [
          { name: { $regex: search, $options: "i" } },
          { email: { $regex: search, $options: "i" } },
          { subject: { $regex: search, $options: "i" } },
          { message: { $regex: search, $options: "i" } },
        ],
      }
    }

    const contacts = await Contact.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit)

    const total = await Contact.countDocuments(query)

    res.json({
      contacts,
      pagination: {
        total,
        page,
        pages: Math.ceil(total / limit),
      },
    })
  } catch (err) {
    console.error("Get contacts error:", err)
    res.status(500).json({ message: "Server error" })
  }
}

// @route   GET api/contact/:id
// @desc    Get contact by ID (admin only)
// @access  Private/Admin
export const getContactById = async (req, res) => {
  try {
    const contact = await Contact.findById(req.params.id)

    if (!contact) {
      return res.status(404).json({ message: "Contact submission not found" })
    }

    res.json(contact)
  } catch (err) {
    console.error("Get contact by ID error:", err)
    if (err.kind === "ObjectId") {
      return res.status(404).json({ message: "Contact submission not found" })
    }
    res.status(500).json({ message: "Server error" })
  }
}

// @route   PUT api/contact/:id
// @desc    Update contact status and notes (admin only)
// @access  Private/Admin
export const updateContact = async (req, res) => {
  try {
    const { status, adminNotes } = req.body

    const contact = await Contact.findById(req.params.id)

    if (!contact) {
      return res.status(404).json({ message: "Contact submission not found" })
    }

    if (status) contact.status = status
    if (adminNotes !== undefined) contact.adminNotes = adminNotes

    await contact.save()

    res.json({
      success: true,
      message: "Contact submission updated successfully",
      contact,
    })
  } catch (err) {
    console.error("Update contact error:", err)
    if (err.kind === "ObjectId") {
      return res.status(404).json({ message: "Contact submission not found" })
    }
    res.status(500).json({ message: "Server error" })
  }
}

// @route   DELETE api/contact/:id
// @desc    Delete a contact submission (admin only)
// @access  Private/Admin
export const deleteContact = async (req, res) => {
  try {
    const contact = await Contact.findById(req.params.id)

    if (!contact) {
      return res.status(404).json({ message: "Contact submission not found" })
    }

    await contact.deleteOne()

    res.json({
      success: true,
      message: "Contact submission deleted successfully",
    })
  } catch (err) {
    console.error("Delete contact error:", err)
    if (err.kind === "ObjectId") {
      return res.status(404).json({ message: "Contact submission not found" })
    }
    res.status(500).json({ message: "Server error" })
  }
}

