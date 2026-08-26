// CertiVault developer header
import React from 'react';
import { useParams } from 'react-router-dom';

const VerifyCredential = () => {
  const { id } = useParams();
  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh]">
      <h1 className="text-3xl font-bold mb-4">Verify Credential</h1>
      <p className="text-slate-400">Placeholder for /verify/:id</p>
      {id && <p className="mt-4 text-blue-400 font-mono bg-blue-900/30 px-3 py-1 rounded">ID: {id}</p>}
    </div>
  );
};

export default VerifyCredential;
