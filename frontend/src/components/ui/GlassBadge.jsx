import React from 'react';

/**
 * Reusable GlassBadge Component for File Types, CT Countdowns & Statuses
 */
export const GlassBadge = ({
  children,
  variant = 'default',
  size = 'md',
  icon = null,
  className = ''
}) => {
  const getVariantClass = () => {
    switch (variant) {
      case 'primary':
        return 'bg-primary/15 text-primary border-primary/30';
      case 'accent':
        return 'bg-primary-fixed/20 text-on-primary-fixed border-primary-fixed/40';
      case 'success':
        return 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30';
      case 'warning':
        return 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30';
      case 'info':
        return 'bg-blue-500/15 text-blue-600 dark:text-blue-400 border-blue-500/30';
      case 'neutral':
        return 'bg-slate-500/15 text-slate-600 dark:text-slate-300 border-slate-500/30';
      case 'default':
      default:
        return 'glass-panel-subtle text-on-surface-variant border-surface-border';
    }
  };

  const getSizeClass = () => {
    switch (size) {
      case 'sm':
        return 'px-2 py-0.5 text-[10px] gap-1 font-semibold';
      case 'lg':
        return 'px-3 py-1.5 text-xs gap-1.5 font-bold';
      case 'md':
      default:
        return 'px-2.5 py-1 text-[11px] gap-1.5 font-semibold';
    }
  };

  return (
    <span
      className={`inline-flex items-center rounded-full border backdrop-blur-xs font-sans whitespace-nowrap shadow-2xs ${getVariantClass()} ${getSizeClass()} ${className}`}
    >
      {icon && typeof icon === 'string' ? (
        <span className="material-symbols-outlined text-[14px] shrink-0">{icon}</span>
      ) : (
        icon
      )}
      <span>{children}</span>
    </span>
  );
};
