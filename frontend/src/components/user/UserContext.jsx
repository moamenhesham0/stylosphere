import React, { createContext, useContext, useState, useEffect } from 'react';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  // Initialize user state from localStorage (if available)
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) : { email: '', name: '', type: '', admin_level: '', userStatus: false, image: '', userId: -1 };
  });

  // Update user data and store it in localStorage
  const updateUser = (details) => {
    const updatedUser = {
      ...user,
      ...details,
    };
    setUser(updatedUser);
    // Store the updated user information in localStorage
    localStorage.setItem('user', JSON.stringify(updatedUser));
  };

  return (
    <UserContext.Provider value={{ user, updateUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};





