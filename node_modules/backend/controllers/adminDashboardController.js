import Booking from "../models/Booking.js"
import User from "../models/User.js"
import Feedback from "../models/Feedback.js"

// @desc    Get dashboard statistics
// @route   GET /api/admin/dashboard/stats
// @access  Private/Admin
export const getDashboardStats = async (req, res) => {
  try {
    // Get total counts
    const totalBookings = await Booking.countDocuments()
    const totalUsers = await User.countDocuments()
    const totalFeedback = await Feedback.countDocuments()

    // Get bookings by status
    const pendingBookings = await Booking.countDocuments({ status: "pending" })
    const confirmedBookings = await Booking.countDocuments({ status: "confirmed" })
    const cancelledBookings = await Booking.countDocuments({ status: "cancelled" })
    const completedBookings = await Booking.countDocuments({ status: "completed" })

    // Get average feedback rating
    const feedbackResult = await Feedback.aggregate([
      {
        $group: {
          _id: null,
          averageRating: { $avg: "$rating" },
        },
      },
    ])

    const averageRating = feedbackResult.length > 0 ? Number.parseFloat(feedbackResult[0].averageRating.toFixed(1)) : 0

    // Get bookings for today
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)

    const todayBookings = await Booking.countDocuments({
      date: { $gte: today, $lt: tomorrow },
    })

    // Get new users in the last 7 days
    const lastWeek = new Date()
    lastWeek.setDate(lastWeek.getDate() - 7)

    const newUsers = await User.countDocuments({
      createdAt: { $gte: lastWeek },
    })

    res.json({
      totalBookings,
      totalUsers,
      totalFeedback,
      bookingsByStatus: {
        pending: pendingBookings,
        confirmed: confirmedBookings,
        cancelled: cancelledBookings,
        completed: completedBookings,
      },
      averageRating,
      todayBookings,
      newUsers,
    })
  } catch (error) {
    console.error("Get dashboard stats error:", error.message)
    res.status(500).json({ message: "Server error" })
  }
}

// @desc    Get booking trends over time
// @route   GET /api/admin/dashboard/booking-trends
// @access  Private/Admin
export const getBookingTrends = async (req, res) => {
  try {
    // Get bookings by day for the last 30 days
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

    const bookings = await Booking.find({
      createdAt: { $gte: thirtyDaysAgo },
    }).select("createdAt status")

    // Group bookings by day
    const bookingsByDay = {}

    bookings.forEach((booking) => {
      const date = booking.createdAt.toISOString().split("T")[0]

      if (!bookingsByDay[date]) {
        bookingsByDay[date] = {
          total: 0,
          pending: 0,
          confirmed: 0,
          cancelled: 0,
          completed: 0,
        }
      }

      bookingsByDay[date].total++
      bookingsByDay[date][booking.status]++
    })

    // Convert to array for easier consumption by frontend
    const trends = Object.keys(bookingsByDay).map((date) => ({
      date,
      ...bookingsByDay[date],
    }))

    // Sort by date
    trends.sort((a, b) => new Date(a.date) - new Date(b.date))

    res.json(trends)
  } catch (error) {
    console.error("Get booking trends error:", error.message)
    res.status(500).json({ message: "Server error" })
  }
}

// @desc    Get user growth over time
// @route   GET /api/admin/dashboard/user-growth
// @access  Private/Admin
export const getUserGrowth = async (req, res) => {
  try {
    // Get users created in the last 6 months
    const sixMonthsAgo = new Date()
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6)

    const users = await User.find({
      createdAt: { $gte: sixMonthsAgo },
    }).select("createdAt")

    // Group users by month
    const usersByMonth = {}

    users.forEach((user) => {
      const date = user.createdAt
      const monthYear = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`

      if (!usersByMonth[monthYear]) {
        usersByMonth[monthYear] = 0
      }

      usersByMonth[monthYear]++
    })

    // Convert to array for easier consumption by frontend
    const growth = Object.keys(usersByMonth).map((month) => ({
      month,
      count: usersByMonth[month],
    }))

    // Sort by month
    growth.sort((a, b) => a.month.localeCompare(b.month))

    res.json(growth)
  } catch (error) {
    console.error("Get user growth error:", error.message)
    res.status(500).json({ message: "Server error" })
  }
}

// @desc    Get feedback analytics
// @route   GET /api/admin/dashboard/feedback-analytics
// @access  Private/Admin
export const getFeedbackAnalytics = async (req, res) => {
  try {
    // Get count of feedback by rating
    const ratingCounts = await Feedback.aggregate([
      {
        $group: {
          _id: "$rating",
          count: { $sum: 1 },
        },
      },
      {
        $sort: { _id: 1 },
      },
    ])

    // Format the results
    const ratingDistribution = {}
    for (let i = 1; i <= 5; i++) {
      const found = ratingCounts.find((item) => item._id === i)
      ratingDistribution[i] = found ? found.count : 0
    }

    // Get recent feedback trends (last 3 months)
    const threeMonthsAgo = new Date()
    threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3)

    const recentFeedback = await Feedback.find({
      createdAt: { $gte: threeMonthsAgo },
    }).select("createdAt rating")

    // Group by month and calculate average rating
    const feedbackByMonth = {}

    recentFeedback.forEach((feedback) => {
      const date = feedback.createdAt
      const monthYear = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`

      if (!feedbackByMonth[monthYear]) {
        feedbackByMonth[monthYear] = {
          totalRating: 0,
          count: 0,
        }
      }

      feedbackByMonth[monthYear].totalRating += feedback.rating
      feedbackByMonth[monthYear].count++
    })

    // Calculate average rating by month
    const trends = Object.keys(feedbackByMonth).map((month) => ({
      month,
      averageRating: Number.parseFloat((feedbackByMonth[month].totalRating / feedbackByMonth[month].count).toFixed(1)),
      count: feedbackByMonth[month].count,
    }))

    // Sort by month
    trends.sort((a, b) => a.month.localeCompare(b.month))

    res.json({
      ratingDistribution,
      trends,
    })
  } catch (error) {
    console.error("Get feedback analytics error:", error.message)
    res.status(500).json({ message: "Server error" })
  }
}

