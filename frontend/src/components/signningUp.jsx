import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // Import useNavigate
import '../style/mainPageStyle/sinningUpStyle.css';
import { useUser } from './user/UserContext'; // Make sure this provides the correct context

const SignUp = () => {
  const { user, updateUser } = useUser(); // Ensure updateUser is destructured
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
  
      console.log('Response status:', response.status);
  
      const responseData = await response.json();
  
      if (response.ok) {
        // Successfully signed up, now update the user context and redirect
        updateUser({
          email: formData.email,
          name: `${formData.firstname} ${formData.lastname}`, // Include the full name
          userStatus: true, // Mark the user as logged in
        });
        console.log('Success response from backend:', responseData);
        setSuccess(responseData.message);
        navigate('/'); // Redirect to the home page or dashboard
      } else {
        console.error('Error response from backend:', responseData);
        setError(responseData.message);
      }
    } catch (err) {
      console.error('Fetch request failed:', err);
      setError('An error occurred. Please try again later.');
    }
    const userIdValue = await getUserId();
    console.log(userIdValue);
    updateUser({
      email: formData.email,
      name: `${formData.firstname} ${formData.lastname}`,
      userStatus: true,
      userId : userIdValue, // Use the resolved value
    });
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