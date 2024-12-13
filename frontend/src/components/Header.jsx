import React, { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import '../style/headerStyle/HeaderStyle.css';
import { Avatar } from "@mui/material"

function Header() {
    const location = useLocation();
    const userLogin = true;
    
    useEffect(() => {
       
        const scriptBotpress = document.createElement('script');
        scriptBotpress.src = "https://cdn.botpress.cloud/webchat/v2.2/inject.js";  
        scriptBotpress.async = true;

        
        const scriptConfig = document.createElement('script');
        scriptConfig.src = "https://files.bpcontent.cloud/2024/11/30/08/20241130082416-J4QA7KKK.js";  
        scriptConfig.async = true;

        document.body.appendChild(scriptBotpress);
        document.body.appendChild(scriptConfig);

        return () => {
            document.body.removeChild(scriptBotpress);
            document.body.removeChild(scriptConfig);
        };
    }, []);

  
    const openChat = () => {
        if (window.botpressWebChat) {
            window.botpressWebChat.open(); 
        }
    };

    return (
        <div className="header">

            <Link to="/" className="logo">
                <img src="/assets/brandIcon.svg" alt="StyloSphere Logo" />
            </Link>

            <div className="nav">
                <div className='shop-cart'>
                <Link to="/shop" className="nav-item">Shop</Link>
                <Link to="/cart" className="nav-item">Cart</Link>
                </div>
                {userLogin ? (
                    <div className="profile">
                        <Link to="/userProfile">
                        <Avatar
                            alt="User Profile"
                            src="/assets/profilePic.svg"
                            className="profile-pic"
                        />

                        </Link>
                    </div>
                ) : (
                    location.pathname === "/signin" ? (
                        <Link to="/signup" className="signin-btn">Sign Up</Link>
                    ) : (
                        <Link to="/signin" className="signin-btn">Sign In</Link>
                    )
                )}
            </div>
        </div>
    );
}

export default Header;
