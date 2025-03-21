import Booking from "../models/Booking.js"
import { sendWhatsAppMessage } from "../utils/whatsapp.js"

export const getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find().populate("user", "name")
    res.json(bookings)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Server error" })
  }
}

export const createBooking = async (req, res) => {
  try {
    const { name, date, time, telephone, treatment } = req.body

    // Check if the time slot is available
    const existingBooking = await Booking.findOne({ date, time })
    if (existingBooking) {
      return res.status(400).json({ message: "The selected time slot is not available" })
    }

    // Create the booking
    const booking = new Booking({
      user: req.userId,
      name,
      date,
      telephone,
      time,
      treatment,
      status: "pending",
    })
    await booking.save()

    await sendWhatsAppMessage(
      `New booking: ${name} for ${treatment} on ${new Date(date).toLocaleDateString()} at ${time}   the number of patient is ${telephone}`,
    )

    res.status(201).json({ message: "Booking created successfully", booking })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Server error" })
  }
}

export const getUserBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.userId })
    res.json(bookings)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Server error" })
  }
}

export const updateBookingStatus = async (req, res) => {
  try {
    const { id } = req.params
    const { status } = req.body

    const booking = await Booking.findById(id)
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" })
    }

    if (booking.user.toString() !== req.userId) {
      return res.status(403).json({ message: "Not authorized to update this booking" })
    }

    booking.status = status
    await booking.save()

    res.json({ message: "Booking status updated successfully", booking })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Server error" })
  }
}

