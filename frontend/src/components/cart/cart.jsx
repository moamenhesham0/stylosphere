import React, { useEffect, useState } from "react";
import "./cartStyle.css";
import { useLocalCart } from "./localCartContext";
import { useUser } from '../user/UserContext';
import { useNavigate } from 'react-router-dom';
import { getItemId,deleteItem, updateQuantity, applyPromoCode, completePayment } from './cartApi';

const ShoppingCart = () => {
  const { cart , clearLocalCart , updateItemQuantity , deleteCartItem} = useLocalCart();
  const {user} = useUser();
  const [products, setProducts] = useState({});
  const [paymentWindow, setPaymentWindow] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("creditCard");
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    zip: "",
    paypalEmail: "",
  });
  const [errors, setErrors] = useState({});

  const openPaymentWindow = () => {
    setPaymentWindow(true);
  };

  const closePaymentWindow = () => {
    setPaymentWindow(false);
    setSelectedPaymentMethod("creditCard"); // Reset to default
    setFormData({
      name: "",
      cardNumber: "",
      expiryDate: "",
      cvv: "",
      zip: "",
      paypalEmail: "",
    });
    setErrors({});
  };

/* HANDLE CART ACTIONS */
  const handleGetId = async(item) =>
  {
    console.log(user.userId);
    const id = await getItemId(item , user.userId);
    return id;
  }

  const handleDelete = async (item) => {
    console.log(user.userId);
    if(user.userId > 0){
      const id = await handleGetId(item);
      await deleteItem(id);
    }
    deleteCartItem(item.productId , item.productSize , item.productColor);
  };

  const handleUpdateQuantity = async (item, quantity) => {
    const product = products[item.productId];
    const MAX_QUANTITY = product ? product.quantity : 0; 

    const newQuantity = quantity > MAX_QUANTITY ? MAX_QUANTITY : quantity;
    item.quantity = newQuantity;
    
    console.log(cart);
    if(user.userId > 0){
      const id = await handleGetId(item);
      console.log(`id = ${id}`); 
      await updateQuantity(id, newQuantity);
    }

    updateItemQuantity(item.productId , item.productSize , item.productColor , newQuantity,products);
  };
  
  const handleApplyPromoCode = async (productId, promoCode) => {
    await applyPromoCode(productId, promoCode);
  };
  
  const handleCompletePayment = async () => {
    const cartItems = cart
    await completePayment(cartItems, user.userId);
    clearLocalCart();
  };

  /* HANDLE Payment Actions */
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };


  /* CREDIT CARD */
  const handleCreditCard = (e) => {
    e.preventDefault();

    const newErrors = {};
    const cardNumberRegex = /^\d{16}$/; // 16 digits
    const expiryDateRegex = /^(0[1-9]|1[0-2])\/\d{2}$/; // MM/YY
    const cvvRegex = /^\d{3}$/; // 3 digits
    const zipRegex = /^\d{5}$/; // 5 digits

    if (!formData.name.trim()) newErrors.name = "Name is required.";
    if (!cardNumberRegex.test(formData.cardNumber)) newErrors.cardNumber = "Invalid card number.";
    if (!expiryDateRegex.test(formData.expiryDate)) newErrors.expiryDate = "Invalid expiry date (MM/YY).";
    if (!cvvRegex.test(formData.cvv)) newErrors.cvv = "Invalid CVV.";
    if (!zipRegex.test(formData.zip)) newErrors.zip = "Invalid ZIP/Postal Code.";

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      handleCompletePayment();
      alert("Credit Card Payment Successful!");
      closePaymentWindow();
    }
  };


  /* PAYPAL */
  const handlePayPal = (e) => {
    e.preventDefault();

    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Basic email format

    if (!emailRegex.test(formData.paypalEmail)) {
      newErrors.paypalEmail = "Invalid PayPal email.";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      handleCompletePayment();
      alert("PayPal Payment Successful!");
      closePaymentWindow();
    }
  };

 
  

  const renderPaymentForm = () => {
    if (selectedPaymentMethod === "creditCard") {
      return (
        <form className="payment-form" onSubmit={handleCreditCard}>
          <h3>Credit Card Payment</h3>
          <div className="form-group">
            <label>Name:</label>
            <input
              type="text"
              name="name"
              placeholder="Name on Card"
              value={formData.name}
              onChange={handleInputChange}
            />
            {errors.name && <small className="error">{errors.name}</small>}
          </div>
          <div className="form-group">
            <label>Card Number:</label>
            <input
              type="text"
              name="cardNumber"
              placeholder="1234 5678 9012 3456"
              value={formData.cardNumber}
              onChange={handleInputChange}
            />
            {errors.cardNumber && <small className="error">{errors.cardNumber}</small>}
          </div>
          <div className="form-group">
            <label>Expiry Date:</label>
            <input
              type="text"
              name="expiryDate"
              placeholder="MM/YY"
              value={formData.expiryDate}
              onChange={handleInputChange}
            />
            {errors.expiryDate && <small className="error">{errors.expiryDate}</small>}
          </div>
          <div className="form-group">
            <label>CVV:</label>
            <input
              type="text"
              name="cvv"
              placeholder="123"
              value={formData.cvv}
              onChange={handleInputChange}
            />
            {errors.cvv && <small className="error">{errors.cvv}</small>}
          </div>
          <div className="form-group">
            <label>ZIP/Postal Code:</label>
            <input
              type="text"
              name="zip"
              placeholder="12345"
              value={formData.zip}
              onChange={handleInputChange}
            />
            {errors.zip && <small className="error">{errors.zip}</small>}
          </div>
          <button type="submit" className="pay-btn">
            Pay
          </button>
        </form>
      );
    } else if (selectedPaymentMethod === "paypal") {
      return (
        <form className="payment-form" onSubmit={handlePayPal}>
          <h3>PayPal Payment</h3>
          <div className="form-group">
            <label>PayPal Email:</label>
            <input
              type="email"
              name="paypalEmail"
              placeholder="example@paypal.com"
              value={formData.paypalEmail}
              onChange={handleInputChange}
            />
            {errors.paypalEmail && <small className="error">{errors.paypalEmail}</small>}
          </div>
          <button type="submit" className="pay-btn">
            Pay with PayPal
          </button>
        </form>
      );
    }
    return null;
  };

  useEffect(() => {
    const fetchProducts = async () => {
      const updatedProducts = {};
     
      await Promise.all(
        cart.map(async (item) => {
          try {
            const response = await fetch(
              `http://localhost:8080/api/products/get-product?id=${item.productId}`
            );
            
            if (!response.ok) {
              throw new Error(`Failed to fetch product with productId: ${item.productId}`);
            }

            const data = await response.json();
            updatedProducts[item.productId] = data;
          } catch (error) {
            console.error(`Error fetching product ${item.productId}:`, error);
          }
        })
      );

      setProducts(updatedProducts);
    };

    if (cart.length > 0) {
      fetchProducts();
    }
  }, [cart]);




  return (
    <div className="page-wrapper">
      <div className="cart-container">
        <div className="cart">
          <h2>Shopping Cart</h2>
          {cart.length > 0 ? (
            cart.map((item, index) => (
              <div className="cart-item" key={index}>
                <img
                  src={`data:image/jpeg;base64,${products[item.productId]?.image[0].image}`}
                  alt={products[item.productId]?.name}
                />
                <div className="cart-item-details">
                  <h3>{products[item.productId]?.name}</h3>
                </div>
                <div className="cart-item-quantity">
                  <span>{item.productColor}</span>
                  <button className="quantity-btn" onClick={()=> item.quantity-1 === 0? handleDelete(item): handleUpdateQuantity(item , item.quantity-1) }>-</button>
                  <span>{item.quantity}</span>
                  <button className="quantity-btn" onClick={()=>handleUpdateQuantity(item , item.quantity+1)}>+</button>
                </div>
                <div className="cart-item-price">
                  ${products[item.productId]?.price?.toFixed(2)}
                </div>
                <div className="cart-item-remove">
                  <button className="remove-btn" onClick={()=> handleDelete(item)}>x</button>
                </div>
              </div>
            ))
          ) : (
            <p>Your cart is empty</p>
          )}

          {cart.length > 0 && (
            <div className="cart-summary">
              <h3>Subtotal</h3>
              <h3>
                $
                {cart.reduce((total, item) => {
                  const productPrice = products[item.productId]?.price || 0;
                  return total + productPrice * item.quantity;
                }, 0).toFixed(2)}
              </h3>
            </div>
          )}
          {cart.length > 0 && <button
            className="checkout-btn"
            onClick={() => user.userId !== -1 ? (cart.length > 0 ? openPaymentWindow() : null) : navigate('/signup')}
            disabled={cart.length === 0} // Disable the button if the cart is empty
          >
            CHECKOUT
          </button>}
        </div>
      </div>

      {paymentWindow && (
        <div className="payment-window">
          <div className="payment-window-content">
            <button className="close-btn" onClick={closePaymentWindow}>
              &times;
            </button>
            <h2>Choose Payment Method</h2>
            <div className="payment-options">
              <label>
                <input
                  type="radio"
                  value="creditCard"
                  checked={selectedPaymentMethod === "creditCard"}
                  onChange={() => setSelectedPaymentMethod("creditCard")}
                />
                Credit Card
              </label>
              <label>
                <input
                  type="radio"
                  value="paypal"
                  checked={selectedPaymentMethod === "paypal"}
                  onChange={() => setSelectedPaymentMethod("paypal")}
                />
                PayPal
              </label>
            </div>
            {renderPaymentForm()}
          </div>
        </div>
      )}
    </div>
  );
};

export default ShoppingCart;
