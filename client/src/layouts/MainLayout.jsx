/**
 * @file MainLayout.jsx
 * @description Main application layout template featuring navigation header, main content wrapper, and footer.
 * @layer Client Layout
 * @interacts React Router Outlet, Navigation Links
 * @futureWork Add authenticated user navigation dropdown and status indicator.
 * @nonGoal Do not embed route-specific page components directly in layout.
 */

import React from 'react';
import { Outlet, Link } from 'react-router-dom';

export default function MainLayout() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-slate-900/80 border-b border-slate-800/80">
        <div className="max-w-7xl mx-mx auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 p-0.5 shadow-lg shadow-indigo-500/20 group-hover:shadow-indigo-500/40 transition-all duration-300">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <svg className="w-5 h-5 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
            </div>
            <div>
              <span className="text-xl font-bold bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
                CertiVault
              </span>
              <span className="hidden sm:inline-block ml-2 text-xs font-medium px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                Single-Node Ledger
              </span>
            </div>
          </Link>

          <nav className="flex items-center gap-6 text-sm font-medium text-slate-300">
            <Link to="/" className="hover:text-indigo-400 transition-colors">Home</Link>
            <a href="#features" className="hover:text-indigo-400 transition-colors">Architecture</a>
            <a href="#api" className="hover:text-indigo-400 transition-colors">API Health</a>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-950 py-8 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4">
          <p>© 2026 CertiVault — Tamper-Evident Credential Verification System.</p>
          <p className="mt-1 text-slate-600">Built with Node.js, Express, React, and MongoDB single-node hash-chain architecture.</p>
        </div>
      </footer>
    </div>
  );
}
