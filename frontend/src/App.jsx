import React from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import ProductsPage from './components/ProductsPage';
import ProductPage from './components/ProductPage';
import SignIn from './components/signningIn';
import SignUp from './components/signningUp';
import ShoppingCart from './components/cart/cart';
import Header from './components/Header';
import MainPage from './components/MainPage';
import AdminPage from './components/admin/AdminPage';
import Dash from './components/admin/Dash';
import Permission from './components/admin/Permission';
import ProfileAdmin from './components/admin/ProfileAdmin';
import UserProfile from './components/user/UserProfile';
import BestSellersPage from './components/BestSellersPage';
import ProductHandler from './components/admin/ProductHandler';
import Complaints from './components/admin/Complaints';
import LearnMorePage from './components/LearnMorePage';
const AppContent = () => {
    const location = useLocation();
    const isAdminRoute = location.pathname.startsWith('/admin');

    return (
        
        <>
            {!isAdminRoute && <Header />}
            <Routes>
                <Route path="/" element={<MainPage />} />
                <Route path="/learnmore" element={<LearnMorePage />} />
                <Route path="/sale" element={<BestSellersPage />} />
                <Route path="/shop" element={<ProductsPage />} />
                <Route path="/product/:id" element={<ProductPage />} />
                <Route path="/signin" element={<SignIn />} />
                <Route path="/signup" element={<SignUp />} />
                <Route path="/cart" element={<ShoppingCart />} />
                <Route path="/userProfile" element={<UserProfile />} />
                <Route path="/admin" element={<AdminPage />}>
                    <Route path="ProfileAdmin" element={<ProfileAdmin />} />
                    <Route path="Permission" element={<Permission />} />
                    <Route path="Dash" element={<Dash />} />
                    <Route path="ProductHandler" element={<ProductHandler />} />
                    <Route path="Complaints" element={<Complaints />} />
                </Route>
            </Routes>
        </>
    );
};

const App = () => {
    return (
        
        <Router>
            
            <AppContent />
            
        </Router>
      
        
    );
};

export default App;
