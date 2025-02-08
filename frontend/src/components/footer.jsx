import React from 'react';
import { FaFacebook, FaInstagram, FaLinkedin } from 'react-icons/fa';
import '../style/footer.css';
import { useUser } from './user/UserContext';
import { BsTwitterX } from "react-icons/bs";

const Footer = () => {
      const { user , updateUser , clearUser } = useUser();
  
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-section">
          <h3>About Us</h3>
          <p>Stylosphere is your destination for fashion inspiration and style guides.</p>
        </div>
        
        <div className="footer-section">
          <h3>Quick Links</h3>
          <ul>
            <li><a href="/">Home</a></li>
            <li><a href="/shop">Shop</a></li>
            { user.type === "customer" ? <li><a href="/cart">Cart</a></li> : <li><a href="/admin/Complaints">Complaints</a></li> }
            { user.type === "customer" ? <li><a href="/userProfile">Profile</a></li> : <li><a href="/admin/ProfileAdmin">Profile</a></li> }
          </ul>
        </div>
        
        <div className="footer-section">
          <h3>Contact Us</h3>
          <p>Email: info@stylosphere.com</p>
          <p>Phone: (123) 456-7890</p>
        </div>
        
        <div className="footer-section">
          <h3>Follow Us</h3>
          <div className="social-icons">
            <a href="https://www.facebook.com"><FaFacebook /></a>
            <a href="https://www.twitter.com"><BsTwitterX /></a>
            <a href="https://www.instagram.com"><FaInstagram /></a>
            <a href="https://www.linkedin.com"><FaLinkedin /></a>
          </div>
        </div>
      </div>
      
      <div className="footer-bottom">
        <img src="/assets/brandIcon.svg" alt="StyloSphere Logo" className="footer-logo" />
        <p>&copy; 2025 Stylosphere. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;