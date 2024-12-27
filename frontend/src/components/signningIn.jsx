import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import '../style/mainPageStyle/sinningInStyle.css';
import { useUser } from './user/UserContext';

const SignIn = () => {
  const {user} = useUser();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { updateUser } = useUser(); // Access `updateUser` from context

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
        console.log(data.user); // Debugging: check response structure

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
