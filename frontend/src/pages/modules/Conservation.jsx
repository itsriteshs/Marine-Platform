import React, { useState, useEffect } from 'react';
import axios from 'axios';
import BaseChart from '../../components/charts/BaseChart';
import './Conservation.css';

export default function Conservation() {
  // States for Trophic Scatter (Hero Chart)
  const [trophicData, setTrophicData] = useState([]);
  const [isTrophicLoading, setIsTrophicLoading] = useState(true);

  // States for IUCN Status
  const [iucnData, setIucnData] = useState([]);
  const [isIucnLoading, setIsIucnLoading] = useState(true);

  // States for Commercial Value
  const [commercialData, setCommercialData] = useState({ categories: [], counts: [] });
  const [isCommercialLoading, setIsCommercialLoading] = useState(true);

  useEffect(() => {
    const fetchTrophic = async () => {
      setIsTrophicLoading(true);
      try {
        const response = await axios.get(`http://localhost:8000/api/conservation/trophic`);
        setTrophicData(response.data.scatter);
      } catch (error) { console.error("Failed to fetch trophic data:", error); } 
      finally { setIsTrophicLoading(false); }
    };

    const fetchIucn = async () => {
      setIsIucnLoading(true);
      try {
        const response = await axios.get(`http://localhost:8000/api/conservation/iucn`);
        setIucnData(response.data.iucn);
      } catch (error) { console.error("Failed to fetch IUCN data:", error); } 
      finally { setIsIucnLoading(false); }
    };

    const fetchCommercial = async () => {
      setIsCommercialLoading(true);
      try {
        const response = await axios.get(`http://localhost:8000/api/conservation/commercial`);
        setCommercialData(response.data);
      } catch (error) { console.error("Failed to fetch commercial data:", error); } 
      finally { setIsCommercialLoading(false); }
    };

    fetchTrophic();
    fetchIucn();
    fetchCommercial();
  }, []);

  // 🦈 CHART 1: Trophic Level & Diet (Scatter Plot)
  const trophicOption = {
    title: { 
      text: 'Food Web: Trophic Level vs. Max Length', 
      subtext: 'Bubble size indicates maximum weight (kg).',
      left: 'left' 
    },
    tooltip: { 
      trigger: 'item',
      formatter: function (params) {
        return `
          <strong>${params.data[3]}</strong><br/>
          Length: ${params.data[0]} cm<br/>
          Trophic Level: ${params.data[1]}<br/>
          Weight: ${params.data[2]} kg
        `;
      }
    },
    xAxis: { type: 'value', name: 'Max Length (cm)', scale: true },
    yAxis: { type: 'value', name: 'Trophic Level', scale: true },
    series: [{
      name: 'Species',
      type: 'scatter',
      symbolSize: function (data) { 
        // Scale bubble by weight, with a minimum size of 10
        return Math.max(Math.sqrt(data[2]) * 3, 10); 
      },
      itemStyle: { color: 'rgba(16, 185, 129, 0.6)' },
      data: trophicData
    }]
  };

  // 🌍 CHART 2: IUCN Conservation Status (Donut Chart)
  const iucnOption = {
    title: { 
      text: 'IUCN Risk Status', 
      left: 'center', 
      textStyle: { fontSize: 14 } 
    },
    tooltip: { trigger: 'item', formatter: '{b}: <strong>{c}</strong> species ({d}%)' },
    legend: { bottom: '0%', left: 'center' },
    series: [{
      name: 'IUCN Status',
      type: 'pie',
      radius: ['40%', '70%'],
      avoidLabelOverlap: false,
      itemStyle: { borderRadius: 8, borderColor: '#fff', borderWidth: 2 },
      label: { show: false },
      data: iucnData,
      // Color palette from Red (Critical) to Green (Least Concern)
      color: ['#ef4444', '#f59e0b', '#3b82f6', '#10b981', '#64748b'] 
    }]
  };

  // 💰 CHART 3: Commercial Value (Bar Chart)
  const commercialOption = {
    title: { 
      text: 'Economic Importance', 
      subtext: 'Species breakdown by commercial fishery value.',
      left: 'center', 
      textStyle: { fontSize: 14 } 
    },
    tooltip: { trigger: 'axis' },
    xAxis: { type: 'category', data: commercialData.categories },
    yAxis: { type: 'value', name: 'Species Count' },
    series: [{
      data: commercialData.counts,
      type: 'bar',
      itemStyle: { color: '#8b5cf6', borderRadius: [4, 4, 0, 0] },
      barWidth: '50%'
    }]
  };

  return (
    <div className="conservation-container">
      <div className="conservation-header">
        <h2 className="conservation-title">Conservation & Life History</h2>
        <p className="conservation-subtitle">Analyzing biological traits, extinction risks, and economic pressures.</p>
      </div>

      <div className="bento-grid">
        <div className="bento-card hero-card">
          <BaseChart option={trophicOption} height="450px" isLoading={isTrophicLoading} />
        </div>

        <div className="bento-card">
          <BaseChart option={iucnOption} height="350px" isLoading={isIucnLoading} />
        </div>

        <div className="bento-card">
          <BaseChart option={commercialOption} height="350px" isLoading={isCommercialLoading} />
        </div>
      </div>
    </div>
  );
}