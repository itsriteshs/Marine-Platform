import React from 'react';
import ReactECharts from 'echarts-for-react';

export default function BaseChart({ option, height = '400px', isLoading = false }) {
  
  // 1. Loading State: Shows while FastAPI is running the SQL queries
  if (isLoading) {
    return (
      <div style={{ height, width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f8fafc', borderRadius: '8px', border: '1px dashed #cbd5e1' }}>
        <span style={{ color: '#64748b', fontSize: '0.875rem', fontWeight: '500' }}>Loading visualization...</span>
      </div>
    );
  }

  // 2. Empty State: Protects the app from crashing if data is missing
  if (!option || Object.keys(option).length === 0) {
    return (
      <div style={{ height, width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f8fafc', borderRadius: '8px', border: '1px dashed #cbd5e1' }}>
        <span style={{ color: '#94a3b8', fontSize: '0.875rem' }}>No data available for the selected filters.</span>
      </div>
    );
  }

  // 3. The Chart
  return (
    <ReactECharts
      option={option}
      style={{ height, width: '100%' }}
      opts={{ renderer: 'canvas' }} // Canvas handles large marine datasets much better than SVG
      notMerge={true} // Forces the chart to clear old data completely when filters change
      lazyUpdate={true}
    />
  );
}