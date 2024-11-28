import React, { useState } from 'react';
import { Link } from 'react-router-dom'; // Import Link from react-router-dom for navigation
import '../style/productsPageStyle/ProductsPageStyle.css';

const ProductsPage = () => {
    const [sortType, setSortType] = useState('name'); // 'price' or 'name'
    const [sortOrder, setSortOrder] = useState('asc'); // 'asc' or 'desc'

    const products = [
        { id: 1, name: 'Short', price: 100, type: 'Shirt', description: 'Comfortable cotton shorts', image: '/assets/products images/short.jpg' },
        { id: 2, name: 'Jacket', price: 50, type: 'Jeans', description: 'Stylish jacket for all seasons', image: '/assets/products images/jacket.webp' },
        { id: 3, name: 'Jeans', price: 150, type: 'Jacket', description: 'Premium denim jeans', image: '/assets/products images/jeans.jpg' },
        { id: 4, name: 'Sweater', price: 200, type: 'T-shirt', description: 'Cozy winter sweater', image: '/assets/products images/sweater.webp' },
        { id: 5, name: 'T-shirt', price: 80, type: 'Dress', description: 'Stylish t-shirt with graphic print', image: '/assets/products images/t-shirt.webp' },
        { id: 6, name: 'Product F', price: 120, type: 'Sweater', description: 'Warm and comfy sweater', image: '/assets/products images/product-f.jpg' },
    ];

    // Sort products by price
    const sortProductsByPrice = (order) => {
        return [...products].sort((a, b) => (order === 'asc' ? a.price - b.price : b.price - a.price));
    };

    // Sort products by name
    const sortProductsByName = (order) => {
        return [...products].sort((a, b) => (order === 'asc' ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name)));
    };

    const sortedProducts = sortType === 'price'
        ? sortProductsByPrice(sortOrder)
        : sortProductsByName(sortOrder);

    return (
        <div className="products-page">
            {/* Banner Section with Image Background */}
            <div className="banner">
                <div className="banner-text">
                    <h1>Special Offers on Our Best Products</h1>
                    <p>Check out the latest deals and discounts on our products.</p>
                </div>
            </div>
            <div className="products-container">
                {/* Left Sidebar for Filters */}
                <div className="filters">
                    <div className="filter-category">
                        <h3>Price Range</h3>
                        <input type="range" min="0" max="200" step="10" />
                    </div>
                    <div className="filter-category">
                        <h3>Type</h3>
                        <select>
                            <option value="Shirt">Shirt</option>
                            <option value="Jeans">Jeans</option>
                            <option value="Jacket">Jacket</option>
                            <option value="T-shirt">T-shirt</option>
                            <option value="Dress">Dress</option>
                            <option value="Sweater">Sweater</option>
                        </select>
                    </div>
                </div>

                {/* Product List with Sorting Options */}
                <div className="product-list-container">
                    <div className="sorting-toolbar">
                        {/* Single Sort Dropdown */}
                        <div className="sort-dropdown">
                            <label>Sort by</label>
                            <select
                                value={sortType + '-' + sortOrder}
                                onChange={(e) => {
                                    const [type, order] = e.target.value.split('-');
                                    setSortType(type);
                                    setSortOrder(order);
                                }}
                            >
                                <option value="price-asc">Price <span className="arrow-up">↑</span></option>
                                <option value="price-desc">Price <span className="arrow-down">↓</span></option>
                                <option value="name-asc">Alphabetically <span className="arrow-up">↑</span></option>
                                <option value="name-desc">Alphabetically <span className="arrow-down">↓</span></option>
                            </select>
                        </div>
                    </div>

                    {/* Display Sorted Products in Grid */}
                    <div className="products-grid">
                        {sortedProducts.map(product => (
                            <div key={product.id} className="product-item">
                                <div className="product-image">
                                    <img src={product.image} alt={product.name} />
                                </div>
                                <div className="product-details">
                                    <span>{product.name}</span>
                                    <span>{`$${product.price}`}</span>
                                    <Link 
                                        to={`/product/${product.id}`} 
                                        state={{ product }} // Pass product data to ProductPage through state
                                        className="view-details-btn"
                                    >
                                        <img src="/assets/button icons/details.svg" alt="View Details" className="icon" />
                                        View Details
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
