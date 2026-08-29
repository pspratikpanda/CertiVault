/**
 * @file LoginPage.jsx
 * @description Provides the institution/admin session sign-in form.
 * @layer Client Page
 * @interacts AuthContext, API-backed login, and React Router navigation.
 * @futureWork Add account recovery only after its backend workflow is available.
 * @nonGoal Do not store passwords or JWTs in browser storage.
 */
import { useState } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { Button, Card, Input } from '../components';
import { useAuth } from '../context/useAuth';

export default function LoginPage() {
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const destination = location.state?.from || '/institution';
  if (user) return <Navigate to="/institution" replace />;

  const submit = async (event) => {
    event.preventDefault();
    setError('');
    setIsSubmitting(true);
    try {
      await login({ email, password });
      navigate(destination, { replace: true });
    } catch (requestError) {
      setError(requestError.response?.data?.error?.message || 'Unable to sign in. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return <div className="mx-auto grid min-h-[calc(100vh-4rem)] max-w-7xl place-items-center px-5 py-12"><Card className="w-full max-w-md"><p className="text-xs font-bold uppercase tracking-[.16em] text-cyan-700">Institution portal</p><h1 className="mt-3 text-2xl font-semibold">Sign in to your workspace</h1><p className="mt-2 text-sm leading-6 text-slate-600">Use your authorized institution or administrator account.</p><form className="mt-7 space-y-5" onSubmit={submit}><Input id="email" label="Work email" type="email" autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="registrar@university.edu" required /><Input id="password" label="Password" type="password" autoComplete="current-password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="••••••••" required />{error && <p className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700" role="alert">{error}</p>}<Button className="w-full" type="submit" disabled={isSubmitting}>{isSubmitting ? 'Signing in…' : 'Sign in'}</Button></form></Card></div>;
}
