import Contact from "../models/Contact.js"

// @route   GET api/admin/contacts
// @desc    Get all contact submissions
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

// @route   GET api/admin/contacts/:id
// @desc    Get contact by ID
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

// @route   PUT api/admin/contacts/:id
// @desc    Update contact status and notes
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

// @route   DELETE api/admin/contacts/:id
// @desc    Delete a contact submission
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

