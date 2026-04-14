import React from "react";
import StatsCard from "../components/StatsCard";
import "./Home.css";

const Home = () => {
  const statsData = [
    { value: "1,000+", label: "Total Datasets Unified" },
    { value: "20+ TB", label: "Terabytes of Data" },
    { value: "80,000+", label: "Identified Species" },
    { value: "10+", label: "Repositories Integrated" },
    { value: "68/100", label: "Ecosystem Health Index" },
  ];

  return (
    <div className="home-container">
      <div className="hero-section">
        <div className="home-hero-content">
          <h1 className="home-hero-title">
            Unifying the World's Marine Data for Scientific Discovery
          </h1>

          <div className="hero-buttons">
            <button className="home-btn home-btn-primary">
              Upload Data
            </button>

            <button className="home-btn home-btn-secondary">
              Login / Sign Up
            </button>
          </div>
        </div>
      </div>


      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />

      {/* Quick Stats Section */}
      <section className="quick-stats-section">
        <h2 className="stats-heading">Quick Stats</h2>
        <div className="stats-grid">
          {statsData.map((stat, index) => (
            <StatsCard
              key={index}
              value={stat.value}
              label={stat.label}
            />
          ))}
        </div>

      </section>
    </div>
  );
};

export default Home;

