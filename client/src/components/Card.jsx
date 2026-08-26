// CertiVault developer header
import React from 'react';

/**
 * Card
 * A reusable container for grouping related content.
 *
 * @param {Object} props
 * @param {React.ReactNode} props.children - The content inside the card.
 * @param {string} [props.className=""] - Additional Tailwind classes.
 * @param {React.ReactNode} [props.header] - Optional header element to display at the top.
 * @param {React.ReactNode} [props.footer] - Optional footer element to display at the bottom.
 */
const Card = ({ children, className = "", header, footer }) => {
  return (
    <div className={`bg-slate-900 border border-slate-800 rounded-xl shadow-xl overflow-hidden ${className}`}>
      {header && (
        <div className="px-6 py-4 border-b border-slate-800 bg-slate-900/50">
          {header}
        </div>
      )}
      <div className="p-6">
        {children}
      </div>
      {footer && (
        <div className="px-6 py-4 border-t border-slate-800 bg-slate-900/50">
          {footer}
        </div>
      )}
    </div>
  );
};

export default Card;
