import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Header from './Header';
import { useNavigate } from 'react-router-dom';
import '../style/productsPageStyle/ProductsPageStyle.css';

const ProductsPage = () => {
    const navigate = useNavigate();
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
        

        
    const [selectedColors, setSelectedColors] = useState([]); // Track selected colors
    const [sliderValue, setSliderValue] = useState(0); // Track slider value
    const [sliderThumbColor, setSliderThumbColor] = useState('white'); // Default to white
    const [colorPopup, setColorPopup] = useState(null); // Store the color for the popup

    // Predefined color options (This will be mapped to the color spectrum)
    const colorOptions = ['red', 'blue', 'green', 'yellow', 'pink', 'orange'];

    // Create a gradient spectrum background
    const gradient = colorOptions.join(', ');
    
    useEffect(() => {
        setProducts(sortedProducts);
    }, [sortType , sortOrder]);
    // Function to determine closest color based on slider value
    const getClosestColor = (value) => {
        const index = Math.round(value / (200 / (colorOptions.length - 1))); // Get index based on slider value
        return colorOptions[index];
    };

    // Handle the slider change and update the selected color
    const handleSliderChange = (e) => {
        const value = e.target.value;
        setSliderValue(value);
    
        const closestColor = getClosestColor(value); // Get closest color from the list
        setColorPopup(closestColor); // Show the color popup
    
        // Dynamically set the slider thumb color based on position
        const sliderThumbColor = closestColor; // Update the thumb color based on the closest color
        setSliderThumbColor(sliderThumbColor); // Save the color for the thumb
    
        setTimeout(() => setColorPopup(null), 1000); // Hide the popup after 1 second
    
        if (!selectedColors.includes(closestColor)) {
            setSelectedColors([...selectedColors, closestColor]); // Add to selected colors
        }
    };

    // Remove color from the selectedColors array
    const removeColor = (colorToRemove) => {
        setSelectedColors(selectedColors.filter(color => color !== colorToRemove));
    };
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
                console.log(data);
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
    useEffect(() => {
        const fetchProducts = async () => {
            const products = await getBaseList();
            setProducts(products.map(product => ({
                ...product,
                image: product.images && product.images.length > 0 ? product.images : null // Take the first image if available
            })));
        };
    
        fetchProducts();
    }, []);

    // Function to convert image string to base64 if necessary
    const convertImageStringToBase64 = (imageString) => {
        if (imageString.startsWith('data:image')) {
            return imageString; // Already in base64 format
        } else {
            return `data:image/jpeg;base64,${imageString}`;
        }
    };
     // Empty dependency array to run only once when the component mounts

    // Filter products based on selected tags
    const retrieveProducts = async () => {
        

        try {
            const response = await fetch('http://localhost:8080/api/products/filter', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({selectedTags , selectedColors}),
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


    // Handle search input change
    const handleInputChange = async (e) => {
        const inputValue = e.target.value;
        setSearchInput(inputValue);
      
        if (inputValue === '') {
          try {
            const baseList = await getBaseList(); // Wait for the async function to resolve
            setProducts(baseList); // Update products with the fetched base list
          } catch (error) {
            console.error('Error fetching base list:', error);
          }
        }
      };

    // Handle search action (currently just logs the search input)
    const handleSearch = async() => {
        try {
            const response = await fetch(`http://localhost:8080/api/products/search?query=${searchInput}`, {
                method: 'GET'
              });
              const result = await response.json();
                if (Array.isArray(result)) {
                    console.log('Fetched newproducts:', result);
                    setProducts(result.map(product => ({
                      
                        ...product,
                        images: Array.isArray(product.images) ? product.images : [] // Ensure images is an array
                    })));
                    console.log('Fetched newproducts:', products[0].images+"mkklksk");
                    console.log('Fetched newproducts:', result);
                } else {
                    console.error('Fetched data is not an array:', result);
                }
            } catch (error) {
                console.error('Error fetching newproducts:', error);
            }
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
   // Function to convert an image file to Base64
const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result.split(",")[1]); // Get Base64 part only
        reader.onerror = (error) => reject(error);
    });
};

const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
        if (!file.type.startsWith("image/")) {
            alert("Please upload a valid image file.");
            return;
        }
        try {
            const base64Image = await convertToBase64(file);
            const products = await getBaseList(); // Fetch products using your Java Spring Boot service
            sendImageToAI(base64Image, products);
        } catch (error) {
            console.error("Error converting image to Base64:", error);
            alert("Failed to process the selected image.");
        }
    } else {
        alert("No file selected.");
    }
};

