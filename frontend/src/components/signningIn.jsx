import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import '../style/mainPageStyle/sinningInStyle.css';

const SignIn = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

 
  const validEmail = "test@gmail.com";
  const validPassword = "123456";

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email === validEmail && password === validPassword) {
     
      navigate('/admin');
    } else {
      
      setError('Invalid email or password');
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
