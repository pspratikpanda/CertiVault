import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { Badge, Button, Card, EmptyState, LoadingState, ErrorState } from '../components';

export default function CredentialList() {
  const [credentials, setCredentials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [revokingId, setRevokingId] = useState(null);
  const [revocationReason, setRevocationReason] = useState('');

  const fetchCredentials = async () => {
    try {
      const response = await api.get('/credentials');
      setCredentials(response.data.data.credentials);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.error?.message || 'Failed to fetch issued credentials.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCredentials();
  }, []);

  const handleRevokeSubmit = async (event) => {
    event.preventDefault();
    if (!revocationReason.trim()) return;

    try {
      await api.post(`/credentials/revoke/${revokingId}`, { reason: revocationReason });
      setCredentials((prev) =>
        prev.map((c) =>
          c.credentialId === revokingId
            ? { ...c, status: 'REVOKED', revocationReason, revokedAt: new Date().toISOString() }
            : c
        )
      );
      setRevokingId(null);
      setRevocationReason('');
    } catch (err) {
      alert(err.response?.data?.error?.message || 'Failed to revoke credential.');
    }
  };

  const filteredCredentials = credentials.filter(
    (c) =>
      c.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.credentialId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.degree.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) return <LoadingState message="Fetching issued credentials..." className="min-h-[50vh]" />;
  if (error) return <ErrorState message={error} onRetry={fetchCredentials} className="min-h-[50vh]" />;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-slate-500">Institution workspace</p>
          <h1 className="mt-1 text-2xl font-semibold tracking-tight">Credentials Log</h1>
        </div>
        <Link to="/institution/credentials/new">
          <Button>Issue credential</Button>
        </Link>
      </div>

      <Card
        className="mt-8"
        header={
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="font-semibold text-slate-900">All Issued Credentials</h2>
              <p className="mt-1 text-sm text-slate-500">Inspect the cryptographic hash-chain state and revocation logs.</p>
            </div>
            <input
              aria-label="Search credentials"
              placeholder="Search by recipient, degree, ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="rounded-md border border-slate-300 px-3 py-2 text-sm bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500 w-full sm:w-64"
            />
          </div>
        }
      >
        {filteredCredentials.length === 0 ? (
          <EmptyState
            title="No credentials found"
            description={
              searchQuery
                ? 'No records match your search criteria. Try a different query.'
                : 'Get started by issuing your institution\'s first academic credential.'
            }
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm border-collapse">
              <thead className="border-b border-slate-200 text-xs uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="pb-3 font-medium">Recipient</th>
                  <th className="pb-3 font-medium">Credential ID</th>
                  <th className="pb-3 font-medium">Degree / award</th>
                  <th className="pb-3 font-medium">Issued Date</th>
                  <th className="pb-3 font-medium">Status</th>
                  <th className="pb-3 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-sans">
                {filteredCredentials.map((cred) => (
                  <tr key={cred._id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-4 font-semibold text-slate-900">{cred.studentName}</td>
                    <td className="py-4 font-mono text-xs text-slate-700">{cred.credentialId}</td>
                    <td className="py-4 text-slate-600">{cred.degree}</td>
                    <td className="py-4 text-slate-500">
                      {new Date(cred.issueDate || cred.createdAt).toLocaleDateString()}
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
                        Verify
                      </Link>
                      {cred.status === 'ACTIVE' ? (
                        <button
                          onClick={() => setRevokingId(cred.credentialId)}
                          className="text-xs font-semibold text-red-600 hover:text-red-800 transition"
                        >
                          Revoke
                        </button>
                      ) : (
                        <span className="text-xs text-slate-400 italic" title={cred.revocationReason}>
                          Revoked
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* Revocation Reason Dialog Modal */}
      {revokingId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-lg max-w-md w-full p-6 shadow-xl border border-slate-100">
            <h3 className="text-lg font-semibold text-slate-900">Revoke Academic Credential</h3>
            <p className="mt-2 text-sm text-slate-500">
              Please enter the official reason for revoking credential <strong>{revokingId}</strong>. This status change will be recorded, leaving the cryptographic ledger block history untouched.
            </p>
            <form onSubmit={handleRevokeSubmit} className="mt-4 space-y-4">
              <div>
                <label htmlFor="reason" className="block text-xs font-bold uppercase tracking-wider text-slate-500">
                  Revocation Reason
                </label>
                <textarea
                  id="reason"
                  rows="3"
                  required
                  placeholder="e.g. Failure to fulfill graduation credits, administrative correction..."
                  value={revocationReason}
                  onChange={(e) => setRevocationReason(e.target.value)}
                  className="mt-2 block w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-red-500 focus:border-red-500"
                />
              </div>
              <div className="flex justify-end gap-3 pt-3">
                <Button variant="secondary" type="button" onClick={() => setRevokingId(null)}>
                  Cancel
                </Button>
                <Button variant="danger" type="submit">
                  Confirm Revocation
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
