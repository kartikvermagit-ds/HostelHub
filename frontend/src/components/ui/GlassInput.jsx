import React from 'react';

/**
 * Reusable GlassInput Component for Command Bar & Search Fields
 */
export const GlassInput = ({
  value,
  onChange,
  placeholder = 'Search...',
  icon = 'search',
  shortcut = null,
  className = '',
  ...props
}) => {
  return (
    <div className={`relative flex items-center w-full group ${className}`}>
      {icon && (
        <span className="material-symbols-outlined absolute left-3.5 text-[#557670] dark:text-[#8cb4ad] text-[19px] pointer-events-none group-focus-within:text-primary transition-colors">
          {icon}
        </span>
      )}
      <input
        type="text"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`w-full py-2.5 ${
          icon ? 'pl-10' : 'pl-4'
        } ${shortcut ? 'pr-16' : 'pr-4'} rounded-2xl glass-panel text-xs sm:text-sm font-medium text-[#0e2724] dark:text-[#f0faf8] placeholder:text-[#6a8b85] dark:placeholder:text-[#7ba19b] focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/25 transition-all duration-200 shadow-2xs`}
        {...props}
      />
      {shortcut && (
        <div className="absolute right-3 hidden sm:flex items-center gap-1 pointer-events-none">
          <kbd className="px-2 py-0.5 rounded-lg bg-surface-container/70 border border-surface-border text-[10px] font-mono font-bold text-[#44625d] dark:text-[#a0c4bf] shadow-2xs">
            {shortcut}
          </kbd>
        </div>
      )}
    </div>
  );
};
