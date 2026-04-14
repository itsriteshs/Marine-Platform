// src/pages/SpeciesDetail.jsx
import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./SpeciesDetail.css";

// MOCK DATA: A massive object representing your full 60+ column schema
const MOCK_DETAIL = {
  species_id: 1, 
  vernacularname: "Great White Shark", 
  scientific_name: "Carcharodon carcharias", 
  authority: "(Linnaeus, 1758)",
  thumbnail_url: "https://images.unsplash.com/photo-1560275619-4662e36fa65c?auto=format&fit=crop&w=800&q=80",
  
  // Classification
  kingdom: "Animalia", phylum: "Chordata", class: "Chondrichthyes", 
  _order: "Lamniformes", family: "Lamnidae", genus: "Carcharodon", species: "C. carcharias",
  
  // Morphology
  max_length_cm: 600, avg_length_cm: 450, max_weight_kg: 2268, avg_weight_kg: 1500, 
  body_shape: "Fusiform", color_pattern: "Countershaded: dark grey dorsal, white ventral", 
  sexual_dimorphism: "Females generally larger than males", age_of_maturity_years: 15,
  
  // Ecology
  habitat_type: "Pelagic, Coastal, Epipelagic", diet: "Marine mammals, fish, seabirds", 
  trophic_level: 4.5, activity_pattern: "Diurnal/Crepuscular", migration_type: "Highly migratory",
  
  // Environmental Tolerances
  depth_range_min: 0, depth_range_max: 1200, preferred_depth_min: 0, preferred_depth_max: 250,
  temperature_range_min: 12, temperature_range_max: 24, preferred_temp_min: 15, preferred_temp_max: 22,
  salinity_range_min: 30, salinity_range_max: 35, preferred_salinity_min: 33, preferred_salinity_max: 35,
  oxygen_preference_mg_l: 5.5, preferred_ph_min: 7.9, preferred_ph_max: 8.2, preferred_turbidity: 2.0,
  
  // Distribution & Conservation
  global_distribution: "Cosmopolitan in temperate and subtropical coastal and offshore waters.", 
  india_distribution: "Rarely reported in Indian coastal waters; occasionally spotted in deep pelagic zones.", 
  native_range: "Global Oceans", reported_regions: ["Pacific", "Atlantic", "Indian Ocean", "Mediterranean"],
  occurrence_status: "Native", endemic_status: "Non-endemic", 
  iucn_status: "Vulnerable (VU)", population_trend: "Decreasing", 
  major_threats: ["Bycatch", "Targeted fishing for fins/jaws", "Habitat degradation", "Climate change"],
  
  // Fisheries & Human Interaction
  commercial_value: "Historically High, Currently Highly Protected", 
  fishing_methods: ["Longline", "Gillnet", "Trawling (Bycatch)"], 
  aquaculture_potential: "None",
  
  // Meta
  data_source: "Global Oceanographic Biodiversity Init.", created_at: "2025-10-12", updated_at: "2026-04-14"
};

/* --- HELPER COMPONENTS --- */
// Renders a standard label/value pair
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
  
  // In production: const [record, setRecord] = useState(null); fetch inside useEffect based on 'id'
  const record = MOCK_DETAIL;

  return (
    <div className="species-detail-page">
      <div className="detail-container">
        
        <button onClick={() => navigate(-1)} className="back-button">
          &larr; Back to Taxonomy Grid
        </button>

        {/* 1. HERO SECTION */}
        <div className="species-hero">
          <div className="species-hero-image">
            <img src={record.thumbnail_url} alt={record.vernacularname} />
          </div>
          <div className="species-hero-content">
            <h1 className="species-hero-title">{record.vernacularname}</h1>
            <h2 className="species-hero-subtitle">
              {record.scientific_name} <span className="authority-text">{record.authority}</span>
            </h2>
            <div className="hero-badge">{record.iucn_status}</div>
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
                <Field label="Class" value={record.class} />
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
                <Field label="Max Length" value={`${record.max_length_cm} cm`} />
                <Field label="Avg Length" value={`${record.avg_length_cm} cm`} />
                <Field label="Body Shape" value={record.body_shape} />
                <Field label="Max Weight" value={`${record.max_weight_kg} kg`} />
                <Field label="Avg Weight" value={`${record.avg_weight_kg} kg`} />
                <Field label="Age of Maturity" value={`${record.age_of_maturity_years} yrs`} />
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
                <Field label="Preferred Turbidity" value={`${record.preferred_turbidity} NTU`} />
                <Field label="Oxygen Preference" value={`${record.oxygen_preference_mg_l} mg/L`} />
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
          <span>Source: {record.data_source}</span>
          <span>Last Updated: {record.updated_at}</span>
        </div>

      </div>
    </div>
  );
};

export default SpeciesDetail;
// after api is created
// const [record, setRecord] = useState(null);

// useEffect(() => {
//   axios.get(`/api/species/${id}`).then(res => setRecord(res.data));
// }, [id]);

// if (!record) return <div>Loading...</div>;