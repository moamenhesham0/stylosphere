import React from 'react';
import { useLocation } from 'react-router-dom';
import '../style/productPageStyle/ProductPageStyle.css';

const ProductPage = () => {
  const location = useLocation();
  const { product } = location.state || {};

  if (!product) {
    return <div className="loading-message">Loading...</div>;
  }

  return (
    <div className="product-page">
      <div className="product-container">
        <div className="product-image-wrapper">
          <img src={product.image} alt={product.name} className="product-image-inner" />
        </div>
        <div className="product-info-wrapper">
          <h1 className="product-name-inner">{product.name}</h1>
          <p className="product-price-inner">${product.price}</p>
          <p className="product-description">{product.description}</p>
          <button className="add-to-cart-button">Add to Cart</button>
        </div>
      </div>
    </div>
  );
};

export default ProductPage;


