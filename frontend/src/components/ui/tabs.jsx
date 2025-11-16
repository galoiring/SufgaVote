import React, { createContext, useContext } from 'react';

const TabsContext = createContext();

export const Tabs = ({ value, onValueChange, children, className = '', ...props }) => {
  return (
    <TabsContext.Provider value={{ value, onValueChange }}>
      <div className={className} {...props}>
        {children}
      </div>
    </TabsContext.Provider>
  );
};

export const TabsList = ({ children, className = '', ...props }) => {
  return (
    <div
      className={`bg-white/10 border border-white/10 rounded-2xl p-1 inline-flex gap-1 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export const TabsTrigger = ({ value, children, className = '', ...props }) => {
  const { value: activeValue, onValueChange } = useContext(TabsContext);
  const isActive = value === activeValue;

  return (
    <button
      onClick={() => onValueChange(value)}
      className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
        isActive ? 'bg-opacity-20 text-white' : 'text-slate-200 hover:bg-white/5'
      } ${className}`}
      data-state={isActive ? 'active' : 'inactive'}
      {...props}
    >
      {children}
    </button>
  );
};

export const TabsContent = ({ value, children, className = '', ...props }) => {
  const { value: activeValue } = useContext(TabsContext);

  if (value !== activeValue) return null;

  return (
    <div className={className} {...props}>
      {children}
    </div>
  );
};
