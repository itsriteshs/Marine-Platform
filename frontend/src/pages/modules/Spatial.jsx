import React, { useState, useEffect } from 'react';
import axios from 'axios';
import BaseChart from '../../components/charts/BaseChart';
import { useFilterStore } from '../../store/useFilterStore';
import './Spatial.css';

export default function Spatial() {
  // Grab BOTH selectedRegion and selectedSpeciesId from the store
  const { selectedRegion, selectedSpeciesId } = useFilterStore();

  const [hotspotData, setHotspotData] = useState([]);
  const [isMapLoading, setIsMapLoading] = useState(true);

  const [depthData, setDepthData] = useState({ years: [], depths: [] });
  const [isDepthLoading, setIsDepthLoading] = useState(true);

  const [effortData, setEffortData] = useState({ months: [], efforts: [] });
  const [isEffortLoading, setIsEffortLoading] = useState(true);

  useEffect(() => {
    const fetchHotspots = async () => {
      setIsMapLoading(true);
      try {
        const response = await axios.get(`http://localhost:8000/api/spatial/hotspots`, { 
          params: { region: selectedRegion, species_id: selectedSpeciesId } 
        });
        setHotspotData(response.data.hotspots);
      } catch (error) { console.error("Failed to fetch hotspots:", error); } 
      finally { setIsMapLoading(false); }
    };

    const fetchDepthTrend = async () => {
      setIsDepthLoading(true);
      try {
        const response = await axios.get(`http://localhost:8000/api/spatial/depth-trend`, { 
          params: { region: selectedRegion, species_id: selectedSpeciesId } 
        });
        setDepthData({ years: response.data.years, depths: response.data.depths });
      } catch (error) { console.error("Failed to fetch depth trend:", error); } 
      finally { setIsDepthLoading(false); }
    };

    const fetchEffort = async () => {
      setIsEffortLoading(true);
      try {
        const response = await axios.get(`http://localhost:8000/api/spatial/sampling-effort`, { 
          params: { region: selectedRegion, species_id: selectedSpeciesId } 
        });
        setEffortData({ months: response.data.months, efforts: response.data.efforts });
      } catch (error) { console.error("Failed to fetch sampling effort:", error); } 
      finally { setIsEffortLoading(false); }
    };

    fetchHotspots();
    fetchDepthTrend();
    fetchEffort();
    
    // Ensure the effect runs when EITHER value changes
  }, [selectedRegion, selectedSpeciesId]);

  const mapOption = {
    title: { 
      text: `Sighting Hotspots: ${selectedRegion}`,
      subtext: 'Bubble size indicates the number of individuals sighted.',
      left: 'left' 
    },
    tooltip: { 
      trigger: 'item',
      backgroundColor: 'rgba(255, 255, 255, 0.9)',
      formatter: function (params) {
        return `
          <strong>Sighting Detail</strong><br/>
          Coordinates: ${params.data[1]}°N, ${params.data[0]}°E<br/>
          <span style="color: #3b82f6; font-weight: bold;">Individuals Count: ${params.data[2]}</span>
        `;
      }
    },
    xAxis: { type: 'value', name: 'Longitude', scale: true },
    yAxis: { type: 'value', name: 'Latitude', scale: true },
    series: [{
      name: 'Sightings',
      type: 'scatter',
      symbolSize: function (data) { return Math.sqrt(data[2]) * 4; },
      itemStyle: { color: 'rgba(59, 130, 246, 0.6)' },
      data: hotspotData
    }]
  };

  const depthOption = {
    title: { 
      text: 'Average Depth by Year', 
      subtext: 'Downward trends may indicate climate-driven depth shifting.',
      left: 'center', 
      textStyle: { fontSize: 14 } 
    },
    tooltip: { 
      trigger: 'axis',
      formatter: '{b}: Average depth of <strong>{c} meters</strong>'
    },
    xAxis: { type: 'category', data: depthData.years },
    yAxis: { type: 'value', name: 'Depth (m)', inverse: true },
    series: [{
      data: depthData.depths,
      type: 'line',
      smooth: true,
      areaStyle: { color: 'rgba(16, 185, 129, 0.3)' },
      itemStyle: { color: '#10b981' }
    }]
  };

  const blindspotOption = {
    title: { 
      text: 'Sampling Effort by Month', 
      subtext: 'Zero-values indicate potential data blindspots.',
      left: 'center', 
      textStyle: { fontSize: 14 } 
    },
    tooltip: { 
      trigger: 'axis',
      formatter: '<strong>{b}</strong>: {c} expeditions logged'
    },
    xAxis: { type: 'category', data: effortData.months },
    yAxis: { type: 'value', name: 'Expeditions' },
    series: [{
      data: effortData.efforts,
      type: 'bar',
      itemStyle: { color: '#f59e0b' }
    }]
  };

  return (
    <div className="spatial-container">
      <div className="spatial-header">
        <h2 className="spatial-title">Spatial & Occurrence Tracking</h2>
        <p className="spatial-subtitle">Mapping physical distribution and migration patterns.</p>
      </div>

      <div className="bento-grid">
        <div className="bento-card hero-card">
          <BaseChart option={mapOption} height="500px" isLoading={isMapLoading} />
        </div>

        <div className="bento-card">
          <BaseChart option={depthOption} height="300px" isLoading={isDepthLoading} />
        </div>

        <div className="bento-card">
          <BaseChart option={blindspotOption} height="300px" isLoading={isEffortLoading} />
        </div>
      </div>
    </div>
  );
}