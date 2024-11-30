import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import ProductsPage from './components/ProductsPage'; // Import ProductsPage
import ProductPage from './components/ProductPage';
import SignIn from './components/signningIn';
import SignUp from './components/signningUp';
import ShoppingCart from './components/cart';
import Header from './components/Header';
import MainPage from './components/MainPage';
import AdminPage from './components/admin/AdminPage';


const App = () => {
    return (
        <Router>
            
            <Header />
            <Routes>
                <Route path="/" element={<MainPage />} />
                <Route path="/shop" element={<ProductsPage />} /> {/* Add the /shop route */}
                <Route path="/product/:id" element={<ProductPage />} />
                <Route path="/signin" element={<SignIn />} />
                <Route path="/signup" element={<SignUp />} />
                <Route path="/cart" element={<ShoppingCart />} />
                <Route path="/admin" element={<AdminPage/>} />
                
            </Routes>
            
        </Router>
    );
};

export default App;




