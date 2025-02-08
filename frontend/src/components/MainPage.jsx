import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Header from '../components/Header'; // Import the Header component
import mainPagepng from '../images/mainPageImg/mainPage.png';
import aboutuspng from '../images/mainPageImg/aboutUs2.png';
import '../style/mainPageStyle/MainPageStyle.css';
import { Link } from 'react-router-dom';
import Footer from '../components/Footer'; // Import the Footer component
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import {useUser} from './user/UserContext';

const MainPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [bestSellers, setBestSellers] = useState([]);
    const [discountedProducts, setDiscountedProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [wishlistItems, setWishlistItems] = useState(new Set());
    const {user} = useUser();

    const [formData, setFormData] = useState({
        name: "",
        complain: "",
        senderEmail: "",
        lastName: "",
    });
    const [messageStatus, setMessageStatus] = useState(""); // State for displaying success or error message

    useEffect(() => {
        if (location.state?.scrollTo) {
          const { scrollTo, delayScroll } = location.state;
      
          setTimeout(() => {
            const element = document.getElementById(scrollTo);
            if (element) {
              element.scrollIntoView({ behavior: "smooth" });
            }
            // Clear the location state after scrolling
            navigate(location.pathname, { replace: true, state: {} });
          }, delayScroll);
        }
        
      }, [location, navigate]);
      

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
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

    const handelComplain = async (e) => {
        e.preventDefault(); // Prevents the form from submitting
        // Validate that all required fields are filled
        if (!formData.name.trim() || !formData.lastName.trim() || !formData.senderEmail.trim() || !formData.complain.trim()) {
            setMessageStatus("Please fill out all required fields before submitting.");
            return; // Stop the function if validation fails
        }

        try {
            // Concatenate name and lastName
            const fullName = `${formData.name} ${formData.lastName}`;

            // Create a new object for the request body
            const complaintData = {
                ...formData,
                name: fullName, // Use the concatenated full name
            };

            const response = await fetch('http://localhost:8080/complaints/save', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(complaintData), // Send the updated object
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();
            console.log('Success:', data);
            setMessageStatus("Message successfully sent!");
            setTimeout(() => setMessageStatus(""), 3000)
            // Optionally reset the form
            setFormData({
                name: "",
                complain: "",
                senderEmail: "",
                lastName: "",
            });
        } catch (error) {
            console.error('Error:', error);
            setMessageStatus("There was an error submitting your complaint. Please try again.");
        }
    };

    // Add the fetch functions from BestSellersPage
    const fetchBestSellers = async () => {
        try {
            const response = await fetch('http://localhost:8080/api/products/best-sellers');
            if (!response.ok) throw new Error(`Failed to fetch best-sellers: ${response.statusText}`);
            const data = await response.json();
            fetchWishlist();
            if (Array.isArray(data)) setBestSellers(data);
            else throw new Error('Unexpected response format');
        } catch (error) {
            console.error('Error fetching best-sellers:', error.message);
            setError(error.message);
        }
    };

    const fetchDiscountedProducts = async () => {
        try {
            const response = await fetch('http://localhost:8080/api/products/discounts');
            if (!response.ok) throw new Error(`Failed to fetch discounted products: ${response.statusText}`);
            const data = await response.json();
            fetchWishlist();
            if (Array.isArray(data)) setDiscountedProducts(data);
            
            else throw new Error('Unexpected response format');
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

    const [currentBestSellerIndex, setCurrentBestSellerIndex] = useState(0);
    const [currentDiscountIndex, setCurrentDiscountIndex] = useState(0);
    const PRODUCTS_PER_SLIDE = 5;

    const handleNextSlide = (products, currentIndex, setIndex) => {
        if ((currentIndex + 1) * PRODUCTS_PER_SLIDE < products.length) {
            setIndex(currentIndex + 1);
        }
    };

    const handlePrevSlide = (currentIndex, setIndex) => {
        if (currentIndex > 0) {
            setIndex(currentIndex - 1);
        }
    };

    const calculateDiscount = (originalPrice, discountedPrice) => {
        return Math.round(((originalPrice - discountedPrice) / originalPrice) * 100);
    };

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

    return (
        <div className="main-page">
            <div className="page-main-one">
                <div className="page-main-one-title">
                    <h1>Unlock Your Marketing Potential Today</h1>
                </div>
                <div className="page-main-one-img">
                    <img src={mainPagepng} alt="Main Page" />
                </div>

                {!loading && !error && (
                    <div className="products-sections-1">
                        <section className="products-section-1">
                            <h2>Best Sellers</h2>
                            <div className="slider-container-1">
                                <button 
                                    className="nav-button prev-1"
                                    onClick={() => handlePrevSlide(currentBestSellerIndex, setCurrentBestSellerIndex)}
                                    disabled={currentBestSellerIndex === 0}
                                >
                                    <ArrowBackIosNewIcon/>
                                </button>
                                <div className="products-grid-1">
                                    {bestSellers
                                        .slice(
                                            currentBestSellerIndex * PRODUCTS_PER_SLIDE,
                                            (currentBestSellerIndex + 1) * PRODUCTS_PER_SLIDE
                                        )
                                        .map(product => (
                                            <div key={product.id} className="product-item-1" onClick={() => navigate(`/product/${product.id}`, { state: { product } })}>
                                                <div className="product-image-1">
                                                    {product.discountedPrice > 0 && (
                                                        <div className="discount-badge-1">
                                                            -{calculateDiscount(product.price, product.discountedPrice)}%
                                                        </div>
                                                    )}
                                                    {product.image && (
                                                        <div className="product-image-1">
                                                            {product.quantity > 0 ? (
                                                                <img
                                                                    src={`data:image/jpeg;base64,${product.image[0].image}`}
                                                                    alt={`Product ${product.id} Image`}
                                                                    className="in-stock-image-1"
                                                                />
                                                            ) : (
                                                                <>
                                                                    <img
                                                                        src={`data:image/jpeg;base64,${product.image[0].image}`}
                                                                        alt={`Product ${product.id} Image`}
                                                                        className="out-of-stock-image-1"
                                                                    />
                                                                    <div className="out-of-stock-overlay-1">
                                                                        <span>Out of Stock</span>
                                                                    </div>
                                                                </>
                                                            )}
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="product-info-1">
                                                    <div className='product-name-1'>
                                                        {product.name.length > 35 ? `${product.name.substring(0, 35)}...` : product.name}
                                                    </div>
                                                    {wishlistItems.has(product.id) ? (
                                                        <FavoriteIcon 
                                                            onClick={(e) => handleWishlistClick(e, product.id)}
                                                            style={{float: 'right', fontSize: 30, color: '#c3ad71', paddingRight:10, cursor: "pointer"}}
                                                        />
                                                    ) : (
                                                        <FavoriteBorderIcon 
                                                            onClick={(e) => handleWishlistClick(e, product.id)}
                                                            style={{float: 'right', fontSize: 30, color: '#c3ad71', paddingRight:10, cursor: "pointer"}}
                                                        />
                                                    )}
                                                    <div className="price-container-1">
                                                        {product.discountedPrice > 0 ? (
                                                            <>
                                                                <p className="original-price-1">${product.price}</p>
                                                                <p className="discounted-price-1">${product.discountedPrice}</p>
                                                            </>
                                                        ) : (
                                                            <p>${product.price}</p>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                </div>
                                <button 
                                    className="nav-button next-1"
                                    onClick={() => handleNextSlide(bestSellers, currentBestSellerIndex, setCurrentBestSellerIndex)}
                                    disabled={(currentBestSellerIndex + 1) * PRODUCTS_PER_SLIDE >= bestSellers.length}
                                >
                                    <ArrowForwardIosIcon/>
                                </button>
                            </div>
                        </section>

                        <section className="products-section-1">
                            <h2>Special Offers</h2>
                            <div className="slider-container-1">
                                <button 
                                    className="nav-button prev-1"
                                    onClick={() => handlePrevSlide(currentDiscountIndex, setCurrentDiscountIndex)}
                                    disabled={currentDiscountIndex === 0}
                                >
                                    <ArrowBackIosNewIcon/>
                                </button>
                                <div className="products-grid-1">
                                    {discountedProducts
                                        .slice(
                                            currentDiscountIndex * PRODUCTS_PER_SLIDE,
                                            (currentDiscountIndex + 1) * PRODUCTS_PER_SLIDE
                                        )
                                        .map(product => (
                                            <div key={product.id} className="product-item-1" 
                                                onClick={() => navigate(`/product/${product.id}`, { state: { product } })}>
                                                <div className="product-image-1">
                                                    {product.discountedPrice > 0 && (
                                                        <div className="discount-badge-1">
                                                            -{calculateDiscount(product.price, product.discountedPrice)}%
                                                        </div>
                                                    )}
                                                {product.image  ? (
                                                    <div className="product-image-1">
                                                        {product.quantity > 0 ? (
                                                            <>
                                                                <img
                                                                    src={product.image[0]?.image ? `data:image/jpeg;base64,${product.image[0].image}` : '/placeholder.jpg'}
                                                                    alt={`Product ${product.id}`}
                                                                    title={`Product ${product.id}`}
                                                                    className="in-stock-image-1"
                                                                    onError={(e) => {
                                                                        console.error("Image failed to load:", e);
                                                                        e.target.src = '/placeholder.jpg';
                                                                    }}
                                                                />
                                                                {console.log("Image data:", product.image[0])}
                                                            </>
                                                        ) : (
                                                            <>
                                                                <img
                                                                    src={product.image[0]?.image ? `data:image/jpeg;base64,${product.image[0].image}` : '/placeholder.jpg'}
                                                                    alt={`Product ${product.id}`}
                                                                    title={`Product ${product.id}`}
                                                                    className="out-of-stock-image-1"
                                                                    onError={(e) => {
                                                                        console.error("Image failed to load:", e);
                                                                        e.target.src = '/placeholder.jpg';
                                                                    }}
                                                                />
                                                                <div className="out-of-stock-overlay-1">
                                                                    <span>Out of Stock</span>
                                                                </div>
                                                            </>
                                                        )}
                                                    </div>
                                                ) : (
                                                    <div>No image available</div>
                                                )}
                                                </div>
                                                <div className="product-info-1">
                                                    <div className='product-name-1'>
                                                        {product.name.length > 35 ? 
                                                            `${product.name.substring(0, 35)}...` : 
                                                            product.name}
                                                    </div>
                                                    {wishlistItems.has(product.id) ? (
                                                        <FavoriteIcon 
                                                            onClick={(e) => handleWishlistClick(e, product.id)}
                                                            style={{
                                                                float: 'right',
                                                                fontSize: 30,
                                                                color: '#c3ad71',
                                                                paddingRight: 10,
                                                                cursor: "pointer"
                                                            }}
                                                        />
                                                    ) : (
                                                        <FavoriteBorderIcon 
                                                            onClick={(e) => handleWishlistClick(e, product.id)}
                                                            style={{
                                                                float: 'right',
                                                                fontSize: 30,
                                                                color: '#c3ad71',
                                                                paddingRight: 10,
                                                                cursor: "pointer"
                                                            }}
                                                        />
                                                    )}
                                                    <div className="price-container-1">
                                                        {product.discountedPrice > 0 ? (
                                                            <>
                                                                <p className="original-price-1">${product.price}</p>
                                                                <p className="discounted-price-1">
                                                                    ${product.discountedPrice}
                                                                </p>
                                                            </>
                                                        ) : (
                                                            <p>${product.price}</p>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                </div>
                                <button 
                                    className="nav-button next-1"
                                    onClick={() => handleNextSlide(discountedProducts, currentDiscountIndex, setCurrentDiscountIndex)}
                                    disabled={(currentDiscountIndex + 1) * PRODUCTS_PER_SLIDE >= discountedProducts.length}
                                >
                                    <ArrowForwardIosIcon/>
                                </button>
                            </div>
                        </section>
                    </div>
                )}
                
              
            </div>

            <div className="page-main-two" id='learn-more' >
                <div className="page-main-two-img">
                    <img src={aboutuspng} alt="About Us" />
                </div>
                <div className="page-main-two-right" >
                    <div className="page-main-two-head">
                        <h1>
                            Who
                            <br />
                            We are
                        </h1>
                    </div>
                    <div className="page-main-two-txt">
                        <p>
                            Welcome to our marketing hub, where creativity meets strategy! We're
                            here to help your brand thrive with personalized solutions that connect,
                            engage, and inspire.
                        </p>
                    </div>
                    <div className="page-main-two-button">
                        <Link to="/learnmore" className="button">
                            LEARN More
                        </Link>
                    </div>
                </div>
            </div>

            <div className="page-main-three" id='contact-us'  >
                <div className="page-main-three-contactus">
                    <div className="page-main-three-contactus-title">
                        <h1>Contact Us</h1>
                    </div>
                    <p>
                        Interested in working together? Fill out some info and we will
                        be in touch shortly. We can’t wait to hear from you!
                    </p>
                </div>

                <div className="page-main-three-login">
                    <form onSubmit={handelComplain}>
                        <label htmlFor="first-name" className="label">
                            Name <span className="required">(required)</span>
                        </label>
                        <div className="name-fields">
                            <div>
                                <input
                                    type="text"
                                    id="first-name"
                                    name="name"
                                    placeholder="First Name"
                                    required
                                    value={formData.name}
                                    onChange={handleChange}
                                />
                            </div>
                            <div>
                                <input
                                    type="text"
                                    id="last-name"
                                    name="lastName"
                                    placeholder="Last Name"
                                    required
                                    value={formData.lastName}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>
                        <label htmlFor="email" className="label">
                            Email <span className="required">(required)</span>
                        </label>
                        <input
                            type="email"
                            id="email"
                            name="senderEmail"
                            placeholder="Email"
                            required
                            value={formData.senderEmail}
                            onChange={handleChange}
                        />

                        <label htmlFor="message" className="label label-message">
                            Message <span className="required">(required)</span>
                        </label>
                        <textarea
                            id="message"
                            name="complain"
                            placeholder="Message"
                            rows="4"
                            required
                            value={formData.complain}
                            onChange={handleChange}
                        ></textarea>
                        <div className="send-button">
                            <button type="submit">Send</button>
                            {messageStatus && (
                                <span className={`status-message ${messageStatus.includes('successfully') ? 'success' : 'error'}`}>
                                    {messageStatus}
                                </span>
                            )}
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default MainPage;
