import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Sidebar } from './Sidebar';
import { TopHeader } from './TopHeader';
import { FloatingNavbar } from './FloatingNavbar';
import { BottomNav } from './BottomNav';

export const AppLayout = () => {
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  return (
    <div className="text-on-surface dark:text-[#e8f7f4] min-h-screen flex flex-col antialiased relative selection:bg-primary/20 selection:text-primary">
      {isHomePage ? (
        <>
          {/* Floating Glass Navbar for Spatial Landing Hero */}
          <FloatingNavbar />

          {/* Main Hero & Dashboard Container Area */}
          <div className="flex-1 flex flex-col min-h-screen w-full transition-all pb-20 lg:pb-12 px-2 sm:px-4">
            <AnimatePresence mode="wait">
              <motion.div
                key={location.pathname}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.22, ease: 'easeOut' }}
                className="flex-1 flex flex-col"
              >
                <Outlet />
              </motion.div>
            </AnimatePresence>
          </div>
        </>
      ) : (
        <>
          {/* Floating Left Glass Sidebar for Desktop on Sub-pages */}
          <Sidebar />

          {/* Main Container Area with breathing room */}
          <div className="flex-1 flex flex-col min-h-screen w-full lg:pl-[17rem] transition-all">
            {/* Sticky Floating Top Header */}
            <TopHeader />

            {/* Page Content Outlet with Smooth Transition */}
            <div className="flex-1 flex flex-col pb-24 lg:pb-10 px-2 sm:px-4">
              <AnimatePresence mode="wait">
                <motion.div
                  key={location.pathname}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.22, ease: 'easeOut' }}
                  className="flex-1 flex flex-col"
                >
                  <Outlet />
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </>
      )}

      {/* Fixed Bottom Glass Nav for Mobile */}
      <BottomNav />
    </div>
  );
};

