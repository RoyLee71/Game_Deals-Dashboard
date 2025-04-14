import React from 'react';
import { Link } from 'react-router-dom';

function DealsTable({ deals, storeNames }) {
  return (
    <div className="deals-table-container">
      <h2>Current Game Deals</h2>
      <p className="results-count">Showing {deals.length} deals</p>
      
      <div className="deals-table">
        <div className="table-header">
          <div className="table-cell">Game</div>
          <div className="table-cell">Sale Price</div>
          <div className="table-cell">Original Price</div>
          <div className="table-cell">Savings</div>
          <div className="table-cell">Store</div>
          <div className="table-cell">Rating</div>
        </div>
        
        {deals.map((deal) => (
          <Link to={`/deal/${deal.dealID}`} key={deal.dealID} className="table-row-link">
            <div className="table-row">
              <div className="table-cell game-title">
                <img 
                  src={deal.thumb} 
                  alt={deal.title} 
                  className="game-thumbnail" 
                />
                <span>{deal.title}</span>
              </div>
              <div className="table-cell sale-price">${deal.salePrice}</div>
              <div className="table-cell original-price">${deal.normalPrice}</div>
              <div className="table-cell savings">
                {deal.savings}%
              </div>
              <div className="table-cell store-id">
                {storeNames[deal.storeID] || `Store ${deal.storeID}`}
              </div>
              <div className="table-cell">
                {deal.steamRatingPercent ? `${deal.steamRatingPercent}%` : 'N/A'}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default DealsTable;