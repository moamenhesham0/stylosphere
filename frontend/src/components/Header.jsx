import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../style/headerStyle/HeaderStyle.css';

function Header() {
    const [showChatbot, setShowChatbot] = useState(false);
    const [chatMessages, setChatMessages] = useState([]);
    const [userMessage, setUserMessage] = useState("");

    const toggleChatbot = () => {
        setShowChatbot(!showChatbot);
    };

    // Send message to Flask backend
    const sendMessage = async (message) => {
        try {
            const response = await fetch("http://127.0.0.1:5000/chat", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ message: message }),
            });
            const data = await response.json();
            setChatMessages([...chatMessages, { from: "user", text: message }, { from: "bot", text: data.reply }]);
        } catch (error) {
            console.error("Error sending message:", error);
        }
    };

    const handleInputChange = (event) => {
        setUserMessage(event.target.value);
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        sendMessage(userMessage);
        setUserMessage("");  // Clear input field
    };

    return (
        <div className="header">
            {/* Logo */}
            <Link to="/" className="logo">
                <img src="/assets/brandIcon.svg" alt="StyloSphere Logo" />
            </Link>

            {/* Navigation */}
            <div className="nav">
                <Link to="/shop" className="nav-item">Shop</Link>
                <Link to="/cart" className="nav-item">Cart</Link>
                {/* Sign In Button */}
                <Link to="/signup" className="signin-btn">Sign Up</Link>
            </div>

            {/* Floating Chatbot Button */}
            <button onClick={toggleChatbot} className="chatbot-btn-floating">
                <img src = '/assets/chat.svg' className='chatbot-img'></img>
            </button>

            {/* Chatbot Modal */}
            {showChatbot && (
                <div className="chatbot-modal">
                    <div className="chatbot-content">
                        <button onClick={toggleChatbot} className="close-btn">
                            &times;
                        </button>

                        {/* Chatbot Messages */}
                        <div className="chatbox">
                            {chatMessages.map((message, index) => (
                                <div key={index} className={message.from}>
                                    <p>{message.text}</p>
                                </div>
                            ))}
                        </div>

                        {/* Message Input */}
                        <form onSubmit={handleSubmit}>
                            <input
                                type="text"
                                value={userMessage}
                                onChange={handleInputChange}
                                placeholder="Type a message..."
                            />
                            <button type="submit">Send</button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Header;







