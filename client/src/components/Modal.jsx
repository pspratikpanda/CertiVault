/** @file Modal.jsx @description Reusable dialog shell controlled by a parent component. @layer Client UI @interacts Page state and Button controls. @futureWork Add focus trapping. @nonGoal Do not contain domain workflows. */
import Button from './Button';
export default function Modal({ open, title, children, onClose, size = 'md' }) {
  if (!open) return null;
  const widths = { sm: 'max-w-sm', md: 'max-w-md', lg: 'max-w-2xl', xl: 'max-w-4xl' };
  return <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/40 p-5 overflow-y-auto" role="dialog" aria-modal="true" aria-label={title}><div className={`w-full ${widths[size] ?? widths.md} rounded-lg bg-white p-6 shadow-2xl my-8`}><div className="mb-4 flex items-start justify-between gap-4"><h2 className="text-lg font-semibold">{title}</h2><Button size="sm" variant="secondary" onClick={onClose}>Close</Button></div>{children}</div></div>;
}
