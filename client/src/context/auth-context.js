/**
 * @file auth-context.js
 * @description Owns the private React context instance for authentication state.
 * @layer Client State
 * @interacts AuthContext.jsx and useAuth.js.
 * @futureWork Keep this module limited to the context primitive.
 * @nonGoal Do not implement session logic or render UI here.
 */
import { createContext } from 'react';

export const AuthContext = createContext(null);
