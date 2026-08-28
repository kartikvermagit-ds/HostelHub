import React, { useState, useEffect } from 'react';
import { NavLink, Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { useHostelStore } from '../../stores/hostelStore';
import { GlassInput } from '../ui';

export const FloatingNavbar = () => {
  const { user, searchQuery, setSearchQuery } = useApp();
  const { logout } = useAuth();
  const { resetView, setSelectedRoomId } = useHostelStore();
  const navigate = useNavigate();
  const location = useLocation();

  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    setIsDarkMode(document.documentElement.classList.contains('dark'));
  }, []);

  const toggleDarkMode = () => {
    const isDark = document.documentElement.classList.toggle('dark');
    setIsDarkMode(isDark);
  };

  const handleExploreHostelClick = () => {
    if (location.pathname !== '/') {
      navigate('/');
      setTimeout(() => {
        const el = document.getElementById('hostel-3d-stage');
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    } else {
      setSelectedRoomId(null);
      resetView();
      const el = document.getElementById('hostel-3d-stage');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const handle3DHostelNavClick = (e) => {
    if (location.pathname === '/') {
      e.preventDefault();
      handleExploreHostelClick();
    }
  };

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/notes', label: 'Notes' },
    { to: '/ct-zone', label: 'CT Zone' },
    { to: '/pyqs', label: 'PYQs' },
    { to: '/videos', label: 'Videos' },
    { to: '/#hostel-3d-stage', label: '3D Hostel', is3D: true },
  ];

  const mockNotifications = [
    {
      id: 1,
      title: 'COA CT 1 on Monday',
      desc: 'Syllabus: Instruction cycle & addressing modes.',
      time: '1 hour ago',
      unread: true,
      icon: 'event_upcoming',
    },
    {
      id: 2,
      title: 'New Notes Uploaded',
      desc: 'Priya S. uploaded DSA Unit 3 Solved PYQs.',
      time: '3 hours ago',
      unread: false,
      icon: 'description',
    },
    {
      id: 3,
      title: 'Hostel Discussion',
      desc: '3 new replies on DBMS Normalization doubt.',
      time: '1 day ago',
      unread: false,
      icon: 'forum',
    },
  ];

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const displayName = user?.full_name || user?.name || 'Kartik Sharma';
  const avatarUrl = user?.avatar_url || user?.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150';
  const hostelInfo = user?.hostel ? `${user.hostel}${user.room_number ? ` • ${user.room_number}` : ''}` : 'Aryabhata Hostel • 303';

  return (
    <>
      <header className="sticky top-3 z-40 w-full max-w-7xl mx-auto px-3 sm:px-6 pointer-events-none">
        <nav className="w-full pointer-events-auto rounded-full glass-floating border border-white/60 dark:border-primary-fixed/20 shadow-xl px-3 sm:px-4 py-2 flex items-center justify-between gap-2 backdrop-blur-xl transition-all duration-300">
          {/* =================================================== */}
          {/* LEFT: HostelHub Logo + Brand Subtitle               */}
          {/* =================================================== */}
          <Link
            to="/"
            className="flex items-center gap-2.5 group shrink-0 pl-1"
          >
            <div className="w-9 h-9 rounded-full glass-panel flex items-center justify-center shrink-0 overflow-hidden p-1 shadow-2xs border border-white/70 dark:border-primary-fixed/25 group-hover:scale-105 transition-transform">
              <img
                src="/logo-icon.png"
                alt="HostelHub Logo"
                className="w-full h-full object-contain rounded-full"
              />
            </div>
            <div className="flex flex-col">
              <span className="font-headline-md text-sm sm:text-base font-extrabold text-[#0e2724] dark:text-[#f0faf8] tracking-tight group-hover:text-primary transition-colors leading-tight">
                HostelHub
              </span>
              <span className="text-[9.5px] sm:text-[10px] text-[#33534d] dark:text-[#89f5e7] font-semibold tracking-normal uppercase opacity-90 leading-none">
                Academic Digital Twin
              </span>
            </div>
          </Link>

          {/* =================================================== */}
          {/* CENTER: Navigation Links (Desktop)                  */}
          {/* =================================================== */}
          <div className="hidden lg:flex items-center gap-1 p-1 glass-panel rounded-full border border-white/50 dark:border-primary-fixed/15 shadow-2xs">
            {navLinks.map((link) => {
              if (link.is3D) {
                return (
                  <button
                    key={link.label}
                    type="button"
                    onClick={handle3DHostelNavClick}
                    className="px-3.5 py-1.5 rounded-full text-xs font-bold text-[#254641] dark:text-[#c4dfda] hover:text-primary dark:hover:text-[#89f5e7] hover:bg-white/40 dark:hover:bg-white/5 transition-all flex items-center gap-1.5"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span>
                    <span>{link.label}</span>
                  </button>
                );
              }

              return (
                <NavLink
                  key={link.to}
                  to={link.to}
                  end={link.to === '/'}
                  className={({ isActive }) =>
                    `px-3.5 py-1.5 rounded-full text-xs font-bold transition-all ${
                      isActive
                        ? 'bg-primary text-white shadow-xs shadow-primary/30'
                        : 'text-[#254641] dark:text-[#c4dfda] hover:text-primary dark:hover:text-[#89f5e7] hover:bg-white/40 dark:hover:bg-white/5'
                    }`
                  }
                >
                  {link.label}
                </NavLink>
              );
            })}
          </div>

          {/* =================================================== */}
          {/* RIGHT: Search • Notifications • Theme • Profile • CTA*/}
          {/* =================================================== */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            {/* Quick Search Button (Desktop & Mobile) */}
            <button
              type="button"
              onClick={() => setShowSearchModal(true)}
              className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full glass-panel text-xs font-semibold text-[#33534d] dark:text-[#b0d2cc] hover:text-primary dark:hover:text-[#89f5e7] hover:border-primary/40 shadow-2xs transition-all"
              title="Quick Search"
            >
              <span className="material-symbols-outlined text-[17px] text-primary">search</span>
              <span className="hidden md:inline">Search resources...</span>
              <kbd className="hidden md:inline-block px-1.5 py-0.5 rounded bg-black/5 dark:bg-white/10 text-[9px] font-mono font-bold">
                ⌘K
              </kbd>
            </button>

            {/* Mobile Search Icon Button */}
            <button
              type="button"
              onClick={() => setShowSearchModal(true)}
              className="sm:hidden w-8 h-8 rounded-full glass-panel flex items-center justify-center text-[#2e4c47] dark:text-[#cbe8e3] hover:text-primary shadow-2xs"
            >
              <span className="material-symbols-outlined text-[18px]">search</span>
            </button>

            {/* Theme Atmosphere Toggle */}
            <button
              type="button"
              onClick={toggleDarkMode}
              className="w-8 h-8 sm:w-9 sm:h-9 rounded-full glass-panel flex items-center justify-center text-[#2e4c47] dark:text-[#cbe8e3] hover:text-primary dark:hover:text-[#89f5e7] hover:border-primary/40 shadow-2xs active:scale-95 transition-all"
              title={isDarkMode ? 'Switch to Daylight Atmosphere' : 'Switch to Cinematic Night Atmosphere'}
            >
              <span className="material-symbols-outlined text-[18px]">
                {isDarkMode ? 'light_mode' : 'dark_mode'}
              </span>
            </button>

            {/* Notifications Dropdown Trigger */}
            <div className="relative">
              <button
                type="button"
                onClick={() => {
                  setShowNotifications(!showNotifications);
                  setShowUserMenu(false);
                }}
                className="w-8 h-8 sm:w-9 sm:h-9 rounded-full glass-panel flex items-center justify-center text-[#2e4c47] dark:text-[#cbe8e3] hover:text-primary dark:hover:text-[#89f5e7] hover:border-primary/40 shadow-2xs relative active:scale-95 transition-all"
                title="Notifications"
              >
                <span className="material-symbols-outlined text-[19px]">notifications</span>
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-primary rounded-full ring-2 ring-surface shadow-xs"></span>
              </button>

              {/* Glass Notifications Dropdown */}
              <AnimatePresence>
                {showNotifications && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.18 }}
                    className="absolute right-0 mt-2.5 w-80 sm:w-96 glass-floating rounded-2xl p-4 shadow-2xl z-50 border border-white/70 dark:border-primary-fixed/20 backdrop-blur-2xl"
                  >
                    <div className="flex items-center justify-between pb-3 border-b border-surface-border/50">
                      <h4 className="font-headline-sm text-xs font-bold text-[#0e2724] dark:text-[#f0faf8]">
                        Notifications
                      </h4>
                      <span className="text-[10px] text-primary font-bold px-2 py-0.5 rounded-full bg-primary/10">
                        1 Unread
                      </span>
                    </div>

                    <div className="divide-y divide-surface-border/40 max-h-72 overflow-y-auto pt-2 scrollbar-none">
                      {mockNotifications.map((notif) => (
                        <div
                          key={notif.id}
                          className="py-2.5 flex items-start gap-3 hover:bg-surface-container/40 rounded-xl px-2 transition-colors"
                        >
                          <div className="w-8 h-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0 mt-0.5">
                            <span className="material-symbols-outlined text-[17px]">{notif.icon}</span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-bold text-[#0e2724] dark:text-[#f0faf8] truncate">
                              {notif.title}
                            </p>
                            <p className="text-[11px] text-[#42605b] dark:text-[#a0c5bf] line-clamp-2 mt-0.5 font-medium">
                              {notif.desc}
                            </p>
                            <span className="text-[10px] text-[#698a84] dark:text-[#7ba29c] mt-1 block font-medium">
                              {notif.time}
                            </span>
                          </div>
                          {notif.unread && (
                            <span className="w-2 h-2 rounded-full bg-primary shrink-0 mt-1.5"></span>
                          )}
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* User Profile Avatar / Menu */}
            <div className="relative">
              <button
                type="button"
                onClick={() => {
                  setShowUserMenu(!showUserMenu);
                  setShowNotifications(false);
                }}
                className="flex items-center gap-1.5 p-0.5 sm:p-1 rounded-full glass-panel hover:border-primary/40 shadow-2xs active:scale-95 transition-all"
              >
                <img
                  src={avatarUrl}
                  alt={displayName}
                  className="w-7 h-7 sm:w-8 sm:h-8 rounded-full object-cover ring-1 ring-primary/40"
                />
              </button>

              <AnimatePresence>
                {showUserMenu && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.18 }}
                    className="absolute right-0 mt-2.5 w-56 glass-floating rounded-2xl p-3 shadow-2xl z-50 border border-white/70 dark:border-primary-fixed/20 backdrop-blur-2xl text-xs"
                  >
                    <div className="pb-3 mb-2 border-b border-surface-border/50 px-2">
                      <p className="font-bold text-[#0e2724] dark:text-[#f0faf8] truncate">{displayName}</p>
                      <p className="text-[10px] text-primary font-semibold truncate">{hostelInfo}</p>
                    </div>

                    <div className="space-y-1">
                      <Link
                        to="/profile"
                        onClick={() => setShowUserMenu(false)}
                        className="flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-[#1a3833] dark:text-[#e4f5f1] hover:bg-surface-container/60 transition-colors font-medium"
                      >
                        <span className="material-symbols-outlined text-[17px]">account_circle</span>
                        <span>My Profile</span>
                      </Link>
                      <Link
                        to="/saved"
                        onClick={() => setShowUserMenu(false)}
                        className="flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-[#1a3833] dark:text-[#e4f5f1] hover:bg-surface-container/60 transition-colors font-medium"
                      >
                        <span className="material-symbols-outlined text-[17px]">bookmark</span>
                        <span>Saved Resources</span>
                      </Link>
                      <Link
                        to="/admin"
                        onClick={() => setShowUserMenu(false)}
                        className="flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-[#1a3833] dark:text-[#e4f5f1] hover:bg-surface-container/60 transition-colors font-medium"
                      >
                        <span className="material-symbols-outlined text-[17px]">apartment</span>
                        <span>Hostel Builder</span>
                      </Link>
                    </div>

                    <div className="pt-2 mt-2 border-t border-surface-border/50">
                      <button
                        type="button"
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-red-600 dark:text-red-400 hover:bg-red-500/10 transition-colors font-bold"
                      >
                        <span className="material-symbols-outlined text-[17px]">logout</span>
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Primary Solid Teal CTA: Explore Hostel */}
            <button
              type="button"
              onClick={handleExploreHostelClick}
              className="hidden sm:flex items-center gap-1.5 px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-full bg-primary hover:bg-[#00524b] text-white font-headline-sm text-xs font-bold shadow-md shadow-primary/25 hover:shadow-primary/40 active:scale-95 transition-all"
            >
              <span>Explore Hostel</span>
              <span className="material-symbols-outlined text-[15px]">arrow_forward</span>
            </button>

            {/* Mobile Hamburger Menu Toggle */}
            <button
              type="button"
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="lg:hidden w-8 h-8 rounded-full glass-panel flex items-center justify-center text-[#2e4c47] dark:text-[#cbe8e3] hover:text-primary shadow-2xs"
            >
              <span className="material-symbols-outlined text-[20px]">
                {showMobileMenu ? 'close' : 'menu'}
              </span>
            </button>
          </div>
        </nav>

        {/* Mobile Slide-down Navigation Sheet */}
        <AnimatePresence>
          {showMobileMenu && (
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.98 }}
              transition={{ duration: 0.2 }}
              className="lg:hidden mt-2 p-4 glass-floating rounded-3xl border border-white/70 dark:border-primary-fixed/20 shadow-2xl pointer-events-auto backdrop-blur-2xl"
            >
              <div className="grid grid-cols-2 gap-2 pb-3 border-b border-surface-border/50">
                {navLinks.map((link) => (
                  <Link
                    key={link.label}
                    to={link.to}
                    onClick={() => {
                      setShowMobileMenu(false);
                      if (link.is3D) handleExploreHostelClick();
                    }}
                    className="flex items-center gap-2 p-2.5 rounded-2xl glass-panel text-xs font-bold text-[#0e2724] dark:text-[#f0faf8] hover:text-primary transition-colors"
                  >
                    <span className="material-symbols-outlined text-[17px] text-primary">
                      {link.label === 'Home'
                        ? 'home'
                        : link.label === 'Notes'
                        ? 'description'
                        : link.label === 'CT Zone'
                        ? 'quiz'
                        : link.label === 'PYQs'
                        ? 'history_edu'
                        : link.label === 'Videos'
                        ? 'videocam'
                        : 'apartment'}
                    </span>
                    <span>{link.label}</span>
                  </Link>
                ))}
              </div>

              <div className="pt-3 flex items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowMobileMenu(false);
                    handleExploreHostelClick();
                  }}
                  className="flex-1 py-2.5 rounded-xl bg-primary text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-md"
                >
                  <span>Explore 3D Hostel</span>
                  <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Global Quick Search Modal */}
      <AnimatePresence>
        {showSearchModal && (
          <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-black/40 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              className="w-full max-w-xl glass-floating rounded-3xl p-5 border border-white/70 dark:border-primary-fixed/20 shadow-2xl"
            >
              <div className="flex items-center justify-between pb-3 border-b border-surface-border/50">
                <h3 className="font-headline-sm text-sm font-bold text-[#0e2724] dark:text-[#f0faf8] flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary text-[19px]">travel_explore</span>
                  <span>Search Academic Space</span>
                </h3>
                <button
                  type="button"
                  onClick={() => setShowSearchModal(false)}
                  className="p-1 rounded-xl text-[#3d5a54] dark:text-[#a0c2bd] hover:text-primary transition-colors"
                >
                  <span className="material-symbols-outlined text-[19px]">close</span>
                </button>
              </div>

              <div className="my-3">
                <GlassInput
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search notes, PYQs, videos, room number..."
                  icon="search"
                  autoFocus
                  className="w-full"
                />
              </div>

              <div className="flex items-center justify-between text-[11px] text-[#4d6a64] dark:text-[#90b3ad] pt-1">
                <span>Try searching: "DSA", "COA PYQs", "Room 303", "Prof Sharma"</span>
                <button
                  type="button"
                  onClick={() => setShowSearchModal(false)}
                  className="text-primary font-bold hover:underline"
                >
                  Done
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};
