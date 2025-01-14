import React from "react";
import Preloader from "./Preloader";

export const LoadingOnError = ({
  isLoading,
  error,
  noData,
  loadingMessage = "Loading...",
  errorMessage = "An error occurred!",
  noDataMessage = "No data available",
}) => {
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center space-x-2">
        <Preloader />
        {/* <div className="w-6 h-6 border-4 border-t-transparent border-blue-500 rounded-full animate-spin"></div> */}
        <span>{loadingMessage}</span>
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500">{errorMessage}</div>;
  }

  if (noData) {
    return <div className="text-gray-500">{noDataMessage}</div>;
  }

  return null;
};
