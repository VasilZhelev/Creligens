// src/App.jsx
import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import Navigation from '../components/layout/Navigation/Navigation';
import Footer from '../components/layout/Footer/Footer';
import SearchInput from '../components/ui/SearchInput/SearchInput';
import WhatWeDo from '../components/sections/WhatWeDo/WhatWeDo';
import Statistics from '../components/sections/Statistics/Statistics';
import './App.css';

const App = () => {
  const handleSearch = (value) => {
    console.log('Searching:', value);
    // Handle search logic here
  };

  return (
    <Router>
      <div className="app">
        <Navigation />
        <main className="main-content">
          <h1>SMART CAR CHECK</h1>
          <SearchInput onSearch={handleSearch} />
          <WhatWeDo />
          <Statistics />
        </main>
        <Footer />
      </div>
    </Router>
  );
};

export default App;