import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Header from './Header';
import '../style/productsPageStyle/ProductsPageStyle.css';

const ProductsPage = () => {
    const [sortType, setSortType] = useState('name');
    const [sortOrder, setSortOrder] = useState('asc');
    const [searchInput, setSearchInput] = useState('');
    const [image, setImage] = useState(null); // Track the image for AI
    const [clothingType, setClothingType] = useState(''); // Store the clothing type response

    const products = [
        { id: 1, name: 'Short', price: 100, type: 'Shirt', description: 'Comfortable cotton shorts', image: '/assets/products images/short.jpg' },
        { id: 2, name: 'Jacket', price: 50, type: 'Jeans', description: 'Stylish jacket for all seasons', image: '/assets/products images/jacket.webp' },
        { id: 3, name: 'Jeans', price: 150, type: 'Jacket', description: 'Premium denim jeans', image: '/assets/products images/jeans.jpg' },
        { id: 4, name: 'Sweater', price: 200, type: 'T-shirt', description: 'Cozy winter sweater', image: '/assets/products images/sweater.webp' },
        { id: 5, name: 'T-shirt', price: 80, type: 'Dress', description: 'Stylish t-shirt with graphic print', image: '/assets/products images/t-shirt.webp' },
    ];

    const handleInputChange = (e) => {
        setSearchInput(e.target.value);
    };

    const handleSearch = () => {
        console.log('Search Input:', searchInput);
    };

    // Function to handle image upload and send it to Flask API
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImage(file);
            sendImageToAI(file);
        }
    };

    // Function to send image to Flask API and get the clothing type
    const sendImageToAI = (file) => {
        const formData = new FormData();
        formData.append('image', file);

        fetch('http://localhost:5000/api/ai', {
            method: 'POST',
            body: formData,
        })
            .then(response => response.json())
            .then(data => {
                setClothingType(data.type); // Assuming the AI sends the type as 'type'
            })
            .catch(error => {
                console.error('Error sending image to AI:', error);
            });
    };

    // Sorting logic remains unchanged
    const sortProductsByPrice = (order) => {
        return [...products].sort((a, b) => (order === 'asc' ? a.price - b.price : b.price - a.price));
    };

    const sortProductsByName = (order) => {
        return [...products].sort((a, b) => (order === 'asc' ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name)));
    };

    const sortedProducts = sortType === 'price'
        ? sortProductsByPrice(sortOrder)
        : sortProductsByName(sortOrder);

    return (
        <div className="products-page">
            <div className="search-bar-container">
                <input
                    type="text"
                    placeholder="Search..."
                    value={searchInput}
                    onChange={handleInputChange}
                    className="search-input"
                />
                <button className="search-button" onClick={handleSearch}>
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        fill="currentColor"
                        viewBox="0 0 16 16"
                        className="search-icon"
                    >
                        <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zm-5.442.656a5.5 5.5 0 1 1 0-11 5.5 5.5 0 0 1 0 11z" />
                    </svg>
                </button>

                {/* Image upload */}
                <div className="image-upload">
                <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    id="file-input"
                />
                <label htmlFor="file-input">AI detection</label>
                {image && <p>Image uploaded successfully!</p>}
            </div>
            </div>

            {/* Display the clothing type received from AI */}
            {clothingType && <div className="clothing-type">Clothing Type: {clothingType}</div>}

            <div className="products-container">
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

                <div className="product-list-container">
                    <div className="sorting-toolbar">
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

                    <div className="products-grid">
                        {sortedProducts.map(product => (
                            <div key={product.id} className="product-item">
                                <div className="product-image">
                                    <img src={product.image} alt={product.name} />
                                </div>
                                <div className="product-details">
                                    <span>{product.name}</span>
                                    <span>${product.price}</span>
                                    <Link
                                        to={`/product/${product.id}`}
                                        state={{ product }}
                                        className="view-details-btn"
                                    >
                                        <img src="/assets/button icons/details.svg" alt="View Details" className="icon" />
                                        View Details
                                    </Link>
                                    <div style={{ padding: "3px" }}></div>
                                    <button
                                        onClick={() => {
                                            if (!image) {
                                                alert('Please upload an image first!');
                                                return;
                                            }
                                            console.log(`Added ${product.name} to cart`);
                                        }}
                                        className="add-to-cart-btn"
                                        disabled={!image} // Disable button if no image is uploaded
                                    >
                                        Add to Cart
                                    </button>
                                    {!image && <p>Please upload an image first to proceed.</p>}
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


