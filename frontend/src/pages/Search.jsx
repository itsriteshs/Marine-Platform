// src/pages/Search.jsx
import React, { useState } from "react";
import "./Search.css";
import OtolithResults from "../components/OtolithResults";
import EdnaResults from "../components/EdnaResults"; // Make sure you have this!

const Search = () => {
  const [activeTab, setActiveTab] = useState("nlp");

  // --- INDEPENDENT STATES FOR EACH TAB ---
  
  // NLP State
  const [nlpQuery, setNlpQuery] = useState("");
  const [nlpLoading, setNlpLoading] = useState(false);
  const [nlpResults, setNlpResults] = useState(null);

  // Otolith State
  const [otolithFile, setOtolithFile] = useState(null);
  const [otolithLoading, setOtolithLoading] = useState(false);
  const [otolithResults, setOtolithResults] = useState(null);

  // eDNA State
  const [ednaFile, setEdnaFile] = useState(null);
  const [ednaLoading, setEdnaLoading] = useState(false);
  const [ednaResults, setEdnaResults] = useState(null);

  // --- INDEPENDENT SUBMIT LOGIC ---

  const handleSearchSubmit = async (e) => {
    e.preventDefault();

    if (activeTab === "nlp") {
      setNlpLoading(true);
      setNlpResults(null);
      try {
        const response = await fetch("http://localhost:8000/api/search/nlp", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ query: nlpQuery }),
        });
        setNlpResults(await response.json());
      } catch (error) {
        setNlpResults({ error: "Failed to connect to NLP service." });
      } finally {
        setNlpLoading(false);
      }
    } 
    
    else if (activeTab === "otolith") {
      setOtolithLoading(true);
      setOtolithResults(null);
      let formData = new FormData();
      formData.append("file", otolithFile);
      try {
        const response = await fetch("http://localhost:8001/analyze", {
          method: "POST",
          body: formData,
        });
        setOtolithResults(await response.json());
      } catch (error) {
        setOtolithResults({ error: "Failed to connect to Otolith service." });
      } finally {
        setOtolithLoading(false);
      }
    } 
    
    else if (activeTab === "edna") {
      setEdnaLoading(true);
      setEdnaResults(null);
      let formData = new FormData();
      formData.append("file", ednaFile);
      try {
        const response = await fetch("http://localhost:8002/analyze_edna", {
          method: "POST",
          body: formData,
        });
        setEdnaResults(await response.json());
      } catch (error) {
        setEdnaResults({ error: "Failed to connect to eDNA service." });
      } finally {
        setEdnaLoading(false);
      }
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
            onClick={() => setActiveTab("nlp")}
          >
            NLP Query
          </button>
          <button 
            className={`tab-btn ${activeTab === "otolith" ? "active" : ""}`}
            onClick={() => setActiveTab("otolith")}
          >
            Otolith Recognition
          </button>
          <button 
            className={`tab-btn ${activeTab === "edna" ? "active" : ""}`}
            onClick={() => setActiveTab("edna")}
          >
            eDNA Sequencing
          </button>
        </div>

        {/* Search Input Area */}
        <div className="search-box bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
          <form onSubmit={handleSearchSubmit} className="flex flex-col gap-6">
            
            {/* NLP TAB */}
            {activeTab === "nlp" && (
              <>
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
                <button type="submit" className="submit-btn" disabled={nlpLoading}>
                  {nlpLoading ? "Processing Query..." : "Run Analysis"}
                </button>
              </>
            )}

            {/* OTOLITH TAB */}
            {activeTab === "otolith" && (
              <>
                <div className="input-group">
                  <label className="font-bold text-slate-700 mb-2 block">Upload Otolith Image</label>
                  <p className="text-sm text-slate-500 mb-4">Upload a high-resolution microscopic image for morphological classification.</p>
                  <input 
                    type="file" 
                    accept="image/*"
                    onChange={(e) => setOtolithFile(e.target.files[0])}
                    className="file-input"
                    required
                  />
                </div>
                <button type="submit" className="submit-btn" disabled={otolithLoading}>
                  {otolithLoading ? "Analyzing Image..." : "Run Analysis"}
                </button>
              </>
            )}

            {/* eDNA TAB */}
            {activeTab === "edna" && (
              <>
                <div className="input-group">
                  <label className="font-bold text-slate-700 mb-2 block">Upload eDNA Sequence</label>
                  <p className="text-sm text-slate-500 mb-4">Upload FASTA or CSV sequence files for biodiversity matching.</p>
                  <input 
                    type="file" 
                    accept=".fasta,.csv,.txt"
                    onChange={(e) => setEdnaFile(e.target.files[0])}
                    className="file-input"
                    required
                  />
                </div>
                <button type="submit" className="submit-btn" disabled={ednaLoading}>
                  {ednaLoading ? "Sequencing DNA (This may take a few minutes)..." : "Run Analysis"}
                </button>
              </>
            )}
          </form>
        </div>

        {/* --- DYNAMIC RESULTS AREA --- */}
        <div className="mt-8">
          
          {/* NLP Results */}
          {activeTab === "nlp" && nlpResults && (
            nlpResults.error ? (
              <div className="bg-red-50 p-6 rounded-2xl border border-red-200 text-red-700">{nlpResults.error}</div>
            ) : (
              <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
                <h3 className="text-xl font-bold text-slate-800 mb-4">NLP Results</h3>
                <pre className="bg-slate-50 p-4 rounded-lg overflow-auto text-sm">
                  {JSON.stringify(nlpResults, null, 2)}
                </pre>
              </div>
            )
          )}

          {/* Otolith Results */}
          {activeTab === "otolith" && otolithResults && (
            otolithResults.error ? (
              <div className="bg-red-50 p-6 rounded-2xl border border-red-200 text-red-700">{otolithResults.error}</div>
            ) : (
              <OtolithResults results={otolithResults} />
            )
          )}

          {/* eDNA Results */}
          {activeTab === "edna" && ednaResults && (
            ednaResults.error ? (
              <div className="bg-red-50 p-6 rounded-2xl border border-red-200 text-red-700">{ednaResults.error}</div>
            ) : (
              <EdnaResults results={ednaResults} />
            )
          )}

        </div>
      </div>
    </div>
  );
};

export default Search;