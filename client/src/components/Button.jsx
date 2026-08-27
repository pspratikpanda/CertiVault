/** @file Button.jsx @description Reusable accessible action button. @layer Client UI @interacts Forms, links and modal triggers. @futureWork Add loading and icon-only variants. @nonGoal Do not embed business actions or API calls. */
export default function Button({ children, variant = 'primary', size = 'md', className = '', type = 'button', ...props }) {
  const variants = { primary: 'bg-slate-900 text-white hover:bg-slate-700 focus:ring-slate-400', secondary: 'bg-white text-slate-800 border border-slate-300 hover:bg-slate-50 focus:ring-slate-300', danger: 'bg-red-700 text-white hover:bg-red-800 focus:ring-red-300' };
  const sizes = { sm: 'px-3 py-1.5 text-sm', md: 'px-4 py-2.5 text-sm' };
  return <button type={type} className={`inline-flex items-center justify-center rounded-md font-semibold transition focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${variants[variant]} ${sizes[size]} ${className}`} {...props}>{children}</button>;
}
