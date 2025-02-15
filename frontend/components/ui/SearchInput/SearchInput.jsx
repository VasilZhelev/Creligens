import React from 'react';
import './SearchInput.css';

const SearchInput = ({ onSearch, placeholder = "Paste your link here" }) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    const value = e.target.elements.search.value;
    if (onSearch) onSearch(value);
  };

  return (
    <form className="search-container" onSubmit={handleSubmit}>
      <input 
        type="text" 
        name="search"
        className="search-input"
        placeholder={placeholder}
      />
      <button type="button" className="info-button" title="More Information">
        i
      </button>
    </form>
  );
};

export default SearchInput;