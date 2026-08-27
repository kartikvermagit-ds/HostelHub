import React from 'react';
import { motion } from 'framer-motion';

/**
 * Reusable GlassCard Component with subtle hover elevation & highlight
 */
export const GlassCard = ({
  children,
  interactive = false,
  variant = 'default',
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
      case 'default':
      default:
        return 'glass-panel';
    }
  };

  const interactiveProps = interactive
    ? {
        whileHover: { y: -3, transition: { duration: 0.2, ease: 'easeOut' } },
        whileTap: { scale: 0.99 }
      }
    : {};

  return (
    <motion.div
      {...interactiveProps}
      onClick={onClick}
      className={`rounded-2xl p-5 relative overflow-hidden transition-all duration-200 border ${getVariantClass()} ${
        interactive ? 'cursor-pointer hover:border-primary/40 hover:shadow-lg' : ''
      } ${className}`}
      {...props}
    >
      {/* Specular Top Edge Glow */}
      <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/50 dark:via-primary-fixed/25 to-transparent pointer-events-none" />
      {children}
    </motion.div>
  );
};
