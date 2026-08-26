// CertiVault developer header
import React from 'react';

/**
 * PageContainer
 * A standardized wrapper for main page content, ensuring consistent padding, max-width, and centering.
 *
 * @param {Object} props
 * @param {React.ReactNode} props.children - The content of the page.
 * @param {string} [props.className=""] - Additional Tailwind classes to apply to the container.
 */
const PageContainer = ({ children, className = "" }) => {
  return (
    <div className={`container mx-auto px-4 py-8 md:py-12 max-w-7xl ${className}`}>
      {children}
    </div>
  );
};

export default PageContainer;
