import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Header from './Header';
import '../style/productsPageStyle/ProductsPageStyle.css';

const ProductsPage = () => {
    const [sortType, setSortType] = useState('name');
    const [sortOrder, setSortOrder] = useState('asc');
    const [searchInput, setSearchInput] = useState('');
    const [image, setImage] = useState(null); // Track the image for AI
    const [clothingType, setClothingType] = useState(''); // Store the clothing type response
    const [price, setPrice] = useState(100); // Track the price range
    const [selectedTags, setSelectedTags] = useState([]);
    const [products, setProducts] = useState([]);

    const tags = ["T-shirt/top", "Trouser", "Pullover", "Dress", "Coat",
        "Sandal", "Shirt", "Sneaker", "Bag", "Ankle boot"];

    // Fetch products from the base list
    const getBaseList = async () => {
        try {
            // Make a request to the backend
            const response = await fetch('http://localhost:8080/api/products/all');
            
            // Check if the response is not OK
            if (!response.ok) {
                throw new Error(`Failed to fetch products: ${response.statusText}`);
            }
    
            // Parse the response JSON
            const data = await response.json();
    
            // Validate and return the data as a list
            if (Array.isArray(data)) {
                return data; // Assuming the response is a plain array of products
            } else {
                console.error('Unexpected response format:', data);
                return [];
            }
        } catch (error) {
            console.error('Error fetching products:', error);
            return [];
        }
    };
    
    
    // Fetch products on component mount
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const baseList = await getBaseList();
                setProducts(baseList); // Update the state with the fetched products
            } catch (error) {
                console.error('Error in fetchProducts:', error.message);
            }
        };
    
        fetchProducts();
    }, []);
     // Empty dependency array to run only once when the component mounts

    // Filter products based on selected tags
    const retrieveProducts = async () => {
        

        try {
            const response = await fetch('http://localhost:8080/api/products/filter-tags', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({selectedTags}),
              });

            if (response.ok) {
                const data = await response.json();
                if (Array.isArray(data)) 
                    return data; // Update state with filtered products
            } else {
                console.error('Failed to fetch products');
            }
        } catch (error) {
            console.error('Error retrieving products:', error);
        }
    };

    const HandleFilter = ()=>{
        const response = async () => {
            try {
                // Call the retrieveProducts function asynchronously
                const products = await retrieveProducts(); // Ensure retrieveProducts is awaited
        
                if (products) {
                    // If products are retrieved, do something with them
                    setProducts(products);
                    // You can update your state with the filtered products here
                }
            } catch (error) {
                console.error("Error in handleFilter:", error);
            }
        };
        response();
        
    };

    // Handle search input change
    const handleInputChange = (e) => {
        setSearchInput(e.target.value);
    };

    // Handle search action (currently just logs the search input)
    const handleSearch = () => {
        console.log('Search Input:', searchInput);
    };

   

    // Handle tag click to filter products based on selected tags
    const handleTagClick = (tag) => {
        setSelectedTags((prevTags) =>
            prevTags.includes(tag)
                ? prevTags.filter((t) => t !== tag)
                : [...prevTags, tag]
        );
    };

    // Send image to Flask API to detect clothing type
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (!file.type.startsWith("image/")) {
                alert("Please upload a valid image file.");
                return;
            }
            setImage(file);
            sendImageToAI(file);
        } else {
            alert("No file selected.");
        }
    };
    
    const sendImageToAI = async (file) => {
        try {
            const formData = new FormData();
            formData.append('image', file);
    
            const response = await fetch('http://127.0.0.1:5000/predict', {
                method: 'POST',
                body: formData,
            });
    
            if (!response.ok) {
                const errorData = await response.json();
                console.error('Error from backend:', errorData.error);
                alert(`Error: ${errorData.error}`);
                return;
            }
    
            const data = await response.json();
            if (data.type) {
                setSelectedTags([data.type]); // Assuming the AI sends the type as 'type'
                console.log('AI predicted type:', data.type);
                retrieveProducts(); // Fetch products related to the tag
            } else {
                alert("Failed to retrieve prediction type.");
            }
        } catch (error) {
            console.error('Error sending image to AI:', error);
            alert("An error occurred while processing the image.");
        }
    };
    
    

    // Sorting logic for price and name
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
                    {/* Price Range Slider */}
                    <div className="filter-category">
                        <h3>Price Range</h3>
                        <input
                            type="range"
                            min="0"
                            max="200"
                            step="10"
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                            className="price-range"
                        />
                        <div className="price-display">Price: ${price}</div>
                    </div>

                    {/* Tags Grid */}
                    <div className="filter-category">
                        <h3>Tags</h3>
                        <div className="tag-grid">
                            {tags.map(tag => (
                                <label key={tag} className="tag-label">
                                    <input
                                        type="checkbox"
                                        value={tag}
                                        checked={selectedTags.includes(tag)}
                                        onChange={() => handleTagClick(tag)}
                                        className="tag-checkbox"
                                    />
                                    <span
                                        className={`tag ${selectedTags.includes(tag) ? 'selected' : ''}`}
                                    >
                                        {tag}
                                    </span>
                                </label>
                            ))}
                        </div>
                    </div>
                    <button onClick={HandleFilter}>Filter</button>
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
                        {products.map(product => (
                            <div key={product.id} className="product-item">
                                <div className="product-image">
                                    <img src={product.image} alt={product.name} />
                                </div>
                                <div className="product-info">
                                    <h4>{product.name}</h4>
                                    <p>{product.description}</p>
                                    <p>${product.price}</p>
                                    <Link to={`/product/${product.id}`}>View details</Link>
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



