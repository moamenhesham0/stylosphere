import React from 'react';
import { useLocation } from 'react-router-dom'; // Import useLocation to retrieve state
import '../style/productPageStyle/ProductPageStyle.css';

const ProductPage = () => {
    const location = useLocation(); // Use location hook to access state
    const { product } = location.state || {}; // Destructure product from location.state

    if (!product) {
        return <div className="loading-message">Loading...</div>; // Show loading message if no product data is passed
    }

    return (
        <div className="product-page">
            <div className="product-container">
                <div className="product-image-section">
                    <img
                        src={product.image}
                        alt={product.name}
                        className="product-image"
                    />
                </div>
                <div className="product-info-section">
                    <h1 className="product-name">{product.name}</h1>
                    <span className="product-price">${product.price}</span>
                    <p className="product-description">{product.description}</p>
                    <div className="quantity-container">
                        <label htmlFor="quantity" className="quantity-label">Quantity:</label>
                        <input type="number" id="quantity" name="quantity" defaultValue="1" min="1" className="quantity-input" />
                    </div>
                    <button className="add-to-cart-btn">Add to Cart</button>
                </div>
            </div>
        </div>
    );
};

export default ProductPage;


