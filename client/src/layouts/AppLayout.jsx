// CertiVault developer header
import React from 'react';
import ApplicationHeader from '../components/ApplicationHeader';

const AppLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans selection:bg-blue-500/30">
      <ApplicationHeader />
      <main className="w-full h-full">
        {children}
      </main>
    </div>
  );
};

export default AppLayout;
