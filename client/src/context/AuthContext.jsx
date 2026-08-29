/**
 * @file AuthContext.jsx
 * @description Maintains current user identity while the HttpOnly backend session remains cookie-based.
 * @layer Client State
 * @interacts api.js, App.jsx, login and protected institution views.
 * @futureWork Add session-expiry messaging when specified.
 * @nonGoal Do not store JWTs, passwords, or authorization secrets in browser storage.
 */
import { useCallback, useEffect, useMemo, useState } from 'react';
import api from '../services/api';
import { AuthContext } from './auth-context';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const refreshSession = useCallback(async () => {
    try { const response = await api.get('/auth/me'); setUser(response.data.data.user); return response.data.data.user; }
    catch { setUser(null); return null; }
    finally { setIsLoading(false); }
  }, []);
  useEffect(() => { refreshSession(); }, [refreshSession]);
  const login = async (credentials) => { const response = await api.post('/auth/login', credentials); const signedInUser = response.data.data.user; setUser(signedInUser); return signedInUser; };
  const logout = async () => { try { await api.post('/auth/logout'); } finally { setUser(null); } };
  const value = useMemo(() => ({ user, isLoading, login, logout, refreshSession }), [user, isLoading, refreshSession]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
