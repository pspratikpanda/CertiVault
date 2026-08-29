/**
 * @file useAuth.js
 * @description Provides safe access to CertiVault authentication state.
 * @layer Client State
 * @interacts auth-context.js and authenticated client views.
 * @futureWork Add typed selector hooks if authentication state expands.
 * @nonGoal Do not perform network calls or mutate session state here.
 */
import { useContext } from 'react';
import { AuthContext } from './auth-context';

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider.');
  return context;
}
