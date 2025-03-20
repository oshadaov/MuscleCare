import React from "react";
import { MapPin, Phone, Mail, Clock, Facebook, Twitter, Instagram, Youtube } from "lucide-react";
import "./ContactInfo.css"; 

const ContactInfo = () => {
  return (
    <div className="contact-container">
      <h2 className="contact-title">Contact Information</h2>

      <div className="contact-content">
        <div className="contact-item">
          <MapPin className="contact-icon" />
          <div>
            <h3 className="contact-subtitle">Address</h3>
            <p className="contact-text">
              123 Medical Center Drive <br />
              Suite 456 <br />
              New York, NY 10001
            </p>
          </div>
        </div>

        <div className="contact-item">
          <Phone className="contact-icon" />
          <div>
            <h3 className="contact-subtitle">Phone</h3>
            <p className="contact-text">
              <a href="tel:+11234567890" className="contact-link">+1 (123) 456-7890</a>
            </p>
          </div>
        </div>

        <div className="contact-item">
          <Mail className="contact-icon" />
          <div>
            <h3 className="contact-subtitle">Email</h3>
            <p className="contact-text">
              <a href="mailto:info@medicalbooking.com" className="contact-link">info@medicalbooking.com</a>
            </p>
          </div>
        </div>

        <div className="contact-item">
          <Clock className="contact-icon" />
          <div>
            <h3 className="contact-subtitle">Hours</h3>
            <p className="contact-text">Monday - Friday: 8:00 AM - 6:00 PM</p>
            <p className="contact-text">Saturday: 9:00 AM - 2:00 PM</p>
            <p className="contact-text">Sunday: Closed</p>
          </div>
        </div>

        <div className="contact-social">
          <h3 className="contact-subtitle">Follow Us</h3>
          <div className="social-icons">
            <a href="#" className="social-links"><Facebook className="social-icon" /></a>
            <a href="#" className="social-links"><Twitter className="social-icon" /></a>
            <a href="#" className="social-links"><Instagram className="social-icon" /></a>
            <a href="#" className="social-links"><Youtube className="social-icon" /></a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactInfo;
