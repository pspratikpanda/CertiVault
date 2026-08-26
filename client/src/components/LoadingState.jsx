// CertiVault developer header
import React from 'react';

/**
 * LoadingState
 * A reusable loading spinner and message component.
 *
 * @param {Object} props
 * @param {string} [props.message="Loading..."] - The text to display below the spinner.
 * @param {string} [props.className=""] - Additional Tailwind classes.
 */
const LoadingState = ({ message = "Loading...", className = "" }) => {
  return (
    <div className={`flex flex-col items-center justify-center p-8 ${className}`}>
      <div className="w-8 h-8 border-4 border-slate-700 border-t-blue-500 rounded-full animate-spin mb-4"></div>
      <p className="text-slate-400 font-medium">{message}</p>
    </div>
  );
};

export default LoadingState;
