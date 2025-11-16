import React from 'react';

export const Toggle = ({ pressed, onPressedChange, children, className = '', ...props }) => {
  return (
    <button
      onClick={() => onPressedChange(!pressed)}
      data-state={pressed ? 'on' : 'off'}
      className={`inline-flex items-center justify-center rounded-xl px-4 py-2 text-sm font-medium transition-colors ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};
