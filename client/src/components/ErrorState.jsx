// CertiVault developer header
import React from 'react';

/**
 * ErrorState
 * A reusable component to display error messages.
 *
 * @param {Object} props
 * @param {string} [props.title="An error occurred"] - The main error heading.
 * @param {string} [props.message] - Detailed error description.
 * @param {string} [props.className=""] - Additional Tailwind classes.
 * @param {Function} [props.onRetry] - Optional callback to retry the failed action.
 */
const ErrorState = ({ title = "An error occurred", message, className = "", onRetry }) => {
  return (
    <div className={`flex flex-col items-center justify-center p-8 bg-red-500/5 border border-red-500/20 rounded-xl ${className}`}>
      <div className="w-12 h-12 rounded-full bg-red-500/20 flex items-center justify-center mb-4 text-red-400">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      </div>
      <h3 className="text-lg font-bold text-red-400 mb-2">{title}</h3>
      {message && <p className="text-slate-400 text-center mb-6 max-w-md">{message}</p>}
      
      {onRetry && (
        <button 
          onClick={onRetry}
          className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition-colors border border-slate-700 text-sm font-medium"
        >
          Try Again
        </button>
      )}
    </div>
  );
};

export default ErrorState;
