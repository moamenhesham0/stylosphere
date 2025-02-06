import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Header from './Header';
import { useNavigate } from 'react-router-dom';
import '../style/productsPageStyle/ProductsPageStyle.css';
import FilterWindow from './FilterWindow'; // Import the FilterWindow component
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import {useUser} from './user/UserContext';
import { use } from 'react';

const ProductsPage = ({ isFilterOpen, setIsFilterOpen }) => {
    const navigate = useNavigate();
    const [sortType, setSortType] = useState();
    const [sortName, setSortName] = useState();
    const [sortOrder, setSortOrder] = useState('asc');
    const [searchInput, setSearchInput] = useState('');
    const [image, setImage] = useState(null);
    const [clothingType, setClothingType] = useState('');
    const [selectedTags, setSelectedTags] = useState([]);
    const [products, setProducts] = useState([]);
    const [selectedColors, setSelectedColors] = useState([]);
    const colorOptions = ['red', 'blue', 'green', 'yellow', 'pink', 'orange','purple', 'brown', 'black', 'white'];
    const [currentPage, setCurrentPage] = useState(1);
    const productsPerPage = 18;
    const [wishlistItems, setWishlistItems] = useState(new Set());
    const {user} = useUser();
    const [loading, setLoading] = useState(false); // Add loading state


    // Create a gradient spectrum background

    const toggleFilter = () => {
        setIsFilterOpen(!isFilterOpen);
    };

    const handleCloseFilter = () => {
        setIsFilterOpen(false);
    };


    useEffect(() => {
        setProducts(sortedProducts);
    }, [sortType , sortOrder]);
    // Function to determine closest color based on slider value

    useEffect(() => {
        const fetchProducts = async () => {
            const products = await getBaseList();
            setProducts(products.map(product => ({
                ...product,
                image: product.images && product.images.length > 0 ? product.images : null
            })));
        };
        
        const fetchWishlist = async () => {
            if (user && user.userId) {
                try {
                    const response = await fetch(`http://localhost:8080/api/wishlist/get-wishlist?customerId=${user.userId}`);
                    if (!response.ok) {
                        throw new Error('Failed to fetch wishlist');
                    }
                    const wishlistProducts = await response.json();
                    const wishlistIds = new Set(wishlistProducts.map(product => product.id));
                    setWishlistItems(wishlistIds);
                } catch (error) {
                    console.error('Error fetching wishlist:', error);
                }
            }
        };

        fetchProducts();
        fetchWishlist();
    }, [user]);

    const retrieveProducts = async () => {
        try {
            const response = await fetch('http://localhost:8080/api/products/filter', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({selectedTags , selectedColors}),
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


    // Handle search input change
    const handleInputChange = async (e) => {
        const inputValue = e.target.value;
        setSearchInput(inputValue);
      
        if (inputValue === '') {
          try {
            const baseList = await getBaseList(); // Wait for the async function to resolve
            setProducts(baseList.map(product => ({
                ...product,
                images: Array.isArray(product.images) ? product.images : []
            }))); // Update products with the fetched base list
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


    
    const getBaseList = async () => {
        try {
            // Make a request to the backend
            const response = await fetch('http://localhost:8080/api/products/all');
            
            const result = await response.json();
            if (Array.isArray(result)) {
                setProducts(result.map(product => ({
                    ...product,
                    images: Array.isArray(product.images) ? product.images : []
                })));
                console.log('Fetched newproducts:', products[0].images+"mkklksk");
                console.log('Fetched newproducts:', result);
                return result;
            } else {
                console.error('Fetched data is not an array:', result);
            }
        } catch (error) {
            console.error('Error fetching newproducts:', error);
        }
    };

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
    setLoading(true); // Start loading
    try {
        const payload = {
            query_image: base64Image,
            products: products,
        };

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
        console.log('Similar products:', data.similar_products);
        if (data.similar_products) {
            setProducts(data.similar_products.map(product => ({
                ...product,
                images: Array.isArray(product.images) ? product.images : [] // Take the first image if available
            })));
        } else {
            alert("Failed to retrieve similar products.");
        }
    } catch (error) {
        console.error('Error sending image to AI:', error);
        alert("An error occurred while processing the image.");
    } finally {
        setLoading(false); // End loading
    }
};

    const sortProductsByPrice = (order) => {
        return [...products].sort((a, b) => (order === 'asc' ? a.price - b.price : b.price - a.price));
    };

    const sortProductsByName = (order) => {
        return [...products].sort((a, b) => (order === 'asc' ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name)));
    };

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                retrieveProducts();
            } catch (error) {
                console.error("Error fetching products:", error);
            }
        };
        fetchProducts();
    }, [selectedTags, selectedColors]);

    const sortedProducts = sortType === 'price'
        ? sortProductsByPrice(sortOrder)
        : sortProductsByName(sortOrder);

    useEffect(() => {
        const getnewproducts = async () => {
            try {
                const response = await fetch('http://localhost:8080/api/admin/products');
                const result = await response.json();
                if (Array.isArray(result)) {
                    setProducts(result.map(product => ({
                        ...product,
                        images: Array.isArray(product.images) ? product.images : []
                    })));
                } else {
                    console.error('Fetched data is not an array:', result);
                }
            } catch (error) {
                console.error('Error fetching newproducts:', error);
            }
        };
        getnewproducts();
    }, []);

    const handleWishlistClick = async (e, productId) => {
        e.stopPropagation(); // Prevent product item click event
        
        const customerId = user.userId; // Assuming you store customerId in localStorage
        console.log('customerId:', customerId);
        if (!customerId) {
            alert('Please login to add items to wishlist');
            return;
        }

        try {
            const endpoint = wishlistItems.has(productId) 
                ? '/api/wishlist/remove-from-wishlist'
                : '/api/wishlist/add-to-wishlist';
                
            const response = await fetch(`http://localhost:8080${endpoint}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: `customerId=${customerId}&productId=${productId}`
            });

            if (response.ok) {
                setWishlistItems(prevItems => {
                    const newItems = new Set(prevItems);
                    if (newItems.has(productId)) {
                        newItems.delete(productId);
                    } else {
                        newItems.add(productId);
                    }
                    return newItems;
                });
            } else {
                alert('Failed to update wishlist');
            }
        } catch (error) {
            console.error('Error updating wishlist:', error);
            alert('Error updating wishlist');
        }
    };

    // Calculate the products to display based on the current page
    const indexOfLastProduct = currentPage * productsPerPage;
    const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
    const currentProducts = products.slice(indexOfFirstProduct, indexOfLastProduct);

    const handleNextPage = () => {
        setCurrentPage(prevPage => prevPage + 1);
    };

    const handlePrevPage = () => {
        setCurrentPage(prevPage => Math.max(prevPage - 1, 1));
    };

    // Calculate the total number of pages
    const totalPages = Math.ceil(products.length / productsPerPage);

    const handlePageClick = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const calculateDiscount = (originalPrice, discountedPrice) => {
        if (discountedPrice === 0) return 0;
        return Math.round(((originalPrice - discountedPrice) / originalPrice) * 100);
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
                        {/* Loading bar */}
                        {loading && <div className="loading-bar"></div>}
            <div className='banner' src = './assets/banner.png'>
            </div>

            {isFilterOpen && <FilterWindow onClose={handleCloseFilter} setProducts={setProducts}  setCurrentPage={setCurrentPage} />}
            {clothingType && <div className="clothing-type">Clothing Type: {clothingType}</div>}


                <div className="product-list-container">
                    <div className="sorting-toolbar">
                <button className="filter-button" onClick={toggleFilter}>
                    Filter
                </button>
                        <div className="sort-dropdown">
                        <nav role="navigation" className="primary-navigation">
                            <ul>
                                <li>Sort by <span >{sortName}</span>
                                    <ul className="dropdown">
                                        <li onClick={() => {setSortName(""); setSortType(""); setSortOrder(""); getBaseList()}}><a>None</a></li>
                                        <li onClick={() => {setSortName("Price↑"); setSortType("price"); setSortOrder("asc"); }}><a>Price↑</a></li>
                                        <li onClick={() => {setSortName("Price↓"); setSortType("price"); setSortOrder("desc"); }}><a>Price↓</a></li>
                                        <li onClick={() => {setSortName("Alphabetically↑"); setSortType("name"); setSortOrder("asc"); }}><a>Alphabetically↑</a></li>
                                        <li onClick={() => {setSortName("Alphabetically↓"); setSortType("name"); setSortOrder("desc"); }}><a>Alphabetically↓</a></li>
                                    </ul>
                                </li>
                            </ul>
                        </nav>
                        </div>
                    </div>

                    <div className="products-grid">
                        {products.map(product => (
                            <div key= {product.id}className="product-item" onClick={() => navigate(`/product/${product.id}`, { state: { product } })}>
                                <div className="product-image">
                                    {product.discountedPrice > 0 && (
                                        <div className="discount-badge">
                                           - {calculateDiscount(product.price, product.discountedPrice)}%
                                        </div>
                                    )}
                                {product.images && (
                                       <div className="product-image">
                                       {product.quantity > 0 ? (
                                           <img
                                               src={`data:image/jpeg;base64,${product.image[0].image}`}
                                               alt={`Product ${product.id} Image`}
                                               title={`Product ${product.id} Image`}
                                               className="in-stock-image"
                                           />
                                       ) : (
                                           <>
                                               <img
                                                   src={`data:image/jpeg;base64,${product.image[0].image}`}
                                                   alt={`Product ${product.id} Image`}
                                                   title={`Product ${product.id} Image`}
                                                   className="out-of-stock-image"
                                               />
                                               <div className="out-of-stock-overlay">
                                                   <span>Out of Stock</span>
                                               </div>
                                           </>
                                       )}
                                   </div>
                                    )}
                                </div>
                                <div className="product-info">
                                    <div className='product-name'>
                                            {product.name.length > 35 ? `${product.name.substring(0, 35)}...` : product.name}
                                        </div>
                                        {user.type === "customer" && (wishlistItems.has(product.id) ? (
                                        <FavoriteIcon 
                                            onClick={(e) => handleWishlistClick(e, product.id)}
                                            style={{float: 'right', fontSize: 30, color: '#c3ad71', paddingRight:10, cursor: "pointer"}}
                                        />
                                    ) : (
                                        <FavoriteBorderIcon 
                                            onClick={(e) => handleWishlistClick(e, product.id)}
                                            style={{float: 'right', fontSize: 30, color: '#c3ad71', paddingRight:10, cursor: "pointer"}}
                                        />
                                    ))}
                                        <div className="price-container">
                                            {product.discountedPrice > 0 ? (
                                                <>
                                                    <p className="original-price">${product.price}</p>
                                                    <p className="discounted-price">${product.discountedPrice}</p>
                                                </>
                                            ) : (
                                                <p>${product.price}</p>
                                            )}
                                        </div>
                                </div>
                            </div>
                        
                    ))}
                </div>
                <div className="pagination-buttons">
                    <button onClick={handlePrevPage} disabled={currentPage === 1}>Previous</button>
                    {[...Array(totalPages).keys()].slice(
                        Math.max(0, currentPage - 3), 
                        Math.min(totalPages, currentPage + 2)
                    ).map(pageNumber => (
                        <button
                            key={pageNumber + 1}
                            onClick={() => handlePageClick(pageNumber + 1)}
                            className={currentPage === pageNumber + 1 ? 'active' : ''}
                        >
                            {pageNumber + 1}
                        </button>
                    ))}
                    <button onClick={handleNextPage} disabled={currentPage === totalPages}>Next</button>
                </div>
            </div>
        </div>
    );
};

export default ProductsPage;