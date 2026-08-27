import React from 'react';

/**
 * Reusable GlassButton Component
 * Primary = Solid Teal (High Hierarchy)
 * Secondary / Capsule = Glass UI (Supporting)
 */
export const GlassButton = ({
  children,
  variant = 'capsule',
  size = 'md',
  icon = null,
  active = false,
  disabled = false,
  className = '',
  onClick,
  ...props
}) => {
  const getSizeClass = () => {
    switch (size) {
      case 'sm':
        return 'px-3 py-1.5 text-xs gap-1.5';
      case 'lg':
        return 'px-5 py-2.5 text-sm gap-2.5 font-bold';
      case 'md':
      default:
        return 'px-3.5 py-1.5 text-xs font-bold gap-2';
    }
  };

  const getVariantClass = () => {
    if (active) {
      return 'bg-primary text-white font-bold shadow-md shadow-primary/25 border border-primary-fixed/40';
    }

    switch (variant) {
      case 'primary':
        return 'bg-primary hover:bg-primary/95 text-white font-bold shadow-sm hover:shadow-md hover:shadow-primary/20 active:scale-[0.98] border border-primary/30';
      case 'secondary':
        return 'glass-panel text-[#1a3833] dark:text-[#e1f3ef] hover:bg-white/70 dark:hover:bg-white/10 hover:border-primary/30 shadow-2xs active:scale-[0.98]';
      case 'ghost':
        return 'bg-transparent text-[#425d57] dark:text-[#9bbbb5] hover:text-primary dark:hover:text-white hover:bg-surface-container/50';
      case 'capsule':
      default:
        return 'glass-panel text-[#1a3833] dark:text-[#e1f3ef] hover:text-primary dark:hover:text-[#89f5e7] hover:border-primary/40 shadow-2xs active:scale-[0.98]';
    }
  };

  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={`rounded-xl font-sans inline-flex items-center justify-center transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:pointer-events-none relative overflow-hidden group select-none ${getSizeClass()} ${getVariantClass()} ${className}`}
      {...props}
    >
      {icon && typeof icon === 'string' ? (
        <span className="material-symbols-outlined text-[17px] shrink-0">{icon}</span>
      ) : (
        icon
      )}
      {children}
    </button>
  );
};
