import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/useAuth';
import { Button, Card, Badge, LoadingState, ErrorState } from '../components';

export default function AdminPlayground() {
  const { user, refreshSession } = useAuth();
  const navigate = useNavigate();
  const [data, setData] = useState({ credentials: [], ledgerBlocks: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tamperingId, setTamperingId] = useState(null);
  const [successMsg, setSuccessMsg] = useState('');
  const [promoting, setPromoting] = useState(false);

  const isAdmin = user?.role === 'ADMIN';

  const fetchData = async () => {
    try {
      const response = await api.get('/admin/playground');
      setData(response.data.data);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.error?.message || 'Failed to fetch database collections.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handlePromoteSelf = async () => {
    if (!window.confirm('This will upgrade your account to ADMIN role for this hackathon demo. You will need to log out and log back in. Proceed?')) return;
    setPromoting(true);
    try {
      await api.post('/admin/promote-self');
      await refreshSession();
      // Role change only takes effect on next session token — prompt re-login
      alert('Role elevated! Please log out and log back in to get your new ADMIN session token.');
      navigate('/login');
    } catch (err) {
      alert(err.response?.data?.error?.message || 'Promotion failed.');
    } finally {
      setPromoting(false);
    }
  };

  const handleTamper = async (credentialId) => {
    if (!window.confirm('Are you sure you want to bypass the application logic and directly tamper with this MongoDB record? This will change the recipient name and break the cryptographic integrity checks.')) {
      return;
    }
    setTamperingId(credentialId);
    setSuccessMsg('');
    try {
      await api.post(`/admin/tamper/${credentialId}`);
      setSuccessMsg(`Successfully tampered with credential: ${credentialId}. Recipient name changed in MongoDB!`);
      await fetchData();
    } catch (err) {
      if (err.response?.status === 403) {
        alert('Access denied: You need ADMIN role to tamper. Click "Become Admin (Demo)" to elevate your role.');
      } else {
        alert(err.response?.data?.error?.message || 'Tamper action failed.');
      }
    } finally {
      setTamperingId(null);
    }
  };

  if (loading) return <LoadingState message="Connecting to MongoDB collections..." className="min-h-[60vh]" />;
  if (error) return <ErrorState message={error} onRetry={fetchData} className="min-h-[60vh]" />;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-cyan-600">Administrative Sandbox</p>
          <h1 className="mt-1 text-3xl font-semibold tracking-tight">Database & Ledger Playground</h1>
          <p className="mt-2 text-sm text-slate-600 max-w-3xl">
            Observe how the immutable hash-chain ledger is synchronized with active MongoDB collections. Click the
            <strong> "Tamper"</strong> button to simulate a database injection bypass and see the validation checks fail in real-time.
          </p>
        </div>
        <div className="flex flex-col items-end gap-2 shrink-0">
          <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold ring-1 ring-inset ${isAdmin ? 'bg-amber-50 text-amber-700 ring-amber-600/20' : 'bg-slate-100 text-slate-600 ring-slate-600/10'}`}>
            {isAdmin ? '🔐 ADMIN SESSION' : '🔒 INSTITUTION SESSION'}
          </span>
          {!isAdmin && (
            <Button size="sm" variant="secondary" onClick={handlePromoteSelf} disabled={promoting}>
              {promoting ? 'Promoting...' : 'Become Admin (Demo)'}
            </Button>
          )}
        </div>
      </div>

      {!isAdmin && (
        <div className="mb-6 rounded-md bg-blue-50 border border-blue-200 p-4 text-sm text-blue-800">
          <span className="font-semibold">ℹ️ Demo Setup Required:</span> The <strong>Tamper</strong> button requires an <strong>ADMIN</strong> session. Click <em>"Become Admin (Demo)"</em> above, then log out and log back in to activate ADMIN mode.
        </div>
      )}

      {successMsg && (
        <div className="mb-6 rounded-md bg-amber-50 border border-amber-200 p-4 text-sm text-amber-800">
          <span className="font-semibold">⚠️ Database Altered:</span> {successMsg}
        </div>
      )}

      <div className="grid gap-8 lg:grid-cols-1">
        {/* Credentials Section */}
        <Card
          header={
            <div>
              <h2 className="text-lg font-semibold text-slate-900">Credentials Collection (MongoDB)</h2>
              <p className="text-xs text-slate-500">Represents the application collection storing credential records.</p>
            </div>
          }
        >
          {data.credentials.length === 0 ? (
            <p className="text-slate-500 text-sm py-4 text-center">No credential records issued yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm border-collapse">
                <thead className="border-b border-slate-200 text-xs uppercase tracking-wide text-slate-500">
                  <tr>
                    <th className="pb-3 font-medium">Credential ID</th>
                    <th className="pb-3 font-medium">Recipient</th>
                    <th className="pb-3 font-medium">Degree / Award</th>
                    <th className="pb-3 font-medium">Stored Hash (SHA-256)</th>
                    <th className="pb-3 font-medium">Status</th>
                    <th className="pb-3 font-medium text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-sans">
                  {data.credentials.map((cred) => (
                    <tr key={cred._id} className="hover:bg-slate-50 transition-colors">
                      <td className="py-4 font-mono text-xs text-slate-700">{cred.credentialId}</td>
                      <td className="py-4 font-semibold text-slate-900">{cred.studentName}</td>
                      <td className="py-4 text-slate-600">{cred.degree}</td>
                      <td className="py-4 font-mono text-xs text-slate-500" title={cred.credentialHash}>
                        {cred.credentialHash.substring(0, 16)}...
                      </td>
                      <td className="py-4">
                        <Badge tone={cred.status === 'ACTIVE' ? 'success' : 'danger'}>
                          {cred.status}
                        </Badge>
                      </td>
                      <td className="py-4 text-right space-x-3">
                        <Link
                          to={`/verify/${cred.credentialId}`}
                          target="_blank"
                          rel="noreferrer"
                          className="text-xs font-semibold text-cyan-600 hover:text-cyan-800 transition"
                        >
                          Verify Status
                        </Link>
                        <Button
                          variant="danger"
                          size="xs"
                          onClick={() => handleTamper(cred.credentialId)}
                          disabled={tamperingId === cred.credentialId || cred.studentName === 'Tampered'}
                        >
                          {tamperingId === cred.credentialId ? 'Tampering...' : 'Tamper'}
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>

        {/* Ledger blocks Section */}
        <Card
          header={
            <div>
              <h2 className="text-lg font-semibold text-slate-900">Hash-Chain Ledger blocks (Auditing Log)</h2>
              <p className="text-xs text-slate-500">Tamper-evident, linked cryptographic block records stored in MongoDB.</p>
            </div>
          }
        >
          {data.ledgerBlocks.length === 0 ? (
            <p className="text-slate-500 text-sm py-4 text-center">Ledger is empty. Issue a credential to append blocks.</p>
          ) : (
            <div className="space-y-4">
              {data.ledgerBlocks.map((block) => (
                <div
                  key={block._id}
                  className="rounded-lg border border-slate-200 bg-slate-50 p-4 transition-shadow hover:shadow-md"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 pb-2 mb-3">
                    <span className="text-xs font-bold text-slate-950 uppercase tracking-wide">
                      Block #{block.index} {block.index === 0 && <span className="text-cyan-600">(Genesis Block)</span>}
                    </span>
                    <span className="text-xs text-slate-500 font-mono">
                      {new Date(block.timestamp).toLocaleString()}
                    </span>
                  </div>
                  <div className="grid gap-2 text-xs font-mono text-slate-700">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-slate-500 w-24">Credential:</span>
                      <span>{block.credentialId}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-slate-500 w-24">Data Hash:</span>
                      <span className="text-slate-950 break-all">{block.dataHash}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-slate-500 w-24">Prev Hash:</span>
                      <span className="text-slate-500 break-all">{block.previousHash}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-slate-500 w-24">Block Hash:</span>
                      <span className="text-cyan-700 break-all font-bold">{block.blockHash}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
