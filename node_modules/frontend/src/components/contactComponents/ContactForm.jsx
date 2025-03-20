import { useState } from "react";
import { toast } from "react-toastify";
import api from "../../utils/api";
import "./ContactForm.css"; // Import the CSS file

const ContactForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const { name, email, phone, subject, message } = formData;

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });

    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: null });
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!name.trim()) newErrors.name = "Name is required";
    if (!email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
      newErrors.email = "Please enter a valid email address";
    }
    if (!subject.trim()) newErrors.subject = "Subject is required";
    if (!message.trim()) {
      newErrors.message = "Message is required";
    } else if (message.trim().length < 10) {
      newErrors.message = "Message must be at least 10 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsSubmitting(true);

    try {
      await api.post("/contact", formData);
      setSubmitSuccess(true);
      setFormData({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
      });

      toast.success("Your message has been sent successfully!");
      setTimeout(() => {
        setSubmitSuccess(false);
      }, 5000);
    } catch (err) {
      const errorMsg = err.response?.data?.message || "Something went wrong. Please try again.";
      toast.error(errorMsg);

      if (err.response?.data?.errors) {
        const serverErrors = {};
        err.response.data.errors.forEach((error) => {
          serverErrors[error.param] = error.msg;
        });
        setErrors(serverErrors);
      }
    } finally {
      setIsSubmitting(false);
    }
  };


  return (
    <><div className="contact-form-container">
      <h2 className="form-title">Get in Touch</h2>
      {submitSuccess && <div className="success-message">Thank you for your message! We'll get back to you soon.</div>}
    <form onSubmit={onSubmit} className="contact-form">
    <div className="form-group1">
      <label htmlFor="name">Name <span className="required">*</span></label>
      <input type="text" id="name" name="name" value={name} onChange={onChange} className={errors.name ? "error" : ""} placeholder="Your name" />
      {errors.name && <p className="error-text">{errors.name}</p>}
    </div>

    <div className="form-group1">
      <label htmlFor="email">Email <span className="required">*</span></label>
      <input type="email" id="email" name="email" value={email} onChange={onChange} className={errors.email ? "error" : ""} placeholder="Your email" />
      {errors.email && <p className="error-text">{errors.email}</p>}
    </div>

    <div className="form-group1">
      <label htmlFor="phone">Phone Number</label>
      <input type="tel" id="phone" name="phone" value={phone} onChange={onChange} placeholder="Your phone number" />
    </div>

    <div className="form-group1">
      <label htmlFor="subject">Subject <span className="required">*</span></label>
      <input type="text" id="subject" name="subject" value={subject} onChange={onChange} className={errors.subject ? "error" : ""} placeholder="Subject" />
      {errors.subject && <p className="error-text">{errors.subject}</p>}
    </div>

    <div className="form-group1">
      <label htmlFor="message">Message <span className="required">*</span></label>
      <textarea id="message" name="message" value={message} onChange={onChange} className={errors.message ? "error" : ""} placeholder="Your message"></textarea>
      {errors.message && <p className="error-text">{errors.message}</p>}
    </div>

    <button type="submit" disabled={isSubmitting} className="submit-button">
      {isSubmitting ? "Sending..." : "Send Message"}
    </button>
  </form>
  </div>
  </>)
}

export default ContactForm

