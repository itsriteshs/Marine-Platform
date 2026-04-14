import React from "react";
import "./StatsCard.css";

const StatsCard = ({ icon: Icon, value, label }) => {
  return (
    <div className="stats-card">
      <div className="stats-card-header">
        <div className="stats-card-icon">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="10" />
            <path d="M12 16v-4" />
            <path d="M12 8h.01" />
          </svg>
        </div>

        <div className="stats-card-value">{value}</div>
      </div>
      <div className="stats-card-label">{label}</div>
    </div>
  );
};

export default StatsCard;

