import React from "react";

export const Cards = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="max-w-sm w-full bg-white rounded-lg shadow-lg overflow-hidden transition-all duration-300 ease-in-out transform hover:scale-105 group">
        <div className="p-5">
          <h2 className="text-2xl font-bold mb-2 text-gray-800">Hover Me</h2>
          <p className="text-gray-600 mb-4">
            This card changes its image when hovered. Try it out!
          </p>
        </div>
        <div className="relative h-64 overflow-hidden">
          <img
            src="/placeholder.svg?height=300&width=400"
            alt="Default Image"
            className="absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ease-in-out group-hover:opacity-0"
          />
          <img
            src="/placeholder.svg?height=300&width=400&text=Hovered+Image"
            alt="Hover Image"
            className="absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ease-in-out opacity-0 group-hover:opacity-100"
          />
        </div>
      </div>
    </div>
  );
};
