import { useState } from 'react';
import './Header.css';
import { FiShoppingCart, FiSearch, FiX, FiClock, FiInfo } from 'react-icons/fi';

export default function Header({ totalItems, onCartClick, onHistoryClick, onAboutClick, searchQuery, onSearchChange }) {
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <header className="kiosk-header">
      <div className="header-inner">
        <div className="header-brand">

          <div>
            <h1 className="brand-name">6Seven Store</h1>
            <p className="brand-tag">Your Daily Store</p>
          </div>
        </div>

        <div className="header-actions">
          {/* Desktop search bar */}
          <div className="search-bar desktop-search">
            <FiSearch size={16} className="search-icon" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="search-input"
            />
            {searchQuery && (
              <button className="search-clear" onClick={() => onSearchChange('')}>
                <FiX size={14} />
              </button>
            )}
          </div>

          {/* Mobile search toggle */}
          <button className="icon-btn mobile-search-toggle" onClick={() => setSearchOpen(!searchOpen)}>
            <FiSearch size={18} />
          </button>

          <button className="icon-btn history-btn" onClick={() => onHistoryClick?.()} title="Recent Receipts">
            <FiClock size={18} />
          </button>

          <button className="icon-btn about-btn" onClick={onAboutClick} title="About Developer">
            <FiInfo size={18} />
          </button>

          <button className="icon-btn cart-btn" onClick={onCartClick}>
            <FiShoppingCart size={18} />
            {totalItems > 0 && <span className="cart-badge">{totalItems}</span>}
          </button>
        </div>
      </div>

      {/* Mobile search bar (slides down) */}
      {searchOpen && (
        <div className="mobile-search-bar animate-in">
          <FiSearch size={16} className="search-icon" />
          <input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="search-input"
            autoFocus
          />
          {searchQuery && (
            <button className="search-clear" onClick={() => onSearchChange('')}>
              <FiX size={14} />
            </button>
          )}
        </div>
      )}
    </header>
  );
}
