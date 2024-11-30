import React, { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import '../style/headerStyle/HeaderStyle.css';

function Header() {
    const location = useLocation();

    useEffect(() => {
        // Create and append Botpress script
        const scriptBotpress = document.createElement('script');
        scriptBotpress.src = "https://cdn.botpress.cloud/webchat/v2.2/inject.js";  // Botpress WebChat script
        scriptBotpress.async = true;

        // Create and append Botpress configuration script
        const scriptConfig = document.createElement('script');
        scriptConfig.src = "https://files.bpcontent.cloud/2024/11/30/08/20241130082416-J4QA7KKK.js";  // Your configuration file
        scriptConfig.async = true;

        // Load both scripts
        document.body.appendChild(scriptBotpress);
        document.body.appendChild(scriptConfig);

        // Cleanup on component unmount
        return () => {
            document.body.removeChild(scriptBotpress);
            document.body.removeChild(scriptConfig);
        };
    }, []);

    // Function to open the chat when the floating button is clicked
    const openChat = () => {
        if (window.botpressWebChat) {
            window.botpressWebChat.open();  // This triggers the chat to open
        }
    };

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
                
                {location.pathname === "/signin" ? (
                    <Link to="/signup" className="signin-btn">Sign Up</Link>
                ) : (
                    <Link to="/signin" className="signin-btn">Sign In</Link>
                )}
            </div>
        </div>
    );
}

export default Header;
