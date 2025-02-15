// src/components/layout/Footer/Footer.jsx
import React from 'react';
import './Footer.css';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="main-footer">
      <div className="content-container">
        <p className="copyright">COPYRIGHT © {currentYear} ALL RIGHTS RESERVED BY SCC</p>
      </div>
    </footer>
  );
};

export default Footer;