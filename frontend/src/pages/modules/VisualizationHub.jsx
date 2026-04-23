import React from 'react';
import { Link } from 'react-router-dom';
import './VisualizationHub.css';

export default function VisualizationsHub() {
  const modules = [
    {
      title: "Spatial & Occurrence",
      path: "/modules/spatial",
      description: "Track sighting hotspots, migration corridors, and depth shifting over time.",
      icon: "🗺️"
    },
    {
      title: "Population Dynamics",
      path: "/modules/population",
      description: "Analyze abundance trends, size frequency, and mortality vs. recruitment rates.",
      icon: "📈"
    },
    {
      title: "Oceanographic & Environment",
      path: "/modules/oceanographic",
      description: "Monitor water column profiles, toxicity, and climate change indicators.",
      icon: "🧪"
    },
    {
      title: "Ecosystem Biodiversity",
      path: "/modules/ecosystem",
      description: "Evaluate entire reef health, functional redundancy, and food webs.",
      icon: "🧬"
    },
    {
      title: "Species Encyclopedia",
      path: "/taxonomy", // Links back to your existing taxonomy/detail pages
      description: "Deep dive into individual species profiles, trophic levels, and genetics.",
      icon: "🐟"
    },
    {
      title: "Cross-Module Explorer",
      path: "/modules/explorer",
      description: "Custom sandbox. Test hypotheses by combining environmental and biological data.",
      icon: "🔬"
    }
  ];

  return (
    <div className="hub-container">
      <div className="hub-header">
        <h1 className="hub-title">Research Visualization Hub</h1>
        <p className="hub-subtitle">Select a module to begin your analysis.</p>
      </div>

      <div className="hub-grid">
        {modules.map((mod, index) => (
          <Link to={mod.path} key={index} className="module-card">
            <div className="module-icon">{mod.icon}</div>
            <h2 className="module-card-title">{mod.title}</h2>
            <p className="module-card-desc">{mod.description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}