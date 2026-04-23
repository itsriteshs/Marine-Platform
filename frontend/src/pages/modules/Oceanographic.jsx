import React, { useState, useEffect } from 'react';
import axios from 'axios';
import BaseChart from '../../components/charts/BaseChart';
import { useFilterStore } from '../../store/useFilterStore';
import './Oceanographic.css';

export default function Oceanographic() {
  const selectedRegion = useFilterStore((state) => state.selectedRegion);

  // States for Climate Trend (Hero Chart)
  const [climateData, setClimateData] = useState({ dates: [], sst: [], ph: [] });
  const [isClimateLoading, setIsClimateLoading] = useState(true);

  // States for Pollution Tracking (Bottom Chart)
  const [pollutionData, setPollutionData] = useState({ dates: [], plastic: [], index: [] });
  const [isPollutionLoading, setIsPollutionLoading] = useState(true);

  useEffect(() => {
    const fetchClimate = async () => {
      setIsClimateLoading(true);
      try {
        const response = await axios.get(`http://localhost:8000/api/ocean/climate`, {
          params: { region: selectedRegion }
        });
        setClimateData(response.data);
      } catch (error) { console.error("Failed to fetch climate data:", error); } 
      finally { setIsClimateLoading(false); }
    };

    const fetchPollution = async () => {
      setIsPollutionLoading(true);
      try {
        const response = await axios.get(`http://localhost:8000/api/ocean/pollution`, {
          params: { region: selectedRegion }
        });
        setPollutionData(response.data);
      } catch (error) { console.error("Failed to fetch pollution data:", error); } 
      finally { setIsPollutionLoading(false); }
    };

    fetchClimate();
    fetchPollution();
  }, [selectedRegion]);

  // 🌡️ CHART 1: Climate Trends (Dual Y-Axis Line Chart)
  const climateOption = {
    title: { 
      text: `Climate Indicators: ${selectedRegion}`, 
      subtext: 'Tracking Sea Surface Temperature vs. Ocean Acidification (pH)',
      left: 'left' 
    },
    tooltip: { trigger: 'axis' },
    legend: { top: 0, right: 0 },
    xAxis: { type: 'category', data: climateData.dates, boundaryGap: false },
    yAxis: [
      { type: 'value', name: 'SST (°C)', position: 'left', min: 'dataMin' }, // Index 0
      { type: 'value', name: 'pH Level', position: 'right', min: 'dataMin', max: 'dataMax' } // Index 1
    ],
    series: [
      {
        name: 'SST (°C)',
        type: 'line',
        yAxisIndex: 0, // Maps to the left axis
        data: climateData.sst,
        smooth: true,
        itemStyle: { color: '#ef4444' }, // Red for temperature
        lineStyle: { width: 3 }
      },
      {
        name: 'pH Level',
        type: 'line',
        yAxisIndex: 1, // Maps to the right axis
        data: climateData.ph,
        smooth: true,
        itemStyle: { color: '#06b6d4' }, // Cyan for pH
        lineStyle: { width: 3 }
      }
    ]
  };

  // 🚯 CHART 2: Human Impact & Pollution (Combo Bar/Line Chart)
  const pollutionOption = {
    title: { 
      text: 'Human Impact tracking', 
      subtext: 'Plastic debris density alongside overall pollution index.',
      left: 'left' 
    },
    tooltip: { trigger: 'axis' },
    legend: { top: 0, right: 0 },
    xAxis: { type: 'category', data: pollutionData.dates },
    yAxis: [
      { type: 'value', name: 'Plastic (pcs/km²)', position: 'left' }, // Index 0
      { type: 'value', name: 'Pollution Index', position: 'right', max: 10 } // Index 1 (Assuming 0-10 scale)
    ],
    series: [
      {
        name: 'Plastic Debris',
        type: 'bar',
        yAxisIndex: 0,
        data: pollutionData.plastic,
        itemStyle: { color: '#f59e0b', borderRadius: [4, 4, 0, 0] } // Yellow bars
      },
      {
        name: 'Pollution Index',
        type: 'line',
        yAxisIndex: 1,
        data: pollutionData.index,
        smooth: true,
        itemStyle: { color: '#8b5cf6' }, // Purple line
        lineStyle: { width: 3, type: 'dashed' }
      }
    ]
  };

  return (
    <div className="ocean-container">
      <div className="ocean-header">
        <h2 className="ocean-title">Oceanographic & Environment</h2>
        <p className="ocean-subtitle">Monitoring physical water quality, climate change indicators, and human impact.</p>
      </div>

      <div className="bento-grid">
        {/* Climate Hero Chart spanning both columns */}
        <div className="bento-card hero-card">
          <BaseChart option={climateOption} height="400px" isLoading={isClimateLoading} />
        </div>

        {/* Pollution Chart spanning both columns (You can adjust this later if you add more charts) */}
        <div className="bento-card hero-card">
          <BaseChart option={pollutionOption} height="350px" isLoading={isPollutionLoading} />
        </div>
      </div>
    </div>
  );
}