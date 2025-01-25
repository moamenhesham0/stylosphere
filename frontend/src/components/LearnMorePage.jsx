
import React from 'react';
import { useNavigate } from 'react-router-dom'; // Import the hook
import blogpng from '../images/mainPageImg/learnMore.png';
import chatbot from '../images/mainPageImg/AI.png';
import recognition from '../images/mainPageImg/reco.png';
import '../style/mainPageStyle/LearnMorePage.css';

const LearnMorePage = () => {
  const navigate = useNavigate(); // Initialize the hook

  const handleExploreClick = () => {
    navigate('/shop'); // Navigate to the Shop page
  };

  return (
    <div className="learn-more-page">
      <div className="learn-more-container">
        <div className="learn-more-image-container">
          <img
            src={blogpng}
            alt="Fashion Store Mannequins"
            className="learn-more-image"
          />
        </div>
        <div className="learn-more-info">
          <h2>About Our Clothes</h2>
          <p>
            Our collection features a wide range of clothing items crafted from the finest materials. We prioritize quality and comfort in every piece we create.
          </p>
          <ul>
            <li>Premium fabrics</li>
            <li>Attention to detail</li>
            <li>Durable and long-lasting</li>
          </ul>
          <button
            className="learn-more-button"
            onClick={handleExploreClick} // Attach the handler
          >
            Explore Collection
          </button>
        </div>
      </div>
      <div className="chatbot-container">
        <div className="chatbot-image-container">
          <img
            src={chatbot}
            alt="Chatbot Icon"
            className="chatbot-image"
          />
        </div>
        <div className="chatbot-info">
          <h2>Chatbot Features:</h2>
          <ul>
            <li><strong>User-Friendly Design:</strong> The chatbot is placed in the bottom-right corner with a clean, circular icon for easy access.</li>
            <li><strong>Greeting Message:</strong> Once opened, it welcomes users with a friendly message like "Hi! How can I assist you today?" to create a conversational tone.</li>
            <li><strong>Interactive Options:</strong> Includes quick options such as:
              <ul>
                <li>Search Products: Helping users find specific items.</li>
                <li>Get Styling Tips: Offering personalized fashion advice.</li>
                <li>Track Orders: Providing order status updates.</li>
              </ul>
            </li>
            <li><strong>Text Input Bar:</strong> A simple and intuitive input area for users to type their queries.</li>
          </ul>
        </div>
      </div>
      <div className="recognition-container">
        <div className="recognition-image-container">
          <img
            src={recognition}
            alt="Recognition Feature"
            className="recognition-image"
          />
        </div>
        <div className="recognition-info">
          <h2>Recognition Features:</h2>
          <ul>
            <li><strong>Upload an Image:</strong> Users can upload a picture of a clothing item they like (e.g., a red dress) directly into the system.</li>
            <li><strong>AI Matching:</strong> The AI analyzes the uploaded image and identifies visually similar items in your store, matching colors, patterns, and styles.</li>
            <li><strong>Personalized Results:</strong> It displays suggested products, such as dresses, tops, or accessories that complement the uploaded image.</li>
            <li><strong>Modern and Futuristic UI:</strong> A sleek, interactive interface with clear labels like "Upload Image" and "Recommended Matches," making the process intuitive.</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default LearnMorePage;
