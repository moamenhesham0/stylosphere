import React, { createContext, useContext, useState, useEffect } from 'react';

// Create context for the cart
const LocalCartContext = createContext();

// Local Cart Provider Component
export const LocalCartProvider = ({ children }) => {
  // Initialize cart state from localStorage or default to an empty array
  const [cart, setCart] = useState(() => {
    return [] ;
  });

  // Function to update the cart
  const updateLocalCart = (newCartItems) => {
    const updatedCart = { ...cart, cartItems: newCartItems };
    setCart(updatedCart);
  };

  // Function to clear the cart
  const clearLocalCart = () => {
    setCart({ cartItems: [] });
  };
  
  return (
    <LocalCartContext.Provider value={{ cart, updateLocalCart, clearLocalCart}}>
      {children}
    </LocalCartContext.Provider>
  );
};

// Hook to use the local cart context
export const useLocalCart = () => {
  const context = useContext(LocalCartContext);
  if (!context) {
    throw new Error('useLocalCart must be used within a LocalCartProvider');
  }
  return context;
};