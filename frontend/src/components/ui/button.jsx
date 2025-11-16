import React from 'react';

export const Button = ({ children, className = '', variant = 'default', onClick, type = 'button', ...props }) => {
  const baseStyles = 'inline-flex items-center justify-center rounded-xl px-4 py-2 text-sm font-medium transition-colors focus:outline-none disabled:opacity-50 disabled:pointer-events-none';

  const variantStyles = {
    default: 'bg-white/10 border border-white/10 hover:bg-white/20 text-slate-100',
    secondary: 'bg-white/10 border border-white/10 hover:bg-white/20 text-slate-100',
  };

  return (
    <button
      type={type}
      onClick={onClick}
      className={`${baseStyles} ${variantStyles[variant] || variantStyles.default} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};
