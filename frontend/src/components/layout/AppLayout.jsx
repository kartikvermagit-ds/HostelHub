import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Sidebar } from './Sidebar';
import { TopHeader } from './TopHeader';
import { FloatingNavbar } from './FloatingNavbar';
import { BottomNav } from './BottomNav';
import { CursorScrubVideo } from '../ui/CursorScrubVideo';

export const AppLayout = () => {
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  return (
    <div className="text-on-surface dark:text-[#e8f7f4] min-h-screen flex flex-col antialiased relative selection:bg-primary/20 selection:text-primary">
      {/* Website-wide Interactive Background Video (tt.mp4) */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <CursorScrubVideo
          videoFile="/tt.mp4"
          axis="horizontal"
          trackingArea="window"
          smoothing={0.16}
          objectFit="cover"
          objectPosition="80% center"
          autoPlay={true}
          loop={true}
          scrubOnMove={true}
          className="w-full h-full opacity-95 dark:opacity-85"
        />

        {/* Directional scrim: subtle fade on left for text legibility, open on right for video clarity */}
        <div className="absolute inset-0 bg-gradient-to-r from-white/70 via-white/25 to-transparent dark:from-[#08201C]/80 dark:via-[#08201C]/35 dark:to-transparent pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-b from-white/20 via-transparent to-white/40 dark:from-[#08201C]/50 dark:via-transparent dark:to-[#071d19]/60 pointer-events-none" />
      </div>

      {isHomePage ? (
        <div className="relative z-10 flex-1 flex flex-col">
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
        </div>
      ) : (
        <div className="relative z-10 flex-1 flex flex-col">
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
        </div>
      )}

      {/* Fixed Bottom Glass Nav for Mobile */}
      <BottomNav />
    </div>
  );
};

