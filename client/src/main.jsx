/**
 * @file main.jsx
 * @description React Application Entry point mounting root App component with BrowserRouter.
 * @layer Client Entry
 * @interacts App.jsx, index.css, DOM #root
 * @futureWork Add client state providers only as feature needs are defined.
 * @nonGoal Do not define UI component templates or route paths inside main.jsx.
 */

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import './index.css';
import App from './App.jsx';
import { AuthProvider } from './context/AuthContext.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider><App /></AuthProvider>
    </BrowserRouter>
  </StrictMode>
);
