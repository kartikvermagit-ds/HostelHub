import React from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { TopHeader } from './TopHeader';
import { BottomNav } from './BottomNav';

export const AppLayout = () => {
  return (
    <div className="text-on-surface bg-app-bg min-h-screen flex flex-col antialiased">
      {/* Persistent Left Sidebar for Desktop */}
      <Sidebar />

      {/* Main Container Area */}
      <div className="flex-1 flex flex-col min-h-screen w-full lg:ml-64 transition-all">
        {/* Sticky Top Header */}
        <TopHeader />

        {/* Page Content Outlet */}
        <div className="flex-1 flex flex-col pb-20 lg:pb-8">
          <Outlet />
        </div>
      </div>

      {/* Fixed Bottom Nav for Mobile */}
      <BottomNav />
    </div>
  );
};
