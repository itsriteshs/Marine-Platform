// src/pages/SpeciesDetail.jsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./SpeciesDetail.css";

/* --- HELPER COMPONENTS --- */
// Renders a standard label/value pair. Hides automatically if data is null/empty.
const Field = ({ label, value, fullWidth }) => {
  if (value === null || value === undefined || value === "") return null;
  return (
    <div className={`field-wrapper ${fullWidth ? 'full-width' : ''}`}>
      <span className="field-label">{label}</span>
      <span className="field-value">{value}</span>
    </div>
  );
};

// Intelligently renders a range (min - max) with a unit
const RangeField = ({ label, min, max, unit }) => {
  if (min === undefined && max === undefined) return null;
  if (min === null && max === null) return null;
  const displayValue = min && max ? `${min} - ${max} ${unit}` : `${min || max} ${unit} (est.)`;
  return <Field label={label} value={displayValue} />;
};

// Renders PostgreSQL arrays (like text[]) as visual tags
const TagsField = ({ label, items, fullWidth }) => {
  if (!items || items.length === 0) return null;
  return (
    <div className={`field-wrapper ${fullWidth ? 'full-width' : ''}`}>
      <span className="field-label">{label}</span>
      <div className="tags-container">
        {items.map((item, idx) => (
          <span key={idx} className="tag">{item}</span>
        ))}
      </div>
    </div>
  );
};
/* ------------------------- */

const SpeciesDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  // 1. Data States
  const [record, setRecord] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 2. Fetch the specific fish from FastAPI
  useEffect(() => {
    const fetchDetail = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const response = await fetch(`http://localhost:8000/api/species/${id}`);
        
        if (!response.ok) {
          if (response.status === 404) throw new Error("Species not found in the database.");
          throw new Error(`Failed to fetch: ${response.statusText}`);
        }
        
        const data = await response.json();
        setRecord(data);
      } catch (err) {
        console.error("API Error:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDetail();
  }, [id]); // Re-run if the ID in the URL changes

  // 3. Loading State UI
  if (loading) {
    return (
      <div className="species-detail-page flex items-center justify-center">
        <div style={{ padding: '60px', textAlign: 'center', color: '#64748b', fontSize: '18px' }}>
          Loading deep sea data...
        </div>
      </div>
    );
  }

  // 4. Error State UI
  if (error || !record) {
    return (
      <div className="species-detail-page">
        <div className="detail-container">
          <button onClick={() => navigate(-1)} className="back-button mb-6">
            &larr; Back to Taxonomy Grid
          </button>
          <div style={{ padding: '40px', textAlign: 'center', backgroundColor: '#fee2e2', color: '#ef4444', borderRadius: '16px' }}>
            <h2>Something went wrong</h2>
            <p>{error || "Could not load species details."}</p>
          </div>
        </div>
      </div>
    );
  }

  // 5. Success UI (Rendering the 60+ columns)
  return (
    <div className="species-detail-page">
      <div className="detail-container">
        
        <button onClick={() => navigate(-1)} className="back-button">
          &larr; Back to Taxonomy Grid
        </button>

        {/* 1. HERO SECTION */}
        <div className="species-hero">
          <div className="species-hero-image">
            {/* Fallback image if thumbnail is null */}
            <img 
              src={record.thumbnail_url || (record.image_urls && record.image_urls[0]) || "https://images.unsplash.com/photo-1582967788606-a171c1080cb0?auto=format&fit=crop&w=800&q=80"} 
              alt={record.vernacularname || record.scientific_name} 
            />
          </div>
          <div className="species-hero-content">
            <h1 className="species-hero-title">{record.vernacularname || "Unknown Common Name"}</h1>
            <h2 className="species-hero-subtitle">
              {record.scientific_name} <span className="authority-text">{record.authority}</span>
            </h2>
            {record.iucn_status && (
              <div className="hero-badge">{record.iucn_status}</div>
            )}
          </div>
        </div>

        <div className="detail-layout">
          
          {/* LEFT SIDEBAR: Taxonomy & Quick Meta */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div className="data-group">
              <h3>Classification</h3>
              <div className="data-grid">
                <Field label="Kingdom" value={record.kingdom} />
                <Field label="Phylum" value={record.phylum} />
                {/* Notice we use class_name here! */}
                <Field label="Class" value={record.class_name} />
                <Field label="Order" value={record._order} />
                <Field label="Family" value={record.family} />
                <Field label="Genus" value={record.genus} />
                <Field label="Species" value={record.species} />
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Heavy Data Stack */}
          <div className="main-content-stack">
            
            {/* 2. MORPHOLOGY */}
            <div className="data-group">
              <h3>Morphology & Biology</h3>
              <div className="data-grid three-col">
                <Field label="Max Length" value={record.max_length_cm ? `${record.max_length_cm} cm` : null} />
                <Field label="Avg Length" value={record.avg_length_cm ? `${record.avg_length_cm} cm` : null} />
                <Field label="Body Shape" value={record.body_shape} />
                <Field label="Max Weight" value={record.max_weight_kg ? `${record.max_weight_kg} kg` : null} />
                <Field label="Avg Weight" value={record.avg_weight_kg ? `${record.avg_weight_kg} kg` : null} />
                <Field label="Age of Maturity" value={record.age_of_maturity_years ? `${record.age_of_maturity_years} yrs` : null} />
              </div>
              <div className="data-grid two-col" style={{ marginTop: '20px' }}>
                <Field label="Color Pattern" value={record.color_pattern} />
                <Field label="Sexual Dimorphism" value={record.sexual_dimorphism} />
              </div>
            </div>

            {/* 3. ECOLOGY & BEHAVIOR */}
            <div className="data-group">
              <h3>Ecology & Behavior</h3>
              <div className="data-grid two-col">
                <Field label="Habitat Type" value={record.habitat_type} fullWidth />
                <Field label="Diet / Prey" value={record.diet} fullWidth />
                <Field label="Trophic Level" value={record.trophic_level} />
                <Field label="Activity Pattern" value={record.activity_pattern} />
                <Field label="Migration Type" value={record.migration_type} fullWidth />
              </div>
            </div>

            {/* 4. ENVIRONMENTAL TOLERANCES */}
            <div className="data-group">
              <h3>Environmental Parameters</h3>
              <div className="data-grid three-col">
                <RangeField label="Absolute Depth" min={record.depth_range_min} max={record.depth_range_max} unit="m" />
                <RangeField label="Absolute Temp" min={record.temperature_range_min} max={record.temperature_range_max} unit="°C" />
                <RangeField label="Absolute Salinity" min={record.salinity_range_min} max={record.salinity_range_max} unit="ppt" />
                
                <RangeField label="Preferred Depth" min={record.preferred_depth_min} max={record.preferred_depth_max} unit="m" />
                <RangeField label="Preferred Temp" min={record.preferred_temp_min} max={record.preferred_temp_max} unit="°C" />
                <RangeField label="Preferred Salinity" min={record.preferred_salinity_min} max={record.preferred_salinity_max} unit="ppt" />
              </div>
              <div className="data-grid three-col" style={{ marginTop: '20px' }}>
                <RangeField label="Preferred pH" min={record.preferred_ph_min} max={record.preferred_ph_max} unit="" />
                <Field label="Preferred Turbidity" value={record.preferred_turbidity ? `${record.preferred_turbidity} NTU` : null} />
                <Field label="Oxygen Preference" value={record.oxygen_preference_mg_l ? `${record.oxygen_preference_mg_l} mg/L` : null} />
              </div>
            </div>

            {/* 5. GEOGRAPHY & CONSERVATION */}
            <div className="data-group">
              <h3>Distribution & Conservation</h3>
              <div className="data-grid two-col">
                <Field label="Global Distribution" value={record.global_distribution} fullWidth />
                <Field label="India Distribution" value={record.india_distribution} fullWidth />
                <TagsField label="Reported Regions" items={record.reported_regions} fullWidth />
                
                <Field label="Endemic Status" value={record.endemic_status} />
                <Field label="Occurrence" value={record.occurrence_status} />
                <Field label="Population Trend" value={record.population_trend} />
                
                <TagsField label="Major Threats" items={record.major_threats} fullWidth />
              </div>
            </div>

            {/* 6. FISHERIES / HUMAN USE */}
            <div className="data-group">
              <h3>Human Interaction</h3>
              <div className="data-grid two-col">
                <Field label="Commercial Value" value={record.commercial_value} />
                <Field label="Aquaculture Potential" value={record.aquaculture_potential} />
                <TagsField label="Common Fishing Methods" items={record.fishing_methods} fullWidth />
              </div>
            </div>

          </div>
        </div>

        {/* 7. METADATA */}
        <div className="metadata-footer">
          <span>Source: {record.data_source || "Marine Database"}</span>
          <span>Last Updated: {record.updated_at ? new Date(record.updated_at).toLocaleDateString() : "N/A"}</span>
        </div>

      </div>
    </div>
  );
};

export default SpeciesDetail;