import React from "react";

const Taxonomy = () => {
  return (
    <div className="container mx-auto px-8 py-12">
      <h1 className="text-4xl font-extrabold text-gray-900 mb-8">Marine Species Taxonomy</h1>
      <p className="text-lg text-gray-600 mb-12 max-w-2xl">
        Explore the hierarchical classification of marine life, from kingdoms to species. 
        Our database integrates data from multiple global repositories.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="p-6 bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-blue-100 rounded-lg mb-4 flex items-center justify-center">
              <span className="text-blue-600 font-bold">#{i}</span>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Species Category {i}</h3>
            <p className="text-gray-500 mb-4 text-sm">Brief description of the species group and its importance to marine ecology.</p>
            <button className="text-blue-600 font-semibold hover:underline">View Details →</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Taxonomy;
