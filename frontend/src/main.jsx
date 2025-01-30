import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import { UserProvider } from './components/user/UserContext';
import { LocalCartProvider } from './components/cart/localCartContext';
createRoot(document.getElementById('root')).render(
  
  <StrictMode>
    <UserProvider>
      <LocalCartProvider>
    <App />
    </LocalCartProvider>
    </UserProvider>
  </StrictMode>
  ,
)
