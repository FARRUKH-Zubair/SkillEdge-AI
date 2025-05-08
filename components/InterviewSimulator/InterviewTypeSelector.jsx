"use client";

import { useState, useEffect } from "react";

export default function InterviewTypeSelector() {
  const [selectedType, setSelectedType] = useState("technical");
  const [isLoaded, setIsLoaded] = useState(false);

  const interviewTypes = [
    {
      id: "technical",
      name: "Technical",
      description: "Coding, algorithms, and system design questions.",
      bg: "bg-blue-600",
      hover: "hover:bg-blue-700",
      ring: "ring-blue-400",
      accent: "text-blue-400",
    },
    {
      id: "behavioral",
      name: "Behavioral",
      description: "STAR method, soft skills, and communication.",
      bg: "bg-green-600",
      hover: "hover:bg-green-700",
      ring: "ring-green-400",
      accent: "text-green-400",
    },
  ];

  const handleContinue = () => {
    window.location.href = `/interview-simulator?type=${selectedType}`;
  };

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  return (
    <div
      className={`min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white flex flex-col items-center justify-center px-4 transition-opacity duration-1000 ${
        isLoaded ? "opacity-100" : "opacity-0"
      }`}
    >
      <h1 className="text-4xl font-bold mb-10 text-gray-100">Select Interview Type</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-3xl w-full">
        {interviewTypes.map((type) => {
          const isSelected = selectedType === type.id;
          return (
            <div
              key={type.id}
              onClick={() => setSelectedType(type.id)}
              className={`cursor-pointer transform transition-all duration-300 hover:scale-105 rounded-xl p-6 shadow-lg border-2 ${
                isSelected
                  ? `bg-gray-800 border-transparent ring-2 ${type.ring}`
                  : "bg-gray-800 border-gray-600 hover:border-gray-500"
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <h2 className={`text-2xl font-semibold ${type.accent}`}>{type.name}</h2>
                {isSelected && (
                  <span className={`px-2 py-1 rounded text-white text-sm ${type.bg}`}>
                    Selected
                  </span>
                )}
              </div>
              <p className="text-gray-400">{type.description}</p>
            </div>
          );
        })}
      </div>

      <button
        onClick={handleContinue}
        className={`mt-10 px-6 py-3 rounded-lg font-semibold shadow-md transition-transform hover:scale-105 duration-300 ${
          selectedType === "technical"
            ? "bg-blue-600 hover:bg-blue-700"
            : "bg-green-600 hover:bg-green-700"
        }`}
      >
        Continue
      </button>
    </div>
  );
}
