import React, { useState } from 'react';
import Header from '../components/Header'; // Import the Header component
import mainPagepng from '../images/mainPageImg/mainPage.png';
import aboutuspng from '../images/mainPageImg/aboutUs2.png';
import '../style/mainPageStyle/MainPageStyle.css';

function MainPage() {
    const [formData, setFormData] = useState({
        name: "",
        complain: "",
        senderEmail: "",
        lastName: "",
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handelComplain = async () => {
        try {
            const response = await fetch('http://localhost:8080/complaints/save', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();
            console.log('Success:', data);
        } catch (error) {
            console.error('Error:', error);
        }
    }

    return (
        <div className="main-page">

            <div className='page-main-one'>
                <div className='page-main-one-title'>
                    <h1>Unlock Your Marketing Potential Today</h1>
                </div>
                <div className='page-main-one-img'>
                    <img src={mainPagepng} alt="Main Page" />
                    <p className="overlay-text">
                        
                    </p>
                </div>
            </div>

            <div className='page-main-two'>
                <div className='page-main-two-img'>
                    <img src={aboutuspng} alt="About Us" />
                </div>
                <div className='page-main-two-right'>
                    <div className='page-main-two-head'>
                        <h1>
                            Who
                            <br />
                            We are
                        </h1>
                    </div>
                    <div className='page-main-two-txt'>
                        <p>
                            Welcome to our marketing hub, where creativity meets strategy! We're
                            here to help your brand thrive with personalized solutions that connect,
                            engage, and inspire.
                        </p>
                    </div>
                    <div className='page-main-two-button'>
                        <a href="/about" className="button">LEARN MORE</a>
                    </div>
                </div>
            </div>

            <div className='page-main-three'>
                <div className='page-main-three-contactus'>
                    <div className='page-main-three-contactus-title'>
                        <h1>Contact Us</h1>
                    </div>
                    <p>
                        Interested in working together? Fill out some info and we will
                        be in touch shortly. We can’t wait to hear from you!
                    </p>
                </div>

                <div className="page-main-three-login">
                    <form>
                        <label htmlFor="first-name" className="label">
                            Name <span className="required">(required)</span>
                        </label>
                        <div className="name-fields">
                            <div>
                                <input
                                    type="text"
                                    id="first-name"
                                    name="name" // changed from firstName to name
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
                            name="senderEmail" // changed from email to senderEmail
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
                            name="complain" // changed from message to complain
                            placeholder="Message"
                            rows="4"
                            required
                            value={formData.complain}
                            onChange={handleChange}
                        ></textarea>
                        <div className="send-button">
                            <button onClick={()=>handelComplain()}>Send</button>
                        </div>
                    </form>
                </div>
            </div>

            <footer className="footer">
                <div className="footer-left">
                    <h2>StyloSphere</h2>
                    <p>muhannd, ahmedAli, Moamen, farag and yousef </p>
                    <br/>
                    <p>Made by Muhannd</p>
                    <br/>
                    <p>AI Made by ahmedAli & moamen</p>
                </div>
                <div className="footer-right">
                    <div className="footer-section">
                        <h3>Location</h3>
                        <p>123 Demo Street<br />New York, NY 12345</p>
                    </div>
                    <div className="footer-section">
                        <h3>Contact</h3>
                        <p><a href="mailto:email@example.com">muhanndsayed24@gmail.com</a><br />(555) 555-5555</p>
                    </div>
                </div>
            </footer>
        </div>
    );
}

export default MainPage;
