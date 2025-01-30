import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Header from './Header';
import { useNavigate } from 'react-router-dom';
import '../style/productsPageStyle/ProductsPageStyle.css';
import FilterWindow from './FilterWindow'; // Import the FilterWindow component

const ProductsPage = () => {
    const navigate = useNavigate();
    const [sortType, setSortType] = useState('name');
    const [sortOrder, setSortOrder] = useState('asc');
    const [searchInput, setSearchInput] = useState('');
    const [image, setImage] = useState(null);
    const [clothingType, setClothingType] = useState('');
    const [price, setPrice] = useState(100);
    const [selectedTags, setSelectedTags] = useState([]);
    const [products, setProducts] = useState([]);
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const tags = ["T-shirt/top", "Trouser", "Pullover", "Dress", "Coat", "Sandal", "Shirt", "Sneaker", "Bag", "Ankle boot"];
    const [selectedColors, setSelectedColors] = useState([]);
    const [sliderValue, setSliderValue] = useState(0);
    const [sliderThumbColor, setSliderThumbColor] = useState('white');
    const [colorPopup, setColorPopup] = useState(null);
    const colorOptions = ['red', 'blue', 'green', 'yellow', 'pink', 'orange','purple', 'brown', 'black', 'white'];
    const [isFilterVisible, setIsFilterVisible] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const productsPerPage = 18;
    
    const toggleFilter = () => {
        setIsFilterOpen(!isFilterOpen);
    };

    const handleCloseFilter = () => {
        setIsFilterOpen(false);
    };

    const getClosestColor = (value) => {
        const index = Math.round(value / (200 / (colorOptions.length - 1)));
        return colorOptions[index];
    };

    const handleSliderChange = (e) => {
        const value = e.target.value;
        setSliderValue(value);
        const closestColor = getClosestColor(value);
        setColorPopup(closestColor);
        const sliderThumbColor = closestColor;
        setSliderThumbColor(sliderThumbColor);
        setTimeout(() => setColorPopup(null), 1000);
        if (!selectedColors.includes(closestColor)) {
            setSelectedColors([...selectedColors, closestColor]);
        }
    };

    const removeColor = (colorToRemove) => {
        setSelectedColors(selectedColors.filter(color => color !== colorToRemove));
    };

    useEffect(() => {
        const fetchProducts = async () => {
            const products = await getBaseList();
            setProducts(products.map(product => ({
                ...product,
                image: product.images && product.images.length > 0 ? product.images : null
            })));
        };
        fetchProducts();
    }, []);

    const convertImageStringToBase64 = (imageString) => {
        if (imageString.startsWith('data:image')) {
            return imageString;
        } else {
            return `data:image/jpeg;base64,${imageString}`;
        }
    };

    const retrieveProducts = async () => {
        try {
            const response = await fetch('http://localhost:8080/api/products/filter', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ selectedTags, selectedColors }),
            });
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

    const handleInputChange = async (e) => {
        const inputValue = e.target.value;
        setSearchInput(inputValue);
        if (inputValue === '') {
            try {
                const baseList = await getBaseList();
                setProducts(baseList.map(product => ({
                    ...product,
                    images: Array.isArray(product.images) ? product.images : []
                })));
            } catch (error) {
                console.error('Error fetching base list:', error);
            }
        }
    };

    const handleSearch = async () => {
        try {
            const response = await fetch(`http://localhost:8080/api/products/search?query=${searchInput}`, {
                method: 'GET'
            });
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

    const getBaseList = async () => {
        try {
            const response = await fetch('http://localhost:8080/api/products/all');
            const result = await response.json();
            if (Array.isArray(result)) {
                return result;
            } else {
                console.error('Fetched data is not an array:', result);
                return [];
            }
        } catch (error) {
            console.error('Error fetching newproducts:', error);
            return [];
        }
    };

    const handleTagClick = (tag) => {
        setSelectedTags((prevTags) =>
            prevTags.includes(tag)
                ? prevTags.filter((t) => t !== tag)
                : [...prevTags, tag]
        );
    };

    const convertToBase64 = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result.split(",")[1]);
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
                const products = await getBaseList();
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
                setProducts(products.map(product => ({
                    ...product,
                    image: product.images && product.images.length > 0 ? product.images : null
                })));
            } else {
                alert("Failed to retrieve similar products.");
            }
        } catch (error) {
            console.error('Error sending image to AI:', error);
            alert("An error occurred while processing the image.");
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

                <button className="filter-button" onClick={toggleFilter}>
                    Filter
                </button>
            </div>

            {isFilterOpen && <FilterWindow onClose={handleCloseFilter} setProducts={setProducts} />}

            <div className='banner' src='./assets/banner.png'></div>

            {clothingType && <div className="clothing-type">Clothing Type: {clothingType}</div>}

            

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
                    {currentProducts.map(product => (
                        <div key={product.id} className="product-item">
                            <div className="product-image">
                                {product.images && (
                                    <div className="product-image">
                                        <img
                                            src={`data:image/jpeg;base64,${product.image[0].image}`}
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