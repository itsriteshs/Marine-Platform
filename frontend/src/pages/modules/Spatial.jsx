import React, { useState, useEffect } from 'react';
import axios from 'axios';
import BaseChart from '../../components/charts/BaseChart';
import { useFilterStore } from '../../store/useFilterStore';
import './Spatial.css';

export default function Spatial() {
  // Grab the region from Zustand
  const selectedRegion = useFilterStore((state) => state.selectedRegion);

  // Set up React State to hold the live data and loading status
  const [hotspotData, setHotspotData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // The Fetching Engine: Runs every time 'selectedRegion' changes
  useEffect(() => {
    const fetchHotspots = async () => {
      setIsLoading(true);
      try {
        // Ping your new FastAPI endpoint
        const response = await axios.get(`http://localhost:8000/api/spatial/hotspots`, {
          params: { region: selectedRegion }
        });
        
        // Save the array of [lon, lat, count] into state
        setHotspotData(response.data.hotspots);
      } catch (error) {
        console.error("Failed to fetch spatial data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchHotspots();
  }, [selectedRegion]); // 👈 This dependency array is the magic link to the Topbar

  // 🗺️ CHART 1: The Live Hero Map
  const mapOption = {
    title: { text: `Sighting Hotspots: ${selectedRegion}`, left: 'left' },
    tooltip: { 
      trigger: 'item',
      formatter: function (params) {
        // Formats the hover tooltip cleanly
        return `Long: ${params.data[0]}<br/>Lat: ${params.data[1]}<br/>Count: ${params.data[2]}`;
      }
    },
    xAxis: { type: 'value', name: 'Longitude', scale: true },
    yAxis: { type: 'value', name: 'Latitude', scale: true },
    series: [{
      name: 'Sightings',
      type: 'scatter',
      symbolSize: function (data) { 
        // Makes the bubble size proportional to the fish count!
        return Math.sqrt(data[2]) * 4; 
      },
      itemStyle: { color: 'rgba(59, 130, 246, 0.6)' },
      data: hotspotData // 👈 LIVE POSTGRESQL DATA PLUGGED IN HERE
    }]
  };

  // 📉 CHART 2: Depth Shifting (Still using dummy data for now)
  const depthOption = {
    title: { text: 'Depth Distribution by Year', left: 'center', textStyle: { fontSize: 14 } },
    tooltip: { trigger: 'axis' },
    xAxis: { type: 'category', data: ['2020', '2021', '2022', '2023', '2024', '2025'] },
    yAxis: { type: 'value', name: 'Depth (m)', inverse: true },
    series: [{
      data: [45, 50, 65, 80, 110, 140],
      type: 'line',
      smooth: true,
      areaStyle: { color: 'rgba(16, 185, 129, 0.3)' },
      itemStyle: { color: '#10b981' }
    }]
  };

  // 📊 CHART 3: Data Blindspots (Still using dummy data for now)
  const blindspotOption = {
    title: { text: 'Sampling Effort by Month', left: 'center', textStyle: { fontSize: 14 } },
    tooltip: { trigger: 'axis' },
    xAxis: { type: 'category', data: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'] },
    yAxis: { type: 'value', name: 'Expeditions' },
    series: [{
      data: [12, 15, 20, 5, 2, 0, 0, 8, 22, 25, 18, 10],
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
        {/* Pass our new isLoading state into the BaseChart so it shows a loading spinner! */}
        <div className="bento-card hero-card">
          <BaseChart option={mapOption} height="500px" isLoading={isLoading} />
        </div>

        <div className="bento-card">
          <BaseChart option={depthOption} height="300px" />
        </div>

        <div className="bento-card">
          <BaseChart option={blindspotOption} height="300px" />
        </div>
      </div>
    </div>
  );
}