/**
 * @file Sidebar.jsx
 * @description Provides static institution-area navigation.
 * @layer Client UI
 * @interacts React Router navigation links.
 * @futureWork Add role-aware navigation and notification counts.
 * @nonGoal Do not perform authorization checks.
 */
import { NavLink } from 'react-router-dom';
const links = [['Overview', '/institution'], ['Credentials', '/institution/credentials'], ['Issue credential', '/institution/credentials/new']];
export default function Sidebar() { return <aside className="border-b border-slate-800 bg-slate-950 text-slate-300 lg:min-h-screen lg:w-64 lg:border-b-0 lg:border-r"><div className="hidden h-16 items-center gap-3 border-b border-slate-800 px-6 font-semibold text-white lg:flex"><span className="grid h-7 w-7 place-items-center rounded bg-cyan-400 text-xs font-black text-slate-950">CV</span> CertiVault</div><nav className="flex gap-1 overflow-x-auto p-3 lg:flex-col lg:p-4">{links.map(([label, to]) => <NavLink key={to} end={to === '/institution'} to={to} className={({ isActive }) => `whitespace-nowrap rounded-md px-3 py-2 text-sm font-medium transition ${isActive ? 'bg-slate-800 text-white' : 'text-slate-400 hover:bg-slate-900 hover:text-slate-100'}`}>{label}</NavLink>)}</nav><div className="hidden px-4 pt-6 lg:block"><p className="border-t border-slate-800 pt-5 text-xs leading-5 text-slate-500">Institution workspace<br />Demo interface · No data connected</p></div></aside>; }
