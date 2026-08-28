import React, { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../../context/AppContext';
import { useHostelStore } from '../../stores/hostelStore';
import { HeroSpatialStage } from '../3d/HeroSpatialStage';
import { RoomInterior3D } from '../3d/RoomInterior3D';
import { RoomDetailModal } from '../3d/RoomDetailModal';
import { InteractiveRoomModals } from '../3d/InteractiveRoomModals';
import { GlassBottomSheet, GlassButton } from '../ui';
import { useReducedMotion } from '../3d/useReducedMotion';

export const HeroSection = () => {
  const { user, resources, upcomingTests, setActiveCategoryTab } = useApp();
  const {
    selectedRoomId,
    setSelectedRoomId,
    getCurrentHostel,
    getCurrentRoom,
    getAllRoomsForCurrentHostel,
    lightingMode,
    activeInteriorTab,
    setActiveInteriorTab,
    favoriteRoomIds,
    toggleFavoriteRoom,
    comparedRoomIds,
    toggleCompareRoom,
    setActiveInteractiveModal
  } = useHostelStore();

  const prefersReducedMotion = useReducedMotion();
  const [mouseOffset, setMouseOffset] = useState({ x: 0, y: 0 });
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);

  const currentHostel = getCurrentHostel();
  const currentRoom = getCurrentRoom();
  const allRooms = getAllRoomsForCurrentHostel();

  // Dynamic real resource statistics from application state
  const pyqsCount = useMemo(() => {
    return resources.filter(
      (r) =>
        r.type?.toLowerCase() === 'pyq' ||
        r.title?.toLowerCase().includes('pyq') ||
        r.title?.toLowerCase().includes('question')
    ).length;
  }, [resources]);

  const videosCount = useMemo(() => {
    return resources.filter(
      (r) =>
        r.type === 'VID' ||
        r.type?.toLowerCase().includes('video') ||
        r.duration
    ).length;
  }, [resources]);

  const nextCT = upcomingTests && upcomingTests.length > 0 ? upcomingTests[0] : null;

  // Subtle mouse parallax handler (2–6px maximum)
  const handleMouseMove = (e) => {
    if (prefersReducedMotion) return;
    const { clientX, clientY, currentTarget } = e;
    const rect = currentTarget.getBoundingClientRect();
    const x = ((clientX - rect.left) / rect.width - 0.5) * 6;
    const y = ((clientY - rect.top) / rect.height - 0.5) * 6;
    setMouseOffset({ x, y });
  };

  const handleMouseLeave = () => {
    setMouseOffset({ x: 0, y: 0 });
  };

  const handleExplore3DClick = () => {
    const stageEl = document.getElementById('hostel-3d-stage');
    if (stageEl) {
      stageEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  const handleScrollToResources = () => {
    const resEl = document.getElementById('academic-resources-section');
    if (resEl) {
      resEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleScrollToCTZone = () => {
    const ctEl = document.getElementById('upcoming-cts-section');
    if (ctEl) {
      ctEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const isRoomFavorite = currentRoom && favoriteRoomIds.includes(currentRoom.id);
  const isRoomCompared = currentRoom && comparedRoomIds.includes(currentRoom.id);

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'available':
        return 'text-emerald-600 dark:text-emerald-400 bg-emerald-500/15 border-emerald-500/30';
      case 'maintenance':
        return 'text-amber-600 dark:text-amber-400 bg-amber-500/15 border-amber-500/30';
      case 'reserved':
        return 'text-blue-600 dark:text-blue-400 bg-blue-500/15 border-blue-500/30';
      case 'occupied':
      default:
        return 'text-[#45635e] dark:text-[#a0c5bf] bg-slate-500/15 border-slate-500/30';
    }
  };

  const getStatusDotBg = (status) => {
    switch (status?.toLowerCase()) {
      case 'available':
        return 'bg-emerald-400 shadow-emerald-400/50';
      case 'maintenance':
        return 'bg-amber-400 shadow-amber-400/50';
      case 'reserved':
        return 'bg-blue-400 shadow-blue-400/50';
      case 'occupied':
      default:
        return 'bg-slate-400 shadow-slate-400/50';
    }
  };

  return (
    <section
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="w-full relative min-h-[calc(100vh-5.5rem)] flex flex-col justify-between pt-2 sm:pt-4 pb-4"
    >
      {/* =================================================== */}
      {/* 1. MAIN HERO GRID: Typography + 3D Spatial Stage    */}
      {/* =================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center flex-1">
        {/* LEFT COLUMN: Premium Typography, Message, and CTAs */}
        <motion.div
          style={{
            x: mouseOffset.x,
            y: mouseOffset.y,
            transition: 'transform 0.15s ease-out',
          }}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="lg:col-span-5 flex flex-col gap-4 sm:gap-5 z-10"
        >
          {/* Small Glass Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full glass-panel border border-primary/30 w-fit shadow-xs backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
            <span className="font-label-sm text-[11px] font-extrabold tracking-widest text-[#0e2724] dark:text-[#89f5e7] uppercase">
              HOSTEL ACADEMIC SPACE
            </span>
          </div>

          {/* Large Premium Spatial Typography Heading */}
          <div className="space-y-1">
            <h1 className="font-display text-4xl sm:text-5xl lg:text-[54px] font-black tracking-tight text-[#091f1c] dark:text-[#f2fdfa] leading-[1.06]">
              Your Hostel. <br />
              <span className="text-primary dark:text-[#89f5e7]">Your Space.</span> <br />
              Your Study Hub.
            </h1>
          </div>

          {/* Supporting Statement */}
          <p className="text-sm sm:text-base text-[#2e4d47] dark:text-[#b4d8d2] font-medium leading-relaxed max-w-lg">
            Explore your hostel in 3D, discover rooms, share resources, and prepare smarter together.
          </p>

          {/* Primary / Secondary / Tertiary CTA Buttons */}
          <div className="flex flex-wrap items-center gap-3 pt-1">
            {/* Primary Solid Teal CTA */}
            <button
              type="button"
              onClick={handleExplore3DClick}
              className="px-6 py-3 rounded-full bg-primary hover:bg-[#00524b] text-white font-headline-sm text-sm font-extrabold shadow-lg shadow-primary/30 hover:shadow-primary/50 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-2 group"
            >
              <span>Explore 3D Hostel</span>
              <span className="material-symbols-outlined text-[18px] group-hover:translate-x-1 transition-transform">
                arrow_forward
              </span>
            </button>

            {/* Secondary Frosted Glass CTA */}
            <button
              type="button"
              onClick={handleScrollToResources}
              className="px-5 py-3 rounded-full glass-panel-strong border border-white/70 dark:border-primary-fixed/25 text-[#14332e] dark:text-[#e4f5f1] font-headline-sm text-sm font-extrabold shadow-md hover:bg-white/80 dark:hover:bg-white/10 hover:border-primary/40 active:scale-[0.98] transition-all"
            >
              Browse Resources
            </button>

            {/* Third Action: View Upcoming CTs */}
            {nextCT && (
              <button
                type="button"
                onClick={handleScrollToCTZone}
                className="w-full sm:w-auto inline-flex items-center gap-2 px-3.5 py-2 rounded-2xl glass-panel text-xs font-bold text-[#2d4d47] dark:text-[#b4d6d0] hover:text-primary dark:hover:text-[#89f5e7] hover:border-primary/40 transition-colors"
              >
                <span className="material-symbols-outlined text-amber-500 text-[16px]">
                  event_upcoming
                </span>
                <span>Next CT:</span>
                <span className="font-extrabold text-[#0e2724] dark:text-[#f0faf8] truncate max-w-[140px]">
                  {nextCT.title}
                </span>
                <span className="px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-600 dark:text-amber-400 text-[10px] font-bold">
                  {nextCT.timeLeftShort || nextCT.timeLeft}
                </span>
              </button>
            )}
          </div>

          {/* =================================================== */}
          {/* LIVE ACADEMIC CONNECTION FLOATING INDICATORS        */}
          {/* =================================================== */}
          <div className="pt-2 border-t border-surface-border/50">
            <div className="text-[11px] font-bold text-[#45645e] dark:text-[#8cb3ac] uppercase tracking-wider mb-2">
              Live Hostel Academic Network
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {/* Academic Resources */}
              <button
                type="button"
                onClick={() => {
                  setActiveCategoryTab('All');
                  handleScrollToResources();
                }}
                className="p-2.5 rounded-2xl glass-panel text-left hover:border-primary/40 hover:-translate-y-0.5 transition-all group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-base">📚</span>
                  <span className="text-xs font-black text-primary group-hover:scale-110 transition-transform">
                    {resources.length}
                  </span>
                </div>
                <p className="text-[11px] font-bold text-[#0e2724] dark:text-[#f0faf8] mt-1 truncate">
                  Resources
                </p>
                <p className="text-[9.5px] text-[#4d6b65] dark:text-[#90b3ad]">Shared notes</p>
              </button>

              {/* Upcoming CTs */}
              <button
                type="button"
                onClick={handleScrollToCTZone}
                className="p-2.5 rounded-2xl glass-panel text-left hover:border-primary/40 hover:-translate-y-0.5 transition-all group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-base">📝</span>
                  <span className="text-xs font-black text-amber-500 group-hover:scale-110 transition-transform">
                    {upcomingTests.length}
                  </span>
                </div>
                <p className="text-[11px] font-bold text-[#0e2724] dark:text-[#f0faf8] mt-1 truncate">
                  Upcoming CTs
                </p>
                <p className="text-[9.5px] text-[#4d6b65] dark:text-[#90b3ad]">Test schedules</p>
              </button>

              {/* PYQs */}
              <button
                type="button"
                onClick={() => {
                  setActiveCategoryTab('PYQs');
                  handleScrollToResources();
                }}
                className="p-2.5 rounded-2xl glass-panel text-left hover:border-primary/40 hover:-translate-y-0.5 transition-all group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-base">📄</span>
                  <span className="text-xs font-black text-primary group-hover:scale-110 transition-transform">
                    {pyqsCount}
                  </span>
                </div>
                <p className="text-[11px] font-bold text-[#0e2724] dark:text-[#f0faf8] mt-1 truncate">
                  PYQs Archive
                </p>
                <p className="text-[9.5px] text-[#4d6b65] dark:text-[#90b3ad]">Solved papers</p>
              </button>

              {/* Video Lectures */}
              <button
                type="button"
                onClick={() => {
                  setActiveCategoryTab('Videos');
                  handleScrollToResources();
                }}
                className="p-2.5 rounded-2xl glass-panel text-left hover:border-primary/40 hover:-translate-y-0.5 transition-all group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-base">🎥</span>
                  <span className="text-xs font-black text-primary group-hover:scale-110 transition-transform">
                    {videosCount}
                  </span>
                </div>
                <p className="text-[11px] font-bold text-[#0e2724] dark:text-[#f0faf8] mt-1 truncate">
                  Video Lectures
                </p>
                <p className="text-[9.5px] text-[#4d6b65] dark:text-[#90b3ad]">Curated streams</p>
              </button>
            </div>
          </div>
        </motion.div>

        {/* RIGHT COLUMN: 3D Spatial Stage (The Hero Star) */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: 'easeOut', delay: 0.15 }}
          className="lg:col-span-7 flex flex-col gap-3"
        >
          <HeroSpatialStage
            onSelectRoom={(room) => {
              setIsMobileDrawerOpen(true);
            }}
          />

          {/* Interactive Room Inspector Card (Expands when room is selected) */}
          <AnimatePresence>
            {selectedRoomId && currentRoom && (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.25 }}
                className="p-4 sm:p-5 rounded-3xl glass-floating border border-white/80 dark:border-primary-fixed/25 shadow-2xl relative overflow-hidden backdrop-blur-2xl"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-surface-border/50">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-headline-md text-lg sm:text-xl font-extrabold text-[#0e2724] dark:text-[#f0faf8]">
                        ROOM {currentRoom.roomNumber}
                      </h3>
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-xs font-extrabold uppercase tracking-wider border flex items-center gap-1 ${getStatusColor(
                          currentRoom.status
                        )}`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${getStatusDotBg(currentRoom.status)}`}></span>
                        <span>{currentRoom.status}</span>
                      </span>

                      {/* Favorite Room */}
                      <button
                        type="button"
                        onClick={() => toggleFavoriteRoom(currentRoom.id)}
                        className={`p-1.5 rounded-xl hover:bg-surface-container/60 transition-colors ${
                          isRoomFavorite ? 'text-red-500' : 'text-[#425d57] dark:text-[#a0c2bd]'
                        }`}
                        title="Save Favorite Room"
                      >
                        <span className="material-symbols-outlined text-[18px]">
                          {isRoomFavorite ? 'favorite' : 'favorite_border'}
                        </span>
                      </button>

                      {/* Compare */}
                      <button
                        type="button"
                        onClick={() => toggleCompareRoom(currentRoom.id)}
                        className={`p-1.5 rounded-xl hover:bg-surface-container/60 transition-colors ${
                          isRoomCompared ? 'text-primary' : 'text-[#425d57] dark:text-[#a0c2bd]'
                        }`}
                        title="Compare Room"
                      >
                        <span className="material-symbols-outlined text-[18px]">compare_arrows</span>
                      </button>

                      {/* QR Share */}
                      <button
                        type="button"
                        onClick={() => setActiveInteractiveModal('share-qr')}
                        className="p-1.5 rounded-xl hover:bg-surface-container/60 text-[#425d57] dark:text-[#a0c2bd] hover:text-primary transition-colors"
                        title="Room QR Code"
                      >
                        <span className="material-symbols-outlined text-[18px]">qr_code</span>
                      </button>
                    </div>

                    <p className="text-xs text-[#33534d] dark:text-[#b0d2cc] mt-0.5 font-medium">
                      {currentHostel.name} • Floor {currentRoom.floorNumber} • {currentRoom.roomType || 'Single'}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <GlassButton
                      variant="primary"
                      size="sm"
                      onClick={() => setIsDetailModalOpen(true)}
                      icon="arrow_forward"
                    >
                      Explore Room Details
                    </GlassButton>
                    <button
                      type="button"
                      onClick={() => setSelectedRoomId(null)}
                      className="p-1.5 rounded-xl glass-panel text-[#425d57] dark:text-[#a0c2bd] hover:text-primary transition-colors"
                      title="Close Room Preview"
                    >
                      <span className="material-symbols-outlined text-[18px]">close</span>
                    </button>
                  </div>
                </div>

                {/* Quick Shortcuts: Laptop Workspace & Bookshelf */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-3">
                  <button
                    type="button"
                    onClick={() => setActiveInteractiveModal('laptop-workspace')}
                    className="p-2.5 rounded-2xl glass-panel text-left hover:border-primary/40 transition-all flex items-center gap-2.5"
                  >
                    <div className="w-8 h-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                      <span className="material-symbols-outlined text-[18px]">laptop</span>
                    </div>
                    <div>
                      <p className="text-xs font-bold text-[#0e2724] dark:text-[#f0faf8]">Study Laptop</p>
                      <p className="text-[10px] text-[#425d57] dark:text-[#a0c2bd]">Notes & PYQs</p>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveInteractiveModal('bookshelf-resources')}
                    className="p-2.5 rounded-2xl glass-panel text-left hover:border-primary/40 transition-all flex items-center gap-2.5"
                  >
                    <div className="w-8 h-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                      <span className="material-symbols-outlined text-[18px]">menu_book</span>
                    </div>
                    <div>
                      <p className="text-xs font-bold text-[#0e2724] dark:text-[#f0faf8]">Bookshelf</p>
                      <p className="text-[10px] text-[#425d57] dark:text-[#a0c2bd]">Textbooks & Units</p>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setIsDetailModalOpen(true)}
                    className="p-2.5 rounded-2xl glass-panel text-left hover:border-primary/40 transition-all flex items-center gap-2.5"
                  >
                    <div className="w-8 h-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                      <span className="material-symbols-outlined text-[18px]">meeting_room</span>
                    </div>
                    <div>
                      <p className="text-xs font-bold text-[#0e2724] dark:text-[#f0faf8]">Room Info</p>
                      <p className="text-[10px] text-[#425d57] dark:text-[#a0c2bd]">Facilities & Wi-Fi</p>
                    </div>
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* =================================================== */}
      {/* 2. SCROLL TRANSITION INDICATOR                      */}
      {/* =================================================== */}
      <div className="flex flex-col items-center justify-center pt-6 sm:pt-8 text-center z-10">
        <button
          type="button"
          onClick={handleScrollToCTZone}
          className="inline-flex flex-col items-center gap-1.5 text-xs font-bold text-[#35544e] dark:text-[#a6cdc7] hover:text-primary dark:hover:text-[#89f5e7] transition-all group cursor-pointer"
        >
          <span className="tracking-wide">Explore your academic space</span>
          <motion.span
            animate={{ y: [0, 4, 0] }}
            transition={{ repeat: Infinity, duration: 1.8, ease: 'easeInOut' }}
            className="material-symbols-outlined text-primary text-[20px]"
          >
            keyboard_arrow_down
          </motion.span>
        </button>
      </div>

      {/* Room Detail Modal */}
      <RoomDetailModal
        isOpen={isDetailModalOpen}
        room={currentRoom}
        onClose={() => setIsDetailModalOpen(false)}
      />

      {/* Mobile Drawer Bottom Sheet for Room Inspection */}
      <GlassBottomSheet
        isOpen={isMobileDrawerOpen && !!currentRoom}
        onClose={() => setIsMobileDrawerOpen(false)}
        title={`Room ${currentRoom?.roomNumber || ''} Overview`}
      >
        {currentRoom && (
          <div className="space-y-4 text-xs">
            <div className="flex items-center justify-between pb-2 border-b border-surface-border">
              <span className="text-[#35544e] dark:text-[#a6cdc7]">Status</span>
              <span className={`px-2.5 py-0.5 rounded-full font-bold uppercase text-[10px] ${getStatusColor(currentRoom.status)}`}>
                {currentRoom.status}
              </span>
            </div>
            <div className="flex items-center justify-between pb-2 border-b border-surface-border">
              <span className="text-[#35544e] dark:text-[#a6cdc7]">Floor</span>
              <span className="font-bold text-[#0e2724] dark:text-[#f0faf8]">Floor {currentRoom.floorNumber}</span>
            </div>
            <div className="flex items-center justify-between pb-2 border-b border-surface-border">
              <span className="text-[#35544e] dark:text-[#a6cdc7]">Room Type</span>
              <span className="font-bold text-[#0e2724] dark:text-[#f0faf8]">{currentRoom.roomType || 'Single'}</span>
            </div>
            <div className="pt-2 flex flex-col gap-2">
              <GlassButton
                variant="primary"
                className="w-full"
                onClick={() => {
                  setIsMobileDrawerOpen(false);
                  setIsDetailModalOpen(true);
                }}
              >
                View Full Room Facilities & Resources
              </GlassButton>
            </div>
          </div>
        )}
      </GlassBottomSheet>

      {/* Interactive Room Modals (Laptop, Bookshelf, QR) */}
      <InteractiveRoomModals />
    </section>
  );
};
