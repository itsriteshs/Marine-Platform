import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Taxonomy from "./pages/Taxonomy";
import SpeciesDetail from "./pages/SpeciesDetail";
// import Search from "./pages/Search";
// import Analysis from "./pages/Analysis";
// import UserDashboard from "./pages/UserDashboard";
// import AdminDashboard from "./pages/AdminDashboard";
// import ResearcherDashboard from "./pages/ResearcherDashboard";
// import GeneralUserDashboard from "./pages/GeneralUserDashboard";
// import UploadDataset from "./pages/UploadDataset";
// import Settings from "./pages/Settings";
// import Visualisation from "./pages/Visualisation";
import "./App.css";

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-white">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/taxonomy" element={<Taxonomy />} />
          <Route path="/taxonomy/:id" element={<SpeciesDetail />} />
          <Route path="/search" element={<Search />} />
          <Route path="/analysis" element={<Analysis />} />
          <Route path="/dashboard" element={<UserDashboard />} />
          <Route path="/dashboard/admin" element={<AdminDashboard />} />
          <Route path="/dashboard/researcher" element={<ResearcherDashboard />} />
          <Route path="/dashboard/general" element={<GeneralUserDashboard />} />
          <Route path="/upload" element={<UploadDataset />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/visualization" element={<Visualisation />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
