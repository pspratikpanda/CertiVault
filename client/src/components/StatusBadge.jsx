// CertiVault developer header
import React from 'react';

/**
 * StatusBadge
 * A small badge to display the status of a credential or transaction.
 *
 * @param {Object} props
 * @param {string} props.status - The status to display (e.g., "valid", "revoked", "pending").
 * @param {string} [props.className=""] - Additional Tailwind classes.
 */
const StatusBadge = ({ status, className = "" }) => {
  const normalizedStatus = status?.toLowerCase() || "unknown";
  
  let colorStyles = "bg-slate-500/10 text-slate-400 border-slate-500/20";
  
  if (normalizedStatus === "valid" || normalizedStatus === "success") {
    colorStyles = "bg-green-500/10 text-green-400 border-green-500/20";
  } else if (normalizedStatus === "revoked" || normalizedStatus === "error" || normalizedStatus === "invalid") {
    colorStyles = "bg-red-500/10 text-red-400 border-red-500/20";
  } else if (normalizedStatus === "pending") {
    colorStyles = "bg-yellow-500/10 text-yellow-400 border-yellow-500/20";
  }

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${colorStyles} ${className}`}>
      {status}
    </span>
  );
};

export default StatusBadge;
