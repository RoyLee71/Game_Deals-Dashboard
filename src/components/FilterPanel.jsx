import React, { useState, useEffect } from 'react';

function FilterPanel({ onPriceFilterChange, onStoreFilterChange, deals }) {
  const [uniqueStores, setUniqueStores] = useState([]);

  useEffect(() => {
    // Extract unique store IDs
    if (deals.length > 0) {
      const stores = [...new Set(deals.map(deal => deal.storeID))];
      setUniqueStores(stores);
    }
  }, [deals]);

  return (
    <div className="filter-panel">
      <div className="filter-group">
        <label>Price Range:</label>
        <select onChange={(e) => onPriceFilterChange(e.target.value)}>
          <option value="all">All Prices</option>
          <option value="under5">Under $5</option>
          <option value="5to15">$5 - $15</option>
          <option value="over15">Over $15</option>
        </select>
      </div>
      
      <div className="filter-group">
        <label>Store:</label>
        <select onChange={(e) => onStoreFilterChange(e.target.value)}>
          <option value="all">All Stores</option>
          {uniqueStores.map(storeID => (
            <option key={storeID} value={storeID}>
              Store {storeID}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}

export default FilterPanel;