import React from "react";
// 1. Added Outlet to the import statement
import { BrowserRouter as Router, Routes, Route, Outlet } from "react-router-dom"; 
import Navbar from "./components/Navbar";
import Topbar from './components/Topbar';
import Home from "./pages/Home";
import Taxonomy from "./pages/Taxonomy";
import SpeciesDetail from "./pages/SpeciesDetail";
import Search from "./pages/Search";
import "./App.css";
import Spatial from './pages/modules/Spatial';
import VisualizationsHub from './pages/modules/VisualizationHub';
function DashboardLayout() {
  return (
    <>
      <Topbar />
      <main className="dashboard-layout">
        <Outlet /> {/* The specific module injects here */}
      </main>
    </>
  );
}

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-white">
        <Navbar />
        {/* 2. Removed the global Topbar from here so it doesn't show on every page! */}
        
        <Routes>
          {/* STANDARD PAGES */}
          <Route path="/" element={<Home />} />
          <Route path="/taxonomy" element={<Taxonomy />} />
          <Route path="/taxonomy/:id" element={<SpeciesDetail />} />
          <Route path="/search" element={<Search />} />
          
          {/* DASHBOARD MODULES */}
          <Route path="/modules" element={<DashboardLayout />}>
            <Route index element={<VisualizationsHub />} />
            {/* 3. Changed the path to just "spatial" (it inherits the /modules/ prefix automatically) */}
            <Route path="spatial" element={<Spatial />} />
          </Route>
        </Routes>
      </div>
    </Router>
  );
}

export default App;