/**
 * @file App.jsx
 * @description Root application component setting up React Router routes and layout wrappers.
 * @layer Client Core
 * @interacts MainLayout, LandingPage, React Router
 * @futureWork Add Dashboard, Verification Portal, and Tamper Demo routes in future steps.
 * @nonGoal Do not place global context state providers or complex business logic inside App.jsx directly.
 */

import React from 'react';
import { Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import LandingPage from './pages/LandingPage';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        <Route index element={<LandingPage />} />
      </Route>
    </Routes>
  );
}
