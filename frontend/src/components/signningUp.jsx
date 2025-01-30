import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // Import useNavigate
import '../style/mainPageStyle/sinningUpStyle.css';
import { useUser } from './user/UserContext'; // Make sure this provides the correct context
import { useLocalCart } from './cart/localCartContext';
const SignUp = () => {
  const { user, updateUser } = useUser(); // Ensure updateUser is destructured
  const {cart} = useLocalCart();
  const navigate = useNavigate(); // Initialize the navigate hook
  const [formData, setFormData] = useState({
    firstname: '',
    lastname: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
  const getUserId = async () =>{
    try {
      const response = await fetch(`http://localhost:8080/api/customers/get-user-email?email=${formData.email}` , {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (response.ok) {
        const data = await response.json();
        console.log(data);
        return data.id;
      } else {
        console.error('Error response from backend:', data);
        return null;
      }
    } catch (err) {
      console.error('Fetch request failed:', err);
      return null;
    }
  }
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
  
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match!');
      return;
    }
    if (formData.firstname === "") {
      setError('No First name was entered');
      return;
    }
    if (formData.lastname === "") {
      setError('No Last name was entered');
      return;
    }
    if (formData.email === "") {
      setError('No email was entered');
      return;
    }
    console.log('Attempting to sign up with data:', {
      name: `${formData.firstname} ${formData.lastname}`,
      email: formData.email,
      password: formData.password,
    });
  
    try {
      const response = await fetch('http://localhost:8080/api/customers/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: `${formData.firstname} ${formData.lastname}`,
          email: formData.email,
          password: formData.password,
        }),


      });
      
      const status = await response.json();
      console.log(`status  : ${status}`);
  
      if (response.ok) {
        // Successfully signed up, now update the user context and redirect
        
        if(status === true){
        updateUser({
          email: formData.email,
          name: `${formData.firstname} ${formData.lastname}`, // Include the full name
          userStatus: true, // Mark the user as logged in
        });
    const userIdValue = await getUserId();
    console.log(`el id aho ${userIdValue}`);
    updateUser({
      email: formData.email,
      name: `${formData.firstname} ${formData.lastname}`,
      userStatus: true,
      userId : userIdValue, // Use the resolved value
    });
    for(const item of cart){
      const response = await fetch(
        `http://localhost:8080/api/cart/add-to-cart?productId=${item.productId}&color=${item.productColor}&size=${item.productSize}&quantity=${item.quantity}&userId=${userIdValue}`,
        {
          method: 'POST',
        }
      );
    }
    setSuccess('True');
        navigate('/'); // Redirect to the home page or dashboard
      }
        
      } else {
        console.error('Error response from backend: Failed to sign up' );
        setError('False');
      }
    } catch (err) {
      console.error('Fetch request failed:', err);
      setError('An error occurred. Please try again later.');
    }
    
  };

  return (
    <div className="styled-wrapper">
      <form className="form" onSubmit={handleSubmit}>
        <p className="title">Register</p>
        <p className="message">Signup now and get full access to our website.</p>
        {error && <p className="error-message">{error}</p>}
        {success && <p className="success-message">{success}</p>}
        <div className="flex">
          <label>
            <input
              required
              type="text"
              name="firstname"
              value={formData.firstname}
              onChange={handleInputChange}
              className="input"
            />
            <span>Firstname</span>
          </label>
          <label>
            <input
              required
              type="text"
              name="lastname"
              value={formData.lastname}
              onChange={handleInputChange}
              className="input"
            />
            <span>Lastname</span>
          </label>
        </div>
        <label>
          <input
            required
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            className="input"
          />
          <span>Email</span>
        </label>
        <label>
          <input
            required
            type="password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            className="input"
          />
          <span>Password</span>
        </label>
        <label>
          <input
            required
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleInputChange}
            className="input"
          />
          <span>Confirm password</span>
        </label>
        <button className="submit" type="submit">
          Submit
        </button>
        <p className="signin">
          Already have an account? <Link to="/signin">Sign in</Link>
        </p>
      </form>
    </div>
  );
};

export default SignUp;