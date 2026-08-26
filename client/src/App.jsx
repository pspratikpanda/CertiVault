// CertiVault developer header
import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import AppLayout from './layouts/AppLayout'
import LandingPage from './pages/LandingPage'
import InstitutionLogin from './pages/InstitutionLogin'
import InstitutionRegister from './pages/InstitutionRegister'
import InstitutionDashboard from './pages/InstitutionDashboard'
import VerifyCredential from './pages/VerifyCredential'
import LedgerView from './pages/LedgerView'
import TamperDemo from './pages/TamperDemo'

function App() {
  return (
    <Router>
      <AppLayout>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/institution/login" element={<InstitutionLogin />} />
          <Route path="/institution/register" element={<InstitutionRegister />} />
          <Route path="/institution/dashboard" element={<InstitutionDashboard />} />
          <Route path="/verify/:id" element={<VerifyCredential />} />
          <Route path="/ledger" element={<LedgerView />} />
          <Route path="/tamper-demo" element={<TamperDemo />} />
        </Routes>
      </AppLayout>
    </Router>
  )
}

export default App
