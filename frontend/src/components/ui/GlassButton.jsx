import React from 'react';

/**
 * Reusable GlassButton Component
 * Variants: 'primary' | 'secondary' | 'ghost' | 'capsule' | 'active'
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
        return 'px-6 py-3 text-sm gap-2.5';
      case 'md':
      default:
        return 'px-4 py-2 text-xs font-semibold gap-2';
    }
  };

  const getVariantClass = () => {
    if (active) {
      return 'bg-primary text-on-primary border border-primary-fixed shadow-md shadow-primary/25 ring-1 ring-primary/30';
    }

    switch (variant) {
      case 'primary':
        return 'bg-primary/90 hover:bg-primary text-on-primary border border-primary-fixed/40 shadow-sm hover:shadow-md hover:shadow-primary/20 active:scale-[0.98]';
      case 'secondary':
        return 'glass-panel text-on-surface hover:bg-surface-container-high border-surface-border hover:border-primary/30 shadow-xs hover:shadow active:scale-[0.98]';
      case 'ghost':
        return 'bg-transparent text-on-surface-variant hover:text-on-surface hover:bg-surface-container/60';
      case 'capsule':
      default:
        return 'glass-floating text-on-surface hover:text-primary hover:border-primary/40 shadow-xs hover:shadow-md active:scale-[0.97]';
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
      {/* Subtle Specular Glow on Hover */}
      <span className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/40 to-transparent pointer-events-none group-hover:via-white/70 transition-opacity" />
      {icon && typeof icon === 'string' ? (
        <span className="material-symbols-outlined text-[17px] shrink-0">{icon}</span>
      ) : (
        icon
      )}
      {children}
    </button>
  );
};
