import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import '../style/productPageStyle/ProductPageStyle.css';

const ProductPage = () => {
  const location = useLocation();
  const { product } = location.state || {}; 

  const [quantity, setQuantity] = useState(1);

  if (!product) {
    return <div className="loading-message">Loading...</div>;
  }

  const handleAddToCart = () => {
    // Logic to add to cart (you can use context or localStorage here)
    console.log(`Added ${quantity} ${product.name} to the cart`);
  };

  return (
    <div className="product-page">
      <div className="product-container">
        <div className="product-image-section">
          <img src={product.image} alt={product.name} className="product-image" />
        </div>
        <div className="product-info-section">
          <h1 className="product-name">{product.name}</h1>
          <span className="product-price">${product.price}</span>
          <p className="product-description">{product.description}</p>
          <div className="quantity-container">
            <label htmlFor="quantity" className="quantity-label">Quantity:</label>
            <input
              type="number"
              id="quantity"
              name="quantity"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              min="1"
              className="quantity-input"
            />
          </div>
          <button className="add-to-cart-btn" onClick={handleAddToCart}>
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductPage;
