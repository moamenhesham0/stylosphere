import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

import { useUser } from '../user/UserContext';
import { useLocalCart } from '../cart/localCartContext';

import './sinningInStyle.css';

import {ErrorMessage} from '../ErrorMessage/ErrorMessage';

import { saveLogInstance,
         signInProccess,
         fetchUserCart } from './signInAPI';  


const SignIn = () => {
  const navigate = useNavigate();

  /*Local Contexts*/
  const {user ,updateUser } = useUser();
  const {updateLocalCart , clearLocalCart} = useLocalCart();

  /*Form DATA*/
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  /*ErrorMessage */
  const [errorMessage , setErrorMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    
      const data = await signInProccess(email , password);

      if(data.status === 'FAILURE')
      {
        setErrorMessage("We couldn't sign you in. Please check your email and password and try again.");
        setTimeout(()=> setErrorMessage('') , 3e3);
        return;
      }

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
        await saveLogInstance(data.user.id);

        // clear non-registered user cart
        clearLocalCart();

        // fetch backend cart
        const cartData = await fetchUserCart(data.user.id);

        // Update local cart for each order
        if(cartData != 'empty cart'){
          cartData.forEach(order => {
            updateLocalCart(order);  
          });
        }
        

        navigate('/'); // Redirect to user profile page
    
  };



  


  return (
    <div className="styled-wrapper">
      <form className="form" onSubmit={handleSubmit}>
        <p className="title">Sign In</p>
        <p className="message">Welcome back! Please log in to your account.</p>
        <ErrorMessage message = {errorMessage}/>

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
