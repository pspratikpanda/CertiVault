/**
 * @file AppLayout.jsx
 * @description Selects the public or institution shell for each client route.
 * @layer Client Layout
 * @interacts Navbar, Sidebar and React Router location.
 * @futureWork Add authenticated institution identity and permissions.
 * @nonGoal Do not enforce authentication in this presentation-only step.
 */
import { useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';

export default function AppLayout({ children }) {
  const institutionRoute = useLocation().pathname.startsWith('/institution');
  return <div className="min-h-screen bg-slate-50 text-slate-900 selection:bg-cyan-100">
    {institutionRoute ? <div className="min-h-screen lg:flex"><Sidebar /><div className="min-w-0 flex-1"><Navbar institution /><main className="p-5 md:p-8">{children}</main></div></div> : <><Navbar /><main>{children}</main></>}
  </div>;
}
