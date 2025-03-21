import Booking from "../models/Booking.js"

// @desc    Get all bookings
// @route   GET /api/admin/bookings
// @access  Private/Admin
export const getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find().populate("user", "name email").sort({ createdAt: -1 })

    res.json(bookings)
  } catch (error) {
    console.error("Get all bookings error:", error.message)
    res.status(500).json({ message: "Server error" })
  }
}

// @desc    Get booking by ID
// @route   GET /api/admin/bookings/:id
// @access  Private/Admin
export const getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id).populate("user", "name email")

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" })
    }

    res.json(booking)
  } catch (error) {
    console.error("Get booking by ID error:", error.message)

    if (error.kind === "ObjectId") {
      return res.status(404).json({ message: "Booking not found" })
    }

    res.status(500).json({ message: "Server error" })
  }
}

// @desc    Get bookings by date
// @route   GET /api/admin/bookings/date/:date
// @access  Private/Admin
export const getBookingsByDate = async (req, res) => {
  try {
    const date = new Date(req.params.date)

    // Set time to start of day
    date.setHours(0, 0, 0, 0)

    // Create end date (start of next day)
    const endDate = new Date(date)
    endDate.setDate(endDate.getDate() + 1)

    const bookings = await Booking.find({
      date: { $gte: date, $lt: endDate },
    }).populate("user", "name email")

    res.json(bookings)
  } catch (error) {
    console.error("Get bookings by date error:", error.message)
    res.status(500).json({ message: "Server error" })
  }
}

// @desc    Get bookings by treatment
// @route   GET /api/admin/bookings/treatment/:treatment
// @access  Private/Admin
export const getBookingsByTreatment = async (req, res) => {
  try {
    const bookings = await Booking.find({
      treatment: req.params.treatment,
    }).populate("user", "name email")

    res.json(bookings)
  } catch (error) {
    console.error("Get bookings by treatment error:", error.message)
    res.status(500).json({ message: "Server error" })
  }
}

// @desc    Update booking status
// @route   PUT /api/admin/bookings/:id
// @access  Private/Admin
export const updateBookingStatus = async (req, res) => {
  try {
    const { status } = req.body

    // Validate status
    const validStatuses = ["pending", "confirmed", "cancelled", "completed"]
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid status" })
    }

    const booking = await Booking.findById(req.params.id)

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" })
    }

    booking.status = status
    await booking.save()

    res.json({ message: "Booking status updated successfully", booking })
  } catch (error) {
    console.error("Update booking status error:", error.message)

    if (error.kind === "ObjectId") {
      return res.status(404).json({ message: "Booking not found" })
    }

    res.status(500).json({ message: "Server error" })
  }
}

// @desc    Delete booking
// @route   DELETE /api/admin/bookings/:id
// @access  Private/Admin
export const deleteBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" })
    }

    await booking.deleteOne()

    res.json({ message: "Booking removed successfully" })
  } catch (error) {
    console.error("Delete booking error:", error.message)

    if (error.kind === "ObjectId") {
      return res.status(404).json({ message: "Booking not found" })
    }

    res.status(500).json({ message: "Server error" })
  }
}

