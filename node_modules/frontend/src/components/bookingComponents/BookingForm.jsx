"use client";

import { useState, useEffect } from "react";
import api from "../../utils/api";
import "./BookingForm.css";

function BookingForm({ onBookingCreated }) {
  const [bookingData, setBookingData] = useState({
    name: "",
    date: "",
    time: "",
    telephone: "",
    treatment: "",
  });

  const [treatments, setTreatments] = useState([]);
  const [bookedSlots, setBookedSlots] = useState([]); // Store booked slots
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const timeSlots = ["9-10 AM", "10-12 PM", "1-2 PM", "3-5 PM"];
  const today = new Date().toISOString().split("T")[0];

  useEffect(() => {
    fetchTreatments();
  }, []);

  useEffect(() => {
    if (bookingData.date) {
      fetchBookedSlots(bookingData.date);
    }
  }, [bookingData.date]);

  // Fetch available treatments
  const fetchTreatments = async () => {
    try {
      const response = await api.get("/admin/services?sort=createdAt");
      setTreatments(response.data);
    } catch (err) {
      console.error("Error fetching services:", err);
      setError("Failed to load services. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Fetch booked slots for selected date
  const fetchBookedSlots = async (selectedDate) => {
    try {
      const response = await api.get(`/booking?date=${selectedDate}`);
      const bookedTimes = response.data.map((booking) => booking.timeSlot);
      setBookedSlots(bookedTimes);
    } catch (err) {
      console.error("Error fetching booked slots:", err);
      setError("Failed to load booked slots.");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setBookingData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      await api.post("/booking", bookingData);
      alert("Booking submitted successfully!");
      onBookingCreated();
      setBookingData({ name: "", date: "", time: "", telephone: "", treatment: "" });
      setBookedSlots([]); // Reset booked slots after new booking
    } catch (err) {
      setError(err.response?.data?.message || "An error occurred while booking");
    }
  };

  return (
    <div className="booking-container">
      <h2 className="booking-title">New Booking</h2>
      {error && <p className="booking-error">{error}</p>}

      <form onSubmit={handleSubmit} className="booking-form">
        <div className="form-group">
          <label htmlFor="name">Full Name</label>
          <input type="text" id="name" name="name" value={bookingData.name} onChange={handleChange} required />
        </div>

        <div className="form-group">
          <label htmlFor="date">Date</label>
          <input
            type="date"
            id="date"
            name="date"
            value={bookingData.date}
            onChange={handleChange}
            min={today} // Prevent past dates
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="time">Time Slot</label>
          <select id="time" name="time" value={bookingData.time} onChange={handleChange} required>
            <option value="">Select a time slot</option>
            {timeSlots.map((slot) => (
              <option key={slot} value={slot} disabled={bookedSlots.includes(slot)}>
                {bookedSlots.includes(slot) ? `${slot} (Booked)` : slot}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="telephone">Telephone</label>
          <input type="tel" id="telephone" name="telephone" value={bookingData.telephone} onChange={handleChange} required />
        </div>

        <div className="form-group">
          <label>Treatment</label>
          <div className="treatment-options">
            {loading ? (
              <p>Loading treatments...</p>
            ) : (
              treatments.map((treatment) => (
                <div key={treatment._id} className="treatment-option">
                  <input
                    type="radio"
                    id={treatment._id}
                    name="treatment"
                    value={treatment.name}
                    checked={bookingData.treatment === treatment.name}
                    onChange={handleChange}
                    required
                  />
                  <label htmlFor={treatment._id}>
                    <img src={treatment.imageUrl || "/placeholder.svg"} alt={treatment.name} className="treatment-image" />
                    <span>{treatment.name}</span>
                  </label>
                </div>
              ))
            )}
          </div>
        </div>

        <button type="submit" className="btn btn-primary">
          Book Appointment
        </button>
      </form>
    </div>
  );
}

export default BookingForm;
