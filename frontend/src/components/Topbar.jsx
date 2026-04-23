import React from 'react';
import './Topbar.css'; // Import the new CSS file
import { useFilterStore } from '../store/useFilterStore';

export default function Topbar() {
  const { selectedRegion, setRegion, resetFilters } = useFilterStore();

  return (
    <div className="topbar">
      <div className="topbar-container">
        
        {/* Left Side: Brand / Title */}
        <div className="brand-section">
          <h1 className="brand-title">Global Parameters</h1>
        </div>

        {/* Right Side: Filters */}
        <div className="filters-group">
          
          {/* Region Dropdown */}
          <div className="filter-item">
            <label className="filter-label">Region</label>
            <select 
              value={selectedRegion}
              onChange={(e) => setRegion(e.target.value)}
              className="filter-select"
            >
              <option value="Global">Global Ocean</option>
              <option value="Indo-Pacific">Indo-Pacific</option>
              <option value="Caribbean">Caribbean Sea</option>
              <option value="North Atlantic">North Atlantic</option>
            </select>
          </div>

          {/* Reset Button */}
          <button onClick={resetFilters} className="reset-btn">
            Reset
          </button>
          
        </div>
      </div>
    </div>
  );
}