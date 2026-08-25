import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Sidebar } from './Sidebar';
import { TopHeader } from './TopHeader';
import { BottomNav } from './BottomNav';

export const AppLayout = () => {
  const location = useLocation();

  return (
    <div className="text-on-surface bg-app-bg min-h-screen flex flex-col antialiased">
      {/* Persistent Left Sidebar for Desktop */}
      <Sidebar />

      {/* Main Container Area */}
      <div className="flex-1 flex flex-col min-h-screen w-full lg:ml-64 transition-all">
        {/* Sticky Top Header */}
        <TopHeader />

        {/* Page Content Outlet with Smooth Transition */}
        <div className="flex-1 flex flex-col pb-20 lg:pb-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              className="flex-1 flex flex-col"
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Fixed Bottom Nav for Mobile */}
      <BottomNav />
    </div>
  );
};
