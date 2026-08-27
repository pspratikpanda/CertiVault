/**
 * @file LandingPage.jsx
 * @description Landing page component introducing CertiVault platform and displaying live API health status.
 * @layer Client Page
 * @interacts services/api.js
 * @futureWork Integrate quick credential verification lookup form in Step 10.
 * @nonGoal Do not embed authentication state mutations or dashboard controls directly here.
 */

import React, { useEffect, useState } from 'react';
import { checkHealth } from '../services/api';

export default function LandingPage() {
  const [healthStatus, setHealthStatus] = useState({ loading: true, data: null, error: null });

  useEffect(() => {
    let isMounted = true;
    const fetchHealth = async () => {
      try {
        const res = await checkHealth();
        if (isMounted) {
          setHealthStatus({ loading: false, data: res, error: null });
        }
      } catch (err) {
        if (isMounted) {
          setHealthStatus({
            loading: false,
            data: null,
            error: err.response?.data?.error?.message || err.message || 'Failed to reach API backend',
          });
        }
      }
    };
    fetchHealth();
    return () => { isMounted = false; };
  }, []);

  return (
    <div className="relative overflow-hidden py-16 sm:py-24">
      {/* Glow background effects */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-600/15 blur-[140px] rounded-full pointer-events-none" />
      <div className="absolute top-1/3 right-10 w-[400px] h-[400px] bg-purple-600/10 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Hero Banner */}
        <div className="text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-xs text-slate-300 mb-6 shadow-inner">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-semibold text-emerald-400">Step 1 Active:</span> Architecture & Health Subsystem Ready
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white leading-tight">
            Tamper-Evident <br />
            <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Digital Credential Vault
            </span>
          </h1>

          <p className="mt-6 text-lg sm:text-xl text-slate-400 leading-relaxed">
            CertiVault provides academic institutions with single-node cryptographic tamper-evident credential verification powered by digital signatures and SHA-256 hash chains.
          </p>

          {/* API Health Monitor Box */}
          <div id="api" className="mt-10 p-6 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-xl max-w-xl mx-auto text-left shadow-2xl">
            <div className="flex items-center justify-between mb-4 border-b border-slate-800/80 pb-3">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-indigo-500" />
                Backend Connection Monitor
              </span>
              <span className="text-xs text-slate-500 font-mono">GET /api/health</span>
            </div>

            {healthStatus.loading ? (
              <div className="flex items-center gap-3 text-sm text-slate-400 py-2">
                <div className="w-4 h-4 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
                Checking API server connectivity...
              </div>
            ) : healthStatus.error ? (
              <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-300 text-sm flex items-center justify-between">
                <div>
                  <div className="font-semibold">Backend Unreachable</div>
                  <div className="text-xs text-rose-400/80">{healthStatus.error}</div>
                </div>
                <button
                  onClick={() => {
                    setHealthStatus({ loading: true, data: null, error: null });
                    checkHealth()
                      .then((res) => setHealthStatus({ loading: false, data: res, error: null }))
                      .catch((err) => setHealthStatus({ loading: false, data: null, error: err.message }));
                  }}
                  className="px-3 py-1 bg-rose-500/20 hover:bg-rose-500/30 border border-rose-500/30 rounded text-xs text-rose-200 transition-colors"
                >
                  Retry
                </button>
              </div>
            ) : (
              <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-slate-200">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-sm shadow-emerald-400/50" />
                    <span className="text-sm font-semibold text-emerald-300">API Operational</span>
                  </div>
                  <span className="text-xs px-2 py-0.5 rounded bg-emerald-950/80 text-emerald-400 font-mono border border-emerald-800/40">
                    HTTP 200 OK
                  </span>
                </div>
                <pre className="text-xs font-mono bg-slate-950 p-3 rounded-lg text-emerald-400 border border-slate-900 overflow-x-auto">
{JSON.stringify(healthStatus.data, null, 2)}
                </pre>
              </div>
            )}
          </div>
        </div>

        {/* System Architecture Highlights */}
        <div id="features" className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          <div className="p-6 rounded-2xl bg-slate-900/40 border border-slate-800/60 backdrop-blur-sm hover:border-indigo-500/30 transition-all duration-300">
            <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 mb-4">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457-.39-2.823-1.07-4" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Digital Signatures</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Academic institutions sign credential hashes using asymmetric cryptography (RSA key pairs), protecting authenticity at rest and in transit.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/40 border border-slate-800/60 backdrop-blur-sm hover:border-purple-500/30 transition-all duration-300">
            <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 mb-4">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Hash-Chain Ledger</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Every issuance creates a block linking back to the previous block hash in MongoDB, allowing immediate detection of unauthorized modifications.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/40 border border-slate-800/60 backdrop-blur-sm hover:border-pink-500/30 transition-all duration-300">
            <div className="w-12 h-12 rounded-xl bg-pink-500/10 border border-pink-500/20 flex items-center justify-center text-pink-400 mb-4">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Instant Verification</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Verifiers and employers can instantly check credential authenticity via direct link or QR code lookup without institutional intervention.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
