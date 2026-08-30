import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { Button, Card, Input } from '../components';

export default function PublicVerification() {
  const navigate = useNavigate();
  const [credentialId, setCredentialId] = useState('');
  const [showScanner, setShowScanner] = useState(false);
  const [scanError, setScanError] = useState('');

  const submit = (event) => {
    event.preventDefault();
    if (!credentialId.trim()) return;
    navigate(`/verify/${credentialId.trim()}`);
  };

  useEffect(() => {
    let scanner = null;
    if (showScanner) {
      setScanError('');
      // Wait for DOM to render the reader element
      const timeoutId = setTimeout(() => {
        try {
          scanner = new Html5QrcodeScanner(
            'qr-reader',
            {
              fps: 10,
              qrbox: { width: 250, height: 250 },
              rememberLastUsedCamera: true,
            },
            /* verbose= */ false
          );

          scanner.render(
            (decodedText) => {
              // Successfully scanned a QR code
              try {
                // If it is a full URL, extract the credentialId at the end
                // E.g., http://localhost:5173/verify/cred_1234abcd
                let targetId = decodedText;
                if (decodedText.includes('/verify/')) {
                  const parts = decodedText.split('/verify/');
                  targetId = parts[parts.length - 1].split('?')[0];
                }
                
                if (scanner) {
                  scanner.clear().catch((e) => console.error(e));
                }
                setShowScanner(false);
                navigate(`/verify/${targetId}`);
              } catch {
                setScanError('Failed to parse credential ID from scanned QR code.');
              }
            },
            (_errorMessage) => {
              // Non-blocking scan error (usually just searching)
            }
          );
        } catch (err) {
          console.error(err);
          setScanError('Failed to initialize camera scanner. Please grant camera access permissions.');
        }
      }, 100);

      return () => {
        clearTimeout(timeoutId);
        if (scanner) {
          scanner.clear().catch((e) => console.error('Error clearing scanner', e));
        }
      };
    }
  }, [showScanner, navigate]);

  return (
    <div className="mx-auto grid min-h-[calc(100vh-4rem)] max-w-5xl place-items-center px-5 py-12">
      <div className="w-full max-w-2xl">
        <p className="text-center text-xs font-bold uppercase tracking-[.18em] text-cyan-700">
          Public verification portal
        </p>
        <h1 className="mt-4 text-center text-3xl font-semibold tracking-tight md:text-4xl text-slate-900">
          Verify Academic Credential Authenticity
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-center leading-7 text-slate-600">
          Instantly validate degree credentials. Enter the credential identifier below, or scan the verification QR code printed on the certificate.
        </p>

        <Card className="mt-8">
          <form className="flex flex-col gap-3 sm:flex-row sm:items-end" onSubmit={submit}>
            <Input
              id="credential-id"
              className="flex-1"
              label="Credential ID"
              placeholder="e.g. cred_7a12b4e6"
              value={credentialId}
              onChange={(e) => setCredentialId(e.target.value)}
              required
            />
            <Button type="submit" className="sm:mb-6">
              Search Status
            </Button>
          </form>

          <div className="mt-6 border-t border-slate-100 pt-6 text-center">
            <button
              onClick={() => setShowScanner(!showScanner)}
              className="inline-flex items-center gap-2 rounded-md bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-slate-800 transition"
            >
              <svg
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6.827 6.175A2.31 2.31 0 0 1 5.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 0 0-1.134-.175 2.31 2.31 0 0 1-1.64-1.055l-.822-1.316a2.192 2.192 0 0 0-1.736-1.039 48.774 48.774 0 0 0-5.232 0 2.192 2.192 0 0 0-1.736 1.039l-.821 1.316Z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M16.5 12.75a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0ZM18.75 10.5h.008v.008h-.008V10.5Z"
                />
              </svg>
              {showScanner ? 'Close Camera Scanner' : 'Scan Verification QR Code'}
            </button>

            {showScanner && (
              <div className="mt-6 flex flex-col items-center justify-center">
                <div
                  id="qr-reader"
                  className="w-full max-w-sm overflow-hidden rounded-lg border border-slate-200 bg-slate-50 p-2 shadow-inner"
                ></div>
                {scanError && <p className="mt-3 text-sm text-red-600">{scanError}</p>}
                <p className="mt-3 text-xs text-slate-500">
                  Allow camera access. Hold the QR code steadily in front of the lens.
                </p>
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
