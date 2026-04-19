// src/pages/Search.jsx
import React, { useState } from "react";
import "./Search.css";

const Search = () => {
  const [activeTab, setActiveTab] = useState("nlp");
  const [nlpQuery, setNlpQuery] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleSearchSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResults(null);

    try {
      let endpoint = "";
      let formData = new FormData();

      if (activeTab === "nlp") {
        endpoint = "http://localhost:8000/api/search/nlp";
        // Sending JSON for text
        const response = await fetch(endpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ query: nlpQuery }),
        });
        const data = await response.json();
        setResults(data);
      } else {
        // Otolith and eDNA require file uploads
        endpoint = activeTab === "otolith" 
          ? "http://localhost:8000/api/search/otolith" 
          : "http://localhost:8000/api/search/edna";
          
        formData.append("file", selectedFile);
        const response = await fetch(endpoint, {
          method: "POST",
          body: formData, // Browser automatically sets the correct multipart headers
        });
        const data = await response.json();
        setResults(data);
      }
    } catch (error) {
      console.error("Search failed:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="search-page bg-slate-50 min-h-screen p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-slate-900 mb-8 text-center">Advanced Analysis</h1>

        {/* Tab Navigation */}
        <div className="tab-container mb-8">
          <button 
            className={`tab-btn ${activeTab === "nlp" ? "active" : ""}`}
            onClick={() => { setActiveTab("nlp"); setSelectedFile(null); }}
          >
            NLP Query
          </button>
          <button 
            className={`tab-btn ${activeTab === "otolith" ? "active" : ""}`}
            onClick={() => { setActiveTab("otolith"); setNlpQuery(""); }}
          >
            Otolith Recognition
          </button>
          <button 
            className={`tab-btn ${activeTab === "edna" ? "active" : ""}`}
            onClick={() => { setActiveTab("edna"); setNlpQuery(""); }}
          >
            eDNA Sequencing
          </button>
        </div>

        {/* Search Input Area */}
        <div className="search-box bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
          <form onSubmit={handleSearchSubmit} className="flex flex-col gap-6">
            
            {activeTab === "nlp" && (
              <div className="input-group">
                <label className="font-bold text-slate-700 mb-2 block">Natural Language Query</label>
                <textarea 
                  placeholder="e.g., Show me all endangered pelagic species found in the Indian Ocean..."
                  className="w-full p-4 border border-slate-300 rounded-xl focus:border-cyan-600 focus:outline-none"
                  rows="4"
                  value={nlpQuery}
                  onChange={(e) => setNlpQuery(e.target.value)}
                  required
                />
              </div>
            )}

            {activeTab === "otolith" && (
              <div className="input-group">
                <label className="font-bold text-slate-700 mb-2 block">Upload Otolith Image</label>
                <p className="text-sm text-slate-500 mb-4">Upload a high-resolution microscopic image for morphological classification.</p>
                <input 
                  type="file" 
                  accept="image/*"
                  onChange={handleFileChange}
                  className="file-input"
                  required
                />
              </div>
            )}

            {activeTab === "edna" && (
              <div className="input-group">
                <label className="font-bold text-slate-700 mb-2 block">Upload eDNA Sequence</label>
                <p className="text-sm text-slate-500 mb-4">Upload FASTA or CSV sequence files for biodiversity matching.</p>
                <input 
                  type="file" 
                  accept=".fasta,.csv,.txt"
                  onChange={handleFileChange}
                  className="file-input"
                  required
                />
              </div>
            )}

            <button type="submit" className="submit-btn" disabled={loading}>
              {loading ? "Processing..." : "Run Analysis"}
            </button>
          </form>
        </div>

        {/* Results Area Placeholder */}
        {results && (
          <div className="results-area mt-8 bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
            <h3 className="text-xl font-bold text-slate-800 mb-4">Analysis Results</h3>
            <pre className="bg-slate-50 p-4 rounded-lg overflow-auto text-sm">
              {JSON.stringify(results, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
};

export default Search;