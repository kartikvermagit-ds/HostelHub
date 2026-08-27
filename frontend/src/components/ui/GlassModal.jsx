import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * Reusable GlassModal Component with smooth 0.96 -> 1 scale & dark frosted backdrop
 */
export const GlassModal = ({
  isOpen = false,
  onClose,
  title,
  subtitle,
  children,
  maxWidth = 'max-w-2xl',
  className = ''
}) => {
  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen && onClose) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          {/* Frosted Dark Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 dark:bg-black/75 backdrop-blur-md"
          />

          {/* Modal Glass Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 8 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            className={`w-full ${maxWidth} glass-floating rounded-3xl p-6 sm:p-8 relative z-10 border border-white/40 dark:border-primary-fixed/20 shadow-2xl overflow-hidden ${className}`}
          >
            {/* Top Specular Edge Glow */}
            <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/80 dark:via-primary-fixed/30 to-transparent" />

            {/* Header Area */}
            {(title || onClose) && (
              <div className="flex items-start justify-between gap-4 mb-5 border-b border-surface-border/50 pb-4">
                <div>
                  {title && (
                    <h3 className="font-headline-sm text-lg sm:text-xl font-bold text-on-surface tracking-tight">
                      {title}
                    </h3>
                  )}
                  {subtitle && (
                    <p className="text-xs text-on-surface-variant mt-0.5">{subtitle}</p>
                  )}
                </div>

                {onClose && (
                  <button
                    type="button"
                    onClick={onClose}
                    className="p-2 rounded-xl text-on-surface-variant hover:text-on-surface hover:bg-surface-container/60 transition-colors"
                  >
                    <span className="material-symbols-outlined text-[20px]">close</span>
                  </button>
                )}
              </div>
            )}

            {/* Modal Body */}
            <div>{children}</div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
