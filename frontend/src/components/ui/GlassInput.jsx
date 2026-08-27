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
        <span className="material-symbols-outlined absolute left-3.5 text-on-surface-variant text-[20px] pointer-events-none group-focus-within:text-primary transition-colors">
          {icon}
        </span>
      )}
      <input
        type="text"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`w-full py-2.5 ${
          icon ? 'pl-11' : 'pl-4'
        } ${shortcut ? 'pr-16' : 'pr-4'} rounded-2xl glass-panel text-xs sm:text-sm font-medium text-on-surface placeholder:text-on-surface-variant/70 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 focus:glass-panel-strong transition-all duration-200 shadow-2xs`}
        {...props}
      />
      {shortcut && (
        <div className="absolute right-3 hidden sm:flex items-center gap-1 pointer-events-none">
          <kbd className="px-2 py-0.5 rounded-lg bg-surface-container/80 border border-surface-border text-[10px] font-mono font-bold text-on-surface-variant shadow-2xs">
            {shortcut}
          </kbd>
        </div>
      )}
    </div>
  );
};
