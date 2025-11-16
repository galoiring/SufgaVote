import React from 'react';

export const Input = ({ className = '', ...props }) => {
  return (
    <input
      className={`flex w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-slate-100 placeholder-slate-400 focus:outline-none focus:border-white/20 transition-colors ${className}`}
      {...props}
    />
  );
};
