import React from 'react';
import '../style/mainPageStyle/cartStyle.css';

const ShoppingCart = () => {
    return (
        <div className="container">
            <div className="header">
                <a href="#" className="logo">StyloSphere</a>
                <div className="nav">
                    <a href="#">New Page</a>
                    <a href="#">Shop</a>
                    <a href="#">About</a>
                    <a href="#">Cart (1)</a>
                </div>
            </div>
            <div className="cart">
                <h2>Shopping Cart</h2>
                <div className="cart-item">
                    <img
                        src="https://storage.googleapis.com/a1aa/image/whhcHIbphZK6PVEfJjlW9Ce73qkzgd6dxVU5Em3bskXrqd1TA.jpg"
                        alt="Product image of a beige box"
                    />
                    <div className="cart-item-details">
                        <h3>Product Name</h3>
                    </div>
                    <div className="cart-item-quantity">
                        <button className="quantity-btn">-</button>
                        <span>1</span>
                        <button className="quantity-btn">+</button>
                    </div>
                    <div className="cart-item-price">$25.00</div>
                    <div className="cart-item-remove">
                        <button className="remove-btn">x</button>
                    </div>
                </div>
                <div className="cart-summary">
                    <h3>Subtotal</h3>
                    <h3>$25.00</h3>
                </div>
                <button className="checkout-btn">CHECKOUT</button>
            </div>
        </div>
    );
};

export default ShoppingCart;
