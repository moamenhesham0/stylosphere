import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../style/productsPageStyle/ProductsPageStyle.css';

const BestSellersPage = () => {
    const navigate = useNavigate();
    const [bestSellers, setBestSellers] = useState([]);
    const [discountedProducts, setDiscountedProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch the best-selling products from the backend
    const fetchBestSellers = async () => {
        try {
            const response = await fetch('http://localhost:8080/api/products/best-sellers');
            if (!response.ok) {
                throw new Error(`Failed to fetch best-sellers: ${response.statusText}`);
            }
            const data = await response.json();
            if (Array.isArray(data)) {
                setBestSellers(data);
            } else {
                throw new Error('Unexpected response format');
            }
        } catch (error) {
            console.error('Error fetching best-sellers:', error.message);
            setError(error.message);
        }
    };

    // Fetch the discounted products from the backend
    const fetchDiscountedProducts = async () => {
        try {
            const response = await fetch('http://localhost:8080/api/products/discounts');
            if (!response.ok) {
                throw new Error(`Failed to fetch discounted products: ${response.statusText}`);
            }
            const data = await response.json();
            if (Array.isArray(data)) {
                setDiscountedProducts(data);
            } else {
                throw new Error('Unexpected response format');
            }
        } catch (error) {
            console.error('Error fetching discounted products:', error.message);
            setError(error.message);
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setError(null);
            await Promise.all([fetchBestSellers(), fetchDiscountedProducts()]);
            setLoading(false);
        };

        fetchData();
    }, []);

    if (loading) {
        return <div className="loading">Loading products...</div>;
    }

    if (error) {
        return <div className="error">Error: {error}</div>;
    }

    return (
        <div className="products-page">
            <h2 className="section-title">Top 10 Best-Selling Products</h2>
            <div className="products-grid">
                {bestSellers.map(product => (
                    <div key={product.id} className="product-item">
                        <div className="product-image">
                            <img src={product.image} alt={product.name} />
                        </div>
                        <div className="product-info">
                            <div className="product-name">{product.name}</div>
                            <p>${product.price}</p>
                            <button
                                className="details-btn"
                                onClick={() => navigate(`/product/${product.id}`, { state: { product } })}
                            >
                                View details
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            <h2 className="section-title">Discounted Products</h2>
            <div className="products-grid">
                {discountedProducts.map(product => (
                    <div key={product.id} className="product-item">
                        <div className="product-image">
                            <img src={product.image} alt={product.name} />
                        </div>
                        <div className="product-info">
                            <div className="product-name">{product.name}</div>
                            <p>
                                <span className="original-price">${product.originalPrice}</span>{' '}
                                <span className="discounted-price">${product.discountedPrice}</span>
                            </p>
                            <button
                                className="details-btn"
                                onClick={() => navigate(`/product/${product.id}`, { state: { product } })}
                            >
                                View details
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default BestSellersPage;
