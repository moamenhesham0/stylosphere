import React, { createContext, useContext, useState, useEffect } from 'react';

// Create context for the cart
const LocalCartContext = createContext();

// Local Cart Provider Component
export const LocalCartProvider = ({ children }) => {
  // Initialize cart state from localStorage or as an empty array
  const [cart, setCart] = useState(() => {
    const storedCart = localStorage.getItem('cart');
    return storedCart ? JSON.parse(storedCart) : [];
  });

  // Sync cart state with localStorage
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  // Function to add or update an item in the cart
  const updateLocalCart = (newCartItem) => {
    setCart((prevCart) => {
      // Check if the item already exists in the cart
      const existingItemIndex = prevCart.findIndex(
        (item) =>
          item.productId === newCartItem.productId &&
          item.productSize === newCartItem.productSize &&
          item.productColor === newCartItem.productColor
      );

      if (existingItemIndex !== -1) {
        // Update the quantity of the existing item
        const updatedCart = [...prevCart];
        updatedCart[existingItemIndex] = {
          ...updatedCart[existingItemIndex],
          quantity: updatedCart[existingItemIndex].quantity + newCartItem.quantity,
        };
        return updatedCart;
      }

      // Add the new item to the cart
      return [...prevCart, newCartItem];
    });
  };

  // Function to clear the cart
  const clearLocalCart = () => {
    setCart([]);
    localStorage.removeItem('cart');
  };

  return (
    <LocalCartContext.Provider value={{ cart, updateLocalCart, clearLocalCart }}>
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
