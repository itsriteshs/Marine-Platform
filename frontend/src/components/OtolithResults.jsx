// src/components/OtolithResults.jsx
import React from 'react';
import './OtolithResults.css'; // <-- Import the new standard CSS!

const OtolithResults = ({ results }) => {
  if (!results || !results.species) return null;

  return (
    <div className="results-container">
      <h2 className="results-title">Analysis Complete</h2>
      
      <div className="results-grid">
        
        {/* Species Card */}
        <div className="result-card">
          <h3 className="card-label">Detected Species</h3>
          <p className="species-name">{results.species.name}</p>
          <div className="confidence-bar-bg">
            <div 
              className="confidence-bar-fill" 
              style={{ width: `${(results.species.confidence * 100).toFixed(0)}%` }}
            ></div>
          </div>
          <p className="confidence-text">
            Confidence: {(results.species.confidence * 100).toFixed(1)}%
          </p>
        </div>

        {/* Age Estimation Card */}
        <div className="result-card">
          <h3 className="card-label">Age Estimation</h3>
          <div className="age-row">
            <p className="age-number">{results.age.estimated_age_years}</p>
            <p className="age-unit">Years</p>
          </div>
          <p className="age-subtext">
            Rings Detected: <strong>{results.age.ring_count}</strong>
          </p>
        </div>

        {/* Morphometrics Table */}
        <div className="result-card card-full-width">
          <h3 className="card-label">Morphometrics</h3>
          <div className="morph-grid">
            <div className="morph-box">
              <p className="morph-label">Area</p>
              <p className="morph-value">{results.morphometrics.area_mm2.toFixed(2)} mm²</p>
            </div>
            <div className="morph-box">
              <p className="morph-label">Perimeter</p>
              <p className="morph-value">{results.morphometrics.perimeter_mm.toFixed(2)} mm</p>
            </div>
            <div className="morph-box">
              <p className="morph-label">Length</p>
              <p className="morph-value">{results.morphometrics.length_mm.toFixed(2)} mm</p>
            </div>
            <div className="morph-box">
              <p className="morph-label">Width</p>
              <p className="morph-value">{results.morphometrics.width_mm.toFixed(2)} mm</p>
            </div>
          </div>
        </div>

        {/* Images Array */}
        {results.output_files && (
          <div className="result-card card-full-width">
            <h3 className="card-label">Visual Output</h3>
            <div className="image-grid">
              <div>
                <p className="image-title">AI Overlay</p>
                <img 
                  src={`http://localhost:8001/results/${results.output_files.overlay}`} 
                  alt="Otolith Overlay" 
                  className="result-image"
                />
              </div>
              <div>
                <p className="image-title">Radial Profile</p>
                <img 
                  src={`http://localhost:8001/results/${results.output_files.profile}`} 
                  alt="Otolith Profile" 
                  className="result-image"
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OtolithResults;