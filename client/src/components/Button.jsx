// CertiVault developer header
import React from 'react';

/**
 * Button
 * A reusable styled button component.
 *
 * @param {Object} props
 * @param {React.ReactNode} props.children - The content of the button.
 * @param {string} [props.variant="primary"] - The visual variant of the button ("primary", "secondary", "outline").
 * @param {string} [props.className=""] - Additional Tailwind classes.
 * @param {boolean} [props.disabled=false] - Whether the button is disabled.
 * @param {Function} [props.onClick] - Click handler.
 * @param {string} [props.type="button"] - The HTML button type.
 */
const Button = ({ 
  children, 
  variant = "primary", 
  className = "", 
  disabled = false,
  onClick,
  type = "button",
  ...rest
}) => {
  const baseStyles = "inline-flex items-center justify-center px-4 py-2 font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-950 disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variants = {
    primary: "bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-500/20 border border-blue-500 focus:ring-blue-500",
    secondary: "bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 focus:ring-slate-500",
    outline: "bg-transparent hover:bg-slate-800 text-slate-300 border border-slate-700 focus:ring-slate-500"
  };

  return (
    <button
      type={type}
      className={`${baseStyles} ${variants[variant]} ${className}`}
      disabled={disabled}
      onClick={onClick}
      {...rest}
    >
      {children}
    </button>
  );
};

export default Button;
