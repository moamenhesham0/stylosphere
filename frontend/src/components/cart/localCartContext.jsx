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
  const updateLocalCart = (newCartItem, MAX_QUANTITY) => {
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
        let finalQuantity;
        const combinedQuantity = updatedCart[existingItemIndex].quantity + newCartItem.quantity;

        if (combinedQuantity > MAX_QUANTITY) {
          alert(`You've reached the maximum quantity limit of ${MAX_QUANTITY} for this item in your cart`);
          finalQuantity = MAX_QUANTITY;
        } else {
          finalQuantity = combinedQuantity;
        }
        updatedCart[existingItemIndex] = {
          ...updatedCart[existingItemIndex],
          quantity: finalQuantity,
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

  // Function to delete an item from the cart
  const deleteCartItem = (productId, productSize, productColor) => {
    setCart((prevCart) => {
      // Filter out the item based on all features (productId, productSize, productColor)
      const updatedCart = prevCart.filter(
        (item) =>
          item.productId !== productId ||
          item.productSize !== productSize ||
          item.productColor !== productColor
      );
      return updatedCart;
    });
  };

  // Function to update the quantity of an existing item
  const updateItemQuantity = (productId, productSize, productColor, newQuantity, products) => {
    setCart((prevCart) => {
      const updatedCart = prevCart.map((item) => {
        if (
          item.productId === productId &&
          item.productSize === productSize &&
          item.productColor === productColor
        ) {
          const product = products[productId];
          const MAX_QUANTITY = product ? product.quantity : 0;
          
          

          // Update the quantity ensuring it does not exceed the original quantity
          const finalQuantity = newQuantity > MAX_QUANTITY ? MAX_QUANTITY : newQuantity;
          return { ...item, quantity: finalQuantity };
        }
        return item;
      });
      return updatedCart;
    });
  };

  return (
    <LocalCartContext.Provider value={{ cart, updateLocalCart, clearLocalCart, updateItemQuantity, deleteCartItem }}>
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
