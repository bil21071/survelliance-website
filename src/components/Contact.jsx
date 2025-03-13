import React from 'react';
import '../components/a.css';

const ContactSection = () => {
  return (
    <div id="contact" className="contact-container">
      <h2>Contact Me</h2>
      <p>If you'd like to get in touch, feel free to email me or give me a call!</p>

      <div className="contact-info">
        <div className="contact-item">
          <i className="fas fa-envelope"></i>
          <a
            href="https://mail.google.com/mail/?view=cm&fs=1&to=bilalzubairi031@gmail.com"
            className="contact-link"
            target="_blank"
            rel="noopener noreferrer"
          >
            bilalzubairi031@gmail.com
          </a>
        </div>

        <div className="contact-item">
          <i className="fas fa-phone-alt"></i>
          <a href="tel:+923313732935" className="contact-link">
            +923313732935
          </a>
        </div>
      </div>
    </div>
  );
};

export default ContactSection;
