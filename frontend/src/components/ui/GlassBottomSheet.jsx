import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * Reusable GlassBottomSheet Component for Mobile Room Details & Filters
 */
export const GlassBottomSheet = ({
  isOpen = false,
  onClose,
  title,
  children,
  className = ''
}) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex flex-col justify-end lg:hidden">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm"
          />

          {/* Bottom Sheet Sheet */}
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 26, stiffness: 280 }}
            className={`glass-panel-strong rounded-t-3xl p-6 relative z-10 border-t border-white/60 dark:border-primary-fixed/20 shadow-2xl max-h-[85vh] flex flex-col ${className}`}
          >
            {/* Grab Handle */}
            <div className="w-12 h-1.5 rounded-full bg-on-surface-variant/30 mx-auto mb-4 shrink-0" />

            {title && (
              <div className="flex items-center justify-between pb-3 border-b border-surface-border mb-4">
                <h3 className="font-headline-sm font-bold text-base text-on-surface">{title}</h3>
                <button
                  type="button"
                  onClick={onClose}
                  className="p-1 rounded-lg text-on-surface-variant hover:text-on-surface hover:bg-surface-container"
                >
                  <span className="material-symbols-outlined text-[20px]">close</span>
                </button>
              </div>
            )}

            <div className="overflow-y-auto flex-1">{children}</div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
