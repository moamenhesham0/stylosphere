import React, { useEffect, useState, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useUser } from './user/UserContext';
import '../style/headerStyle/HeaderStyle.css';
import { Avatar } from '@mui/material';
import ShoppingBag from '@mui/icons-material/ShoppingBag';
import { useLocalCart } from './cart/localCartContext';
import { FaFacebookF, FaTwitter, FaInstagram, FaYelp } from 'react-icons/fa';

function Header() {
    const { user, clearUser } = useUser();
    const { cart, clearLocalCart } = useLocalCart();
    const location = useLocation();
    const [userLogin, setUserLogin] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const menuRef = useRef(null);
    const navigate = useNavigate();
    const SignInPagePresence = location.pathname === '/signin';

    useEffect(() => {
        setUserLogin(user.userStatus);
    }, [user.userStatus]);

    const logOut = () => {
        clearUser();
        clearLocalCart();
        setIsOpen(false);
        navigate('/');
    };

    const toggleMenu = () => {
        setIsOpen(prev => !prev);
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div className="header-container">
            {/* Left: Social Media Icons */}
            <div className="header-left">
                <div className="social-icons">
                    <FaFacebookF className="icon" />
                    <FaTwitter className="icon" />
                    <FaInstagram className="icon" />
                    <FaYelp className="icon" />
                </div>
            </div>
            
            {/* Center: Logo / Brand Name with Navigation */}
            <div className="header-center">
                <nav className="nav-menu">
                    <Link to="/" state={{ scrollTo: "learn-more", delayScroll: 300 }} className="nav-item">About</Link>
                    <Link to="/" state={{ scrollTo: "contact-us", delayScroll: 300 }} className="nav-item">Contact us</Link>
                    <Link to="/" className="logo-text"><img src="/assets/brandIcon.svg" alt="StyloSphere Logo" /></Link>
                    <Link to="/shop" className="nav-item">Shop</Link>
                    <Link to={user.type === 'admin'? '/orders' : '/cart'} className="nav-item">{user.type === 'admin'? <>Orders</> : <ShoppingBag />}</Link>
                </nav>
            </div>
            
            {/* Right: User Profile / Sign In */}
            <div className="header-right">
                {userLogin ? (
                    <div className="profile-menu" ref={menuRef}>
                        <div className="profile-icon" onClick={toggleMenu}>
                        {user?.image?
                            <Avatar src={`data:image/jpeg;base64,${user.image}`} className="profile-pic" />
                                :
                            <Avatar className="profile-pic">{user.name.charAt(0).toUpperCase()}</Avatar>
                        }
                            
                            
                        </div>
                        {isOpen && (
                            <div className="dropdown-menu">
                                <div className="dropdown-item" onClick={() => {navigate(user.type === 'admin' ? '/admin/ProfileAdmin' : '/userProfile'); setIsOpen(false);}}>Profile</div>
                                <div className="dropdown-item" onClick={() => { logOut(); setIsOpen(false); }}>Log Out</div>
                            </div>
                        )}
                    </div>
                ) : (
                    <button className="animated-button" onClick={() => navigate(SignInPagePresence ? '/signup' : '/signin')}>
                        <svg viewBox="0 0 24 24" className="arr-2" xmlns="http://www.w3.org/2000/svg">
                            <path
                                d="M16.1716 10.9999L10.8076 5.63589L12.2218 4.22168L20 11.9999L12.2218 19.778L10.8076 18.3638L16.1716 12.9999H4V10.9999H16.1716Z"
                            ></path>
                        </svg>
                        <span className="text">{SignInPagePresence ? 'Sign Up' : 'Sign In'}</span>
                        <span className="circle"></span>
                        <svg viewBox="0 0 24 24" className="arr-1" xmlns="http://www.w3.org/2000/svg">
                            <path
                                d="M16.1716 10.9999L10.8076 5.63589L12.2218 4.22168L20 11.9999L12.2218 19.778L10.8076 18.3638L16.1716 12.9999H4V10.9999H16.1716Z"
                            ></path>
                        </svg>
                    </button>
                )}
            </div>
        </div>
    );
}

export default Header;
