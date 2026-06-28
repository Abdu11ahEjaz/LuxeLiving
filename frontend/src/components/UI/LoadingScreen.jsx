import React from 'react';
import NavLogo from '../../assets/images/Nav_logo.png';
import './LoadingScreen.css';

export const LoadingScreen = () => {
  return (
    <div className="loading-container">
      <div className="logo-wrapper">
        <img 
          src={NavLogo} 
          alt="Loading" 
          className="loading-logo"
        />
      </div>
    </div>
  );
};

export default LoadingScreen;
