import React, { useState, useEffect, useRef } from 'react';
import { FaTimes } from 'react-icons/fa'; // For the close button icon
import '../style/productsPageStyle/FilterWindow.css';

const FilterWindow = ({ onClose, setProducts, setCurrentPage }) => {
    // State for selected options
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [selectedStyles, setSelectedStyles] = useState([]);
    const [selectedBrands, setSelectedBrands] = useState([]);
    const [selectedColors, setSelectedColors] = useState([]);
    const [selectedSizes, setSelectedSizes] = useState([]);
    const [priceRange, setPriceRange] = useState([0, 600]);

    const filterWindowRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (filterWindowRef.current && !filterWindowRef.current.contains(event.target) && !event.target.classList.contains('filter-button')) {
                onClose();
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [onClose]);

    // Toggle selection for categories, styles, brands, and sizes
    const toggleSelection = (list, setList, item) => {
        if (list.includes(item)) {
            setList(list.filter((i) => i !== item));
        } else {
            setList([...list, item]);
        }
    };

    // Toggle selection for colors
    const toggleColorSelection = (color) => {
        if (selectedColors.includes(color)) {
            setSelectedColors(selectedColors.filter((c) => c !== color));
        } else {
            setSelectedColors([...selectedColors, color]);
        }
    };

    // Handle price range change
    const handlePriceRangeChange = (event) => {
        const value = parseInt(event.target.value, 10);
        setPriceRange([0, value]);
    };

    // Handle "Show Results" button click
    const handleShowResults = async () => {
        const filterData = {
            selectedTags: selectedCategories,
            selectedStyles: selectedStyles,
            selectedBrands: selectedBrands,
            selectedColors: selectedColors,
            selectedSizes: selectedSizes,
        };

        // Extract maxPrice from the price range
        const maxPrice = priceRange[1];

        try {
            // Send maxPrice as a query parameter and other filters in the request body
            const response = await fetch(`http://localhost:8080/api/products/filter?maxPrice=${maxPrice}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(filterData),
            });

            if (!response.ok) {
                throw new Error('Failed to fetch filtered products');
            }

            const result = await response.json();
            console.log('Filtered Products:', result);
            if (Array.isArray(result)) {
                setProducts(result.map(product => ({
                    ...product,
                    images: Array.isArray(product.images) ? product.images : []
                })));
                setCurrentPage(1);
            } else {
                console.error('Fetched data is not an array:', result);
            }

            // Close the filter window
            onClose();
        } catch (error) {
            console.error('Error fetching filtered products:', error);
        }
    };

    return (
        <div className="filter-window" ref={filterWindowRef}>
            <button className="close-button" onClick={onClose}>
                <FaTimes />
            </button>

            {/* Category Section */}
            <div className="section">
                <h3>Category</h3>
                <div className="options">
                    {['T-shirt', 'Jacket', 'Shirt', 'Hoodies', 'Sweatshirts', 'Jumpers', 'Trousers', 'Jeans', 'Joggers', 'Vests', 'Socks', 'Shorts', 'sandal'].map((category) => (
                        <div
                            key={category}
                            className={`option ${selectedCategories.includes(category) ? 'selected' : ''}`}
                            onClick={() => toggleSelection(selectedCategories, setSelectedCategories, category)}
                        >
                            {category}
                        </div>
                    ))}
                </div>
            </div>

            {/* Style Section */}
            <div className="section">
                <h3>Style</h3>
                <div className="options">
                    {['Regular', 'Oversized', 'Slim', 'Relaxed', 'Skinny', 'Muscle'].map((style) => (
                        <div
                            key={style}
                            className={`option ${selectedStyles.includes(style) ? 'selected' : ''}`}
                            onClick={() => toggleSelection(selectedStyles, setSelectedStyles, style)}
                        >
                            {style}
                        </div>
                    ))}
                </div>
            </div>

            {/* Brand Section */}
            <div className="section">
                <h3>Brand</h3>
                <div className="options">
                    {['Nike', 'Adidas', 'Yeezy', 'New Balance', 'Balenciaga', 'Off White', 'Supreme', 'Carhartt', 'Gap', 'Vans', 'Asics', 'Burberry'].map((brand) => (
                        <div
                            key={brand}
                            className={`option ${selectedBrands.includes(brand) ? 'selected' : ''}`}
                            onClick={() => toggleSelection(selectedBrands, setSelectedBrands, brand)}
                        >
                            {brand}
                        </div>
                    ))}
                </div>
            </div>

            {/* Color Section */}
            <div className="section">
                <h3>Color</h3>
                <div className="options">
                    {['blue', 'red', 'green', 'yellow', 'brown', 'pink', 'purple', 'black', 'white', 'gray'].map((color) => (
                        <div
                            key={color}
                            className={`color-option ${selectedColors.includes(color) ? 'selected' : ''}`}
                            onClick={() => toggleColorSelection(color)}
                        >
                            <div
                                className="color-circle"
                                style={{ backgroundColor: color }}
                            ></div>
                            <span className="color-name">{color}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Size Section */}
            <div className="section">
                <h3>Size</h3>
                <div className="options">
                    {['XS', 'S', 'M', 'L', 'XL', 'XXL', '36', '38', '40', '42', '44', '46'].map((size) => (
                        <div
                            key={size}
                            className={`option ${selectedSizes.includes(size) ? 'selected' : ''}`}
                            onClick={() => toggleSelection(selectedSizes, setSelectedSizes, size)}
                        >
                            {size}
                        </div>
                    ))}
                </div>
            </div>

            {/* Price Range Section */}
            <div className="section">
                <h3>Price Range</h3>
                <div className="price-range-container">
                    <input
                        type="range"
                        min="0"
                        max="600"
                        value={priceRange[1]}
                        onChange={(e) => setPriceRange([0, parseInt(e.target.value, 10)])}
                        className="price-range-1"
                    />
                    <div className="price-display">
                        ${priceRange[0]} - $
                        <input
                            type="number"
                            value={priceRange[1]}
                            onChange={handlePriceRangeChange}
                            className="price-input"></input>
                    </div>
                </div>
            </div>

            {/* Show Results Button */}
            <button className="show-results" onClick={handleShowResults}>
                Show Results
            </button>
        </div>
    );
};

export default FilterWindow;