import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import StatisticsPanel from './components/StatisticsPanel';
import DealsTable from './components/DealsTable';
import SearchBar from './components/SearchBar';
import FilterPanel from './components/FilterPanel';
import LoadingSpinner from './components/LoadingSpinner';

import './App.css'

function App() {
  const [deals, setDeals] = useState([]);
  const [filteredDeals, setFilteredDeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [priceFilter, setPriceFilter] = useState('all');
  const [storeFilter, setStoreFilter] = useState('all');
  const [statistics, setStatistics] = useState({
    totalDeals: 0,
    averageSavings: 0,
    bestDeal: null,
    storeDistribution: {}
  });
  
  // Fetch deals from the CheapShark API
  useEffect(() => {
    setTimeout(() => {
      const fetchDeals = async () => {
        try {
          setLoading(true);
          const response = await fetch('https://www.cheapshark.com/api/1.0/deals?pageSize=60');
          if (!response.ok) {
            throw new Error('Failed to fetch data');
          }
          const data = await response.json();
          
          // Enrich data with additional information
          const enrichedData = data.map((deal) => {
            return {
              ...deal,
              savings: parseFloat(deal.savings).toFixed(2),
              salePrice: parseFloat(deal.salePrice).toFixed(2),
              normalPrice: parseFloat(deal.normalPrice).toFixed(2),
              percentSavings: ((parseFloat(deal.savings) / 100)).toFixed(2)
            };
          });
          
          setDeals(enrichedData);
          setFilteredDeals(enrichedData);
          calculateStatistics(enrichedData);
          setLoading(false);
        } catch (error) {
          setError(error.message);
          setLoading(false);
        }
      };
      
      fetchDeals();
    }, 2000); // Simulate loading delay
  }, []);
  
  // Calculate statistics from the data
  const calculateStatistics = (dealData) => {
    // Total deals
    const totalDeals = dealData.length;
    
    // Average savings percentage
    const totalSavings = dealData.reduce((sum, deal) => sum + parseFloat(deal.savings), 0);
    const averageSavings = (totalSavings / totalDeals).toFixed(2);
    
    // Find the best deal (highest savings percentage)
    const bestDeal = dealData.reduce((prev, current) => 
      parseFloat(prev.savings) > parseFloat(current.savings) ? prev : current
    );
    
    // Store distribution
    const storeDistribution = dealData.reduce((acc, deal) => {
      acc[deal.storeID] = (acc[deal.storeID] || 0) + 1;
      return acc;
    }, {});
    
    setStatistics({
      totalDeals,
      averageSavings,
      bestDeal,
      storeDistribution
    });
  };
  
  // Filter deals based on search term and filters
  useEffect(() => {
    const applyFilters = () => {
      let results = deals;
      
      // Apply search filter
      if (searchTerm) {
        results = results.filter(deal => 
          deal.title.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }
      
      // Apply price filter
      if (priceFilter !== 'all') {
        switch(priceFilter) {
          case 'under5':
            results = results.filter(deal => parseFloat(deal.salePrice) < 5);
            break;
          case '5to15':
            results = results.filter(deal => 
              parseFloat(deal.salePrice) >= 5 && parseFloat(deal.salePrice) <= 15
            );
            break;
          case 'over15':
            results = results.filter(deal => parseFloat(deal.salePrice) > 15);
            break;
          default:
            break;
        }
      }
      
      // Apply store filter
      if (storeFilter !== 'all') {
        results = results.filter(deal => deal.storeID === storeFilter);
      }
      
      setFilteredDeals(results);
    };
    
    applyFilters();
  }, [searchTerm, priceFilter, storeFilter, deals]);
  
  // Handle search input change
  const handleSearchChange = (term) => {
    setSearchTerm(term);
  };
  
  // Handle price filter change
  const handlePriceFilterChange = (filter) => {
    setPriceFilter(filter);
  };
  
  // Handle store filter change
  const handleStoreFilterChange = (store) => {
    setStoreFilter(store);
  };
  
  if (error) {
    return <div className="error-message">Error: {error}</div>;
  }
  
  return (
    <div className="app">
      <Header />
      
      <div className="dashboard-container">
        <div className="search-filter-container">
          <SearchBar onSearchChange={handleSearchChange} />
          <FilterPanel 
            onPriceFilterChange={handlePriceFilterChange} 
            onStoreFilterChange={handleStoreFilterChange}
            deals={deals}
          />
        </div>
        
        {loading ? (
          <LoadingSpinner />
        ) : (
          <>
            <StatisticsPanel statistics={statistics} />
            <DealsTable deals={filteredDeals} />
            {filteredDeals.length === 0 && (
              <div className="no-results">No deals found matching your criteria</div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default App
