import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../style/productsPageStyle/ProductsPageStyle.css';

const ProductsPage = () => {
    const [products, setProducts] = useState([]);
    const [sortType, setSortType] = useState('price');
    const [sortOrder, setSortOrder] = useState('asc');

    // Fetch products from the Spring Boot backend API
    useEffect(() => {
        fetch('http://localhost:8080/api/products') // Spring Boot API endpoint
            .then((response) => response.json())
            .then((data) => setProducts(data))
            .catch((error) => console.error('Error fetching products:', error));
    }, []);

    // Sorting logic
    const sortProducts = (type, order) => {
        return [...products].sort((a, b) => {
            if (type === 'price') {
                return order === 'asc' ? a.price - b.price : b.price - a.price;
            } else if (type === 'name') {
                return order === 'asc' ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name);
            }
            return 0;
        });
    };

    const sortedProducts = sortProducts(sortType, sortOrder);

    return (
        <div className="products-page">
            <h1 className="products-page-header">Products Page</h1>
            <div className="products-container">
                <div className="product-list-container">
                    <div className="products-grid">
                        {sortedProducts.map((product) => (
                            <div key={product.id} className="product-item">
                                <div className="product-image">
                                    <img src={`http://localhost:8080/assets/products/images/${product.image}`} alt={product.name} />
                                </div>
                                <div className="product-details">
                                    <span>{product.name}</span>
                                    <span>{`$${product.price}`}</span>
                                    <Link to={`/product/${product.id}`}>
                                        <button className="view-details-btn">
                                            View Details
                                        </button>
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductsPage;



