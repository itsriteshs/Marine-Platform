import React, { useState, useEffect } from 'react';
import axios from 'axios';
import BaseChart from '../../components/charts/BaseChart';
import { useFilterStore } from '../../store/useFilterStore';
import './Population.css';

export default function Population() {
  const selectedRegion = useFilterStore((state) => state.selectedRegion);

  // States for Abundance Trend (Hero Chart)
  const [abundanceData, setAbundanceData] = useState({ months: [], abundance: [] });
  const [isAbundanceLoading, setIsAbundanceLoading] = useState(true);

  // States for Demographics (Donut Chart)
  const [demoData, setDemoData] = useState([]);
  const [isDemoLoading, setIsDemoLoading] = useState(true);

  // States for Otolith Growth (Bar Chart)
  const [growthData, setGrowthData] = useState({ ages: [], lengths: [] });
  const [isGrowthLoading, setIsGrowthLoading] = useState(true);

  useEffect(() => {
    const fetchAbundance = async () => {
      setIsAbundanceLoading(true);
      try {
        const response = await axios.get(`http://localhost:8000/api/population/abundance`, {
          params: { region: selectedRegion }
        });
        setAbundanceData({ months: response.data.months, abundance: response.data.abundance });
      } catch (error) { console.error("Failed to fetch abundance:", error); } 
      finally { setIsAbundanceLoading(false); }
    };

    const fetchDemographics = async () => {
      setIsDemoLoading(true);
      try {
        const response = await axios.get(`http://localhost:8000/api/population/demographics`, {
          params: { region: selectedRegion }
        });
        setDemoData(response.data.demographics);
      } catch (error) { console.error("Failed to fetch demographics:", error); } 
      finally { setIsDemoLoading(false); }
    };

    const fetchGrowth = async () => {
      setIsGrowthLoading(true);
      try {
        // Growth is biological, so it isn't filtered by region in our current backend
        const response = await axios.get(`http://localhost:8000/api/population/growth`);
        setGrowthData({ ages: response.data.ages, lengths: response.data.lengths });
      } catch (error) { console.error("Failed to fetch growth:", error); } 
      finally { setIsGrowthLoading(false); }
    };

    fetchAbundance();
    fetchDemographics();
    fetchGrowth();
  }, [selectedRegion]);

  // 📈 CHART 1: Abundance Time-Series
  const abundanceOption = {
    title: { 
      text: `Total Abundance: ${selectedRegion}`, 
      subtext: 'Monthly population counts aggregated across all surveys.',
      left: 'left' 
    },
    tooltip: { trigger: 'axis', formatter: '{b}: <strong>{c} individuals</strong>' },
    xAxis: { type: 'category', data: abundanceData.months, boundaryGap: false },
    yAxis: { type: 'value', name: 'Count' },
    series: [{
      data: abundanceData.abundance,
      type: 'line',
      smooth: true,
      areaStyle: { color: 'rgba(59, 130, 246, 0.2)' },
      itemStyle: { color: '#3b82f6' },
      lineStyle: { width: 3 }
    }]
  };

  // 🍩 CHART 2: Juvenile vs Adult Demographics
  const demoOption = {
    title: { 
      text: 'Demographic Composition', 
      subtext: 'Ratio of Adult to Juvenile populations.',
      left: 'center', 
      textStyle: { fontSize: 14 } 
    },
    tooltip: { trigger: 'item', formatter: '{b}: <strong>{c}</strong> ({d}%)' },
    legend: { bottom: '0%', left: 'center' },
    series: [{
      name: 'Life Stage',
      type: 'pie',
      radius: ['40%', '70%'], // Creates the Donut shape
      avoidLabelOverlap: false,
      itemStyle: {
        borderRadius: 8,
        borderColor: '#fff',
        borderWidth: 2
      },
      label: { show: false },
      data: demoData,
      color: ['#8b5cf6', '#34d399'] // Purple for Adults, Mint Green for Juveniles
    }]
  };

  // 📊 CHART 3: Otolith Growth Curve
  const growthOption = {
    title: { 
      text: 'Average Length by Age (Otolith)', 
      subtext: 'Derived from otolith ring counts and physical measurements.',
      left: 'center', 
      textStyle: { fontSize: 14 } 
    },
    tooltip: { trigger: 'axis', formatter: '{b}: <strong>{c} mm</strong>' },
    xAxis: { type: 'category', data: growthData.ages },
    yAxis: { type: 'value', name: 'Length (mm)' },
    series: [{
      data: growthData.lengths,
      type: 'bar',
      itemStyle: { color: '#f43f5e', borderRadius: [4, 4, 0, 0] }
    }]
  };

  return (
    <div className="population-container">
      <div className="population-header">
        <h2 className="population-title">Population Dynamics</h2>
        <p className="population-subtitle">Analyzing abundance trends, demographic health, and biological growth rates.</p>
      </div>

      <div className="bento-grid">
        <div className="bento-card hero-card">
          <BaseChart option={abundanceOption} height="400px" isLoading={isAbundanceLoading} />
        </div>

        <div className="bento-card">
          <BaseChart option={demoOption} height="350px" isLoading={isDemoLoading} />
        </div>

        <div className="bento-card">
          <BaseChart option={growthOption} height="350px" isLoading={isGrowthLoading} />
        </div>
      </div>
    </div>
  );
}