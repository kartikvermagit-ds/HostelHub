import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CanvasWrapper } from './CanvasWrapper';
import { Building3D } from './Building3D';
import { RoomInterior3D } from './RoomInterior3D';
import { OrbitControls } from '@react-three/drei';
import { useHostelStore } from '../../stores/hostelStore';
import { RoomDetailModal } from './RoomDetailModal';
import { InteractiveRoomModals } from './InteractiveRoomModals';

/**
 * Main Interactive 3D Hostel Explorer Container
 * Supports Exploded View, Day/Night Lighting, Interactive Workspace/Bookshelf, Room Comparison, and Sharing!
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

  const currentHostel = getCurrentHostel();
  const currentRoom = getCurrentRoom();
  const allRooms = getAllRoomsForCurrentHostel();

  const isRoomFavorite = currentRoom && favoriteRoomIds.includes(currentRoom.id);
  const isRoomCompared = currentRoom && comparedRoomIds.includes(currentRoom.id);

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
        return 'bg-emerald-400';
      case 'maintenance':
        return 'bg-amber-400';
      case 'reserved':
        return 'bg-blue-400';
      case 'occupied':
      default:
        return 'bg-slate-400';
    }
  };

  return (
    <div
      className={`w-full bg-surface-container-lowest border border-surface-border rounded-3xl p-4 sm:p-6 shadow-card flex flex-col gap-4 overflow-hidden transition-all duration-300 ${
        isFullscreen ? 'fixed inset-4 z-50 overflow-y-auto' : className
      }`}
    >
      {/* 1. TOP BAR: Hostel Selector Pills, Exploded View, Day/Night, Reset, Exit Room */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-surface-border pb-3">
        {/* Dynamic Hostel Selector */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          <span className="text-xs font-bold text-on-surface-variant shrink-0">
            Hostel:
          </span>
          <div className="flex items-center gap-1.5 p-1 bg-surface-container-low rounded-xl border border-surface-border">
            {hostels.map((h) => {
              const isSelected = selectedHostelId === h.id;
              return (
                <button
                  key={h.id}
                  type="button"
                  onClick={() => setSelectedHostelId(h.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    isSelected
                      ? 'bg-primary text-on-primary shadow-sm'
                      : 'text-on-surface hover:bg-surface-container'
                  }`}
                >
                  {h.name}
                </button>
              );
            })}
          </div>
        </div>

        {/* Feature Controls (Exploded View, Day/Night, Quality, Reset) */}
        <div className="flex items-center gap-2 shrink-0 flex-wrap">
          {/* Exploded View Toggle */}
          <button
            type="button"
            onClick={toggleExplodedView}
            className={`px-3 py-1.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-all active:scale-95 ${
              isExplodedView
                ? 'bg-primary text-on-primary border-primary shadow-sm'
                : 'border-surface-border bg-surface hover:bg-surface-container-low text-on-surface'
            }`}
            title="Toggle Exploded Vertical Floor View"
          >
            <span className="material-symbols-outlined text-[16px]">
              {isExplodedView ? 'unfold_less' : 'unfold_more'}
            </span>
            <span>{isExplodedView ? 'Normal View' : 'Exploded View'}</span>
          </button>

          {/* Day / Night Lighting Mode Toggle */}
          <button
            type="button"
            onClick={toggleLightingMode}
            className={`px-3 py-1.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-all active:scale-95 ${
              lightingMode === 'night'
                ? 'bg-slate-900 text-amber-300 border-slate-700 shadow-sm'
                : 'border-surface-border bg-surface hover:bg-surface-container-low text-on-surface'
            }`}
            title="Toggle Day / Night Lighting"
          >
            <span className="material-symbols-outlined text-[16px]">
              {lightingMode === 'night' ? 'dark_mode' : 'light_mode'}
            </span>
            <span className="capitalize">{lightingMode}</span>
          </button>

          {/* Reset View */}
          <button
            type="button"
            onClick={resetView}
            className="px-3 py-1.5 rounded-xl border border-surface-border bg-surface hover:bg-surface-container-low text-on-surface text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-all active:scale-95"
            title="Reset Camera to Overview"
          >
            <span className="material-symbols-outlined text-[16px]">center_focus_strong</span>
            <span className="hidden sm:inline">Reset View</span>
          </button>

          {/* Replay Story */}
          <button
            type="button"
            onClick={handleReplayStory}
            className="px-3 py-1.5 rounded-xl border border-surface-border bg-surface hover:bg-surface-container-low text-on-surface text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-all active:scale-95"
            title="Replay Emergence Sequence"
          >
            <span className="material-symbols-outlined text-[16px]">replay</span>
            <span className="hidden sm:inline">Replay</span>
          </button>

          {selectedRoomId && (
            <button
              type="button"
              onClick={() => setSelectedRoomId(null)}
              className="px-3 py-1.5 rounded-xl bg-primary text-on-primary text-xs font-bold flex items-center gap-1.5 shadow-xs transition-all active:scale-95"
              title="Exit Room View"
            >
              <span className="material-symbols-outlined text-[16px]">close</span>
              <span>Exit Room</span>
            </button>
          )}
        </div>
      </div>

      {/* 2. MAIN INTERACTIVE AREA: 3D Building (Left) + Interactive Room Interior (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch min-h-[380px] lg:min-h-[460px]">
        {/* LEFT PANE: 3D Hostel Building */}
        <div
          className={`relative rounded-2xl border border-surface-border ${
            lightingMode === 'night'
              ? 'bg-gradient-to-b from-slate-950 via-slate-900 to-teal-950/40'
              : 'bg-gradient-to-b from-surface-container-low/40 to-surface-container-high/20'
          } overflow-hidden shadow-inner flex flex-col justify-between transition-all duration-300 ${
            selectedRoomId ? 'lg:col-span-6 h-[380px] lg:h-[480px]' : 'lg:col-span-12 h-[420px] lg:h-[500px]'
          }`}
        >
          {/* 3D Canvas */}
          <CanvasWrapper
            key={`hostel-canvas-${selectedHostelId}-${emergenceKey}-${lightingMode}`}
            className="w-full h-full"
            camera={{ position: [0, 2.8, 6.2], fov: 42 }}
            disableOnMobile={false}
          >
            <ambientLight intensity={lightingMode === 'night' ? 0.4 : 0.9} />
            <directionalLight position={[6, 8, 6]} intensity={lightingMode === 'night' ? 0.6 : 1.4} />
            <directionalLight position={[-5, 3, -4]} intensity={0.5} color="#89f5e7" />
            <pointLight position={[0, 2, 2]} intensity={0.4} color="#ffdbce" />

            <OrbitControls
              enableDamping
              dampingFactor={0.06}
              minDistance={3.2}
              maxDistance={10.5}
              minPolarAngle={Math.PI / 6}
              maxPolarAngle={Math.PI / 2.05}
            />

            <Building3D
              hostelData={currentHostel}
              selectedFloorNumber={selectedFloorNumber}
              selectedRoomId={selectedRoomId}
              onSelectRoom={(room) => setSelectedRoomId(room.id)}
              isExplodedView={isExplodedView}
              lightingMode={lightingMode}
            />
          </CanvasWrapper>

          {/* Status Legend at Bottom */}
          <div className="absolute bottom-3 left-3 right-3 pointer-events-none flex justify-center">
            <div className="bg-surface-container-lowest/90 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-surface-border shadow-sm flex items-center gap-4 text-xs font-semibold text-on-surface pointer-events-auto">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
                <span>Available</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-slate-400"></span>
                <span>Occupied</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400"></span>
                <span>Maintenance</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-400"></span>
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
              className="lg:col-span-6 rounded-2xl border border-surface-border bg-surface-container-lowest p-4 sm:p-5 flex flex-col justify-between shadow-md relative overflow-hidden h-[380px] lg:h-[480px]"
            >
              {/* Room Header Overlay Card */}
              <div className="flex items-start justify-between gap-3 border-b border-surface-border pb-3 z-10">
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
                      className={`p-1 rounded-lg hover:bg-surface-container transition-colors ${
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
                      className={`p-1 rounded-lg hover:bg-surface-container transition-colors ${
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
                      className="p-1 rounded-lg hover:bg-surface-container text-on-surface-variant hover:text-primary transition-colors"
                      title="Share Room & Printable QR"
                    >
                      <span className="material-symbols-outlined text-[18px]">qr_code</span>
                    </button>
                  </div>
                  <p className="text-xs text-on-surface-variant mt-0.5">
                    {currentHostel.name} • Floor {currentRoom.floorNumber}
                  </p>
                  <p className="text-[11px] text-primary font-semibold mt-0.5">
                    Type: {currentRoom.roomType || 'Single Occupancy'} • Capacity: {currentRoom.capacity || 1}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setIsDetailModalOpen(true)}
                  className="px-3 py-1.5 rounded-xl bg-primary text-on-primary text-xs font-bold hover:opacity-90 flex items-center gap-1 shadow-xs transition-opacity shrink-0"
                >
                  <span>View Details</span>
                  <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                </button>
              </div>

              {/* 3D Room Interior Interactive Canvas */}
              <div className="flex-1 w-full relative rounded-xl overflow-hidden my-2 bg-gradient-to-b from-surface-container-low/50 to-surface-container-high/30">
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
                    className="w-8 h-8 rounded-xl bg-surface-container-lowest/90 backdrop-blur-md border border-surface-border shadow-xs flex items-center justify-center text-on-surface-variant hover:text-primary transition-colors"
                    title="Open Student Laptop Workspace"
                  >
                    <span className="material-symbols-outlined text-[18px]">laptop</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveInteractiveModal('bookshelf-resources')}
                    className="w-8 h-8 rounded-xl bg-surface-container-lowest/90 backdrop-blur-md border border-surface-border shadow-xs flex items-center justify-center text-on-surface-variant hover:text-primary transition-colors"
                    title="Open Bookshelf Resources"
                  >
                    <span className="material-symbols-outlined text-[18px]">menu_book</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsDetailModalOpen(true)}
                    className="w-8 h-8 rounded-xl bg-surface-container-lowest/90 backdrop-blur-md border border-surface-border shadow-xs flex items-center justify-center text-on-surface-variant hover:text-primary transition-colors"
                    title="Room Info & Facilities"
                  >
                    <span className="material-symbols-outlined text-[18px]">info</span>
                  </button>
                </div>
              </div>

              {/* Interior Area Switcher Tabs */}
              <div className="flex items-center justify-between gap-2 z-10">
                <div className="flex items-center gap-1.5 p-1 bg-surface-container-low rounded-xl border border-surface-border overflow-x-auto scrollbar-none">
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
                            ? 'bg-surface-container-lowest text-on-surface shadow-xs font-bold'
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
      <div className="flex flex-col gap-2 pt-2 border-t border-surface-border">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          {/* Room Search Bar with Live Highlight */}
          <div className="relative max-w-xs w-full">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-[18px]">
              search
            </span>
            <input
              type="text"
              placeholder="Search room number (e.g. 303)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 bg-surface border border-surface-border rounded-xl text-xs text-on-surface focus:outline-none focus:border-primary transition-all placeholder:text-on-surface-variant/60"
            />
          </div>

          {/* Floor Selector Dropdown & Controls */}
          <div className="flex items-center gap-2 self-end sm:self-auto flex-wrap">
            <div className="flex items-center gap-1.5">
              <span className="px-2.5 py-1 rounded-lg bg-surface-container-low text-xs font-bold text-on-surface border border-surface-border">
                3D
              </span>
              <select
                value={selectedFloorNumber === null ? '' : selectedFloorNumber}
                onChange={(e) =>
                  setSelectedFloorNumber(
                    e.target.value === '' ? null : parseInt(e.target.value, 10)
                  )
                }
                className="px-3 py-1 bg-surface border border-surface-border rounded-xl text-xs font-bold text-on-surface focus:outline-none focus:border-primary cursor-pointer"
              >
                <option value="">All Floors</option>
                {currentHostel.floors.map((fl) => (
                  <option key={fl.id} value={fl.floorNumber}>
                    {fl.name || `Floor ${fl.floorNumber}`}
                  </option>
                ))}
              </select>
            </div>

            {/* 3D Quality Selector */}
            <select
              value={qualityMode}
              onChange={(e) => setQualityMode(e.target.value)}
              className="px-2.5 py-1 bg-surface border border-surface-border rounded-xl text-xs font-semibold text-on-surface focus:outline-none cursor-pointer"
              title="3D Rendering Quality"
            >
              <option value="high">High Quality</option>
              <option value="balanced">Balanced</option>
              <option value="performance">Performance</option>
            </select>

            <button
              type="button"
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="p-1.5 rounded-xl border border-surface-border bg-surface hover:bg-surface-container-low text-on-surface text-xs font-bold flex items-center justify-center transition-colors"
              title={isFullscreen ? 'Exit Fullscreen' : 'Expand View'}
            >
              <span className="material-symbols-outlined text-[18px]">
                {isFullscreen ? 'close_fullscreen' : 'open_in_full'}
              </span>
            </button>
          </div>
        </div>

        {/* Scrollable Room Card Carousel */}
        <div className="flex items-center gap-2.5 overflow-x-auto pb-2 scrollbar-none pt-1">
          {filteredRooms.map((room) => {
            const isSelected = selectedRoomId === room.id;
            const isFav = favoriteRoomIds.includes(room.id);
            return (
              <button
                key={room.id}
                type="button"
                onClick={() => setSelectedRoomId(room.id)}
                className={`flex items-center gap-2.5 p-2.5 rounded-2xl border transition-all text-left shrink-0 min-w-[135px] relative group ${
                  isSelected
                    ? 'bg-primary/10 border-primary ring-2 ring-primary/40 shadow-sm'
                    : 'bg-surface-container-lowest border-surface-border hover:border-primary/40'
                }`}
              >
                {/* Room Thumbnail Avatar / Bed Icon */}
                <div className="w-10 h-10 rounded-xl bg-surface-container flex items-center justify-center text-primary shrink-0 border border-surface-border">
                  <span className="material-symbols-outlined text-[20px]">
                    {room.status === 'occupied' ? 'meeting_room' : 'door_front'}
                  </span>
                </div>
                <div>
                  <div className="flex items-center gap-1">
                    <h4 className="font-bold text-xs text-on-surface">{room.roomNumber}</h4>
                    {isFav && (
                      <span className="material-symbols-outlined text-red-500 text-[12px]">favorite</span>
                    )}
                  </div>
                  <div className="flex items-center gap-1 mt-0.5">
                    <span className={`w-1.5 h-1.5 rounded-full ${getStatusDotBg(room.status)}`}></span>
                    <span className="text-[10px] capitalize text-on-surface-variant font-medium">
                      {room.status}
                    </span>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Bottom Helper Tip */}
        <div className="flex items-center justify-center gap-1.5 text-xs text-on-surface-variant pt-1 font-medium">
          <span className="material-symbols-outlined text-primary text-[15px]">tips_and_updates</span>
          <span>Tip: Click any room door in 3D to inspect interior • Click the laptop or books for study resources</span>
        </div>
      </div>

      {/* 4. ROOM DETAIL MODAL */}
      <RoomDetailModal
        isOpen={isDetailModalOpen}
        room={currentRoom}
        onClose={() => setIsDetailModalOpen(false)}
      />

      {/* 5. INTERACTIVE ROOM MODALS (Laptop Workspace, Bookshelf, Stats, Compare, QR) */}
      <InteractiveRoomModals />
    </div>
  );
};
