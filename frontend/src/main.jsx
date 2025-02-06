import { StrictMode, useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import { UserProvider } from './components/user/UserContext';
import { LocalCartProvider } from './components/cart/localCartContext';
import React from "react";
import ReactDOM from "react-dom/client";

const Main = () => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  useEffect(() => {
    document.documentElement.style.overflowY = isFilterOpen ? 'hidden' : 'auto';
    document.documentElement.style.overflowX = 'hidden';

  }, [isFilterOpen]);

  return (
    <StrictMode>
      <UserProvider>
        <LocalCartProvider>
          <App isFilterOpen={isFilterOpen} setIsFilterOpen={setIsFilterOpen} />
        </LocalCartProvider>
      </UserProvider>
    </StrictMode>
  );
};

createRoot(document.getElementById('root')).render(<Main />);
