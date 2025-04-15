import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import './App.css';
import Header from './components/Header';
import StatisticsPanel from './components/StatisticsPanel';
import DealsTable from './components/DealsTable';
import SearchBar from './components/SearchBar';
import FilterPanel from './components/FilterPanel';
import LoadingSpinner from './components/LoadingSpinner';
import DealDetail from './components/DealDetail'; // New component for detail view
import ChartSection from './components/ChartSection'; // New component for charts

// Main App component
function App() {
  const [deals, setDeals] = useState([]);
  const [filteredDeals, setFilteredDeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [priceFilter, setPriceFilter] = useState('all');
  const [storeFilter, setStoreFilter] = useState('all');
  const [statistics, setStatistics] = useState({
    totalDeals: 0,
    averageSavings: 0,
    bestDeal: null,
    storeDistribution: {},
    priceRanges: {}, // Added for chart data
    savingsDistribution: {} // Added for chart data
  });
  const [storeNames, setStoreNames] = useState({}); // Added to store names of stores
  
  // Fetch store information
  useEffect(() => {
    const fetchStores = async () => {
      try {
        const response = await fetch('https://www.cheapshark.com/api/1.0/stores');
        if (!response.ok) {
          throw new Error('Failed to fetch store data');
        }
        const storeData = await response.json();
        
        // Create a mapping of storeID to store name
        const storeMap = {};
        storeData.forEach(store => {
          storeMap[store.storeID] = store.storeName;
        });
        
        setStoreNames(storeMap);
      } catch (error) {
        console.error('Error fetching store data:', error);
      }
    };
    
    fetchStores();
  }, []);
  
  // Fetch deals from the CheapShark API
  useEffect(() => {
    const fetchDeals = async () => {
      try {
        setLoading(true);
        // Increased page size to get more data for better visualization
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
  }, []);
  
  // Calculate statistics from the data - Enhanced for chart data
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
    
    // NEW: Price range distribution for chart
    const priceRanges = {
      'Under $5': 0,
      '$5 - $10': 0,
      '$10 - $20': 0,
      '$20 - $30': 0,
      '$30 - $50': 0,
      'Over $50': 0
    };
    
    dealData.forEach(deal => {
      const price = parseFloat(deal.salePrice);
      if (price < 5) priceRanges['Under $5']++;
      else if (price < 10) priceRanges['$5 - $10']++;
      else if (price < 20) priceRanges['$10 - $20']++;
      else if (price < 30) priceRanges['$20 - $30']++;
      else if (price < 50) priceRanges['$30 - $50']++;
      else priceRanges['Over $50']++;
    });
    
    // NEW: Savings distribution for chart

    const savingsDistribution = {
      '0-20%': 0,
      '21-40%': 0,
      '41-60%': 0,
      '61-80%': 0,
      '81-100%': 0
    };
    
    dealData.forEach(deal => {
      const savingsPercent = parseFloat(deal.savings);
      if (savingsPercent <= 20) savingsDistribution['0-20%']++;
      else if (savingsPercent <= 40) savingsDistribution['21-40%']++;
      else if (savingsPercent <= 60) savingsDistribution['41-60%']++;
      else if (savingsPercent <= 80) savingsDistribution['61-80%']++;
      else savingsDistribution['81-100%']++;
    });
    
    setStatistics({
      totalDeals,
      averageSavings,
      bestDeal,
      storeDistribution,
      priceRanges,
      savingsDistribution
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
  
  // Define Dashboard component to keep App.js clean
  // const Dashboard = () => (
  //   <div className="dashboard-container">
  //     <div className="search-filter-container">
  //       <SearchBar onSearchChange={handleSearchChange} />
  //       <FilterPanel 
  //         onPriceFilterChange={handlePriceFilterChange} 
  //         onStoreFilterChange={handleStoreFilterChange}
  //         deals={deals}
  //         storeNames={storeNames}
  //         priceFilter={priceFilter}
  //         storeFilter={storeFilter} 
  //       />
  //     </div>
      
  //     {loading ? (
  //       <LoadingSpinner />
  //     ) : (
  //       <>
  //         <StatisticsPanel statistics={statistics} storeNames={storeNames} />
          
  //         {/* NEW: Chart Section */}
  //         <ChartSection 
  //           priceRanges={statistics.priceRanges} 
  //           savingsDistribution={statistics.savingsDistribution}
  //           storeDistribution={statistics.storeDistribution}
  //           storeNames={storeNames}
  //         />
          
  //         <DealsTable 
  //           deals={filteredDeals} 
  //           storeNames={storeNames}
  //         />
          
  //         {filteredDeals.length === 0 && (
  //           <div className="no-results">No deals found matching your criteria</div>
  //         )}
  //       </>
  //     )}
  //   </div>
  // );
  

  if (error) {
    return <div className="error-message">Error: {error}</div>;
  }

  return (
    <Router>
      <div className="app">
        <Routes>
          <Route path="/" element={
            <>
              <Header />
              <div className="dashboard-container">
                <div className="search-filter-container">
                  <SearchBar onSearchChange={handleSearchChange} />
                  <FilterPanel 
                    onPriceFilterChange={handlePriceFilterChange} 
                    onStoreFilterChange={handleStoreFilterChange}
                    deals={deals}
                    storeNames={storeNames}
                    // priceFilter={priceFilter}
                    // storeFilter={storeFilter} 
                  />
                </div>
              
                {loading ? (
                  <LoadingSpinner />
                ) : (
                  <>
                    <StatisticsPanel statistics={statistics} storeNames={storeNames} />
                    
                  
                    <ChartSection 
                      priceRanges={statistics.priceRanges} 
                      savingsDistribution={statistics.savingsDistribution}
                      storeDistribution={statistics.storeDistribution}
                      storeNames={storeNames}
                    />
                    
                    <DealsTable 
                      deals={filteredDeals} 
                      storeNames={storeNames}
                    />
                    
                    {filteredDeals.length === 0 && (
                      <div className="no-results">No deals found matching your criteria</div>
                    )}
                  </>
                )}
              </div>
            </>
          } />
          <Route path="/deal/:dealId" element={
            <>
              <Header showHomeLink={true} />
              {loading ? <LoadingSpinner /> : <DealDetail deals={deals} storeNames={storeNames} />}
            </>
          } />
        </Routes>
      </div>
    </Router>
  );


}

export default App;

//   if (error) {
//     return <div className="error-message">Error: {error}</div>;
//   }
  
//   return (
//     <div className="app">
//       <Header />
      
//       <div className="dashboard-container">
//         <div className="search-filter-container">
//           <SearchBar onSearchChange={handleSearchChange} />
//           <FilterPanel 
//             onPriceFilterChange={handlePriceFilterChange} 
//             onStoreFilterChange={handleStoreFilterChange}
//             deals={deals}
//           />
//         </div>
        
//         {loading ? (
//           <LoadingSpinner />
//         ) : (
//           <>
//             <StatisticsPanel statistics={statistics} />
//             <DealsTable deals={filteredDeals} />
//             {filteredDeals.length === 0 && (
//               <div className="no-results">No deals found matching your criteria</div>
//             )}
//           </>
//         )}
//       </div>
//     </div>
//   );
// }

    

