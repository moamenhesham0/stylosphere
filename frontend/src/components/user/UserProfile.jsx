import '../../style/UserProfileStyle/UserProfileStyle.css';
import React, { useEffect, useState } from "react";

function UserProfile() {
    const [userName, setUserName] = useState("user name");
    const [userAdress, setUserAdress] = useState("Bay Area, San Francisco, CA");
    const [userEmail, setUserEmail] = useState("username@gmail.com");
    const [userphone, setUserPhone] = useState("(239) 816-9029");
    const [usermobile, setUserMobile] = useState("(320) 380-4539");
    const [cartItems, setCartItems] = useState([]);

    useEffect(() => {
      // Fetch cart items specific to UserProfile from localStorage
      const storedCart = JSON.parse(localStorage.getItem('userProfileCart')) || [];
      setCartItems(storedCart);
  }, []);
  
  localStorage.setItem(
      'userProfileCart',
      JSON.stringify([
          { name: "Nike Shoes", price: 99.99, image: "https://via.placeholder.com/150" },
          { name: "Adidas Shirt", price: 49.99, image: "https://via.placeholder.com/150" },
          { name: "Puma Hat", price: 29.99, image: "https://via.placeholder.com/150" }
      ])
  );
    return(
    <div className="profileUser-container">
        {/* <!-- Left Section --> */}
        <div className="profileUser-left">
        <div className="profileUser-image">
            <img src="https://via.placeholder.com/100" alt="ProfileUser Picture" />
        </div>
        <h2>{userName}</h2>
        <p>{userAdress}</p>
        


        </div>

        {/* <!-- Right Section --> */}
        <div className="profileUser-right">
        {/* <!-- User Info --> */}
        <div className="user-info">
            <h3>Full Name</h3>
            <p>{userName}</p>
            <h3>Email</h3>
            <p>{userEmail}</p>
            <h3>Phone</h3>
            <p>{userphone}</p>
            <h3>Mobile</h3>
            <p>{usermobile}</p>
            <h3>Address</h3>
            <p>{userAdress}</p>
        </div>
        
        {/* <!-- purchases --> */}
        <div className='userPurchases'>

         <div className="cart">
        {cartItems.length > 0 ? (
          cartItems.map((item, index) => (
            <div className="cart-item" key={index}>
              <img src={item.image} alt={item.name} />
              <div className="cart-item-details">
                <h3>{item.name}</h3>
              </div>
              <div className="cart-item-price">${item.price}</div>
            </div>
          ))
        ) : (
          <h2>Your Purchases</h2> 
        )}
        <div className="cart-summary">
          <h3>Total</h3>
          <h3>${cartItems.reduce((total, item) => total + item.price,0)}</h3>
        </div>
      </div>

        </div>
        </div>
    </div>
    );
}

export default UserProfile;