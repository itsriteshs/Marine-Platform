import React, { useState, useEffect } from 'react';
import axios from 'axios';
import BaseChart from '../../components/charts/BaseChart';
import { useFilterStore } from '../../store/useFilterStore';
import './Biodiversity.css';

export default function Biodiversity() {
  const selectedRegion = useFilterStore((state) => state.selectedRegion);

  // States for Indices (Hero Chart)
  const [indicesData, setIndicesData] = useState({ dates: [], shannon: [], simpson: [] });
  const [isIndicesLoading, setIsIndicesLoading] = useState(true);

  // States for Richness
  const [richnessData, setRichnessData] = useState({ dates: [], observed: [], estimated: [] });
  const [isRichnessLoading, setIsRichnessLoading] = useState(true);

  // States for Ecosystem Balance
  const [balanceData, setBalanceData] = useState({ dates: [], evenness: [], functional: [] });
  const [isBalanceLoading, setIsBalanceLoading] = useState(true);

  useEffect(() => {
    const fetchIndices = async () => {
      setIsIndicesLoading(true);
      try {
        const response = await axios.get(`http://localhost:8000/api/biodiversity/indices`, {
          params: { region: selectedRegion }
        });
        setIndicesData(response.data);
      } catch (error) { console.error("Failed to fetch indices:", error); } 
      finally { setIsIndicesLoading(false); }
    };

    const fetchRichness = async () => {
      setIsRichnessLoading(true);
      try {
        const response = await axios.get(`http://localhost:8000/api/biodiversity/richness`, {
          params: { region: selectedRegion }
        });
        setRichnessData(response.data);
      } catch (error) { console.error("Failed to fetch richness:", error); } 
      finally { setIsRichnessLoading(false); }
    };

    const fetchBalance = async () => {
      setIsBalanceLoading(true);
      try {
        const response = await axios.get(`http://localhost:8000/api/biodiversity/balance`, {
          params: { region: selectedRegion }
        });
        setBalanceData(response.data);
      } catch (error) { console.error("Failed to fetch balance:", error); } 
      finally { setIsBalanceLoading(false); }
    };

    fetchIndices();
    fetchRichness();
    fetchBalance();
  }, [selectedRegion]);

  // 🧬 CHART 1: Biodiversity Indices (Dual Y-Axis)
  const indicesOption = {
    title: { 
      text: `Biodiversity Indices: ${selectedRegion}`, 
      subtext: 'Shannon-Wiener vs. Simpson Diversity tracking over time.',
      left: 'left' 
    },
    tooltip: { trigger: 'axis' },
    legend: { top: 0, right: 0 },
    xAxis: { type: 'category', data: indicesData.dates, boundaryGap: false },
    yAxis: [
      { type: 'value', name: 'Shannon Index', position: 'left', min: 'dataMin' },
      { type: 'value', name: 'Simpson Index', position: 'right', min: 'dataMin', max: 1 }
    ],
    series: [
      {
        name: 'Shannon Index',
        type: 'line',
        yAxisIndex: 0,
        data: indicesData.shannon,
        smooth: true,
        itemStyle: { color: '#10b981' }, 
        areaStyle: { color: 'rgba(16, 185, 129, 0.2)' },
        lineStyle: { width: 3 }
      },
      {
        name: 'Simpson Index',
        type: 'line',
        yAxisIndex: 1,
        data: indicesData.simpson,
        smooth: true,
        itemStyle: { color: '#8b5cf6' },
        lineStyle: { width: 3, type: 'dashed' }
      }
    ]
  };

  // 📊 CHART 2: Species Richness
  const richnessOption = {
    title: { 
      text: 'Species Richness', 
      subtext: 'Observed counts vs. Statistical estimations.',
      left: 'center',
      textStyle: { fontSize: 14 }
    },
    tooltip: { trigger: 'axis' },
    legend: { bottom: 0 },
    xAxis: { type: 'category', data: richnessData.dates },
    yAxis: { type: 'value', name: 'Species Count' },
    series: [
      {
        name: 'Observed',
        type: 'bar',
        data: richnessData.observed,
        itemStyle: { color: '#3b82f6', borderRadius: [4, 4, 0, 0] }
      },
      {
        name: 'Estimated',
        type: 'bar',
        data: richnessData.estimated,
        itemStyle: { color: '#cbd5e1', borderRadius: [4, 4, 0, 0] }
      }
    ]
  };

  // ⚖️ CHART 3: Ecosystem Balance
  const balanceOption = {
    title: { 
      text: 'Ecosystem Balance', 
      subtext: 'Tracking species evenness and functional diversity.',
      left: 'center',
      textStyle: { fontSize: 14 }
    },
    tooltip: { trigger: 'axis' },
    legend: { bottom: 0 },
    xAxis: { type: 'category', data: balanceData.dates },
    yAxis: [
      { type: 'value', name: 'Evenness', position: 'left', min: 0, max: 1 },
      { type: 'value', name: 'Functional Div.', position: 'right' }
    ],
    series: [
      {
        name: 'Evenness',
        type: 'line',
        yAxisIndex: 0,
        data: balanceData.evenness,
        smooth: true,
        itemStyle: { color: '#f59e0b' },
        lineStyle: { width: 3 }
      },
      {
        name: 'Functional Diversity',
        type: 'bar',
        yAxisIndex: 1,
        data: balanceData.functional,
        itemStyle: { color: '#ec4899', borderRadius: [4, 4, 0, 0], opacity: 0.8 },
        barWidth: '40%'
      }
    ]
  };

  return (
    <div className="biodiversity-container">
      <div className="biodiversity-header">
        <h2 className="biodiversity-title">Biodiversity & Ecosystem Health</h2>
        <p className="biodiversity-subtitle">Evaluating ecological resilience, species richness, and structural balance.</p>
      </div>

      <div className="bento-grid">
        <div className="bento-card hero-card">
          <BaseChart option={indicesOption} height="400px" isLoading={isIndicesLoading} />
        </div>

        <div className="bento-card">
          <BaseChart option={richnessOption} height="350px" isLoading={isRichnessLoading} />
        </div>

        <div className="bento-card">
          <BaseChart option={balanceOption} height="350px" isLoading={isBalanceLoading} />
        </div>
      </div>
    </div>
  );
}