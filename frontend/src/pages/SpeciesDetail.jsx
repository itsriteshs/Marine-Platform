import React from "react";
import { useParams } from "react-router-dom";

const SpeciesDetail = () => {
  const { id } = useParams();
  
  return (
    <div className="container mx-auto px-8 py-12">
      <div className="max-w-4xl mx-auto">
        <nav className="mb-8 font-medium text-blue-600">
          <a href="/taxonomy">← Back to Taxonomy</a>
        </nav>
        
        <header className="mb-12">
          <h1 className="text-5xl font-extrabold text-gray-900 mb-4">Species Detailed View</h1>
          <p className="text-xl text-gray-500 italic">Unique Identifier: {id}</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-12">
          <div className="aspect-video bg-gray-100 rounded-3xl flex items-center justify-center border-2 border-dashed border-gray-200">
            <span className="text-gray-400">Species Image Preview</span>
          </div>
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Classification Details</h2>
            <ul className="space-y-4">
              <li className="flex justify-between border-b pb-2">
                <span className="text-gray-500">Kingdom</span>
                <span className="font-semibold">Animalia</span>
              </li>
              <li className="flex justify-between border-b pb-2">
                <span className="text-gray-500">Phylum</span>
                <span className="font-semibold">Chordata</span>
              </li>
              <li className="flex justify-between border-b pb-2">
                <span className="text-gray-500">Class</span>
                <span className="font-semibold">Actinopterygii</span>
              </li>
            </ul>
          </div>
        </div>

        <section className="bg-blue-50 p-8 rounded-3xl">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">Conservation Status</h3>
          <p className="text-blue-900 leading-relaxed">
            This section would contain information about the current population trends, threats, and conservation efforts directed at this species. Data is pulled from the latest IUCN Red List updates.
          </p>
        </section>
      </div>
    </div>
  );
};

export default SpeciesDetail;
