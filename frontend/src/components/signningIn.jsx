import React from 'react';
import '../style/mainPageStyle/sinningInStyle.css';

const SignIn = () => {
  return (
    <div className="styled-wrapper">
      <form className="form">
        <p className="title">Sign In</p>
        <p className="message">Welcome back! Please log in to your account.</p>
        
        <label>
          <input required placeholder type="email" className="input" />
          <span>Email</span>
        </label>
        <label>
          <input required placeholder type="password" className="input" />
          <span>Password</span>
        </label>
        
        <button className="submit">Sign In</button>
        <p className="signin">
          Don't have an account? <a href="#">Sign up</a>
        </p>
      </form>
    </div>
  );
};

export default SignIn;
