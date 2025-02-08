import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // Import useNavigate
import './sinningUpStyle.css';
import { useUser } from '../user/UserContext'; // Make sure this provides the correct context
import { useLocalCart } from '../cart/localCartContext';
import { ErrorMessage } from '../ErrorMessage/ErrorMessage';
import { signUpProcess, 
         addToRegisteredUserCart} from './signUpAPI';

const SignUp = () => {
  const { updateUser } = useUser(); // Ensure updateUser is destructured
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
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  
  /*PASSWORD*/
  const strongPasswordValidation = () => {
    const passwordFormat = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/;
    if(!passwordFormat.test(formData.password)){
      return false;
    }
    return true;
  };

  /*EMAIL*/
  const emailFormatValidation = () => {
    const emailFormat = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if(!emailFormat.test(formData.email)){
      return false;
    }
    return true;
  };


  /*ADD LOCAL CART TO THE BACKEND*/
  const handleAddToBackendCart = async()=>
  {
    if(cart.length >0)
    {
      await addToRegisteredUserCart(cart);
    }
  };

 /*Triggers Error message*/
 const setErrorMessage = (message)=>
  {
    setError(message);
    setTimeout(()=> setError('') , 3e3);
  }; 

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    
    
    if (formData.firstname === "" || formData.firstname.trim() === "" || formData.firstname.startsWith(" ")) {
      setErrorMessage('Invalid : Empty firstname input or starts with space');
      return;
    }

    if (formData.lastname === "" || formData.lastname.trim() === "" || formData.lastname.startsWith(" ")) {
      setErrorMessage('Invalid : Empty lastname input or starts with space');
      return;
    }

    if (formData.email === "" || formData.email.trim() === "") {
      setErrorMessage('Invalid : Empty email input');
      return;
    }

    if(!emailFormatValidation())
    {
      setErrorMessage('Invalid email format');
      return;
    }

    if(formData.password != formData.confirmPassword)
    {
      setErrorMessage('Passwords don\'t match');
      return;
    }
    
    if(!strongPasswordValidation())
    {
      setErrorMessage('Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter and one number');
      return;
    }
    
      
      
      const userId = await signUpProcess(formData)
  
      if (userId === -1) {
        setErrorMessage('Entered email is already registered.');
        return;
      }


      updateUser({
        name: `${formData.firstname} ${formData.lastname}`,
        email: formData.email,
        userStatus: true,
        userId: userId
      });

      await handleAddToBackendCart();
      
      navigate('/');
  };


  



  return (
    <div className="styled-wrapper">
      <form className="form" onSubmit={handleSubmit}>
        <p className="title">Register</p>
        <p className="message">Signup now and get full access to our website.</p>
        <ErrorMessage message={error}/>
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