import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import "../style/productPageStyle/ProductPageStyle.css";
import { useUser } from './user/UserContext';
const ProductPage = () => {
  const location = useLocation();
  const { product } = location.state || {};
  const { user} = useUser();

  const [reviews, setReviews] = useState([]);
  const [userNames, setUserNames] = useState({}); // Map of userNames in the reviews
  const [comment, setComment] = useState('');

  useEffect(() => {
    if (!product?.id) return;

    // Fetch product comments
    fetch(`http://localhost:8080/api/message/comments?productId=${product.id}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        setReviews(data);
        // Fetch usernames for all senders
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
          console.log(data.name);
        } catch (error) {
          console.error(`Error fetching username for ${review.sender}:`, error);
          names[review.sender] = "Unknown User"; // Fallback if fetching fails
        }
      }
    }
    setUserNames(names);
  };
  const postComment = async () => {
    const url = `http://localhost:8080/api/message/add-comment?productId=${product.id}&message=${comment}&sender=${user.userId}`;
    console.log(url);
    try {
      const response = await fetch(url, {
        method: 'POST',  // This is correctly placed inside an options object
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
  
  
      // Add the new comment to the reviews list
      setReviews((prevReviews) => [
        ...prevReviews,
        { sender: user.userId, message: comment },
      ]);
  
      // Add the current user's name to the userNames map
      setUserNames((prevUserNames) => ({
        ...prevUserNames,
        [user.userId]: user.name || "Unknown User",
      }));
  
      // Clear the comment input after posting
      setComment('');
    } catch (error) {
      console.error("Error posting comment:", error);
    }
  };
  
  

  if (!product) {
    return <div className="loading-message">Loading...</div>;
  }

  return (
    <div className="product-page">
      <div className="product-container">
        <div className="product-image-wrapper">
          <img
            src={product.image}
            alt={product.name}
            className="product-image-inner"
          />
        </div>
        <div className="product-info-wrapper">
          <h1 className="product-name-inner">{product.name}</h1>
          <p className="product-price-inner">${product.price}</p>
          <p className="product-description">{product.description}</p>
          <button className="add-to-cart-button">Add to Cart</button>
        </div>
      </div>
      <div className="product-reviews">
        <h2>Reviews</h2>
        <label>
        <input
          required
          type="text"
          name="Comment..."
          className="comment-input"
          value={comment}  
          onChange={(e) => setComment(e.target.value)}  
        />
      </label>
      <button className="post-comment-button" onClick={postComment}>
        Post Comment
      </button>
        {[...reviews].reverse().map((review, index) => (
          <div key={index} className="review">
            <p className="review-user">
              {userNames[review.sender] || "Loading..."}
            </p>
            <p className="review-text">{review.message}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductPage;




