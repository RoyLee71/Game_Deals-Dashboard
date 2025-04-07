import React from 'react';

function StatisticsPanel({ statistics }) {
  const { totalDeals, averageSavings, bestDeal } = statistics;
  
  return (
    <div className="statistics-panel">
      <h2>Deal Insights</h2>
      <div className="statistics-grid">
        <div className="stat-card">
          <h3>Total Active Deals</h3>
          <p className="stat-value">{totalDeals}</p>
        </div>
        
        <div className="stat-card">
          <h3>Average Discount</h3>
          <p className="stat-value">{averageSavings}%</p>
        </div>
        
        <div className="stat-card">
          <h3>Best Current Deal</h3>
          <p className="stat-value">{bestDeal?.title}</p>
          <p className="stat-detail">Save {bestDeal?.savings}%</p>
          <p className="stat-price">
            <span className="original-price">${bestDeal?.normalPrice}</span>
            <span className="sale-price">${bestDeal?.salePrice}</span>
          </p>
        </div>
      </div>
    </div>
  );
}

export default StatisticsPanel;