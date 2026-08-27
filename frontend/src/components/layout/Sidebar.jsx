import React, { useState } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { GlassModal, GlassButton } from '../ui';

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
    <>
      <aside className="hidden lg:flex flex-col fixed left-4 top-4 bottom-4 w-60 z-40 glass-panel-strong rounded-3xl border border-white/70 dark:border-primary-fixed/20 shadow-2xl p-4 overflow-hidden transition-all duration-300">
        {/* Top Specular Inner Highlight Strip */}
        <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/80 dark:via-primary-fixed/30 to-transparent pointer-events-none" />

        {/* Brand Header */}
        <Link to="/" className="flex items-center gap-3 px-2 mb-5 group shrink-0">
          <div className="w-10 h-10 rounded-xl glass-panel flex items-center justify-center shrink-0 shadow-sm overflow-hidden p-1 group-hover:scale-105 group-hover:border-primary/40 transition-all duration-200">
            <img
              src="/logo-app.png"
              alt="HostelHub Logo"
              className="w-full h-full object-contain rounded-lg drop-shadow-sm"
            />
          </div>
          <div>
            <h1 className="font-headline-sm text-base font-bold text-primary leading-tight group-hover:text-primary-fixed-dim transition-colors">
              HostelHub
            </h1>
            <p className="font-label-sm text-[10px] text-on-surface-variant/80 font-medium">
              Academic Digital Twin
            </p>
          </div>
        </Link>

        {/* Upload Material Action Button */}
        <div className="mb-4 shrink-0">
          <Link
            to="/upload"
            className="w-full bg-primary text-on-primary font-label-md text-xs font-bold py-2.5 px-3 rounded-xl flex items-center justify-center gap-2 shadow-sm hover:shadow-md hover:shadow-primary/20 hover:scale-[1.01] active:scale-[0.99] transition-all duration-200"
          >
            <span className="material-symbols-outlined text-[17px]">add</span>
            <span>Upload Material</span>
          </Link>
        </div>

        {/* Navigation Links Scrollable Area */}
        <div className="flex flex-col gap-1 flex-1 overflow-y-auto pr-1 scrollbar-none">
          {mainNavLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === "/"}
              className={({ isActive }) =>
                `flex items-center gap-2.5 px-3 py-2 rounded-xl transition-all duration-200 text-xs font-semibold select-none ${
                  isActive
                    ? "bg-primary/15 text-primary font-bold shadow-2xs border border-primary/25 dark:bg-primary/25"
                    : "text-on-surface-variant hover:bg-surface-container/60 hover:text-on-surface"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <span
                    className="material-symbols-outlined text-[18px]"
                    style={isActive ? { fontVariationSettings: "'FILL' 1" } : undefined}
                  >
                    {link.icon}
                  </span>
                  <span>{link.label}</span>
                </>
              )}
            </NavLink>
          ))}

          <div className="my-2 border-t border-surface-border/50"></div>

          {/* Library Section Header */}
          <div className="px-3 py-1">
            <p className="font-label-sm text-[10px] text-on-surface-variant/70 uppercase tracking-wider font-bold">
              Library
            </p>
          </div>

          {libraryNavLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `flex items-center gap-2.5 px-3 py-2 rounded-xl transition-all duration-200 text-xs font-semibold select-none ${
                  isActive
                    ? "bg-primary/15 text-primary font-bold shadow-2xs border border-primary/25 dark:bg-primary/25"
                    : "text-on-surface-variant hover:bg-surface-container/60 hover:text-on-surface"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <span
                    className="material-symbols-outlined text-[18px]"
                    style={isActive ? { fontVariationSettings: "'FILL' 1" } : undefined}
                  >
                    {link.icon}
                  </span>
                  <span>{link.label}</span>
                </>
              )}
            </NavLink>
          ))}

          <div className="my-2 border-t border-surface-border/50"></div>

          {/* Admin 3D Twin Builder Link */}
          <NavLink
            to="/admin"
            className={({ isActive }) =>
              `flex items-center justify-between px-3 py-2 rounded-xl transition-all duration-200 text-xs font-semibold select-none ${
                isActive
                  ? "bg-primary/15 text-primary font-bold shadow-2xs border border-primary/25"
                  : "text-on-surface-variant hover:bg-surface-container/60 hover:text-on-surface"
              }`
            }
          >
            <div className="flex items-center gap-2.5">
              <span className="material-symbols-outlined text-[18px]">domain_add</span>
              <span>Hostel Builder</span>
            </div>
            <span className="px-1.5 py-0.5 rounded-md bg-secondary-container/70 text-on-secondary-container text-[9px] font-bold">
              ADMIN
            </span>
          </NavLink>
        </div>

        {/* Bottom Profile Glass Card */}
        <div className="pt-3 border-t border-surface-border/50 shrink-0">
          <div className="p-2 rounded-2xl glass-panel flex items-center justify-between gap-2 border border-white/50 dark:border-primary-fixed/15">
            <Link to="/profile" className="flex items-center gap-2.5 min-w-0 flex-1 group">
              <div className="relative">
                <img
                  src={avatarUrl}
                  alt={displayName}
                  className="w-8 h-8 rounded-xl object-cover ring-1 ring-primary/40 group-hover:scale-105 transition-transform"
                />
                <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 rounded-full ring-2 ring-surface"></span>
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-bold text-on-surface truncate group-hover:text-primary transition-colors">
                  {displayName}
                </p>
                <p className="text-[10px] text-on-surface-variant truncate">
                  {displayHostel}
                </p>
              </div>
            </Link>

            <button
              type="button"
              onClick={() => setShowLogoutConfirm(true)}
              className="p-1.5 rounded-xl text-on-surface-variant hover:text-red-500 hover:bg-red-500/10 transition-colors"
              title="Logout"
            >
              <span className="material-symbols-outlined text-[18px]">logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Logout Confirmation Glass Modal */}
      <GlassModal
        isOpen={showLogoutConfirm}
        onClose={() => setShowLogoutConfirm(false)}
        title="Confirm Logout"
        subtitle="Are you sure you want to end your current session?"
        maxWidth="max-w-md"
      >
        <div className="flex justify-end gap-3 pt-2">
          <GlassButton
            variant="secondary"
            onClick={() => setShowLogoutConfirm(false)}
          >
            Cancel
          </GlassButton>
          <GlassButton
            variant="primary"
            onClick={handleLogout}
            className="bg-red-600 hover:bg-red-700 text-white border-red-500"
          >
            Sign Out
          </GlassButton>
        </div>
      </GlassModal>
    </>
  );
};
