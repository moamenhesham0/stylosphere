import React from 'react';
import mainPagepng from '../images/mainPageImg/mainPage.png';
import aboutuspng from '../images/mainPageImg/aboutUs1.png';
import '../style/mainPageStyle/MainPageStyle.css';

function MainPage(){
    return (
        <div className='main-page'>
            <div className="head-main">
                <header >
                    <div className="title-one">
                        <div className="title-box-one title-box-one1">
                            <a id="site-title" href="/" data-animation-role="header-element">StyloSphere</a>
                        </div>


                        <div className="title-box-one title-box-one2">
                            <nav className="title-box-nav">
                                <div className="title-box-nav-item title-box-nav-nPage">
                                    <a href="/new-page" data-animation-role="header-element">
                                        New Page
                                    </a>
                                </div>
                                <div className="title-box-nav-item title-box-nav-shop">
                                    <a href="/shop" data-animation-role="header-element">
                                        Shop
                                    </a>
                                </div>
                                <div className="title-box-nav-item title-box-nav-about">
                                    <a href="/about" data-animation-role="header-element">
                                        About
                                    </a>
                                </div>
                                <div className="title-box-nav-item title-box-nav-cart">
                                    <a href="/cart" data-animation-role="header-element">
                                        Cart
                                    </a>
                                </div>
                            </nav>
                        </div >
                    </div>
                </header>
            </div>
            <div className='page-main-one'>
                <div className='page-main-one-title'>
                    <h1>Unlock Your Marketing Potential Today</h1>
                </div>
                <div className='page-main-one-img'>
                    <img src={mainPagepng} />
                    <p class="overlay-text">Welcome to your marketing journey
                        where creativity meets strategy. We're
                        here to help you navigate the ever-changing
                        landscape, turning possibilities
                        into powerful results.
                        </p>
                </div>
                
            </div>
            <div className='page-main-two'>
                <div className='page-main-two-img'>
                    <img src={aboutuspng} />
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
                    <br /> 
                    here to help your brand thrive with personalized solutions that connect,
                    <br />
                    engage, and inspire.
                    </p>  
                    </div>
                    <div className='page-main-two-button'>
                        <a href="aboutus.html" className="button">LEARN MORE</a>
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
                                        name="firstName"
                                        placeholder="First Name"
                                        required
                                        />
                                    </div>
                                <div>
                                    <input
                                    type="text"
                                    id="last-name"
                                    name="lastName"
                                    placeholder="Last Name"
                                    required
                                    />                                    
                                </div>
                                </div>
                                <label htmlFor="email" className="label">
                                Email <span className="required">(required)</span>
                                </label>
                                <input
                                type="email"
                                id="email"
                                name="email"
                                placeholder="Email"
                                required
                                />

                                <label htmlFor="message" className="label label-message">
                                Message <span className="required">(required)</span>
                                </label>
                                <textarea
                                id="message"
                                name="message"
                                placeholder="Message"
                                rows="4"
                                required
                                ></textarea>
                                <div className="send-button">  
                                    <button >send</button>
                                </div>
                               
                            </form>
                        </div>
                
            </div>  
                <footer className="footer">
                    <div className="footer-left">
                        <h2>Stylo Sohere</h2>
                        <p>Made by <a href="#">Muhannd</a></p>
                    </div>
                    <div className="footer-right">
                        <div className="footer-section">
                            <h3>Location</h3>
                            <p>123 Demo Street<br/>New York, NY 12345</p>
                        </div>
                        <div className="footer-section">
                            <h3>Contact</h3>
                            <p><a href="mailto:email@example.com">muhanndsayed24@gmail.com</a><br/>(555) 555-5555</p>
                        </div>
                    </div>
                </footer>

        </div>
    );
}

export default MainPage;