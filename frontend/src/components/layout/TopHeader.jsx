import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';

export const TopHeader = () => {
  const { user, searchQuery, setSearchQuery } = useApp();
  const { logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const isUploadPage = location.pathname === '/upload';

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
    <header className="bg-surface-container-lowest border-b border-surface-border flex justify-between items-center w-full px-4 md:px-margin-page py-stack-sm sticky top-0 z-30 transition-all duration-200">
      {/* Mobile Brand / Page Title */}
      <div className="flex items-center gap-2.5 lg:hidden">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-surface-container flex items-center justify-center shrink-0 overflow-hidden p-0.5 shadow-xs">
            <img src="/logo-app.png" alt="HostelHub Logo" className="w-full h-full object-contain rounded-md" />
          </div>
          <span className="font-headline-md text-headline-sm-mobile md:text-headline-md font-bold text-primary">
            HostelHub
          </span>
        </Link>
      </div>

      {/* Desktop Breadcrumb / Search Bar */}
      <div className="hidden md:flex flex-1 max-w-xl relative items-center">
        <span className="material-symbols-outlined absolute left-3 text-on-surface-variant text-[20px] pointer-events-none">
          search
        </span>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search notes, subjects, PYQs, videos..."
          className="w-full pl-10 pr-4 py-2 bg-surface-bright border border-surface-border rounded-lg text-body-md font-body-md focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors text-on-surface placeholder:text-on-surface-variant"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery("")}
            className="absolute right-3 text-on-surface-variant hover:text-on-surface"
          >
            <span className="material-symbols-outlined text-[16px]">close</span>
          </button>
        )}
      </div>

      {/* Trailing Actions */}
      <div className="flex items-center gap-3 md:gap-4 relative">
        {/* Notifications Icon Button */}
        <div className="relative">
          <button
            aria-label="Notifications"
            className="text-on-surface-variant hover:text-primary transition-colors p-2 rounded-full hover:bg-surface-container-low relative"
            onClick={() => {
              setShowNotifications(!showNotifications);
              setShowUserMenu(false);
            }}
          >
            <span className="material-symbols-outlined text-[22px]">notifications</span>
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-tertiary"></span>
          </button>

          {/* Notifications Dropdown Panel */}
          {showNotifications && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setShowNotifications(false)}
              ></div>
              <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-surface-container-lowest border border-surface-border rounded-2xl shadow-xl z-50 p-4 animate-fade-in">
                <div className="flex items-center justify-between pb-3 border-b border-surface-border mb-3">
                  <h3 className="font-headline-sm text-label-md font-bold text-on-surface">
                    Hostel Notifications
                  </h3>
                  <span className="text-[11px] bg-primary/10 text-primary font-semibold px-2 py-0.5 rounded-full">
                    1 New
                  </span>
                </div>

                <div className="space-y-2.5 max-h-72 overflow-y-auto">
                  {mockNotifications.map((n) => (
                    <div
                      key={n.id}
                      className={`p-3 rounded-xl flex items-start gap-3 transition-colors ${
                        n.unread ? 'bg-surface-container-low border border-primary/20' : 'bg-surface hover:bg-surface-container-low'
                      }`}
                    >
                      <div className="w-8 h-8 rounded-lg bg-surface-variant flex items-center justify-center shrink-0 text-primary">
                        <span className="material-symbols-outlined text-[18px]">{n.icon}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start">
                          <h4 className="text-xs font-bold text-on-surface truncate">{n.title}</h4>
                          <span className="text-[10px] text-on-surface-variant shrink-0 ml-2">{n.time}</span>
                        </div>
                        <p className="text-[12px] text-on-surface-variant mt-0.5 line-clamp-2">{n.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Quick Upload Button */}
        {!isUploadPage && (
          <Link
            to="/upload"
            className="hidden md:flex bg-primary text-on-primary font-label-md text-label-md py-2 px-4 rounded-lg items-center gap-2 hover:opacity-90 transition-opacity shadow-sm"
          >
            <span className="material-symbols-outlined text-[18px]">add</span>
            <span>Upload</span>
          </Link>
        )}

        {/* User Profile Avatar with Dropdown */}
        <div className="relative">
          <button
            onClick={() => {
              setShowUserMenu(!showUserMenu);
              setShowNotifications(false);
            }}
            className="w-8 h-8 md:w-9 md:h-9 rounded-full bg-secondary-container overflow-hidden border border-surface-border cursor-pointer hover:ring-2 hover:ring-primary/40 transition-all shrink-0 block"
            aria-label="User Profile Menu"
          >
            <img
              src={avatarUrl}
              alt={displayName}
              className="w-full h-full object-cover"
            />
          </button>

          {/* User Menu Dropdown */}
          {showUserMenu && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setShowUserMenu(false)}
              ></div>
              <div className="absolute right-0 mt-2 w-56 bg-surface-container-lowest border border-surface-border rounded-2xl shadow-xl z-50 p-2 animate-fade-in">
                {/* Header User Info */}
                <div className="p-3 border-b border-surface-border mb-1">
                  <p className="text-sm font-bold text-on-surface truncate">{displayName}</p>
                  <p className="text-[11px] text-on-surface-variant truncate">{hostelInfo}</p>
                </div>

                <Link
                  to="/profile"
                  onClick={() => setShowUserMenu(false)}
                  className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-on-surface hover:bg-surface-container-low transition-colors"
                >
                  <span className="material-symbols-outlined text-[18px] text-on-surface-variant">person</span>
                  <span>My Profile</span>
                </Link>

                <Link
                  to="/saved"
                  onClick={() => setShowUserMenu(false)}
                  className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-on-surface hover:bg-surface-container-low transition-colors"
                >
                  <span className="material-symbols-outlined text-[18px] text-on-surface-variant">bookmark</span>
                  <span>Saved Library</span>
                </Link>

                <Link
                  to="/settings"
                  onClick={() => setShowUserMenu(false)}
                  className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-on-surface hover:bg-surface-container-low transition-colors"
                >
                  <span className="material-symbols-outlined text-[18px] text-on-surface-variant">settings</span>
                  <span>Settings</span>
                </Link>

                <div className="my-1 border-t border-surface-border"></div>

                <button
                  onClick={() => {
                    setShowUserMenu(false);
                    handleLogout();
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors"
                >
                  <span className="material-symbols-outlined text-[18px]">logout</span>
                  <span>Sign Out</span>
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
};
