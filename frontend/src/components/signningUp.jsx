import React from 'react';
import '../style/mainPageStyle/sinningUpStyle.css';

const signUp = () => {
    return (
      <div className="styled-wrapper">
        <form className="form">
          <p className="title">Register</p>
          <p className="message">Signup now and get full access to our website.</p>
          <div className="flex">
            <label>
              <input required placeholder type="text" className="input" />
              <span>Firstname</span>
            </label>
            <label>
              <input required placeholder type="text" className="input" />
              <span>Lastname</span>
            </label>
          </div>
          <label>
            <input required placeholder type="email" className="input" />
            <span>Email</span>
          </label>
          <label>
            <input required placeholder type="password" className="input" />
            <span>Password</span>
          </label>
          <label>
            <input required placeholder type="password" className="input" />
            <span>Confirm password</span>
          </label>
          <button className="submit">Submit</button>
          <p className="signin">
            Already have an account? <a href="#">Signin</a>
          </p>
        </form>
      </div>
    );
  };
  
  export default signUp;
