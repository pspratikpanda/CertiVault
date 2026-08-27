/**
 * @file App.jsx
 * @description Defines the static PS-03 client routes.
 * @layer Client Routing
 * @interacts Page components and AppLayout.
 * @futureWork Add protected routes and API-backed route states.
 * @nonGoal Do not add authentication or backend calls here.
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

export default function App() {
  return <AppLayout><Routes>
    <Route path="/" element={<LandingPage />} />
    <Route path="/login" element={<LoginPage />} />
    <Route path="/institution" element={<InstitutionDashboard />} />
    <Route path="/institution/credentials" element={<CredentialList />} />
    <Route path="/institution/credentials/new" element={<IssueCredential />} />
    <Route path="/verify" element={<PublicVerification />} />
    <Route path="/verify/:credentialId" element={<VerificationResult />} />
  </Routes></AppLayout>;
}
