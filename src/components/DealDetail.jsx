import React from 'react';
import { useParams } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

function DealDetail({ deals, storeNames }) {
  const { dealId } = useParams();

  if (!deals || deals.length === 0) {
    return <div>Loading deal details...</div>;
  }
  console.log("Deals:", deals);
  
  // Find the selected deal using the URL parameter
//   const decodedDeals = deals.map(deal => ({
//     ...deal,
//     decodedDealID: decodeURIComponent(deal.dealID),
//   }));
//   console.log("Decoded Deals:", decodedDeals);
  const selectedDeal = deals.find(deal => decodeURIComponent(deal.dealID) === dealId); //ALL THESE HOURS JUST TO FIGURE OUT TO DECODE URI COMPONENT!!!! ARGHHH
//   const selectedDeal = deals.find(deal => deal.dealID.toString() == dealId);
//   const selectedDeal = deals.filter(deal => deal.dealID.toString() === dealId)[0];
  console.log("Selected Deal:", selectedDeal);
//   console.log("All Deal IDs:", deals.map(d => d.dealID));
  console.log("Looking for Deal ID:", dealId);

  
  
//   If deal not found, redirect to dashboard
  if (!selectedDeal) {
    // return <Navigate to="/" />;
    return <div>Deal not found</div>;
  } 
  
  // Prepare price history data for chart
  const priceData = [
    {
      name: 'Current Sale',
      price: parseFloat(selectedDeal.salePrice)
    },
    {
      name: 'Normal Price',
      price: parseFloat(selectedDeal.normalPrice)
    }
  ];
  
  // Calculate additional stats
  const priceDifference = (parseFloat(selectedDeal.normalPrice) - parseFloat(selectedDeal.salePrice)).toFixed(2);
  
  return (
    <div className="deal-detail-container">
      <div className="deal-header">
        <img 
          src={selectedDeal.thumb} 
          alt={selectedDeal.title} 
          className="deal-image" 
        />
        <div className="deal-title-section">
          <h2>{selectedDeal.title}</h2>
          <div className="price-tag">
            <span className="current-price">${selectedDeal.salePrice}</span>
            <span className="original-price">${selectedDeal.normalPrice}</span>
            <span className="savings-badge">{selectedDeal.savings}% OFF</span>
          </div>
        </div>
      </div>
      
      <div className="deal-details-grid">
        <div className="detail-card">
          <h3>Deal Information</h3>
          <table className="detail-table">
            <tbody>
              <tr>
                <td>Store:</td>
                <td>{storeNames[selectedDeal.storeID] || `Store ${selectedDeal.storeID}`}</td>
              </tr>
              <tr>
                <td>Deal Rating:</td>
                <td>{selectedDeal.dealRating || 'N/A'}</td>
              </tr>
              <tr>
                <td>You Save:</td>
                <td>${priceDifference}</td>
              </tr>
              <tr>
                <td>Steam Rating:</td>
                <td>{selectedDeal.steamRatingPercent ? `${selectedDeal.steamRatingPercent}% (${selectedDeal.steamRatingText || 'N/A'})` : 'N/A'}</td>
              </tr>
              <tr>
                <td>Release Date:</td>
                <td>{selectedDeal.releaseDate ? new Date(selectedDeal.releaseDate * 1000).toDateString() : 'Unknown'}</td>
              </tr>
              <tr>
                <td>Last Change:</td>
                <td>{selectedDeal.lastChange ? new Date(selectedDeal.lastChange * 1000).toDateString() : 'Unknown'}</td>
              </tr>
              <tr>
                <td>Deal ID:</td>
                <td>{selectedDeal.dealID}</td>
              </tr>
              <tr>
                <td>Game ID:</td>
                <td>{selectedDeal.gameID}</td>
              </tr>
            </tbody>
          </table>
        </div>
        
        <div className="detail-card">
          <h3>Price Comparison</h3>
          <div className="price-chart">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={priceData}
                margin={{
                  top: 20,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis label={{ value: 'Price ($)', angle: -90, position: 'insideLeft' }} />
                <Tooltip formatter={(value) => ['$' + value, 'Price']} />
                <Legend />
                <Bar dataKey="price" name="Price" fill="#3498db" />
              </BarChart>
            </ResponsiveContainer>
          </div>
          
          {selectedDeal.metacriticLink && (
            <div className="external-links">
              <a 
                href={`https://www.metacritic.com${selectedDeal.metacriticLink}`} 
                target="_blank" 
                rel="noopener noreferrer"
                className="metacritic-link"
              >
                View on Metacritic
              </a>
            </div>
          )}

          <a 
            href={`https://www.cheapshark.com/redirect?dealID=${selectedDeal.dealID}`} 
            target="_blank" 
            rel="noopener noreferrer"
            className="buy-now-button"
          >
            Go To Store
          </a>
        </div>
      </div>
    </div>
  );
}

export default DealDetail;
