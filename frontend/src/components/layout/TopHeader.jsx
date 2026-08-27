import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { GlassInput } from '../ui';

export const TopHeader = () => {
  const { user, searchQuery, setSearchQuery } = useApp();
  const { logout } = useAuth();
  const navigate = useNavigate();

  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    setIsDarkMode(document.documentElement.classList.contains('dark'));
  }, []);

  const toggleDarkMode = () => {
    const isDark = document.documentElement.classList.toggle('dark');
    setIsDarkMode(isDark);
  };

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
  const hostelInfo = user?.hostel ? `${user.hostel}${user.room_number ? ` • ${user.room_number}` : ''}` : 'Hostel 4';

  return (
    <header className="sticky top-0 z-30 w-full px-4 md:px-8 py-3.5 flex items-center justify-between gap-4 transition-all">
      {/* Mobile Brand Title with Official Logo */}
      <div className="flex items-center gap-2.5 lg:hidden shrink-0">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-9 h-9 rounded-xl glass-panel flex items-center justify-center shrink-0 overflow-hidden p-1 shadow-xs group-hover:scale-105 transition-transform">
            <img src="/logo-app.png" alt="HostelHub Logo" className="w-full h-full object-contain rounded-lg" />
          </div>
          <span className="font-headline-md text-base font-extrabold text-[#0e2724] dark:text-[#f0faf8]">
            HostelHub
          </span>
        </Link>
      </div>

      {/* Center / Left: Floating Glass Command Search Bar */}
      <div className="hidden sm:flex flex-1 max-w-xl">
        <GlassInput
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search notes, PYQs, videos, rooms... (⌘K)"
          icon="search"
          shortcut="⌘K"
          className="w-full"
        />
      </div>

      {/* Right Controls: Theme Toggle, Notifications, User Menu */}
      <div className="flex items-center gap-2.5 shrink-0">
        {/* Day / Dark Mode Atmosphere Toggle */}
        <button
          type="button"
          onClick={toggleDarkMode}
          className="w-9 h-9 rounded-xl glass-panel flex items-center justify-center text-[#2e4c47] dark:text-[#cbe8e3] hover:text-primary dark:hover:text-[#89f5e7] hover:border-primary/40 shadow-xs active:scale-95 transition-all"
          title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        >
          <span className="material-symbols-outlined text-[19px]">
            {isDarkMode ? 'light_mode' : 'dark_mode'}
          </span>
        </button>

        {/* Notifications Button */}
        <div className="relative">
          <button
            type="button"
            onClick={() => {
              setShowNotifications(!showNotifications);
              setShowUserMenu(false);
            }}
            className="w-9 h-9 rounded-xl glass-panel flex items-center justify-center text-[#2e4c47] dark:text-[#cbe8e3] hover:text-primary dark:hover:text-[#89f5e7] hover:border-primary/40 shadow-xs relative active:scale-95 transition-all"
            title="Notifications"
          >
            <span className="material-symbols-outlined text-[20px]">notifications</span>
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-primary rounded-full ring-2 ring-surface shadow-xs"></span>
          </button>

          {/* Notifications Glass Dropdown */}
          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 glass-floating rounded-2xl p-4 shadow-2xl z-50 border border-white/70 dark:border-primary-fixed/20 animate-fade-in">
              <div className="flex items-center justify-between pb-3 border-b border-surface-border/50">
                <h4 className="font-headline-sm text-xs font-bold text-[#0e2724] dark:text-[#f0faf8]">Notifications</h4>
                <span className="text-[10px] text-primary font-bold px-2 py-0.5 rounded-full bg-primary/10">
                  1 New
                </span>
              </div>

              <div className="divide-y divide-surface-border/40 max-h-72 overflow-y-auto pt-2 scrollbar-none">
                {mockNotifications.map((notif) => (
                  <div key={notif.id} className="py-2.5 flex items-start gap-3 hover:bg-surface-container/40 rounded-xl px-2 transition-colors">
                    <div className="w-8 h-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0 mt-0.5">
                      <span className="material-symbols-outlined text-[17px]">{notif.icon}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-[#0e2724] dark:text-[#f0faf8] truncate">{notif.title}</p>
                      <p className="text-[11px] text-[#42605b] dark:text-[#a0c5bf] line-clamp-2 mt-0.5 font-medium">{notif.desc}</p>
                      <span className="text-[10px] text-[#698a84] dark:text-[#7ba29c] mt-1 block font-medium">{notif.time}</span>
                    </div>
                    {notif.unread && (
                      <span className="w-2 h-2 rounded-full bg-primary shrink-0 mt-1.5"></span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* User Profile Trigger */}
        <div className="relative">
          <button
            type="button"
            onClick={() => {
              setShowUserMenu(!showUserMenu);
              setShowNotifications(false);
            }}
            className="flex items-center gap-2 p-1 rounded-xl glass-panel hover:border-primary/40 shadow-xs active:scale-95 transition-all"
          >
            <img
              src={avatarUrl}
              alt={displayName}
              className="w-7 h-7 rounded-lg object-cover ring-1 ring-primary/30"
            />
            <span className="material-symbols-outlined text-[17px] text-[#45635e] dark:text-[#a2c5bf] hidden sm:block">
              expand_more
            </span>
          </button>

          {/* User Profile Glass Popover */}
          {showUserMenu && (
            <div className="absolute right-0 mt-2 w-56 glass-floating rounded-2xl p-3 shadow-2xl z-50 border border-white/70 dark:border-primary-fixed/20 animate-fade-in text-xs">
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
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
