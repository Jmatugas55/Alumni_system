import React, { useState } from "react";
import "../css/OverallStyle.css";

const ContactUs = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would send the form data to your backend or email service
    setSubmitted(true);
    setForm({ name: "", email: "", message: "" });
  };

  return (
    <div className="contact-bg">
      <div className="contact-container">
        <h2 className="contact-title">Contact Us</h2>
        <p className="contact-desc">
          Have questions, feedback, or want to connect? <br />
          Fill out the form below and our alumni team will get back to you!
        </p>
        {submitted ? (
          <div className="contact-success">
            Thank you for reaching out! We will get back to you soon.
          </div>
        ) : (
          <form className="contact-form" onSubmit={handleSubmit}>
            <input
              type="text"
              className="contact-input"
              name="name"
              placeholder="Your Name"
              value={form.name}
              onChange={handleChange}
              required
            />
            <input
              type="email"
              className="contact-input"
              name="email"
              placeholder="Your Email"
              value={form.email}
              onChange={handleChange}
              required
            />
            <textarea
              className="contact-textarea"
              name="message"
              placeholder="Your Message"
              value={form.message}
              onChange={handleChange}
              required
              rows={5}
            />
            <button className="contact-btn" type="submit">
              Send Message
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default ContactUs;