// CertiVault developer header
import React from 'react';

const LandingPage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 md:p-12">
      <div className="w-full max-w-3xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-8 md:p-12 text-center relative overflow-hidden">
        
        {/* Subtle glowing effect behind the card */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-32 bg-blue-600/10 blur-3xl rounded-full pointer-events-none"></div>

        <div className="relative z-10">
          <span className="inline-block px-3 py-1 mb-6 text-xs font-semibold tracking-wider text-blue-400 uppercase bg-blue-500/10 border border-blue-500/20 rounded-full">
            Frontend Foundation
          </span>
          
          <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight mb-4">
            CertiVault
          </h1>
          
          <h2 className="text-xl md:text-2xl font-medium text-slate-300 mb-6">
            Tamper-Proof Academic Credential Verification
          </h2>
          
          <p className="text-base md:text-lg text-slate-400 leading-relaxed max-w-2xl mx-auto">
            Securely issue, verify, and validate academic credentials using a simplified tamper-evident hash-chain ledger.
          </p>
          
          <div className="mt-10 pt-8 border-t border-slate-800/80">
            <button className="px-8 py-3 bg-blue-600 hover:bg-blue-500 text-white font-medium rounded-lg transition-colors shadow-lg shadow-blue-500/20 border border-blue-500">
              System Ready
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
