import React, { useState } from 'react';
import '../styles/Contact.css';

function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Message sent! We will get back to you soon.');
    setFormData({ name: '', email: '', message: '' });
  };

  return (
    <main className="contact">
      <div className="container">
        <section className="contact-header">
          <h1>Contact Us</h1>
          <p>Get in touch with our team for any inquiries</p>
        </section>
        
        <section className="contact-content">
          <div className="contact-info">
            <h2>Get In Touch</h2>
            <div className="info-item">
              <h3>Email</h3>
              <p>support@pcpartsshop.com</p>
            </div>
            <div className="info-item">
              <h3>Phone</h3>
              <p>+1 (555) 123-4567</p>
            </div>
            <div className="info-item">
              <h3>Address</h3>
              <p>123 Tech Street, Computer City, CC 10101</p>
            </div>
          </div>
          
          <form className="contact-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="name">Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="message">Message</label>
              <textarea
                id="message"
                name="message"
                rows="5"
                value={formData.message}
                onChange={handleChange}
                required
              ></textarea>
            </div>
            
            <button type="submit" className="submit-btn">Send Message</button>
          </form>
        </section>
      </div>
    </main>
  );
}

export default Contact;