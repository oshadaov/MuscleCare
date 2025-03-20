import React from "react";
import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin } from "lucide-react";
import "./Footer.css";
import LOGO from '../assets/musclecare.jpg'

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">

        {/* Logo & Description */}
        <div className="footer-section">
          <div className="footer-logo">
            <img src={LOGO} alt="" />
          </div>
          <p className="footer-description">
            We are a young company always looking for new and creative ideas to help you with our products in your everyday work.
          </p>
          <p><a href="#">Our Team</a></p>
        </div>

        {/* Contact Section */}
        <div className="footer-section">
          <h3>Contact</h3>
          <p><MapPin className="footer-icon" /> 123 Medical Center Drive, New York, NY</p>
          <p><Phone className="footer-icon" /> +1 (123) 456-7890</p>
          <p><Mail className="footer-icon" /> <a href="mailto:info@medicalbooking.com">info@medicalbooking.com</a></p>
        </div>

        {/* Quick Links */}
        <div className="footer-section">
          <h3>Links</h3>
          <div className="footer-links">
            <a href="#">Home</a>
            <a href="#">About Us</a>
            <a href="#">Services</a>
            <a href="#">Contact</a>
          </div>
        </div>

        {/* Social Media */}
        <div className="footer-section">
          <h3>Follow Us</h3>
          <div className="social-icons">
            <a href="#"><Facebook className="social-icon" /></a>
            <a href="#"><Twitter className="social-icon" /></a>
            <a href="#"><Instagram className="social-icon" /></a>
            <a href="#"><Linkedin className="social-icon" /></a>
          </div>
        </div>

      </div>

    
      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} Medical Booking. All rights reserved.</p>

      </div>

    </footer>
  );
};

export default Footer;
