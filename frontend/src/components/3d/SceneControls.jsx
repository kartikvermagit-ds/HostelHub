import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * Overlay Controls for Hostel Selection, Reset View, Replay Intro & Room Inspector
 */
export const SceneControls = ({
  hostels = {},
  selectedHostelKey = 'hostel-4',
  onSelectHostel = () => {},
  selectedRoom = null,
  onCloseRoom = () => {},
  onResetView = () => {},
  onReplayIntro = () => {},
  isPlayingIntro = false
}) => {
  return (
    <div className="absolute inset-0 pointer-events-none p-3 sm:p-4 flex flex-col justify-between z-20">
      {/* Top Controls: Hostel Switcher & Action Buttons */}
      <div className="flex flex-wrap items-center justify-between gap-2 pointer-events-auto">
        {/* Hostel Selector Pills */}
        <div className="flex items-center gap-1.5 p-1 bg-surface-container-lowest/90 backdrop-blur-md rounded-xl border border-surface-border shadow-sm">
          <span className="text-[11px] font-bold text-on-surface-variant px-2 hidden sm:inline">
            Hostel:
          </span>
          {Object.keys(hostels).map((key) => {
            const h = hostels[key];
            const isSelected = selectedHostelKey === key;
            return (
              <button
                key={key}
                type="button"
                onClick={() => onSelectHostel(key)}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                  isSelected
                    ? 'bg-primary text-on-primary shadow-sm'
                    : 'text-on-surface hover:bg-surface-container-low'
                }`}
              >
                {h.name}
              </button>
            );
          })}
        </div>

        {/* View Actions (Reset View & Replay) */}
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={onResetView}
            className="px-2.5 py-1 rounded-xl bg-surface-container-lowest/90 backdrop-blur-md border border-surface-border text-on-surface hover:text-primary text-xs font-semibold flex items-center gap-1 shadow-sm transition-all active:scale-95"
            title="Reset Camera to Overview"
          >
            <span className="material-symbols-outlined text-[16px]">center_focus_strong</span>
            <span className="hidden sm:inline">Reset View</span>
          </button>

          <button
            type="button"
            onClick={onReplayIntro}
            disabled={isPlayingIntro}
            className="px-2.5 py-1 rounded-xl bg-surface-container-lowest/90 backdrop-blur-md border border-surface-border text-on-surface hover:text-primary text-xs font-semibold flex items-center gap-1 shadow-sm transition-all active:scale-95 disabled:opacity-50"
            title="Replay Book Opening Animation"
          >
            <span className="material-symbols-outlined text-[16px]">replay</span>
            <span className="hidden sm:inline">Replay Story</span>
          </button>
        </div>
      </div>

      {/* Bottom Floating Room Inspector Modal */}
      <AnimatePresence>
        {selectedRoom && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.25 }}
            className="pointer-events-auto max-w-sm w-full bg-surface-container-lowest/95 backdrop-blur-md rounded-2xl border border-surface-border p-4 shadow-xl self-center sm:self-start"
          >
            {/* Header */}
            <div className="flex items-start justify-between gap-3 border-b border-surface-border pb-3 mb-3">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-headline-sm text-base font-bold text-on-surface">
                    Room {selectedRoom.id}
                  </h3>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      selectedRoom.status === 'available'
                        ? 'bg-emerald-100 text-emerald-800'
                        : selectedRoom.status === 'maintenance'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-primary/10 text-primary'
                    }`}
                  >
                    {selectedRoom.status}
                  </span>
                </div>
                <p className="text-xs text-on-surface-variant mt-0.5">
                  {selectedRoom.hostel} • Floor {selectedRoom.floor} • {selectedRoom.wing}
                </p>
              </div>

              <button
                type="button"
                onClick={onCloseRoom}
                className="w-7 h-7 rounded-full bg-surface-container-low hover:bg-surface-container flex items-center justify-center text-on-surface-variant transition-colors"
                title="Close Room Inspection"
              >
                <span className="material-symbols-outlined text-[16px]">close</span>
              </button>
            </div>

            {/* Content Details */}
            <div className="space-y-2 text-xs">
              {selectedRoom.occupants && selectedRoom.occupants.length > 0 ? (
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary text-[18px]">group</span>
                  <span className="text-on-surface font-semibold">
                    {selectedRoom.occupants.join(', ')}
                  </span>
                  <span className="text-on-surface-variant">({selectedRoom.branch})</span>
                </div>
              ) : (
                <div className="flex items-center gap-2 text-emerald-600 font-semibold">
                  <span className="material-symbols-outlined text-[18px]">check_circle</span>
                  <span>{selectedRoom.branch || 'Open for booking / discussion'}</span>
                </div>
              )}

              <div className="flex items-center gap-2 text-on-surface-variant">
                <span className="material-symbols-outlined text-secondary text-[18px]">menu_book</span>
                <span>
                  <strong className="text-on-surface">{selectedRoom.sharedNotesCount}</strong> notes & solved papers shared
                </span>
              </div>

              {selectedRoom.activeStudyGroup && (
                <div className="p-2 rounded-lg bg-surface-container-low text-on-surface font-medium">
                  <span className="text-primary font-bold">Focus: </span>
                  {selectedRoom.activeStudyGroup}
                </div>
              )}
            </div>

            {/* Bottom Actions */}
            <div className="mt-3.5 pt-3 border-t border-surface-border flex items-center justify-between gap-2">
              <span className="text-[11px] text-on-surface-variant">
                Interior Revealed in 3D
              </span>
              <button
                type="button"
                onClick={onCloseRoom}
                className="px-3 py-1.5 rounded-lg bg-primary text-on-primary font-semibold text-xs hover:opacity-90 transition-opacity shadow-sm"
              >
                Back to Overview
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bottom Hint Banner */}
      {!selectedRoom && (
        <div className="pointer-events-none flex justify-center pb-1">
          <span className="px-3 py-1 rounded-full bg-surface-container-lowest/85 backdrop-blur-md border border-surface-border text-[11px] font-medium text-on-surface-variant shadow-sm flex items-center gap-1.5">
            <span className="material-symbols-outlined text-primary text-[14px]">touch_app</span>
            <span>Click any room door to inspect interior & study resources</span>
          </span>
        </div>
      )}
    </div>
  );
};
