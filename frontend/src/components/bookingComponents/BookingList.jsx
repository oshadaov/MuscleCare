import { format } from "date-fns"
import './BookingList.css'
function BookingList({ bookings, onStatusUpdate }) {
  const formatDate = (dateString) => {
    return format(new Date(dateString), "EEEE, MMMM d, yyyy")
  }

  return (
    <div className="booking-table-container">
      <h2 className="booking-title">All Bookings</h2>
      <table className="booking-table">
        <thead>
          <tr>
            <th>Date</th>
            <th>Time Slot</th>
            <th>Status</th>
            
          </tr>
        </thead>
        <tbody>
          {bookings.map((booking) => (
            <tr key={booking._id}>
              <td>{formatDate(booking.date)}</td>
              <td>{booking.time}</td>
              <td>
                <span className={`status-badge status-${booking.status}`}>{booking.status}</span>
              </td>
             
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default BookingList

