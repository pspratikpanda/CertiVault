/**
 * @file Navbar.jsx
 * @description Shared top navigation for public and institution presentation views.
 * @layer Client UI
 * @interacts React Router links and Button.
 * @futureWork Display a signed-in user menu when authentication exists.
 * @nonGoal Do not implement session state or access control.
 */
import { Link, NavLink } from 'react-router-dom';
import Button from './Button';

export default function Navbar({ institution = false }) {
  return <header className="border-b border-slate-200 bg-white"><div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 md:px-8">
    <Link to={institution ? '/institution' : '/'} className="flex items-center gap-3 font-semibold tracking-tight text-slate-950"><span className="grid h-8 w-8 place-items-center rounded-lg bg-slate-900 text-sm font-black text-cyan-300">CV</span><span>CertiVault</span></Link>
    {institution ? <div className="flex items-center gap-3 text-sm"><span className="hidden text-slate-500 sm:inline">Northbridge University</span><span className="grid h-8 w-8 place-items-center rounded-full bg-slate-100 text-xs font-bold text-slate-700">NU</span></div> : <nav className="flex items-center gap-3 text-sm"><NavLink to="/verify" className="hidden font-medium text-slate-600 hover:text-slate-950 sm:block">Verify credential</NavLink><Link to="/login"><Button size="sm">Institution portal</Button></Link></nav>}
  </div></header>;
}
