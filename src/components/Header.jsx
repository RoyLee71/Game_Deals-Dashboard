import React from 'react';
import { Link } from 'react-router-dom';

function Header({ showHomeLink = false }) {
  return (
    <header className="header">
      <h1>Game Deals Dashboard</h1>
      <p>Find the best gaming deals right here!</p>
      {showHomeLink && (
        <Link to="/" className="home-link">
          <div className="home-icon">🏠</div>Back to Dashboard
        </Link>
      )}
    </header>
  );
}

export default Header;