const sendImageToAI = async (base64Image, products) => {
    try {
        const payload = {
            query_image: base64Image,
            products: products,
        };
        console.log(payload);
        const response = await fetch('http://127.0.0.1:5000/compare', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error('Error from backend:', errorData.error);
            alert(`Error: ${errorData.error}`);
            return;
        }

        const data = await response.json();
        if (data.similar_products) {
            setProducts(data.similar_products);
        } else {
            alert("Failed to retrieve similar products.");
        }
    } catch (error) {
        console.error('Error sending image to AI:', error);
        alert("An error occurred while processing the image.");
    }
    setImage(''); // Reset the image state
};

// Function to display similar products (update according to your UI logic)

    
    

    // Sorting logic for price and name
    const sortProductsByPrice = (order) => {
        return [...products].sort((a, b) => (order === 'asc' ? a.price - b.price : b.price - a.price));
    };

    const sortProductsByName = (order) => {
        return [...products].sort((a, b) => (order === 'asc' ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name)));
    };
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const products = await retrieveProducts(); // Call API
                setProducts(products); // Update state with the fetched products
            } catch (error) {
                console.error("Error fetching products:", error);
            }
        };
        
        fetchProducts();
    }, [selectedTags,selectedColors]);

    const sortedProducts = sortType === 'price'
        ? sortProductsByPrice(sortOrder)
        : sortProductsByName(sortOrder);



       const [product, setProduct] = useState({
            name: '',
            description: '',
            tags: '',
            price: '',
            quantity: '',
            colors: ''
        });
        const [imageFiles, setImageFiles] = useState([]);
        const [newproducts, setnewproducts] = useState([]);
    
     useEffect(() => {
        const getnewproducts = async () => {
            
            try {
                const response = await fetch('http://localhost:8080/api/admin/products');
                const result = await response.json();
                if (Array.isArray(result)) {
                    console.log('Fetched newproducts:', result);
                    setProducts(result.map(product => ({
                        ...product,
                        images: Array.isArray(product.images) ? product.images : [] // Ensure images is an array
                    })));
                    console.log('Fetched newproducts:', result);
                } else {
                    console.error('Fetched data is not an array:', result);
                }
            } catch (error) {
                console.error('Error fetching newproducts:', error);
            }
        };

        getnewproducts();
    }, []);

    const generateDataUrl = (image) => {

        return `data:image/jpeg;base64,${image[0]}`;
    };

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
            <div className='banner' src = './assets/banner.png'>
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
                    <div className="color-slider">
                        <h3>Choose Colors</h3>

                        {/* Spectrum Slider */}
                        <input
                            type="range"
                            min="0"
                            max="200"
                            step="10"
                            value={sliderValue}
                            onChange={handleSliderChange}
                            className="slider"
                            style={{
                                background: `linear-gradient(to right, ${colorOptions.join(', ')})`, // Spectrum
                            }}
                        />


                        {/* Pop-up Color Indicator */}
                        {colorPopup && (
                            <div
                                className="color-popup"
                                style={{
                                    left: '50%',  // Centered horizontally
                                    transform: 'translateX(-50%)', // Center it perfectly
                                    top: '-0.4px',  // Positioned above the slider
                                    backgroundColor: colorPopup, // Set the background color
                                }}
                            ></div>
                        )}

                        {/* Display the bubbles for selected colors */}
                        <div className="color-bubbles">
                            {selectedColors.map((color) => (
                                <div
                                    key={color}
                                    className="color-bubble"
                                    style={{ backgroundColor: color }}
                                    onClick={() => removeColor(color)} // Remove color on click
                                ></div>
                            ))}
                        </div>
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
                        {products.map(product => (
                            <div key= {product.id}className="product-item">
                                <div className="product-image">
                                {product.images && (
                                        <div className="product-image">
                                            <img
                                                src={generateDataUrl(product.images)}
                                                alt={`Product ${product.id} Image`}
                                                title={`Product ${product.id} Image`}
                                            />
                                        </div>
                                    )}
                                </div>
                                <div className="product-info">
                                    <div className='product-name'>
                                    {product.name}
                                    </div>
                                    
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
                </div>
            </div>
        </div>
    );
};

export default ProductsPage;



