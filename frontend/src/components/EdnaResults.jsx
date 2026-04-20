import React from 'react';
import './OtolithResults.css'; // We can reuse the exact same CSS file to keep styling consistent!

const EdnaResults = ({ results }) => {
  if (!results || !results.primary_match) return null;

  return (
    <div className="results-container">
      <h2 className="results-title">Sequencing Complete</h2>
      
      <div className="results-grid">
        {/* Primary Match Card */}
        <div className="result-card">
          <h3 className="card-label">Primary DNA Match</h3>
          <p className="species-name">{results.primary_match.name}</p>
          <div className="confidence-bar-bg">
            <div 
              className="confidence-bar-fill" 
              style={{ width: `${results.primary_match.match_pct}%`, backgroundColor: '#10b981' }}
            ></div>
          </div>
          <p className="confidence-text">Match Identity: {results.primary_match.match_pct}%</p>
          <p className="age-subtext mt-2">Habitat: <strong>{results.primary_match.habitat}</strong></p>
        </div>

        {/* Sequence Stats Card */}
        <div className="result-card">
          <h3 className="card-label">Sequence Statistics</h3>
          <div className="age-row">
            <p className="age-number">{results.sequence_stats.length_bp}</p>
            <p className="age-unit">Base Pairs (bp)</p>
          </div>
          <p className="age-subtext">
            GC Content: <strong>{results.sequence_stats.gc_content_pct}%</strong>
          </p>
        </div>

        {/* Secondary Matches Table */}
        <div className="result-card card-full-width">
          <h3 className="card-label">Secondary Hits (Lower Confidence)</h3>
          <div className="morph-grid" style={{ gridTemplateColumns: '1fr' }}>
            {results.secondary_matches.map((match, index) => (
              <div key={index} className="morph-box" style={{ display: 'flex', justifyContent: 'space-between' }}>
                <p className="morph-value">{match.name}</p>
                <p className="morph-label" style={{ marginBottom: 0 }}>{match.match_pct}% Match</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EdnaResults;