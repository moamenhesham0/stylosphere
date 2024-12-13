import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../style/mainPageStyle/sinningUpStyle.css';

const SignUp = () => {
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
        console.log('Success response from backend:', responseData);
        setSuccess(responseData.message);
      } else {
        console.error('Error response from backend:', responseData);
        setError(responseData.message);
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
