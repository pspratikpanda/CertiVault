// CertiVault developer header
import React from 'react';
import { Link } from 'react-router-dom';

/**
 * ApplicationHeader
 * A shared top navigation header for the application.
 *
 * @param {Object} props
 * @param {string} [props.title="CertiVault"] - The application title displayed in the header.
 */
const ApplicationHeader = ({ title = "CertiVault" }) => {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-800 bg-slate-950/80 backdrop-blur-md">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded bg-blue-600 flex items-center justify-center font-bold text-white shadow-lg shadow-blue-500/20">
            C
          </div>
          <span className="text-xl font-bold tracking-tight text-white">{title}</span>
        </Link>
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-300">
          <Link to="/institution/dashboard" className="hover:text-white transition-colors">Dashboard</Link>
          <Link to="/ledger" className="hover:text-white transition-colors">Ledger</Link>
        </nav>
      </div>
    </header>
  );
};

export default ApplicationHeader;
