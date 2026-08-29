import React, { useState, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CanvasWrapper } from './CanvasWrapper';
import { Building3D } from './Building3D';
import { HostelCamera } from './HostelCamera';
import { useHostelStore } from '../../stores/hostelStore';
import { calculateBuildingDimensions } from './layoutEngine';
import { GlassButton } from '../ui';

/**
 * HeroSpatialStage - Premium Architectural 3D Stage for HostelHub Hero
 * 
 * Presents the procedural 3D digital twin as a floating architectural model
 * in a borderless spatial lighting environment with floating glass labels,
 * camera transitions, day/night lighting, and room interactions.
 */
export const HeroSpatialStage = ({
  onSelectRoom = () => {},
  className = ''
}) => {
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
    isExplodedView,
    toggleExplodedView,
    lightingMode,
    toggleLightingMode,
    qualityMode,
    setQualityMode,
    resetView,
    getCurrentHostel,
    getCurrentRoom,
    getAllRoomsForCurrentHostel
  } = useHostelStore();

  const [isFullscreen, setIsFullscreen] = useState(false);
  const [hoveredRoom, setHoveredRoom] = useState(null);

  const currentHostel = getCurrentHostel();
  const currentRoom = getCurrentRoom();
  const allRooms = getAllRoomsForCurrentHostel();

  const totalFloors = currentHostel?.floors?.length || 1;
  const totalRooms = allRooms.length || 0;
  const hasCentralSpace = currentHostel?.layoutConfig?.centralSpace?.enabled !== false;

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

  const handleRoomClick = (room) => {
    setSelectedRoomId(room.id);
    if (onSelectRoom) {
      onSelectRoom(room);
    }
  };

  const handleCourtyardClick = () => {
    setSelectedRoomId(null);
    setCameraMode(cameraMode === 'courtyard' ? 'overview' : 'courtyard');
  };

  return (
    <div
      id="hostel-3d-stage"
      className={`relative w-full rounded-3xl overflow-hidden transition-all duration-300 ${
        isFullscreen
          ? 'fixed inset-3 sm:inset-6 z-50 rounded-3xl border border-white/80 dark:border-primary-fixed/30 shadow-2xl glass-floating flex flex-col'
          : `h-[420px] sm:h-[500px] lg:h-[560px] ${className}`
      }`}
    >
      {/* Atmospheric Spatial Lighting Pedestal & Gradient Base */}
      <div className="absolute inset-0 spatial-stage-pedestal pointer-events-none transition-colors duration-500" />
      <div
        className={`absolute inset-0 transition-opacity duration-500 pointer-events-none ${
          lightingMode === 'night'
            ? 'bg-gradient-to-b from-[#061815]/90 via-[#08221e]/80 to-[#041210]/95'
            : 'bg-gradient-to-b from-[#f2f8f6]/90 via-[#eaf4f1]/80 to-[#e4f0ed]/95'
        }`}
      />

      {/* Subtle Spatial Border Hairline */}
      <div className="absolute inset-0 rounded-3xl border border-white/60 dark:border-primary-fixed/15 pointer-events-none z-10" />

      {/* 3D WebGL Canvas Wrapper with WebGL Architectural SVG Fallback */}
      <div className="w-full h-full relative z-0">
        <CanvasWrapper
          key={`hero-canvas-${selectedHostelId}-${lightingMode}`}
          className="w-full h-full cursor-grab active:cursor-grabbing"
          camera={{ position: [0, 3.0, 7.8], fov: 42 }}
          disableOnMobile={false}
          fallback={
            <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center">
              <div className="w-16 h-16 rounded-2xl glass-panel flex items-center justify-center text-primary mb-3 shadow-md">
                <span className="material-symbols-outlined text-3xl">apartment</span>
              </div>
              <h3 className="font-headline-sm text-sm font-bold text-[#0e2724] dark:text-[#f0faf8]">
                {currentHostel.name} • 3D Digital Twin
              </h3>
              <p className="text-xs text-[#33534d] dark:text-[#b0d2cc] mt-1 max-w-xs">
                Interactive spatial preview. {totalRooms} rooms across {totalFloors} floors.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-2 mt-4">
                {allRooms.slice(0, 6).map((r) => (
                  <button
                    key={r.id}
                    type="button"
                    onClick={() => handleRoomClick(r)}
                    className="px-3 py-1.5 rounded-xl glass-panel text-xs font-bold text-primary hover:bg-primary hover:text-white transition-colors"
                  >
                    Room {r.roomNumber} ({r.status})
                  </button>
                ))}
              </div>
            </div>
          }
        >
          {/* Spatial Stage Lighting (Solid, Architectural, Warm interior highlights) */}
          <ambientLight intensity={lightingMode === 'night' ? 0.65 : 1.15} />
          <directionalLight
            position={[8, 12, 7]}
            intensity={lightingMode === 'night' ? 0.95 : 1.6}
            color={lightingMode === 'night' ? '#c4eee8' : '#ffffff'}
            castShadow
            shadow-mapSize={[512, 512]}
            shadow-bias={-0.0005}
          />
          <directionalLight
            position={[-7, 5, -6]}
            intensity={lightingMode === 'night' ? 0.8 : 0.65}
            color="#89f5e7"
          />
          <pointLight
            position={[0, 2.5, 3]}
            intensity={lightingMode === 'night' ? 0.8 : 0.4}
            color={lightingMode === 'night' ? '#ffe0ca' : '#ffebd8'}
          />

          {/* Unified Architectural Camera */}
          <HostelCamera
            cameraMode={effectiveCameraMode}
            selectedFloorNumber={selectedFloorNumber}
            selectedRoom={currentRoom}
            isExplodedView={isExplodedView}
            floorHeight={1.05}
            buildingDims={buildingDims}
          />

          {/* Procedural 3D Building Star */}
          <Building3D
            hostelData={currentHostel}
            selectedFloorNumber={selectedFloorNumber}
            selectedRoomId={selectedRoomId}
            onSelectRoom={handleRoomClick}
            isExplodedView={isExplodedView}
            lightingMode={lightingMode}
            qualityMode={qualityMode}
          />
        </CanvasWrapper>
      </div>

      {/* =================================================== */}
      {/* FLOATING SPATIAL INFORMATION TAGS (2-3 AT A TIME)   */}
      {/* =================================================== */}
      <div className="absolute top-4 left-4 z-10 pointer-events-none flex flex-col gap-2">
        {/* Badge 1: 3D DIGITAL TWIN + Total Rooms */}
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="glass-panel px-3 py-1.5 rounded-full border border-white/70 dark:border-primary-fixed/20 shadow-md backdrop-blur-md flex items-center gap-2 pointer-events-auto"
        >
          <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
          <span className="text-[11px] font-extrabold tracking-wider text-[#0e2724] dark:text-[#f0faf8] uppercase">
            3D DIGITAL TWIN
          </span>
          <span className="text-[10px] text-primary font-bold px-1.5 py-0.5 rounded-md bg-primary/10">
            {totalRooms} ROOMS
          </span>
        </motion.div>

        {/* Badge 2: Total Floors */}
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="glass-panel px-3 py-1 rounded-full border border-white/60 dark:border-primary-fixed/15 shadow-sm backdrop-blur-md text-[10.5px] font-bold text-[#2d4d47] dark:text-[#b4d6d0] pointer-events-auto flex items-center gap-1.5 w-fit"
        >
          <span className="material-symbols-outlined text-primary text-[14px]">layers</span>
          <span>{totalFloors} FLOORS</span>
        </motion.div>

        {/* Badge 3: Central Study Space (Clickable to zoom) */}
        {hasCentralSpace && (
          <motion.button
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.3 }}
            type="button"
            onClick={handleCourtyardClick}
            className={`px-3 py-1 rounded-full border text-[10.5px] font-bold transition-all shadow-sm backdrop-blur-md flex items-center gap-1.5 pointer-events-auto cursor-pointer ${
              cameraMode === 'courtyard' && !selectedRoomId
                ? 'bg-primary text-white border-primary shadow-md'
                : 'glass-panel text-[#2d4d47] dark:text-[#b4d6d0] hover:text-primary hover:border-primary/40'
            }`}
          >
            <span className="material-symbols-outlined text-primary text-[14px]">park</span>
            <span>CENTRAL STUDY SPACE</span>
          </motion.button>
        )}
      </div>

      {/* Top Right: Selected Room Live Quick Pill */}
      {currentRoom && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute top-4 right-4 z-10 pointer-events-auto"
        >
          <div className="glass-floating px-3.5 py-2 rounded-2xl border border-primary/40 shadow-xl flex items-center gap-3 backdrop-blur-xl">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse shadow-sm"></div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-xs text-[#0e2724] dark:text-[#f0faf8]">
                  ROOM {currentRoom.roomNumber}
                </span>
                <span className="text-[9.5px] uppercase font-bold text-primary px-1.5 py-0.2 rounded bg-primary/10">
                  {currentRoom.status}
                </span>
              </div>
              <span className="text-[10px] text-[#42605b] dark:text-[#a0c5bf] font-medium block">
                Floor {currentRoom.floorNumber} • {currentRoom.roomType || 'Single'}
              </span>
            </div>
            <button
              type="button"
              onClick={() => setSelectedRoomId(null)}
              className="p-1 rounded-lg hover:bg-black/5 dark:hover:bg-white/10 text-[#42605b] dark:text-[#a0c5bf] hover:text-primary transition-colors"
              title="Exit Room Focus"
            >
              <span className="material-symbols-outlined text-[16px]">close</span>
            </button>
          </div>
        </motion.div>
      )}

      {/* =================================================== */}
      {/* BOTTOM UNIFIED SPATIAL CONTROLS DOCK                */}
      {/* =================================================== */}
      <div className="absolute bottom-3 inset-x-3 z-10 pointer-events-none flex items-center justify-between gap-2 flex-wrap">
        {/* Left: Hostel Configuration Selector */}
        <div className="flex items-center gap-1 p-1 glass-floating rounded-2xl border border-white/70 dark:border-primary-fixed/20 shadow-md backdrop-blur-xl pointer-events-auto overflow-x-auto scrollbar-none">
          {hostels.map((h) => {
            const isSelected = selectedHostelId === h.id;
            return (
              <button
                key={h.id}
                type="button"
                onClick={() => setSelectedHostelId(h.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
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

        {/* Center / Right: Spatial Actions (Floor, Exploded, Day/Night, Reset, Fullscreen) */}
        <div className="flex items-center gap-1.5 p-1 glass-floating rounded-2xl border border-white/70 dark:border-primary-fixed/20 shadow-md backdrop-blur-xl pointer-events-auto">
          {/* Floor Selector Dropdown */}
          <select
            value={selectedFloorNumber === null ? '' : selectedFloorNumber}
            onChange={(e) =>
              setSelectedFloorNumber(
                e.target.value === '' ? null : parseInt(e.target.value, 10)
              )
            }
            className="px-2.5 py-1.5 glass-panel border border-white/60 dark:border-primary-fixed/20 rounded-xl text-xs font-bold text-[#0e2724] dark:text-[#f0faf8] focus:outline-none cursor-pointer shadow-2xs"
            title="Focus Floor"
          >
            <option value="">All Floors ({totalFloors})</option>
            {currentHostel.floors?.map((fl) => (
              <option key={fl.id} value={fl.floorNumber}>
                Floor {fl.floorNumber} ({fl.rooms?.length || 0} rooms)
              </option>
            ))}
          </select>

          {/* Exploded View Toggle */}
          <button
            type="button"
            onClick={toggleExplodedView}
            className={`p-1.5 sm:px-2.5 sm:py-1.5 rounded-xl text-xs font-bold flex items-center gap-1 transition-all ${
              isExplodedView
                ? 'bg-primary text-white shadow-xs'
                : 'text-[#2b4742] dark:text-[#c4dfda] hover:text-primary hover:bg-white/40 dark:hover:bg-white/5'
            }`}
            title={isExplodedView ? 'Return to Assembled Model' : 'Explode Floor Levels'}
          >
            <span className="material-symbols-outlined text-[17px]">
              {isExplodedView ? 'unfold_less' : 'unfold_more'}
            </span>
            <span className="hidden md:inline">{isExplodedView ? 'Assembled' : 'Explode'}</span>
          </button>

          {/* Day / Night Mode Toggle */}
          <button
            type="button"
            onClick={toggleLightingMode}
            className="p-1.5 rounded-xl text-[#2b4742] dark:text-[#c4dfda] hover:text-primary hover:bg-white/40 dark:hover:bg-white/5 transition-all flex items-center justify-center"
            title={lightingMode === 'night' ? 'Daylight Mode' : 'Cinematic Night Lighting'}
          >
            <span className="material-symbols-outlined text-[18px]">
              {lightingMode === 'night' ? 'dark_mode' : 'light_mode'}
            </span>
          </button>

          {/* Reset Camera View */}
          <button
            type="button"
            onClick={resetView}
            className="p-1.5 rounded-xl text-[#2b4742] dark:text-[#c4dfda] hover:text-primary hover:bg-white/40 dark:hover:bg-white/5 transition-all flex items-center justify-center"
            title="Reset 3D Camera Overview"
          >
            <span className="material-symbols-outlined text-[18px]">center_focus_strong</span>
          </button>

          {/* Fullscreen Spatial Expand */}
          <button
            type="button"
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-1.5 rounded-xl text-[#2b4742] dark:text-[#c4dfda] hover:text-primary hover:bg-white/40 dark:hover:bg-white/5 transition-all flex items-center justify-center"
            title={isFullscreen ? 'Exit Fullscreen' : 'Expand Spatial Stage'}
          >
            <span className="material-symbols-outlined text-[18px]">
              {isFullscreen ? 'close_fullscreen' : 'open_in_full'}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};
