import React from 'react';
import '../App.css'; // Import the updated CSS

// Import images from the 'public' or 'src/assets' directory
import phoneIcon from '../assets/phone.png'; // Adjust path based on where you store images
import emailIcon from '../assets/email.png';
import addressIcon from '../assets/address.png';

export default function ContactPage() {
  return (
    <div id="contact">
      <h2 className="contact-title">CONTACT <span className="highlight">INFO</span></h2>
      
      <div className="contact-container">
        <div className="contact-card">
          <img src={phoneIcon} alt="phone icon" className="contact-icon" />
          <h3>PHONE</h3>
          <p>236-886-7898</p>
        </div>
        
        <div className="contact-card">
          <img src={emailIcon} alt="email icon" className="contact-icon" />
          <h3>E-MAIL</h3>
          <p>Fatimarezaie1234@gmail.com</p>
        </div>
        
        <div className="contact-card">
          <img src={addressIcon} alt="address icon" className="contact-icon" />
          <h3>ADDRESS</h3>
          <p>19013 Ford Road PITT MEADOWS</p>
        </div>
      </div>
    </div>
  );
}
