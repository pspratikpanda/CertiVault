import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { Badge, Button, Card, EmptyState, LoadingState, ErrorState } from '../components';

export default function InstitutionDashboard() {
  const [credentials, setCredentials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDashboardData = async () => {
    try {
      const response = await api.get('/credentials');
      setCredentials(response.data.data.credentials);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.error?.message || 'Failed to fetch dashboard data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  if (loading) return <LoadingState message="Loading dashboard statistics..." className="min-h-[50vh]" />;
  if (error) return <ErrorState message={error} onRetry={fetchDashboardData} className="min-h-[50vh]" />;

  const totalIssued = credentials.length;
  const activeCount = credentials.filter((c) => c.status === 'ACTIVE').length;
  const revokedCount = credentials.filter((c) => c.status === 'REVOKED').length;

  const recentCredentials = credentials.slice(0, 3);

  const metrics = [
    ['Credentials Issued', totalIssued],
    ['Active Credentials', activeCount],
    ['Revoked Credentials', revokedCount],
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-slate-500">Institution workspace</p>
          <h1 className="mt-1 text-2xl font-semibold tracking-tight">Overview</h1>
        </div>
        <Link to="/institution/credentials/new">
          <Button>Issue credential</Button>
        </Link>
      </div>

      <div className="mt-8 grid gap-4 md:grid-cols-3">
        {metrics.map(([label, value]) => (
          <Card key={label}>
            <p className="text-sm text-slate-500">{label}</p>
            <p className="mt-3 text-3xl font-semibold tracking-tight text-slate-900">{value}</p>
            <p className="mt-2 text-xs text-slate-400">Live ledger metric</p>
          </Card>
        ))}
      </div>

      <Card
        className="mt-6"
        header={
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-semibold text-slate-900">Recent Credentials</h2>
              <p className="mt-1 text-sm text-slate-500">Latest credential issuances recorded on ledger.</p>
            </div>
            <Link to="/institution/credentials" className="text-sm font-semibold text-cyan-600 hover:text-cyan-800 transition">
              View all
            </Link>
          </div>
        }
      >
        {recentCredentials.length === 0 ? (
          <EmptyState
            title="No credentials issued"
            description="You haven't issued any academic certificates yet. Start by publishing one."
          />
        ) : (
          <div className="divide-y divide-slate-100">
            {recentCredentials.map((c) => (
              <div key={c._id} className="flex items-center justify-between py-4 text-sm">
                <div className="flex flex-col gap-0.5">
                  <span className="font-semibold text-slate-900">{c.studentName}</span>
                  <span className="text-slate-500 text-xs">{c.degree} · ID: {c.credentialId}</span>
                </div>
                <Badge tone={c.status === 'ACTIVE' ? 'success' : 'danger'}>
                  {c.status}
                </Badge>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
