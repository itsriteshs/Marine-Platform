// src/pages/Taxonomy.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Taxonomy.css";

const Taxonomy = () => {
  const navigate = useNavigate();
  
  // 1. Filter States (What the user is typing/selecting)
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  // 2. Data States (What comes back from the backend)
  const [speciesList, setSpeciesList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 3. The Fetching Logic (Runs on load, and whenever filters change)
  useEffect(() => {
    const fetchSpecies = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // Build the query string dynamically based on active filters
        const params = new URLSearchParams();
        if (searchTerm) params.append("search", searchTerm);
        if (statusFilter) params.append("status", statusFilter);

        // Call your FastAPI backend
        const url = `http://localhost:8000/api/species?${params.toString()}`;
        const response = await fetch(url);
        
        if (!response.ok) {
          throw new Error(`Failed to fetch: ${response.statusText}`);
        }
        
        const data = await response.json();
        setSpeciesList(data);
      } catch (err) {
        console.error("API Error:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    // Note: In a massive production app, you might "debounce" this call 
    // so it doesn't search on every single keystroke, but this is perfect for now.
    fetchSpecies();
  }, [searchTerm, statusFilter]); // <-- React watches these two variables

  return (
    <div className="taxonomy-page">
      <div className="taxonomy-container">
        
        {/* HEADER & SEARCH */}
        <div className="taxonomy-header">
          <h1 className="taxonomy-title">Marine Species Catalog</h1>
          <input 
            type="text" 
            placeholder="Search species..." 
            className="search-input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="taxonomy-layout">
          
          {/* SIDEBAR FILTERS */}
          <div className="filter-sidebar">
            <h3>Filters</h3>
            <div className="filter-group">
              <label>Conservation Status</label>
              <select className="filter-select" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                <option value="">All Statuses</option>
                <option value="LC">Least Concern (LC)</option>
                <option value="VU">Vulnerable (VU)</option>
                <option value="EN">Endangered (EN)</option>
                <option value="CR">Critically Endangered (CR)</option>
              </select>
            </div>
            <div className="filter-group">
              <label>Family (Mock)</label>
              <select className="filter-select" disabled><option>All Families</option></select>
            </div>
          </div>

          {/* GRID AREA */}
          <div className="species-grid" style={{ display: 'block', flexGrow: 1 }}>
            
            {/* Loading State */}
            {loading && (
              <div style={{ textAlign: 'center', padding: '40px', color: '#64748b' }}>
                Fetching marine data...
              </div>
            )}

            {/* Error State */}
            {error && (
              <div style={{ textAlign: 'center', padding: '40px', color: '#ef4444', backgroundColor: '#fee2e2', borderRadius: '12px' }}>
                Error: {error}
              </div>
            )}

            {/* Empty State (No results found) */}
            {!loading && !error && speciesList.length === 0 && (
              <div style={{ textAlign: 'center', padding: '60px', color: '#94a3b8', border: '2px dashed #e2e8f0', borderRadius: '16px' }}>
                No species found matching your criteria.
              </div>
            )}

            {/* The Actual Grid */}
            {!loading && !error && speciesList.length > 0 && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '24px' }}>
                {speciesList.map((sp) => (
                  <div key={sp.species_id} onClick={() => navigate(`/taxonomy/${sp.species_id}`)} className="species-card">
                    <div className="card-image-wrapper">
                      {/* Fallback image logic in case the DB doesn't have an image yet */}
                      <img 
                        src={sp.thumbnail_url || "https://images.unsplash.com/photo-1582967788606-a171c1080cb0?auto=format&fit=crop&w=600&q=80"} 
                        alt={sp.vernacularname || sp.scientific_name} 
                      />
                    </div>
                    <div className="card-content">
                      <div className="card-header">
                        <h3 className="card-title">{sp.vernacularname || "Unknown Common Name"}</h3>
                        {sp.iucn_status && (
                          <span className={`status-badge status-${sp.iucn_status.toLowerCase()}`}>
                            {sp.iucn_status}
                          </span>
                        )}
                      </div>
                      <p className="card-subtitle">{sp.scientific_name}</p>
                      <div className="card-footer">
                        Family: {sp.family || "Not specified"}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
            
          </div>
        </div>
      </div>
    </div>
  );
};

export default Taxonomy;