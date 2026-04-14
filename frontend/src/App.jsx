import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Taxonomy from "./pages/Taxonomy";
import SpeciesDetail from "./pages/SpeciesDetail";
import "./App.css";

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-white">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/taxonomy" element={<Taxonomy />} />
          <Route path="/taxonomy/:id" element={<SpeciesDetail />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

