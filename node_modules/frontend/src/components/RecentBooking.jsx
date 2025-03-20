import { Link } from "react-router-dom"

function RecentBookings({ bookings, loading, error }) {
  if (loading) {
    return <p>Loading bookings...</p>
  }

  if (error) {
    return <p className="error">{error}</p>
  }

  if (bookings.length === 0) {
    return <p>You have no bookings.</p>
  }

  return (
    <div className="home-bookings">
      <h2 className="home-bookings-title">Your Recent Bookings</h2>
      <div className="home-booking-list">
        {bookings.slice(0, 3).map((booking) => (
          <div key={booking._id} className="home-booking-item">
            <p>
              <strong>Date:</strong> {new Date(booking.date).toLocaleDateString()}
            </p>
            <p>
              <strong>Time:</strong> {booking.time}
            </p>
            <p>
              <strong>Treatment:</strong> {booking.treatment}
            </p>
            <p>
              <strong>Status:</strong> {booking.status}
            </p>
          </div>
        ))}
      </div>
      {bookings.length > 3 && (
        <Link to="/booking" className="btn btn-primary">
          View all bookings
        </Link>
      )}
    </div>
  )
}

export default RecentBookings

