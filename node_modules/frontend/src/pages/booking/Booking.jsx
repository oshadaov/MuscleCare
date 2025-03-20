"use client"

import { useState, useEffect } from "react";
import api from "../../utils/api";
import BookingForm from "../../components/bookingComponents/BookingForm";
import BookingList from "../../components/bookingComponents/BookingList";
import "./Booking.css";
import UserBookings from "../../components/bookingComponents/UserBookings";

function Booking() {
  const [allBookings, setAllBookings] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchAllBookings();
  }, []);

  const fetchAllBookings = async () => {
    try {
      const response = await api.get("/booking/all");
      setAllBookings(response.data);
    } catch (err) {
      setError("Failed to fetch all bookings. Please try again.");
    }
  };

  const handleStatusUpdate = async (id, newStatus) => {
    try {
      await api.put(`/booking/${id}/status`, { status: newStatus });
      fetchAllBookings();
    } catch (err) {
      setError("Failed to update booking status. Please try again.");
    }
  };

  return (
    <div className="container">
      <section className="section">
        <h1>Book Your Medical Appointment</h1>

        
        <div className="booking-content">
          <div className="booking-list-container">
            <BookingForm onBookingCreated={fetchAllBookings} />
          </div>
          <div className="booking-list-container">
            <BookingList bookings={allBookings} onStatusUpdate={handleStatusUpdate} />
          </div>
        </div>
</section>
<UserBookings/>

      </div>
    
  );
}

export default Booking;