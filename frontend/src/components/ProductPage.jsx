import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../style/productPageStyle/ProductPageStyle.css";
import { useUser } from "./user/UserContext";
import { useLocalCart } from "../context/localCartContext";
import{ FaTimes } from 'react-icons/fa';

const ProductPage = () => {
  const location = useLocation();
  const { product } = location.state || {};
  const { user } = useUser();
  const { cart, updateLocalCart } = useLocalCart();
  const [quantity, setQuantity] = useState(1);
  const [reviews, setReviews] = useState([]);
  const [size, setSize] = useState(product?.sizes?.[0] || "Large");
  const [color, setColor] = useState(product?.colors?.[0] || "");
  const [userNames, setUserNames] = useState({});
  const [comment, setComment] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!product?.id) return;

    fetch(`http://localhost:8080/api/message/comments?productId=${product.id}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        setReviews(data);
        fetchUserNames(data);
      })
      .catch((error) => console.error("Error fetching comments:", error));
  }, [product]);

  const fetchUserNames = async (reviews) => {
    const names = {};
    for (const review of reviews) {
      if (!names[review.sender]) {
        try {
          const response = await fetch(
            `http://localhost:8080/api/customers/get-user-id?id=${review.sender}`
          );
          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
          const data = await response.json();
          names[review.sender] = data.name;
        } catch (error) {
          console.error(`Error fetching username for ${review.sender}:`, error);
          names[review.sender] = "Unknown User";
        }
      }
    }
    setUserNames(names);
  };

  const postComment = async () => {
    const url = `http://localhost:8080/api/message/add-comment?productId=${product.id}&message=${comment}&sender=${user.userId}`;
    try {
      const response = await fetch(url, {
        method: "POST",
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      setReviews((prevReviews) => [
        ...prevReviews,
        { sender: user.userId, message: comment },
      ]);

      setUserNames((prevUserNames) => ({
        ...prevUserNames,
        [user.userId]: user.name || "Unknown User",
      }));

      setComment("");
    } catch (error) {
      console.error("Error posting comment:", error);
    }
  };

  const addProductToCart = async () => {
    const order = {
      productId: product.id,
      productColor: color,
      productSize: size,
      quantity: quantity,
    };

    updateLocalCart(order);

    if (user.id < 0) return;

    try {
      const response = await fetch(
        `http://localhost:8080/api/customers/add-to-cart?productId=${product.id}&color=${color}&size=${size}&quantity=${quantity}&userId=${user.id}`,
        {
          method: "POST",
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to add product to cart. Status: ${response}`);
      }

      
    } catch (error) {
      console.error("Error adding product to cart:", error);
      setIsModalOpen(true); // Show the modal
    }
  };

  const handleQuantityChange = (change) => {
    setQuantity((prev) => Math.max(1, prev + change));
  };

  const handleContinueShopping = () => {
    setIsModalOpen(false);
    navigate('/shop');
  };

  const handleGoToCart = () => {
    navigate('/cart');
  };

  if (!product) {
    return <div className="loading-message">Loading...</div>;
  }
  const handleCloseModal = () => {
    setIsModalOpen(false);
  };
  return (
    <div className="product-page">
      <div className="product-container">
        <div className="product-image-wrapper">
        {product.image.map(image =>
          <img
            src={`data:image/jpeg;base64,${image.image}`}
            alt={product.name}
            className="product-image-inner"
          />
        )}
        </div>
        <div className="product-info-wrapper">
          <h1 className="product-name-inner">{product.name}</h1>
          <p className="product-price-inner">${product.price}</p>
          <p className="product-description">{product.description}</p>

          <div className="product-options">
            <div className="color-selection">
              <p>Select Color:</p>
              <div className="color-options">
                {product.colors.map((clr, index) => (
                  <button
                    key={index}
                    className={`color-button ${color === clr ? "selected" : ""}`}
                    style={{ backgroundColor: clr }}
                    onClick={() => setColor(clr)}
                  ></button>
                ))}
              </div>
            </div>

            {/* <div className="size-selection">
              <p>Select Size:</p>
              <select
                value={size}
                onChange={(e) => setSize(e.target.value)}
                className="size-dropdown"
              >
                {product.sizes.map((sz, index) => (
                  <option key={index} value={sz}>
                    {sz}
                  </option>
                ))}
              </select>
            </div> */}

            <div className="quantity-selector">
              <p>Quantity:</p>
              <div className="quantity-buttons">
                <button onClick={() => handleQuantityChange(-1)}>-</button>
                <span>{quantity}</span>
                <button onClick={() => handleQuantityChange(1)}>+</button>
              </div>
            </div>
          </div>

          <button className="add-to-cart-button" onClick={addProductToCart}>
            Add to Cart
          </button>
        </div>
      </div>

      <div className="product-reviews">
        <h2>Customer Reviews</h2>
        {user.userStatus ? (
        <div className="comment-section">
          <input
            type="text"
            placeholder="Write a comment..."
            className="comment-input"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
          <button className="post-comment-button" onClick={postComment}>
            Post Comment
          </button>
        </div>
      ) : (
        <p className="login-prompt">Please log in to write a comment.</p>
      )}

        <div className="reviews-list">
        {reviews?.length > 0 ? (
  [...reviews].reverse().map((review, index) => (
    <div key={index} className="review-item">
      <p className="review-user">{userNames[review.sender] || "Loading..."}</p>
      <p className="review-text">{review.message}</p>
    </div>
  ))
) : (
  <p>No reviews available.</p>
)}
        </div>
      </div>

      {isModalOpen && (
        <div className="modal">
          <div className="modal-content">
          <FaTimes className="close-icon" onClick={handleCloseModal} />
            <h2>Product added to cart</h2>
            <button onClick={handleContinueShopping}>Continue Shopping</button>
            <button onClick={handleGoToCart}>Go to Cart</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductPage;
