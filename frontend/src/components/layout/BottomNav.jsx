import React from 'react';
import { NavLink } from 'react-router-dom';

export const BottomNav = () => {
  return (
    <nav className="lg:hidden fixed bottom-0 left-0 w-full z-50 flex justify-around items-center bg-surface-container-lowest dark:bg-inverse-surface py-2 pb-safe border-t border-surface-border dark:border-outline-variant shadow-lg rounded-t-2xl">
      {/* Home */}
      <NavLink
        to="/"
        end
        className={({ isActive }) =>
          `flex flex-col items-center justify-center p-2 rounded-lg transition-all ${
            isActive
              ? "text-primary dark:text-primary-fixed font-bold scale-95"
              : "text-on-surface-variant dark:text-surface-variant hover:text-primary"
          }`
        }
      >
        {({ isActive }) => (
          <>
            <span
              className="material-symbols-outlined text-[24px]"
              style={isActive ? { fontVariationSettings: "'FILL' 1" } : undefined}
            >
              home
            </span>
            <span className="font-label-sm text-[11px] mt-0.5">Home</span>
          </>
        )}
      </NavLink>

      {/* Notes */}
      <NavLink
        to="/notes"
        className={({ isActive }) =>
          `flex flex-col items-center justify-center p-2 rounded-lg transition-all ${
            isActive
              ? "text-primary dark:text-primary-fixed font-bold scale-95"
              : "text-on-surface-variant dark:text-surface-variant hover:text-primary"
          }`
        }
      >
        {({ isActive }) => (
          <>
            <span
              className="material-symbols-outlined text-[24px]"
              style={isActive ? { fontVariationSettings: "'FILL' 1" } : undefined}
            >
              description
            </span>
            <span className="font-label-sm text-[11px] mt-0.5">Notes</span>
          </>
        )}
      </NavLink>

      {/* Center Upload Button (FAB style) */}
      <NavLink
        to="/upload"
        className={({ isActive }) =>
          `flex flex-col items-center justify-center relative -top-3.5 group`
        }
      >
        <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-on-primary shadow-lg border-4 border-surface group-active:scale-90 transition-transform">
          <span className="material-symbols-outlined text-[26px]">add</span>
        </div>
        <span className="font-label-sm text-[11px] text-primary font-bold -mt-0.5">Upload</span>
      </NavLink>

      {/* CT */}
      <NavLink
        to="/ct-zone"
        className={({ isActive }) =>
          `flex flex-col items-center justify-center p-2 rounded-lg transition-all ${
            isActive
              ? "text-primary dark:text-primary-fixed font-bold scale-95"
              : "text-on-surface-variant dark:text-surface-variant hover:text-primary"
          }`
        }
      >
        {({ isActive }) => (
          <>
            <span
              className="material-symbols-outlined text-[24px]"
              style={isActive ? { fontVariationSettings: "'FILL' 1" } : undefined}
            >
              quiz
            </span>
            <span className="font-label-sm text-[11px] mt-0.5">CT</span>
          </>
        )}
      </NavLink>

      {/* Profile */}
      <NavLink
        to="/profile"
        className={({ isActive }) =>
          `flex flex-col items-center justify-center p-2 rounded-lg transition-all ${
            isActive
              ? "text-primary dark:text-primary-fixed font-bold scale-95"
              : "text-on-surface-variant dark:text-surface-variant hover:text-primary"
          }`
        }
      >
        {({ isActive }) => (
          <>
            <span
              className="material-symbols-outlined text-[24px]"
              style={isActive ? { fontVariationSettings: "'FILL' 1" } : undefined}
            >
              person
            </span>
            <span className="font-label-sm text-[11px] mt-0.5">Profile</span>
          </>
        )}
      </NavLink>
    </nav>
  );
};
