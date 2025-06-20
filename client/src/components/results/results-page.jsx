import React, { useState } from "react";
import ResultsSection from "./results-section";

const ResultsPage = () => {
  const [selectedResult, setSelectedResult] = useState(null);

  // Existing content from results-section.jsx
  const results = [
    { id: 1, title: "Result 1", description: "Description for Result 1" },
    { id: 2, title: "Result 2", description: "Description for Result 2" },
    { id: 3, title: "Result 3", description: "Description for Result 3" },
    // Add more results as needed
  ];

  const handleCardClick = (result) => {
    setSelectedResult(result);
  };

  const handleBackClick = () => {
    setSelectedResult(null);
  };

  return (
    <div className="p-6">
      {selectedResult ? (
        <ResultsSection result={selectedResult} onBackClick={handleBackClick} />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {results.map((result) => (
            <div
              key={result.id}
              className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white p-6 rounded-lg shadow-lg hover:scale-105 transition-transform cursor-pointer"
              onClick={() => handleCardClick(result)}
            >
              <h3 className="text-xl font-bold">{result.title}</h3>
              <p className="mt-2">{result.description}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ResultsPage;