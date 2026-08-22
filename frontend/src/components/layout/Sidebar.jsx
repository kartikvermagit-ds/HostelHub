import React, { useState } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';

export const Sidebar = () => {
  const { user } = useApp();
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

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

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const displayName = user?.full_name || user?.name || 'Kartik Sharma';
  const displayHostel = user?.hostel ? `${user.hostel}${user.room_number ? ` • ${user.room_number}` : ''}` : 'Hostel 4 • B-204';
  const avatarUrl = user?.avatar_url || user?.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150';

  return (
    <aside className="bg-surface-container-lowest border-r border-surface-border h-screen w-64 fixed left-0 top-0 hidden lg:flex flex-col py-stack-md px-4 z-40 transition-colors duration-200">
      {/* Brand Header */}
      <div className="flex items-center gap-3 px-3 mb-6">
        <div className="w-10 h-10 rounded-lg bg-primary text-on-primary flex items-center justify-center font-display text-[22px] font-bold shrink-0 shadow-sm">
          H
        </div>
        <div>
          <h1 className="font-headline-sm text-headline-sm font-bold text-primary leading-tight">
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
                  ? "bg-surface-container-low text-primary font-bold border-r-4 border-primary"
                  : "text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface"
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
                  ? "bg-surface-container-low text-primary font-bold border-r-4 border-primary"
                  : "text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface"
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

      {/* Footer User Profile & Actions */}
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

        {/* User Card */}
        <div className="flex items-center justify-between p-2 rounded-xl bg-surface-container-low border border-surface-border mt-1">
          <Link to="/profile" className="flex items-center gap-2.5 flex-1 min-w-0">
            <div className="w-8 h-8 rounded-full overflow-hidden border border-surface-border shrink-0 bg-surface-container">
              <img
                src={avatarUrl}
                alt={displayName}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-label-md text-label-md text-on-surface truncate font-semibold">
                {displayName}
              </p>
              <p className="font-label-sm text-[11px] text-on-surface-variant truncate">
                {displayHostel}
              </p>
            </div>
          </Link>

          {/* Logout Trigger Button */}
          <button
            onClick={() => setShowLogoutConfirm(true)}
            title="Sign Out"
            className="p-1.5 rounded-lg text-on-surface-variant hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors shrink-0"
          >
            <span className="material-symbols-outlined text-[19px]">logout</span>
          </button>
        </div>
      </div>

      {/* Logout Confirmation Modal */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-surface-container-lowest border border-surface-border rounded-2xl p-6 max-w-sm w-full shadow-2xl space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-950/60 text-red-600 flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-[22px]">logout</span>
              </div>
              <div>
                <h3 className="font-headline-sm text-base font-bold text-on-surface">
                  Sign out of HostelHub?
                </h3>
                <p className="text-xs text-on-surface-variant mt-0.5">
                  You will need to sign in again to access study materials.
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                onClick={() => setShowLogoutConfirm(false)}
                className="px-4 py-2 rounded-xl border border-surface-border text-xs font-semibold text-on-surface hover:bg-surface-container-low transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleLogout}
                className="px-4 py-2 rounded-xl bg-red-600 text-white text-xs font-bold hover:bg-red-700 transition-colors shadow-sm"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
};
