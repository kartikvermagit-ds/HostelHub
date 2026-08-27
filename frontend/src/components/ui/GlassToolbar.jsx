import React from 'react';

/**
 * Reusable Floating GlassToolbar for 3D controls & Viewer toolbars
 */
export const GlassToolbar = ({
  children,
  position = 'bottom',
  className = '',
  ...props
}) => {
  return (
    <div
      className={`glass-floating rounded-full px-3 py-1.5 flex items-center gap-1.5 border border-white/60 dark:border-primary-fixed/20 shadow-xl backdrop-blur-md ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};
