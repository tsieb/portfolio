// File: /frontend/src/main.jsx
// Main entry point for the React application

import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { AuthProvider } from './features/auth/context/AuthContext';
import { SpotifyProvider } from './features/spotify/context/SpotifyContext';
import { ToastContainer } from 'react-toastify';

// Import global styles
import './assets/styles/main.scss';
import 'react-toastify/dist/ReactToastify.css';

// Toast container configuration
const toastContainerProps = {
  position: "bottom-right",
  autoClose: 5000,
  hideProgressBar: false,
  newestOnTop: true,
  closeOnClick: true,
  rtl: false,
  pauseOnFocusLoss: true,
  draggable: true,
  pauseOnHover: true,
  theme: "dark"
};

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <SpotifyProvider>
          <App />
          <ToastContainer {...toastContainerProps} />
        </SpotifyProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>,
);