import React, { useState } from 'react';

/**
 * Reusable GlassTooltip Component for spatial hovering and micro-hints
 */
export const GlassTooltip = ({
  content,
  children,
  position = 'top',
  className = ''
}) => {
  const [visible, setVisible] = useState(false);

  const getPositionClass = () => {
    switch (position) {
      case 'bottom':
        return 'top-full mt-2 left-1/2 -translate-x-1/2';
      case 'left':
        return 'right-full mr-2 top-1/2 -translate-y-1/2';
      case 'right':
        return 'left-full ml-2 top-1/2 -translate-y-1/2';
      case 'top':
      default:
        return 'bottom-full mb-2 left-1/2 -translate-x-1/2';
    }
  };

  return (
    <div
      className="relative inline-flex items-center"
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
    >
      {children}
      {visible && content && (
        <div
          className={`absolute ${getPositionClass()} z-50 pointer-events-none whitespace-nowrap px-2.5 py-1 rounded-xl glass-panel-strong border border-white/60 dark:border-primary-fixed/30 text-[11px] font-semibold text-on-surface shadow-lg animate-fade-in ${className}`}
        >
          {content}
        </div>
      )}
    </div>
  );
};
