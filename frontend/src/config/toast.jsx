// File: /frontend/src/config/toast.js
// Toast notification configuration

import { toast } from 'react-toastify';
import { FaCheckCircle, FaInfoCircle, FaExclamationTriangle, FaTimesCircle } from 'react-icons/fa';
import React from 'react';

// Default toast configuration
export const toastConfig = {
  position: "bottom-right",
  autoClose: 5000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  progress: undefined,
  theme: "dark",
  
  // Custom styling
  style: {
    borderRadius: '8px',
    backdropFilter: 'blur(10px)',
    background: 'rgba(40, 40, 40, 0.85)',
    border: '1px solid rgba(80, 80, 80, 0.5)',
    boxShadow: '0 4px 15px rgba(0, 0, 0, 0.3)'
  }
};

// Custom toast components with icons
const ToastContent = ({ icon: Icon, message, color }) => (
  <div className="toast-content">
    <div className="toast-icon" style={{ color }}>
      <Icon size={20} />
    </div>
    <div className="toast-message">
      {message}
    </div>
  </div>
);

// Enhanced toast functions
export const showToast = {
  success: (message) => toast.success(
    <ToastContent 
      icon={FaCheckCircle} 
      message={message} 
      color="#1ED760" 
    />, 
    toastConfig
  ),
  
  error: (message) => toast.error(
    <ToastContent 
      icon={FaTimesCircle} 
      message={message} 
      color="#F15A5A" 
    />, 
    toastConfig
  ),
  
  info: (message) => toast.info(
    <ToastContent 
      icon={FaInfoCircle} 
      message={message} 
      color="#2D9CDB" 
    />, 
    toastConfig
  ),
  
  warning: (message) => toast.warning(
    <ToastContent 
      icon={FaExclamationTriangle} 
      message={message} 
      color="#F7B500" 
    />, 
    toastConfig
  )
};

// CSS for the toast content can be added to the main.scss file