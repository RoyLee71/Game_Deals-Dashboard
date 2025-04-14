import React from 'react';
import { 
  BarChart, Bar, PieChart, Pie, XAxis, YAxis, 
  CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  Cell
} from 'recharts';

function ChartSection({ priceRanges, savingsDistribution, storeDistribution, storeNames }) {
  // Convert price ranges object to array for chart
  const priceData = Object.entries(priceRanges).map(([range, count]) => ({
    name: range,
    count
  }));
  
  // Convert savings distribution to array for chart
  const savingsData = Object.entries(savingsDistribution).map(([range, count]) => ({
    name: range,
    count
  }));
  
  // Convert store distribution to array for chart
  const storeData = Object.entries(storeDistribution).map(([storeId, count]) => ({
    name: storeNames[storeId] || `Store ${storeId}`,
    count
  }));
  
  // Sort store data by count for better visualization
  storeData.sort((a, b) => b.count - a.count);
  
  // Top 5 stores for better visualization
  const topStores = storeData.slice(0, 5);
  
  // Colors for pie chart
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#83a6ed'];
  
  return (
    <div className="chart-section">
      <h2>Deal Analytics</h2>
      
      <div className="charts-container">
        <div className="chart-card">
          <h3>Price Distribution</h3>
          <div className="chart-description">
            Distribution of game prices across different price ranges
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={priceData}
              margin={{
                top: 20,
                right: 30,
                left: 20,
                bottom: 70,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="name" 
                angle={-45} 
                textAnchor="end"
                height={70}
              />
              <YAxis />
              <Tooltip formatter={(value, name) => [value, 'Number of Games']} />
              <Legend />
              <Bar dataKey="count" name="Number of Games" fill="#3498db" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        
        <div className="chart-card">
          <h3>Savings Distribution</h3>
          <div className="chart-description">
            Distribution of discount percentages across all deals
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={savingsData}
                cx="50%"
                cy="50%"
                labelLine={true}
                outerRadius={54}
                fill="#8884d8"
                dataKey="count"
                nameKey="name"
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
              >
                {savingsData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => [value, 'Count']} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
        
        <div className="chart-card">
          <h3>Top 5 Stores</h3>
          <div className="chart-description">
            Stores with the most active deals
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={topStores}
              margin={{
                top: 20,
                right: 30,
                left: 20,
                bottom: 70,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="name" 
                angle={-45} 
                textAnchor="end"
                height={70}
              />
              <YAxis />
              <Tooltip formatter={(value) => [value, 'Number of Deals']} />
              <Legend />
              <Bar dataKey="count" name="Number of Deals" fill="#27ae60" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

export default ChartSection;