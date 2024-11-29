import React from 'react';
import { Link } from 'react-router-dom';
import '../style/headerStyle/HeaderStyle.css';

function Header() {
    return (
        <div className="header">
            {/* Logo */}
            <Link to="/" className="logo">
                <img src="/assets/brandIcon.svg" alt="StyloSphere Logo" />
            </Link>

            {/* Navigation */}
            <div className="nav">
                <Link to="/shop" className="nav-item">Shop</Link>
                <Link to="/cart" className="nav-item">Cart</Link>
                {/* Sign In Button */}
                <Link to="/signup" className="signin-btn">Sign Up</Link>
            </div>
        </div>
    );
}

export default Header;




