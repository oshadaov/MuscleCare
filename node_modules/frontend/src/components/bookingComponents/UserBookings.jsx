"use client"

import { useState, useEffect } from "react";
import { format } from "date-fns";
import { Calendar, Clock, Tag, AlertCircle, CheckCircle, XCircle } from "lucide-react";
import api from "../../utils/api";
import "./UserBookings.css"; // Import external CSS file

function UserBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    fetchUserBookings();
  }, []);

  const fetchUserBookings = async () => {
    try {
      setLoading(true);
      const response = await api.get("/booking");
      setBookings(response.data);
      setError(null);
    } catch (err) {
      console.error("Error fetching user bookings:", err);
      setError("Failed to load your bookings. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateBooking = async (bookingId, status) => {
    try {
      setBookings((prevBookings) =>
        prevBookings.map((booking) =>
          booking._id === bookingId ? { ...booking, status } : booking
        )
      );
      await api.put(`/booking/${bookingId}/status`, { status });
      fetchUserBookings();
    } catch (err) {
      console.error(`Error updating booking status to ${status}:`, err);
    }
  };

  const formatDate = (dateString) => {
    return format(new Date(dateString), "EEEE, MMMM d, yyyy");
  };

  const filteredBookings = bookings.filter((booking) => {
    if (filter === "all") return true;
    return booking.status === filter;
  });

  if (loading) {
    return <div className="loading-spinner"></div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="user-bookings-container">
      <h2 className="user-bookings-title">My Bookings</h2>
      <div className="filter-controls">
        <button onClick={() => setFilter("all")} className={filter === "all" ? "active" : ""}>All</button>
        <button onClick={() => setFilter("pending")} className={filter === "pending" ? "active" : ""}>Pending</button>
        <button onClick={() => setFilter("confirmed")} className={filter === "confirmed" ? "active" : ""}>Confirmed</button>
        <button onClick={() => setFilter("cancelled")} className={filter === "cancelled" ? "active" : ""}>Cancelled</button>
      </div>
      {filteredBookings.length === 0 ? (
        <div className="no-bookings">No bookings found.</div>
      ) : (
        <div className="bookings-grid">
          {filteredBookings.map((booking) => (
            <div key={booking._id} className="booking-card">
              <div className="booking-details">
                <h3>{booking.treatment}</h3>
                <p><Calendar /> {formatDate(booking.date)}</p>
                <p><Clock /> {booking.time}</p>
                <p><Tag /> Booking #{booking._id.substring(booking._id.length - 6)}</p>
              </div>
              <div className="booking-actions">
                {booking.status === "pending" && (
                  <>
                    <button onClick={() => handleUpdateBooking(booking._id, "confirmed")} className="confirm-btn">Confirm</button>
                    <button onClick={() => handleUpdateBooking(booking._id, "cancelled")} className="cancel-btn">Cancel</button>
                  </>
                )}
                {booking.status === "confirmed" && <span className="status-confirmed">Confirmed</span>}
                {booking.status === "cancelled" && <span className="status-cancelled">Cancelled</span>}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default UserBookings;
