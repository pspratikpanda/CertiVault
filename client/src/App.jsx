/**
 * @file App.jsx
 * @description Defines public and authenticated client routes.
 * @layer Client Routing
 * @interacts Page components and AppLayout.
 * @futureWork Add feature routes only after their backend endpoints exist.
 * @nonGoal Do not implement credential data flows here.
 */
import { Routes, Route } from 'react-router-dom';
import AppLayout from './layouts/AppLayout';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import InstitutionDashboard from './pages/InstitutionDashboard';
import CredentialList from './pages/CredentialList';
import IssueCredential from './pages/IssueCredential';
import PublicVerification from './pages/PublicVerification';
import VerificationResult from './pages/VerificationResult';
import ProtectedRoute from './components/ProtectedRoute';

export default function App() {
  return <AppLayout><Routes>
    <Route path="/" element={<LandingPage />} />
    <Route path="/login" element={<LoginPage />} />
    <Route path="/institution" element={<ProtectedRoute><InstitutionDashboard /></ProtectedRoute>} />
    <Route path="/institution/credentials" element={<ProtectedRoute><CredentialList /></ProtectedRoute>} />
    <Route path="/institution/credentials/new" element={<ProtectedRoute><IssueCredential /></ProtectedRoute>} />
    <Route path="/verify" element={<PublicVerification />} />
    <Route path="/verify/:credentialId" element={<VerificationResult />} />
  </Routes></AppLayout>;
}
