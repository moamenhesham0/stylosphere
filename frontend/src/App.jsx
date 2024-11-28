import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'; // Import routing components
import ProductsPage from './components/ProductsPage'; // Import the ProductsPage component
import ProductPage from './components/ProductPage'; // Import the ProductPage component

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<ProductsPage />} /> {/* Route to the ProductsPage */}
          <Route path="/product/:id" element={<ProductPage />} /> {/* Route to the ProductPage */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;


