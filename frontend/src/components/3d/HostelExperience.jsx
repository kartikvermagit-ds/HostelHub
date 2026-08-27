import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CanvasWrapper } from './CanvasWrapper';
import { Building3D } from './Building3D';
import { RoomInterior3D } from './RoomInterior3D';
import { HostelCamera } from './HostelCamera';
import { useHostelStore } from '../../stores/hostelStore';
import { RoomDetailModal } from './RoomDetailModal';
import { InteractiveRoomModals } from './InteractiveRoomModals';
import { calculateBuildingDimensions } from './layoutEngine';
import { GlassButton, GlassBadge, GlassBottomSheet, GlassInput } from '../ui';

/**
 * Main Interactive 3D Digital Twin Hostel Explorer
 * Luminous spatial stage, architectural 3D building hero,
 * unified floating controls capsule, and crisp high-contrast room inspector.
 */
export const HostelExperience = ({ className = 'w-full' }) => {
  const {
    hostels,
    selectedHostelId,
    setSelectedHostelId,
    selectedFloorNumber,
    setSelectedFloorNumber,
    selectedRoomId,
    setSelectedRoomId,
    cameraMode,
    setCameraMode,
    activeInteriorTab,
    setActiveInteriorTab,
    searchQuery,
    setSearchQuery,
    resetView,
    getCurrentHostel,
    getCurrentRoom,
    getAllRoomsForCurrentHostel,
    isExplodedView,
    toggleExplodedView,
    lightingMode,
    toggleLightingMode,
    qualityMode,
    setQualityMode,
    favoriteRoomIds,
    toggleFavoriteRoom,
    comparedRoomIds,
    toggleCompareRoom,
    setActiveInteractiveModal
  } = useHostelStore();

  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [emergenceKey, setEmergenceKey] = useState(1);
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);

  const currentHostel = getCurrentHostel();
  const currentRoom = getCurrentRoom();
  const allRooms = getAllRoomsForCurrentHostel();

  const isRoomFavorite = currentRoom && favoriteRoomIds.includes(currentRoom.id);
  const isRoomCompared = currentRoom && comparedRoomIds.includes(currentRoom.id);

  // Compute building dimensions for camera calculation
  const buildingDims = useMemo(() => {
    return calculateBuildingDimensions(currentHostel);
  }, [currentHostel]);

  const effectiveCameraMode = selectedRoomId
    ? 'room'
    : cameraMode === 'courtyard'
    ? 'courtyard'
    : selectedFloorNumber !== null
    ? 'floor'
    : 'overview';

  // Filter rooms based on selected floor and search query
  const filteredRooms = allRooms.filter((r) => {
    const matchesFloor =
      selectedFloorNumber === null || r.floorNumber === selectedFloorNumber;
    const matchesSearch =
      searchQuery.trim() === '' ||
      r.roomNumber?.toLowerCase().includes(searchQuery.toLowerCase().trim()) ||
      r.status?.toLowerCase().includes(searchQuery.toLowerCase().trim()) ||
      r.occupants?.some((occ) => occ.name?.toLowerCase().includes(searchQuery.toLowerCase().trim()));
    return matchesFloor && matchesSearch;
  });

  const handleReplayStory = () => {
    setEmergenceKey((prev) => prev + 1);
  };

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
    <div
      className={`w-full glass-floating rounded-3xl p-4 sm:p-6 border border-white/70 dark:border-primary-fixed/20 shadow-xl flex flex-col gap-4 overflow-hidden transition-all duration-300 relative ${
        isFullscreen ? 'fixed inset-4 z-50 overflow-y-auto' : className
      }`}
    >
      {/* 1. TOP BAR: Dynamic Hostel Selector & Unified Floating Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-surface-border/50 pb-3 z-10">
        {/* Dynamic Hostel Selector */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          <span className="text-xs font-bold text-[#35544e] dark:text-[#a6cdc7] shrink-0">
            Hostel:
          </span>
          <div className="flex items-center gap-1 p-1 glass-panel rounded-2xl border border-white/60 dark:border-primary-fixed/15 shadow-2xs">
            {hostels.map((h) => {
              const isSelected = selectedHostelId === h.id;
              return (
                <button
                  key={h.id}
                  type="button"
                  onClick={() => setSelectedHostelId(h.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    isSelected
                      ? 'bg-primary text-white shadow-xs shadow-primary/30'
                      : 'text-[#2b4742] dark:text-[#c4dfda] hover:text-primary dark:hover:text-[#89f5e7] hover:bg-white/40 dark:hover:bg-white/5'
                  }`}
                >
                  {h.name}
                </button>
              );
            })}
          </div>
        </div>

        {/* Unified Floating Controls Group */}
        <div className="flex items-center gap-1.5 p-1 glass-panel rounded-2xl border border-white/60 dark:border-primary-fixed/15 shadow-2xs shrink-0 flex-wrap">
          {/* Courtyard Focus Toggle */}
          {currentHostel.layoutConfig?.centralSpace?.enabled !== false && (
            <GlassButton
              variant="capsule"
              size="sm"
              active={cameraMode === 'courtyard' && !selectedRoomId}
              onClick={() => {
                setSelectedRoomId(null);
                setCameraMode(cameraMode === 'courtyard' ? 'overview' : 'courtyard');
              }}
              icon="park"
            >
              Courtyard
            </GlassButton>
          )}

          {/* Exploded View Toggle */}
          <GlassButton
            variant="capsule"
            size="sm"
            active={isExplodedView}
            onClick={toggleExplodedView}
            icon={isExplodedView ? 'unfold_less' : 'unfold_more'}
          >
            {isExplodedView ? 'Normal View' : 'Exploded View'}
          </GlassButton>

          {/* Day / Night Lighting Mode Toggle */}
          <GlassButton
            variant="capsule"
            size="sm"
            onClick={toggleLightingMode}
            icon={lightingMode === 'night' ? 'dark_mode' : 'light_mode'}
          >
            <span className="capitalize">{lightingMode}</span>
          </GlassButton>

          {/* Reset View */}
          <GlassButton
            variant="capsule"
            size="sm"
            onClick={resetView}
            icon="center_focus_strong"
          >
            <span className="hidden sm:inline">Reset</span>
          </GlassButton>

          {/* Replay Emergence */}
          <GlassButton
            variant="capsule"
            size="sm"
            onClick={handleReplayStory}
            icon="replay"
          >
            <span className="hidden sm:inline">Replay</span>
          </GlassButton>

          {selectedRoomId && (
            <GlassButton
              variant="primary"
              size="sm"
              onClick={() => setSelectedRoomId(null)}
              icon="close"
            >
              Exit Room
            </GlassButton>
          )}
        </div>
      </div>

      {/* 2. MAIN INTERACTIVE AREA: 3D Spatial Stage (Left) + Interactive Room Interior (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch min-h-[380px] lg:min-h-[480px]">
        {/* LEFT PANE: 3D Spatial Hostel Stage (The Star) */}
        <div
          className={`relative rounded-3xl border border-white/60 dark:border-primary-fixed/15 ${
            lightingMode === 'night'
              ? 'bg-gradient-to-b from-[#08151c] via-[#0b1d22] to-[#071317]'
              : 'bg-gradient-to-b from-[#eaf4f2] via-[#f3f8f7] to-[#e4efed]'
          } overflow-hidden shadow-inner flex flex-col justify-between transition-all duration-300 ${
            selectedRoomId ? 'lg:col-span-6 h-[380px] lg:h-[480px]' : 'lg:col-span-12 h-[420px] lg:h-[500px]'
          }`}
        >
          {/* Soft atmospheric ambient glow */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(0,104,95,0.06),transparent_65%)] pointer-events-none" />

          {/* 3D Canvas */}
          <CanvasWrapper
            key={`hostel-canvas-${selectedHostelId}-${emergenceKey}-${lightingMode}`}
            className="w-full h-full"
            camera={{ position: [0, 3.2, 7.4], fov: 42 }}
            disableOnMobile={false}
            fallback={
              <div className="w-full h-full flex flex-col items-center justify-center text-primary/40 p-4">
                <span className="material-symbols-outlined text-6xl mb-2">apartment</span>
                <p className="font-bold text-xs text-[#2b4742] dark:text-[#c4dfda]">3D Digital Twin Preview</p>
              </div>
            }
          >
            <ambientLight intensity={lightingMode === 'night' ? 0.55 : 1.1} />
            <directionalLight position={[7, 10, 6]} intensity={lightingMode === 'night' ? 0.85 : 1.5} color={lightingMode === 'night' ? '#c8ece6' : '#ffffff'} />
            <directionalLight position={[-6, 4, -5]} intensity={lightingMode === 'night' ? 0.75 : 0.6} color="#89f5e7" />
            <pointLight position={[0, 2, 2]} intensity={0.4} color="#ffdbce" />

            <HostelCamera
              cameraMode={effectiveCameraMode}
              selectedFloorNumber={selectedFloorNumber}
              selectedRoom={currentRoom}
              isExplodedView={isExplodedView}
              floorHeight={1.05}
              buildingDims={buildingDims}
            />

            <Building3D
              hostelData={currentHostel}
              selectedFloorNumber={selectedFloorNumber}
              selectedRoomId={selectedRoomId}
              onSelectRoom={(room) => {
                setSelectedRoomId(room.id);
                setIsMobileDrawerOpen(true);
              }}
              isExplodedView={isExplodedView}
              lightingMode={lightingMode}
              qualityMode={qualityMode}
            />
          </CanvasWrapper>

          {/* Single Compact Glass Legend Capsule at Bottom */}
          <div className="absolute bottom-3 inset-x-3 pointer-events-none flex justify-center z-10">
            <div className="glass-panel px-4 py-1.5 rounded-full border border-white/70 dark:border-primary-fixed/20 shadow-md flex items-center gap-4 text-xs font-bold text-[#14332e] dark:text-[#e4f5f1] pointer-events-auto backdrop-blur-md">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-sm"></span>
                <span>Available</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-slate-400 shadow-sm"></span>
                <span>Occupied</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400 shadow-sm"></span>
                <span>Maintenance</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-400 shadow-sm"></span>
                <span>Reserved</span>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT PANE: Interactive Room Interior & Resource Hub (Lighter than background) */}
        <AnimatePresence>
          {selectedRoomId && currentRoom && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
              className="lg:col-span-6 rounded-3xl border border-white/80 dark:border-primary-fixed/25 bg-white/85 dark:bg-[#12332e]/90 backdrop-blur-2xl p-4 sm:p-5 flex flex-col justify-between shadow-2xl relative overflow-hidden h-[380px] lg:h-[480px]"
            >
              {/* Room Header Card */}
              <div className="flex items-start justify-between gap-3 border-b border-surface-border/50 pb-3 z-10">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-headline-md text-xl font-extrabold text-[#0e2724] dark:text-[#f0faf8]">
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

                    {/* Favorite Room Button */}
                    <button
                      type="button"
                      onClick={() => toggleFavoriteRoom(currentRoom.id)}
                      className={`p-1.5 rounded-xl hover:bg-surface-container/60 transition-colors ${
                        isRoomFavorite ? 'text-red-500' : 'text-[#425d57] dark:text-[#a0c2bd]'
                      }`}
                      title={isRoomFavorite ? 'Remove Favorite' : 'Save as Favorite Room'}
                    >
                      <span className="material-symbols-outlined text-[18px]">
                        {isRoomFavorite ? 'favorite' : 'favorite_border'}
                      </span>
                    </button>

                    {/* Compare Button */}
                    <button
                      type="button"
                      onClick={() => toggleCompareRoom(currentRoom.id)}
                      className={`p-1.5 rounded-xl hover:bg-surface-container/60 transition-colors ${
                        isRoomCompared ? 'text-primary' : 'text-[#425d57] dark:text-[#a0c2bd]'
                      }`}
                      title="Add to Room Comparison"
                    >
                      <span className="material-symbols-outlined text-[18px]">compare_arrows</span>
                    </button>

                    {/* Share & QR Code Button */}
                    <button
                      type="button"
                      onClick={() => setActiveInteractiveModal('share-qr')}
                      className="p-1.5 rounded-xl hover:bg-surface-container/60 text-[#425d57] dark:text-[#a0c2bd] hover:text-primary transition-colors"
                      title="Share Room & Printable QR"
                    >
                      <span className="material-symbols-outlined text-[18px]">qr_code</span>
                    </button>
                  </div>
                  <p className="text-xs text-[#33534d] dark:text-[#b0d2cc] mt-0.5 font-medium">
                    {currentHostel.name} • Floor {currentRoom.floorNumber}
                  </p>
                  <p className="text-[11px] text-primary font-bold mt-0.5">
                    Type: {currentRoom.roomType || 'Single Occupancy'} • Capacity: {currentRoom.capacity || 1}
                  </p>
                </div>

                {/* Primary Solid Teal CTA */}
                <GlassButton
                  variant="primary"
                  size="sm"
                  onClick={() => setIsDetailModalOpen(true)}
                  icon="arrow_forward"
                >
                  Explore Room
                </GlassButton>
              </div>

              {/* 3D Room Interior Interactive Canvas (Bright & Clear) */}
              <div className="flex-1 w-full relative rounded-2xl overflow-hidden my-2 bg-gradient-to-b from-[#eaf4f2] to-[#d8e8e5] dark:from-[#0a1f1c] dark:to-[#071714] border border-surface-border/40">
                <RoomInterior3D
                  activeTab={activeInteriorTab}
                  lightingMode={lightingMode}
                  className="w-full h-full"
                />

                {/* Right Vertical Interactive Action Tooltips */}
                <div className="absolute right-3 top-3 flex flex-col gap-1.5 z-10">
                  <button
                    type="button"
                    onClick={() => setActiveInteractiveModal('laptop-workspace')}
                    className="w-8 h-8 rounded-xl glass-panel-strong shadow-xs flex items-center justify-center text-[#2b4742] dark:text-[#c4dfda] hover:text-primary hover:scale-105 transition-all"
                    title="Open Student Laptop Workspace (Notes, PYQs, Videos)"
                  >
                    <span className="material-symbols-outlined text-[18px]">laptop</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveInteractiveModal('bookshelf-resources')}
                    className="w-8 h-8 rounded-xl glass-panel-strong shadow-xs flex items-center justify-center text-[#2b4742] dark:text-[#c4dfda] hover:text-primary hover:scale-105 transition-all"
                    title="Open Academic Bookshelf (DSA, COA, DBMS, Maths)"
                  >
                    <span className="material-symbols-outlined text-[18px]">menu_book</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsDetailModalOpen(true)}
                    className="w-8 h-8 rounded-xl glass-panel-strong shadow-xs flex items-center justify-center text-[#2b4742] dark:text-[#c4dfda] hover:text-primary hover:scale-105 transition-all"
                    title="Room Info & Facilities"
                  >
                    <span className="material-symbols-outlined text-[18px]">info</span>
                  </button>
                </div>
              </div>

              {/* Interior Area Switcher Tabs */}
              <div className="flex items-center justify-between gap-2 z-10">
                <div className="flex items-center gap-1.5 p-1 glass-panel rounded-xl border border-white/50 dark:border-primary-fixed/15 overflow-x-auto scrollbar-none">
                  {[
                    { id: 'room-view', label: 'Room View' },
                    { id: 'interior', label: 'Interior' },
                    { id: 'study-area', label: 'Study Area' },
                    { id: 'bed-area', label: 'Bed Area' }
                  ].map((tab) => {
                    const isActive = activeInteriorTab === tab.id;
                    return (
                      <button
                        key={tab.id}
                        type="button"
                        onClick={() => setActiveInteriorTab(tab.id)}
                        className={`px-3 py-1 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
                          isActive
                            ? 'bg-primary text-white shadow-xs font-bold'
                            : 'text-[#35544e] dark:text-[#a6cdc7] hover:text-primary'
                        }`}
                      >
                        {tab.label}
                      </button>
                    );
                  })}
                </div>

                {/* Compare Trigger Button if rooms selected */}
                {comparedRoomIds.length > 0 && (
                  <button
                    type="button"
                    onClick={() => setActiveInteractiveModal('compare')}
                    className="px-2.5 py-1 rounded-xl bg-primary/15 text-primary border border-primary/30 text-xs font-bold flex items-center gap-1 shrink-0"
                  >
                    <span>Compare ({comparedRoomIds.length})</span>
                  </button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* 3. BOTTOM QUICK ROOM SELECTOR STRIP */}
      <div className="flex flex-col gap-2 pt-2 border-t border-surface-border/50">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          {/* Room Search Bar with Live Highlight */}
          <div className="max-w-xs w-full">
            <GlassInput
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search room (e.g. 101)..."
              icon="search"
              className="w-full"
            />
          </div>

          {/* Floor Selector Dropdown & Controls */}
          <div className="flex items-center gap-2 self-end sm:self-auto flex-wrap">
            <div className="flex items-center gap-1.5">
              <span className="px-2.5 py-1 rounded-xl glass-panel text-xs font-bold text-[#14332e] dark:text-[#e4f5f1] border border-white/60 dark:border-primary-fixed/20">
                3D
              </span>
              <select
                value={selectedFloorNumber === null ? '' : selectedFloorNumber}
                onChange={(e) =>
                  setSelectedFloorNumber(
                    e.target.value === '' ? null : parseInt(e.target.value, 10)
                  )
                }
                className="px-3 py-1.5 glass-panel border border-white/60 dark:border-primary-fixed/20 rounded-xl text-xs font-bold text-[#0e2724] dark:text-[#f0faf8] focus:outline-none focus:border-primary cursor-pointer shadow-2xs"
              >
                <option value="">All Floors ({currentHostel.floors.length})</option>
                {currentHostel.floors.map((fl) => (
                  <option key={fl.id} value={fl.floorNumber}>
                    {fl.name || `Floor ${fl.floorNumber}`} ({fl.rooms?.length || 0} rooms)
                  </option>
                ))}
              </select>
            </div>

            {/* 3D Quality Selector */}
            <select
              value={qualityMode}
              onChange={(e) => setQualityMode(e.target.value)}
              className="px-2.5 py-1.5 glass-panel border border-white/60 dark:border-primary-fixed/20 rounded-xl text-xs font-bold text-[#0e2724] dark:text-[#f0faf8] focus:outline-none cursor-pointer shadow-2xs"
              title="3D Rendering Quality"
            >
              <option value="high">High Quality</option>
              <option value="balanced">Balanced</option>
              <option value="performance">Performance</option>
            </select>

            <button
              type="button"
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="p-1.5 rounded-xl glass-panel hover:border-primary/40 text-[#2b4742] dark:text-[#c4dfda] text-xs font-bold flex items-center justify-center transition-colors shadow-2xs"
              title={isFullscreen ? 'Exit Fullscreen' : 'Expand View'}
            >
              <span className="material-symbols-outlined text-[18px]">
                {isFullscreen ? 'close_fullscreen' : 'open_in_full'}
              </span>
            </button>
          </div>
        </div>

        {/* Scrollable Room Card Carousel with Light/Crisp Glass Cards */}
        <div className="flex items-center gap-2.5 overflow-x-auto pb-2 scrollbar-none pt-1">
          {filteredRooms.map((room) => {
            const isSelected = selectedRoomId === room.id;
            const isFav = favoriteRoomIds.includes(room.id);
            return (
              <button
                key={room.id}
                type="button"
                onClick={() => {
                  setSelectedRoomId(room.id);
                  setIsMobileDrawerOpen(true);
                }}
                className={`flex items-center gap-2.5 p-2.5 rounded-2xl border transition-all text-left shrink-0 min-w-[135px] relative group cursor-pointer ${
                  isSelected
                    ? 'bg-primary text-white border-primary-fixed shadow-md ring-2 ring-primary/40'
                    : 'bg-white/70 dark:bg-[#12332e]/75 glass-panel hover:border-primary/40 hover:-translate-y-0.5'
                }`}
              >
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border ${
                    isSelected
                      ? 'bg-white/20 text-white border-white/40'
                      : 'bg-primary/10 text-primary border-primary/20'
                  }`}
                >
                  <span className="material-symbols-outlined text-[18px]">
                    {room.status === 'occupied' ? 'meeting_room' : 'door_front'}
                  </span>
                </div>
                <div>
                  <div className="flex items-center gap-1">
                    <h4 className={`font-extrabold text-xs ${isSelected ? 'text-white' : 'text-[#0e2724] dark:text-[#f0faf8]'}`}>
                      {room.roomNumber}
                    </h4>
                    {isFav && (
                      <span className="material-symbols-outlined text-red-500 text-[12px]">favorite</span>
                    )}
                  </div>
                  <div className="flex items-center gap-1 mt-0.5">
                    <span className={`w-1.5 h-1.5 rounded-full ${getStatusDotBg(room.status)}`}></span>
                    <span
                      className={`text-[10px] capitalize font-medium ${
                        isSelected ? 'text-white/80' : 'text-[#42605b] dark:text-[#a0c5bf]'
                      }`}
                    >
                      {room.status}
                    </span>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Bottom Spatial Helper Tip */}
        <div className="flex items-center justify-center gap-1.5 text-xs text-[#45635e] dark:text-[#a2c5bf] pt-1 font-medium">
          <span className="material-symbols-outlined text-primary text-[15px]">tips_and_updates</span>
          <span>Click any room door in 3D to explore interior • Click laptop or bookshelf for academic resources</span>
        </div>
      </div>

      {/* 4. ROOM DETAIL MODAL */}
      <RoomDetailModal
        isOpen={isDetailModalOpen}
        room={currentRoom}
        onClose={() => setIsDetailModalOpen(false)}
      />

      {/* 5. MOBILE BOTTOM SHEET FOR ROOM INSPECTION */}
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
            <div className="pt-2">
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

      {/* 6. INTERACTIVE ROOM MODALS */}
      <InteractiveRoomModals />
    </div>
  );
};
