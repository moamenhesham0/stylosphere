import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import '../style/mainPageStyle/sinningInStyle.css';
import { useUser } from './user/UserContext';
import { useLocalCart } from './cart/localCartContext';
const SignIn = () => {
  const {user} = useUser();
  const {updateLocalCart , clearLocalCart} = useLocalCart();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { updateUser } = useUser(); // Access `updateUser` from context


  const saveLogInstance = async() =>{
    const browser = navigator.userAgent;
    const platform = browser.includes("Win")   ? "Windows" :
                     browser.includes("Mac")   ? "MacOS"   :
                     browser.includes("Linux") ? "Linux"   :
                                                 "Unknown" ;
                                                 
    const url = new URL(`http://localhost:8080/api/log-history/add-log-instance?userId=${user.userId}&device=${platform}&browser=${browser}`)
    const response = await fetch(url, {method:'POST'});
    
    const data = await response.json();
    console.log(data);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:8080/api/customers/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const data = await response.json();
        

        // Update context with user details
        updateUser({
          email: data.user.email,
          name: data.user.name,
          type: data.user.type,
          userStatus: true, // Set user as logged in
          adminLevel: data.user.adminLevel,
          image: data.user.userImage,
          userId: data.user.id,
        });
        // Save user log in instance.
        await saveLogInstance();

        // clear non-registered user cart
        clearLocalCart();

        
        const cartResponse = await fetch(
          `http://localhost:8080/api/cart/retrieve-cart?userId=${data.user.id}`,
          {
            method: 'GET',
          }
        );

        if (cartResponse.ok) {
          const cartData = await cartResponse.json();
          // Assuming cartData is an array of Order objects
          cartData.forEach(order => {
            updateLocalCart(order);  // Update local cart for each order
          });
        }
        console.log(user.email); // Debugging: check response structure

        navigate('/'); // Redirect to user profile page
      } else if (response.status === 401) {
        const errorData = await response.json();
        setError(errorData.message); // Display error message
      } else {
        setError('An unexpected error occurred. Please try again later.');
      }
    } catch (err) {
      console.error('Error during sign-in:', err);
      setError('Could not connect to the server. Please check your connection.');
    }
  };

  return (
    <div className="styled-wrapper">
      <form className="form" onSubmit={handleSubmit}>
        <p className="title">Sign In</p>
        <p className="message">Welcome back! Please log in to your account.</p>
        {error && <p className="error">{error}</p>}

        <label>
          <input
            required
            type="email"
            className="input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <span>Email</span>
        </label>
        <label>
          <input
            required
            type="password"
            className="input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <span>Password</span>
        </label>

        <button type="submit" className="submit">Sign In</button>
        <p className="signin">
          Don't have an account? <Link to="/signup">Sign up</Link>
        </p>
      </form>
    </div>
  );
};

export default SignIn;
