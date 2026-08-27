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
import { GlassButton, GlassBadge, GlassBottomSheet, GlassInput, GlassCard } from '../ui';

/**
 * Main Interactive 3D Digital Twin Hostel Explorer
 * Deep spatial frosted glass stage, multi-wing layouts, dynamic courtyard,
 * floating glass controls, and seamless academic student hub.
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
        return 'text-emerald-500 bg-emerald-500/10 border-emerald-500/30';
      case 'maintenance':
        return 'text-amber-500 bg-amber-500/10 border-amber-500/30';
      case 'reserved':
        return 'text-blue-500 bg-blue-500/10 border-blue-500/30';
      case 'occupied':
      default:
        return 'text-slate-400 bg-slate-500/10 border-slate-500/30';
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
      className={`w-full glass-floating rounded-3xl p-4 sm:p-6 border border-white/70 dark:border-primary-fixed/20 shadow-2xl flex flex-col gap-4 overflow-hidden transition-all duration-300 relative ${
        isFullscreen ? 'fixed inset-4 z-50 overflow-y-auto' : className
      }`}
    >
      {/* Top Specular Highlight */}
      <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/80 dark:via-primary-fixed/30 to-transparent pointer-events-none" />

      {/* 1. TOP BAR: Dynamic Hostel Selector & Floating Glass Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-surface-border/50 pb-3 z-10">
        {/* Dynamic Hostel Selector */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          <span className="text-xs font-bold text-on-surface-variant shrink-0">
            Hostel:
          </span>
          <div className="flex items-center gap-1 p-1 glass-panel rounded-xl border border-white/60 dark:border-primary-fixed/15 shadow-xs">
            {hostels.map((h) => {
              const isSelected = selectedHostelId === h.id;
              return (
                <button
                  key={h.id}
                  type="button"
                  onClick={() => setSelectedHostelId(h.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    isSelected
                      ? 'bg-primary text-on-primary shadow-xs shadow-primary/30'
                      : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container/60'
                  }`}
                >
                  {h.name}
                </button>
              );
            })}
          </div>
        </div>

        {/* Feature Controls (Courtyard, Exploded, Day/Night, Reset, Replay) */}
        <div className="flex items-center gap-2 shrink-0 flex-wrap">
          {/* Courtyard Focus Toggle */}
          {currentHostel.layoutConfig?.centralSpace?.enabled !== false && (
            <GlassButton
              variant="capsule"
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
            active={isExplodedView}
            onClick={toggleExplodedView}
            icon={isExplodedView ? 'unfold_less' : 'unfold_more'}
          >
            {isExplodedView ? 'Normal View' : 'Exploded View'}
          </GlassButton>

          {/* Day / Night Lighting Mode Toggle */}
          <GlassButton
            variant="capsule"
            onClick={toggleLightingMode}
            icon={lightingMode === 'night' ? 'dark_mode' : 'light_mode'}
          >
            <span className="capitalize">{lightingMode}</span>
          </GlassButton>

          {/* Reset View */}
          <GlassButton
            variant="capsule"
            onClick={resetView}
            icon="center_focus_strong"
          >
            <span className="hidden sm:inline">Reset</span>
          </GlassButton>

          {/* Replay Emergence */}
          <GlassButton
            variant="capsule"
            onClick={handleReplayStory}
            icon="replay"
          >
            <span className="hidden sm:inline">Replay</span>
          </GlassButton>

          {selectedRoomId && (
            <GlassButton
              variant="primary"
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
        {/* LEFT PANE: 3D Spatial Hostel Stage */}
        <div
          className={`relative rounded-3xl border border-white/60 dark:border-primary-fixed/15 ${
            lightingMode === 'night'
              ? 'bg-gradient-to-b from-slate-950 via-slate-900 to-teal-950/40'
              : 'bg-gradient-to-b from-surface-container-low/50 via-surface/40 to-surface-container-highest/20'
          } overflow-hidden shadow-inner flex flex-col justify-between transition-all duration-300 ${
            selectedRoomId ? 'lg:col-span-6 h-[380px] lg:h-[480px]' : 'lg:col-span-12 h-[420px] lg:h-[500px]'
          }`}
        >
          {/* Subtle Radial Atmospheric Glow behind the building */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(0,104,95,0.14),transparent_65%)] pointer-events-none" />

          {/* 3D Canvas */}
          <CanvasWrapper
            key={`hostel-canvas-${selectedHostelId}-${emergenceKey}-${lightingMode}`}
            className="w-full h-full"
            camera={{ position: [0, 3.2, 7.4], fov: 42 }}
            disableOnMobile={false}
            fallback={
              <div className="w-full h-full flex flex-col items-center justify-center text-primary/40 p-4">
                <span className="material-symbols-outlined text-6xl mb-2">apartment</span>
                <p className="font-semibold text-xs text-on-surface-variant">3D Digital Twin Preview</p>
              </div>
            }
          >
            <ambientLight intensity={lightingMode === 'night' ? 0.45 : 0.95} />
            <directionalLight position={[6, 8, 6]} intensity={lightingMode === 'night' ? 0.65 : 1.4} />
            <directionalLight position={[-5, 3, -4]} intensity={0.5} color="#89f5e7" />
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

          {/* Floating Glass Status Legend at Bottom */}
          <div className="absolute bottom-3 inset-x-3 pointer-events-none flex justify-center z-10">
            <div className="glass-panel px-4 py-1.5 rounded-full border border-white/70 dark:border-primary-fixed/20 shadow-md flex items-center gap-4 text-xs font-semibold text-on-surface pointer-events-auto backdrop-blur-md">
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

        {/* RIGHT PANE: Interactive Room Interior & Resource Hub */}
        <AnimatePresence>
          {selectedRoomId && currentRoom && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
              className="lg:col-span-6 rounded-3xl border border-white/70 dark:border-primary-fixed/20 glass-panel-strong p-4 sm:p-5 flex flex-col justify-between shadow-xl relative overflow-hidden h-[380px] lg:h-[480px]"
            >
              {/* Room Header Card */}
              <div className="flex items-start justify-between gap-3 border-b border-surface-border/50 pb-3 z-10">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-headline-md text-xl font-bold text-on-surface">
                      Room {currentRoom.roomNumber}
                    </h3>
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider border flex items-center gap-1 ${getStatusColor(
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
                        isRoomFavorite ? 'text-red-500' : 'text-on-surface-variant'
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
                        isRoomCompared ? 'text-primary' : 'text-on-surface-variant'
                      }`}
                      title="Add to Room Comparison"
                    >
                      <span className="material-symbols-outlined text-[18px]">compare_arrows</span>
                    </button>

                    {/* Share & QR Code Button */}
                    <button
                      type="button"
                      onClick={() => setActiveInteractiveModal('share-qr')}
                      className="p-1.5 rounded-xl hover:bg-surface-container/60 text-on-surface-variant hover:text-primary transition-colors"
                      title="Share Room & Printable QR"
                    >
                      <span className="material-symbols-outlined text-[18px]">qr_code</span>
                    </button>
                  </div>
                  <p className="text-xs text-on-surface-variant mt-0.5 font-medium">
                    {currentHostel.name} • Floor {currentRoom.floorNumber}
                  </p>
                  <p className="text-[11px] text-primary font-semibold mt-0.5">
                    Type: {currentRoom.roomType || 'Single Occupancy'} • Capacity: {currentRoom.capacity || 1}
                  </p>
                </div>

                <GlassButton
                  variant="primary"
                  size="sm"
                  onClick={() => setIsDetailModalOpen(true)}
                  icon="arrow_forward"
                >
                  Details
                </GlassButton>
              </div>

              {/* 3D Room Interior Interactive Canvas */}
              <div className="flex-1 w-full relative rounded-2xl overflow-hidden my-2 bg-gradient-to-b from-surface-container-low/50 to-surface-container-high/30 border border-surface-border/40">
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
                    className="w-8 h-8 rounded-xl glass-panel-strong shadow-xs flex items-center justify-center text-on-surface-variant hover:text-primary hover:scale-105 transition-all"
                    title="Open Student Laptop Workspace (Notes, PYQs, Videos)"
                  >
                    <span className="material-symbols-outlined text-[18px]">laptop</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveInteractiveModal('bookshelf-resources')}
                    className="w-8 h-8 rounded-xl glass-panel-strong shadow-xs flex items-center justify-center text-on-surface-variant hover:text-primary hover:scale-105 transition-all"
                    title="Open Academic Bookshelf (DSA, COA, DBMS, Maths)"
                  >
                    <span className="material-symbols-outlined text-[18px]">menu_book</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsDetailModalOpen(true)}
                    className="w-8 h-8 rounded-xl glass-panel-strong shadow-xs flex items-center justify-center text-on-surface-variant hover:text-primary hover:scale-105 transition-all"
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
                        className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${
                          isActive
                            ? 'bg-primary text-on-primary shadow-xs font-bold'
                            : 'text-on-surface-variant hover:text-on-surface'
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
                    className="px-2.5 py-1 rounded-xl bg-primary/10 text-primary border border-primary/20 text-xs font-bold flex items-center gap-1 shrink-0"
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
              placeholder="Search room (e.g. 303)..."
              icon="search"
              className="w-full"
            />
          </div>

          {/* Floor Selector Dropdown & Controls */}
          <div className="flex items-center gap-2 self-end sm:self-auto flex-wrap">
            <div className="flex items-center gap-1.5">
              <span className="px-2.5 py-1 rounded-xl glass-panel text-xs font-bold text-on-surface border border-white/60 dark:border-primary-fixed/20">
                3D
              </span>
              <select
                value={selectedFloorNumber === null ? '' : selectedFloorNumber}
                onChange={(e) =>
                  setSelectedFloorNumber(
                    e.target.value === '' ? null : parseInt(e.target.value, 10)
                  )
                }
                className="px-3 py-1.5 glass-panel border border-white/60 dark:border-primary-fixed/20 rounded-xl text-xs font-bold text-on-surface focus:outline-none focus:border-primary cursor-pointer shadow-2xs"
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
              className="px-2.5 py-1.5 glass-panel border border-white/60 dark:border-primary-fixed/20 rounded-xl text-xs font-semibold text-on-surface focus:outline-none cursor-pointer shadow-2xs"
              title="3D Rendering Quality"
            >
              <option value="high">High Quality</option>
              <option value="balanced">Balanced</option>
              <option value="performance">Performance</option>
            </select>

            <button
              type="button"
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="p-1.5 rounded-xl glass-panel hover:border-primary/40 text-on-surface text-xs font-bold flex items-center justify-center transition-colors shadow-2xs"
              title={isFullscreen ? 'Exit Fullscreen' : 'Expand View'}
            >
              <span className="material-symbols-outlined text-[18px]">
                {isFullscreen ? 'close_fullscreen' : 'open_in_full'}
              </span>
            </button>
          </div>
        </div>

        {/* Scrollable Room Card Carousel with Glass Cards */}
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
                    ? 'bg-primary text-on-primary border-primary-fixed shadow-md ring-2 ring-primary/40'
                    : 'glass-panel hover:border-primary/40 hover:-translate-y-0.5'
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
                    <h4 className={`font-bold text-xs ${isSelected ? 'text-white' : 'text-on-surface'}`}>
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
                        isSelected ? 'text-white/80' : 'text-on-surface-variant'
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
        <div className="flex items-center justify-center gap-1.5 text-xs text-on-surface-variant pt-1 font-medium">
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
              <span className="text-on-surface-variant">Status</span>
              <span className={`px-2.5 py-0.5 rounded-full font-bold uppercase text-[10px] ${getStatusColor(currentRoom.status)}`}>
                {currentRoom.status}
              </span>
            </div>
            <div className="flex items-center justify-between pb-2 border-b border-surface-border">
              <span className="text-on-surface-variant">Floor</span>
              <span className="font-bold text-on-surface">Floor {currentRoom.floorNumber}</span>
            </div>
            <div className="flex items-center justify-between pb-2 border-b border-surface-border">
              <span className="text-on-surface-variant">Room Type</span>
              <span className="font-bold text-on-surface">{currentRoom.roomType || 'Single'}</span>
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

      {/* 6. INTERACTIVE ROOM MODALS (Laptop Workspace, Bookshelf, Stats, Compare, QR) */}
      <InteractiveRoomModals />
    </div>
  );
};
