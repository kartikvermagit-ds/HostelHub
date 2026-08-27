import React from 'react';

/**
 * Reusable GlassPanel Component
 * Variants: 'default' | 'strong' | 'subtle' | 'floating' | 'card'
 */
export const GlassPanel = ({
  children,
  variant = 'default',
  interactive = false,
  className = '',
  onClick,
  ...props
}) => {
  const getVariantClass = () => {
    switch (variant) {
      case 'strong':
        return 'glass-panel-strong';
      case 'subtle':
        return 'glass-panel-subtle';
      case 'floating':
        return 'glass-floating shadow-xl';
      case 'card':
        return 'glass-panel hover:border-primary/40 hover:-translate-y-0.5 transition-all duration-200';
      case 'default':
      default:
        return 'glass-panel';
    }
  };

  const interactiveClass = interactive
    ? 'cursor-pointer hover:shadow-md hover:scale-[1.01] active:scale-[0.99] transition-all duration-200'
    : '';

  return (
    <div
      className={`rounded-2xl relative overflow-hidden transition-colors duration-200 ${getVariantClass()} ${interactiveClass} ${className}`}
      onClick={onClick}
      {...props}
    >
      {/* Specular Inner Highlight Strip */}
      <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/50 dark:via-primary-fixed/20 to-transparent pointer-events-none" />
      {children}
    </div>
  );
};
