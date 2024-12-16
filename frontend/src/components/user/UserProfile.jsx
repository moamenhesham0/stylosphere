import '../../style/UserProfileStyle/UserProfileStyle.css';
import React, { useEffect, useState } from "react";
import { useUser } from './UserContext';

function UserProfile() {
  const { user, updateUser } = useUser();
  const [userName, setUserName] = useState("N/A");
  const [userAdress, setUserAdress] = useState("N/A");
  const [userEmail, setUserEmail] = useState("N/A");
  const [userphone, setUserPhone] = useState("N/A");
  const [usermobile, setUserMobile] = useState("N/A");
  const [cartItems, setCartItems] = useState([]);
  const [userPhoto, setUserPhoto] = useState("N/A");
  useEffect(() => {
    if (user) {
      setUserName(user.name);
      setUserEmail(user.email);
      setUserPhoto(user.image);
    }
  }, [user]);

  const handleImageUpload = (event) => {
    const file = event.target.files[0];  // Get the file from the file input

    if (file) {
      const reader = new FileReader();

      reader.onloadend = () => {
        const base64Image = reader.result.split(',')[1];  // Get the base64 string
        sendImageToBackend(base64Image);  // Send the image to the backend
        setUserPhoto(base64Image);  // Update the image in the front-end
        updateUser({
          ...user,
          image: base64Image,  // Update the image in UserContext
        });
      };

      reader.readAsDataURL(file);  // Start reading the file
    }
  };

  const sendImageToBackend = (base64Image) => {
    fetch('http://localhost:8080/api/customers/photo-upload', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: userEmail,
        image: base64Image,
      }),
    })
      .then(response => response.json())
      .then(data => {
        console.log('Success:', data);
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  };


  useEffect(() => {
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

  return (
    <div className="profileUser-container">
      {/* Left Section */}
      <div className="profileUser-left">
        <div
          className="profileUser-image"
          onClick={() => document.getElementById('imageUpload').click()}  // Trigger file input click on image click
        >
          <img
            src={userPhoto ? `data:image/jpeg;base64,${userPhoto}` : "https://via.placeholder.com/100"}
            alt="Profile User Picture"
          />
        </div>
        <h2>{userName}</h2>
        <p>{userAdress}</p>

        {/* Hidden file input for image upload */}
        <input
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          style={{ display: 'none' }}
          id="imageUpload"
        />
      </div>

      {/* Right Section */}
      <div className="profileUser-right">
        {/* User Info */}
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

        {/* Purchases */}
        <div className="userPurchases">
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
              <h3>${cartItems.reduce((total, item) => total + item.price, 0)}</h3>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserProfile;



