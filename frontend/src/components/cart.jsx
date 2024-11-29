import React from 'react';
import { Link } from 'react-router-dom';
import '../style/mainPageStyle/cartStyle.css';

const ShoppingCart = () => {
  // For simplicity, let's assume the cart is an array of products stored in localStorage
  const cartItems = JSON.parse(localStorage.getItem('cart')) || [];

  return (
    <div className="container">
      <div className="cart">
        <h2>Shopping Cart</h2>
        {cartItems.length > 0 ? (
          cartItems.map((item, index) => (
            <div className="cart-item" key={index}>
              <img src={item.image} alt={item.name} />
              <div className="cart-item-details">
                <h3>{item.name}</h3>
              </div>
              <div className="cart-item-quantity">
                <button className="quantity-btn">-</button>
                <span>1</span>
                <button className="quantity-btn">+</button>
              </div>
              <div className="cart-item-price">${item.price}</div>
              <div className="cart-item-remove">
                <button className="remove-btn">x</button>
              </div>
            </div>
          ))
        ) : (
          <p>Your cart is empty</p>
        )}
        <div className="cart-summary">
          <h3>Subtotal</h3>
          <h3>${cartItems.reduce((total, item) => total + item.price, 0)}</h3>
        </div>
        <button className="checkout-btn">CHECKOUT</button>
      </div>
    </div>
  );
};

export default ShoppingCart;

