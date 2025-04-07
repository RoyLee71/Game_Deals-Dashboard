import React from 'react';

function SearchBar({ onSearchChange }) {
  const handleInputChange = (e) => {
    onSearchChange(e.target.value);
  };
  
  return (
    <div className="search-bar">
      <input
        type="text"
        placeholder="Search for games..."
        onChange={handleInputChange}
      />
      <i className="search-icon">🔍</i>
    </div>
  );
}

export default SearchBar;