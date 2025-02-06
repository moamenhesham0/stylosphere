import React, { useEffect , useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useUser } from './user/UserContext';
import '../style/headerStyle/HeaderStyle.css';
import { Avatar } from "@mui/material";
import { useLocalCart } from './cart/localCartContext';
function Header() {
    const { user , updateUser , clearUser } = useUser();
    const { cart , clearLocalCart} = useLocalCart();
    const location = useLocation();
    const [userLogin, setUserlogin] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const toggleMenu = () => setIsOpen((prev) => !prev);
    const navigate = useNavigate();
    useEffect(() => {
        setUserlogin(user.userStatus);
        console.log(user.type);
      }, [user.userStatus]); 
    
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

    const logOut= () => {
          clearUser();
          clearLocalCart();
          navigate("/");
      };
      
    
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
                    {user.type !== "admin" && (
                        <Link to="/cart" className="nav-item">Cart</Link>
                    )}
                    {user.type === "admin" && (
                        <Link to="/orders" className="nav-item">Orders</Link>
                    )}
                </div>
                {userLogin ? (
                    (
                        <div className="profile-menu">
                          <div className="profile-icon" onClick={toggleMenu}>
                            <Avatar
                              alt="User Profile"
                              src={user?.image ? `data:image/jpeg;base64,${user.image}` : "/assets/profilePic.svg"}  // Conditionally set the image
                              className="profile-pic"
                            />
                          </div>
                          {isOpen && (
                            <div className="dropdown-menu" onClick={toggleMenu}>
                              <Link
                                to={
                                  user.type === "admin"
                                    ? "/admin/ProfileAdmin"
                                    : "/userProfile"
                                }
                                className="dropdown-item"
                              >
                                Profile
                              </Link>
                              <div className="dropdown-item" onClick={() => { logOut(); toggleMenu(); }}>
                                Log Out
                              </div>
                            </div>
                          )}
                        </div>
                      )
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
