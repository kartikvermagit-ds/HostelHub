import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext';

export const Sidebar = () => {
  const { user } = useApp();

  const mainNavLinks = [
    { to: "/", label: "Home", icon: "home" },
    { to: "/notes", label: "Notes", icon: "description" },
    { to: "/ct-zone", label: "CT Zone", icon: "quiz" },
    { to: "/pyqs", label: "PYQs", icon: "history_edu" },
    { to: "/videos", label: "Videos", icon: "videocam" },
    { to: "/images", label: "Images", icon: "image" },
    { to: "/discussions", label: "Discussions", icon: "forum" },
    { to: "/announcements", label: "Announcements", icon: "campaign" },
  ];

  const libraryNavLinks = [
    { to: "/saved", label: "Saved", icon: "bookmark" },
    { to: "/my-uploads", label: "My Uploads", icon: "cloud_upload" },
  ];

  return (
    <aside className="bg-surface-container-lowest dark:bg-inverse-surface border-r border-surface-border dark:border-outline-variant h-screen w-64 fixed left-0 top-0 hidden lg:flex flex-col py-stack-md px-4 z-40 transition-colors duration-200">
      {/* Brand Header */}
      <div className="flex items-center gap-3 px-3 mb-6">
        <div className="w-10 h-10 rounded-lg bg-primary text-on-primary flex items-center justify-center font-display text-[22px] font-bold shrink-0 shadow-sm">
          H
        </div>
        <div>
          <h1 className="font-headline-sm text-headline-sm font-bold text-primary dark:text-primary-fixed leading-tight">
            HostelHub
          </h1>
          <p className="font-label-sm text-label-sm text-on-surface-variant">
            Your Hostel's Study Hub
          </p>
        </div>
      </div>

      {/* Upload Material CTA Button */}
      <div className="px-1 mb-4">
        <Link
          to="/upload"
          className="w-full bg-primary text-on-primary font-label-md text-label-md py-3 px-4 rounded-xl flex items-center justify-center gap-2 shadow-sm hover:opacity-90 hover:shadow transition-all duration-200"
        >
          <span className="material-symbols-outlined text-[18px]">add</span>
          <span>Upload Material</span>
        </Link>
      </div>

      {/* Navigation Links (Scrollable Area) */}
      <div className="flex flex-col gap-1 flex-1 overflow-y-auto pr-1">
        {mainNavLinks.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            end={link.to === "/"}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors duration-200 text-label-md font-label-md ${
                isActive
                  ? "bg-surface-container-low dark:bg-surface-variant text-primary dark:text-primary-fixed font-bold border-r-4 border-primary"
                  : "text-on-surface-variant dark:text-surface-variant hover:bg-surface-container-low dark:hover:bg-surface-variant"
              }`
            }
          >
            {({ isActive }) => (
              <>
                <span
                  className="material-symbols-outlined text-[20px]"
                  style={isActive ? { fontVariationSettings: "'FILL' 1" } : undefined}
                >
                  {link.icon}
                </span>
                <span>{link.label}</span>
              </>
            )}
          </NavLink>
        ))}

        <div className="my-3 border-t border-surface-border"></div>

        {/* Library Section Header */}
        <div className="px-3 py-1">
          <p className="font-label-sm text-label-sm text-secondary uppercase tracking-wider text-[11px] font-semibold">
            Library
          </p>
        </div>

        {libraryNavLinks.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors duration-200 text-label-md font-label-md ${
                isActive
                  ? "bg-surface-container-low dark:bg-surface-variant text-primary dark:text-primary-fixed font-bold border-r-4 border-primary"
                  : "text-on-surface-variant dark:text-surface-variant hover:bg-surface-container-low dark:hover:bg-surface-variant"
              }`
            }
          >
            {({ isActive }) => (
              <>
                <span
                  className="material-symbols-outlined text-[20px]"
                  style={isActive ? { fontVariationSettings: "'FILL' 1" } : undefined}
                >
                  {link.icon}
                </span>
                <span>{link.label}</span>
              </>
            )}
          </NavLink>
        ))}
      </div>

      {/* Footer Navigation */}
      <div className="mt-auto flex flex-col gap-1 pt-3 border-t border-surface-border">
        <NavLink
          to="/settings"
          className={({ isActive }) =>
            `flex items-center gap-3 px-3 py-2 rounded-lg transition-colors duration-200 text-label-md font-label-md ${
              isActive
                ? "bg-surface-container-low text-primary font-bold"
                : "text-on-surface-variant hover:bg-surface-container-low"
            }`
          }
        >
          <span className="material-symbols-outlined text-[20px]">settings</span>
          <span>Settings</span>
        </NavLink>

        <NavLink
          to="/profile"
          className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-surface-container-low transition-colors duration-200 group"
        >
          <div className="w-8 h-8 rounded-full overflow-hidden border border-surface-border shrink-0 bg-surface-container">
            <img
              src={user.avatarUrl}
              alt={user.name}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-label-md text-label-md text-on-surface truncate font-semibold">
              {user.name}
            </p>
            <p className="font-label-sm text-[11px] text-on-surface-variant truncate">
              Hostel 4
            </p>
          </div>
        </NavLink>
      </div>
    </aside>
  );
};
