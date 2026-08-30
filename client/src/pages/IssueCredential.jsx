import { useState } from 'react';
import api from '../services/api';
import { Button, Card, Input, Modal } from '../components';

export default function IssueCredential() {
  const [studentName, setStudentName] = useState('');
  const [studentId, setStudentId] = useState('');
  const [degree, setDegree] = useState('');
  const [department, setDepartment] = useState('');
  const [graduationDate, setGraduationDate] = useState('');

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [issuedData, setIssuedData] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    setError('');
    setIssuedData(null);

    const payload = {
      studentName,
      studentId,
      degree,
      department,
      graduationDate: new Date(graduationDate).toISOString(),
    };

    try {
      const response = await api.post('/credentials/issue', payload);
      setIssuedData(response.data.data);
      // Reset form
      setStudentName('');
      setStudentId('');
      setDegree('');
      setDepartment('');
      setGraduationDate('');
    } catch (err) {
      setError(err.response?.data?.error?.message || 'Failed to issue credential. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const qrCodeUrl = issuedData
    ? `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(issuedData.verificationUrl)}`
    : '';

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <div>
        <p className="text-sm font-medium text-slate-500">Institution workspace</p>
        <h1 className="mt-1 text-2xl font-semibold tracking-tight">Issue a Cryptographic Credential</h1>
        <p className="mt-2 text-sm text-slate-600">
          Capture and publish the immutable academic record. Once issued, a ledger block will be cryptographically signed by your institution private key and stored on the chain.
        </p>
      </div>

      <Card className="mt-8">
        <form className="grid gap-5 md:grid-cols-2" onSubmit={handleSubmit}>
          <Input
            id="student-name"
            label="Student name"
            placeholder="Full legal name"
            required
            value={studentName}
            onChange={(e) => setStudentName(e.target.value)}
          />
          <Input
            id="student-id"
            label="Student ID"
            placeholder="University ID number"
            required
            value={studentId}
            onChange={(e) => setStudentId(e.target.value)}
          />
          <Input
            id="degree"
            label="Degree / award"
            placeholder="e.g. Bachelor of Computer Science"
            required
            value={degree}
            onChange={(e) => setDegree(e.target.value)}
          />
          <Input
            id="department"
            label="Department"
            placeholder="e.g. Computer Science & Engineering"
            required
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
          />
          <Input
            id="graduation"
            label="Graduation date"
            type="date"
            required
            value={graduationDate}
            onChange={(e) => setGraduationDate(e.target.value)}
          />

          {error && (
            <div className="md:col-span-2 rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700" role="alert">
              {error}
            </div>
          )}

          <div className="md:col-span-2 flex justify-end border-t border-slate-100 pt-5">
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Signing & Recording Block...' : 'Publish Credential'}
            </Button>
          </div>
        </form>
      </Card>

      {/* Success Modal */}
      {issuedData && (
        <Modal open={true} size="lg" title="Credential Successfully Issued" onClose={() => setIssuedData(null)}>
          <div className="space-y-6 font-sans">
            <div className="flex flex-col items-center justify-center text-center p-4 bg-emerald-50 rounded-lg border border-emerald-100">
              <span className="grid h-12 w-12 place-items-center rounded-full bg-emerald-500 text-2xl text-white font-bold mb-3">
                ✓
              </span>
              <h4 className="font-semibold text-emerald-900">Signed & Recorded on Ledger</h4>
              <p className="text-xs text-emerald-700 mt-1 max-w-sm">
                The degree has been signed with your RSA key and recorded in Ledger block #{issuedData.ledgerBlock.index}.
              </p>
            </div>

            <div className="flex flex-col items-center justify-center py-2">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">Verification QR Code</p>
              <div className="p-3 bg-white border border-slate-200 rounded-lg shadow-sm">
                <img src={qrCodeUrl} alt="Verification QR Code" className="w-[180px] h-[180px]" />
              </div>
              <a
                href={issuedData.verificationUrl}
                target="_blank"
                rel="noreferrer"
                className="mt-3 text-sm font-semibold text-cyan-600 hover:text-cyan-800 transition"
              >
                Inspect Live Verification Portal
              </a>
            </div>

            <div className="border-t border-slate-100 pt-4 space-y-3 text-xs text-slate-600">
              <div className="flex justify-between">
                <span className="font-semibold text-slate-500">Record ID:</span>
                <span className="font-mono text-slate-900">{issuedData.credential.credentialId}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold text-slate-500">Ledger Index:</span>
                <span className="font-mono text-slate-900">Block #{issuedData.ledgerBlock.index}</span>
              </div>
              <div className="flex flex-col gap-1 border-t border-slate-100 pt-2">
                <span className="font-semibold text-slate-500">Ledger Block Hash:</span>
                <span className="font-mono break-all text-[10px] bg-slate-50 p-2 rounded border border-slate-100 text-cyan-700">
                  {issuedData.ledgerBlock.blockHash}
                </span>
              </div>
            </div>

            <div className="flex justify-end pt-3">
              <Button onClick={() => setIssuedData(null)}>Close</Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
