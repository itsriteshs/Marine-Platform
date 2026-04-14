// src/pages/Taxonomy.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Taxonomy.css";

const MOCK_SPECIES = [
  { species_id: 1, vernacularname: "Great White Shark", scientific_name: "Carcharodon carcharias", thumbnail_url: "https://images.unsplash.com/photo-1560275619-4662e36fa65c?auto=format&fit=crop&w=600&q=80", iucn_status: "VU", family: "Lamnidae" },
  { species_id: 2, vernacularname: "Clown Anemonefish", scientific_name: "Amphiprion ocellaris", thumbnail_url: "https://images.unsplash.com/photo-1524704654690-b56c05c78a00?auto=format&fit=crop&w=600&q=80", iucn_status: "LC", family: "Pomacentridae" },
  { species_id: 3, vernacularname: "Blue Whale", scientific_name: "Balaenoptera musculus", thumbnail_url: "https://images.unsplash.com/photo-1516283250450-174387a156b8?auto=format&fit=crop&w=600&q=80", iucn_status: "EN", family: "Balaenopteridae" }
];

const Taxonomy = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const filteredSpecies = MOCK_SPECIES.filter(fish => {
    const matchesSearch = fish.vernacularname.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          fish.scientific_name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "" || fish.iucn_status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="taxonomy-page">
      <div className="taxonomy-container">
        
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
          <div className="filter-sidebar">
            <h3>Filters</h3>
            <div className="filter-group">
              <label>Conservation Status</label>
              <select className="filter-select" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                <option value="">All Statuses</option>
                <option value="LC">Least Concern (LC)</option>
                <option value="VU">Vulnerable (VU)</option>
                <option value="EN">Endangered (EN)</option>
              </select>
            </div>
            <div className="filter-group">
              <label>Family (Mock)</label>
              <select className="filter-select" disabled><option>All Families</option></select>
            </div>
          </div>

          <div className="species-grid">
            {filteredSpecies.map((sp) => (
              <div key={sp.species_id} onClick={() => navigate(`/taxonomy/${sp.species_id}`)} className="species-card">
                <div className="card-image-wrapper">
                  <img src={sp.thumbnail_url} alt={sp.vernacularname} />
                </div>
                <div className="card-content">
                  <div className="card-header">
                    <h3 className="card-title">{sp.vernacularname}</h3>
                    <span className={`status-badge status-${sp.iucn_status.toLowerCase()}`}>{sp.iucn_status}</span>
                  </div>
                  <p className="card-subtitle">{sp.scientific_name}</p>
                  <div className="card-footer">Family: {sp.family}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default Taxonomy;