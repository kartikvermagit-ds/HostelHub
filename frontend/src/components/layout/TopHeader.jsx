import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useApp } from '../../context/AppContext';

export const TopHeader = () => {
  const { user, searchQuery, setSearchQuery } = useApp();
  const navigate = useNavigate();
  const location = useLocation();

  const isUploadPage = location.pathname === '/upload';

  return (
    <header className="bg-surface-container-lowest dark:bg-inverse-surface border-b border-surface-border dark:border-outline-variant flex justify-between items-center w-full px-4 md:px-margin-page py-stack-sm sticky top-0 z-30 transition-all duration-200">
      {/* Mobile Brand / Page Title */}
      <div className="flex items-center gap-2 lg:hidden">
        <Link to="/" className="font-headline-md text-headline-sm-mobile md:text-headline-md font-bold text-primary dark:text-primary-fixed">
          HostelHub
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
      <div className="flex items-center gap-3 md:gap-4">
        {/* Notifications Icon Button */}
        <button
          aria-label="Notifications"
          className="text-on-surface-variant hover:text-primary transition-colors p-2 rounded-full hover:bg-surface-container-low relative"
          onClick={() => alert("No new notifications at this time.")}
        >
          <span className="material-symbols-outlined text-[22px]">notifications</span>
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-tertiary"></span>
        </button>

        {/* Quick Upload Button (hidden on Upload page and small screens) */}
        {!isUploadPage && (
          <Link
            to="/upload"
            className="hidden md:flex bg-primary text-on-primary font-label-md text-label-md py-2 px-4 rounded-lg items-center gap-2 hover:opacity-90 transition-opacity shadow-sm"
          >
            <span className="material-symbols-outlined text-[18px]">add</span>
            <span>Upload</span>
          </Link>
        )}

        {/* User Profile Avatar */}
        <Link
          to="/profile"
          className="w-8 h-8 md:w-9 md:h-9 rounded-full bg-secondary-container overflow-hidden border border-surface-border cursor-pointer hover:ring-2 hover:ring-primary/40 transition-all shrink-0"
        >
          <img
            src={user.avatarUrl}
            alt={user.name}
            className="w-full h-full object-cover"
          />
        </Link>
      </div>
    </header>
  );
};
