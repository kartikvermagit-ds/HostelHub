import React from 'react';
import { NavLink } from 'react-router-dom';

export const BottomNav = () => {
  return (
    <nav className="lg:hidden fixed bottom-3 inset-x-4 z-50 flex justify-around items-center glass-floating py-2 px-1 border border-white/70 dark:border-primary-fixed/20 shadow-2xl rounded-2xl backdrop-blur-lg">
      {/* Home */}
      <NavLink
        to="/"
        end
        className={({ isActive }) =>
          `flex flex-col items-center justify-center p-1.5 rounded-xl transition-all ${
            isActive
              ? "text-primary font-bold scale-105"
              : "text-on-surface-variant hover:text-primary"
          }`
        }
      >
        {({ isActive }) => (
          <>
            <span
              className="material-symbols-outlined text-[22px]"
              style={isActive ? { fontVariationSettings: "'FILL' 1" } : undefined}
            >
              home
            </span>
            <span className="font-label-sm text-[10px] mt-0.5">Home</span>
          </>
        )}
      </NavLink>

      {/* Notes */}
      <NavLink
        to="/notes"
        className={({ isActive }) =>
          `flex flex-col items-center justify-center p-1.5 rounded-xl transition-all ${
            isActive
              ? "text-primary font-bold scale-105"
              : "text-on-surface-variant hover:text-primary"
          }`
        }
      >
        {({ isActive }) => (
          <>
            <span
              className="material-symbols-outlined text-[22px]"
              style={isActive ? { fontVariationSettings: "'FILL' 1" } : undefined}
            >
              description
            </span>
            <span className="font-label-sm text-[10px] mt-0.5">Notes</span>
          </>
        )}
      </NavLink>

      {/* Center Upload Button (Floating Glass FAB style) */}
      <NavLink
        to="/upload"
        className="flex flex-col items-center justify-center relative -top-3 group"
      >
        <div className="w-11 h-11 bg-primary text-on-primary rounded-full flex items-center justify-center shadow-lg shadow-primary/30 border-2 border-white dark:border-primary-fixed/30 group-active:scale-90 transition-transform">
          <span className="material-symbols-outlined text-[24px]">add</span>
        </div>
        <span className="font-label-sm text-[10px] text-primary font-bold -mt-0.5">Upload</span>
      </NavLink>

      {/* CT */}
      <NavLink
        to="/ct-zone"
        className={({ isActive }) =>
          `flex flex-col items-center justify-center p-1.5 rounded-xl transition-all ${
            isActive
              ? "text-primary font-bold scale-105"
              : "text-on-surface-variant hover:text-primary"
          }`
        }
      >
        {({ isActive }) => (
          <>
            <span
              className="material-symbols-outlined text-[22px]"
              style={isActive ? { fontVariationSettings: "'FILL' 1" } : undefined}
            >
              quiz
            </span>
            <span className="font-label-sm text-[10px] mt-0.5">CT</span>
          </>
        )}
      </NavLink>

      {/* Profile */}
      <NavLink
        to="/profile"
        className={({ isActive }) =>
          `flex flex-col items-center justify-center p-1.5 rounded-xl transition-all ${
            isActive
              ? "text-primary font-bold scale-105"
              : "text-on-surface-variant hover:text-primary"
          }`
        }
      >
        {({ isActive }) => (
          <>
            <span
              className="material-symbols-outlined text-[22px]"
              style={isActive ? { fontVariationSettings: "'FILL' 1" } : undefined}
            >
              account_circle
            </span>
            <span className="font-label-sm text-[10px] mt-0.5">Profile</span>
          </>
        )}
      </NavLink>
    </nav>
  );
};
