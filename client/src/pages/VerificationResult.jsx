import { useCallback, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import api from '../services/api';
import { Badge, Button, Card, LoadingState } from '../components';

export default function VerificationResult() {
  const { credentialId } = useParams();
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchVerification = useCallback(async () => {
    try {
      const response = await api.get(`/credentials/verify/${credentialId}`);
      setResult(response.data.data);
      setError(null);
    } catch (err) {
      if (err.response?.status === 404) {
        setError('Credential record not found. Please verify the ID is correct.');
      } else {
        setError(err.response?.data?.error?.message || 'Verification service is temporarily unavailable.');
      }
    } finally {
      setLoading(false);
    }
  }, [credentialId]);

  useEffect(() => {
    fetchVerification();
  }, [fetchVerification]);

  if (loading) return <LoadingState message="Connecting to verification ledger..." className="min-h-[50vh]" />;

  if (error) {
    return (
      <div className="mx-auto max-w-3xl px-5 py-12 text-center">
        <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-full bg-red-100 text-3xl text-red-600">
          ✕
        </div>
        <h1 className="text-2xl font-bold text-slate-900">Verification Failure</h1>
        <p className="mt-2 text-slate-600 max-w-md mx-auto">{error}</p>
        <div className="mt-8">
          <Link to="/verify">
            <Button>Verify Another Credential</Button>
          </Link>
        </div>
      </div>
    );
  }

  const { valid, revoked, errors, credential } = result;

  // Determine state type
  let statusType = 'VERIFIED'; // VERIFIED, REVOKED, TAMPERED
  if (!valid) {
    statusType = 'TAMPERED';
  } else if (revoked) {
    statusType = 'REVOKED';
  }

  return (
    <div className="mx-auto max-w-3xl px-5 py-12 font-sans">
      <Link to="/verify" className="text-sm font-semibold text-cyan-700 hover:text-cyan-800 transition">
        ← Verify another credential
      </Link>

      {/* VERIFIED/AUTHENTIC STATE */}
      {statusType === 'VERIFIED' && (
        <div className="mt-7 flex flex-col items-start gap-4 rounded-lg border border-emerald-200 bg-emerald-50/60 p-6 sm:flex-row shadow-sm">
          <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-emerald-600 text-xl font-bold text-white shadow">
            ✓
          </span>
          <div>
            <Badge tone="success">VERIFIED & SECURE</Badge>
            <h1 className="mt-3 text-2xl font-semibold tracking-tight text-slate-950">
              Credential Authenticity Confirmed
            </h1>
            <p className="mt-2 text-sm leading-6 text-emerald-800">
              The digital signature is authentic, the integrity check succeeded, and this certificate is recorded on the tamper-evident hash-chain ledger.
            </p>
          </div>
        </div>
      )}

      {/* REVOKED STATE */}
      {statusType === 'REVOKED' && (
        <div className="mt-7 flex flex-col items-start gap-4 rounded-lg border border-amber-200 bg-amber-50/60 p-6 sm:flex-row shadow-sm">
          <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-amber-500 text-xl font-bold text-white shadow">
            !
          </span>
          <div>
            <Badge tone="warning">REVOKED</Badge>
            <h1 className="mt-3 text-2xl font-semibold tracking-tight text-slate-950">
              Credential Has Been Revoked
            </h1>
            <p className="mt-2 text-sm leading-6 text-amber-800">
              This certificate was cryptographically issued but has since been revoked by the issuing institution.
            </p>
            {credential.revocationReason && (
              <div className="mt-3 rounded border border-amber-200 bg-white p-3 text-xs text-amber-900">
                <span className="font-bold">Reason for Revocation:</span> {credential.revocationReason}
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAMPERED / INVALID STATE */}
      {statusType === 'TAMPERED' && (
        <div className="mt-7 flex flex-col items-start gap-4 rounded-lg border border-red-200 bg-red-50/60 p-6 sm:flex-row shadow-sm animate-pulse">
          <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-red-600 text-xl font-bold text-white shadow">
            ✕
          </span>
          <div>
            <Badge tone="danger">INTEGRITY FAILURE</Badge>
            <h1 className="mt-3 text-2xl font-bold tracking-tight text-red-950">
              Warning: Tampered Credential Detected!
            </h1>
            <p className="mt-2 text-sm leading-6 text-red-800">
              The credential data has been altered directly in the database. The calculated record hash does not match the block header, or the signature failed verification.
            </p>
            <div className="mt-3 space-y-1 rounded border border-red-200 bg-white p-3 text-xs text-red-900 font-mono">
              <span className="font-bold text-red-950 block mb-1">Diagnostic Errors:</span>
              {errors?.hashMismatch && (
                <div className="flex items-center gap-1.5 text-red-700">
                  <span>•</span>
                  <span>Hash Mismatch: Calculated hash does not match ledger block hash.</span>
                </div>
              )}
              {errors?.signatureFailed && (
                <div className="flex items-center gap-1.5 text-red-700">
                  <span>•</span>
                  <span>Signature Mismatch: Altered record details or invalid signing keys.</span>
                </div>
              )}
              {errors?.chainBroken && (
                <div className="flex items-center gap-1.5 text-red-700">
                  <span>•</span>
                  <span>Chain Integrity Broken: The ledger links have been disrupted.</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <Card
        className="mt-6"
        header={
          <div>
            <h2 className="font-semibold text-slate-900">Certificate Metadata</h2>
            <p className="mt-1 text-sm text-slate-500">
              Verification reference: <span className="font-mono text-xs">{credentialId}</span>
            </p>
          </div>
        }
      >
        <dl className="divide-y divide-slate-100 text-sm">
          <div className="flex justify-between gap-6 py-4">
            <dt className="text-slate-500">Recipient Student</dt>
            <dd className="font-semibold text-slate-900 text-right">{credential.studentName}</dd>
          </div>
          <div className="flex justify-between gap-6 py-4">
            <dt className="text-slate-500">Student ID</dt>
            <dd className="font-medium text-slate-900 text-right">{credential.studentId}</dd>
          </div>
          <div className="flex justify-between gap-6 py-4">
            <dt className="text-slate-500">Award / Degree</dt>
            <dd className="font-semibold text-slate-900 text-right">{credential.degree}</dd>
          </div>
          <div className="flex justify-between gap-6 py-4">
            <dt className="text-slate-500">Department</dt>
            <dd className="font-medium text-slate-800 text-right">{credential.department}</dd>
          </div>
          <div className="flex justify-between gap-6 py-4">
            <dt className="text-slate-500">Graduation Date</dt>
            <dd className="font-medium text-slate-800 text-right">
              {new Date(credential.graduationDate).toLocaleDateString()}
            </dd>
          </div>
          <div className="flex justify-between gap-6 py-4">
            <dt className="text-slate-500">Issued On</dt>
            <dd className="font-medium text-slate-800 text-right">
              {new Date(credential.issueDate || credential.createdAt).toLocaleDateString()}
            </dd>
          </div>
          <div className="flex flex-col gap-1 py-4">
            <dt className="text-slate-500">Cryptographic Hash</dt>
            <dd className="font-mono text-xs break-all bg-slate-50 p-2 border border-slate-100 rounded text-slate-700">
              {credential.credentialHash}
            </dd>
          </div>
        </dl>
      </Card>
    </div>
  );
}
