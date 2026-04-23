import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useFilterStore } from '../store/useFilterStore';
import './Topbar.css'; // <-- Import the CSS here

export default function Topbar() {
  const { selectedRegion, setRegion, selectedSpeciesId, setSpeciesId } = useFilterStore();
  
  const [speciesList, setSpeciesList] = useState([]);

  useEffect(() => {
    const fetchSpecies = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/species');
        setSpeciesList(response.data);
      } catch (error) {
        console.error("Failed to fetch species list for Topbar", error);
      }
    };
    fetchSpecies();
  }, []);

  return (
    <header className="topbar-container">
      <div>
        <h1 className="topbar-title">Marine Dashboard</h1>
      </div>

      <div className="topbar-filters">
        {/* The Region Filter */}
        <select 
          className="topbar-select"
          value={selectedRegion}
          onChange={(e) => setRegion(e.target.value)}
        >
          <option value="Global">Global Region</option>
          <option value="Indo-Pacific">Indo-Pacific</option>
          <option value="Caribbean">Caribbean</option>
          <option value="North Atlantic">North Atlantic</option>
        </select>

        {/* The Species Filter */}
        <select 
          className="topbar-select"
          value={selectedSpeciesId || ""}
          onChange={(e) => setSpeciesId(e.target.value === "" ? null : Number(e.target.value))}
        >
          <option value="">All Species</option>
          {speciesList.map((species) => (
            <option key={species.species_id} value={species.species_id}>
              {species.scientific_name} {species.vernacularname ? `(${species.vernacularname})` : ''}
            </option>
          ))}
        </select>
      </div>
    </header>
  );
}