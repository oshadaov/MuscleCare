import express from "express"
import {
  createBooking,
  getUserBookings,
  getAllBookings,
  updateBookingStatus,
} from "../controllers/bookingController.js"
import auth from "../middleware/auth.js"

const router = express.Router()

router.get("/all", getAllBookings)
router.post("/", auth, createBooking)
router.get("/", auth, getUserBookings)
router.put("/:id/status", auth, updateBookingStatus)

export default router

